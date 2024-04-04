import React from 'react'
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import './MockIntv.css'
const MockIntv = () => {
      
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState(null);
  
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }
  
    function handleFileChange(event) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
    return (
        <div>

<input type="file" accept=".pdf" onChange={handleFileChange} />
      {file && (
        <div>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error('Error loading PDF:', error)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}



        </div>
    )
}

export default MockIntv