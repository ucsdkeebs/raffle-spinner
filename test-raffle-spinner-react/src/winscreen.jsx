import React, { useState } from 'react';
import Modal from 'react-modal';

// Make sure to set appElement to handle accessibility
Modal.setAppElement('#root');

const Winscreen = ({ isOpen, closeModal, modalText }) => {
  const customStyles = {
    content: {
      width: '60%', // Set the width to your desired value
      margin: 'auto', // Center the modal horizontally
      maxHeight: '33%', // Set the maximum height to avoid taking up the entire viewport
      overflow: 'auto', // Enable vertical scrolling if needed
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="win-screen"
      style={customStyles}
    >
      <span className="close" onClick={closeModal}>&times;</span>
      <div className="modal-content">
        <p className="winner">{modalText}</p>
      </div>
    </Modal>
  );
};

export default Winscreen;