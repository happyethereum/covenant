pragma solidity ^0.4.0;

contract Loan {

    address lender;
    address borrower;
    uint initialBalance;
    uint balance;
    string IPFShash;
    uint totalAmountRepayed;
    address auditor;
    address[] public whitelist;


    struct WhitelistStruct {
    bool isApproved;
    uint index;
  }

  mapping(address => WhitelistStruct) whitelistStructs;



    enum Status {PENDING,REPAYED,DEFAULT}
    Status public status=Status.PENDING;

    modifier isActive(){
        require(status==Status.PENDING);
        _;
    }

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
        require(whitelistStructs[merchant].isApproved);
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
        onlyLender isActive
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
        onlyAuditor
        isActive
        returns(bool success)
    {
        status=Status.DEFAULT;
        LogStatusChange(status);
        return true;
    }

    function payBackLender()
        public
        payable
        onlyBorrower
        returns(bool success) {

        require(msg.value!=0);
        uint amount=msg.value;
        totalAmountRepayed+=amount;
        lender.transfer(amount);
        LogAmountRepayed(amount,totalAmountRepayed);
        return true;

    }

    function payMerchant(address merchant, uint amount)
        onlyBorrower
        isOnWhitelist(merchant)
        isActive
        returns(bool success)
    {
        require(amount<=balance);
        merchant.transfer(amount);
        balance -= amount;
        LogPayMerchant(merchant, amount);
        return true;
    }

    function setLoanRepayed()
        onlyAuditor
        isActive
        returns(bool success)
    {
        status=Status.REPAYED;
        LogStatusChange(status);
        return true;
    }

    function revokeMerchant(address merchant)
        onlyLender
        isActive
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
        onlyIfInDefault
        returns (bool success)
    {
        LogLoanDestroyed(balance);
        selfdestruct(lender);
        return true;
    }
}
