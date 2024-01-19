import { createContext, useReducer } from "react";
import { projectsReducer } from "../reducers/projectsReducer";

export const ProjectsContext = createContext();

const ProjectsContextProvider = (props) => {

  const [ state, dispatch2 ] = useReducer(projectsReducer, {projects:null})

  return (
    <ProjectsContext.Provider value={{ ...state, dispatch2 }}>
      {props.children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsContextProvider;
