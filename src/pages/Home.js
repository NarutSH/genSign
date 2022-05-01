import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputElement from "../Elements/InputElement";
import ToastImgEditor from "../Elements/ToastImgEditor";
import { BlobProvider, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDFRender from "../Elements/PDFRender";
import {
  dataURLtoFile,
  onHandleImgUpload,
  onHandlePDFUpload,
  onSignTemplateUpload,
} from "../services/func";
import { useToasts } from "react-toast-notifications";
import { updateIsLoading, updateRawFile } from "../redux/action/dataAction";

const Home = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);
  const signTemplateId = useSelector(
    (state) => state.dataReducer.signTemplateId
  );
  const signTemplateArray = useSelector(
    (state) => state.dataReducer.signTemplateArray
  );
  const onUpLoadImgToServer = async () => {
    dispatch(updateIsLoading(true));

    await onSignTemplateUpload(rawImages, signTemplateArray)
      .then((res) => {
        addToast(res.msg || "Saved Successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((err) => {
        addToast("something went wrong", {
          appearance: "error",
          autoDismiss: true,
        });
      })
      .finally(() => {
        dispatch(updateIsLoading(false));
      });
  };

  return (
    <div>
      <InputElement />
      <ToastImgEditor />
      {rawImages.length ? (
        <div className="d-flex justify-content-center align-items-center my-2">
          <div className="mx-2">
            <button
              style={{ minWidth: "150px", margin: "auto" }}
              className="btn btn-outline-primary "
              disabled={rawImages.length ? false : true}
              onClick={onUpLoadImgToServer}
            >
              Upload Images to Server
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
