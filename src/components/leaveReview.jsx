import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { FaStar } from "react-icons/fa";
import "./../css/review.css";

const LeaveReview = ({ gameID }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // makes sure it doesnt keep submiting
    if (!event.target.elements.rating.value) {
      alert("Rating not set");
      return;
    }
    // checks to see if description exists
    if (event.target.elements.description.value === "") {
      console.log("No description set");
      alert("Description Not Set");
      return;
    }
    const data = {
      rating: event.target.elements.rating.value,
      description: event.target.elements.description.value,
      gameID: gameID,
    };
    try {
      const response = await fetch("http://localhost:3001/games/review", {
        method: "POST", // post
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // file
        credentials: "include", // Important for sending cookies
      });
      const result = await response.json(); // gets result
      if (response.status !== 200) {
        console.log("error submiting review");
        alert(`review error: ${result.message}`);
        return;
      }
      alert("Review successful!");
      window.location.href = `/games/${gameID}`;
    } catch (err) {
      // catch err
      alert(err);
      return;
    }
  };

  return (
    <div className="leaveReviewContainer">
      <form onSubmit={handleSubmit} className="leaveReviewContainer">
        <div className="text">Leave a Review</div>
        <div>
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                ></input>
                <FaStar
                  className="star"
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  size={45}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />{" "}
              </label>
            );
          })}
        </div>

        <Form.Control
          as="textarea" // Change this to a textarea
          size="lg"
          type="text"
          name="description"
          placeholder="Enter Review"
          rows={6} // Specify number of visible rows
          style={{ width: "550px" }}
          maxLength={1000}
        />
        <button type="submit" className="submitReview">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default LeaveReview;
