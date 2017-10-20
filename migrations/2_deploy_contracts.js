const LoanFactory = artifacts.require("./LoanFactory.sol");

module.exports = function(deployer, network, accounts) {
	if (accounts.length < 1) {
		throw new Error("At least 1 available accounts must be available in order to deploy");
	}
	deployer.deploy(LoanFactory);
};
