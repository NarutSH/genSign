import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";

const ModalPreviewPage = ({
  page,
  modalPreviewIsOpen,
  setModalPreviewIsOpen,
}) => {
  const signTemplateArray = useSelector(
    (state) => state.dataReducer.signTemplateArray
  );

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      maxWidth: "90vw",
      height: "90vh",
      overflow: "auto",
      zIndex: 9,
    },
    overlay: {
      zIndex: 9,
    },
  };

  const styles = {
    image: {
      position: "absolute",
      top: "0",
      left: "0",
    },
    signature: {
      position: "absolute",
      top: "0",
      left: "0",
    },
  };

  const closeModal = () => {
    setModalPreviewIsOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={modalPreviewIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="position-relative w-100 h-100">
          <img src={page?.img64} alt="image" style={styles.image} />
          {signTemplateArray.length ? (
            <img
              src={signTemplateArray[page?.status]?.signTemplate64}
              alt="signature"
              style={styles.signature}
            />
          ) : (
            ""
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ModalPreviewPage;
