from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from app import jwt
from app.models import User, db
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register/', methods=['POST'])
def register():
    """
    Endpoint for user registration.
    Expects JSON: { "username": "", "email": "", "password": "" }
    """
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('login/', methods=['POST'])
def login():
    """
    Endpoint for user login.
    Expects JSON: { "email": "", "password": "" }
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=10))
    return jsonify({"access_token": access_token, "message": "Login successful"}), 200

@auth_bp.route('/profile/', methods=['GET'])
@jwt_required()
def profile():
    """
    Endpoint to fetch user profile details.
    Requires a valid JWT token.
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/logout/', methods=['POST'])
@jwt_required()
def logout():
    """
    Endpoint for user logout.
    Invalidates the current token by adding it to the blacklist.
    """
    try:
        jti = get_jwt()['jti']  # Get the unique identifier of the current token
        blacklist.add(jti)     # Add the token to the blacklist
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

blacklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist

