import React from "react";
import { useSelector, useDispatch } from "react-redux";
import InputElement from "../Elements/InputElement";
import ToastImgEditor from "../Elements/ToastImgEditor";
import { BlobProvider, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDFRender from "../Elements/PDFRender";
import { onHandleUpload } from "../services/func";
import { useToasts } from "react-toast-notifications";
import { updateIsLoading, updateRawFile } from "../redux/action/dataAction";

const Home = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);

  const onUpLoadToServer = async (blobFile) => {
    await dispatch(updateIsLoading(true));
    await onHandleUpload(blobFile)
      .then((res) => {
        addToast(res.msg || "Saved Successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        dispatch(updateRawFile(null));
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

      {/* <PDFViewer>
            <PDFRender rawImages={rawImages} />
          </PDFViewer> */}

      {rawImages && rawImages.length ? (
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
                    className="btn btn-outline-primary "
                    disabled={rawImages.length ? false : true}
                  >
                    Download PDF
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
                    className="btn btn-outline-primary "
                    disabled={rawImages.length ? false : true}
                    onClick={() => onUpLoadToServer(blob)}
                  >
                    Upload to Server
                  </button>
                </div>
              );
            }}
          </BlobProvider>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
