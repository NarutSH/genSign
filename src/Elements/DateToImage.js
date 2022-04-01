import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDateSign } from "../redux/action/signatureAction";

const DateToImage = ({ name, setDateWidth }) => {
  const dispatch = useDispatch();
  const [genImg, setGenImg] = useState("");

  useEffect(() => {
    if (name) {
      let canvasTxt = document
        .getElementById("canvasComponent")
        .getContext("2d");

      const txtWidth = canvasTxt.measureText(name).width;

      canvasTxt.canvas.width = txtWidth;
      canvasTxt.canvas.height = 30;
      canvasTxt.font = "24px sans-serif";
      canvasTxt.imageSmoothingQuality = "high";

      // canvasTxt.textAlign = "center";

      setDateWidth(txtWidth);

      canvasTxt.fillText(name, 0, 20);

      const imgUrl = canvasTxt.canvas.toDataURL();

      const list = {
        type: "date",
        imgUrl,
      };
      // setGenImg(imgUrl);
      dispatch(updateDateSign(imgUrl));
    } else {
      // setGenImg(null);
      dispatch(updateDateSign(null));
    }
  }, [name]);

  return (
    <div style={{ margin: "auto 0 " }}>
      <canvas id="canvasComponent" style={{ display: "none" }} />
      {/* {genImg ? <img id="imageComponent" src={genImg} /> : null} */}
    </div>
  );
};

export default DateToImage;
