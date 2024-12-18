import React, { createContext, useReducer } from "react";

// Define the initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("currentUser")) || null,
  isFetching: false,
  error: false,
};

// Define the AuthContext and reducer
export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isFetching: true };
    case "LOGIN_SUCCESS":
      return { ...state, isFetching: false, user: action.payload };
    case "LOGIN_FAILURE":
      return { ...state, isFetching: false, error: true };
    default:
      return state;
  }
};

// Provide the AuthContext to the app
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
