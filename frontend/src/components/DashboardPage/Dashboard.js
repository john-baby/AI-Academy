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
