const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const clientId = "450809677823711";
const clientSecret = "e16188c16767af59fc47614c79853133";
const redirectUri = "https://localhost:3000/auth";

app.get("/auth", (req, res) => {
  const authCode = req.query.code;
  console.log("Authorization Code:", authCode);

  axios
    .post("https://api.instagram.com/oauth/access_token", {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code: authCode,
    })
    .then((response) => {
      const accessToken = response.data.access_token;
      console.log("Access Token:", accessToken);
      res.send(`Access Token: ${accessToken}`);
    })
    .catch((error) => {
      console.error("Error fetching access token:", error.response.data);
      res.send("Error fetching access token. Check your console.");
    });
});

app.get("/", (req, res) => {
  res.send(`
    <a href="https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code">
      Authorize Instagram
    </a>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
