const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const processData = (fileName) => {
  // Define the source ZIP file and the destination folder
  const zipFilePath = path.join(__dirname + "/../uploads/", fileName); // Change this to your ZIP file
  const destinationFolder = path.join(__dirname + "/../", "published"); // Change this to your desired extraction folder

  // Create the destination folder if it doesn't exist
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  // Unzip the file
  fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: destinationFolder }))
    .on("close", () => {
      console.log("Extraction complete!");
    })
    .on("error", (err) => {
      console.error("Error during extraction:", err);
    });
};

export default processData;
