import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Livedeals from "./liveDeals";
import Previousdeals from "./previousDeals";
import appstyles from "../../styles/app.module.css";
import UserDashboardAuth from "../../components/dashboardAuth";
import { useNavigate } from "react-router-dom";
import CurrentDeal from "./currentDeal";
import {
  ACTION_TYPE,
  SS_KEYS,
  TOAST_RESPONSE,
} from "../../utils/constants.utils";
import {
  acceptDealSmartContract,
  checkNetwork,
  connectToMetaMask,
  fundDealSmartContract,
  metamaskInstallationCheck,
  releaseFundSmartContract,
  switchOrAddChain,
} from "../../services/web3.services";
import { updateDealService } from "../../services/landingPage.services";
import { checkError, toastMessage } from "../../utils/helper.utils";

const DashBoard = () => {
  const {
    px_4,
    select_deals,
    live_deals,
    lighter,
    cursor_pointer,
    bolder,
    active_deal,
  } = styles;
  const { bg_none } = appstyles;
  const [toggle, setToggle] = useState(true);
  const [isauth, setIsAuth] = useState(false);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  const email = urlParams.get("email");
  const navigate = useNavigate();
  const [dealdata, setDealData] = useState({
    id,
    email,
    action: ACTION_TYPE.AUTH,
  });
  useEffect(() => {
    !id || !email
      ? navigate("/")
      : setDealData({ id, email, action: ACTION_TYPE.AUTH });
    if (sessionStorage.getItem(SS_KEYS.IS_PASSCODE_VALID)) {
      setIsAuth(true);
    }
  }, []);

  const updateDeal = async (value, accounts, txHash, passcode) => {
    const updateDealData = {
      id: value.id,
      buyer_wallet_address: accounts[0],
      tx_hash: txHash,
      passcode: passcode,
    };
    const res = await updateDealService(updateDealData);
    if (res?.status) {
      toastMessage(
        res?.message,
        "toast_updateDeal_success",
        TOAST_RESPONSE.SUCCESS
      );
    } else {
      toastMessage(
        res?.message,
        "toast_updateDeal_error",
        TOAST_RESPONSE.ERROR
      );
    }
  };

  const fundDeal = async (value) => {
    if (metamaskInstallationCheck()) {
      const accounts = await connectToMetaMask();
      if (accounts) {
        if (await switchOrAddChain()) {
          if (await checkNetwork()) {
            try {
              fundDealSmartContract(accounts, value, updateDeal);
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    }
  };

  return (
    <>
      {!isauth ? (
        <UserDashboardAuth setAuth={setIsAuth} dealdata={dealdata} />
      ) : (
        <div className={bg_none}>
          <div className="mt-5 mb-5">
            <h2 className={bolder}>Deals</h2>
            <p className={lighter}>Manage all your deals from here</p>
          </div>
          <CurrentDeal email={email} currentID={id} fundDeal={fundDeal} />

          <Livedeals email={email} fundDeal={fundDeal} />
          {/* TODO: Uncomment this when Buyer and seller api is ready */}
          {/* <div className={`${select_deals} mb-4` }>
               <span className={`${px_4} ${live_deals} ${cursor_pointer} ${toggle ? active_deal : ""}` } onClick={() => setToggle(true)} >Live Deals</span>
               <span className= {`${px_4} ${cursor_pointer} ${toggle ? "" : active_deal} font-size-18` } onClick={() => setToggle(false)}>Closed Deals</span>
            </div> */}

          <div>
            {/* {toggle ? 
               <Livedeals email={email}/> : 
               <Previousdeals />
            } */}
          </div>
        </div>
      )}
    </>
  );
};
export default DashBoard;
