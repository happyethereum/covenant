pragma solidity ^0.4.0;

contract Loan {

    address lender;
    address borrower;
    uint initialBalance;
    uint balance;
    string IPFShash;
    address auditor;
    bool inDefault = false;
    bool isLoanRepayed = false;

    modifier onlyLender(){
        require(msg.sender == lender);
        _;
    }

    modifier onlyBorrower(){
        require(msg.sender == borrower);
        _;
    }

    modifier onlyAuditor(){
        require(msg.sender == auditor);
        _;
    }

    modifier isOnWhitelist(address merchant){
        require(approvedAddress[merchant] == true);
        _;
    }

    modifier onlyIfInDefault(){
        require(inDefault == true);
        _;
    }

    mapping(address => bool) approvedAddress;

    event LogMerchantAddedToWhitelist(address sender, address merchant);
    event LogPayMerchant(address merchant, uint amount);
    event LogLoanInDefault(bool isDefaulted);
    event LogLoanRepayed(bool isRepayed);
    event LogLoanDestroyed(uint amountReturned);

    function Loan(
                address _lender,
                address _borrower,
                uint amount,
                string _IPFShash,
                address _auditor){
        lender = _lender;
        borrower = _borrower;
        balance = amount;
        initialBalance = amount;
        IPFShash = _IPFShash;
        auditor = _auditor;
    }

    function addMerchantToWhitelist(address merchant)
        onlyLender
        returns(bool success)
    {
        approvedAddress[merchant] = true;
        LogMerchantAddedToWhitelist(msg.sender, merchant);
        return true;
    }

    function setLoanInDefault()
        onlyAuditor
        returns(bool success)
    {
        inDefault = true;
        LogLoanInDefault(inDefault);
        return true;
    }

    function payMerchant(address merchant, uint amount)
        onlyBorrower
        isOnWhitelist(merchant)
        returns(bool success)
    {
        balance -= amount;
        merchant.transfer(amount);
        LogPayMerchant(merchant, amount);
        return true;
    }

    function setLoanRepayed()
        onlyAuditor
        returns(bool success)
    {
        isLoanRepayed = true;
        LogLoanRepayed(isLoanRepayed);
        return true;
    }

    function kill()
        onlyLender
        onlyIfInDefault
        returns (bool success)
    {
        selfdestruct(lender);
        LogLoanDestroyed(balance);
        return true;
    }

}
