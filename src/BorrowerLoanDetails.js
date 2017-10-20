import React, { Component } from 'react'
import BorrowerLoanRepayment from './BorrowerLoanRepayment'

class BorrowerLoanDetails extends Component {
  constructor(props){
    super(props)

    this.state = {
      payMerchantAmount: 0
    };
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
    console.log(this.props.match.params.address) // Address of loan - could be index instead

    return (
      <div>
        <h2>Loan Details</h2>
        <BorrowerLoanRepayment />
        <div>
          <select>
            <option value="merchantAddress">merchantAddress placeholder</option>
          </select>
          <input type="number" value={this.state.payMerchantAmount} onChange={(e) => this.onChange(e)}></input>
          <button type="button" onClick={() => this.payMerchant()}>Pay merchant</button>
        </div>
      </div>
    );
  }
}

export default BorrowerLoanDetails
