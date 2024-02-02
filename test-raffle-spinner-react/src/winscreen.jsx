import React, { useState } from 'react';
import Modal from 'react-modal';

// Make sure to set appElement to handle accessibility
Modal.setAppElement('#root');

const Winscreen = ({ isOpen, closeModal, modalText, remove }) => {
  const customStyles = {
    content: {
      width: '60%', // Set the width to your desired value
      margin: 'auto', // Center the modal horizontally
      maxHeight: '33%', // Set the maximum height to avoid taking up the entire viewport
      overflow: 'auto', // Enable vertical scrolling if needed
      Zindex: 2,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="win-screen"
      style={customStyles}
    >
      <div className="modal">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="modal-content">
          <p className="winner">{modalText}</p>
        </div>
        <button className="winButton" onClick={remove}>Okay</button>
      </div>
    </Modal>
  );
};

export default Winscreen;