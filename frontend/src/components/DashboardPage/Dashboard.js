// import React, { useEffect, useState } from 'react';

// const Profile = () => {
//     const [profile, setProfile] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             const token = localStorage.getItem('accessToken');
//             console.log(token);
//             if (!token) {
//                 setError("No token found. Please log in.");
//                 return;
//             }

//             try {
//                 const response = await fetch('http://127.0.0.1:5000/auth/profile/', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`, // Include the JWT token
//                     },
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     console.log(errorData);
//                     setError(errorData.error || "Failed to fetch profile.");
//                     return;
//                 }

//                 const data = await response.json();
//                 setProfile(data);
//             } catch (err) {
//                 setError("An error occurred while fetching the profile.");
//             }
//         };

//         fetchProfile();
//     }, []);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!profile) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <h1>Profile</h1>
//             <p><strong>Username:</strong> {profile.username}</p>
//             <p><strong>Email:</strong> {profile.email}</p>
//             <p><strong>Created At:</strong> {new Date(profile.created_at).toLocaleString()}</p>
//         </div>
//     );
// };

// export default Profile;




import React, { useState } from "react";
import Sidebar from "./Sidebar";
import HomeScreen from "./HomeScreen";
import PDFChat from "./PDFChat";
import AITutor from "./AITutor";
import MCQ from "./MCQ";
import Profile from "./Profile";

function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState("HomeScreen");
  
  console.log(localStorage.getItem("accessToken")); 

  const renderComponent = () => {
    switch (selectedComponent) {
      case "HomeScreen":
        return <HomeScreen />;
      case "PDFChat":
        return <PDFChat />;
      case "AITutor":
        return <AITutor />;
      case "MCQ":
        return <MCQ />;
      case "Profile":
        return <Profile />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh"}}>
      <Sidebar setSelectedComponent={setSelectedComponent} />
      <div style={{ flex: 1, background: "#f9f9f9"}}>
        {renderComponent()}
      </div>
    </div>
  );
}

export default Dashboard;
