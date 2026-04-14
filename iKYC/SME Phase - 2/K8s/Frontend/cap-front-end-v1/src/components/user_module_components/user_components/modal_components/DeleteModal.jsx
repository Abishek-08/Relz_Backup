import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteDetails } from '../../../../services/user_module_service/ProfileService';

const DeleteModal = ({ open, onClose, deleteObject, onDelete }) => {
  
  const [objectId, setObjectId] = useState(null);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    if (deleteObject) {
      // Initialize variables to track which ID and label to use
      let id = null;
      let typeLabel = null;

      if (deleteObject.academicId) {
        id = deleteObject.academicId;
        typeLabel = "academic";
      } else if (deleteObject.workExperienceId) {
        id = deleteObject.workExperienceId;
        typeLabel = "workexperience";
      } else if (deleteObject.certificateId) {
        id = deleteObject.certificateId;
        typeLabel = "certifications";
      } else if (deleteObject.skillsId) {
        id = deleteObject.skillsId;
        typeLabel = "skill";
      }

      // Update state with the determined ID and label
      setObjectId(id);
      setLabel(typeLabel);
    }
  }, [deleteObject]);

  const handleConfirmDelete = async () => {
    if (!objectId || !label) {
      toast.error('ID or label not found.');
      return;
    }

    try {
      // Call deleteDetails with label and objectId
      await deleteDetails(label, objectId);
      toast.success('Record deleted successfully!');
      onDelete(objectId + label);
      onClose();
    } catch (error) {
      toast.error('Error deleting the record. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="user-module-usrdb-modal-container">
        <h2>Confirm Deletion?</h2>
        <p>Are you sure you want to delete this record?</p>
        <div className="d-flex justify-content-center column-gap-2">
          <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
            Confirm
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
