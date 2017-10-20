import React, { Component } from 'react'

const Table  = require('./pure-components/table');

const getBorrowerMainColumns = () => {
	return [
		{
			label: 'Loan Address',
			value: (loan) =>  {
				return loan.address;
			}
		},
		{
			label: 'Lender Address',
			value: (loan)=> {
				return loan.lender;
			}
		},
		{
			label: 'Amount',
			value: (loan) => {
				return loan.amount;

			}
		},
		{
			label: 'IPFS Link',
			value: (loan) => {
				return loan.IPFSHash;
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
