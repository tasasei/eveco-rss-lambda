## build
FROM node:18.16.0-alpine3.17 as builder
WORKDIR /work

# install packages
COPY package*.json ./
RUN npm install

# compole TypeScript to JS
COPY src tsconfig.json ./
RUN npm run build

## run
FROM public.ecr.aws/lambda/nodejs:20 as runner
WORKDIR ${LAMBDA_TASK_ROOT}

# install paclages
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# copy build result from builder
COPY --from=builder /work/dist/* ./
# COPY --from=builder /work/dist ./dist

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]
