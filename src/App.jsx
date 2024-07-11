import React from "react";
import { Toaster } from "react-hot-toast";
import Router from "./routes/router";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Router />
      <Toaster position="bottom-center" />
    </div>
  );
};

export default App;
