const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
var express = require("express");
var router = express.Router();
const multer = require("multer");
const { log } = require("console");
const { listenerCount } = require("process");

const modifyFile = async (filePath, newName) => {
  try {
    console.log(filePath);
    const data = await new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          reject(err);
        }
        // Process the file data
        console.log("File read success");
        console.log(data);
        resolve(data);
      });
    });

    // Split the content into lines
    const lines = data.split(/(<.*?>)/g);
    lines.map((line) => {
      console.log(line);
    });

    // Modify lines containing "/*/static/"
    // \/: matches the literal /.
    // [^\/]+ matches any sequence of characters until a /, practically a wildcard
    // \/static\/ matches the literal /static/
    const modifiedLines = lines.map((line) => {
      return line.replace(/\/.*static\//g, `/${newName}/static/`); // replace the match with the replacement
    });

    // Join the modified lines back into a single string
    const modifiedData = modifiedLines.join("\n");
    console.log(`${newName}`);
    modifiedLines.map((line) => {
      console.log(line);
    });

    // Write the modified content back to the file
    await new Promise((resolve, reject) => {
      // Write the modified content back to the file
      fs.writeFile(filePath, modifiedData, "utf8", (err) => {
        if (err) {
          console.error("Error writing to the file:", err);
          reject(err);
        }
        console.log("File modified successfully!");
        resolve();
      });
    });
    await // logging and return
    console.log("file modified successfuly");
    return {
      success: true,
      message: "modifcation successful",
    };
  } catch (err) {
    console.log(`FIle modification Failed, Error: ${err}`);
    return {
      success: false,
      message: "Error modifying file",
      error: err.message,
    };
  }
};

const processData = async (buildFile, photoFile, newName) => {
  // Define the current file name and the new file name
  const currentDate = new Date().toISOString().split("T")[1]; // Format YYYY-MM-DD
  // Define the directory name
  const tempDir = path.join(__dirname + "/../uploads/", currentDate); // Change this to your desired directory name
  // Create a temp directory

  const currentFilePath = path.join(__dirname + "/../uploads/", buildFile); // Change this to your current file
  const currentPhotoPath = path.join(__dirname + "/../uploads/", photoFile); // Change this to your current file
  const newFilePath = path.join(tempDir + "/", buildFile); // Change this to your desired new file name
  const destinationFolder = path.join(__dirname + "/../", "published", "games"); // Change this to your desired extraction folder
  const photoDestination = path.join(__dirname + "/../published/photos");

  await new Promise((resolve, reject) => {
    fs.rename(
      currentPhotoPath,
      `${photoDestination}/${newName}` + ".png",
      (err) => {
        if (err) {
          console.error("Error renaming folder:", err);
          reject(err);
        } else {
          console.log("Folder renamed successfully!");
          resolve();
        }
      }
    );
  });

  try {
    await new Promise((resolve, reject) => {
      fs.mkdir(tempDir, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
          reject(err);
        } else {
          console.log("Directory created successfully!");
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      fs.rename(currentFilePath, newFilePath, (err) => {
        if (err) {
          console.error("Error renaming folder:", err);
          reject(err);
        } else {
          console.log("Folder renamed successfully!");
          resolve();
        }
      });
    });
    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }
    // Unzip the file, need the await so file deletion waits for unzip to finish
    // Define the source ZIP file and the destination folder
    const zipFilePath = path.join(tempDir + "/", buildFile); // Change this to your ZIP file
    await new Promise((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: tempDir + "/" }))
        .on("close", () => {
          console.log("Extraction complete!");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during extraction:", err);
          reject(err);
        });
    });
    await new Promise((resolve, reject) => {
      fs.unlink(zipFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          reject(err);
        } else {
          console.log("File deleted successfully!");
          resolve();
        }
      });
    });
    const files = await fs.promises.readdir(tempDir + "/"); // temp file locaiton reading files
    console.log(files);

    // process the index.html

    const filePath = path.join(tempDir, `${files}`, "index.html");
    await modifyFile(filePath, newName);
    // rename and move
    await new Promise((resolve, reject) => {
      fs.rename(
        tempDir + `/${files[0]}`,
        `${destinationFolder}/${newName}`,
        (err) => {
          if (err) {
            console.error("Error renaming folder:", err);
            reject(err);
          } else {
            console.log("Folder renamed successfully!");
            resolve();
          }
        }
      );
    });
    // Delete the file
    await new Promise((resolve, reject) => {
      fs.rmdir(tempDir, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          reject(err);
        } else {
          console.log("File deleted successfully!");
          resolve();
        }
      });
    });
  } catch (err) {
    // console.log(err);
    if (fs.existsSync(tempDir)) {
      // if temp dir still exists clean up mess
      try {
        await new Promise((resolve, reject) => {
          fs.rm(tempDir, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
              reject(err);
            } else {
              console.log("File deleted successfully!");
              resolve();
            }
          });
        });
      } catch (err) {
        console.log("Major problem with file system");
      }
    }
    return { status: 400, message: err };
  }
  console.log("everything is good");

  return { status: 200 };
};

const storage = multer.diskStorage({
  // This function creates a storage engine for Multer

  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "/../", "uploads")); // call back function
  },
  filename: (req, file, cb) => {
    const currentDate = new Date().toISOString().split("T")[1]; // Format YYYY-MM-DD
    // Prepend the date to the filename
    const newFileName = `${currentDate}-${file.originalname}`;
    cb(null, newFileName); // call back function, // (error, file destination)
  },
});

const upload = multer({ storage }); // creates a Multer instance configured to use the storage engine

// route

router.post(
  "/",
  upload.fields([{ name: "photo" }, { name: "build" }]),
  async (req, res) => {
    console.log("here we are");
    const id_token = req.cookies.id_token; // grabs access_token
    const refresh_token = req.cookies.refresh_token;
    if (!id_token && !refresh_token) {
      // just a basic check for being logged in, needs to be refactored though to be more thourough
      return res // error res
        .status(401)
        .json({ message: "Need to be logged in to upload a game" });
    }
    if (!req.files.photo || !req.files.build) {
      // after multer middleware, attaches file to req.file
      return res.status(400).send("No files uploaded.");
    }

    // get unique identifyer
    //   const userData = await getUserData(user.access_token);

    // console.log(responseGame);

    response = await processData(
      req.files.build[0].filename,
      req.files.photo[0].filename,
      `${req.body.gameID}`
    );
    if (response.status == 400) {
      res.status(400).json({
        error: "There was an error uploading and processing the file",
      });
      return;
    }
    res.status(200).json({
      filename: req.files.build[0].originalname,
      path: req.files.build[0].path,
    });
  }
);

// Export router
module.exports = router;
