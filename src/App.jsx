import { useState } from "react";

import { ResumeContext } from "./utils/ResumeContext";
import { Editor } from "./components/Builder/Index";

import "./App.css";
import Dashboard from "./components/Dashboard";
import Router from "./routes/router";

const App = () => {
  const [initialState, setInitialState] = useState({
    basicInfo: {},
    projects: [],
    skills: [],
    education: [],
    workExperience: [],
    certifications: [],
  });

  return (
    <div className="App">
      <ResumeContext.Provider value={{ initialState, setInitialState }}>
        <Router />
      </ResumeContext.Provider>
    </div>
  );
};

export default App;
