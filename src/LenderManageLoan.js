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
                yield loan.instance.revokeMerchant(merchant.address, { from: loan.lender, gas:3000000 });
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
          merchant:'',
          loanBalance: ''
      };
    }

    componentWillMount(){
      // Currently sync - TODO async
      let balance =  this.props.appContext.web3.eth.getBalance(this.props.match.params.address);
      console.log(balance);
      this.setState({
        loanBalance: balance.toNumber().toString()
      })
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
        const loan = this._getLoan()
        loan.instance.kill({from: loan.lender, gas: 3000000})
        .then(result => {
            console.log('killLoan', result)
	        this.props.history.push('/lender')
        }).catch((err) => {
            console.error('killLoan',err)
        })
    }

    _getLoan() {
	    return _.find(this.props.currentState.loans, {address: this.props.match.params.address})  || {}
    }

    getMerchantList(){
        const loans = this.props.currentState.loans
        const loan = _.find(loans, {address: this.state.loanAddress}) || {}
        const merchantList = loan.whitelist || [];
        return merchantList;
    }

    isLoanInDefault() {
         const loan = this._getLoan();
         return loan.status == 2;
    }

    render() {

      const whitelist = this.getMerchantList();

      return (
        <div>
            <div>
                <h3>Loan Details</h3>

                <p><span className="font-weight-bold">Balance:</span> {this.state.loanBalance}</p>
                {this.isLoanInDefault() && <button onClick={() => this.killLoan()}>Cancel Loan</button>}
                <h3>Add A Merchant to the Whitelist</h3>
                <div className="form-inline">
                    <input className="form-control" type="text" onChange={(e) => this.changeMerchant(e)} value={this.state.merchant} placeholder="New merchant address" />
                    <button className="btn btn-primary" onClick={() => this.addNewMerchant()}>Add Merchant</button>
                </div>
            </div>
            <h3>Merchants</h3>
            <Table columns={getLenderManageLoanColumns(this.props, this.state)} data={whitelist} emptyLabel="No Merchants are associated with this Loan" />
      </div>
      );
    }
}

export default LenderManageLoan
