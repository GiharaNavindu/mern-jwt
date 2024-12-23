import React from "react";
import ReactDOM from "react-dom/client"; // Change the import path  
import { Provider } from "react-redux";
import App from "./App";
import store from "./Redux/store";

// Create a root  
const root = ReactDOM.createRoot(document.getElementById("root"));  

// Render the app  
root.render(  
  <Provider store={store}>  
    <App />  
  </Provider>  
);