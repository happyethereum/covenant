pragma solidity ^0.4.0;

import './Loan.sol';

contract LoanFactory {

    mapping(address => Loan[]) lenderLoans;
    mapping(address => Loan[]) borrowerLoans;

    event LogInitiateLoan(address sender, address recipient, uint amount, string IPFShash, address auditor);

    function initiateLoan(address borrower,
                          string IPFShash,
                          address auditor)
        public
        payable
        returns (Loan newloan)
    {
        Loan loan = new Loan(msg.sender, borrower, msg.value, IPFShash, auditor);
        LogInitiateLoan(msg.sender, borrower, msg.value, IPFShash, auditor);
        lenderLoans[msg.sender].push(loan);
        borrowerLoans[borrower].push(loan);
        return loan;
    }

}
