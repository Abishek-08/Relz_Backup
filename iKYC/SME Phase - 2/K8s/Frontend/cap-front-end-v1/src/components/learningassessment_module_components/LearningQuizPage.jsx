import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/learning_assessment_styles/LearningQuizPage.css';


/**
@Author : Karpagam B - 12110
@Since : 09/07/2024
*/

const LearningQuizPage = () => {
  const location = useLocation();
  const { state } = location;

  const [questions] = useState([
    {
      "id": 1,
      "question": "What is React?",
      "type": "SSQ",
      "options": [
        "A JavaScript library for building user interfaces",
        "A server-side framework",
        "A database management system"
      ],
      "correctAnswer": 0
    },
    {
      "id": 2,
      "question": "Which of the following are JavaScript frameworks?",
      "type": "MSQ",
      "options": [
        "Angular",
        "React",
        "Vue",
        "Bootstrap"
      ],
      "correctAnswer": [0, 1, 2]
    },
    {
      "id": 3,
      "question": "Which of the following are CSS frameworks?",
      "type": "MSQ",
      "options": [
        "Bootstrap",
        "Tailwind",
        "JQuery",
        "Vue"
      ],
      "correctAnswer": [0, 1]
    },
    {
      "id": 4,
      "question": "Is Python an Object-Oriented Language?",
      "type": "SSQ",
      "options": [
        "Yes",
        "No"
      ],
      "correctAnswer": 0
    },
    {
      "id": 5,
      "question": "Is C a procedural language?",
      "type": "SSQ",
      "options": [
        "Yes",
        "No",
        "Partial",
        "Both",
        "None of the above"
      ],
      "correctAnswer": 4
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerIntervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set timer if total duration provided
    if (state && state.totalDuration) {
      let startTime;
      let storedStartTime = localStorage.getItem('quizStartTime');
      startTime = storedStartTime ? parseInt(storedStartTime, 10) : Math.floor(Date.now() / 1000);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < state.totalDuration) {
        setTimeRemaining(state.totalDuration - elapsedTime);
        localStorage.setItem('quizStartTime', startTime.toString());
        startTimer(state.totalDuration - elapsedTime);
      } else {
        handleTimeUp();
      }
    } else {
      toast.error('Total duration not provided.', { position: 'top-right', autoClose: 5000 });
    }

    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [state]);

  const startTimer = (initialTime) => {
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timerIntervalRef.current);
          handleTimeUp();
          return 0;
        }
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (!isTimeUp) {
      console.log('Time is up!');
      localStorage.removeItem('quizStartTime');
      toast.success('Time is up! Response submitted successfully.', { position: 'top-right', autoClose: 5000 });
      setIsTimeUp(true);
      // Navigate to the landing page after a brief delay to allow toast message display
      setTimeout(() => {
        navigate('/quizLandingPage');
      }, 2000); // Adjust delay as needed
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleAnswerChange = (optionIndex, isChecked) => {
    if (questions[currentQuestionIndex].type === 'SSQ') {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestionIndex]: optionIndex
      }));
    } else if (questions[currentQuestionIndex].type === 'MSQ') {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestionIndex]: {
          ...prevAnswers[currentQuestionIndex],
          [optionIndex]: isChecked
        }
      }));
    }
  };

  const handleSubmit = () => {
    // Handle submission logic (e.g., send answers to backend)
    console.log('Submitted answers:', answers);
    // Optionally, navigate to result page or handle further actions
    navigate('/quizLandingPage');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="learning-main-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <h4 style={{ textAlign: 'center' }}>Code Quality & Design Principles MCQ Assessment</h4><br />
      {state && state.totalDuration && (
        <p id='learning-main-duration'>Time remaining: {formatTime(timeRemaining)}</p>
      )}
      {questions.length > 0 && (
        <>
          <div className="learning-question-container">
            <p> {questions[currentQuestionIndex].id}. {questions[currentQuestionIndex].question}</p>
            {questions[currentQuestionIndex].type === 'SSQ' ? (
              <div className="learning-options-container">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="learning-option">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${currentQuestionIndex}`}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerChange(index, true)}
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="learning-options-container">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="learning-option">
                    <input
                      type="checkbox"
                      id={`option-${index}`}
                      checked={answers[currentQuestionIndex]?.[index] || false}
                      onChange={(e) => handleAnswerChange(index, e.target.checked)}
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="learning-navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevious}>Previous</button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNext}>Next</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LearningQuizPage;
