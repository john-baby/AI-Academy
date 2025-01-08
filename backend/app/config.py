import os

class Config:
    """
    Base configuration class. Includes default settings for the Flask app.
    """
    # Flask Settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')  # Replace with a secure key in production
    DEBUG = os.getenv('DEBUG', True)  # Enable/disable debug mode

    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///app.db'  # Default to SQLite for local development
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress SQLAlchemy warning

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')  # Replace with a secure key in production
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # Tokens expire in 1 hour (in seconds)
    
    # CORS Settings
    CORS_HEADERS = 'Content-Type'

class DevelopmentConfig(Config):
    """
    Development-specific configuration. Inherits from the base class.
    """
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL queries for debugging purposes

class ProductionConfig(Config):
    """
    Production-specific configuration. Inherits from the base class.
    """
    DEBUG = False
    SQLALCHEMY_ECHO = False

class TestingConfig(Config):
    """
    Testing-specific configuration. Inherits from the base class.
    """
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use an in-memory database for tests
    DEBUG = False
