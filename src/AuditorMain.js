import React, { Component } from 'react'
import _ from 'lodash'
import Table from './pure-components/table'
import LoanStatus from './constants/loan-status'
import co from 'co';

class AuditorMain extends Component {

	render() {
		const curAddress = this.getUserAddress();
		const loanContracts = _.filter(this.props.currentState.loans, { auditor: curAddress });
		return (
			<div>
				<Table data={loanContracts} columns={this.getTableColumnConfig()} emptyLabel="No Loans are associated with this Auditor Account"></Table>
			</div>
		);
	}

	getUserAddress() {
		return this.props.currentState.userAddress
	}

	getTableColumnConfig() {
		const self = this;
		return [
			{
				label: 'Loan Address',
				value: (loan) =>  {
					return loan.address;
				}
			},
			{
				label: 'Status',
				value: (loan) => {
					const status = loan.status || 0;
					return LoanStatus[status];
				}
			},
			{
				label: null,
				value: () => {
					return 'Default'
				},
				action: (loan) => {
					co(function*() {
						const curAddress = self.getUserAddress();
						yield loan.instance.setLoanInDefault({ from: curAddress, gas:3000000 });
					})
				},
				disabled: (loan) => {
					const status = loan.status || 0;
					return status != 0;
				}
			},
			{
				label: null,
				value: () => {
					return 'Set Repaid'
				},
				action: (loan) => {
					co(function*() {
						const curAddress = self.getUserAddress();
						yield loan.instance.setLoanRepayed({ from: curAddress, gas:3000000 });
					})
				},
				disabled: (loan) => {
					const status = loan.status || 0;
					return status != 0;
				}
			}
		]
	}
}

export default AuditorMain
