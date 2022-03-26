import React, { useEffect, useRef, useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import { useSelector, useDispatch } from "react-redux";
import ModalSignaturePad from "./ModalSignaturePad";
import {
  updateRawImages,
  updatePageSelected,
  updateIsLoading,
  updateSignPosition,
} from "../redux/action/dataAction";
import { deleteSignature } from "../redux/action/signatureAction";
import { FaTimesCircle } from "react-icons/fa";
import ModalSelectPosition from "./ModalSelectPosition";
import TextToImage from "./TextToImage";
import DateToImage from "./DateToImage";
import mergeImages from "merge-images";
import { useForm } from "react-hook-form";
import resizebase64 from "resize-base64";
import Resizer from "react-image-file-resizer";
import { convertDate, dataURLtoFile } from "../services/func";

const ToastImgEditor = () => {
  const imageEditor = useRef();
  const [groupSign, setGroupSign] = useState(null);
  const [dateWidth, setDateWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);

  const [signatureSelected, setSignatureSelected] = useState(null);
  const [fullname, setFullname] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [nameSign, setNameSign] = useState("");
  const { register, handleSubmit, getValues, reset, watch } = useForm();
  const watchSignOption = watch("signOption");
  const dispatch = useDispatch();
  const getSignatures = useSelector(
    (state) => state.signatureReducer.signatures
  );
  const getNameSign = useSelector((state) => state.signatureReducer.nameSign);
  const getDateSign = useSelector((state) => state.signatureReducer.dateSign);
  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);

  const styles = {
    sampleSign: {
      width: "150px",
      height: "150px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  const resizeFile = async (data64, fName) => {
    const file = await dataURLtoFile(data64, fName);
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        500,
        500
      );
    });
  };

  const onHandleAddSign = async (signature) => {
    const instance = await imageEditor.current.getInstance();
    await instance.resetZoom();

    const idenSize = await resizeFile(signature);

    await instance.addImageObject(idenSize);
  };

  const onHandleSaveFile = async () => {
    dispatch(updateIsLoading(true));
    const instance = await imageEditor.current.getInstance();
    const dataUrl = instance.toDataURL();

    const updatedData = await rawImages.map((item, index) => {
      return item.pId === pageSelected.pId
        ? { pId: pageSelected.pId, img64: dataUrl }
        : item;
    });

    dispatch(updateRawImages(updatedData));
    dispatch(updatePageSelected());
    dispatch(updateIsLoading(false));
  };

  const onHandleDeleteSignature = (signature) => {
    dispatch(deleteSignature(signature, getSignatures));

    if (signatureSelected.sId == signature.sId) {
      setSignatureSelected(null);
    }
  };

  console.log({ dateWidth, nameWidth });

  const onHandleSignatureOption = async (ev) => {
    // const { signOption } = ev;

    if (watchSignOption && watchSignOption.length) {
      const list = watchSignOption?.map((item, index) => {
        let xDate = 0;
        if (index == 1) {
          if (nameWidth > 90 && nameWidth <= 100) {
            xDate = nameWidth / 10;
          } else if (nameWidth > 100 && nameWidth <= 150) {
            xDate = nameWidth / 5;
          } else if (nameWidth > 150) {
            xDate = nameWidth / 4;
          }
        } else if (index == 0 && watchSignOption.length == 2) {
          if (nameWidth < 50) {
            xDate = nameWidth / 2;
          }
        }

        return { src: item, x: xDate, y: index * 20 };
      });

      const imgMergedOption = await mergeImages(list, {
        height: 50,
      });

      let xSign = 0;

      if (nameWidth > 90 && nameWidth <= 100) {
        xSign = nameWidth / 5;
      } else if (nameWidth > 100 && nameWidth <= 150) {
        xSign = nameWidth / 4;
      } else if (nameWidth > 150) {
        xSign = nameWidth / 3;
      }

      const imgMergedSign = await mergeImages(
        [
          {
            src: resizebase64(signatureSelected.data64, 80, 50),
            x: xSign,
            y: 0,
          },
          {
            src: imgMergedOption,
            x: 0,
            y: 50,
          },
        ],
        {
          height: 100,
        }
      );

      setGroupSign(imgMergedSign);
    } else {
      setGroupSign(resizebase64(signatureSelected.data64, 80, 50));
    }
  };

  useEffect(() => {
    onHandleSignatureOption();
  }, [watchSignOption, signatureSelected]);

  useEffect(async () => {
    if (imageEditor && imageEditor.current && pageSelected) {
      const instance = await imageEditor.current.getInstance();

      instance.ui.text.textColor = "#000000";
      instance.ui.draw.colorPickerInputBox.defaultValue = "#000000";

      instance.loadImageFromURL(pageSelected.img64, pageSelected.pId);
    }
  }, [pageSelected]);

  const displayBtnSign = (
    <div className="my-2 d-flex">
      <div className="btn-group">
        <button
          type="button"
          className="btn dropdown-toggle btn-outline-white border border-2 d-flex justify-content-between align-items-center"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ minWidth: "200px" }}
        >
          {!signatureSelected ? (
            "Choose Signature"
          ) : (
            <img
              // onClick={() => onHandleAddSign(signatureSelected)}
              src={signatureSelected?.data64}
              style={{
                height: "25px",
                objectFit: "contain",
              }}
            />
          )}
        </button>

        <ul className="dropdown-menu">
          {getSignatures.length
            ? getSignatures.map((item) => {
                return (
                  <li
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    key={item.sId}
                  >
                    <span className="dropdown-item">
                      <div className="position-absolute top-50 end-0 translate-middle">
                        <FaTimesCircle
                          onClick={() => onHandleDeleteSignature(item)}
                        />
                      </div>
                      <img
                        // onClick={() => onHandleAddSign(item)}
                        onClick={() => setSignatureSelected(item)}
                        src={item.data64}
                        style={{
                          width: "100px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                      />
                    </span>
                  </li>
                );
              })
            : ""}
          <ModalSignaturePad setSignatureSelected={setSignatureSelected} />
        </ul>
      </div>

      <button
        disabled={groupSign ? false : true}
        onClick={(ev) => {
          ev.preventDefault();
          onHandleAddSign(groupSign);
        }}
        className="btn btn-primary mx-3 "
      >
        ลงนาม
      </button>

      <ModalSelectPosition signatureSelected={groupSign} />
    </div>
  );

  const displayInputName = (
    <div className="input-group  my-2">
      <input
        type="text"
        className="form-control"
        value={fullname}
        style={{ maxWidth: "200px" }}
        onChange={(ev) => setFullname(ev.target.value)}
      />

      <div className="form-check ms-3">
        <input
          disabled={fullname ? false : true}
          className="form-check-input"
          type="checkbox"
          value={getNameSign}
          {...register("signOption")}
        />
        <label className="form-check-label">แนบชื่อ</label>
      </div>

      <TextToImage name={fullname} setNameWidth={setNameWidth} />
    </div>
  );
  const displayInputDate = (
    <div className="input-group  my-2">
      <input
        type="date"
        className="form-control"
        value={selectedDate}
        style={{ maxWidth: "200px" }}
        onChange={(ev) => setSelectedDate(ev.target.value)}
      />

      <div className="form-check ms-3">
        <input
          disabled={selectedDate ? false : true}
          className="form-check-input"
          type="checkbox"
          value={getDateSign}
          {...register("signOption")}
        />
        <label className="form-check-label">แนบวันที่</label>
      </div>

      <DateToImage
        name={convertDate(selectedDate)}
        setDateWidth={setDateWidth}
      />
    </div>
  );

  return (
    <div>
      {pageSelected ? (
        <>
          <form
          // onInput={handleSubmit(onHandleSignatureOption)}
          >
            <div className="row">
              <div className="col">
                {displayBtnSign}
                {displayInputName}
                {displayInputDate}
              </div>
              <div className="col d-flex">
                {/* <div className="shadow" style={styles.sampleSign}>
                  <img
                    src={groupSign}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div> */}
              </div>
            </div>

            <div className="text-end my-2">
              <div onClick={onHandleSaveFile} className="btn btn-warning mx-2">
                Save changed
              </div>
            </div>
          </form>

          <ImageEditor
            ref={imageEditor}
            includeUI={{
              loadImage: {
                path: pageSelected.img64,
                name: pageSelected.pId,
              },
              initMenu: "",
              uiSize: {
                width: "100%",
                height: "80vh",
              },
              menuBarPosition: "bottom",
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
  );
};

export default ToastImgEditor;
