import React from "react";
import { FaStar } from "react-icons/fa";
import "./../css/review.css";

const Reviews = ({ userName, date, description, rating }) => {
  return (
    <div className="showReviewContainer">
      <hr className="reviewDivider"></hr>
      <div className="reviewUsername">{userName}</div>
      <div className="reviewDate">{date}</div>
      <div>
        {[...Array(5)].map((star, i) => {
          // populates an array with 5 stars
          const ratingValue = i + 1;
          return (
            <label key={i}>
              <FaStar
                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                size={30}
              />{" "}
            </label>
          );
        })}
      </div>
      <hr className="descriptionDivider"></hr>
      <div className="reviewDescription">{description}</div>
      <hr className="reviewDivider"></hr>
    </div>
  );
};

export default Reviews;
