import React from "react";
import {Link , withRouter } from "react-router-dom";
import "./Style/navbar_style.css";

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {nom : '' , prenom : '' };
  }
  logout(e) {
    e.preventDefault();
    localStorage.removeItem('usertoken');
    localStorage.removeItem('typeconn');
    this.props.history.push('/');
  }
  render () {
    return(
      <div className="navbar">
        <div className="navbar_list ">
          <div className="navbar_element">
            <Link to="/dashboard" ><h1>Home</h1></Link>
          </div>
          <div className="navbar_border" />
          <div className="navbar_element">
            <h1 style={{color: "black"}} onClick={this.logout.bind(this)}>logout</h1>
          </div>
          <div className="navbar_element">
            <Link to="/profile" ><h1>Profile</h1></Link>
          </div>
          <div className="navbar_element">
            <Link to="/Brikoleur" ><h1>Brikoleurs</h1></Link>
          </div>
        </div>
      </div>
  );
}
}
export default withRouter(Navbar);