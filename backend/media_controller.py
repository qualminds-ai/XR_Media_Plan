from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from media_processor import MediaPlanProcessor

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize business logic processor
media_processor = MediaPlanProcessor()

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and return basic file information"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and media_processor.is_allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            file_info = media_processor.get_file_info(filepath, filename)
            return jsonify({
                'message': 'File uploaded successfully',
                'file_info': file_info
            })
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload .xlsx, .xls, or .csv files'}), 400

@app.route('/api/generate', methods=['POST'])
def generate_media_plan():
    """Generate processed media plan with form data"""
    try:
        # Validate file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file or not media_processor.is_allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Extract form data
        form_data = {
            'placement_start': request.form.get('placementStartDate', ''),
            'placement_end': request.form.get('placementEndDate', ''),
            'creative_start': request.form.get('creativeStartDate', ''),
            'creative_end': request.form.get('creativeEndDate', ''),
            'isci_pllf': request.form.get('isciPllf', ''),
            'isci_month': request.form.get('isciMonth', '')
        }
        
        # Process the media plan
        output, filename = media_processor.process_media_plan(file, form_data)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files', methods=['GET'])
def list_files():
    """List all uploaded files"""
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if media_processor.is_allowed_file(filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                files.append({
                    'filename': filename,
                    'size': os.path.getsize(filepath),
                    'modified': os.path.getmtime(filepath)
                })
        return jsonify({'files': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Media Plan API is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
