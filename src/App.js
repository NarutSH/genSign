import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { useSelector, useDispatch } from "react-redux";
import SpinnerTool from "./tool/Spinner/SpinnerTool";
import TextToImage from "./Elements/TextToImage";

const App = () => {
  const isLoading = useSelector((state) => state.dataReducer.isLoading);

  return (
    <div className="container py-3">
      {isLoading && <SpinnerTool />}

      <Home />
    </div>
  );
};

export default App;
