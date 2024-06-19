import React, { useState, }  from "react";
import store from "./redux/store"
import PageMain from "./pages/LoginForm/PageMain";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  const [isLoggedIn, ] = useState(store.getState().auth);
return (
    <Router>
     
      <Routes>
      <Route path="/" element={<PageMain props={isLoggedIn} />} />
      </Routes>
    </Router>
)


}





export default App;
