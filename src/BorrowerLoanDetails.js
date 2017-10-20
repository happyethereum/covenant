import React, { Component } from 'react'

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
    return (
      <div>
        <h2>Loan Details<h2>
        <BorrowerLoanRepayment />
        {/* Can move into own file if necessary */}
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
