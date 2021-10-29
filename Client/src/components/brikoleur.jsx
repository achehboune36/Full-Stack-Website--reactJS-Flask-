import React from "react";
import "./Style/dashboard_style.css";
import Navbar from "./navbar";
import axios from "axios";
import EmployeeCardList from "./EmployeeCardList";


class Brikoleur extends React.Component {
  constructor() {
    super();
    this.state = {showUpdateModal: false, username: '', domaine: '', seniority: '', email : '', tel : '', loading : true, things : {}};
  }

  componentWillMount() {
    if(typeof localStorage.usertoken == 'undefined')
      {this.props.history.push(`/`);return ;}
  }

  componentDidMount() {
    axios.get('/demandeur')
         .then((res) => {this.setState({things : res.data.brikoleurs, loading : false})})
         .catch((err) => {console.log(err);}) }

  onChange(e) {
    this.setState({[e.target.name] : e.target.value});
  }

  render() {
    if(typeof this.state.things[0] !== "undefined") {console.log(this.state.things)}
    return (
        <div className="container-fluid">
          <Navbar />
          <div className="container_title">
            <h1>Brikoleurs :</h1>
          </div>
            {this.state.loading ? <div>loading...</div> :
            <EmployeeCardList data={this.state.things}/>
            }
        </div>
  );
 }
}

export default Brikoleur;
