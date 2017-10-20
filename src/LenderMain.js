import React, { Component } from 'react'

const Table  = require('./pure-components/table');

const getLenderMainColumns = () => {
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



class LenderMain extends Component {

    constructor(props){
      super(props)

      this.state = {
          borrower:'',
          amount:0,
          IPFShash:'',
          auditor:''
      };
    }

    updateBorrower(e){
        this.setState({
            borrower: e.target.value
        })
    }

    updateAmount(e){
        this.setState({
            amount:e.target.value
        })
    }

    updateIPFShash(e){
        this.setState({
            IPFShash:e.target.value
        })
    }

    updateAuditor(e){
        this.setState({
            auditor:e.target.value
        })
    }

    initiateLoan(){
        const sender = this.state.userAddress
        const borrower = this.state.borrower
        const amount = parseInt(this.state.amount)
        const IPFShash = this.state.IPFShash
        const auditor = this.state.auditor

        this.props.appContext.loanFactoryInstance.initiateLoan(borrower, IPFShash, auditor, {from: sender, value: amount})
        .then(result => {
            console.log("initiateLoan successful: ", result)
        })
    }

    render() {
      return (
        <div>
            <p>LenderMain</p>
            <div>
                <h4>Create a New Loan</h4>
                    <input type="text" onChange={(e) => this.updateBorrower(e)} value={this.state.borrower} placeholder="Borrower Address" />
                    <input type="number" onChange={(e) => this.updateAmount(e)} value={this.state.amount} placeholder="Loan Amount" />
                    <input type="text" onChange={(e) => this.updateIPFShash(e)} value={this.state.IPFShash} placeholder="IPFShash" />
                    <input type="text" onChange={(e) => this.updateAuditor(e)} value={this.state.auditor} placeholder="Auditor Address" />
                    <button onClick={this.initiateLoan()}>Initiate Loan</button>
            </div>
            <div>
                <h4>Add A Merchant to the whitelist</h4>

            </div>
      </div>
      );
    }
}

export default LenderMain
