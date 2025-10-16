FROM denoland/deno:alpine-2.4.4
WORKDIR /app
COPY . .
RUN deno cache app-run.js || true
EXPOSE 5000
CMD ["run", "--allow-env", "--allow-net", "--allow-read", "app-run.js"]