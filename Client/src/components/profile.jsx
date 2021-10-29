import React from "react";
import "./Style/dashboard_style.css";
import Navbar from "./navbar";
import "./Style/profile.scss";
import { updateProfile } from './functions';
import jwt_decode from "jwt-decode";
import axios from "axios";


class Profile extends React.Component {
  constructor() {
    super();
    this.state = {name : '', email: '', location: '', brikoleur: false , tel: '', domaine: '', profile: '', seniority: '',fields: {}};
  }

  componentWillMount() {
    if(typeof localStorage.usertoken == 'undefined')
      {this.props.history.push(`/`);return ;}
  }

  componentDidMount() {
    var decoded = jwt_decode(localStorage.usertoken);
    return axios
    .post("/admin/"+decoded.public_id)
      .then((res) => {this.setState({fields : res.data.user})
      })
      .catch(err => {
        console.log(err)
      })
      }

  handleChange=event=>{
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onChange(e) {
    this.setState({[e.target.name] : e.target.value});
  }

  handleUpdate() {
      const newInfos = {
      name: this.state.name,
      email: this.state.email,
      location: this.state.location,
      brikoleur: this.state.brikoleur,
      tel: this.state.tel,
      domaine: this.state.domaine,
      seniority: this.state.seniority,
      profile: this.state.profile
    }

    updateProfile(newInfos);
  }


  render() {
    return (
        <div className="container-fluid">
          <Navbar />
          <div className="container_title">
            <h1>Profile :</h1>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder={this.state.fields.name} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder={this.state.fields.email} />
            </div>
            <div className="form-group">
              <label htmlFor="location">location</label>
              <input type="text" name="location" value={this.state.location} onChange={this.handleChange} placeholder={this.state.fields.location} />
            </div>
            <div className="form-group">
              <label htmlFor="brikoleur">brikoleur</label>
              <input type="text" name="brikoleur" value={this.state.brikoleur} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="tel">tel</label>
              <input type="text" name="tel" value={this.state.tel} onChange={this.handleChange} placeholder={this.state.fields.tel} />
            </div>
            <div className="form-group">
              <label htmlFor="domaine">domaine</label>
              <input type="text" name="domaine" value={this.state.domaine} onChange={this.handleChange} placeholder={this.state.fields.domaine} />
            </div>
            <div className="form-group">
              <label htmlFor="profile">profile</label>
              <input type="text" name="profile" value={this.state.profile} onChange={this.handleChange} placeholder={this.state.fields.profile} />
            </div>
            <div className="form-group">
              <label htmlFor="seniority">seniority</label>
              <input type="text" name="seniority" value={this.state.seniority} onChange={this.handleChange} placeholder={this.state.fields.seniority} />
            </div>
            <form onSubmit={this.handleUpdate} className="footer">
            <button type="submit" value= "submit" className="btn">
            Update Profile
            </button>
            </form>
          </div>
          </div>
        </div>
  );
 }
}

export default Profile;
