import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import '../../styles/learning_assessment_styles/ModalComponent.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfoIcon from '@mui/icons-material/Info';

/**
 * @author karpagam.boothanathan
 * @since 06-07-2024
 * @version 2.0
 */

/**
 * @author karpagam.boothanathan
 * @since 02-08-2024
 * @version 6.0
 */

const ModalComponent = ({ isOpen, closeModal, selectedFile }) => {
  const [previewData, setPreviewData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSkippedReasonsModal, setShowSkippedReasonsModal] = useState(false);
  const [skippedRows, setSkippedRows] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setEditMode(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const dataArr = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (dataArr.length > 2) {
          const headers = dataArr[0];
          const questionTypeIndex = headers.indexOf("Question Type");

          if (questionTypeIndex === -1) {
            setPreviewData([]);
            setSkippedRows([]);
            return;
          }

          const serialNumberHeader = "Serial No";
          const updatedHeaders = [serialNumberHeader, ...headers];
          const rows = [];
          const skipped = [];

          dataArr.slice(1, -1).forEach((row, rowIndex) => {
            const filledRow = [];
            const serialNumber = (rowIndex + 1).toString(); // Ensure serial number is a string
            filledRow.push(serialNumber);
            for (let i = 0; i < headers.length; i++) {
              filledRow.push((row[i] !== undefined && row[i] !== '' ? row[i] : "NA").toString());
            }

            const questionType = filledRow[questionTypeIndex + 1];
            const secondColumnContent = filledRow[1];
            const seventhColumnContent = filledRow[6];
            const CorrectAnswerColumnContent = filledRow[15];

            let hasValidationError = false;

            // Validation for Question Type
            if (questionType !== "SSQ" && questionType !== "MSQ") {
              skipped.push({
                serialNumber,
                questionContent: secondColumnContent,
                reason: `Invalid question type: ${questionType}`
              });
              hasValidationError = true;
            }

            // Validation for Question content
            if (secondColumnContent === "NA" || !secondColumnContent) {
              skipped.push({
                serialNumber,
                reason: "Question content is missing",
                columnName: "Second Column"
              });
              hasValidationError = true;
            }

            // Validation for Question mark
            if (seventhColumnContent === "NA" || !seventhColumnContent) {
              skipped.push({
                serialNumber,
                reason: "Question Mark is missing",
                columnName: "Seventh Column"
              });
              hasValidationError = true;
            }

            // Validation for Correct Answer
            if (CorrectAnswerColumnContent === "NA" || !CorrectAnswerColumnContent) {
              skipped.push({
                serialNumber,
                reason: "Correct Answer is missing",
                columnName: "Correct Answer Column"
              });
              hasValidationError = true;
            }

            // New validation: Check if there are at least 7 "NA" values in columns 7 to 14
            const naCount = filledRow.slice(7, 15).filter(cell => cell === "NA").length;
            if (naCount >= 7) {
              skipped.push({
                serialNumber,
                reason: "Less than 2 options are provided",
                columnName: "Columns 7-14"
              });
              hasValidationError = true;
            }

            rows.push({
              row: filledRow,
              hasError: hasValidationError
            });
          });

          // Exclude the last row from preview data
          const finalData = [updatedHeaders, ...rows.map(item => item.row)];
          setPreviewData(finalData);
          setSkippedRows(skipped);
        } else {
          setPreviewData([]);
          setSkippedRows([]);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }, [selectedFile]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const saveChanges = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmSave = () => {
    // Exclude the "Serial No" column from both headers and data rows
    const updatedHeaders = previewData[0].filter((header, index) => index !== 0);
    const updatedData = previewData.slice(1).map(row => row.filter((_, index) => index !== 0));
    
    // Add headers to the data
    const finalData = [updatedHeaders, ...updatedData];
    
    // Create the sheet and workbook
    const updatedSheet = XLSX.utils.aoa_to_sheet(finalData);
    const updatedWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(updatedWorkbook, updatedSheet, 'Sheet1');
  
    // Write the workbook to a binary array and trigger download
    const wbout = XLSX.write(updatedWorkbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Updated_bulk_upload.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  
    // Notify the user of success
    toast.success('Changes saved successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  
    setEditMode(false);
    setShowConfirmationModal(false);
  };

  const handleCancelSave = () => {
    setShowConfirmationModal(false);
  };

  const handleShowSkippedReasons = () => {
    setShowSkippedReasonsModal(true);
  };

  const handleCloseSkippedReasons = () => {
    setShowSkippedReasonsModal(false);
  };

  const handleInputChange = (e, rowIndex, cellIndex) => {
    if (cellIndex === 0) return; // Prevent editing of the Serial No column
    
    const { value } = e.target;
    const updatedData = [...previewData];
    updatedData[rowIndex + 1][cellIndex] = value;
    setPreviewData(updatedData);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Preview Modal"
        className="modal-learning"
        overlayClassName="modal-overlay-learning"
      >
        <div className="modal-header-learning">
          <h2 style={{color:'#060270',fontWeight:'bold'}}>Bulk Question Preview</h2>
          <div className="modal-buttons-learning">
            {editMode ? (
              <button className="save-button-learning" onClick={saveChanges}>
                Save
              </button>
            ) : (
              <button className="edit-button-learning" onClick={handleEdit}>
                <EditIcon /> Edit
              </button>
            )}
            <div className="skipped-reason-button-container">
              <button  className="skipped-reason-button" onClick={handleShowSkippedReasons}>
                <InfoIcon /> Skipped Reasons
              </button>
              {skippedRows.length > 0 && (
                <span className="badge">{skippedRows.length}</span>
              )}
            </div>
            <button className="close-button-learning" onClick={closeModal}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="modal-body-learning">
          {previewData.length > 1 ? (
            <table className="preview-table-learning">
              <thead>
                <tr>
                  {previewData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className={skippedRows.some(skipped => skipped.serialNumber === row[0]) ? 'error-row' : ''}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={cellIndex === row.length - 1 ? 'green-column' : ''}>
                        {cellIndex === 0 ? ( // Serial No column
                          cell
                        ) : (
                          editMode ? (
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleInputChange(e, rowIndex, cellIndex)}
                            />
                          ) : (
                            cell.toString() // Ensure cell is rendered as a string
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data to preview</p>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={handleCancelSave}
        contentLabel="Confirmation Modal"
        className="modal-confirm-learning"
        overlayClassName="modal-overlay-learning"
      >
        <div className="confirm-modal-body-learning">
          <p>Are you sure you want to save changes? If you click yes, the updated file will be downloaded to your machine.</p>
          <div className="modal-buttons-learning">
            <button className="save-button-learning" onClick={handleConfirmSave}>
              yes
            </button>
            <button className="close-button-learning" onClick={handleCancelSave}>
              No
            </button>
          </div>
        </div>
      </Modal>

      {/* Skipped Reasons Modal */}
      <Modal
        isOpen={showSkippedReasonsModal}
        onRequestClose={handleCloseSkippedReasons}
        contentLabel="Skipped Reasons Modal"
        className="modal-skipped-reasons" /* Use the appropriate class */
        overlayClassName="modal-overlay-learning"
      >
        <div className="modal-header-learning">
          <h3 style={{ color: "#060270", fontWeight: 'bold' }}>Skipped Reasons</h3>
          <button className="close-button-learning" onClick={handleCloseSkippedReasons}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body-learning">
          {skippedRows.length > 0 ? (
            <table className="skipped-reasons-table-learning">
              <thead>
                <tr>
                  <th>Question No</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {skippedRows.map((skipped, index) => (
                  <tr key={index}>
                    <td>{skipped.serialNumber}</td>
                    <td>{skipped.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No skipped questions</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalComponent;
