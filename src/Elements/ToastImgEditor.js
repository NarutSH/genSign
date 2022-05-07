import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import { useSelector, useDispatch } from "react-redux";
import ModalSignaturePad from "./ModalSignaturePad";
import {
  updateRawImages,
  updatePageSelected,
  updateIsLoading,
  updateSignPosition,
  updateSignTemplateId,
  updateSignTemplateArray,
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
import {
  convertDate,
  convertToDataURL,
  dataURLtoFile,
  fetchToFile,
  getImageDimensions,
  random_rgba,
  readFileData,
} from "../services/func";

const ToastImgEditor = () => {
  const imageEditor = useRef();

  // const instnc = imageEditor?.current?.instance();
  // console.log({ instnc });

  const [groupSign, setGroupSign] = useState(null);
  const [dateWidth, setDateWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);
  const [blank64, setBlank64] = useState(null);

  const [signatureSelected, setSignatureSelected] = useState(null);
  const [fullname, setFullname] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [nameSign, setNameSign] = useState("");
  const [signDms, setSignDms] = useState(null);
  const [imgMerge, setImgMerge] = useState(null);
  // const [imgBlank, setImgBlank] = useState("");
  const { register, handleSubmit, getValues, reset, watch } = useForm();
  const watchSignOption = watch("signOption");
  const dispatch = useDispatch();
  const getSignatures = useSelector(
    (state) => state.signatureReducer.signatures
  );
  const getNameSign = useSelector((state) => state.signatureReducer.nameSign);
  const getDateSign = useSelector((state) => state.signatureReducer.dateSign);
  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const signTemplateId = useSelector(
    (state) => state.dataReducer.signTemplateId
  );
  const signTemplateArray = useSelector(
    (state) => state.dataReducer.signTemplateArray
  );
  const rawImages = useSelector((state) => state.dataReducer.rawImages);

  const onHandleAddObject = async (data64) => {
    const instance = await imageEditor.current.getInstance();
    await instance.resetZoom();

    await instance.addImageObject(data64);
  };

  const onHandleSaveFile = async () => {
    let sgnId = +signTemplateId;
    let bgColor = random_rgba();
    dispatch(updateIsLoading(true));
    const instance = await imageEditor.current.getInstance();
    await instance.resetZoom();

    await instance.applyFilter("removeColor", { distance: 10 });

    const dataUrl = await instance.toDataURL();
    const signTempFile = await dataURLtoFile(
      dataUrl,
      `sign_${signTemplateId}.png`
    );

    const updatedData = await rawImages.map((item) => {
      return pageSelected.indexOf(item) !== -1
        ? {
            ...item,
            status: +sgnId,
            bgColor,
          }
        : item;
    });

    const listSign = {
      signTemplate64: dataUrl,
      signTempFile,
      signTemplateId,
    };

    const tempSign = [...signTemplateArray, listSign];

    dispatch(updateSignTemplateId((sgnId += 1)));
    dispatch(updateSignTemplateArray(tempSign));
    dispatch(updateRawImages(updatedData));
    dispatch(updatePageSelected([]));
    dispatch(updateIsLoading(false));
  };

  const onHandleDeleteSignature = (signature) => {
    dispatch(deleteSignature(signature, getSignatures));

    if (signatureSelected.sId == signature.sId) {
      setSignatureSelected(null);
    }
  };

  useEffect(async () => {
    if (signatureSelected) {
      const img = new Image();
      img.src = await signatureSelected.data64;

      setSignDms(img.naturalWidth);
    }
  }, [signatureSelected]);

  useEffect(() => {
    setFullname("");
    setSelectedDate("");
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
        style={{ minWidth: "100px" }}
        disabled={signatureSelected ? false : true}
        onClick={(ev) => {
          ev.preventDefault();
          onHandleAddObject(signatureSelected.data64);
        }}
        className="btn btn-primary mx-3 "
      >
        ลงนาม
      </button>
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

      <button
        style={{ minWidth: "100px" }}
        disabled={getNameSign ? false : true}
        onClick={(ev) => {
          ev.preventDefault();
          onHandleAddObject(getNameSign);
        }}
        className="btn btn-primary mx-3 "
      >
        ลงชื่อ
      </button>

      <TextToImage name={fullname} />
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

      <button
        style={{ minWidth: "100px" }}
        disabled={selectedDate && getDateSign ? false : true}
        onClick={(ev) => {
          ev.preventDefault();
          onHandleAddObject(getDateSign);
        }}
        className="btn btn-primary mx-3 "
      >
        ลงวันที่
      </button>

      <DateToImage name={convertDate(selectedDate)} />
    </div>
  );

  return (
    <div>
      {pageSelected.length ? (
        <>
          <form>
            <div className="row">
              <div className="col">
                {displayBtnSign}
                {displayInputName}
                {displayInputDate}
              </div>
            </div>

            <img src={getNameSign} />

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
                path: pageSelected[0].img64,
                name: "SampleImage",
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
