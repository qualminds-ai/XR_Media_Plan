import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Media.css';

const Media = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creativeStartDate, setCreativeStartDate] = useState('');
  const [creativeEndDate, setCreativeEndDate] = useState('');
  const [isciPllf, setIsciPllf] = useState('');
  const [isciMonth, setIsciMonth] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel' || 
                 file.type === 'text/csv' ||
                 file.name.endsWith('.xlsx') || 
                 file.name.endsWith('.xls') || 
                 file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setMessage('');
      setFileInfo(null);
    } else {
      setMessage('Please select a valid Excel file (.xlsx, .xls) or CSV file');
      setMessageType('error');
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const formatDateToMMDDYYYY = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatDateToYYYYMMDD = (mmddyyyy) => {
    if (!mmddyyyy) return '';
    const parts = mmddyyyy.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  };

  const handleStartDateChange = (event) => {
    const isoDate = event.target.value;
    setStartDate(formatDateToMMDDYYYY(isoDate));
  };

  const handleEndDateChange = (event) => {
    const isoDate = event.target.value;
    setEndDate(formatDateToMMDDYYYY(isoDate));
  };

  const handleCreativeStartDateChange = (event) => {
    const isoDate = event.target.value;
    setCreativeStartDate(formatDateToMMDDYYYY(isoDate));
  };

  const handleCreativeEndDateChange = (event) => {
    const isoDate = event.target.value;
    setCreativeEndDate(formatDateToMMDDYYYY(isoDate));
  };

  const handleIsciPllf = (event) => {
    setIsciPllf(event.target.value);
  };

  const handleIsciMonth = (event) => {
    setIsciMonth(event.target.value);
  };

  const handleGenerate = () => {
    // Collect all form data
    const formData = {
      placementStartDate: startDate,
      placementEndDate: endDate,
      creativeStartDate: creativeStartDate,
      creativeEndDate: creativeEndDate,
      isciPllf: isciPllf,
      isciMonth: isciMonth,
      fileInfo: fileInfo
    };
    
    console.log('Generate button clicked with data:', formData);
    // Add your generation logic here
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setMessageType('success');
      setFileInfo(response.data.file_info);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const renderPreviewTable = () => {
    if (!fileInfo || !fileInfo.preview || fileInfo.preview.length === 0) {
      return null;
    }

    const columns = fileInfo.column_names || Object.keys(fileInfo.preview[0]);

    return (
      <div>
        <h4>Data Preview (First 5 rows):</h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="preview-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileInfo.preview.map((row, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{row[column] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="media-container">
      <div className="header">
        <h1>Media Plan Manager</h1>
        <p>Upload your Excel (.xlsx, .xls) or CSV files and manage your media campaigns</p>
      </div>

      <div className="upload-section">
        <h3>File Upload</h3>
        <div 
          className={`upload-area ${isDragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h4>Drop your file here or click to browse</h4>
          <p>Supported formats: .xlsx, .xls, .csv</p>
          
          <div className="file-input">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
            />
          </div>
        </div>

        {selectedFile && (
          <div className="file-details">
            <p><strong>Selected file:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        <button 
          className="upload-btn" 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>

      <div className="sections-container">
        <div className="placements-section">
          <h3>Placements</h3>
          <div className="date-inputs">
            <div className="date-input-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={formatDateToYYYYMMDD(startDate)}
                onChange={handleStartDateChange}
                className="date-input"
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={formatDateToYYYYMMDD(endDate)}
                onChange={handleEndDateChange}
                className="date-input"
              />
            </div>
          </div>
        </div>

        <div className="creative-section">
        <h3>Creative</h3>
        <div className="date-inputs">
          <div className="date-input-group">
            <label htmlFor="creativeStartDate">Start Date:</label>
            <input
              type="date"
              id="creativeStartDate"
              value={formatDateToYYYYMMDD(creativeStartDate)}
              onChange={handleCreativeStartDateChange}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="creativeEndDate">End Date:</label>
            <input
              type="date"
              id="creativeEndDate"
              value={formatDateToYYYYMMDD(creativeEndDate)}
              onChange={handleCreativeEndDateChange}
              className="date-input"
            />
          </div>
        </div>
        
        <div className="isci-section">
          <div className="dropdown-inputs">
            <div className="dropdown-input-group">
              <label htmlFor="isciPllf">Creative ISCI:</label>
              <select
                id="isciPllf"
                value={isciPllf}
                onChange={handleIsciPllf}
                className="dropdown-input"
              >
                <option value="0">Select Creative</option>
                <option value="PLLF">PLLF</option>
                
              </select>
            </div>
            <div className="dropdown-input-group">
              <label htmlFor="isciMonth">Creative Month:</label>
              <select
                id="isciMonth"
                value={isciMonth}
                onChange={handleIsciMonth}
                className="dropdown-input"
              >
                <option value="">Select Month</option>
                <option value="01">01 - January</option>
                <option value="02">02 - February</option>
                <option value="03">03 - March</option>
                <option value="04">04 - April</option>
                <option value="05">05 - May</option>
                <option value="06">06 - June</option>
                <option value="07">07 - July</option>
                <option value="08">08 - August</option>
                <option value="09">09 - September</option>
                <option value="10">10 - October</option>
                <option value="11">11 - November</option>
                <option value="12">12 - December</option>
              </select>
            </div>
          </div>
          </div>
        </div>
      </div>

      {fileInfo && (
        <div className="file-info">
          <h3>File Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Filename:</strong>
              {fileInfo.filename}
            </div>
            <div className="info-item">
              <strong>Total Rows:</strong>
              {fileInfo.rows}
            </div>
            <div className="info-item">
              <strong>Total Columns:</strong>
              {fileInfo.columns}
            </div>
          </div>

          {fileInfo.column_names && (
            <div>
              <h4>Column Names:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {fileInfo.column_names.map((column, index) => (
                  <span key={index} style={{ 
                    background: '#e9ecef', 
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    fontSize: '14px' 
                  }}>
                    {column}
                  </span>
                ))}
              </div>
            </div>
          )}

          {renderPreviewTable()}
        </div>
      )}

      <div className="generate-section">
        <button 
          className="generate-btn" 
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default Media;
