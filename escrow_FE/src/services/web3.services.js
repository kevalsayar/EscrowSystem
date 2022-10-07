import Web3 from "web3";
import {
  BINANCE_TEST_NETWORK,
  NETWORKS,
  CONTRACT_ADDRESSES,
  errorMessage,
  successMessage,
  DEAL_PASSWORD,
  TOAST_RESPONSE,
  CONTRACT_LISTENER,
} from "../utils/constants.utils";
import { toastMessage } from "../utils/helper.utils";
import escrowabiArray from "../abi/escrowabi.json";
import { checkError } from "../utils/helper.utils";

export const web3 = new Web3(window.ethereum);

/**
 * Converts an amount into Wei or from Wei, as specified.
 * @param {Number} amount - amount to be converted.
 * @param {Function} toOrFromWei - function to be used.
 * @returns {Number} - converted amount.
 */
export const weiFunctions = (amount, toOrFromWei) => {
  const resultingAmount = web3.utils[toOrFromWei](amount);
  return resultingAmount;
};

/**
 * Metamask's installation check.
 * @returns {Boolean} - true if installed.
 */
export const metamaskInstallationCheck = () => {
  if (window.ethereum && window.ethereum.isMetaMask) return true;
  else {
    toastMessage(
      errorMessage.INSTALL_METAMASK,
      "toast_installation_error",
      TOAST_RESPONSE.ERROR
    );
    return false;
  }
};

/**
 * Connecting user with metamask.
 * @returns {(Object | Boolean)} - returns object if no error's thrown, else boolean.
 */
export const connectToMetaMask = async () => {
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    return accounts;
  } else {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      toastMessage(
        `Connected with ${
          accounts[0].substring(0, 5) +
          "..." +
          accounts[0].substring(accounts[0].length - 5)
        }`,
        "toast_address_success",
        TOAST_RESPONSE.SUCCESS
      );
      return accounts;
    } catch (error) {
      checkError(error);
      return false;
    }
  }
};

// TODO: Change to mainnet pre-deployment.
/**
 * Adds BSC Testnet chain for the user.
 * @returns {Boolean} - true if no error's thrown else false.
 */
export const switchOrAddChain = async () => {
  try {
    await web3.currentProvider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: BINANCE_TEST_NETWORK.CHAINID,
          chainName: BINANCE_TEST_NETWORK.CHAINNAME,
          rpcUrls: [BINANCE_TEST_NETWORK.RPCURLS],
          nativeCurrency: {
            name: BINANCE_TEST_NETWORK.NATIVE_CURRENCY_NAME,
            symbol: BINANCE_TEST_NETWORK.NATIVE_CURRENCY_SYMBOL,
            decimals: BINANCE_TEST_NETWORK.NATIVE_CURRENCY_DECIMAL,
          },
          blockExplorerUrls: [BINANCE_TEST_NETWORK.BLOCK_EXPLORER_URL],
        },
      ],
    });
    return true;
  } catch (error) {
    checkError(error);
    return false;
  }
};

/**
 * Ensures the user's on the BSC Testnet chain.
 * @returns {Boolean} - true if user's on the required chain else false.
 */
export const checkNetwork = async () => {
  const networkId = await web3.eth.getChainId();
  // TODO: Change to BSC Mainnet pre-deployment.
  if (networkId === NETWORKS.BINANCE_SMART_CHAIN_TEST_NETWORK) {
    return true;
  } else {
    toastMessage(
      errorMessage.NOT_ON_BSC,
      "toast_notOnBscTestnet_error",
      TOAST_RESPONSE.ERROR
    );
    return false;
  }
};

/**
 * Initializes a smart contract object.
 * @param @param {Object} abi - any smart contract's abi.
 * @param {String} contractAddress - any smart contract's address.
 * @returns {Object} - initialized contract.
 */
export const initializeSmartContract = (abi, contractAddress) => {
  const newSmartContract = new web3.eth.Contract(abi, contractAddress);
  return newSmartContract;
};

/**
 * Calls the fundDeal method of the smart contract.
 * @param {Object} accounts - user's metamask's wallet address.
 * @param {Object} dealData - particular deal's data fetched via API.
 * @param {Function} updateDeal - function to update deal status post funding.
 * @returns {Object}
 */
