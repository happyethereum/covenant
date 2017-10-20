import React, { Component } from 'react'

class Home extends Component {

  render() {
    return (
      <div>
      <p onClick={(e) => this.props.allFunctions.changeState(e)}></p>
      <p>
      Home {this.props.currentState.value}
      </p>
      </div>
    );
  }
}

export default Home
