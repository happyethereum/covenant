import React, { Component } from 'react'

const Table  = require('./pure-components/table');

const getLenderManageLoanColumns = () => {
	return [
    // {
    //     label: 'Mechant Address',
    //     value: (merchant) =>  {
    //         return loan.address;
    //     }
    // },
    // {
    //     label: 'Lender Address',
    //     value: (loan) => {
    //         return loan.lender;
    //     }
    // }
	]
}



class LenderManageLoan extends Component {

    constructor(props){
      super(props)

      console.log(this.props)

      this.state = {
          loanInstance: this.props.appContext.loanContract.at(this.props.match.params.address)
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
