import React from "react";
import {Link} from "react-router-dom";
import loginImg from "../login.png";
import "./Style/home_style.scss";


class  Home extends React.Component {
  componentDidMount() {
    if(typeof localStorage.usertoken != 'undefined')
      {this.props.history.push(`/dashboard`);return ;}
    }
  render(){
  return (
    <div className="base-container">
      <div className="content">
        <div className="header">
          Connecter en tant que :
        </div>
        <div className="image">
            <img src={loginImg} alt={"Brikoleurs"}/>
          </div>
        <div>
          <Link to="/login"><button className="btn">Utilisateur</button></Link>
          <Link to="/login"><button className="btn">Admin</button></Link>
        </div>
      </div>
    </div>
  );
}
}
export default Home;