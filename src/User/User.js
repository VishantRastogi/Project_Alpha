
import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';

import styled from 'styled-components';
import * as encryption  from '../encryption.helper';

import { withRouter } from "react-router";

const PlanetDiv = styled.div`
  border: 1px solid black;
  width: 150px;
  font-size: ${props => props.planetFont ? (props.planetFont.length * props.planetFont.toString()[0]) + 'px' : '100px'};
  // border: 30px solid 
  display: flex;
  justify-content: center;
  align-items: center;
  
`;
class User extends Component 
{
    

  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };
  static defaultProperty = {
    suggestions: []
  };
  constructor(props) {
    
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      username: this.props.user && this.props.user.username ? this.props.user.username : '' ,
      searchCounter: this.props.user && this.props.user.searchCounter ? this.props.user.searchCounter : 0,
      populationOfPlanet: '',
      prevTime: new Date(),
    };
    //    const setState = this.setState.bind(this);
    // this.startTimer(60,setState);
  }

  componentDidMount = () => {
    
    const user = this.getFromSession('userName');
    if (user) {
      this.setState({
        username: user
      })
    }
    else {
      this.props.router.push('/');
    }

    
    // const setState = this.setState.bind(this);
    // this.startTimer(60,setState);

  }

  getFromSession = (key) => {
    const item = localStorage.getItem(key);
    return (encryption.decryptText(item));
};

  componentWillUnmount = () => {
    sessionStorage.removeItem("userName");
  }
  
  
//   startTimer = (duration,setState) => {
//     let timer = duration, minutes, seconds;
//     setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);

//         minutes = minutes < 10 ? minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         setState({
//           minuteTimer:  minutes,
//           secondTimer:  seconds
//         })
//         if (--timer < 0) {
//             timer = duration;
//             setState({
//               searchCounter: 0
//             })    
//           }
//     }, 1000);
// }


  onChange = e => {
    let currentDate = new Date(); 
    
    let difference = currentDate.getTime() - this.state.prevTime.getTime(); 
    let resultInMinutes = Math.round(difference / 60000);

    if (resultInMinutes === 1) {
      this.setState({
        prevTime: new Date(),
        searchCounter: 0
      })
    }

    console.log('RESULT',difference)

    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  onPlanetSubmit = () => {
    

    // this.setState(prevState => ({
    //   searchCounter:  prevState.searchCounter + 1
    // }), () => console.log('RED',this.state.searchCounter));
    const _userInput = this.state.userInput;
    if (_userInput) {
      const findPlanetAtIndex = this.props.user.planetsDetails.results.findIndex(item => item.name === _userInput)
      if (findPlanetAtIndex !== -1){
        const populationOfPlanet = this.props.user.planetsDetails.results[findPlanetAtIndex].population;
        this.setState({
          ...this.state,
          populationOfPlanet,
          NotFoundPlanet: false,
          searchCounter:  this.state.searchCounter + 1  
        })
      }
      else {
        this.setState({
          ...this.state,
          NotFoundPlanet: true,
          searchCounter:  this.state.searchCounter + 1 
        })
      }
    }
    
  }

  render() {
    console.log('COUNTER',this.state.searchCounter)
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        NotFoundPlanet,
        username,
        populationOfPlanet,
        searchCounter
      }
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions" style={{display: 'flex' , flexDirection: 'column' , flexBasis: '10%'}}>
            {filteredSuggestions.map((suggestion, index) => {
              

              if (index === activeSuggestion) {
                //
              }

              return (
                <li key={suggestion} style={{height: '80px'}} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions</em>
          </div>
        );
      }
    }

    return (
      <React.Fragment>
          Welcome {this.state.username}
        <input
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        
        {/* Button Will be disabled If User is not Luke Skywalker and try to search 3 times in a minues */}
        <Button variant="primary" disabled={username === 'Luke Skywalker' ? false : (searchCounter > 2 ? true : false)} onClick={this.onPlanetSubmit}>Search</Button>
        {suggestionsListComponent}
        {NotFoundPlanet && <div>Please check your input</div>} 
        {!NotFoundPlanet && populationOfPlanet && <PlanetDiv planetFont={populationOfPlanet}>{userInput}</PlanetDiv>}
      </React.Fragment>
    );
  }
}



export default withRouter(User);