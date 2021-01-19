const awsServerlessExpress = require("aws-serverless-express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const express = require("express");
const cors = require("cors");
const providers = require("./providers.json");

const FAILURE_PROBABILITY = 0.5;

function randomFailuresMiddleware(_, res, next) {
  if (Math.random() > 1 - FAILURE_PROBABILITY) {
    res.setHeader("Content-Type", "text/plain");
    res.writeHead(500, res.headers);
    return res.end("#fail");
  }
  next();
}

const app = express();
const port = 3000;
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(randomFailuresMiddleware);
app.use(cors());
app.options("*", cors());

app.get("/providers/:id", (req, res) => {
  const bills = providers[req.params.id];
  if (!bills) return res.status(404).end();
  res.send(bills);
});

app.listen(port, () =>
  console.log(`Providers server listening at http://localhost:${port}`)
);

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
