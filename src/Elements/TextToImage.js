import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateNameSign } from "../redux/action/signatureAction";

const TextToImage = ({ name, setNameWidth }) => {
  const dispatch = useDispatch();
  const [genImg, setGenImg] = useState("");

  useEffect(() => {
    if (name) {
      let canvasTxt = document
        .getElementById("canvasComponent")
        .getContext("2d");
      const txtWidth = canvasTxt.measureText(name).width;
      canvasTxt.canvas.width = txtWidth + 1;
      canvasTxt.canvas.height = 30;
      canvasTxt.font = "16px sans-serif";
      canvasTxt.imageSmoothingQuality = "high";
      // canvasTxt.textAlign = "center";

      setNameWidth(txtWidth);

      canvasTxt.fillText(name, 0, 20);

      const imgUrl = canvasTxt.canvas.toDataURL();
      // setGenImg(imgUrl);
      const list = {
        type: "name",
        imgUrl,
      };
      dispatch(updateNameSign(imgUrl));
    } else {
      // setGenImg(null);
      dispatch(updateNameSign(null));
    }
  }, [name]);

  return (
    <div style={{ margin: "auto 0 " }}>
      <canvas id="canvasComponent" style={{ display: "none" }} />
      {/* {genImg ? <img id="imageComponent" src={genImg} /> : null} */}
    </div>
  );
};

export default TextToImage;
