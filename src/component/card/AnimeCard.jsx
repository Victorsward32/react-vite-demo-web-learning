import React from "react";
import "../../scss/components/_animeCard.scss";

const AnimeCard = ({ image, title, rating }) => {
    // Create an array of stars based on rating
    const getStars = (rating) => {
        const starsArray = [];

        const fullStars = Math.floor(rating); // full stars count
        const hasHalfStar = rating % 1 >= 0.5; // check if half star needed

        // Add full stars
        Array(fullStars)
            .fill(0)
            .forEach((_, i) => starsArray.push({ type: "full", id: `full-${i}` }));

        // Add half star if needed
        if (hasHalfStar) {
            starsArray.push({ type: "half", id: "half-star" });
        }

        // Add empty stars for the remaining
        const emptyStars = 5 - starsArray.length;
        Array(emptyStars)
            .fill(0)
            .forEach((_, i) =>
                starsArray.push({ type: "empty", id: `empty-${i}` })
            );

        return starsArray;
    };

    return (
        <div className="anime-card">
            <div className="image-container">
                <img src={image} alt={title} />
                <div className="overlay">
                    <span className="watch-icon">▢</span>
                    <p>Watch this</p>
                </div>
            </div>

            <h3 className="anime-title">{title}</h3>

            <div className="stars">
                {getStars(rating).map((star) => (
                    <span key={star.id} className={`star ${star.type}`}>
                        ★
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnimeCard;
