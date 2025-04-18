from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils.chat_utils import get_response  

chat_bp = Blueprint('model', __name__)

@chat_bp.route('/chat/', methods=['POST'])
@jwt_required()
def handle_get_response():
    data = request.json
    response = get_response(data['prevMessages'],data['prompt'],data['model'])
    return jsonify({'response': response})