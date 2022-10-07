export const errorMessage = {
  REQUIRED_ERROR: "Input is required",
  EMAIL_ERROR: "Email is not valid",
  CAPTCHA_WARNING: "Captcha is not resolved",
  REQUEST_DENIED: "MetaMask request denied.",
  RESOURCE_BUSY: "MetaMask resource busy. Try again later.",
  TRANSACTION_FAIL: "MetaMask transaction failed. Please try again.",
  NETWORK_ERROR: "Network Error",
  //TODO: change to mainnet after development.
  NOT_ON_BSC: "You have to be on the BSC Testnet to proceed!",
  WRONG_PASSWORD: "Wrong password. Try again.",
  INSTALL_METAMASK: "Install metamask to proceed!",
  SAME_ACCOUNT: "Switch accounts to Accept/Release!",
};

export const successMessage = {
  ON_BSC_TESTNET: "You're now on BSC Testnet.",
  TRANSACTION_SUCCESS: "Transaction's a success!",
  TRANSACTION_IN_PROCESS: "Transaction in process. Kindly wait.",
};

export const WALLETNAME = {
  metamask: "Metamask",
  phantom: "Phantom",
  tron: "Tron",
};

export const LS_KEYS = {
  AUTH_TOKEN: "auth-token",
  STEP_DATA: "step-data",
  DEAL_DATA: "deal-data",
};

export const BINANCE_TEST_NETWORK = {
  CHAINID: "0x61",
  CHAINNAME: "Binance Smart Chain Testnet",
  RPCURLS: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  NATIVE_CURRENCY_NAME: "Binance Coin",
  NATIVE_CURRENCY_SYMBOL: "tBNB",
  NATIVE_CURRENCY_DECIMAL: 18,
  BLOCK_EXPLORER_URL: "https://testnet.bscscan.com",
};

export const USDT_TOKEN = {
  TOKEN_ADDRESS: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  TOKEN_SYMBOL: "USDT",
  TOKEN_DECIMALS: 18,
  TOKEN_IMAGE:
    "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/logo.png",
};

export const ERROR_CODES = {
  USER_REJECTED_REQUEST: 4001,
  RESOURCE_BUSY: -32002,
  TRANSACTION_REJECTED: -32003,
};

export const CONTRACT_ADDRESSES = {
  BUSDTOKEN: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
  USDTTOKEN: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  ESCROW: "0x769E06857556942f1aAda2eE2E980A93a58bA4d3",
  USDCTOKEN: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // USDC's token address on Solana's devnet.
};

export const NETWORKS = {
  ETHEREUM_MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  POLYGON: 137,
  BINANCE_SMART_CHAIN_MAIN_NETWORK: 56,
  BINANCE_SMART_CHAIN_TEST_NETWORK: 97,
};

export const DEAL_PASSWORD = {
  PASSWORD: "1234",
};

export const TOAST_RESPONSE = {
  SUCCESS: "success",
  ERROR: "error",
};

export const API_RESPONSE_FIELD = {
  ID: "id",
};

export const CONTRACT_LISTENER = {
  TX_HASH: "transactionHash",
  RECEIPT: "receipt",
  ERROR: "error",
};

export const ACTION_TYPE = {
  AUTH: "auth",
  ACCEPT: "accept",
  RELEASEFUND: "releasefund",
};

export const DEAL_STATUS = {
  FUNDED: "FUNDED",
  ACCEPTED: "ACCEPTED",
  CLOSED: "CLOSED",
  INIT: "INIT",
};

export const SS_KEYS = {
  IS_PASSCODE_VALID: "isPasscodeValid",
};

export const WEI = {
  FROM_WEI: "fromWei",
  TO_WEI: "toWei",
};
