import React, { Component } from 'react'
import BorrowerLoanRepayment from './BorrowerLoanRepayment'
var _ = require('lodash')

class BorrowerLoanDetails extends Component {
  constructor(props){
    super(props)

    this.state = {
      amount: 0,
      merchant: '',
      loanBalance: ''
    };
  }

  componentWillMount(){
    // Currently sync - TODO async
    let balance =  this.props.appContext.web3.eth.getBalance(this.props.match.params.address);
    console.log(balance);
    this.setState({
      loanBalance: balance.toNumber().toString()
    })
  }

  getLoan(){
    let address = this.props.match.params.address;
    return _.find(this.props.currentState.loans, {address: address});
  }

  onChange(e){
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  payMerchant(){
    console.log(this.props.match.params.address);
    this.getLoan().instance.payMerchant(this.state.merchant, this.state.amount, {from: this.props.currentState.userAddress, gas: 4000000})
      .then(result => {
          console.log("payMerchant successful: ", result)
      });
    // this.props.appContext.loanContract.at(this.props.match.params.address)
    //   .then(instance => {
    //     console.log(this.state.merchant);
    //     console.log(this.props.currentState.userAddress);
    //     console.log(this.state.amount);
    //
    //   });
  }

  render() {
    let loan = this.getLoan();
    console.log(loan);
    return (
      <div>
        <h2>Loan Details</h2>
        <h3>Initial Amount: {loan.amount.toNumber()}</h3>
        <h3>Current Balance: {this.state.loanBalance}</h3>
        <BorrowerLoanRepayment />
        <div>
          <select id="merchant" defaultValue="0" value={this.state.merchant} onChange={(e) => this.onChange(e)}>
            <option disabled value="0">Select merchant</option>
            {loan.whitelist.map((item, index) => <option key={index} value={item.address}>{item.address}</option>)}
          </select>
          <input id="amount" type="number" value={this.state.amount} onChange={(e) => this.onChange(e)}></input>
          <button type="button" onClick={() => this.payMerchant()}>Pay merchant</button>
        </div>
      </div>
    );
  }
}

export default BorrowerLoanDetails
