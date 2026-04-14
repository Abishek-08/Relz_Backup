import React, { useEffect, useRef, useState } from "react";
import "../styles/LandingPageStyles.css";
import CapLogo from "../assets/user-module-assets/CAP_LOGO.png";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
//Procturing Images
import ProctoringImage from "../assets/user-module-assets/LandingPage Proctoring.png";
import ProctoringImage1 from "../assets/user-module-assets/LandingPage Proctoring 1.jpeg";
import ProctoringImage2 from "../assets/user-module-assets/LandingPage Proctoring 2.jpeg";
import ProctoringImage3 from "../assets/user-module-assets/LandingPage Proctoring 3.jfif";

//Learning Images
import MCQ_Image from "../assets/user-module-assets/MCQ Landing page Image.png";
import MCQ_Image1 from "../assets/user-module-assets/MCQ Landing page Image 1.jpeg";
import MCQ_Image2 from "../assets/user-module-assets/MCQ Landing page Image 2.jpeg";
import MCQ_Image3 from "../assets/user-module-assets/MCQ Landing page Image 3.jpeg";

//Coding Images
import Coding_Image from "../assets/user-module-assets/Coding Image Landing page.jpeg";
import Coding_Image1 from "../assets/user-module-assets/Coding Image Landing page 1.jpeg";
import Coding_Image2 from "../assets/user-module-assets/Coding Image Landing page 2.jpeg";
import Coding_Image3 from "../assets/user-module-assets/Coding Image Landing page 3.jpeg";

//Preparation images
import Learning_image from "../assets/user-module-assets/Learning Image Landing Screen.png";
import Learning_image1 from "../assets/user-module-assets/Learning Image Landing Screen 1.jpeg";
import Learning_image2 from "../assets/user-module-assets/Learning Image Landing Screen 2.jpeg";
import Learning_image3 from "../assets/user-module-assets/Learning Image Landing Screen 3.jpeg";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideshowImages = [
    Learning_image,
    Learning_image1,
    Learning_image2,
    Learning_image3,
  ];

  const slideshowProctoringImages = [
    ProctoringImage,
    ProctoringImage1,
    ProctoringImage2,
    ProctoringImage3,
  ];

  const slideshowMCQImages = [MCQ_Image, MCQ_Image1, MCQ_Image2, MCQ_Image3];

  const slideshowCOdingImages = [
    Coding_Image,
    Coding_Image1,
    Coding_Image2,
    Coding_Image3,
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideshowImages.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(heroRef.current.children, {
      opacity: 0,
      y: 100,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    featuresRef.current.forEach((feature, index) => {
      gsap.from(feature.children, {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: feature,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(feature.querySelector(".feature-image"), {
        rotationY: 360,
        duration: 1,
        scrollTrigger: {
          trigger: feature,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="landing-page" id="landing_page_body">
      <div className="header" id="landingPage_header">
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-md-4">
            <img src={CapLogo} alt="Nav_logo_CAP" id="navBar_logo_cap" />
          </div>
          <div
            className="col-md-4 d-flex justify-content-center"
            id="relevantz_text"
          >
            Relevantz
          </div>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
            <a href="#index0" id="nav_buttons_contact">
              About Us
            </a>
            <a
              onClick={() => navigate("/login")}
              className="login-btn"
              id="nav_buttons_login"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      <main>
        <section
          ref={heroRef}
          className="hero"
          id="landing_page_body_conatiner_hero"
        >
          <h1 id="skills_text">Skills speak louder than words.</h1>
          <p id="paratexts_landingPage">
            We help to develop the strongest tech teams around.
            <br />
            We help candidates evaluate their tech skills.
          </p>
          <button onClick={() => navigate("/login")} id="get_started_button">
            Get Started
          </button>
        </section>

        {[
          "Prepare and Complete Assessments",
          "Showcase your skills",
          "Test your knowledge with MCQ assessment!",
          "Exam Security Done Right",
        ].map((title, index) => (
          <section
            id={`index${index}`}
            key={index}
            ref={(el) => (featuresRef.current[index] = el)}
            className={`feature-section ${index % 2 === 1 ? "reverse" : ""}`}
          >
            <div className="feature-content">
              <h2 id="heading_texts">{title}</h2>
              <p id="feature_text_parahraph">
                {index === 0 &&
                  "Every idea has a first line of code. Prep for jobs and sharpen your skills alongside a global community of developers. Access the content you need to develop new skills – and land the job you've dreamed of."}
                {index === 1 &&
                  "Highlight your abilities through comprehensive showcases of your skills."}
                {index === 2 &&
                  "Challenge yourself with our engaging online MCQ assessment! Answer a series of multiple-choice questions designed to test your knowledge on a variety of topics."}
                {index === 3 &&
                  "Online Proctoring to advance your learning and testing program, Validate Knowledge increased Integrity."}
              </p>
              <button
                id="feature_btn_about_us"
                className="feature-btn"
                onClick={() => navigate("/loginDemo")}
              >
                Login & Explore
              </button>
              <a href="#landing_page_body" id="back_to_top_link">
                Back to Top
              </a>
              {index !== 3 && (
                <a href={`#index${index + 1}`} id="back_to_top_link">
                  Continue
                </a>
              )}
            </div>
            <div className="feature-image">
              {index === 0 && (
                <div className="slideshow" id="slideshow_container">
                  {slideshowImages.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`Slideshow Image ${i + 1}`}
                      className={`slideshow-image ${
                        i === currentSlide ? "active" : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ))}
                </div>
              )}
              {index === 1 && (
                <div className="slideshow" id="slideshow_container">
                  {slideshowCOdingImages.map((image, i) => (
                    <img
                      id="slideshow_image"
                      key={i}
                      src={image}
                      alt={`Slideshow Image ${i + 1}`}
                      className={`slideshow-image ${
                        i === currentSlide ? "active" : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ))}
                </div>
              )}
              {index === 2 && (
                <div className="slideshow" id="slideshow_container">
                  {slideshowMCQImages.map((image, i) => (
                    <img
                      id="slideshow_image"
                      key={i}
                      src={image}
                      alt={`Slideshow Image ${i + 1}`}
                      className={`slideshow-image ${
                        i === currentSlide ? "active" : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ))}
                </div>
              )}
              {index === 3 && (
                <div className="slideshow" id="slideshow_container">
                  {slideshowProctoringImages.map((image, i) => (
                    <img
                      id="slideshow_image"
                      key={i}
                      src={image}
                      alt={`Slideshow Image ${i + 1}`}
                      className={`slideshow-image ${
                        i === currentSlide ? "active" : ""
                      }`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <footer id="footer_landing_page">
        <p id="footer_para">
          Secure Assessments, Unmatched Integrity: Your Trust, Our Priority.
        </p>
        <p>&copy; 2024 Relevantz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
