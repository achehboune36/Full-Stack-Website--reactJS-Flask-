import React from "react";
import {Link} from "react-router-dom";
import loginImg from "../login.png";
import { register } from './functions';

export class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {username: '', email: '', password: '', location: "dakhla", brikoleur: false, "tel": 321, domaine: "", seniority: "", profile: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  componentWillMount() {
    if(typeof localStorage.usertoken != 'undefined')
      {this.props.history.push(`/dashboard`);return ;}
  }

  handleChange=event=>{
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleRegistration = e =>{
    e.preventDefault()

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      location: this.state.location,
      brikoleur: this.state.brikoleur,
      tel: this.state.tel,
      domaine: this.state.tel,
      profile: this.state.profile,
      seniority: this.state.seniority
    }

    register(newUser);
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt={"Brikoleurs"}/>
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" value={this.state.userName} onChange={this.handleChange} placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password" />
            </div>
          </div>
        </div>
        <form onSubmit={this.handleRegistration} className="footer">
          <button type="submit" value= "submit" className="btn">
            Register
          </button>
          <Link to="/login"><button className="btn">Login</button></Link>
        </form>
      </div>
    );
  }
}

export default Register;