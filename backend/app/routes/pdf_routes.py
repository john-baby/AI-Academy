import os
from datetime import datetime
from flask import request, jsonify, Blueprint
from werkzeug.utils import secure_filename
from app.utils.pdf_utils import RAGSystem, allowed_file
from dotenv import load_dotenv
load_dotenv()

pdf_bp = Blueprint('pdf', __name__)

@pdf_bp.route('/upload_document/', methods=['POST'])
def upload_document():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), filename)
            file.save(file_path)
            
            try:
                return jsonify({
                    'success': True,
                    'message': 'File uploaded and processed successfully',
                    'filename': filename
                })
            except Exception as e:
                return jsonify({
                    'success': False,
                    'message': f'Error processing document: {str(e)}'
                }), 500
                
        return jsonify({'success': False, 'message': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Upload failed: {str(e)}'}), 500

@pdf_bp.route('/list_documents/', methods=['GET'])
def list_documents():
    try:
        documents = []
        for filename in os.listdir(os.getenv('UPLOAD_FOLDER')):
            file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), filename)
            documents.append({
                'filename': filename,
                'uploaded_at': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat(),
                'file_path': file_path
            })
        return jsonify({'success': True, 'documents': documents})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@pdf_bp.route('/delete_document/<filename>', methods=['DELETE'])
def delete_document(filename):
    try:
        file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), secure_filename(filename))
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True, 'message': 'Document deleted successfully'})
        return jsonify({'success': False, 'message': 'Document not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error deleting document: {str(e)}'}), 500

# @pdf_bp.route('/rag_query/', methods=['POST'])
# def rag_query():
#     try:
#         data = request.get_json()
#         query = data.get("query")
#         filename = data.get("filename")
        
#         if not query or not filename:
#             return jsonify({
#                 "status": "error",
#                 "message": "Query and filename are required"
#             }), 400
        
#         file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), secure_filename(filename))
#         if not os.path.exists(file_path):
#             print(file_path)
#             return jsonify({
#                 "status": "error",
#                 "message": f"File not found: {filename}"
#             }), 404
        
#         rag_system = RAGSystem(pdf_path=file_path, api_key=os.getenv('GOOGLE_API_KEY'))
#         response = rag_system.generate_response(query)
#         return jsonify({
#             "status": "success",
#             "response": response
#         })
    
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "message": str(e)
#         }), 500

# @pdf_bp.route('/summarize/', methods=['POST'])
# def summarize():
#     try:
#         data = request.get_json()
#         filename = data.get("filename")
        
#         if not filename:
#             return jsonify({
#                 "status": "error",
#                 "message": "Filename is required"
#             }), 400
        
#         file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), secure_filename(filename))
#         if not os.path.exists(file_path):
#             return jsonify({
#                 "status": "error",
#                 "message": f"File not found: {filename}"
#             }), 404
        
#         rag_system = RAGSystem(pdf_path=file_path, api_key=os.getenv('GOOGLE_API_KEY'))
#         summary = rag_system.generate_response("Please provide a comprehensive summary of this document.")
        
#         return jsonify({
#             "status": "success",
#             "summary": summary
#         })
    
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "message": str(e)
#         }), 500

@pdf_bp.route('/rag_query/', methods=['POST'])
def rag_query():
    try:
        data = request.get_json()
        query = data.get("query")
        filename = data.get("filename")
        
        if not query or not filename:
            return jsonify({
                "status": "error",
                "message": "Query and filename are required"
            }), 400
        
        file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), secure_filename(filename))
        if not os.path.exists(file_path):
            return jsonify({
                "status": "error",
                "message": f"File not found: {filename}"
            }), 404
        
        # Use existing FAISS index if available
        rag_system = RAGSystem(pdf_path=file_path, api_key=os.getenv('GOOGLE_API_KEY'))
        response = rag_system.generate_response(query)
        
        return jsonify({
            "status": "success",
            "response": response
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@pdf_bp.route('/summarize/', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        filename = data.get("filename")
        
        if not filename:
            return jsonify({
                "status": "error",
                "message": "Filename is required"
            }), 400
        
        file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), secure_filename(filename))
        if not os.path.exists(file_path):
            return jsonify({
                "status": "error",
                "message": f"File not found: {filename}"
            }), 404
        
        # Use stored FAISS index
        rag_system = RAGSystem(pdf_path=file_path, api_key=os.getenv('GOOGLE_API_KEY'))
        summary = rag_system.generate_response("Please provide a comprehensive summary of this document.")
        
        return jsonify({
            "status": "success",
            "summary": summary
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
