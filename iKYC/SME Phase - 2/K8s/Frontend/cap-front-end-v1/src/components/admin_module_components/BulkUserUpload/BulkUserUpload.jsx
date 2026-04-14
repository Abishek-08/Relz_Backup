import React, { useState } from "react";
import {
  Button,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
} from "@mui/material";
import * as XLSX from "xlsx";
import Card from "@mui/material/Card";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingModal from "./LoadingModal";
import BulkUserUploadComponentStyle from "../../../styles/admin_module_styles/BulkUserUpload/BulkUserUploadComponentStyle.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { addBulkUsers } from "../../../services/admin_module_services/AdminService";

const templateHeaders = ["Name", "Email", "Mobile", "Gender"];

function BulkUserUpload() {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSkippedModal, setOpenSkippedModal] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [skippedRecords, setSkippedRecords] = useState([]);
  const [fileName, setFileName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [uploadSummary, setUploadSummary] = useState({
    validCount: 0,
    invalidCount: 0,
  });
  const [editingSkippedIndex, setEditingSkippedIndex] = useState(null); // Index of record being edited
  const [isLoading, setIsLoading] = useState(false);

  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
  const [openSkippedEmail, setOpenSkippedEmail] = useState(false);
  const [emailList, setEmailList] = useState([]); // State to hold the list of emails
  const [fileUploaded, setFileUploaded] = useState(false); // Add state for tracking file upload

  const formData = new FormData();

  const navigate = useNavigate();

  const templateData = [
    ["Name", "Email", "Mobile", "Gender"],
    ["END OF DATA.."],
  ];

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobileNumber = (mobile) => /^\d{10}$/.test(mobile);
  const isValidName = (name) => {
    return /^[a-zA-Z ]+$/.test(name);
  };
  const isValidGender = (gender) => ["Male", "Female"].includes(gender);

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "User_Details_Template.xlsx";
    link.click();
  };

  const findDuplicateMobiles = (data) => {
    const mobileNumbers = {};
    const duplicates = new Set();

    data.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      const mobile = row[2]; // Assuming mobile is in the third column
      if (mobileNumbers[mobile]) {
        duplicates.add(mobile);
      } else {
        mobileNumbers[mobile] = true;
      }
    });

    return duplicates;
  };

  const handleFileUpload = (file) => {
    if (
      !file ||
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast.error("Please upload a valid .xlsx file.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (JSON.stringify(json[0]) !== JSON.stringify(templateHeaders)) {
        setError("The uploaded file does not match the required format.");
      } else {
        const duplicateMobiles = findDuplicateMobiles(json);
        const validRecords = [];
        const skippedRecords = [];

        json.slice(1).forEach((row) => {
          if (
            row[0] !== "END OF DATA.." &&
            row.every((cell) => cell !== null && cell !== undefined)
          ) {
            const email = row[1];
            const mobile = row[2];
            const name = row[0];
            const gender = row[3];

            if (
              isValidEmail(email) &&
              isValidMobileNumber(mobile) &&
              isValidName(name) &&
              isValidGender(gender) &&
              !duplicateMobiles.has(mobile)
            ) {
              validRecords.push(row);
            } else {
              const skippedRecord = {};
              templateHeaders.forEach((header, index) => {
                skippedRecord[header] = row[index] || "N/A";
              });
              skippedRecord.reason = [];
              if (!isValidEmail(email)) {
                skippedRecord.reason.push("Invalid email format");
              }
              if (!isValidMobileNumber(mobile)) {
                skippedRecord.reason.push("Invalid mobile number format");
              }
              if (!isValidName(name)) {
                skippedRecord.reason.push("Invalid Name");
              }
              if (!isValidGender(gender)) {
                skippedRecord.reason.push("Invalid Gender");
              }
              if (duplicateMobiles.has(mobile)) {
                skippedRecord.reason.push("Duplicate mobile number");
              }
              skippedRecords.push(skippedRecord);
            }
          }
        });

        setEditableData(validRecords);
        setSkippedRecords(skippedRecords);
        setFileData(validRecords);
        setFileName(file.name);
        setUploadSummary({
          validCount: validRecords.length,
          invalidCount: skippedRecords.length,
        });
        setError("");
        setOpenModal(true);
        setFileUploaded(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleConfirmUpload = async () => {
    if (!fileData || fileData.length === 0) {
      toast.error("No data Available to Upload", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const ws = XLSX.utils.json_to_sheet(fileData, { header: templateHeaders });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileBlob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const formData = new FormData();
    formData.append("file", fileBlob, "User_Details.xlsx"); // 'User_Details.xlsx' is the filename

    setIsLoading(true); // Start loading
    try {
      // const response = await axios.post('http://localhost:8090/cap/user/bulkuser', formData, {
      //     headers: {
      //         'Content-Type': 'multipart/form-data'
      //     }
      // });

      const response = await addBulkUsers(formData);

      if (response.status === 200) {
        const data = response.data;

        // Convert object to array of emails
        const emails = Object.values(data);

        if (emails.length === 0) {
          // Display success message if no emails are returned
          setOpenSuccessMessage(true);
        } else {
          // Show the modal with the list of emails
          setEmailList(emails); // Set the emails in state
          setOpenSkippedEmail(true);
        }
      } else {
        toast.error("File Upload failed.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }

    setOpenModal(false);
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const updatedData = editableData.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === cellIndex ? value : cell))
        : row
    );
    setEditableData(updatedData);
  };

  const hasDuplicateMobile = (mobile, currentIndex = -1) => {
    const checkDuplicate = (data) =>
      data.some(
        (item, index) =>
          index !== currentIndex &&
          (Array.isArray(item) ? item[2] === mobile : item.Mobile === mobile)
      );

    return (
      checkDuplicate(editableData) ||
      checkDuplicate(skippedRecords) ||
      checkDuplicate(fileData)
    );
  };

  const handleExportEditedData = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([templateHeaders, ...editableData]);
    XLSX.utils.book_append_sheet(wb, ws, "Edited Data");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Edited_User_Details.xlsx";
    link.click();
  };

  const handleViewSkippedRecords = () => {
    setOpenSkippedModal(true);
  };

  const handleSaveEditedRecords = () => {
    const updatedValidRecords = [];
    const updatedSkippedRecords = [...skippedRecords];

    editableData.forEach((row, index) => {
      const email = row[1];
      const mobile = row[2];
      const name = row[0];
      const gender = row[3];

      if (
        isValidEmail(email) &&
        isValidMobileNumber(mobile) &&
        isValidName(name) &&
        isValidGender(gender) &&
        !hasDuplicateMobile(mobile, index)
      ) {
        updatedValidRecords.push(row);
      } else {
        const invalidRecord = {};
        templateHeaders.forEach((header, idx) => {
          invalidRecord[header] = row[idx] || "N/A";
        });
        invalidRecord.reason = [];
        if (!isValidEmail(email)) {
          invalidRecord.reason.push("Invalid email format");
        }
        if (!isValidMobileNumber(mobile)) {
          invalidRecord.reason.push("Invalid mobile number format");
        }
        if (!isValidName(name)) {
          invalidRecord.reason.push("Invalid Name");
        }
        if (!isValidGender(gender)) {
          invalidRecord.reason.push("Invalid Gender");
        }
        if (hasDuplicateMobile(mobile, index)) {
          invalidRecord.reason.push("Duplicate mobile number");
        }
        updatedSkippedRecords.push(invalidRecord);
      }
    });

    const combinedSkippedRecords = updatedSkippedRecords;

    setFileData(updatedValidRecords);
    setEditableData(updatedValidRecords);
    setSkippedRecords(combinedSkippedRecords);
    setUploadSummary({
      validCount: updatedValidRecords.length,
      invalidCount: combinedSkippedRecords.length,
    });

    setIsEditing(false);
    setOpenModal(true);

    // Show a toast notification
    toast.info(
      `${updatedValidRecords.length} valid records, ${combinedSkippedRecords.length} skipped records`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  };

  const handleExportSkippedRecords = () => {
    const recordsWithoutReason = skippedRecords.map((record) => {
      const { reason, ...recordWithoutReason } = record;
      return recordWithoutReason;
    });

    const ws = XLSX.utils.json_to_sheet(recordsWithoutReason, {
      header: templateHeaders,
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Skipped Records");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Skipped_Records.xlsx";
    link.click();
  };

  const handleEditSkippedRecord = (index) => {
    setEditingSkippedIndex(index);
    setOpenSkippedModal(true);
  };

  const handleUpdateSkippedRecord = (index, field, value) => {
    const updatedSkippedRecords = skippedRecords.map((record, i) => {
      if (i === index) {
        const updatedRecord = { ...record, [field]: value };

        // Check for duplicate mobile number
        if (field === "Mobile" && hasDuplicateMobile(value, index)) {
          updatedRecord.reason = updatedRecord.reason.filter(
            (r) => r !== "Duplicate mobile number"
          );
          updatedRecord.reason.push("Duplicate mobile number");
        } else if (field === "Mobile") {
          updatedRecord.reason = updatedRecord.reason.filter(
            (r) => r !== "Duplicate mobile number"
          );
        }

        return updatedRecord;
      }
      return record;
    });
    setSkippedRecords(updatedSkippedRecords);
  };

  const handleSaveSkippedRecordChanges = () => {
    const updatedValidRecords = [];
    const updatedSkippedRecords = [];

    skippedRecords.forEach((record, index) => {
      const email = record.Email;
      const mobile = record.Mobile;
      const name = record.Name;
      const gender = record.Gender;

      if (
        isValidEmail(email) &&
        isValidMobileNumber(mobile) &&
        isValidName(name) &&
        isValidGender(gender) &&
        !hasDuplicateMobile(mobile, index)
      ) {
        updatedValidRecords.push([
          record.Name,
          record.Email,
          record.Mobile,
          record.Gender,
        ]);
      } else {
        const updatedRecord = { ...record };
        if (hasDuplicateMobile(mobile, index)) {
          updatedRecord.reason = updatedRecord.reason.filter(
            (r) => r !== "Duplicate mobile number"
          );
          updatedRecord.reason.push("Duplicate mobile number");
        }
        updatedSkippedRecords.push(updatedRecord);
      }
    });

    setFileData([...fileData, ...updatedValidRecords]);
    setEditableData([...editableData, ...updatedValidRecords]);
    setSkippedRecords(updatedSkippedRecords);
    setUploadSummary({
      validCount: editableData.length + updatedValidRecords.length,
      invalidCount: updatedSkippedRecords.length,
    });
    setOpenSkippedModal(false);
    setOpenModal(true); // Re-open the main modal with updated data
  };

  // const handleSaveSkippedRecordChanges = () => {
  //   const updatedValidRecords = [];
  //   const updatedSkippedRecords = [];

  //   skippedRecords.forEach((record) => {
  //     const email = record.Email; // Ensure index matches the data structure
  //     const mobile = record.Mobile; // Ensure index matches the data structure
  //     const name = record.Name;
  //     const gender = record.Gender;

  //     if (
  //       isValidEmail(email) &&
  //       isValidMobileNumber(mobile) &&
  //       isValidName(name) &&
  //       isValidGender(gender)
  //     ) {
  //       updatedValidRecords.push([
  //         record.Name,
  //         record.Email,
  //         record.Mobile,
  //         record.Gender,
  //       ]);
  //     } else {
  //       updatedSkippedRecords.push(record);
  //     }
  //   });

  //   setFileData([...fileData, ...updatedValidRecords]);
  //   setEditableData([...editableData, ...updatedValidRecords]);
  //   setSkippedRecords(updatedSkippedRecords);
  //   setUploadSummary({
  //     validCount: editableData.length + updatedValidRecords.length,
  //     invalidCount: updatedSkippedRecords.length,
  //   });
  //   setOpenSkippedModal(false);
  //   setOpenModal(true); // Re-open the main modal with updated data
  // };

  const handleCancelSkippedRecordEdit = () => {
    setEditingSkippedIndex(null);
    setOpenSkippedModal(false);
  };

  // Calculate rows to display
  const paginatedData = editableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePreview = () => {
    setOpenModal(true); // Re-open the main modal with updated data
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
        alignItems: "center",
      }}
    >
      <LoadingModal open={isLoading} />{" "}
      {/* Add the LoadingModal component here */}
      <Card
        sx={{
          maxWidth: 450,
          minHeight: 400,
          maxHeight: 400,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          padding: 2,
        }}
      >
        <div className="Bulk_user_Upload_Title_Parent">
          <p className="Bulk_User_Upload_Title">BULK USER UPLOAD</p>
        </div>
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "2px dashed grey",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: dragging ? "#f0f0f0" : "#fff",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Typography variant="h5">Drag and Drop .xlsx File Here</Typography>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => {
              const file = e.target.files[0];
              handleFileUpload(file);
            }}
            style={{ display: "none" }}
            id="upload-input"
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              sx={{ background: "#060270", color: "white", width: "418px" }}
            >
              Select File
            </Button>
          </label>
        </Box>
        <Box
          sx={{
            backgroundColor: "#d3d3d6",
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            padding: 2,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 12 }}>
            Please use the specified Excel template for uploading User Details.
            Using any other template may result in discrepancies or issues.
          </Typography>
          <Button onClick={downloadTemplate} sx={{ color: "#060270" }}>
            Download Template
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
          {fileUploaded && (
            <Button
              variant="contained"
              onClick={handlePreview}
              sx={{ background: "#060270", color: "white", width: "418px" }}
            >
              Preview
            </Button>
          )}
        </Box>
      </Card>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Review and Edit Uploaded Data</DialogTitle>
        <DialogContent>
          <Typography>
            {`${uploadSummary.validCount} records uploaded successfully.`}
          </Typography>
          {skippedRecords.length > 0 && (
            <Button onClick={handleViewSkippedRecords} sx={{ color: "red" }}>
              View Skipped Records ({skippedRecords.length})
            </Button>
          )}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {templateHeaders.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {isEditing ? (
                          <TextField
                            value={cell || ""}
                            onChange={(e) =>
                              handleCellChange(
                                rowIndex,
                                cellIndex,
                                e.target.value
                              )
                            }
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        ) : (
                          cell || "N/A"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={editableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="contained">
              Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button onClick={() => setIsEditing(false)}>Cancel Edit</Button>
              <Button onClick={handleExportEditedData} variant="contained">
                Export Edited Data
              </Button>
              <Button onClick={handleSaveEditedRecords} variant="contained">
                Save Edited Records
              </Button>
            </>
          )}
          <Button onClick={handleConfirmUpload} variant="contained">
            Confirm Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSkippedModal}
        onClose={() => setOpenSkippedModal(false)}
      >
        <DialogTitle>Skipped Records Due to Validation Issues</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {templateHeaders.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                  <TableCell>Reason for Skipping</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skippedRecords.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {templateHeaders.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {editingSkippedIndex === rowIndex ? (
                          <TextField
                            value={row[header] || ""}
                            onChange={(e) =>
                              handleUpdateSkippedRecord(
                                rowIndex,
                                header,
                                e.target.value
                              )
                            }
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        ) : (
                          row[header] || "N/A"
                        )}
                      </TableCell>
                    ))}
                    <TableCell>{row.reason.join(", ")}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEditSkippedRecord(rowIndex)}
                        variant="contained"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportSkippedRecords} variant="contained">
            Export Skipped Records
          </Button>
          <Button onClick={handleSaveSkippedRecordChanges} variant="contained">
            Save Changes
          </Button>
          <Button onClick={handleCancelSkippedRecordEdit}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSuccessMessage}
        onClose={() => setOpenSuccessMessage(false)}
      >
        <DialogContent>
          <Typography>All User Records Uploaded Successfully </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenSuccessMessage(false);
              navigate("/viewalluser");
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSkippedEmail}
        onClose={() => setOpenSkippedEmail(false)}
      >
        <DialogContent>
          <TableContainer component={Paper}>
            <DialogTitle>
              The Records with these Emails already exists. Other Records
              Uploaded Successfully
            </DialogTitle>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailList.map((email, index) => (
                  <TableRow key={index}>
                    <TableCell>{email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenSkippedEmail(false);
              navigate("/viewalluser");
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}

export default BulkUserUpload;
