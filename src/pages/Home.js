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
} from "../services/func";
import { useToasts } from "react-toast-notifications";
import { updateIsLoading, updateRawFile } from "../redux/action/dataAction";

const Home = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [dirName, setDirName] = useState("");

  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);

  const onUpLoadImgToServer = async () => {
    dispatch(updateIsLoading(true));
    await onHandleImgUpload(rawImages, dirName)
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
  // const onUpLoadPDFToServer = async (blobFile) => {
  //   await dispatch(updateIsLoading(true));
  //   await onHandlePDFUpload(blobFile)
  //     .then((res) => {
  //       addToast(res.msg || "Saved Successfully", {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });

  //       dispatch(updateRawFile(null));
  //     })
  //     .catch((err) => {
  //       addToast("something went wrong", {
  //         appearance: "error",
  //         autoDismiss: true,
  //       });
  //     })
  //     .finally(() => {
  //       dispatch(updateIsLoading(false));
  //     });
  // };

  return (
    <div>
      <InputElement />
      <ToastImgEditor />
      {rawImages.length ? (
        <div className="d-flex justify-content-center align-items-center my-2">
          <div className="mx-2">
            <input
              onChange={(ev) => setDirName(ev.target.value)}
              value={dirName}
              type="text"
              placeholder="Directory name"
              className="form-control"
            />
          </div>
          <div className="mx-2">
            <button
              style={{ minWidth: "150px", margin: "auto" }}
              className="btn btn-outline-primary "
              disabled={rawImages.length && dirName ? false : true}
              onClick={onUpLoadImgToServer}
            >
              Upload Images to Server
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* <PDFViewer>
            <PDFRender rawImages={rawImages} />
          </PDFViewer> */}

      {/* {rawImages && rawImages.length ? (
        <>
          <div className="text-center my-2">
            <PDFDownloadLink
              document={<PDFRender rawImages={rawImages} />}
              fileName={rawImages[0]?.pId}
            >
              {({ blob, url, loading, error }) => {
                if (loading) {
                  dispatch(updateIsLoading(loading));
                } else {
                  setTimeout(() => {
                    dispatch(updateIsLoading(loading));
                  }, 5000);
                }

                return (
                  <button
                    style={{ minWidth: "150px" }}
                    className="btn btn-outline-primary "
                    disabled={rawImages.length ? false : true}
                  >
                    {loading ? spinner : "Download PDF"}
                  </button>
                );
              }}
            </PDFDownloadLink>
          </div>

          <BlobProvider document={<PDFRender rawImages={rawImages} />}>
            {({ blob, url, loading, error }) => {
              return (
                <div className="text-center  my-2">
                  <button
                    style={{ minWidth: "150px" }}
                    className="btn btn-outline-primary "
                    disabled={rawImages.length ? false : true}
                    onClick={() => onUpLoadPDFToServer(blob)}
                  >
                    {loading ? spinner : "Upload to Server"}
                  </button>
                </div>
              );
            }}
          </BlobProvider>
        </>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default Home;
