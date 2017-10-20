import React, { Component } from 'react'

const Table  = require('./pure-components/table');
const ipfsAPI = require('ipfs-api');
const buffer = require('safe-buffer').Buffer

class LenderCreateLoan extends Component {

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

        this.props.appContext.loanFactoryInstance.initiateLoan(borrower, IPFShash, auditor, {from: sender, value: amount})
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
        const ipfs = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'});

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

          ipfs.files.add(content, (err, res) => {
              console.log(err, res)
          })
        }
    }

    render() {
      return (
        <div>
            <p>LenderCreateLoan</p>
            <div>
                <h4>Create a New Loan</h4>
                    <input type="file" onChange={(e) => this.updateFile(e)}/>
                    <button onClick={this.addFile}>Add File to IPFS</button>
                    <br/>
                    <input type="text" onChange={(e) => this.updateBorrower(e)} value={this.state.borrower} placeholder="Borrower Address" />
                    <input type="text" onChange={(e) => this.updateAmount(e)} value={this.state.amount} placeholder="Loan Amount" />
                    <input type="text" onChange={(e) => this.updateIPFShash(e)} value={this.state.IPFShash} placeholder="IPFShash" />
                    <input type="text" onChange={(e) => this.updateAuditor(e)} value={this.state.auditor} placeholder="Auditor Address" />
                    <button onClick={this.initiateLoan()}>Initiate Loan</button>
            </div>
      </div>
      );
    }
}

export default LenderCreateLoan
