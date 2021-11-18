const PiggyBankContract = artifacts.require("PiggyBank");

//ここでコントラクトのテストをします（省略）
contract("PiggyBank", accounts => {
    let piggybank;
    
    describe("initialization", () => {
        beforeEach (async () => {
            piggybank = PiggyBankContract.deployed();
        });
    });
});