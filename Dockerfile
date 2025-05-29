# Define ARG(default)
ARG CONTAINER_REGISTRY=""

## build
FROM ${CONTAINER_REGISTRY}node:22.16.0-slim AS builder
WORKDIR /work

# install packages
COPY package*.json ./
RUN npm ci

# compole TypeScript to JS
COPY src tsconfig.json ./
RUN npm run build

## run
FROM ${CONTAINER_REGISTRY}node:22.16.0-slim AS runner
WORKDIR /work

# for lambda
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter 

# Listen port
ENV PORT 8080
EXPOSE 8080

# install paclages
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# copy build result from builder
COPY --from=builder /work/dist ./dist

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD ["node", "./dist/index.js"]
