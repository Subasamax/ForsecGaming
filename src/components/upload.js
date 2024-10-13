import React, { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null); // variable, update state function.
  const [error, setError] = useState(""); // error variable, update error state

  const handleChange = (e) => {
    if (!e.target.files[0]) return; // checks if there is a file
    const selectedFile = e.target.files[0]; // sets selected
    if (selectedFile && selectedFile.type === "application/x-zip-compressed") {
      console.log(selectedFile); // output file
      // double checks for selected file and checks type of file
      setFile(selectedFile); // sets file
      setError(""); // sets error
    } else {
      console.log(selectedFile); // output file type
      setError("Please upload a valid ZIP file.");
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault(); //prevents the default behavior of the form submission, stops page refresh, unsure if needed
    if (!file) return; // if file is null, return

    const formData = new FormData(); //construct a set of key/value pairs representing form fields and their values
    formData.append("file", file); // append the file to the form

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST", // post
        body: formData, // file
      });
      const result = await response.text(); // gets result
      alert(result); // dialog box with the results
      console.log(result);
    } catch (err) {
      // catch err
      console.error(err); // display error on console
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "10vw",
        width: "80vw",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          border: "1px solid black",
          width: "50vw", // 100% of the viewport width
          height: "10vh", // Set a height for visibility
          color: "black",
        }}
      >
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".zip" onChange={handleChange} />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
      <button onClick={handleSubmit}> Upload</button>
    </div>
  );
};

export default UploadForm;
