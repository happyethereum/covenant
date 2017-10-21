import React, { Component } from 'react'
import BorrowerLoanRepayment from './BorrowerLoanRepayment'
var _ = require('lodash')

class BorrowerLoanDetails extends Component {
  constructor(props){
    super(props)

    this.state = {
      amount: 0,
      merchant: ''
    };
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
    this.props.appContext.loanContract.at(this.props.match.params.address)
      .then(instance => {
        console.log(this.state.merchant);
        console.log(this.props.currentState.userAddress);
        instance.payMerchant(this.state.merchant, this.state.amount, {from: this.props.currentState.userAddress, gas: 4000000})
          .then(result => {
              console.log("payMerchant successful: ", result)
          });
      });
  }

  render() {
    let loan = this.getLoan();
    console.log(loan);
    return (
      <div>
        <h2>Loan Details</h2>
        <BorrowerLoanRepayment />
        <div>
          <select id="merchant" value={this.state.merchant} onChange={(e) => this.onChange(e)}>
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
