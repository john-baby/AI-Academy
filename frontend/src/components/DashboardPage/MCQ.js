import React, { useState } from "react";

const MCQ = () => {
  const [chapterName, setChapterName] = useState("");
  const [questions, setQuestions] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputScreen, setInputScreen] = useState(true); // New state for input screen
  const [reviewMode, setReviewMode] = useState(false); // New state for review mode

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/mcq/generatemcq/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapter_name: chapterName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuestions(data.answer_key);
      setInputScreen(false); // Hide input screen after successful fetch
    } catch (error) {
      console.error("Error fetching MCQs:", error);
      alert("Error Occurred while connecting!");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentIndex]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowScore(false);
    setInputScreen(true); // Show input screen for new quiz
  };

  const calculateScore = () => {
    const score = questions.reduce((score, question, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer === question.correct_answer_option) {
        return score + 1;
      }
      return score;
    }, 0);
    return score;
  };

  if (inputScreen) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Enter Chapter Name</h1>
        <input
          type="text"
          placeholder="Enter chapter name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={fetchQuestions}
          style={styles.startButton}
          disabled={!chapterName.trim()}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (loading) {
    return <div style={styles.loading}>Loading questions...</div>;
  }

  // if (showScore) {
  //   const score = calculateScore();
  //   return (
  //     <div style={styles.container}>
  //       <h1 style={styles.heading}>Quiz Completed!</h1>
  //       <p style={styles.score}>
  //         Your score: {score} / {questions.length}
  //       </p>
  //       <button onClick={handleReset} style={styles.resetButton}>
  //         Take More Tests
  //       </button>
  //     </div>
  //   );
  // }
  if (showScore) {
    const score = calculateScore();
  if (reviewMode) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Review Answers</h1>
        <div style={styles.reviewContainer}>
          {questions.map((question, index) => (
            <div key={index} style={styles.reviewBox}>
              <p style={styles.question}>
                {index + 1}. {question.question}
              </p>
              <p
                style={{
                  ...styles.reviewAnswer,
                  color:
                    selectedAnswers[index] === question.correct_answer_option
                      ? "#4CAF50"
                      : "#E53935",
                }}
              >
                Your Answer: {selectedAnswers[index] || "No answer selected"}
              </p>
              <p style={styles.correctAnswer}>
                Correct Answer: {question.correct_answer_option}
              </p>
            </div>
          ))}
        </div>
        <button onClick={() => setReviewMode(false)} style={styles.navButton}>
          Back to Score
        </button>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Quiz Completed!</h1>
      <p style={styles.score}>
        Your score: {score} / {questions.length}
      </p>
      <button
        onClick={() => setReviewMode(true)}
        style={styles.navButton}
      >
        Review Answers
      </button>
      <button onClick={handleReset} style={styles.resetButton}>
        Take More Tests
      </button>
    </div>
  );
}
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>MCQ Quiz</h1>
      <div style={styles.questionBox}>
        <p style={styles.question}>
          {currentIndex + 1}. {questions[currentIndex].question}
        </p>
        <div style={styles.options}>
          {questions[currentIndex].options.map((option, index) => (
            <button
              key={index}
              style={{
                ...styles.optionButton,
                backgroundColor:
                  selectedAnswers[currentIndex] === option ? "#4CAF50" : "#333",
              }}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.navigation}>
        <button
          onClick={handlePrevious}
          style={styles.navButton}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button onClick={handleNext} style={styles.navButton}>
          {currentIndex === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "100vh",
    padding: "20px",
  },
  reviewContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    marginBottom: "20px",
    overflowY: "auto", // Enable vertical scrolling
    maxHeight: "70vh", // Limit height to 70% of the viewport
  },
  reviewAnswer: {
    fontSize: "1rem",
    marginBottom: "10px",
  },
  correctAnswer: {
    fontSize: "1rem",
    color: "#4CAF50",
  },
  
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#ffffff",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #444",
    fontSize: "1rem",
    width: "300px",
    marginBottom: "20px",
    backgroundColor: "#333",
    color: "#ffffff",
  },
  startButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#1E88E5",
    color: "#ffffff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "1rem",
  },
  questionBox: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    marginBottom: "20px",
  },
  question: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    color: "#ffffff",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  optionButton: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #444",
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 0.3s ease",
    color: "#ffffff",
    backgroundColor: "#333",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "600px",
  },
  navButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#1E88E5",
    color: "#ffffff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "1rem",
  },
  score: {
    fontSize: "1.5rem",
    color: "#4CAF50",
  },
  resetButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "1rem",
    marginTop: "20px",
  },
};

export default MCQ;
