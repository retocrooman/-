//truffle migrateで実行されます
var PiggyBank = artifacts.require("./PiggyBank.sol");
//Ethereum NetworkのJPYC
//const jpyc = '0x2370f9d504c7a6e775bf6e14b3f12846b594cd53';
         
//Polygon Network(matic)のJPYC
const jpyc = '0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c';
         
//xDai NetworkのJPYC
//const jpyc = '0x417602f4fbdd471A431Ae29fB5fe0A681964C11b';

module.exports = function(deployer) {
  deployer.deploy(PiggyBank, jpyc);
};
