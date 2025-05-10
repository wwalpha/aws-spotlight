FROM public.ecr.aws/lambda/nodejs:22

COPY package.json $LAMBDA_TASK_ROOT
COPY dist $LAMBDA_TASK_ROOT

RUN echo package-lock=false > .npmrc
RUN npm install --omit=dev

CMD ["index.cloudtrail"]


