import React from 'react';
import Login from './Login/Login';
import User from './User/User';
import { Switch, Route } from 'react-router';
import axios from 'axios';
import { withRouter } from "react-router";

import * as encryption  from './encryption.helper';

import './App.css';

class App extends React.Component {

  state = {
    username: '',
    password: '',
    valid_user: false,
    planetsDetails: [],
    planetsSuggestion: {},
    showError: false
  }
//To get the data from planet API and to show that data in type along search
  componentDidMount = () => {
    
    axios.get('https://swapi.co/api/planets/')
    .then(response => {
      this.setState({ planetsDetails: response.data });
    })
.then(res => {
  this.setState({
    planetsSuggestion: res.data.results
  })
}
  )
    .catch(function (error) {
      console.log(error);
    })
  }

  onChangeHandler = (event) => {
    
    this.setState({
      [event.target.name]: event.target.value
    });
  }
 
  onSubmitHandler = (event) => {
   event.preventDefault();
   axios.get('https://swapi.co/api/people/?search=' + this.state.username)
   .then(res => {
    const user = res.data && res.data.results ? res.data.results[0].name : '';
    const password = res.data && res.data.results ? res.data.results[0].birth_year : '';
    const username = this.state.username;
    const passwordEntered = this.state.password;
    if(username === '' && passwordEntered === ''){
        this.setState({
          showError: true
        })
    }
    else if(user === username && passwordEntered === password){
        this.setState(prevState => ({
          valid_user: !prevState.valid_user,
          showError: false
        }));
        localStorage.setItem('userName', encryption.encryptText(username) );        
        this.props.history.push('/user')
    }
    else {
      this.setState({
        showError: true
      })
    }

})
   .catch(error => console.log(error))
// console.log(this.state)
// // to get the data from people api as of now it's hard coded
// axios.get('https://swapi.co/api/people/1/')
//     .then(res => {
//       const user = res.data.name;
//       const password = res.data.birth_year;
//       const username = this.state.username;
//       const passwordEntered = this.state.password;
//       if(username === '' && passwordEntered === ''){
//         document.getElementById('status').innerHTML = '<p>Please Enter A Valid Username and Password</p>';
//       }else if(user === username && passwordEntered === password){
//         document.getElementById('status').innerHTML = '';
//         this.setState(prevState => ({
//           valid_user: !prevState.valid_user
//         }));
//         // console.log(user, password)
//         localStorage.setItem('userName', encryption.encryptText(username) );        
//         this.props.history.push('/user')
//         // console.log(this.props)
//       }else{
//           document.getElementById('status').innerHTML = '<p>Please Enter A Valid Username and Password</p>';
//       }
    // }
    // console.log('ressss',res)
// }
//     )
//     .catch(error => {
//       console.log(error);
//     });

  }

  componentWillUnmount = () => {
    sessionStorage.removeItem("userName");
  }
  
  render() {
    const planetNames = []

    this.state.planetsDetails && this.state.planetsDetails.results && this.state.planetsDetails.results.map(item => {
      return planetNames.push(item.name)
    })

    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <Login data={this.state} changeHandler={this.onChangeHandler} submitHandler={this.onSubmitHandler}/>}/>
          <Route path="/user" render={() => <User user={this.state} suggestions={planetNames}/>}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App);

