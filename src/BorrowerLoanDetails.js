import React, { Component } from 'react'
import BorrowerLoanRepayment from './BorrowerLoanRepayment'
var _ = require('lodash')

class BorrowerLoanDetails extends Component {
  constructor(props){
    super(props)

    this.state = {
      payMerchantAmount: 0
    };
  }

  getLoan(){
    let address = this.props.match.params.address;
    return _.find(this.props.currentState.loans, {borrower: address})[0];
  }

  onChange(e){
    this.setState({
      payMerchantAmount: e.target.value
    })
  }

  payMerchant(){
    // Pay merchant
    console.log('pay merchant');
  }

  render() {
    let loan = this.getLoan();
    return (
      <div>
        <h2>Loan Details</h2>
        <BorrowerLoanRepayment />
        <div>
          <select>
            {loan.whitelist.map((item, index) => <option value={item}>item</option>)}
          </select>
          <input type="number" value={this.state.payMerchantAmount} onChange={(e) => this.onChange(e)}></input>
          <button type="button" onClick={() => this.payMerchant()}>Pay merchant</button>
        </div>
      </div>
    );
  }
}

export default BorrowerLoanDetails
