FROM node:12-buster-slim
LABEL maintainer=sandro.spadaro@gmail.com \
    license=ISC

ENV PORT=5000
ENV SPEED=10000  
ENV CONCURRENCY=10
ENV DROP_FREQUENCY=0
ENV CLOSE=false
ENV SLEEP=0

COPY * ./
RUN npm install crapify -g
ENTRYPOINT crapify start --port=${PORT} \
    --speed=${SPEED} \
    --concurrency=${CONCURRENCY} \
    --drop-frequency=${DROP_FREQUENCY} \
    --close=${CLOSE} \
    --sleep=${SLEEP}
