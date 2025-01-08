import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Avatar, Grid, Paper, Divider, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(`https://avatar.iran.liara.run/public/boy?username=${name}`);
  const [preferences, setPreferences] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Save profile changes logic here
    console.log("Profile saved:", { name, email, photo, preferences });
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Replace with your token logic
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setName(data.username || ""); // Adjust key names based on your backend
      setEmail(data.email || "");
      setPhoto(`https://avatar.iran.liara.run/public/boy?username=${data.username}`);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error fetching profile. Please try again.");
    }
  };

  useEffect(() => { fetchProfile(); }, []); // Fetch profile on component mount

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#121212", color: "#ffffff", minHeight: "100vh" }}>
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "#333",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 600, mb: 3, color: "#ffffff" }}>
          Profile Settings
        </Typography>
        <Divider sx={{ mb: 3, backgroundColor: "#444" }} />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              alt={name}
              src={photo}
              sx={{
                width: 150,
                height: 150,
                margin: "0 auto",
                border: "4px solid #1E88E5",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            {isEditing && (
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                component="label"
                sx={{
                  mt: 2,
                  color: "#1E88E5",
                  borderColor: "#1E88E5",
                }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhoto(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <>
                  <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  sx={{
                    backgroundColor: "#444",
                    color: "#fff",
                    "& .MuiInputLabel-root": {
                      color: "#fff", // White color for the label
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff", // White color for the input text
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  sx={{
                    backgroundColor: "#444",
                    color: "#fff",
                    "& .MuiInputLabel-root": {
                      color: "#fff", // White color for the label
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff", // White color for the input text
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Preferences"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{
                    backgroundColor: "#444",
                    color: "#fff",
                    "& .MuiInputLabel-root": {
                      color: "#fff", // White color for the label
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff", // White color for the input text
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    mt: 3,
                    backgroundColor: "#1E88E5",
                    "&:hover": { backgroundColor: "#1565C0" },
                  }}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                  <strong>Name:</strong> {name}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                  <strong>Email:</strong> {email}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                  <strong>Preferences:</strong> {preferences || "None"}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    mt: 3,
                    backgroundColor: "#333",
                    "&:hover": { backgroundColor: "#444" },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
