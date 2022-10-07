import React, { useEffect, useState } from "react";
import styles from "./createDeal.module.css";
import { FaRegCopy } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";

const tooltipTextData = {
  before: "Copy to clipboard",
  after: "Copied!!!",
};

const dummyLink =
  "http://localhost:3000/dashboard?id=4fcffd34-60f8-4564-95ef-b77f97cdbd8c&email=test012@yopmail.com";

const ThirdStep = ({ setStep, dealData }) => {
  const {
    form_header,
    main_container,
    main_heading,
    info_text,
    address_container,
    text_container,
    icon_container,
    custom_btn,
    tooltip,
    tooltiptext,
  } = styles;

  const [sellerUrl, setSellerUrl] = useState(dummyLink);
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");
  const navigate = useNavigate();

  useEffect(() => {
    setSellerUrl(dealData.share_link || dummyLink);
  }, []);

  return (
    <React.Fragment>
      <div
        className={form_header}
        style={{ color: "var(--bs-link-hover-color)" }}
      >
        Congratulations
      </div>
      <div className={main_container}>
        <div className={main_heading}>Escro Wallet is Funded!</div>
        <div className={info_text}>
          Share this URL with whom you want to release the funds.
        </div>
        <div className={address_container}>
          <div className={text_container}>{sellerUrl}</div>
          <div className={tooltip}>
            <span className={tooltiptext}>
              <span className={`${text_container}`} id='myTooltip'>
                {tooltipText}
              </span>
            </span>
            <div
              className={icon_container}
              onClick={() => {
                navigator.clipboard.writeText(sellerUrl);
                setTooltipText(tooltipTextData.after);
              }}
              onMouseOut={() => setTooltipText(tooltipTextData.before)}
            >
              <IconContext.Provider value={{ size: "24px" }}>
                <FaRegCopy />
              </IconContext.Provider>
            </div>
          </div>
        </div>
        <div>
          Deal Title : <span>{dealData.title}</span>
        </div>
        <div>
          Deal Description : <span>{dealData.description}</span>
        </div>
        <div>
          <div className={text_container}>Tnx Hash : {dealData.tx_hash}</div>
        </div>
        <div>
          Amount : <span>{dealData.amount} BNB</span>
        </div>
      </div>
      <div className='d-grid gap-2' style={{ padding: "1rem 24px" }}>
        <button
          //TODO: clear localStorage after completing development
          type='button'
          className={custom_btn}
          onClick={() => {
            // setStep(1);
            navigate(
              `/dashboard?id=${dealData.id}&email=${dealData.buyer_email}`
            );
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </React.Fragment>
  );
};

export default ThirdStep;
