import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./routes/router";
import { ResumeContext } from "./utils/ResumeContext";

import "./App.css";

const App = () => {
  const queryClient = new QueryClient();
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
        </QueryClientProvider>
      </ResumeContext.Provider>
    </div>
  );
};

export default App;
