import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { default as Dashboard, default as SignIn, default as SignUp } from './React';



const App = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default App;

