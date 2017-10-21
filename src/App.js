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
      loanContract: null
    };

    // Application state here
    this.state = {
        userAddress: null,
        userAddresses: null,
        loans: [],
        isReady: false,
	    cancelledLoans: {}
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

      const self = this;
      this.appContext.loanFactoryInstance.LogInitiateLoan({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err){
              console.log(err)
              return;
          } else {
              const lender = result.args.sender
              const borrower = result.args.recipient
              const auditor = result.args.auditor
              const amount = result.args.amount
              const IPFShash = result.args.IPFShash
              const address = result.args.loan
              const instance =  self.appContext.loanContract.at(address)

	          if (this.state.cancelledLoans[address]) {
              	// loan is cancelled - don't track it
              	return;
              }

              var loan = {}
              loan.lender = lender
              loan.borrower = borrower
              loan.auditor = auditor
              loan.amount = amount
              loan.IPFShash = IPFShash
              loan.address = address
              loan.whitelist = []
              loan.instance = instance

              var loans = this.state.loans;
              loans.push(loan)
              this.setState({
                  loans: loans
              })

              this.watchForStatusChange(loan)
              this.watchForWhitelistChange(loan)
              this.watchForLoanDestroyed(loan)
          }
      })
  }

	watchForLoanDestroyed(loan){
      loan.instance.LogLoanDestroyed({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err) {
              console.log(err)
              return
          } else {
              console.log('loan destroyed', result)
              const status = result.args.status

	          var loans = _.clone(this.state.loans)
	          var cancelledLoans = _.clone(this.state.cancelledLoans)
              var loanIndex = _.findIndex(loans, { address: loan.address })

	          // Update state
	          if (loanIndex >= 0) {
		          loans.splice(loanIndex, 1);
              }
	          cancelledLoans[loan.address] = true;
	          this.setState({
                  loans,
	              cancelledLoans
              })
          }
      })
  }

	watchForStatusChange(loan){
		loan.instance.LogStatusChange({}, {fromBlock: 0})
			.watch((err, result) => {
				if(err) {
					console.log(err)
					return
				} else {
					console.log('status change', result)
					if (this.state.cancelledLoans[loan.address]) {
						// loan is cancelled - don't track it
						return;
					}

					const status = result.args.status

					var loans = _.clone(this.state.loans)
					var curLoan = _.find(loans, { address: loan.address })
					curLoan.status = status
					this.setState({
						loans: loans
					})
				}
			})
	}

  watchForWhitelistChange(loan){
      loan.instance.LogMerchantAddedToWhitelist({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err){
              console.log(err)
              return
          } else {
              console.log('merchant added to whitelist', result)
              const newApprovedAddress = result.args.merchant

              var loans = _.clone(this.state.loans)
              var curLoan = _.find(loans, { address: loan.address })
              curLoan.whitelist.push({address: newApprovedAddress})
              this.setState({
                  loans: loans
              })
          }
      })

      loan.instance.LogRevokeMerchantFromWhitelist({}, {fromBlock: 0})
      .watch((err, result) => {
          if(err) {
              console.log(err)
              return
          } else {
              console.log('merchant removed from whitelist', result)
              const removedAddress = result.args.merchant

              var loans = _.clone(this.state.loans)
              var curLoan = _.find(loans, {address: loan.address})
              curLoan.whitelist = _.remove(curLoan.whitelist, function(n){
                  return n == removedAddress
              })
              this.setState({
                  loans:loans
              })
          }
      })
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
	                          <h3>Select Your Account:</h3>
                              <ChooseAccount accounts={this.state.userAddresses}
                                             selectedAccount={this.state.userAddress}
                                             onSelect={(a) => this.setState({userAddress: a})}>
                              </ChooseAccount>
                              <Switch>
                                  <Route exact path="/lender" render={(props) => <LenderMain {...props} appContext={this.appContext} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/lender/:address" render={(props) => <LenderManageLoan {...props} appContext={this.appContext} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/" render={() => <Home {...this.props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/borrower" render={(props) =>  <BorrowerMain {...props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/lender/:address" render={(props) => <LenderManageLoan {...props} appContext={this.appContext} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/" render={(props) => <Home {...props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/borrower" render={(props) =>  <BorrowerMain {...props} currentState={this.state} functions={functions} />}/>
                                  <Route exact path="/borrower/:address" render={(props) => <BorrowerLoanDetails {...props} currentState={this.state} appContext={this.appContext} functions={functions} />}/>
                                  <Route exact path="/auditor" render={(props) => <AuditorMain {...props} currentState={this.state} functions={functions} />}/>}/>

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
