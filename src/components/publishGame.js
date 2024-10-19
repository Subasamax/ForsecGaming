import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./../css/publishGames.css";

const PublishGame = () => {
  const [formValues, setFormValues] = useState({
    form1: "",
    form2: "",
    // Add more forms as needed
  });

  const handleChange = (event, formName) => {
    setFormValues({
      ...formValues,
      [formName]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const buildInput = event.target.elements.build;

    // checks to see if build exists
    if (event.target.elements.gameName.value === "") {
      console.log("no game name");
      alert("Game Name not Set");
    }
    // checks to see if description exists
    if (event.target.elements.description.value === "") {
      console.log("No description set");
      alert("Description Not Set");
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
    console.log(event.target.elements.photo.files[0]);
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
      if (response.status != 200) {
        console.log("error creating a game on table");
        alert("there was an error creating the game");
        return;
      }
      formData.append("gameID", result.id);
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
      const result = await response.json(); // gets result
      alert("Game uploaded!");
      window.location.href = "/";
      console.log(result);
    } catch (err) {
      // catch err
      console.error(err); // display error on console
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <h1>Publish Game</h1>
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
              placeholder="Please enter build file as zip"
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

        <button type="submit">Submit Form 1</button>
      </div>
    </form>
  );
};

export default PublishGame;
