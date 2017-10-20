import React, { Component } from 'react'

const Table  = require('./pure-components/Table')

const getBorrowerMainColumns = () => {
	return [
		{
			label: 'Loan Address',
			value: (loan) =>  {
				const 
			}
		},
		{
			label: 'Lender Address',
			value: (loan)=> {
				const lenderAddress = loan.lender;
			}
		},
		{
			label: 'Amount',
			value: (loan) => {
				const loanAmount = loan.amonut;

			}
		},
		{
			label: 'IPFS Link',
			value: (loan) => {
				const IPFSHash = loan.IPFSHash
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
