import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "./store/store";
import { Provider } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
         <App />
        </PersistGate>
      </Provider>
    </Router>
  </React.StrictMode>
);
