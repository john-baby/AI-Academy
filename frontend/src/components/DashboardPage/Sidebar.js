import React, { useState } from "react";
import { FaHome, FaGraduationCap, FaComments, FaQuestionCircle, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ setSelectedComponent }) => {
  const menuItems = [
    { name: "HomeScreen", icon: <FaHome /> },
    { name: "PDFChat", icon: <FaGraduationCap /> },
    { name: "AITutor", icon: <FaComments /> },
    { name: "MCQ", icon: <FaQuestionCircle /> },
    { name: "Profile", icon: <FaUser /> },
  ];

  const [selectedItem, setSelectedItem] = useState("HomeScreen");
  const [isExpanded, setIsExpanded] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Replace with your token logic
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Logout response:", data);  
      localStorage.removeItem("accessToken");
      navigate('/');
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error fetching profile. Please try again.");
    }
  }

  const toggleSidebar = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const darkTheme = {
    background: "linear-gradient(135deg, #1e1e1e, #444444)",
    buttonBackground: "#333333",
    buttonHover: "#555555",
    selectedButton: "#2a2a72",
    selectedBorder: "#ff4b5c",
    text: "#ffffff",
    shadow: "rgba(0, 0, 0, 0.2)",
    hoverShadow: "rgba(0, 0, 0, 0.3)",
  };

  return (
    <div
      style={{
        width: isExpanded ? "250px" : "70px",
        background: darkTheme.background,
        padding: "20px 10px",
        display: "flex",
        flexDirection: "column",
        boxShadow: `5px 0 15px ${darkTheme.shadow}`,
        color: darkTheme.text,
        fontFamily: "Arial, sans-serif",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      
      {/* Toggle Button */}
      <div style={{
          display: "flex",
          justifyContent: isExpanded ? "space-around" : "center",
          marginBottom: "20px",
        }}>
      {isExpanded && (
        <div
          style={{
            marginBottom: "30px",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "1.5em",
              textShadow: `2px 2px 5px ${darkTheme.shadow}`,
            }}
          >
            AI-Academy
          </h2>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: isExpanded ? "flex-end" : "center",
          marginBottom: "20px",
        }}
      >
        
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: darkTheme.text,
            cursor: "pointer",
            fontSize: "1.5em",
            outline: "none",
          }}
        >
          <FaBars />
        </button>
      </div>
      </div>
      {/* Sidebar Header */}
      

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setSelectedItem(item.name);
            setSelectedComponent(item.name);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isExpanded ? "flex-start" : "center",
            padding: "15px",
            margin: "10px 0",
            background: selectedItem === item.name ? darkTheme.selectedButton : darkTheme.buttonBackground,
            color: darkTheme.text,
            border: selectedItem === item.name ? `2px solid ${darkTheme.selectedBorder}` : "2px solid transparent",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1em",
            boxShadow: `3px 3px 10px ${darkTheme.shadow}`,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = darkTheme.buttonHover;
            e.target.style.boxShadow = `5px 5px 15px ${darkTheme.hoverShadow}`;
          }}
          onMouseOut={(e) => {
            e.target.style.background = selectedItem === item.name ? darkTheme.selectedButton : darkTheme.buttonBackground;
            e.target.style.boxShadow = `3px 3px 10px ${darkTheme.shadow}`;
          }}
        >
          <span style={{ marginRight: isExpanded ? "10px" : "0", fontSize: "1.2em" }}>
            {item.icon}
          </span>
          {isExpanded && item.name}
        </button>
      ))}

      {/* Logout Button */}
      <button
        style={{
          marginTop: "auto",
          padding: "15px",
          background: darkTheme.selectedBorder,
          color: darkTheme.text,
          border: `2px solid ${darkTheme.selectedBorder}`,
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1em",
          boxShadow: `3px 3px 10px ${darkTheme.shadow}`,
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.background = darkTheme.buttonHover;
          e.target.style.boxShadow = `5px 5px 15px ${darkTheme.hoverShadow}`;
        }}
        onMouseOut={(e) => {
          e.target.style.background = darkTheme.selectedBorder;
          e.target.style.boxShadow = `3px 3px 10px ${darkTheme.shadow}`;
        }}
        onClick={handleLogout}
      >
        <span style={{ marginRight: isExpanded ? "10px" : "0", fontSize: "1.2em" }}>
          <FaSignOutAlt />
        </span>
        {isExpanded && "Logout"}
      </button>
    </div>
  );
};

export default Sidebar;
