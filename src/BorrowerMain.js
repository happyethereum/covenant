import React, { Component } from 'react'
import Link from 'react-router-dom'
var _ = require('lodash')

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

	getLoans(){
		let address = this.props.currentState.userAddress;
		return _.filter(this.props.currentState.loans, {borrower: address});
	}

  render() {
    return (
    	<div>
    	   <Table data={this.getLoans()} columns={getBorrowerMainColumns(this.props)} />
    	</div>
    );
  }
}

export default BorrowerMain
