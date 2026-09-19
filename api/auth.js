const https = require("https");

function send(res, status, body, contentType = "text/html; charset=utf-8") {
  res.statusCode = status;
  res.setHeader("Content-Type", contentType);
  res.end(body);
}

function requestToken(code) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID || "",
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET || "",
      code
    }).toString();
    const request = https.request({
      hostname: "github.com",
      path: "/login/oauth/access_token",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", "Content-Length": Buffer.byteLength(body) }
    }, response => {
      let data = "";
      response.on("data", chunk => { data += chunk; });
      response.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.access_token) reject(new Error("GitHub did not return an access token."));
          else resolve(parsed.access_token);
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (!process.env.GITHUB_OAUTH_CLIENT_ID || !process.env.GITHUB_OAUTH_CLIENT_SECRET) {
    send(res, 500, "GitHub OAuth is not configured.");
    return;
  }

  if (url.pathname.endsWith("/callback")) {
    if (!url.searchParams.get("code")) {
      send(res, 400, "Missing GitHub OAuth code.");
      return;
    }
    try {
      const token = await requestToken(url.searchParams.get("code"));
      const payload = JSON.stringify({ token, provider: "github" }).replace(/</g, "\\u003c");
      send(res, 200, `<script>window.opener.postMessage(${payload}, window.location.origin); window.close();</script>`);
    } catch (error) {
      console.error("GitHub OAuth exchange failed:", error);
      send(res, 502, "GitHub OAuth exchange failed.");
    }
    return;
  }

  const callback = `${url.origin}${url.pathname}/callback`;
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", process.env.GITHUB_OAUTH_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", callback);
  authorize.searchParams.set("scope", "repo");
  res.statusCode = 302;
  res.setHeader("Location", authorize.toString());
  res.end();
};
