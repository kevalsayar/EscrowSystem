import React, { useState } from "react";
import { toastMessage } from "../../../utils/helper.utils";
import {
  weiFunctions,
  metamaskInstallationCheck,
  connectToMetaMask,
  switchOrAddChain,
  checkNetwork,
  fundDealSmartContract,
} from "../../../services/web3.services";
import {
  API_RESPONSE_FIELD,
  WALLETNAME,
  WEI,
} from "../../../utils/constants.utils";
import { updateDealService } from "../../../services/landingPage.services";
import { TOAST_RESPONSE } from "../../../utils/constants.utils";
import styles from "./createDeal.module.css";

const ConnectWalletTab = ({ setStep, dealData, addDealData }) => {
  const {
    wallet_input,
    wallet_input_lable,
    wallet_image,
    wallet_input_container,
    wallet_form_container,
    custom_btn,
  } = styles;
  const [walletName, setWalletName] = useState("");
  const [disableProceedBtn, setDisableProceedBtn] = useState(false);

  const walletProcesses = async () => {
    switch (walletName) {
      case WALLETNAME.metamask:
        fundDeal();
    }
  };

  const fundDeal = async () => {
    if (metamaskInstallationCheck()) {
      setDisableProceedBtn(true);
      const accounts = await connectToMetaMask();
      if (accounts) {
        if (await switchOrAddChain()) {
          if (await checkNetwork()) {
            try {
              await fundDealSmartContract(
                accounts,
                {
                  ...dealData,
                  amount: weiFunctions(dealData.amount.toString(), WEI.TO_WEI),
                },
                updateDeal
              );
            } catch (error) {
              setDisableProceedBtn(false);
            }
          } else setDisableProceedBtn(false);
        } else setDisableProceedBtn(false);
      } else setDisableProceedBtn(false);
    }
  };

  const updateDeal = async (dealData, accounts, txHash, passcode) => {
    const updateDealData = {
      id: dealData && dealData[API_RESPONSE_FIELD.ID],
      buyer_wallet_address: accounts[0],
      tx_hash: txHash.toString(),
      passcode: passcode,
    };
    const res = await updateDealService(updateDealData);
    if (res?.status) {
      toastMessage(
        res?.message,
        "toast_updateDeal_success",
        TOAST_RESPONSE.SUCCESS
      );
      // debugger;
      addDealData({
        ...res.data,
        amount: weiFunctions(`${res.data.amount}`, WEI.FROM_WEI),
      });
      localStorage.clear();
      setTimeout(() => {
        setStep(3);
      }, 1000);
    } else {
      toastMessage(
        res?.message,
        "toast_updateDeal_error",
        TOAST_RESPONSE.ERROR
      );
    }
  };

  return (
    <React.Fragment>
      <div className={wallet_form_container}>
        <div className={wallet_input_container}>
          <input
            type="radio"
            name="wallet"
            className={wallet_input}
            id={WALLETNAME.metamask}
            value="0"
            checked={walletName === WALLETNAME.metamask ? true : false}
            onChange={() => {
              setWalletName(WALLETNAME.metamask);
            }}
          />
          <img
            src="/assets/icons/metamask.svg"
            alt={WALLETNAME.metamask}
            className={wallet_image}
          />
          <label htmlFor={WALLETNAME.metamask} className={wallet_input_lable}>
            {WALLETNAME.metamask}
          </label>
        </div>
        <div className={wallet_input_container}>
          <input
            type="radio"
            name="wallet"
            className={wallet_input}
            id={WALLETNAME.phantom}
            value="1"
            checked={walletName === WALLETNAME.phantom ? true : false}
            onChange={() => {
              setWalletName(WALLETNAME.phantom);
            }}
          />
          <img
            src="/assets/icons/phantom-logo.svg"
            alt={WALLETNAME.phantom}
            className={wallet_image}
          />
          <label htmlFor={WALLETNAME.phantom} className={wallet_input_lable}>
            {WALLETNAME.phantom}
          </label>
        </div>

        <div className={wallet_input_container}>
          <input
            type="radio"
            name="wallet"
            id={WALLETNAME.tron}
            className={wallet_input}
            value="2"
            checked={walletName === WALLETNAME.tron ? true : false}
            onChange={() => {
              setWalletName(WALLETNAME.tron);
            }}
          />
          <img
            src="/assets/icons/tron.svg"
            alt={WALLETNAME.tron}
            className={wallet_image}
          />
          <label htmlFor={WALLETNAME.tron} className={wallet_input_lable}>
            {WALLETNAME.tron}
          </label>
        </div>
      </div>
      <div className="d-grid gap-2" style={{ padding: "1rem 24px" }}>
        <button
          type="button"
          disabled={walletName ? (disableProceedBtn ? true : false) : true}
          className={custom_btn}
          onClick={() => {
            walletProcesses();
          }}
        >
          Proceed
        </button>
      </div>
    </React.Fragment>
  );
};

export default ConnectWalletTab;
