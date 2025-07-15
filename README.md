# Excel File Uploader Application

A web application built with React frontend and Python Flask backend for uploading and analyzing Excel files.

## Features

- Upload Excel files (.xlsx, .xls) and CSV files
- Drag and drop file upload interface
- File validation and size limits
- Preview uploaded data (first 5 rows)
- Display file information (rows, columns, column names)
- Responsive design

## Prerequisites

- Python 3.7 or higher
- Node.js 14 or higher
- npm or yarn

## Setup Instructions

### Backend (Python Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend server will start on `http://localhost:5000`

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Upload an Excel or CSV file using either:
   - Drag and drop the file onto the upload area
   - Click the file input to browse and select a file
3. Click the "Upload File" button
4. View the file information and data preview

## API Endpoints

- `POST /api/upload` - Upload an Excel/CSV file
- `GET /api/files` - List uploaded files

## File Limitations

- Maximum file size: 16MB
- Supported formats: .xlsx, .xls, .csv
- Files are stored in the `backend/uploads` directory

## Project Structure

```
XR_Media_Plan/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── uploads/           # Uploaded files directory
└── frontend/
    ├── package.json       # Node.js dependencies
    ├── public/
    │   └── index.html     # HTML template
    └── src/
        ├── App.js         # Main React component
        ├── App.css        # App styles
        ├── index.js       # React entry point
        └── index.css      # Global styles
```

## Development Notes

- The frontend uses a proxy configuration to communicate with the backend
- CORS is enabled on the backend to allow frontend requests
- File uploads are handled using multipart/form-data
- Pandas is used for Excel file processing and data preview
