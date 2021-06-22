type Tokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
};

type RefreshSession = () => Promise<Tokens>;

export default class Credentials {
  private accessToken?: string | null;
  private idToken?: string | null;
  private refreshToken?: string | null;
  private storage: Storage;
  private username: string | null;
  private keyPrefix: string;

  constructor(prefix: string) {
    this.storage = window.sessionStorage;
    this.username = this.storage.getItem(`${prefix}.username`);

    this.keyPrefix = prefix;
  }

  /** refresh session tokens */
  refreshSession?: RefreshSession;

  getSession = async () => {
    if (this.username === null) {
      throw new Error('Username is null. Cannot retrieve a new session.');
    }

    // token valid
    if (!this.isTokenValid()) {
      if (!this.refreshSession || typeof this.refreshSession !== 'function') {
        throw new Error('Refresh session function not implemented');
      }

      // refresh session
      const session = await this.refreshSession();

      this.idToken = session.idToken;
      this.accessToken = session.accessToken;
      this.refreshToken = session.refreshToken;
    }

    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  };

  setUserTokens = (tokens: Tokens) => {
    this.idToken = tokens.idToken;
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    this.cacheTokens();
  };

  private cacheTokens = () => {
    const idTokenKey = `${this.keyPrefix}.${this.username}.idToken`;
    const accessTokenKey = `${this.keyPrefix}.${this.username}.accessToken`;
    const refreshTokenKey = `${this.keyPrefix}.${this.username}.refreshToken`;

    if (this.idToken) {
      this.storage.setItem(idTokenKey, this.idToken);
    }
    if (this.accessToken) {
      this.storage.setItem(accessTokenKey, this.accessToken);
    }
    if (this.refreshToken) {
      this.storage.setItem(refreshTokenKey, this.refreshToken);
    }
  };

  /** token validation */
  private isTokenValid = () => {
    // token not exist
    if (!this.accessToken) {
      return false;
    }

    const texts = this.accessToken.split('.');

    // token format error
    if (texts.length !== 2) {
      return false;
    }

    try {
      const token = JSON.parse(Buffer.from(texts[1], 'base64').toString());

      // token format error
      if (!token.exp) return false;

      // token expired
      return token.exp + 1000 < new Date().getTime();
    } catch (err) {
      // token format error
      return false;
    }
  };
}
