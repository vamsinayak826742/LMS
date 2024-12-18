import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Redirect, Route } from "react-router-dom";
import Signin from './Pages/Signin';
import MemberDashboard from './Pages/Dashboard/MemberDashboard/MemberDashboard.js';
import Allbooks from './Pages/Allbooks';
import Header from './Components/Header';
import AdminDashboard from './Pages/Dashboard/AdminDashboard/AdminDashboard.js';
import { AuthContext } from "./Context/AuthContext.js";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Header />
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Redirect to="/signin" />
          </Route>

          <Route path="/signin">
            {user ? (user.isAdmin ? <Redirect to="/dashboard@admin" /> : <Redirect to="/dashboard@member" />) : <Signin />}
          </Route>

          <Route path="/dashboard@member">
            {user && !user.isAdmin ? <MemberDashboard /> : <Redirect to="/signin" />}
          </Route>

          <Route path="/dashboard@admin">
            {user && user.isAdmin ? <AdminDashboard /> : <Redirect to="/signin" />}
          </Route>

          <Route path="/books">
            <Allbooks />
          </Route>

          {/* Fallback Route */}
          <Route path="*">
            <Redirect to="/signin" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
