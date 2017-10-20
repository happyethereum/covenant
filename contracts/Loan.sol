pragma solidity ^0.4.0;

contract Loan {

    address lender;
    address recipient;
    uint balance;
    string IPFShash;

    modifier onlyLender(){
        require(msg.sender == lender);
        _;
    }

    modifier onlyRecipient(){
        require(msg.sender == recipient);
        _;
    }

    modifier isOnWhitelist(address merchant){
        require(approvedAddress[merchant] == true);
        _;
    }

    mapping(address => bool) approvedAddress;

    event LogMerchantAddedToWhitelist(address sender, address merchant);
    event LogFundsSent(address merchant, uint amount);

    function Loan(address _recipient, string _IPFShash){
        lender = msg.sender;
        recipient = _recipient;
        balance = msg.value;
        IPFShash = _IPFShash;
    }

    function addMerchantToWhitelist(address merchant)
        onlyLender
        returns(bool success)
    {
        approvedAddress[merchant] = true;
        LogMerchantAddedToWhitelist(msg.sender, merchant);
        return true;
    }

    function sendFunds(address merchant, uint amount)
        onlyRecipient
        isOnWhitelist(merchant)
        returns(bool success)
    {
        balance -= amount;
        merchant.transfer(amount);
        LogFundsSent(merchant, amount);
        return true;
    }

}
