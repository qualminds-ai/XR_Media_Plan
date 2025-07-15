from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import io

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Read the Excel file
            if filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)
            
            # Get basic info about the file
            file_info = {
                'filename': filename,
                'rows': len(df),
                'columns': len(df.columns),
                'column_names': df.columns.tolist(),
                'preview': df.head(5).to_dict('records') if len(df) > 0 else []
            }
            
            return jsonify({
                'message': 'File uploaded successfully',
                'file_info': file_info
            })
        
        except Exception as e:
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload .xlsx, .xls, or .csv files'}), 400

@app.route('/api/generate', methods=['POST'])
def generate_media_plan():
    try:
        # Get the uploaded file
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Get form data
        placement_start = request.form.get('placementStartDate', '')
        placement_end = request.form.get('placementEndDate', '')
        creative_start = request.form.get('creativeStartDate', '')
        creative_end = request.form.get('creativeEndDate', '')
        isci_pllf = request.form.get('isciPllf', '')
        isci_month = request.form.get('isciMonth', '')
        
        # Read the uploaded file
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)
        
        # TODO: Add your processing logic here
        # For now, we'll just add the form data as new columns
        processed_df = df.copy()
        
        # Add the form data as new columns
        processed_df['Placement_Start_Date'] = placement_start
        processed_df['Placement_End_Date'] = placement_end
        processed_df['Creative_Start_Date'] = creative_start
        processed_df['Creative_End_Date'] = creative_end
        processed_df['ISCI_PLLF'] = isci_pllf
        processed_df['ISCI_Month'] = isci_month
        processed_df['Processed_Date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Create Excel file in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            processed_df.to_excel(writer, sheet_name='Processed_Media_Plan', index=False)
        
        output.seek(0)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'processed_media_plan_{timestamp}.xlsx'
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({'error': f'Error processing media plan: {str(e)}'}), 500

@app.route('/api/files', methods=['GET'])
def list_files():
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                files.append({
                    'filename': filename,
                    'size': os.path.getsize(filepath),
                    'modified': os.path.getmtime(filepath)
                })
        return jsonify({'files': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
