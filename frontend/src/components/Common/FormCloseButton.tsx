import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface FormCloseButtonProps {
  path: string;
}

const FormCloseButton: React.FC<FormCloseButtonProps> = ({ path }) => {
  const handleClick = () => {
    window.location.href = path;
  };

  return (
    <IconButton
      onClick={handleClick}
      style={{
        position: 'relative',
        left: '320px',
        top: '40px',
        cursor: 'pointer',
        fontSize: '24px',
        color: '#757575',
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default FormCloseButton;
