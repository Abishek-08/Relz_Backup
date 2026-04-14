import React from 'react';
import { Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';

const LoadingModal = ({ open }) => {
    return (
        <Dialog
            open={open}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                },
            }}
        >
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                    <Typography variant="h6" style={{ marginTop: 20 }}>
                        Uploading...
                    </Typography>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoadingModal;