export const fundDealSmartContract = (accounts, dealData, updateDeal) => {
  const escrowContract = initializeSmartContract(
    escrowabiArray,
    CONTRACT_ADDRESSES.ESCROW
  );
  return escrowContract.methods
    .fundDeal(dealData.id, accounts[0], DEAL_PASSWORD.PASSWORD)
    .send({
      from: accounts[0],
      to: CONTRACT_ADDRESSES.ESCROW,
      value: dealData.amount,
    })
    .on(CONTRACT_LISTENER.TX_HASH, function () {
      toastMessage(
        successMessage.TRANSACTION_IN_PROCESS,
        "toast_tx_success",
        TOAST_RESPONSE.SUCCESS
      );
    })
    .on(CONTRACT_LISTENER.RECEIPT, function (receipt) {
      if (receipt.status === true) {
        toastMessage(
          successMessage.TRANSACTION_SUCCESS,
          "toast_tx_success",
          TOAST_RESPONSE.SUCCESS
        );
        updateDeal(
          dealData,
          accounts,
          receipt.transactionHash,
          DEAL_PASSWORD.PASSWORD
        );
      } else {
        toastMessage(
          errorMessage.TRANSACTION_FAIL,
          "toast_tx_error",
          TOAST_RESPONSE.ERROR
        );
      }
    })
    .on(CONTRACT_LISTENER.ERROR, function (error) {
      checkError(error);
    });
};

/**
 * Calls the acceptDeal method of the smart contract.
 * @param {Object} accounts - user's metamask's wallet address.
 * @param {Object} dealData - particular deal's data fetched via API.
 * @returns {Object}
 */
export const acceptDealSmartContract = (accounts, dealData) => {
  const escrowContract = initializeSmartContract(
    escrowabiArray,
    CONTRACT_ADDRESSES.ESCROW
  );
  return escrowContract.methods
    .acceptDeal(accounts[0], dealData, DEAL_PASSWORD.PASSWORD)
    .send({
      from: accounts[0],
    })
    .on(CONTRACT_LISTENER.TX_HASH, function () {
      toastMessage(
        successMessage.TRANSACTION_IN_PROCESS,
        "toast_tx_success",
        TOAST_RESPONSE.SUCCESS
      );
    })
    .on(CONTRACT_LISTENER.RECEIPT, function (receipt) {
      if (receipt.status === true) {
        toastMessage(
          successMessage.TRANSACTION_SUCCESS,
          "toast_tx_success",
          TOAST_RESPONSE.SUCCESS
        );
      } else {
        toastMessage(
          errorMessage.TRANSACTION_FAIL,
          "toast_tx_error",
          TOAST_RESPONSE.ERROR
        );
      }
    })
    .on(CONTRACT_LISTENER.ERROR, function (error) {
      checkError(error);
    });
};

/**
 * Calls the releaseFund method of the smart contract.
 * @param {Object} accounts - user's metamask's wallet address.
 * @param {Object} dealData - particular deal's data fetched via API.
 * @returns {Object}
 */
export const releaseFundSmartContract = (accounts, dealData) => {
  const escrowContract = initializeSmartContract(
    escrowabiArray,
    CONTRACT_ADDRESSES.ESCROW
  );
  return escrowContract.methods
    .releaseFund(dealData, DEAL_PASSWORD.PASSWORD)
    .send({
      from: accounts[0],
    })
    .on(CONTRACT_LISTENER.TX_HASH, function () {
      toastMessage(
        successMessage.TRANSACTION_IN_PROCESS,
        "toast_tx_success",
        TOAST_RESPONSE.SUCCESS
      );
    })
    .on(CONTRACT_LISTENER.RECEIPT, function (receipt) {
      if (receipt.status === true) {
        toastMessage(
          successMessage.TRANSACTION_SUCCESS,
          "toast_tx_success",
          TOAST_RESPONSE.SUCCESS
        );
      } else {
        toastMessage(
          errorMessage.TRANSACTION_FAIL,
          "toast_tx_error",
          TOAST_RESPONSE.ERROR
        );
      }
    })
    .on(CONTRACT_LISTENER.ERROR, function (error) {
      checkError(error);
    });
};

/**
 * Validates the user inputted password.
 * @param {Object} dealId - dealId of a particular deal.
 * @param {Object} passcode - user inputted passcode.
 * @returns {Boolean}
 */
export const validateUserForDealSmartContract = async (dealId, passcode) => {
  const escrowContract = initializeSmartContract(
    escrowabiArray,
    CONTRACT_ADDRESSES.ESCROW
  );
  return escrowContract.methods
    .validateUserForDeal(dealId, passcode)
    .call()
    .then(function (result) {
      return result;
    });
};
