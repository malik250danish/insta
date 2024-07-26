// const express = require("express");
// const axios = require("axios");
// const app = express();
// const port = 3000;

// const clientId = "450809677823711";
// const clientSecret = "e16188c16767af59fc47614c79853133";
// const redirectUri = "http://localhost:3000/auth";

// app.get("/auth", (req, res) => {
//   const authCode = req.query.code;
//   console.log("Authorization Code:", authCode);

//   axios
//     .post("https://api.instagram.com/oauth/access_token", {
//       client_id: clientId,
//       client_secret: clientSecret,
//       grant_type: "authorization_code",
//       redirect_uri: redirectUri,
//       code: authCode,
//     })
//     .then((response) => {
//       const accessToken = response.data.access_token;
//       console.log("Access Token:", accessToken);
//       res.send(`Access Token: ${accessToken}`);
//     })
//     .catch((error) => {
//       console.error("Error fetching access token:", error.response.data);
//       res.send("Error fetching access token. Check your console.");
//     });
// });

// app.get("/", (req, res) => {
//   res.send(`
//     <a href="https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code">
//       Authorize Instagram
//     </a>
//   `);
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// server.js
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const clientId = "450809677823711";
const clientSecret = "e16188c16767af59fc47614c79853133";
const redirectUri = "https://insta-swart.vercel.app/";

app.use(express.static("public"));

app.get("/auth", async (req, res) => {
  const authCode = req.query.code;
  console.log("Authorization Code:", authCode);

  try {
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code: authCode,
        },
      }
    );
    const accessToken = response.data.access_token;
    const userId = response.data.user_id;

    console.log("Access Token:", accessToken);
    console.log("User ID:", userId);

    // Fetch user's media
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/${userId}/media`,
      {
        params: {
          fields: "id,caption,media_type,media_url,thumbnail_url,permalink",
          access_token: accessToken,
        },
      }
    );

    const userMedia = mediaResponse.data.data;

    // Send user media to frontend
    res.send(`
      <h1>User Media</h1>
      ${userMedia
        .map(
          (media) => `
        <div>
          ${
            media.media_type === "IMAGE" ||
            media.media_type === "CAROUSEL_ALBUM"
              ? `<img src="${media.media_url}" alt="${media.caption}" width="300" />`
              : ""
          }
          ${
            media.media_type === "VIDEO"
              ? `<video src="${media.media_url}" controls width="300"></video>`
              : ""
          }
          <p>${media.caption || ""}</p>
          <a href="${media.permalink}" target="_blank">View on Instagram</a>
        </div>
      `
        )
        .join("")}
    `);
  } catch (error) {
    console.error(
      "Error fetching access token or user media:",
      error.response ? error.response.data : error.message
    );
    res.send("Error fetching access token or user media. Check your console.");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
