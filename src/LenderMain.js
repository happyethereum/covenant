import React, { Component } from 'react'

const Table  = require('./pure-components/table');

const getLenderMainColumns = () => {
	return [

	]
}



class LenderMain extends Component {

    constructor(props){
      super(props)

      this.state = {
          borrower:null,
          amount:null,
          IPFShash:null,
          auditor:null
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

        loanFactoryInstance.initiateLoan(borrower, IPFShash, auditor, {from: sender, value: amount})
        .then(result => {
            console.log("initiateLoan successful: ", result)
        })
    }

    render() {
      return (
        <div>
            <p>LenderMain</p>
            <input type="text" onChange={this.updateBorrower} value={this.state.borrower} placeholder="Borrower Address" />
            <input type="text" onChange={this.updateAmount} value={this.state.amount} placeholder="Loan Amount" />
            <input type="text" onChange={this.updateIPFShash} value={this.state.IPFShash} placeholder="IPFShash" />
            <input type="text" onChange={this.updateAuditor} value={this.state.auditor} placeholder="Auditor Address" />
            <button onClick={this.initiateLoan()}>Initiate Loan</button>
      </div>
      );
    }
}

export default LenderMain
