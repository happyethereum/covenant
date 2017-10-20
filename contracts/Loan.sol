pragma solidity ^0.4.0;

contract Loan {

    address lender;
    address borrower;
    uint initialBalance;
    uint balance;
    string IPFShash;
    uint assets;
    address auditor;
    uint duration;
    uint interestRate;
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
    event LogFundsSent(address merchant, uint amount);
    event LogAssetsSet(uint assets);
    event LogLoanRepayed(bool isRepayed);
    event LogLoanDestroyed(uint amountReturned);

    function Loan(
                address _lender,
                address _borrower,
                uint amount,
                string _IPFShash,
                address _auditor,
                uint _duration,
                uint _interestRate){
        lender = _lender;
        borrower = _borrower;
        balance = amount;
        initialBalance = amount;
        IPFShash = _IPFShash;
        auditor = _auditor;
        duration = _duration;
        interestRate = _interestRate;
    }

    function addMerchantToWhitelist(address merchant)
        onlyLender
        returns(bool success)
    {
        approvedAddress[merchant] = true;
        LogMerchantAddedToWhitelist(msg.sender, merchant);
        return true;
    }

    function setAssetsValue(uint _assets)
        onlyAuditor
        returns(bool success)
    {
        assets = _assets;
        LogAssetsSet(_assets);
        return true;
    }

    function setLoanInDefault()
        onlyAuditor
        returns(bool success)
    {
        inDefault = true;
        return true;
    }

    function sendFunds(address merchant, uint amount)
        onlyBorrower
        isOnWhitelist(merchant)
        returns(bool success)
    {
        balance -= amount;
        merchant.transfer(amount);
        LogFundsSent(merchant, amount);
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
