const http = require("http");

function testEndpoint(path, method, payload) {
  return new Promise((resolve) => {
    const data = payload ? JSON.stringify(payload) : "";
    const headers = {};
    if (payload) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(data);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method,
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          console.log(`\n--- TEST ${method} ${path} ---`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Content-Type: ${res.headers["content-type"]}`);
          console.log(`Body:\n${body}`);
          resolve({ status: res.statusCode, headers: res.headers, body });
        });
      }
    );

    req.on("error", (e) => {
      console.error(`Error on ${method} ${path}:`, e.message);
      resolve(null);
    });

    if (payload) req.write(data);
    req.end();
  });
}

async function run() {
  const postRes = await testEndpoint("/api/gifts", "POST", {
    recipientName: "Shalini",
    message: "Happy Birthday Shalini!",
    theme: "sky-clouds",
  });

  if (postRes && postRes.body) {
    const parsed = JSON.parse(postRes.body);
    const giftId = parsed.gift.id;
    const slug = parsed.gift.slug;

    await testEndpoint(`/api/gifts/${giftId}`, "PUT", {
      letter: "Dear Shalini,\n\nHappy 25th Birthday! Wishing you warmth and laughter.",
      wishes: [{ text: "Endless happiness!", order: 0 }],
    });

    await testEndpoint(`/api/gifts?slug=${slug}`, "GET");
  }
}

run();
