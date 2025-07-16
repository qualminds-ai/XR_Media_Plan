# XR Media Plan Manager

A professional web application for processing and managing media plan Excel files with automated data updates and ISCI code transformations.

## Features

### File Processing
- Upload Excel files (.xlsx, .xls) and CSV files
- Drag and drop file upload interface with validation
- File validation and size limits (16MB max)
- Multi-sheet Excel workbook processing
- Preview uploaded data and file information

### Media Plan Processing
- **Placements Sheet Processing**: Automatically updates "Start Date" and "End Date" columns
- **Creative Sheet Processing**: Updates FlightStart, FlightEnd, and Creative ISCI columns
- **ISCI Code Transformation**: Intelligent string manipulation to replace month codes in Creative ISCI values
- **Form Data Integration**: Seamlessly integrates user input with Excel data
- **Original Format Preservation**: Maintains Excel formatting and structure

### User Interface
- Clean, responsive design with red header theme
- Field-level validation with visual error feedback
- Side-by-side form layout for placements and creative data
- Real-time form validation with red border highlighting
- Success/error messaging system

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
   pip install flask flask-cors pandas openpyxl werkzeug
   ```

4. Run the Flask server:
   ```bash
   python media_controller.py
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

### Basic Workflow
1. Open your browser and go to `http://localhost:3000`
2. Upload an Excel file containing Placements and Creative sheets
3. Fill in the form data:
   - **Placements Section**: Start Date and End Date
   - **Creative Section**: Start Date, End Date, Creative ISCI, and Creative Month
4. Click "Generate" to process the media plan
5. Download the processed Excel file with updated data

### ISCI Code Processing
The system automatically processes Creative ISCI codes by:
- Finding the Creative ISCI value in each row (e.g., "BH")
- Locating the 2 characters immediately following the ISCI code
- Replacing those characters with the specified Creative Month
- Example: `BH072530H` → `BH122530H` (when Creative Month = "12")

## API Endpoints

- `POST /api/upload` - Upload and validate Excel/CSV files
- `POST /api/generate` - Process media plan with form data
- `GET /api/files` - List uploaded files
- `GET /api/health` - Health check endpoint

## Architecture

### Clean Architecture Implementation
- **Controller Layer** (`media_controller.py`): HTTP request handling and routing
- **Business Logic Layer** (`media_processor.py`): Media plan processing logic
- **Separation of Concerns**: Clear distinction between web layer and business logic

### Key Components
- **MediaPlanProcessor**: Core business logic class
- **Multi-Sheet Processing**: Intelligent sheet detection and processing
- **Error Handling**: Comprehensive validation and error reporting
- **Console Logging**: Detailed processing logs for debugging

## Project Structure

```
XR_Media_Plan/
├── backend/
│   ├── media_controller.py    # Flask routes and HTTP handling
│   ├── media_processor.py     # Business logic and Excel processing
│   └── uploads/              # Uploaded files directory
└── frontend/
    ├── package.json          # Node.js dependencies
    ├── public/
    │   └── index.html        # HTML template
    └── src/
        ├── Media.js          # Main React component with form logic
        ├── Media.css         # Styled components and validation
        ├── App.js            # React app wrapper
        └── index.js          # React entry point
```

## Technical Features

### Frontend (React)
- Material-UI inspired styling
- Form validation with visual feedback
- Error state management
- File upload with progress indication
- Responsive grid layout

### Backend (Python)
- Flask REST API
- OpenPyXL for Excel manipulation
- Pandas for data processing
- CORS enabled for cross-origin requests
- Comprehensive error handling and logging

### Data Processing
- Preserves original Excel formatting
- Multi-sheet workbook support
- Intelligent column detection
- String manipulation for ISCI codes
- Date format handling (MM/DD/YYYY)

## Development Notes

- Frontend uses proxy configuration for backend communication
- Detailed console logging for debugging and monitoring
- Automatic sheet detection based on naming conventions
- Robust error handling for edge cases
- Field-level validation prevents invalid submissions
