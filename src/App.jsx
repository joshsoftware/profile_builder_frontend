import React, { useState } from "react";
import { ResumeContext } from "./utils/ResumeContext";
import "./App.css";
import Router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();
  const [initialState, setInitialState] = useState({
    basicInfo: {},
    projects: [],
    skills: [],
    education: [],
    workExperience: [],
    certifications: []
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
