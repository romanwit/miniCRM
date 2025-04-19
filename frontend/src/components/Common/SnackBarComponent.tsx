import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material';

interface SnackBarProps {
  message: string;
  severity?: AlertColor;
  duration?: number;
  onClose?: () => void;
}

export const SnackBarComponent: React.FC<SnackBarProps> = ({
  message,
  severity = 'error',
  duration = 3000,
  onClose
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      sx={{
        zIndex: 9999,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(150%, -50%)', 
        width: 'auto', 
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '400px',
          minHeight: '20px',
          fontSize: '1.5rem',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
