const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");

// update specific user
async function resetTokens(refresh_token) {
  // Find specific user in the database and update it
  const redirectUrl = "http://localhost:3001/oauth";
  const client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );
  var token;
  try {
    await client.setCredentials({ refresh_token: refresh_token });
    const tokens = await client.refreshAccessToken();
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

module.exports = resetTokens; // Export the function
