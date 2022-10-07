import React, { useState } from "react";
import ConnectWalletTab from "./connectWalletTab";
import styles from "./createDeal.module.css";
import SelectChainTab from "./selectChainTab";

const SecondStep = ({ setStep, dealData, addDealData }) => {
  const { form_header, active, tab_block, nav_link } = styles;
  const [connectWalletTab, setConnectWalletTab] = useState(false);

  return (
    <React.Fragment>
      <div className={form_header}>Fund The Escro Account</div>
      <div className={tab_block}>
        <button
          className={
            !connectWalletTab ? `active ${nav_link} ${active}` : nav_link
          }
          id='select-chain-tab'
          data-bs-toggle='tab'
          data-bs-target='#select-chain-tab'
          type='button'
          role='tab'
          aria-controls='select-chain-tab'
          aria-selected='true'
          onClick={() => setConnectWalletTab(false)}
        >
          Select Chain
        </button>
        <button
          className={
            connectWalletTab ? `active ${nav_link} ${active}` : nav_link
          }
          id='connect-wallet-tab'
          data-bs-toggle='tab'
          data-bs-target='#connect-wallet-tab'
          type='button'
          role='tab'
          aria-controls='connect-wallet-tab'
          aria-selected='false'
          onClick={() => setConnectWalletTab(true)}
        >
          Connect Wallet
        </button>
      </div>
      {connectWalletTab ? (
        <ConnectWalletTab
          dealData={dealData}
          setStep={setStep}
          addDealData={addDealData}
        />
      ) : (
        <SelectChainTab />
      )}
    </React.Fragment>
  );
};

export default SecondStep;
