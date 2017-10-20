import React, { Component } from 'react'
import Link from 'react-router-dom'

const Table  = require('./pure-components/table');

const getBorrowerMainColumns = (props) => {

	return [
		{
			label: 'Loan Address',
			value: (loan) =>  {
				return loan.address;

			},
			action: (loan) => {
	            props.history.push('/borrower/' + loan.address)
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
				return loan.amount.toString(10) + ' wei';

			}
		}
		// {
		// 	label: 'IPFS Link',
		// 	value: (loan) => {
		// 		return loan.IPFSHash;
		// 	}
		// }
	]
}

class BorrowerMain extends Component {
  render() {
    return (
    	<div>
    	   <Table data={this.props.currentState.loans} columns={getBorrowerMainColumns(this.props)} />
    	</div>
    );
  }
}

export default BorrowerMain
