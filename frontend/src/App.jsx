import React, { useState } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./Management/routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./Management/redux/store";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <HashRouter>
        <Provider store={store}>
          <AppRoutes />
          <Toaster position="top-center" reverseOrder={false} />
        </Provider>
      </HashRouter>
    </>
  );
};

export default App;
