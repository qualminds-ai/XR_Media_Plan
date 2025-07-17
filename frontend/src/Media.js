import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Media.css';

const Media = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creativeStartDate, setCreativeStartDate] = useState('');
  const [creativeEndDate, setCreativeEndDate] = useState('');
  const [isciPllf, setIsciPllf] = useState('');
  const [isciMonth, setIsciMonth] = useState('');
  const [processProgress, setProcessProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Error states for validation
  const [fileError, setFileError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [creativeStartDateError, setCreativeStartDateError] = useState(false);
  const [creativeEndDateError, setCreativeEndDateError] = useState(false);
  const [isciPlflfError, setIsciPlflfError] = useState(false);
  const [isciMonthError, setIsciMonthError] = useState(false);

  const resetAllFields = () => {
    setSelectedFile(null);
    setStartDate('');
    setEndDate('');
    setCreativeStartDate('');
    setCreativeEndDate('');
    setIsciPllf('');
    setIsciMonth('');
    // Reset error states
    setFileError(false);
    setStartDateError(false);
    setEndDateError(false);
    setCreativeStartDateError(false);
    setCreativeEndDateError(false);
    setIsciPlflfError(false);
    setIsciMonthError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel' || 
                 file.type === 'text/csv' ||
                 file.name.endsWith('.xlsx') || 
                 file.name.endsWith('.xls') || 
                 file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setFileError(false);
    } else {
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
    setStartDateError(false);
  };

  const handleEndDateChange = (event) => {
    const isoDate = event.target.value;
    setEndDate(formatDateToMMDDYYYY(isoDate));
    setEndDateError(false);
  };

  const handleCreativeStartDateChange = (event) => {
    const isoDate = event.target.value;
    setCreativeStartDate(formatDateToMMDDYYYY(isoDate));
    setCreativeStartDateError(false);
  };

  const handleCreativeEndDateChange = (event) => {
    const isoDate = event.target.value;
    setCreativeEndDate(formatDateToMMDDYYYY(isoDate));
    setCreativeEndDateError(false);
  };

  const handleIsciPllf = (event) => {
    setIsciPllf(event.target.value);
    setIsciPlflfError(false);
  };

  const handleIsciMonth = (event) => {
    setIsciMonth(event.target.value);
    setIsciMonthError(false);
  };

  const handleGenerate = async () => {
    // Reset all error states first
    setFileError(false);
    setStartDateError(false);
    setEndDateError(false);
    setCreativeStartDateError(false);
    setCreativeEndDateError(false);
    setIsciPlflfError(false);
    setIsciMonthError(false);

    let hasErrors = false;

    // Validate that we have a selected file
    if (!selectedFile) {
      setFileError(true);
      hasErrors = true;
    }

    // Validate that all required fields are filled
    if (!startDate) {
      setStartDateError(true);
      hasErrors = true;
    }
    if (!endDate) {
      setEndDateError(true);
      hasErrors = true;
    }
    if (!creativeStartDate) {
      setCreativeStartDateError(true);
      hasErrors = true;
    }
    if (!creativeEndDate) {
      setCreativeEndDateError(true);
      hasErrors = true;
    }
    if (!isciPllf) {
      setIsciPlflfError(true);
      hasErrors = true;
    }
    if (!isciMonth) {
      setIsciMonthError(true);
      hasErrors = true;
    }

    // If there are validation errors, don't proceed
    if (hasErrors) {
      return;
    }

    setProcessing(true);
    setProcessProgress(0);

    try {
      // Create FormData to send file and data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('placementStartDate', startDate);
      formData.append('placementEndDate', endDate);
      formData.append('creativeStartDate', creativeStartDate);
      formData.append('creativeEndDate', creativeEndDate);
      formData.append('isciPllf', isciPllf);
      formData.append('isciMonth', isciMonth);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Send request to backend
      const response = await axios.post('https://xr-media-plan-api.onrender.com/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important for file download
      });

      clearInterval(progressInterval);
      setProcessProgress(100);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed_media_plan_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Reset all form fields after successful generation
      setTimeout(() => {
        resetAllFields();
      }, 2000);
      
    } catch (error) {
      console.error('Generation error:', error);
      // Error handling can be added here if needed in the future
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setProcessProgress(0);
      }, 2000);
    }
  };



  return (
    <div className="media-container">
      {processing && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${processProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">{processProgress}% Complete</div>
              <div className="loading-message">Processing your media plan...</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="header">
        <h1>Media Plan Manager</h1>
        <p>Upload your Excel (.xlsx, .xls) or CSV files and customize your media campaigns</p>
      </div>

      <div className="upload-section">
        <h3>File Upload</h3>
        <div 
          className={`upload-area ${isDragOver ? 'dragover' : ''} ${fileError ? 'error' : ''}`}
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
                className={`date-input ${startDateError ? 'error' : ''}`}
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={formatDateToYYYYMMDD(endDate)}
                onChange={handleEndDateChange}
                className={`date-input ${endDateError ? 'error' : ''}`}
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
              className={`date-input ${creativeStartDateError ? 'error' : ''}`}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="creativeEndDate">End Date:</label>
            <input
              type="date"
              id="creativeEndDate"
              value={formatDateToYYYYMMDD(creativeEndDate)}
              onChange={handleCreativeEndDateChange}
              className={`date-input ${creativeEndDateError ? 'error' : ''}`}
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
                className={`dropdown-input ${isciPlflfError ? 'error' : ''}`}
              >
                <option value="0">Select Creative</option>
                <option value="PLLF">PLLF</option>
                <option value="BH">BH</option>
                <option value="XYZ">XYZ</option>
                 <option value="PQR">PQR</option>
                
              </select>
            </div>
            <div className="dropdown-input-group">
              <label htmlFor="isciMonth">Creative Month:</label>
              <select
                id="isciMonth"
                value={isciMonth}
                onChange={handleIsciMonth}
                className={`dropdown-input ${isciMonthError ? 'error' : ''}`}
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

      <div className="generate-section">
        <button 
          className="generate-btn" 
          onClick={handleGenerate}
          disabled={processing || !selectedFile}
        >
          {processing ? 'Processing...' : 'Generate Media Plan'}
        </button>
      </div>
    </div>
  );
};

export default Media;
