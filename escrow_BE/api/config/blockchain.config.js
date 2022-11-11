const ether = require("ethers");
const EscrowSmartContractAbi = require("./../../contract_abi.json");
const { CONTRACT_ADDRESS, JSON_RPC_URL } = require("./../../env");
const providers = new ether.providers.JsonRpcBatchProvider(JSON_RPC_URL);
const contract = new ether.Contract(CONTRACT_ADDRESS, EscrowSmartContractAbi, providers);
module.exports = {
    contract
}