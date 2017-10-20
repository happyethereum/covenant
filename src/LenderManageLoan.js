import React, { Component } from 'react'

const Table  = require('./pure-components/table');
const _ = require('lodash')

const getLenderManageLoanColumns = (props) => {
	return [
    {
        label: 'Mechant Address',
        value: 'address'
    },
    {
        label: 'Remove Merchant from Whitelist',
        value: "Remove",

    }
	]
}



class LenderManageLoan extends Component {

    constructor(props){
      super(props)

      this.state = {
          loanInstance: this.props.appContext.loanContract.at(this.props.match.params.address),
          loanAddress: this.props.match.params.address

      };
    }

    changeMerchant(e){
        this.setState({
            merchant:e.target.value
        })
    }

    addNewMerchant(){
        const merchant = this.state.merchant
        this.state.loanInstance.addMerchantToWhitelist(merchant, {from: this.props.currentState.userAddress})
        .then(result => {
            console.log(result)
        })
    }

    killLoan(){
        this.state.loanInstance.kill({}, {from: this.props.currentState.userAddress})
        .then(result => {
            console.log(result)
        })
    }

    getMerchantList(){
        const loans = this.props.currentState.loans
        const loan = _.find(loans, {address: this.state.loanAddress}) || {}
        const merchantList = loan.whitelist || [];
        return merchantList;
    }

    render() {

      const whitelist = this.getMerchantList();

      return (
        <div>
            <div>
                <h4>Add A Merchant to the whitelist</h4>
                <input type="text" onChange={(e) => this.changeMerchant(e)} value={this.state.merchant} placeholder="New merchant address" />
                <button onClick={() => this.addNewMerchant()}>Add Merchant</button>
                <br/>
                <button onClick={() => this.killLoan()}>Kill Loan (loan must be in default)</button>
            </div>
            <Table columns={getLenderManageLoanColumns(this.props)} data={whitelist} />
      </div>
      );
    }
}

export default LenderManageLoan
