import React from 'react';

import { withRouter } from "react-router";


class Login extends React.Component {

 
  render() {
    return (
      <div>
        <form onSubmit={(event) => this.props.submitHandler(event)}>
            <div className="form-group">
                <label>UserName:</label>
                <input type="text" value={this.props.data.username} name="username" className="form-control" id="email" onChange={(event) => this.props.changeHandler(event)}/>
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" name="password" value={this.props.data.password} className="form-control" id="pwd" onChange={(event) => this.props.changeHandler(event)}/>
            </div>
          
            <button type="submit" className="btn btn-default">Submit</button>
        </form>
        {this.props.data && this.props.data.showError ? <p id="status" style={{color: 'red'}}>Please Enter A Valid Username and Password</p> : null }
        
      </div>
    )
  }
}


export default withRouter(Login);