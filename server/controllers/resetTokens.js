const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID); // might not need

// update tokens
async function resetTokens(refresh_token) {
  // get google auth setup
  const redirectUrl = "http://localhost:3001/oauth";
  const client = new OAuth2Client( // sets auth client
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );
  var token;
  // tries to refresh tokens
  try {
    await client.setCredentials({ refresh_token: refresh_token }); // sets credentials with the google auth client
    const tokens = await client.refreshAccessToken(); // gets refreshed tokens
    token = tokens;
    return {
      success: true,
      credentials: token,
      message: "Credentials set",
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to use refresh token. Error: ${err}`,
    };
  }
}

// function to get user Data using id Token
async function getUserData(id_token) {
  try {
    const userTicket = await oAuth2Client.verifyIdToken({
      // verifys token with google auth client
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    });
    const userInfo = userTicket.getPayload();
    return { userInfo: userInfo, status: 200 };
  } catch (err) {
    console.log(`There was an error getting ID token. Error: ${err}`);
    return {
      status: 404,
      message: `There was an error getting ID token. Error: ${err}`,
    };
  }
}

module.exports = { resetTokens, getUserData };
