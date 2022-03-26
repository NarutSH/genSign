import React, { useEffect, useRef, useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import {
  updateRawImages,
  updateSignPosition,
  updateIsLoading,
} from "../redux/action/dataAction";
import { useToasts } from "react-toast-notifications";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import mergeImages from "merge-images";
import { dataURLtoFile } from "../services/func";
import Resizer from "react-image-file-resizer";

const ModalSelectPosition = ({ signatureSelected }) => {
  const imageEditorPosition = useRef();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [modalPosition, setModalPosition] = useState(false);
  const [scale, setScale] = useState(500);
  const [multiSelected, setMultiSelected] = useState([]);
  const [resultsSign, setResultsSign] = useState([]);
  const [transformSign, setTransformSign] = useState(null);
  const [signObjId, setSignObjId] = useState(null);

  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);
  const signPosition = useSelector((state) => state.dataReducer.signPosition);
  const getSignatures = useSelector(
    (state) => state.signatureReducer.signatures
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
      overflowY: "auto",
    },
    overlay: {
      zIndex: 9,
    },
  };

  const resizeFile = (file, dms) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        2000,
        2000,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        dms,
        dms
      );
    });

  const imgStyle = (page) => {
    return {
      width: "100px",
      height: "150px",
      objectFit: "contain",
      margin: "10px",
      cursor: "pointer",
      border: multiSelected.find((item) => item.pId === page.pId)
        ? "2px solid blue"
        : "",
    };
  };

  const openModal = (ev) => {
    ev.preventDefault();
    setModalPosition(true);
  };

  const closeModal = () => {
    setModalPosition(false);
    dispatch(updateSignPosition(null));
    setMultiSelected([]);
    setResultsSign([]);
  };

  const inst = imageEditorPosition?.current?.getInstance();

  console.log(inst);

  const onHandleAddSign = async () => {
    const instance = await imageEditorPosition.current.getInstance();
    await instance.resetZoom();
    await instance.clearObjects();

    await instance.addImageObject(transformSign);

    // const res = await imageEditorPosition.current.imageEditorInst;

    // res.ui.mask.actions.loadImageFromURL(transformSign);
  };

  const onSelectPosition = async (_, point) => {
    const instance = await imageEditorPosition.current.getInstance();

    instance.setObjectPosition(signObjId, {
      x: point.x,
      y: point.y,
      originX: "left",
      originY: "top",
    });

    dispatch(updateSignPosition(point));
    addToast("เลือกตำแหน่งเรียบร้อยแล้ว", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const onImageClick = (page) => {
    const isExisting = multiSelected.find((item) => item.pId == page.pId);
    if (!isExisting) {
      setMultiSelected((multiSelected) => [...multiSelected, page]);
    } else {
      const list = multiSelected.filter((item) => item.pId !== page.pId);

      setMultiSelected(list);
    }
  };

  const onMultiSign = async (ev) => {
    ev.preventDefault();
    dispatch(updateIsLoading(true));

    multiSelected.forEach(async (item, index) => {
      const img64 = await mergeImages([
        { src: item.img64, x: 0, y: 0 },
        { src: transformSign, x: signPosition.x, y: signPosition.y },
      ]);

      const list = {
        pId: item.pId,
        img64,
      };

      setResultsSign((resultsSign) => [...resultsSign, list]);

      if (index == multiSelected.length - 1) {
        dispatch(updateIsLoading(false));
      }
    });
  };

  const onHandleScaleChange = async (ev) => {
    setScale(ev.target.value);

    const instance = await imageEditorPosition.current.getInstance();
    await instance.resetZoom();
    await instance.clearObjects();
    await instance.addImageObject(transformSign);
  };

  useEffect(() => {
    if (multiSelected.length && resultsSign.length === multiSelected.length) {
      const updatedRaw = rawImages.map((rawImg) => {
        const match = resultsSign.find((resSign) => {
          return rawImg.pId === resSign.pId;
        });

        return match ? match : rawImg;
      });

      dispatch(updateRawImages(updatedRaw));
      closeModal();
    }
  }, [resultsSign]);

  useEffect(() => {
    if (!multiSelected.length) {
      dispatch(updateSignPosition(null));
    }
  }, [multiSelected]);

  useEffect(async () => {
    const file = await dataURLtoFile(signatureSelected, "");
    const idenSize = await resizeFile(file, scale);
    setTransformSign(idenSize);
  }, [signatureSelected, scale]);

  return (
    <>
      <button
        disabled={signatureSelected ? false : true}
        onClick={openModal}
        // onClick={() => onHandleAddSign(signatureSelected)}
        className="btn btn-outline-primary mx-2"
      >
        ลงนามหลายเอกสาร
      </button>

      <Modal
        isOpen={modalPosition}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="ModalPosition"
      >
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3>ลงนามหลายเอกสาร</h3>
            <div className="text-center ">
              <button
                disabled={
                  signPosition && multiSelected.length && signatureSelected
                    ? false
                    : true
                }
                onClick={onMultiSign}
                className="btn btn-primary mx-2"
              >
                ลงนามเอกสารที่เลือก
              </button>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-start">
              <div className="me-4 fw-bold">เลือกรูปภาพ</div>
              {multiSelected.length ? (
                <FaCheckCircle color="green" />
              ) : (
                <FaTimesCircle color="red" />
              )}
            </div>
            <div className="d-flex align-items-center flex-wrap my-2">
              {rawImages?.map((page) => {
                return (
                  <div
                    className="d-block mx-2 shadow  position-relative my-2"
                    style={{ cursor: "pointer" }}
                    key={page.pId}
                  >
                    <img
                      src={page.img64}
                      onClick={() => onImageClick(page)}
                      alt="ref"
                      style={imgStyle(page)}
                      className="m-auto"
                    />
                  </div>
                );
              })}
            </div>

            {multiSelected.length ? (
              <>
                <div className="d-flex align-items-center justify-content-start">
                  <div className="me-4 fw-bold">
                    กรุณาเลือกตำแหน่งของลายเซ็น
                  </div>
                  {signPosition ? (
                    <FaCheckCircle color="green" />
                  ) : (
                    <FaTimesCircle color="red" />
                  )}
                </div>

                <div className="my-2 d-flex align-items-center">
                  <div>ปรับขนาดลายเซ็น</div>
                  <div style={{ minWidth: "800px", marginLeft: "20px" }}>
                    <input
                      type="range"
                      className="form-range"
                      value={scale}
                      onChange={onHandleScaleChange}
                      min={100}
                      max={1000}
                      step={20}
                    />
                  </div>
                </div>

                <div className="my-2">
                  <button className="btn btn-warning" onClick={onHandleAddSign}>
                    ดูตัวอย่าง
                  </button>
                </div>

                <ImageEditor
                  ref={imageEditorPosition}
                  onMousedown={onSelectPosition}
                  onObjectActivated={(ev) => setSignObjId(ev.id)}
                  includeUI={{
                    loadImage: {
                      path: multiSelected[0].img64,
                      name: multiSelected[0].pId,
                    },
                    initMenu: "",
                    menu: ["mask"],
                    uiSize: {
                      width: "100%",
                      height: "80vh",
                    },
                  }}
                  cssMaxHeight={900}
                  cssMaxWidth={1200}
                  selectionStyle={{
                    cornerSize: 20,
                    rotatingPointOffset: 70,
                  }}
                  usageStatistics={true}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalSelectPosition;
