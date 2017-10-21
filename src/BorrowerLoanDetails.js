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
    this.updateBalance();
  }

  updateBalance(){
    // Currently sync - TODO async
    let balance =  this.props.appContext.web3.eth.getBalance(this.props.match.params.address);
    this.setState({
      loanBalance: balance.toNumber().toString()
    })
  }

  getLoan(){
    let address = this.props.match.params.address;
    return _.find(this.props.currentState.loans, {address: address}) || {};
  }

  onChange(e){
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  payMerchant(){
    this.getLoan().instance.payMerchant(this.state.merchant, this.state.amount, {from: this.props.currentState.userAddress, gas: 4000000})
      .then(result => {
          this.updateBalance();
          console.log("payMerchant successful: ", result)
      });
  }

  render() {
    let loan = this.getLoan();
    return (
        <div>
		    {loan && loan.amount && (
                <div><h3>Loan Details</h3>
                  <p><span className="font-weight-bold">Initial Amount:</span> {loan.amount.toNumber()}</p>
                  <p><span className="font-weight-bold">Current Balance:</span> {this.state.loanBalance}</p></div>
		    )}

          {loan && loan.whitelist && loan.whitelist.length && (
              <div>
                <h3>Pay Merchant</h3>
                <div className="form-inline">
                  <select id="merchant" className="form-control" value={this.state.merchant} onChange={(e) => this.onChange(e)}>
                    <option disabled value="">Select merchant</option>
		              {loan.whitelist.map((item, index) => <option key={index} value={item.address}>{item.address}</option>)}
                  </select>
                  <input className="form-control" id="amount" type="number" value={this.state.amount} onChange={(e) => this.onChange(e)}></input>
                  <button className="btn btn-primary form-control" type="button" onClick={() => this.payMerchant()}>Pay merchant</button>
                </div>
              </div>
          )}
      </div>
    );
  }
}

export default BorrowerLoanDetails
