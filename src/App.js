import React, { Component } from 'react'
import LoanFactory from '../build/contracts/LoanFactory.json'
import getWeb3 from './utils/getWeb3'
import Home from './Home'
// using ES6 modules
import { Router, Route, Switch } from 'react-router'


import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    // Application context - references to things that basically don't change
    this.appContext = {
      web3: null,
      loanFactoryInstance: null,
      userAddress: null
    };

    // Application state here
    this.state = {

    };

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const loanFactory = contract(LoanFactory)
    loanFactory.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      loanFactory.deployed().then((instance) => {
        this.appContext.loanFactoryInstance = instance;

        // Stores a given value, 5 by default.
        //return simpleStorageInstance.set(5, {from: accounts[0]})
      })
      // .then((result) => {
      //   // Get the value from the contract to prove it worked.
      //   return simpleStorageInstance.get.call(accounts[0])
      // }).then((result) => {
      //   // Update state with the result.
      //   return this.setState({ storageValue: result.c[0] })
      // })
    })
  }

  changeState(e){
    // update state
    console.log(e);
  }

  render() {

    var allFunctions = {
      changeState: this.changeState
    };

    return (
      <div>
        <Router history={Router.hashHistory}>
          <Route exact path="/" render={() => <Home currentState={this.state} allFunctions={allFunctions} />}/>
        </Router>
      </div>
    );
  }
}

export default App
