import React from "react";
import "./Style/dashboard_style.css";
import Navbar from "./navbar";
import jwt_decode from 'jwt-decode';
import axios from "axios";
import RequestCardList from "./requestsCardList";


class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {infos: {}, check: {}};
  }

  brikredirect(e) {
    e.preventDefault();
    this.props.history.push('/brikoleur');
  }

  componentWillMount() {
    if(typeof localStorage.usertoken == 'undefined')
      {this.props.history.push(`/`);
      return ;}
  }

componentDidMount() {
  var decoded = jwt_decode(localStorage.usertoken);

  axios.get('/brikoleur')
  .then((res) => {this.setState({infos : res})})
  .catch((err) => {console.log(err);})

  axios.post("/admin/"+decoded.public_id)
    .then((res) => {this.setState({check : res.data.user})
    })
    .catch(err => {
      console.log(err)
    })

  console.log(decoded)
}

  render() {
    return (
        <div className="container-fluid">
          <Navbar />
          <div className="container_title">
            <h1>Dashboard :</h1>
          </div>
          {this.state.check.brikoleur ? console.log(this.state.infos) :
            <div>         
              <div className="container_text1">
                <h1>Get started by completing you personal infos in the PROFILE space</h1>
              </div>
              <div className="container_text2">
                <h1 onClick={this.brikredirect.bind(this)}>But if you're looking for a BRIKOLEUR click here</h1>
              </div>
            </div>
            }
        </div>
  );
 }
}

export default Dashboard ;
