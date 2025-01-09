// import React, {useState, useEffect} from "react";
// import { Box, Typography, Grid, Paper, LinearProgress, Button } from "@mui/material";

// const HomeScreen = ({ user = "User" }) => {
//   // Sample progress data (Replace with actual data from your API or state)
//   const progressData = {
//     quizzesTaken: 7,
//     totalQuizzes: 10,
//     chaptersCompleted: 15,
//     totalChapters: 20,
//   };

//   const [name, setName] = useState("");

//   const fetchProfile = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/auth/profile/", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Replace with your token logic
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error("Failed to fetch profile");
//         }
  
//         const data = await response.json();
//         setName(data.username || ""); // Adjust key names based on your backend
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         alert("Error fetching profile. Please try again.");
//       }
//     };
  
//     useEffect(() => { fetchProfile(); }, []); // Fetch profile on component mount

//   const calculatePercentage = (completed, total) => (completed / total) * 100;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { Box, Typography, Grid, Paper, LinearProgress, Button } from "@mui/material";

const HomeScreen = ({ user = "User" }) => {
  const navigate = useNavigate(); // Hook for navigation
  const progressData = {
    quizzesTaken: 7,
    totalQuizzes: 10,
    chaptersCompleted: 15,
    totalChapters: 20,
  };
  const [name, setName] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Replace with your token logic
        },
      });

      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("accessToken"); // Clear token if stored
        navigate("/login"); // Redirect to login page
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setName(data.username || ""); // Adjust key names based on your backend
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error fetching profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // Fetch profile on component mount

  const calculatePercentage = (completed, total) => (completed / total) * 100;

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        background: "linear-gradient(135deg, #121212, #1e1e1e)", // Black gradient
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
          color: "#ffffff", // White text
          textShadow: "2px 2px 5px rgba(255, 255, 255, 0.1)",
        }}
      >
        Welcome, {name}!
      </Typography>
      <Grid container spacing={3}>
        {/* Progress Indicators */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)", // Dark gradient
              color: "#ffffff",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#ffffff",
                textShadow: "1px 1px 3px rgba(255, 255, 255, 0.1)",
              }}
            >
              Quizzes Progress
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#bbbbbb" }}>
              {progressData.quizzesTaken} of {progressData.totalQuizzes} quizzes taken
            </Typography>
            <LinearProgress
              variant="determinate"
              value={calculatePercentage(progressData.quizzesTaken, progressData.totalQuizzes)}
              sx={{
                height: 10,
                borderRadius: "5px",
                backgroundColor: "#333",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#bb86fc",
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)", // Dark gradient
              color: "#ffffff",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#ffffff",
                textShadow: "1px 1px 3px rgba(255, 255, 255, 0.1)",
              }}
            >
              Chapters Progress
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#bbbbbb" }}>
              {progressData.chaptersCompleted} of {progressData.totalChapters} chapters completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={calculatePercentage(progressData.chaptersCompleted, progressData.totalChapters)}
              sx={{
                height: 10,
                borderRadius: "5px",
                backgroundColor: "#333",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#9c4dcc",
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Actions */}
        {[
          {
            title: "Continue Learning",
            description: "Pick up where you left off with your lessons.",
            buttonText: "Resume",
          },
          {
            title: "Take a Quiz",
            description: "Test your knowledge and track your progress.",
            buttonText: "Start Quiz",
          },
          {
            title: "Profile",
            description: "View and manage your account details.",
            buttonText: "Go to Profile",
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)", // Dark gradient
                color: "#ffffff",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)", // Light shadow
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#ffffff",
                  textShadow: "1px 1px 3px rgba(255, 255, 255, 0.1)",
                }}
              >
                {item.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "#bbbbbb" }}>
                {item.description}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  borderRadius: "20px",
                  px: 4,
                  backgroundColor: "#bb86fc", // Purple button
                  color: "#121212", // Black text on button
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "#9c4dcc", // Darker purple on hover
                    boxShadow: "0 4px 15px rgba(187, 134, 252, 0.5)",
                  },
                }}
              >
                {item.buttonText}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomeScreen;
