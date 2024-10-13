const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
var express = require("express");
var router = express.Router();
const multer = require("multer");

const processData = async (fileName, newName) => {
  // Define the current file name and the new file name
  const currentDate = new Date().toISOString().split("T")[1]; // Format YYYY-MM-DD
  // Define the directory name
  const tempDir = path.join(__dirname + "/../uploads/", currentDate); // Change this to your desired directory name
  // Create a temp directory

  const currentFilePath = path.join(__dirname + "/../uploads/", fileName); // Change this to your current file
  const newFilePath = path.join(tempDir + "/", fileName); // Change this to your desired new file name
  const destinationFolder = path.join(__dirname + "/../", "published"); // Change this to your desired extraction folder

  console.log(currentFilePath);
  console.log(newFilePath);

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
    const zipFilePath = path.join(tempDir + "/", fileName); // Change this to your ZIP file
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

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    // after multer middleware, attaches file to req.file
    return res.status(400).send("No file uploaded.");
  }
  //console.log(req.file.filename);
  response = processData(req.file.filename, "NewName-userId=23423");
  if (response.status == 400) {
    res.status(400).json({
      error: "There was an error uploading and processing the file",
    });
    return;
  }
  res.status(200).json({
    filename: req.file.originalname,
    path: req.file.path,
  });
});

// Export router
module.exports = router;
