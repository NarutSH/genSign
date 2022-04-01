import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import configureStore from "./redux/configureStore";
import "./index.css";
import "tui-image-editor/dist/tui-image-editor.css";
import Modal from "react-modal";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistor } = configureStore();

Modal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider placement="top-center">
          <App />
        </ToastProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
