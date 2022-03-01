import React, { useEffect, useRef } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import { useSelector, useDispatch } from "react-redux";
import ModalSignaturePad from "./ModalSignaturePad";
import {
  updateRawImages,
  updatePageSelected,
  updateIsLoading,
} from "../redux/action/dataAction";
import { deleteSignature } from "../redux/action/signatureAction";
import { FaTimesCircle } from "react-icons/fa";

const ToastImgEditor = () => {
  const imageEditor = useRef();
  const dispatch = useDispatch();
  const getSignatures = useSelector(
    (state) => state.signatureReducer.signatures
  );
  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);

  const onHandleAddSign = async (signature) => {
    const instance = await imageEditor.current.getInstance();
    await instance.resetZoom();

    const res = await imageEditor.current.imageEditorInst;
    res.ui.mask.actions.loadImageFromURL(signature.data64);
  };

  const onHandleSaveFile = async () => {
    // dispatch(updateIsLoading(true));
    const instance = await imageEditor.current.getInstance();
    const dataUrl = instance.toDataURL();

    const updatedData = await rawImages.map((item, index) => {
      return item.pId === pageSelected.pId
        ? { pId: pageSelected.pId, img64: dataUrl }
        : item;
    });

    dispatch(updateRawImages(updatedData));
    dispatch(updatePageSelected());
  };

  const onHandleDeleteSignature = (signature) => {
    dispatch(deleteSignature(signature, getSignatures));
  };

  useEffect(async () => {
    if (imageEditor && imageEditor.current && pageSelected) {
      const instance = await imageEditor.current.getInstance();

      instance.ui.text.textColor = "#000000";
      instance.ui.draw.colorPickerInputBox.defaultValue = "#000000";

      instance.loadImageFromURL(pageSelected.img64, pageSelected.pId);
    }
  }, [pageSelected]);

  const displayBtnGroup = (
    <div className="my-2">
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-primary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Add Signature
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
                        onClick={() => onHandleAddSign(item)}
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
          <ModalSignaturePad />
        </ul>
      </div>

      <div onClick={onHandleSaveFile} className="btn btn-warning mx-2">
        Save changed
      </div>
    </div>
  );

  return (
    <div>
      {pageSelected ? (
        <>
          {displayBtnGroup}
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
