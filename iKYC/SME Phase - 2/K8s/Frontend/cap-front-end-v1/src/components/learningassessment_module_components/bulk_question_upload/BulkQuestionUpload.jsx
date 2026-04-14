import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import PreviewIcon from "@mui/icons-material/Preview";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CloudUploadOutlined, DeleteOutline, GetAppOutlined, InsertDriveFileOutlined, CheckCircleOutline, ClearOutlined } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Card, CardContent, Grid, Typography, Modal, Box } from "@mui/material";
import "../../../styles/learning_assessment_styles/BulkQuestionUpload.css";
import { addBulkQuestion } from "../../../services/learning_assessment_service/BulkQuestionService";
import { useNavigate } from "react-router-dom";
import GetNumberOfRows from "../GetNumberOfRows";
import BulkQuestionTemplate from "../bulk_question_upload/BulkQuestionTemplate";
import ModalComponent from "../bulk_question_upload/ModalComponent";
import { validateFile } from "../../../utils/learning_assessment_utils/BulkQuestionvalidation"; 

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

/**
 * @author karpagam.boothanathan
 * @since 12-08-2024
 * @version 7.0
 */

const BulkQuestionUpload = () => {
  // State to manage the selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // State to manage the modal visibility for upload summary
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // State to manage the preview button disable status
  const [previewDisabled, setPreviewDisabled] = useState(true);

  // State to manage loading status during submission
  const [isLoading, setLoading] = useState(false);

  // State to manage the preview modal visibility
  const [previewModalIsOpen, setPreviewModalIsOpen] = useState(false);

  // Function to close the preview modal
  const closeModal = () => setPreviewModalIsOpen(false);

  // State to hold the total number of questions from the file
  const [totalQuestions, setTotalQuestions] = useState(0);

  // State to manage the confirmation dialog for file upload
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Function to close the upload summary modal and navigate to the "allknowledgeQuestions" page
  const movetoViewAll = () => {
    setModalIsOpen(false);
    navigate("/allknowledgeQuestions");
  };


  // State to manage the upload results and skipped rows
  const [content, setContent] = useState({
    totalRows: 0,
    successfulUploads: 0,
    skippedRows: [],
  });
  const [groupedSkippedRows, setGroupedSkippedRows] = useState([]);

  // Handle file upload from file input
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateFile(file, setSelectedFile, setPreviewDisabled);
    }
  };

  // Handle file drop for drag-and-drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      validateFile(file, setSelectedFile, setPreviewDisabled);
    }
  };

  // Clear the selected file and reset the preview button status
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewDisabled(true);
  };

  // Prevent default behavior for drag-over event
  const handleDragOver = (event) => event.preventDefault();

  // Function to download the Excel template for file upload
  const exportTemplate = () => BulkQuestionTemplate();

  // Handle file submission and uploading
  const handleSubmit = async () => {
    setLoading(true);
    setConfirmationDialogOpen(false); // Close the confirmation dialog

    try {
      toast.loading("Uploading file...", { position: "top-right" });

      setTimeout(async () => {
        try {
          const response = await addBulkQuestion(selectedFile);

          if (response.status === 200) {
            setContent(response.data);
            toast.dismiss();

            // Show success or error message based on the upload result
            toast[response.data.successfulUploads > 0 ? "success" : "error"](
              response.data.successfulUploads > 0
                ? "File uploaded successfully!"
                : "No questions were uploaded successfully.",
              { position: "top-right" }
            );

            setModalIsOpen(true);
            setGroupedSkippedRows(groupSkippedRows(response.data.skippedRows));
          } else {
            toast.error("Failed to upload file. Please try again later.", {
              position: "top-right",
            });
          }
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle errors during file upload
  const handleError = (error) => {
    console.error("Error uploading file:", error);
    toast.dismiss();
    toast.error("Failed to upload file. Please try again later.", {
      position: "top-right",
    });
    setTimeout(() => toast.dismiss(), 3000);
  };

  // Group skipped rows based on the reason
  const groupSkippedRows = (skippedRows) => {
    return skippedRows.reduce((groups, row) => {
      const existingGroup = groups.find((group) => group.reason === row.reason);
      if (existingGroup) {
        existingGroup.rows.push(row.rowNumber);
      } else {
        groups.push({ reason: row.reason, rows: [row.rowNumber] });
      }
      return groups;
    }, []);
  };

  // Format row numbers for display
  const formatRowNumbers = (rows) => {
    let formattedRows = [];
    let start = rows[0];
    let end = rows[0];

    rows.slice(1).forEach((row) => {
      if (row === end + 1) {
        end = row;
      } else {
        formattedRows.push(end !== start ? `${start} to ${end}` : `${start}`);
        start = row;
        end = row;
      }
    });

    formattedRows.push(end !== start ? `${start} to ${end}` : `${start}`);
    return formattedRows.join(", ");
  };

  return (
    <div
      className="learning-uploadContainer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <Box className="learning-modalContent">
          <Typography variant="h5" gutterBottom style={{ textAlign: "center" }}>
            Upload Summary
          </Typography>
          <Typography>
            <b>Total Questions : {content.totalRows}</b>
            <br />
            {content.successfulUploads > 0 ? (
              <>
                <b style={{ color: "green" }}>
                  Successful Upload: {content.successfulUploads} Questions{" "}
                  <CheckCircleOutline
                    style={{ verticalAlign: "middle", color: "green" }}
                  />
                </b>
                <br />
              </>
            ) : (
              <>
                <b style={{ color: "red" }}>
                  No questions were uploaded successfully{" "}
                  <ClearOutlined
                    style={{
                      verticalAlign: "middle",
                      color: "red",
                      marginLeft: "5px",
                    }}
                  />
                </b>
                <br />
              </>
            )}
            {content.skippedRows.length > 0 ? (
              <>
                <b style={{ color: "red" }}>Skipped Questions:</b>{" "}
                {content.skippedRows.length}
                <br />
                <br />
                <Typography>
                  <b>
                    <i style={{ color: "darkblue", marginLeft: "35%" }}>
                      Skipped Reasons
                    </i>
                  </b>
                  <br />
                  <br />
                </Typography>
                {groupedSkippedRows.map((group, index) => (
                  <div key={index}>
                    <b>Question Row: {formatRowNumbers(group.rows)}</b> <br />
                    <b style={{ color: "blue" }}>Reason:</b> {group.reason}{" "}
                    <br />
                  </div>
                ))}
              </>
            ) : (
              <>
                <b style={{ color: "red" }}>Skipped Questions:</b> 0 <br />
              </>
            )}
          </Typography>
          <button
            style={{ marginLeft: "80%" }}
            onClick={movetoViewAll}
            className="btn btn-outline-dark"
          >
            Close
          </button>
        </Box>
      </Modal>

      <Card className="learning-uploadCard">
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            style={{ textAlign: "center", color: "darkblue" }}
          >
            <b>
              BULK QUESTION UPLOAD <FileUploadIcon />
            </b>
          </Typography>
          <br />
          <Grid container direction="column" spacing={2}>
            <Grid item className="learning-uploadHeader">
              <div className="learning-dragDropArea">
                <CloudUploadOutlined className="learning-uploadIcon" />
                <Typography className="learning-dragDropText">
                  Drag & Drop .xlsx File Here
                </Typography>
              </div>
              <label htmlFor="file-upload" className="learning-fileInputLabel">
                <InsertDriveFileOutlined className="learning-uploadIcon" />
                Choose .xlsx File
                <input
                  id="file-upload"
                  type="file"
                  className="learning-fileInput"
                  onChange={handleFileUpload}
                />
              </label>
              <Grid item className="learning-coloredgrid">
                <Typography variant="body2">
                  <b>
                    {" "}
                    Please refer to the below Excel template to upload questions{" "}
                  </b>{" "}
                  using any other template may result in errors or
                  inconsistencies{" "}
                  <Button
                    className="learning-exportButton"
                    startIcon={<GetAppOutlined />}
                    onClick={exportTemplate}
                  >
                    Download Template
                  </Button>
                </Typography>
              </Grid>
            </Grid>
            {selectedFile && (
              <Grid item className="learning-fileInfo">
                <div className="learning-selectedFile">
                  <InsertDriveFileOutlined className="learning-fileIcon" />
                  <div className="learning-fileDetails">
                    <Typography className="learning-fileName">
                      {selectedFile.name}
                    </Typography>
                    <DeleteOutline
                      className="learning-clearIcon"
                      onClick={handleClearFile}
                    />
                  </div>
                </div>
                <Button
                  className="learning-previewButton"
                  onClick={() => setPreviewModalIsOpen(true)}
                  disabled={previewDisabled}
                >
                  <Tooltip
                    title="PREVIEW"
                    style={{ color: "darkblue", width: "40px", height: "30px" }}
                  >
                    <PreviewIcon />
                  </Tooltip>
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                id="learning-submitButton"
                onClick={() => {
                  GetNumberOfRows(selectedFile)
                    .then((numberOfRows) => {
                      setTotalQuestions(numberOfRows);
                      setConfirmationDialogOpen(true); // Open confirmation dialog
                    })
                    .catch((error) =>
                      console.error("Error counting rows:", error)
                    );
                }}
                disabled={previewDisabled || isLoading}
                style={{ marginLeft: "40%" }}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ModalComponent
        isOpen={previewModalIsOpen}
        closeModal={closeModal}
        selectedFile={selectedFile}
      />

      <Dialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        aria-labelledby="learning-alert-dialog-title"
        aria-describedby="learning-alert-dialog-description"
      >
        <DialogTitle id="learning-alert-dialog-title">
          Are you sure you want to upload {totalQuestions} Questions?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="learning-alert-dialog-description">
            ⚠️Please double-check your Question Bank before Uploading!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialogOpen(false)} variant="contained" color="error">
            <Tooltip title="CANCEL" placement="left">
              No
            </Tooltip>
          </Button>
          <Button
            onClick={handleSubmit}
            autoFocus
            variant="contained"
            id="learning-alert-button-color"
          >
            <Tooltip title="UPLOAD QUESTIONBANK" placement="right">
              Yes
            </Tooltip>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BulkQuestionUpload;
