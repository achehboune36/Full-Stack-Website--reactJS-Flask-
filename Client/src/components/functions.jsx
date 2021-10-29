import axios from 'axios'

export const register = newUser => {
  return axios
    .post("/register", {
      name: newUser.username,
      password: newUser.password,
      email: newUser.email,
      location: newUser.location,
      tel: newUser.tel,
      brikoleur: newUser.brikoleur,
      domaine: newUser.domaine,
      profile: newUser.profile,
      seniority: newUser.seniority
    })
    .then(response => {
      console.log(response.data.message)
    })
}

export const login = user => {
  return axios
    .post("/login", {
      username: user.email,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data.token)
      window.location.reload(false)
      return response.data.token
    })
    .catch(err => {
      console.log(err)
    })
  }

  export const updateProfile = newInfos => {
    return axios
      .post("/update_profile", {
        name: newInfos.name,
        email: newInfos.email,
        location: newInfos.location,
        tel: newInfos.tel,
        brikoleur: newInfos.brikoleur,
        domaine: newInfos.domaine,
        profile: newInfos.profile,
        seniority: newInfos.seniority
      })
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  export const handleConfirmation = userId => {
    return axios
    .post('/demandeur/request/'+userId)
    .then((res) => console.log(res.data.message))
    .catch((err) => {console.log(err);})
  }