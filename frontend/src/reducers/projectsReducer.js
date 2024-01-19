export const projectsReducer = (state, action) => {
    switch (action.type) {
      case 'SET_PROJECTS':
        // Update the state with the fetched projects from the action payload
        return {
          projects: action.payload
        };
  
      case 'CREATE_PROJECT':
        // Update state with the new project created from the action payload
        return {
          projects: [...state.projects, action.payload]
        };
  
      case 'UPDATE_PROJECT':
        // Update state with the modified project from the action payload
        return {
          ...state,
          projects: state.projects.map(project =>
            project.id === action.payload.id ? action.payload : project
          )
        };
  
      case 'DELETE_PROJECT':
        // Update state by removing the deleted project from the projects array
        return {
          projects: state.projects.filter(project => project.id !== action.payload),
        };
  
      default:
        return state;
    }
  };
  