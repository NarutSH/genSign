import React, { useEffect, useState } from "react";
import { GrClearOption } from "react-icons/gr";
import { BsEyeFill } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";
import {
  updateRawImages,
  updatePageSelected,
} from "../redux/action/dataAction";

import _ from "lodash";
import uniqid from "uniqid";
import resizebase64 from "resize-base64";
import { random_rgba } from "../services/func";
import ModalPreviewPage from "./ModalPreviewPage";

const InputElement = () => {
  const [imageUpload, setImageUpload] = useState([]);
  const dispatch = useDispatch();
  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);
  const signPosition = useSelector((state) => state.dataReducer.signPosition);
  const [testImg, setTestImage] = useState(null);
  const [pagePreview, setPagePreview] = useState(null);
  const [modalPreviewIsOpen, setModalPreviewIsOpen] = useState(false);

  const getSignatures = useSelector(
    (state) => state.signatureReducer.signatures
  );

  const imgStyle = (page) => {
    return {
      width: "100px",
      height: "150px",
      objectFit: "contain",
      margin: "10px",
      cursor: page.status !== -1 ? "initial" : "pointer",
      border: pageSelected.find((item) => item.pId == page.pId)
        ? pageSelected[0].pId == page.pId
          ? "2.5px solid red"
          : "2.5px solid blue"
        : "",
      filter: page.status !== -1 ? "grayscale(100%)" : "",
    };
  };

  const onHandleClick = (page) => {
    const existing = pageSelected.find((item) => {
      return item.pId == page.pId;
    });

    if (!existing) {
      const pageAdded = [...pageSelected, page];

      dispatch(updatePageSelected(pageAdded));
    } else {
      const pageRemoved = pageSelected.filter((item) => {
        return item.pId !== page.pId;
      });

      dispatch(updatePageSelected(pageRemoved));
    }
  };

  const onClearImageStatus = async (img) => {
    const newRawData = await rawImages.map((item) => {
      return item.pId !== img.pId ? item : { ...item, status: -1 };
    });

    dispatch(updateRawImages(newRawData));
  };

  const onPreviewPage = (page) => {
    setPagePreview(page);
    setModalPreviewIsOpen(true);
  };

  const onSelectAllPage = () => {
    const theRest = rawImages.filter((img) => {
      return img.status === -1;
    });

    dispatch(updatePageSelected(theRest));
  };

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const getDms = async (data64) => {
    let imgT = new Image();
    imgT.src = await data64;

    return imgT;
  };

  const onHandleInputImages = async (ev) => {
    const files = Array.from(ev.target.files);
    let imgObj = [...rawImages];

    files.map(async (img, imgIndex) => {
      const img64 = await readFileData(img);
      // const imgUrl = URL.createObjectURL(img);
      const imgDms = await getDms(img64);

      const list = {
        pId: uniqid("img_"),
        img64: resizebase64(img64, 4096, 4096),
        imgFile: img,
        // imgUrl,
        imgDms: { width: imgDms.naturalWidth, height: imgDms.naturalHeight },
        imgName: img.name,
        status: -1,
      };

      imgObj.push(list);

      setImageUpload((imageUpload) => [...imageUpload, list]);

      // if (!pageSelected && imgIndex === 0) {
      //   dispatch(updatePageSelected(list));
      // }
    });

    dispatch(updateRawImages(imgObj));
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="input-image--container">
          <label className="input-image--label">
            <input
              id="add-images"
              type="file"
              multiple
              accept="image/*"
              className="form-control"
              onChange={onHandleInputImages}
            />
            <span>เพิ่มภาพ</span>
          </label>
        </div>
        {rawImages.length > 0 && (
          <span className="ms-3">เพิ่มแล้ว {rawImages?.length} ภาพ</span>
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
              {+page.status !== -1 ? (
                <div
                  className="position-absolute top-0 end-0"
                  style={{ zIndex: "5" }}
                >
                  <span
                    className="badge m-1"
                    style={{ background: page?.bgColor }}
                  >
                    {+page.status + 1}
                  </span>
                </div>
              ) : (
                ""
              )}
              {+page.status !== -1 ? (
                <div
                  className="position-absolute bottom-0 end-0 "
                  style={{ zIndex: "5" }}
                  onClick={() => onClearImageStatus(page)}
                >
                  <span className="badge bg-light m-1">
                    <GrClearOption size="1.2rem" />
                  </span>
                </div>
              ) : (
                ""
              )}
              {+page.status !== -1 ? (
                <div
                  className="position-absolute bottom-0 start-0 "
                  style={{ zIndex: "5" }}
                  onClick={() => onPreviewPage(page)}
                >
                  <span className="badge  m-1">
                    <BsEyeFill size="1.2rem" color="#000000" />
                  </span>
                </div>
              ) : (
                ""
              )}
              <img
                src={page.img64}
                onClick={() => {
                  if (page.status == -1) {
                    onHandleClick(page);
                  }
                }}
                alt="ref"
                style={imgStyle(page)}
                className="m-auto"
                onMouseEnter={() => console.log(page)}
              />
            </div>
          );
        })}
      </div>
      {rawImages.length ? (
        <div className="my-2 text-end">
          <button onClick={onSelectAllPage} className="btn btn-info mx-3 ">
            เลือกทั้งหมด
          </button>
          <button
            disabled={pageSelected.length ? false : true}
            onClick={(ev) => {
              dispatch(updatePageSelected([]));
            }}
            className="btn btn-secondary mx-3 "
          >
            เคลียร์
          </button>
        </div>
      ) : (
        ""
      )}
      <ModalPreviewPage
        page={pagePreview}
        modalPreviewIsOpen={modalPreviewIsOpen}
        setModalPreviewIsOpen={setModalPreviewIsOpen}
      />
    </div>
  );
};

export default InputElement;
