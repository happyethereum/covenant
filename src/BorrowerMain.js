import React, { Component } from 'react'

const Table  = require('./pure-components/Table')

const getBorrowerMainColumns = () => {
	return [
		{
			label: 'Loan Address',
			value: (loan) =>  {
				const loanAddress = loan.address
				return loanAddress
			}
		},
		{
			label: 'Lender Address',
			value: (loan)=> {
				const lenderAddress = loan.lender
				return lenderAddress
			}
		},
		{
			label: 'Amount',
			value: (loan) => {
				const loanAmount = loan.amonut
				return loanAmount
			}
		},
		{
			label: 'IPFS Link',
			value: (loan) => {
				const IPFSHash = loan.IPFSHash
				return IPFSHash
			}
		}
	]
}

class BorrowerMain extends Component {

  render() {
    return (
      <div>
      <p>BorrowerMain</p>
      </div>
    );
  }
}

export default BorrowerMain
