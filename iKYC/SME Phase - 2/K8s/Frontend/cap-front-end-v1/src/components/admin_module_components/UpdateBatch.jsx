import { Button, Dialog, DialogActions, DialogContent, FormControl, FormGroup, FormLabel, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { checkBatchName, getBatchById, updateBatch } from "../../services/admin_module_services/BatchService";
import "../../styles/admin_module_styles/batch.css";

const UpdateBatch = ({ batchId, handleClose }) => {
  const [batchData, setBatchData] = useState({
    batchName: "",
    batchDescription: "",
    batchSize: 0,
  });
  const [showBatchError, setShowBatchError] = useState(false);

  useEffect(() => {
    if (batchId) {
      fetchBatchData();
    }
  }, [batchId]);

  const fetchBatchData = async () => {
    try {
      const response = await getBatchById(batchId);
      if (response.status !== 200) {
        throw new Error('Failed to fetch batch data');
      }
      const data = await response.data;
      setBatchData(data);
    } catch (error) {
      console.error('Error fetching batch data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchData((prevBatchData) => ({
      ...prevBatchData,
      [name]: value,
    }));
    if (name === 'batchName') {
      setShowBatchError(false);
    }
  };

  const handleBlur = async () => {
    try {
      const response = await checkBatchName(batchData.batchName);
      if (response.status === 200) {
        setShowBatchError(true);
      } else {
        setShowBatchError(false);
      }
    } catch (error) {
      console.error('Error checking batch name:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (showBatchError) {
        toast.error("Batch name already exists");
        return;
      }
      const response = await updateBatch(batchData);
      if (response.status === 200) {
        toast.success("Batch updated successfully");
        handleClose();
      } else {
        toast.error("Failed to update batch");
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" id="admin_module_update">
      <div id="admin_viewallbatch_add">
        <Typography variant="h6" component="h6" marginLeft={11}>
          <p id="admin_viewallbatch_p1">EDIT BATCH</p>
        </Typography>
      </div>
      {/* <DialogTitle id="admin_viewallbatch_p"></DialogTitle> */}
      <DialogContent sx={{ width: 400, padding: 4 }}>
        <FormGroup>
          <FormControl fullWidth margin="normal">
            <FormLabel>Batch Name</FormLabel>
            <TextField
              type="text"
              name="batchName"
              value={batchData.batchName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              variant="outlined"
              placeholder="Enter batch name"
              error={showBatchError}
              helperText={showBatchError && 'Batch name already exists'}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel>Batch Description</FormLabel>
            <TextField
              type="text"
              name="batchDescription"
              value={batchData.batchDescription}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Enter batch Description"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel>Batch Size</FormLabel>
            <TextField
              type="number"
              name="batchSize"
              value={batchData.batchSize}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Enter batch size"
            />
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} id="admin_module_cancel_button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" id="admin_module_update_button">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBatch;