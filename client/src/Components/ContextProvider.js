import React, { createContext, useReducer } from 'react';
import user from '../Store/User';
import units from '../Store/Units';
import projects from '../Store/Projects';
import costs from '../Store/Costs';
import documents from '../Store/Documents';
import files from '../Store/Files';
import scenarios from '../Store/Scenarios';

export const Context = createContext();

const initialState = {};

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(user, initialState);
  const [stateUnits, dispatchUnits] = useReducer(units, []);
  const [stateProjects, dispatchProjects] = useReducer(projects, []);
  const [stateCosts, dispatchCosts] = useReducer(costs, []);
  const [stateDocuments, dispatchDocuments] = useReducer(documents, []);
  const [stateFiles, dispatchFiles] = useReducer(files, []);
  const [stateScenarios, dispatchScenarios] = useReducer(scenarios, []);

  const value = {
    state,
    stateUnits,
    stateProjects,
    stateCosts,
    stateDocuments,
    stateFiles,
    stateScenarios,
    dispatch,
    dispatchUnits,
    dispatchProjects,
    dispatchCosts,
    dispatchDocuments,
    dispatchFiles,
    dispatchScenarios,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
