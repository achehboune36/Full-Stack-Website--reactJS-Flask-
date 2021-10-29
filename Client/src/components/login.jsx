import React from "react";
import {Link} from "react-router-dom";
import loginImg from "../login.png";
import { login } from './functions';
import "./Style/login_style.scss";

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {username: '', password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
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

  handleSignIn = e =>{
    e.preventDefault()

    const user = {
      username: this.state.username,
      password: this.state.password
    }

    login(user)
    if(typeof localStorage.usertoken != 'undefined')
      {this.props.history.push(`/dashboard`);return ;}
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt={"Brikoleurs"} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="email" name="username" value={this.state.username} onChange={this.handleChange} placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="password" />
            </div>
          </div>
        </div>
        <form onSubmit={this.handleSignIn} className="footer">
          <button type="submit" value="submit" className="btn" >
            Login 
          </button>
          <Link to="/register"><button className="btn">register</button></Link>
        </form>
      </div>
    );
  }
}

export default Login;