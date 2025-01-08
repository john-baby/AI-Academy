from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """
    User model for authentication and user-related data.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

class PDF(db.Model):
    """
    Model for storing uploaded PDFs.
    """
    __tablename__ = 'pdfs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('pdfs', lazy=True))

    def __repr__(self):
        return f"<PDF {self.filename} uploaded by {self.user_id}>"
class SystemPDF(db.Model):
    """
    Model for storing system-generated PDFs.
    """
    __tablename__ = 'system_pdfs'

    id = db.Column(db.Integer, primary_key=True)
    pdf_url = db.Column(db.String(200), nullable=False)  # URL to the PDF file
    embedding_url = db.Column(db.String(200), nullable=False)  # URL to the embedding file
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<SystemPDF {self.pdf_url}>"

class MCQ(db.Model):
    """
    Model for storing multiple-choice questions.
    """
    __tablename__ = 'mcqs'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # Example: {"A": "Option 1", "B": "Option 2"}
    correct_answer = db.Column(db.String(1), nullable=False)  # Stores "A", "B", etc.
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    creator = db.relationship('User', backref=db.backref('mcqs', lazy=True))

    def __repr__(self):
        return f"<MCQ {self.id} created by {self.created_by}>"

class UserProfile(db.Model):
    """
    Model for storing user profile information.
    """
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    profile_pic = db.Column(db.String(200), nullable=True)  # URL or path to profile picture
    learning_progress = db.Column(db.JSON, nullable=True)  # Example: {"AIChat": 75, "MCQSection": 50}
    user = db.relationship('User', backref=db.backref('profile', uselist=False))

    def __repr__(self):
        return f"<UserProfile {self.user_id}>"
