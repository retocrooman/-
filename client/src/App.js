import React, { Component } from "react";
import PiggyBankContract from "./contracts/PiggyBank.json"; //ここで呼び出したいコントラクトのabiをimportする
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  state = { name: "", symbol: "", amount: 0, web3: null, accounts: null, contract: null, saving: 0, contractAddress: null };

  componentDidMount = async () => {
    try {
      const contractAddress = '0xf36D7eFCF7931f8328A65d9599D09097459165DE'; //貯金箱のコントラクトアドレス
      //ライブラリからプロバイダーの設定とweb3のインスタンスの生成
      const web3 = await getWeb3();

      //web3を使ってアカウントの設定
      const accounts = await web3.eth.getAccounts();

      //コントラクトのインスタンスを生成
      const instance = await new web3.eth.Contract(
        PiggyBankContract.abi, //abi情報
        contractAddress //貯金箱のコントラクトアドレス
      );

      //web3、accounts、constractの情報をセットし、コントラクトの操作を実行
      this.setState({ web3, accounts, contract: instance, contractAddress }, this.run);
    } catch (error) {
      //上記で問題が発生した場合
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //コントラクトを操作する
  run = async () => {
    const { contract } = this.state;
    const name = await contract.methods.getname().call(); //名前
    const symbol = await contract.methods.getsymbol().call(); //シンボル
    const amount = await contract.methods.jpycAmount().call(); //貯金額
    this.setState({ name, symbol, amount });
  };

  //web3の処理
  //JPYCを引き出す
  //承認する
  approveHandler = async () => {
    const { accounts, contract } = this.state;
    contract.methods.approveJpycFromContract().send({from: accounts[0]}); //貯金箱コントラクトからの送金の許可
  }
  //引き出す
  withdrawHandler = async () => {
    const { accounts, contract } = this.state;
    contract.methods.withdraw_jpyc().send({from: accounts[0]}); //貯金箱コントラクトから引き出す
  }
  //JPYCを貯金する
  formSubmitHandler = async () => {
    const {accounts, web3, saving, contractAddress} = this.state;
    const JPYC_contractAddress = '0xbD9c419003A36F187DAf1273FCe184e1341362C0'; //JPYCのコントラクトアドレス
    const JPYC_abi=[
      {constant:!0,inputs:[],name:"decimals",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},
      {constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}
    ] //JPYCコントラクトの必要なabi情報
    //非同期処理
    const JPYC_contract = await new web3.eth.Contract(JPYC_abi,JPYC_contractAddress); //JPYCのコントラクトのインスタンスを生成
    const decimals = await JPYC_contract.methods.decimals().call(); //JPYCの桁数を呼び出す
    const value = saving*10**decimals; //小数点以下の桁を追加
    const valueHex = '0x' + web3.utils.toBN(value).toString(16); //16進数にすることで大きな数も扱える
    JPYC_contract.methods.transfer(contractAddress, valueHex).send({from: accounts[0]}); //送信
  }
  //貯金する金額を更新
  handleSaving = (e) => {
    const inputVal = e.target.value;
    this.setState({ saving: inputVal });
  }

  //画面表示
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>JPYC貯金箱</h1>
        <p>名前</p>
        {this.state.name}
        <p>シンボル</p>
        {this.state.symbol}
        <p>貯金額</p>
        {this.state.amount}
        <p>貯金をしよう！！</p>
        <form>
          <label>
            金額
            <input type="number" value={this.state.saving} onChange={ e => this.handleSaving(e) } />
          </label>
        </form>
        <button onClick={this.formSubmitHandler}>貯金する</button>
        <p>引き出すには承認が必要です</p>
        <button onClick={this.approveHandler}>承認する</button>
        <button onClick={this.withdrawHandler}>引き出す</button>
      </div>
    );
  }
}

export default App;
