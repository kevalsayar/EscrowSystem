import React, { useState } from "react";
import styles from "./createDeal.module.css";
import { FaRegCopy } from "react-icons/fa";
import { IconContext } from "react-icons";

const SelectChaintab = ({ setStep }) => {
  const {
    main_container_chain,
    info_text,
    chain_address_container,
    text_container,
    icon_container,
    chain_form_container,
    chain_input_container,
    chain_input_lable,
    chain_input,
    aside_block,
    chain_container,
    custom_btn,
  } = styles;
  const [chainName, setChainName] = useState("");
  return (
    <React.Fragment>
      <div className={chain_container} style={{ minHeight: "282px" }}>
        <div className={chain_form_container}>
          <div className={chain_input_container}>
            <input
              type='radio'
              name='wallet'
              className={chain_input}
              id='metamask'
              value='0'
              checked={chainName === "0" ? true : false}
              onChange={() => setChainName("0")}
            />
            <label htmlFor='metamask' className={chain_input_lable}>
              BEP-20
            </label>
          </div>
          <div className={chain_input_container}>
            <input
              type='radio'
              name='wallet'
              className={chain_input}
              id='phantom'
              value='1'
              checked={chainName === "1" ? true : false}
              onChange={() => setChainName("1")}
            />
            <label htmlFor='phantom' className={chain_input_lable}>
              SOL
            </label>
          </div>

          <div className={chain_input_container}>
            <input
              type='radio'
              name='wallet'
              id='tron'
              className={chain_input}
              value='2'
              checked={chainName === "2" ? true : false}
              onChange={() => setChainName("2")}
            />
            <label htmlFor='tron' className={chain_input_lable}>
              TRON
            </label>
          </div>
        </div>
        <div className={main_container_chain}>
          <div className={info_text}>
            Please transfer the amount to the below given address
          </div>
          <div className={chain_address_container}>
            <div className='d-flex justify-content-between align-items-center w-100 p-2'>
              <div className={text_container}>Generated Escro Wallet</div>
              <div className={icon_container}>
                <IconContext.Provider value={{ size: "24px" }}>
                  <FaRegCopy />
                </IconContext.Provider>
              </div>
            </div>
            <div className={aside_block}>QR</div>
          </div>
        </div>
      </div>
      <div className='d-grid gap-2' style={{ padding: "1rem 24px" }}>
        <button type='button' className={custom_btn} onClick={() => setStep(3)}>
          Proceed
        </button>
      </div>
    </React.Fragment>
  );
};

export default SelectChaintab;
