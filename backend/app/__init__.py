from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
import os 

jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key') 
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///app.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')  # Replace with a secure key in production
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # Tokens expire in 1 hour (in seconds)
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']
    
    UPLOAD_FOLDER = 'uploaded_documents'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    db.init_app(app)
    with app.app_context():
        db.create_all()
    jwt.init_app(app)
    CORS(app)
    from .routes.auth_routes import auth_bp
    from .routes.mcq_routes import mcq_bp
    from .routes.pdf_routes import pdf_bp
    from .routes.chat_routes import chat_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(mcq_bp, url_prefix='/mcq')
    app.register_blueprint(pdf_bp, url_prefix='/pdf')
    app.register_blueprint(chat_bp, url_prefix='/model')
    return app
