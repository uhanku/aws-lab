import http from 'http';
import os from 'os';


async function metadata(path) {
  try {
    const token = await fetch("http://169.254.169.254/latest/api/token", {
      method: "PUT",
      headers: { "X-aws-ec2-metadata-token-ttl-seconds": "21600" }
    }).then(r => r.text());

    return await fetch(`http://169.254.169.254/latest/meta-data/${path}`, {
      headers: { "X-aws-ec2-metadata-token": token }
    }).then(r => r.text());
  } catch {
    return "unknown";
  }
}

let instanceId = "unknown";
let az = "unknown";

async function init() {
  instanceId = await metadata("instance-id");
  az = await metadata("placement/availability-zone");
}

function burnCpu(ms = 500) {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) {
    x += Math.sqrt(Math.random() * 100000);
  }
  return x;
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok\n");
  }

  if (req.url.startsWith("/cpu")) {
    burnCpu(500);
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(`cpu load from ${instanceId} ${az} ${os.hostname()}\n`);
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`hello from ${instanceId} ${az} ${os.hostname()}\n`);
});

init().then(() => {
  server.listen(80, "0.0.0.0", () => {
    console.log("aws-lab app listening on port 80");
  });
});