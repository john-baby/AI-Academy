from flask import Blueprint, request, jsonify
import json
import re
from app.utils.mcq_utils import MCQGenerator

mcq_bp = Blueprint('mcq', __name__)

@mcq_bp.route('/generatemcq/', methods=['POST'])
def generate_mcq():
    """
    API Endpoint to generate MCQs.
    """
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = request.get_json()
            chapter_name = data.get('chapter_name')
        except (json.JSONDecodeError, TypeError):
            return jsonify({'error': 'Invalid JSON format'}), 400
        
        # Validate chapter name
        if not chapter_name:
            return jsonify({'error': 'Chapter name is required'}), 400
        
        # Create MCQ Generator instance
        generator = MCQGenerator()
        
        try:
            # Generate MCQs
            mcqs = generator.generate_mcq_for_chapter(chapter_name)
            
            # Optionally save answers
            # generator.save_answers(chapter_name, mcqs)
            
            # Return full MCQ details
            return jsonify({
                'message': 'MCQs generated successfully', 
                'answer_key': mcqs
            })
        except Exception as e:
            # Log the error
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid request method'}), 405
