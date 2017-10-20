pragma solidity ^0.4.0;

contract Loan {

    address lender;
    address borrower;
    uint initialBalance;
    uint balance;
    string IPFShash;
    address auditor;
    address[] public whitelist;
    
    
    struct WhitelistStruct {
    bool isApproved;
    uint index;
  }
  
  mapping(address => WhitelistStruct) whitelistStructs;
  
  
    
    enum Status {PENDING,REPAYED,DEFAULT}
    Status status=Status.PENDING;

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
        require(whitelistStructs[merchant].isApproved == true);
        _;
    }

    modifier onlyIfInDefault(){
        require(status==Status.DEFAULT);
        _;
    }

    

    event LogMerchantAddedToWhitelist(address sender, address merchant);
    event LogRevokeMerchantFromWhitelist(address merchant);
    event LogPayMerchant(address merchant, uint amount);
    event LogLoanDestroyed(uint amountReturned);
    event LogStatusChange(Status status);
    

    function Loan(
                address _lender,
                address _borrower,
                uint amount,
                string _IPFShash,
                address _auditor) public{
        lender = _lender;
        borrower = _borrower;
        balance = amount;
        initialBalance = amount;
        IPFShash = _IPFShash;
        auditor = _auditor;
    }

    function addMerchantToWhitelist(address merchant)
        onlyLender public
        returns(bool success)
    {
        require(whitelistStructs[merchant].isApproved != true);
        whitelistStructs[merchant].isApproved = true;
        whitelistStructs[merchant].index=whitelist.length;
        whitelist.push(merchant);
        LogMerchantAddedToWhitelist(msg.sender, merchant);
        return true;
    }

    function setLoanInDefault()
        onlyAuditor public
        returns(bool success)
    {
        status=Status.DEFAULT;
        LogStatusChange(status);
        return true;
    }

    function payMerchant(address merchant, uint amount)
        onlyBorrower public
        isOnWhitelist(merchant)
        returns(bool success)
    {
        require(amount<=balance);
        balance -= amount;
        merchant.transfer(amount);
        LogPayMerchant(merchant, amount);
        return true;
    }

    function setLoanRepayed()
        onlyAuditor public
        returns(bool success)
    {
        status=Status.REPAYED;
        LogStatusChange(status);
        return true;
    }

    function revokeMerchant(address merchant)
        onlyLender public
        returns(bool success)
    {
        require(whitelistStructs[merchant].isApproved == true);
        whitelistStructs[merchant].isApproved = false;
        
        uint rowToDelete= whitelistStructs[merchant].index;
        address keyToMove = whitelist[whitelist.length-1];
        whitelist[rowToDelete] = keyToMove;
        whitelistStructs[keyToMove].index = rowToDelete; 
        whitelist.length--;
        LogRevokeMerchantFromWhitelist(merchant);
        return true;
    }

    function kill()
        onlyLender
        onlyIfInDefault public
        returns (bool success)
    {
        selfdestruct(lender);
        LogLoanDestroyed(balance);
        return true;
    }

