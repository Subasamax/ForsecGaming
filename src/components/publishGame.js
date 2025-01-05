import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, { useState } from "react";
import "./../css/publishGames.css";

const PublishGame = () => {
  // State to control the visibility of the text area
  const [isVisible, setIsVisible] = useState(false);

  // Toggle the visibility of the text area
  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // checks to see if build exists
    if (event.target.elements.gameName.value === "") {
      console.log("no game name");
      alert("Game Name not Set");
      return;
    }
    // checks to see if description exists
    if (event.target.elements.description.value === "") {
      console.log("No description set");
      alert("Description Not Set");
      return;
    }
    // checks to see if photo exists
    if (!event.target.elements.build.files[0]) {
      console.log("build file not selected");
      alert("build file not selected"); // dialog box with the results
      return;
    }
    // checks to see if zip file exists
    if (!event.target.elements.photo.files[0]) {
      console.log("no photo");
      alert("photo not selected");
      return;
    }
    // formdata for photo and build file
    const formData = new FormData();
    formData.append("build", event.target.elements.build.files[0]);
    formData.append("photo", event.target.elements.photo.files[0]);

    const data = {
      title: event.target.gameName.value,
      description: event.target.description.value,
    };
    try {
      const response = await fetch("http://localhost:3001/games/create", {
        method: "POST", // post
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // file
        credentials: "include", // Important for sending cookies
      });
      const result = await response.json(); // gets result
      if (response.status !== 200) {
        console.log("error creating a game");
        alert(`there was an error creating the game: ${result.message}`);
        return;
      }
      formData.append("gameID", result.id); // adds game id to formdata
    } catch (err) {
      // catch err
      console.error(err); // display error on console
      alert(err);
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST", // post
        body: formData, // file
        credentials: "include", // Important for sending cookies
      });
      if (response.status !== 200) {
        alert(`there was an error creating the game`);
        return;
      }
      alert("Game uploaded!");
      window.location.href = "/"; // refresh page
    } catch (err) {
      // catch err
      console.error(err); // display error on console
    }
  };

  return (
    <div className="publishContainer">
      <form onSubmit={handleSubmit} className="form-group">
        <h1 className="title">Publish Game</h1>
        <hr className="titleDivider"></hr>
        <Form.Group as={Row} className="item">
          <Form.Label column sm="3">
            Game Name
          </Form.Label>
          <Col sm="6">
            <Form.Control
              size="lg"
              type="text"
              name="gameName"
              placeholder="Enter Game Name"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="item">
          <Form.Label column sm="3">
            Description
          </Form.Label>
          <Col sm="6">
            <Form.Control
              as="textarea" // Change this to a textarea
              size="lg"
              type="text"
              name="description"
              placeholder="Enter Game Description"
              rows={4} // Specify number of visible rows
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="item">
          <Form.Label column sm="3" className="form-label">
            Photo
          </Form.Label>
          <Col sm="6">
            <Form.Control
              type="file"
              name="photo"
              placeholder="Please enter photo file"
              accept="image/*"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="item">
          <Form.Label column sm="3" className="form-label">
            build
          </Form.Label>
          <Col sm="6">
            <Form.Control
              type="file"
              name="build"
              placeholder="Please enter build file as zip"
              accept=".zip"
            />
          </Col>
        </Form.Group>
        <button type="submit" className="btn btn-outline-dark publishButton">
          Submit Game
        </button>
      </form>
      <button
        onClick={toggleVisibility}
        className="btn btn-outline-dark publishButton"
      >
        Instructions
      </button>
      {isVisible /* This shows the following content if isVisible is true, else do not show */ && (
        <>
          <div className="paragraph">
            In order to submit a game, you need to fill out all the above forms
            and be SIGNED IN. Game Name and Description are text feilds that are
            self explanatory. The Photo feild expects a file with photo
            extensions like png, ect. It is for the main screenshot/photo of
            your game. For the build file form, it expects a zip file. This file
            needs to be a zipped file holding your build files for the game.
            Below is an example of a zip file.
          </div>
          <div className="images">
            <img
              className="image_1"
              src="/InstructionImages/Instruction_1.png"
              alt="An example of a Buiild folder zip."
            />
            <div className="paragraph">In your zip file is a build folder.</div>
            <img
              className="image"
              src="/InstructionImages/Instruction_2.png"
              alt="An example of a Buiild folder zip."
            />
            <div className="paragraph">
              In your build file are your game files. It is important that your
              index.html is at the root of this folder and is the start of your
              game. As long as the paths to your static files in the index html
              is according to your build folder, then you are welcome to arrange
              your build folder however you want.
            </div>
            <img
              className="image"
              src="/InstructionImages/Instruction_3.png"
              alt="An example of a Buiild folder zip."
            />
            <div className="paragraph">
              It is important to follow these instructions otherwise there is no
              guarantee that your game will be uploaded correctly.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PublishGame;
