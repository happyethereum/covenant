import React, { Component } from 'react'

const Table  = require('./pure-components/table');

const getLenderManageLoanColumns = () => {
	return [
    {
        label: 'Loan Address',
        value: (loan) =>  {
            return loan.address;
        }
    },
    {
        label: 'Borrower Address',
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
        label: 'IPFS Link',
        value: (loan) => {
            return loan.IPFSHash;
        }
    },
    {
        label: 'Status',
        value: (loan) => {
            return loan.status;
        }
    }
	]
}



class LenderManageLoan extends Component {

    constructor(props){
      super(props)

      this.state = {
          borrower:null,
          amount:null,
          IPFShash:null,
          auditor:null
      };
    }

    render() {

      return (
        <div>
            <div>
                <h4>Add A Merchant to the whitelist</h4>

            </div>
      </div>
      );
    }
}

export default LenderManageLoan
