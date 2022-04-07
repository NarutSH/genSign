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
import {
  convertDate,
  dataURLtoFile,
  getImageDimensions,
} from "../services/func";

const ToastImgEditor = () => {
  const imageEditor = useRef();
  const [groupSign, setGroupSign] = useState(null);
  const [dateWidth, setDateWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);

  const [signatureSelected, setSignatureSelected] = useState(null);
  const [fullname, setFullname] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [nameSign, setNameSign] = useState("");
  const [signDms, setSignDms] = useState(null);
  const [imgMerge, setImgMerge] = useState(null);
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
        3000,
        3000,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        1200,
        1200
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
    await instance.resetZoom();
    const dataUrl = await instance.toDataURL();
    const imgFile = await dataURLtoFile(dataUrl, pageSelected.imgName);

    const updatedData = await rawImages.map((item, index) => {
      return item.pId === pageSelected.pId
        ? {
            ...item,
            img64: dataUrl,
            imgFile,
            // imgDms: item.imgDms,
            // pId: pageSelected.pId,
          }
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

  useEffect(async () => {
    if (signatureSelected) {
      const img = new Image();
      img.src = await signatureSelected.data64;

      setSignDms(img.naturalWidth);
    }
  }, [signatureSelected]);

  const onHandleSignatureOption = async (ev) => {
    let containerWidth = 160;
    let optionLength = 0;

    if (watchSignOption && watchSignOption.length) {
      const newArr = watchSignOption.map((item) => {
        const portion = item.split(" ");

        const list = {
          type: portion[0],
          img64: portion[1],
          length: portion[2],
        };

        return list;
      });

      const getNameWidth =
        newArr.find((item) => item.type === "name")?.length || 0;
      const getDateWidth =
        newArr.find((item) => item.type === "date")?.length || 0;

      const textMaxLength = Math.max(+getNameWidth, +getDateWidth);

      optionLength = textMaxLength;

      const list = newArr?.map((item, index) => {
        let xText = 0;

        if (item.type === "name" && +getNameWidth < +getDateWidth) {
          xText = (getDateWidth - getNameWidth) / 2;
        } else if (item.type === "date" && +getDateWidth < +getNameWidth) {
          xText = (getNameWidth - getDateWidth) / 2;
        }

        return { src: item.img64, x: xText, y: index * 23 };
      });

      const imgMergedOption = await mergeImages(list, {
        height: 50,
      });

      setImgMerge(imgMergedOption);

      let xSign = 0;
      let xOption = 0;

      console.log({
        signDms,
        optionLength,
        textMaxLength,
        getNameWidth,
        getDateWidth,
      });

      if (160 > +optionLength) {
        xSign = 0;
        xOption = (160 - optionLength) / 2;
      } else if (160 < +optionLength) {
        xSign = (optionLength - 160) / 2;
        xOption = 0;
      }

      const imgMergedSign = await mergeImages(
        [
          {
            src: resizebase64(signatureSelected.data64, 160, 100),
            x: xSign,
            y: 0,
          },
          {
            src: imgMergedOption,
            x: xOption,
            y: 100,
          },
        ],
        {
          height: 200,
          width: Math.max(optionLength, 160),
        }
      );

      setGroupSign(imgMergedSign);
    } else {
      setGroupSign(signatureSelected.data64);
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
          value={`name ${getNameSign} ${nameWidth}`}
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
          value={`date ${getDateSign} ${dateWidth}`}
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
              {/* <div className="col d-flex"> */}
              {/* <div className="shadow" style={styles.sampleSign}>
                  <img
                    src={imgMerge}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="shadow" style={styles.sampleSign}>
                  <img
                    src={groupSign}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div> */}
              {/* </div> */}
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
            // cssMaxHeight={900}
            // cssMaxWidth={1200}
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
