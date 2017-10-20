pragma solidity ^0.4.0;

import './Loan.sol';

contract LoanFactory {

    mapping(address => Loan[]) lenderLoans;
    mapping(address => Loan[]) borrowerLoans;

    event LogInitiateLoan(address sender, address recipient, uint amount, address auditor, uint duration, uint interestRate);

    function initiateLoan(address borrower,
                          string IPFShash,
                          address auditor,
                          uint duration,
                          uint interestRate)
        public
        payable
        returns (Loan newloan)
    {
        Loan loan = new Loan(msg.sender, borrower, msg.value, IPFShash, auditor, duration, interestRate);
        LogInitiateLoan(msg.sender, borrower, msg.value, auditor, duration, interestRate);
        lenderLoans[msg.sender].push(loan);
        borrowerLoans[recipient].push(loan);
        return loan;
    }

}
