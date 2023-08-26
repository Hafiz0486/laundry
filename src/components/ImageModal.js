import React from 'react';

// Inside the ImageModal component
const ImageModal = ({ imageUrl, onClose, fullscreen }) => {
  const handleCloseClick = () => {
    onClose();
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`modal ${fullscreen ? 'fullscreen' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-content">
        <img
          className={`fullscreen-image ${fullscreen ? 'clickable' : ''}`}
          src={imageUrl}
          alt="modal"
          onClick={fullscreen ? handleCloseClick : null}
        />
      </div>
    </div>
  );
};

export default ImageModal;
