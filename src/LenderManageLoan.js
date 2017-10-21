import React, { Component } from 'react'

const Table  = require('./pure-components/table');
const _ = require('lodash')
const co = require('co')
const getLenderManageLoanColumns = (props, state) => {

    const loanAddress = props.match.params.address
    const loan = _.find(props.currentState.loans, {address: loanAddress})

	return [
    {
        label: 'Mechant Address',
        value: 'address'
    },
    {
        label: null,
        value: () => {
            return 'Remove Merchant'
        },
        action: (merchant) => {
            co(function*() {
                yield loan.instance.revokeMerchant({ from: loan.lender, gas:3000000 });
            })
        }
    },
	]
}



class LenderManageLoan extends Component {

    constructor(props){
      super(props)

      this.state = {
          loanAddress: this.props.match.params.address,
          merchant:''
      };
    }

    changeMerchant(e){
        this.setState({
            merchant:e.target.value
        })
    }

    addNewMerchant(){
        const merchant = this.state.merchant
        const loanInstance = _.find(this.props.currentState.loans, {address: this.props.match.params.address})
        console.log(loanInstance)
        loanInstance.instance.addMerchantToWhitelist(merchant, {from: this.props.currentState.userAddress, gas: 4000000})
        .then(result => {
            console.log(result)
        })
    }

    killLoan(){
        const loanInstance = _.find(this.props.currentState.loans, {address: this.props.match.params.address})
        loanInstance.instance.kill({}, {from: this.props.currentState.userAddress})
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
            <Table columns={getLenderManageLoanColumns(this.props, this.state)} data={whitelist} />
      </div>
      );
    }
}

export default LenderManageLoan
