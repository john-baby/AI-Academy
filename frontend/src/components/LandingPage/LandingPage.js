import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // CSS for styling
import aiImage from '../../assets/ai-chat.jpg';
import pdfImage from '../../assets/pdf-learning.jpg';
import mcqImage from '../../assets/mcq-practice.png';
import learnImage from '../../assets/learn.png';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="header-content">
                    <h1>AI-ACADEMY</h1>
                    <h2>Welcome to Your Learning Platform</h2>
                    <p>Where AI meets education to provide personalized, effective learning experiences.</p>
                    <div className="header-buttons">
                        <Link to="/signup" className="primary-btn">Get Started</Link>
                        <Link to="/login" className="secondary-btn">Login</Link>
                    </div>
                </div>
                <img src={learnImage} alt="Learning" className="header-image" />
            </header>

            <section className="features-section">
                <h2>Features Designed for Success</h2>
                <div className="features-container">
                    <div className="feature-item">
                        <img src={aiImage} alt="AI Chat" />
                        <h3>AI-Powered Chat</h3>
                        <p>Get instant answers and learning assistance from our AI-driven chat system.</p>
                    </div>
                    <div className="feature-item">
                        <img src={pdfImage} alt="Learn with PDFs" />
                        <h3>Learn with PDFs</h3>
                        <p>Upload your study materials and interact with them like never before.</p>
                    </div>
                    <div className="feature-item">
                        <img src={mcqImage} alt="MCQ Practice" />
                        <h3>MCQ Practice</h3>
                        <p>Test your knowledge with tailored quizzes and assessments.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; 2024 AI-Academy. All rights reserved.</p>
                <div className="social-links">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer">
                        <img src="https://img.icons8.com/fluent/48/000000/twitter.png" alt="Twitter" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer">
                        <img src="https://img.icons8.com/fluent/48/000000/facebook-new.png" alt="Facebook" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                        <img src="https://img.icons8.com/fluent/48/000000/linkedin.png" alt="LinkedIn" />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
