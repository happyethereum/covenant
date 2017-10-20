import React, { Component } from 'react'

const Table  = require('./pure-components/table');

const getAuditorMainColumns = () => {
	return [
		{
			label: 'Lender',
			value: (loan) =>  {
				return loan.lender;
			}
		},
		{
			label: 'Borrower',
			value: (loan)=> {
				return loan.borrower;
			}
		},
		{
			label: 'Amount',
			value: (loan) => {
				return loan.amount;

			}
		},
		{
			label: 'Status',
			value: (loan) => {
				return loan.status;
			}
		},
    {
      label: 'Default',
      value: 'Default this',
      action: () => {
        console.log('TODO')
      }
    },
    {
      label: 'Repaid',
      value: 'Repaid this',
      action: () => {
        console.log('TODO')
      }
    }
	]
}

var _ = require('lodash')

class AuditorMain extends Component {

  constructor(props){
    super(props)

    this.state = {
      loans: []
    };
  }

  getLoans(){
    let address = this.props.currentState.userAddress;
    return _.find(this.props.currentState.loans, {auditor: address});
  }

  render() {
    return (
      <div>
        <h2>Audit</h2>
        <Table data={this.getLoans()} columns={getAuditorMainColumns()} />
      </div>
    );
  }
}

export default AuditorMain
