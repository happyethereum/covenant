import React, { Component } from 'react'
import LoanStatus from './constants/loan-status'

const Table  = require('./pure-components/table');
const ipfsAPI = require('ipfs-api');
const buffer = require('safe-buffer').Buffer
const _ = require('lodash')

const getLenderMainColumns = (props) => {
	return [
    {
        label: 'Loan Address',
        value: (loan) =>  {
            return loan.address;
        },
        action: (loan) => {
            props.history.push('/lender/' + loan.address)
        }
    },
    {
        label: 'Lender Address',
        value: (loan) => {
            return loan.lender;
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
            return loan.amount.toString(10);

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
            const status = loan.status || 0;
            return LoanStatus[status];
        }
    }
	]
}

class LenderMain extends Component {

    constructor(props){
      super(props)

      this.state = {
          borrower:'',
          amount:'',
          IPFShash:'',
          auditor:'',
          file: null
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
        const sender = this.props.currentState.userAddress
        const borrower = this.state.borrower
        const amount = parseInt(this.state.amount)
        const IPFShash = this.state.IPFShash
        const auditor = this.state.auditor

        this.props.appContext.loanFactoryInstance.initiateLoan(borrower, IPFShash, auditor, {from: sender, value: amount, gas: 3000000})
        .then(result => {
            console.log("initiateLoan successful: ", result)
        })
    }

    updateFile(e){
        this.setState({
            file: e.target.files[0]
        })
    }

    addFile(){

        const filepath = this.state.file.name
        const ipfs = ipfsAPI({host:'ipfs.infura.io', port:'5001', protocol: 'https'});

        var fileReader = new FileReader()
        fileReader.readAsArrayBuffer(this.state.file)

        fileReader.onload = function(){
          var data = fileReader.result
          var buffer = Buffer.from(data)
          var content = []
          content.push({
            path: filepath,
            content: buffer
          })

          console.log(content)
          ipfs.files.add(content, (err, res) => {
              console.log(err, res)
          })
        }
    }

    filterLoans(){
        const address = this.props.currentState.userAddress
        var loans = _.clone(this.props.currentState.loans)
        loans = _.filter(loans, { lender: address })
        return loans
    }

    render() {

      var loans = this.filterLoans()

      return (
        <div>
            <p>LenderMain</p>
            <div>
                <h4>Create a New Loan</h4>
                    <input type="file" onChange={(e) => this.updateFile(e)}/>
                    <button onClick={this.addFile.bind(this)}>Add File to IPFS</button>
                    <br/>
                    <input type="text" onChange={(e) => this.updateBorrower(e)} value={this.state.borrower} placeholder="Borrower Address" />
                    <input type="number" onChange={(e) => this.updateAmount(e)} value={this.state.amount} placeholder="Loan Amount" />
                    <input type="text" onChange={(e) => this.updateIPFShash(e)} value={this.state.IPFShash} placeholder="IPFShash" />
                    <input type="text" onChange={(e) => this.updateAuditor(e)} value={this.state.auditor} placeholder="Auditor Address" />
                    <button onClick={() => this.initiateLoan()}>Initiate Loan</button>
            </div>
            <Table columns={getLenderMainColumns(this.props)} data={loans} />
         </div>
      );
    }
}

export default LenderMain
