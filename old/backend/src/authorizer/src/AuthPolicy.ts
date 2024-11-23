type Effect = 'Allow' | 'Deny';

type Method = {
  resourceArn: string;
  conditions: string | null;
};

/**
 * AuthPolicy receives a set of allowed and denied methods and generates a valid
 * AWS policy for the API Gateway authorizer. The constructor receives the calling
 * user principal, the AWS account ID of the API owner, and an apiOptions object.
 * The apiOptions can contain an API Gateway RestApi Id, a region for the RestApi, and a
 * stage that calls should be allowed/denied for. For example
 * {
 *   restApiId: "xxxxxxxxxx",
 *   region: "us-east-1",
 *   stage: "dev"
 * }
 *
 * var testPolicy = new AuthPolicy("[principal user identifier]", "[AWS account id]", apiOptions);
 * testPolicy.allowMethod(AuthPolicy.HttpVerb.GET, "/users/username");
 * testPolicy.denyMethod(AuthPolicy.HttpVerb.POST, "/pets");
 * context.succeed(testPolicy.build());
 *
 * @class AuthPolicy
 * @constructor
 */
class AuthPolicy {
  HttpVerb = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    HEAD: 'HEAD',
    DELETE: 'DELETE',
    OPTIONS: 'OPTIONS',
    ALL: '*',
  };

  /**
   * The AWS account id the policy will be generated for. This is used to create the method ARNs.
   */
  private awsAccountId: string = 'root';

  /**
   * The principal used for the policy, this should be a unique identifier for the end user.
   */
  private principalId: string = '*';

  /**
   * The policy version used for the evaluation. This should always be "2012-10-17"
   */
  private version: string = '2012-10-17';

  /**
   * The regular expression used to validate resource paths for the policy
   */
  private pathRegex: RegExp = new RegExp('^[/.a-zA-Z0-9-*]+$');

  private allowMethods: Method[] = [];
  private denyMethods: Method[] = [];
  private restApiId: string = '*';
  private region: string = '*';
  private stage: string = '*';

  AuthPolicy(principal: string, awsAccountId: string, apiOptions: any) {
    this.awsAccountId = awsAccountId;
    this.principalId = principal;

    if (apiOptions?.restApiId) {
      this.restApiId = apiOptions.restApiId;
    }
    if (apiOptions?.region) {
      this.region = apiOptions.region;
    }
    if (apiOptions?.stage) {
      this.stage = apiOptions.stage;
    }
  }

  /**
   * Adds a method to the internal lists of allowed or denied methods. Each object in
   * the internal list contains a resource ARN and a condition statement. The condition
   * statement can be null.
   *
   * @method addMethod
   * @param {String} The effect for the policy. This can only be "Allow" or "Deny".
   * @param {String} he HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {String} The resource path. For example "/pets"
   * @param {Object} The conditions object in the format specified by the AWS docs.
   * @return {void}
   */
  private addMethod = (effect: Effect, verb: string, resource: string, conditions: string | null): void => {
    if (verb != '*' && !this.HttpVerb.hasOwnProperty(verb)) {
      throw new Error('Invalid HTTP verb ' + verb + '. Allowed verbs in AuthPolicy.HttpVerb');
    }

    if (!this.pathRegex.test(resource)) {
      throw new Error('Invalid resource path: ' + resource + '. Path should match ' + this.pathRegex);
    }

    let cleanedResource = resource;

    if (resource.substring(0, 1) == '/') {
      cleanedResource = resource.substring(1, resource.length);
    }

    const resourceArn =
      'arn:aws:execute-api:' +
      this.region +
      ':' +
      this.awsAccountId +
      ':' +
      this.restApiId +
      '/' +
      this.stage +
      '/' +
      verb +
      '/' +
      cleanedResource;

    if (effect.toLowerCase() == 'allow') {
      this.allowMethods.push({
        resourceArn: resourceArn,
        conditions: conditions,
      });
    } else if (effect.toLowerCase() == 'deny') {
      this.denyMethods.push({
        resourceArn: resourceArn,
        conditions: conditions,
      });
    }
  };

  /**
   * Returns an empty statement object prepopulated with the correct action and the
   * desired effect.
   *
   * @method getEmptyStatement
   * @param {String} The effect of the statement, this can be "Allow" or "Deny"
   * @return {Object} An empty statement object with the Action, Effect, and Resource
   *                  properties prepopulated.
   */
  private getEmptyStatement = (effect: Effect): Record<string, any> => {
    const effectLower = effect.substring(0, 1).toUpperCase() + effect.substring(1, effect.length).toLowerCase();
    const statement: Record<string, any> = {};

    statement.Action = 'execute-api:Invoke';
    statement.Effect = effectLower;
    statement.Resource = [];

    return statement;
  };

  /**
   * This function loops over an array of objects containing a resourceArn and
   * conditions statement and generates the array of statements for the policy.
   *
   * @method getStatementsForEffect
   * @param {String} The desired effect. This can be "Allow" or "Deny"
   * @param {Array} An array of method objects containing the ARN of the resource
   *                and the conditions for the policy
   * @return {Array} an array of formatted statements for the policy.
   */
  private getStatementsForEffect = (effect: Effect, methods: Method[]) => {
    var statements = [];

    if (methods.length > 0) {
      var statement = this.getEmptyStatement(effect);

      for (var i = 0; i < methods.length; i++) {
        var curMethod = methods[i];
        if (curMethod.conditions === null || curMethod.conditions.length === 0) {
          statement.Resource.push(curMethod.resourceArn);
        } else {
          var conditionalStatement = this.getEmptyStatement(effect);
          conditionalStatement.Resource.push(curMethod.resourceArn);
          conditionalStatement.Condition = curMethod.conditions;
          statements.push(conditionalStatement);
        }
      }

      if (statement.Resource !== null && statement.Resource.length > 0) {
        statements.push(statement);
      }
    }

    return statements;
  };

  // constructor: AuthPolicy,

  /**
   * Adds an allow "*" statement to the policy.
   *
   * @method allowAllMethods
   */
  allowAllMethods = () => {
    this.addMethod('Allow', '*', '*', null);
  };

  /**
   * Adds a deny "*" statement to the policy.
   *
   * @method denyAllMethods
   */
  denyAllMethods = () => {
    this.addMethod('Deny', '*', '*', null);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
   * methods for the policy
   *
   * @method allowMethod
   * @param {String} The HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} The resource path. For example "/pets"
   * @return {void}
   */
  allowMethod = (verb: string, resource: string): void => {
    this.addMethod('Allow', verb, resource, null);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of denied
   * methods for the policy
   *
   * @method denyMethod
   * @param {String} The HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} The resource path. For example "/pets"
   * @return {void}
   */
  denyMethod = (verb: string, resource: string): void => {
    this.addMethod('Deny', verb, resource, null);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
   * methods and includes a condition for the policy statement. More on AWS policy
   * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
   *
   * @method allowMethodWithConditions
   * @param {String} The HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} The resource path. For example "/pets"
   * @param {Object} The conditions object in the format specified by the AWS docs
   * @return {void}
   */
  allowMethodWithConditions = (verb: string, resource: string, conditions: string | null) => {
    this.addMethod('Allow', verb, resource, conditions);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of denied
   * methods and includes a condition for the policy statement. More on AWS policy
   * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
   *
   * @method denyMethodWithConditions
   * @param {String} The HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} The resource path. For example "/pets"
   * @param {Object} The conditions object in the format specified by the AWS docs
   * @return {void}
   */
  denyMethodWithConditions = (verb: string, resource: string, conditions: string) => {
    this.addMethod('Deny', verb, resource, conditions);
  };

  /**
   * Generates the policy document based on the internal lists of allowed and denied
   * conditions. This will generate a policy with two main statements for the effect:
   * one statement for Allow and one statement for Deny.
   * Methods that includes conditions will have their own statement in the policy.
   *
   * @method build
   * @return {Object} The policy object that can be serialized to JSON.
   */
  build = () => {
    if (
      (!this.allowMethods || this.allowMethods.length === 0) &&
      (!this.denyMethods || this.denyMethods.length === 0)
    ) {
      throw new Error('No statements defined for the policy');
    }

    const policy: any = {};
    policy.principalId = this.principalId;
    const doc: any = {};
    doc.Version = this.version;
    doc.Statement = [];

    doc.Statement = doc.Statement.concat(this.getStatementsForEffect('Allow', this.allowMethods));
    doc.Statement = doc.Statement.concat(this.getStatementsForEffect('Deny', this.denyMethods));

    policy.policyDocument = doc;

    return policy;
  };
}
