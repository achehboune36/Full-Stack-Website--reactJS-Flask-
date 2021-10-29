import React from "react";
import "./Style/dashboard_style.css";
import Navbar from "./navbar";


class Brikoleur extends React.Component {
  constructor() {
    super();
    this.state = {username: '', domaine: '', seniority: ''};
  }

  componentWillMount() {
    if(typeof localStorage.usertoken == 'undefined')
      {this.props.history.push(`/`);return ;}
  }

  render() {
    return (
        <div className="container-fluid">
          <Navbar />
          <div className="container_title">
            <h1>Brikoleurs :</h1>
          </div>
          <ul className="container_information">
          </ul>
        </div>
  );
 }
}

export default Brikoleur;
