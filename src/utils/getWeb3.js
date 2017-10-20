const Web3 = require('web3');
const Promise = require('bluebird');

function getWeb3(){
	let web3Instance;
	if (typeof web3 !== 'undefined') {
		web3Instance = new Web3(web3.currentProvider);
	} else {
		web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
	}

	Promise.promisifyAll(web3Instance.eth, { suffix: 'Promise' });
	Promise.promisifyAll(web3Instance.version, { suffix: 'Promise' });

	return web3Instance;
};

let web3;

module.exports = () => {

  if(!web3) {
    web3 = getWeb3();
  }
  return web3;
};