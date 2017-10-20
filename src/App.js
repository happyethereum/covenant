import React, { Component } from 'react'
import LoanFactory from '../build/contracts/LoanFactory.json'
import Loan from '../build/contracts/Loan.json'
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

var _ = require('lodash')

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')

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
    //const contract = require('truffle-contract')
    const loanFactory = contract(LoanFactory)
    loanFactory.setProvider(this.appContext.web3.currentProvider)
    const loanContract = contract(Loan)
    loanContract.setProvider(this.appContext.web3.currentProvider)
    this.appContext.loanContract = loanContract

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
              const address = result.args.loan

              var loan = {}
              loan.lender = lender
              loan.borrower = borrower
              loan.auditor = auditor
              loan.amount = amount
              loan.IPFShash = IPFShash
              loan.address = address
              loan.isDefaulted = false
              loan.isRepayed = false

              var loans = this.state.loans;
              loans.push(loan)
              this.setState({
                  loans: loans
              })

              this.watchForDefaults(address)
              this.watchForRepayment(address)
          }
      })
  }

  watchForDefaults(loanAddress){
      const loanInstance = this.appContext.loanContract.at(loanAddress)
      loanInstance.LogLoanInDefault({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err) {
              console.log(err)
              return
          } else {
              console.log(result)
              const isDefaulted = result.args.isDefaulted

              var loans = this.state.loans
              var curLoan = _.find(loans, { address: loanAddress })
              var loan = loans.slice(loans.address)
          }
      })
  }

  watchForRepayment(loanAddress){
      const loanInstance = this.appContext.loanContract.at(loanAddress)
      loanInstance.LogLoanRepayed({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err) {
              console.log(err)
              return
          } else {
              console.log(result)
              const isRepayed = result.args.isRepayed

              var loans = this.state.loans
              var loan = loans.slice()
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
