import React, { Component } from 'react'
import LoanFactory from '../build/contracts/LoanFactory.json'
import Loan from '../build/contracts/Loan.json'
import getWeb3 from './utils/getWeb3'
import Home from './Home'
import BorrowerMain from './BorrowerMain'
import BorrowerLoanDetails from './BorrowerLoanDetails'
import AuditorMain from './AuditorMain'
import LenderMain from './LenderMain'
import LenderManageLoan from './LenderManageLoan'
import ChooseAccount from './pure-components/choose-account-dropdown'
import co from 'co'
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
import NavBar from './nav-bar'

const web3 = getWeb3();
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
        isReady: false
    };

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

      this.appContext.web3 = web3;
      const self = this;
    co(function*() {

        let accounts = yield web3.eth.getAccountsPromise();
	    yield self.instantiateContract(accounts);
	    self.setState({
            isReady: true,
		    userAddress: accounts[0],
		    userAddresses: accounts,
            loans: []
        });
	    self.watchForLoans()
    })
  }

  instantiateContract(accounts) {
      const self = this;
      return co(function*() {
          // Loan factory
	      const loanFactory = contract(LoanFactory)
	      loanFactory.setProvider(self.appContext.web3.currentProvider)
	      self.appContext.loanFactoryInstance = yield loanFactory.deployed();

	      // Loan
	      const loanContract = contract(Loan)
	      loanContract.setProvider(self.appContext.web3.currentProvider);
	      self.appContext.loanContract = loanContract;
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
              loan.whitelist = []

              var loans = this.state.loans;
              loans.push(loan)
              this.setState({
                  loans: loans
              })

              this.watchForStatusChange(address)
              this.watchForWhitelistChange(address)
          }
      })
  }

  watchForStatusChange(loanAddress){
      const loanInstance = this.appContext.loanContract.at(loanAddress)
      loanInstance.LogStatusChange({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err) {
              console.log(err)
              return
          } else {
              console.log(result)
              const status = result.args.status

              var loans = _.clone(this.state.loans)
              var curLoan = _.find(loans, { address: loanAddress })
              curLoan.status = status
              this.setState({
                  loans: loans
              })
          }
      })
  }

  watchForWhitelistChange(loanAddress){
      const loanInstance = this.appContext.loanContract.at(loanAddress)
      loanInstance.LogMerchantAddedToWhitelist({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err){
              console.log(err)
              return
          } else {
              console.log(result)
              const newApprovedAddress = result.args.merchant

              var loans = _.clone(this.state.loans)
              var curLoan = _.find(loans, { address: loanAddress })
              curLoan.whitelist.push(newApprovedAddress)
              this.setState({
                  loans: loans
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
          <div className="container">
              <Router>
                  <div>
                      <NavBar></NavBar>
                      { this.state.isReady && (
                          <div>
                              <ChooseAccount accounts={this.state.userAddresses}
                                             selectedAccount={this.state.userAddress}
                                             onSelect={(a) => this.setState({userAddress: a})}>
                              </ChooseAccount>
                              <Switch>
                                  <Route exact path="/lender" render={(props) => <LenderMain {...props} appContext={this.appContext} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/lender/:address" render={() => <LenderManageLoan {...this.props} appContext={this.appContext} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/" render={() => <Home {...this.props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/borrower" render={() =>  <BorrowerMain {...this.props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/borrower/:address" render={() => <BorrowerLoanDetails {...this.props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/auditor" render={() => <AuditorMain {...this.props} currentState={this.state} functions={functions} />}/>}/>

                                </Switch>
                          </div>
                      )}

                      { !this.state.isReady && (
                          <p> Loading ... </p>
                      )}
                  </div>
              </Router>
          </div>
    );
  }
}

export default App
