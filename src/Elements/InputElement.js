import React, { useEffect, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import {
  updateRawImages,
  updatePageSelected,
} from "../redux/action/dataAction";

import _ from "lodash";

const InputElement = () => {
  const [imageUpload, setImageUpload] = useState([]);
  const dispatch = useDispatch();
  const pageSelected = useSelector((state) => state.dataReducer.pageSelected);
  const rawImages = useSelector((state) => state.dataReducer.rawImages);

  const imgStyle = (page) => {
    return {
      width: "100px",
      height: "150px",
      objectFit: "contain",
      margin: "10px",
      cursor: "pointer",
      border:
        pageSelected && page.pId === pageSelected.pId ? "2px solid blue" : "",
    };
  };

  const onHandleClick = (page) => {
    dispatch(updatePageSelected(page));
  };

  const onHandleDeleteImage = async (img) => {
    const newRawData = await rawImages.filter((list) => {
      return list.pId !== img.pId;
    });

    dispatch(updateRawImages(newRawData));
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

  const onHandleInputImages = async (ev) => {
    const files = Array.from(ev.target.files);
    let imgObj = [...rawImages];

    await files.map(async (img) => {
      const img64 = await readFileData(img);
      const imgUrl = URL.createObjectURL(img);
      const list = {
        pId: _.uniqueId("img_"),
        img64,
        imgFile: img,
        imgUrl,
      };

      imgObj.push(list);

      setImageUpload((imageUpload) => [...imageUpload, list]);
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
              <div className="position-absolute top-0 end-0">
                <FaTimesCircle onClick={() => onHandleDeleteImage(page)} />
              </div>
              <img
                src={page.img64}
                onClick={() => onHandleClick(page)}
                alt="ref"
                style={imgStyle(page)}
                className="m-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InputElement;
