import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./routes/router";
import { ResumeContext } from "./utils/ResumeContext";

import "./App.css";

const queryClient = new QueryClient();
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
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ResumeContext.Provider>
    </div>
  );
};

export default App;
