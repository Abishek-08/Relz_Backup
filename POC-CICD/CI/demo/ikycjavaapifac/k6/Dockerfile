
FROM grafana/k6:0.49.0
COPY test.js /test.js
ENTRYPOINT ["k6", "run", "/test.js"]
