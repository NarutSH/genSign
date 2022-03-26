import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSignature,
  deleteSignature,
} from "../redux/action/signatureAction";
import Modal from "react-modal";
import _ from "lodash";
import { BsPlusCircle } from "react-icons/bs";

const ModalSignaturePad = ({ setSignatureSelected }) => {
  const signatureRef = useRef();
  const getSignatures = useSelector(
    (state) => state.signatureReducer.signatures
  );
  const dispatch = useDispatch();
  const [modalSignOpen, setModalSignOpen] = useState(false);
  const [colorPicked, setColorPicked] = useState("black");
  const [thicknessPicked, setThicknessPicked] = useState(0.5);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      zIndex: 9,
    },
  };

  const openModal = () => {
    setModalSignOpen(true);
  };

  const closeModal = () => {
    setModalSignOpen(false);
  };

  const onHandleGetSign = async () => {
    const trimCanvas = await signatureRef.current.getTrimmedCanvas();
    const data64 = await trimCanvas.toDataURL("image/png");
    const obj = {
      sId: _.uniqueId("sign"),
      data64,
    };

    const listSignatures = [...getSignatures, obj];

    dispatch(updateSignature(listSignatures));
    setSignatureSelected(obj);

    await signatureRef.current.clear();
    closeModal();
  };

  return (
    <div>
      <li style={{ cursor: "pointer" }} onClick={openModal}>
        <span className="dropdown-item text-center">
          <BsPlusCircle size="1.5em" />
        </span>
      </li>
      <Modal
        isOpen={modalSignOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="ModalSignaturePad"
      >
        <div>
          <div className="border">
            <SignatureCanvas
              ref={signatureRef}
              penColor={colorPicked}
              canvasProps={{ className: "signCanvas" }}
              minWidth={thicknessPicked}
              // dotSize={1}
            />
          </div>
          <div className="my-2 row">
            <div className="col-12 col-lg-5 d-flex">
              <label className="form-label">Color : </label>
              <input
                type="color"
                value={colorPicked}
                onChange={(ev) => setColorPicked(ev.target.value)}
                className="ms-2"
              />
            </div>

            <div className="col-12 col-lg-7 d-flex">
              <label className="form-label text-nowrap">Thickness : </label>
              <input
                type="range"
                className="form-range px-2"
                value={thicknessPicked}
                onChange={(ev) => setThicknessPicked(ev.target.value)}
                min={0.5}
                max={10}
                step="1"
              />
            </div>
          </div>
          <div className="text-center my-2">
            <div className="btn btn-info mx-2" onClick={onHandleGetSign}>
              Submit
            </div>
            <div
              className="btn btn-outline-warning mx-2"
              onClick={() => signatureRef.current.clear()}
            >
              Clear
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalSignaturePad;
