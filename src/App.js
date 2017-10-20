import React, { Component } from 'react'
import LoanFactory from '../build/contracts/LoanFactory.json'
import getWeb3 from './utils/getWeb3'
import Home from './Home'
import BorrowerMain from './BorrowerMain'
import BorrowerLoanDetails from './BorrowerLoanDetails'
import AuditorMain from './AuditorMain'
// using ES6 modules
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'


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
    };

    // Application state here
    this.state = {
        userAddress: null,
        userAddresses: null,
        loans: [],
    };

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {

        this.appContext.web3 = results.web3;

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
        this.setState({
            userAddress: accounts[0],
            userAddresses: accounts
        })

        this.watchForLoans()

      })
    })
  }

  watchForLoans(){
      this.appContext.loanFactoryInstance.LogInitiateLoan({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err){
              console.log(err)
              return;
          } else {
              console.log(result)
              const lender = result.args.sender
              const borrower = result.args.recipient
              const auditor = result.args.auditor
              const amount = result.args.amount
              const IPFShash = result.args.IPFShash

              var loan = {}
              loan.lender = lender
              loan.borrower = borrower
              loan.auditor = auditor
              loan.amount = amount
              loan.IPFShash = IPFShash

              var loans = this.state.loans;
              loans.push(loan)
              this.setState({
                  laons: loans
              })
          }
      })
  }

  changeState(e){
    // update state
    console.log(e);
  }

  render() {

    var functions = {
      changeState: this.changeState
    };

    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Home currentState={this.state} functions={functions} />}/>
            <Route exact path="/borrower" render={() => <BorrowerMain currentState={this.state} functions={functions} />}/>
            <Route exact path="/borrower/:address" render={() => <BorrowerLoanDetails currentState={this.state} functions={functions} />}/>
            <Route exact path="/auditor" render={() => <AuditorMain currentState={this.state} functions={functions} />}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App
