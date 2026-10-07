const http = require("http");

const port = 3000;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hello World from Node.js in Docker\n");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
