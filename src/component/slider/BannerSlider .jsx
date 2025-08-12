import React, { useState, useEffect } from "react";
import "../../scss/components/_banner.scss";

const BannerSlider = ({ slides = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto slide every 3s (optional)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const SliderContent = ({ activeIndex, slides }) => {
        return (
            <div className="banner-container">
                {slides.map((item, index) => (
                    <div
                        key={index}
                        className={`slide ${index === activeIndex ? "active" : "inactive"}`}
                    >
                        <img
                            src={item.Banner_url}
                            className="slide-image"
                            alt={`Banner-${index}`}
                        />
                        <div className="anime-title">
                            <label className="title-heading">
                                {item.title || "Default Title"}
                            </label>
                            <label className="anime-subTitle">
                                {item.subTitle || "Default Subtitle"}
                            </label>
                        </div>
                        <button className="watch-btn">Watch now</button>
                    </div>
                ))}
            </div>
        );
    };

    const Dots = ({ activeIndex, onClick, slides }) => {
        return (
            <div className="dots-container">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${activeIndex === index ? "active-dot" : ""}`}
                        onClick={() => onClick(index)}
                    ></span>
                ))}
            </div>
        );
    };

    return (
        <div className="slider-container">
            <SliderContent activeIndex={activeIndex} slides={slides} />
            <Dots
                activeIndex={activeIndex}
                slides={slides}
                onClick={(index) => setActiveIndex(index)}
            />
        </div>
    );
};

export default BannerSlider;
