import React, { useEffect, useState } from "react";
import styles from "./dashboardauth.module.css";
import {
  connectToMetaMask,
  acceptDealSmartContract,
  checkNetwork,
  weiFunctions,
  metamaskInstallationCheck,
  releaseFundSmartContract,
  switchOrAddChain,
  validateUserForDealSmartContract,
} from "../../services/web3.services";
import {
  errorMessage,
  LS_KEYS,
  SS_KEYS,
  TOAST_RESPONSE,
  WEI,
} from "../../utils/constants.utils";
import { toastMessage } from "../../utils/helper.utils";
import { useNavigate } from "react-router-dom";
import { getDealData } from "../../services/landingPage.services";
import Skeleton from "react-loading-skeleton";

const UserDashboardAuth = ({ setAuth, dealdata, setPopups }) => {
  let dealid = dealdata.id;
  const [passcode, setPasscode] = useState(null);
  const [deal, setDeal] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    conatiner_modal,
    modal,
    header,
    modal_body,
    btn_custom,
    height_40,
    passcodes,
    work_break,
    padding_10,
    btn_custom_close,
    tnx_hash,
  } = styles;
  const [disableVerifyButton, setDisableVerifyButton] = useState(true);
  const [disableCloseButton, setDisableCloseButton] = useState(false);

  const checkPasscode = async () => {
    if (await validateUserForDealSmartContract(dealid, passcode)) {
      if (dealdata.action === "accept") {
        fundAcceptOrRelease(acceptDealSmartContract);
      } else if (dealdata.action === "releasefund") {
        fundAcceptOrRelease(releaseFundSmartContract);
      } else if (dealdata.action === "auth") {
        sessionStorage.setItem(SS_KEYS.IS_PASSCODE_VALID, true);
        setAuth(true);
      }
    } else {
      // Wrong Password.
      toastMessage(
        errorMessage.WRONG_PASSWORD,
        "toast_wrongPassword_error",
        TOAST_RESPONSE.ERROR
      );
    }
  };

  /**
   * Helps accept deal/release fund when on the dashboard.
   * @param {Function} acceptOrRelease - takes in either acceptDeal or releaseFund's function defined in web3 services.
   */
  const fundAcceptOrRelease = async (acceptOrRelease) => {
    if (metamaskInstallationCheck()) {
      setDisableVerifyButton(true);
      setDisableCloseButton(true);
      const accounts = await connectToMetaMask();
      if (accounts) {
        if (accounts[0] !== dealdata.buyer_wallet_address) {
          if (await switchOrAddChain()) {
            if (await checkNetwork()) {
              try {
                await acceptOrRelease(accounts, dealdata.id);
                setPopups(false);
              } catch (error) {
                setDisableVerifyButton(false);
                setDisableCloseButton(false);
              }
            } else {
              setDisableVerifyButton(false);
              setDisableCloseButton(false);
            }
          } else {
            setDisableVerifyButton(false);
            setDisableCloseButton(false);
          }
        } else {
          toastMessage(
            errorMessage.SAME_ACCOUNT,
            "toast_sameAccount_error",
            TOAST_RESPONSE.ERROR
          );
          setDisableVerifyButton(false);
          setDisableCloseButton(false);
        }
      } else {
        setDisableVerifyButton(false);
        setDisableCloseButton(false);
      }
    }
  };

  const getDeal = async (Dealid) => {
    const res = await getDealData(Dealid);
    if (res.status && res.data.deal_list.length) {
      setDeal(res.data.deal_list);
      setLoading(false);
    } else {
      navigate("/");
      toastMessage(
        errorMessage.NETWORK_ERROR,
        "toast_wrongNetwork_error",
        TOAST_RESPONSE.ERROR
      );
    }
  };
  useEffect(() => {
    getDeal(dealid);
  }, []);

  return (
    <div className={`${conatiner_modal}`}>
      <div className={`${modal}`}>
        <div className={`${header}`}>Please add your passcode</div>
        <div className={`${modal_body}`}>
          {loading ? (
            <div>
              <Skeleton containerClassName="w-100" height={20} width="40%" />
              <Skeleton containerClassName="w-100" height={20} width="50%" />
              <Skeleton containerClassName="w-100" height={20} width="20%" />
              <Skeleton containerClassName="w-100" height={20} width="100%" />
            </div>
          ) : (
            deal.map((value) => {
              return (
                <div key={value.id}>
                  <div>
                    Deal Title : <span>{value.title}</span>
                  </div>
                  <div>
                    Deal Description : <span>{value.description}</span>
                  </div>
                  <div className={tnx_hash}>
                    Txn Hash :{" "}
                    <span className={`${work_break}`}>{value.tx_hash}</span>
                  </div>
                  <div>
                    Amount :{" "}
                    <span>
                      {weiFunctions(value.amount.toString(), WEI.FROM_WEI)}
                      {" tBNB"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div className={`${passcodes} pt-2`}>
            <input
              type="password"
              name="passcode"
              className={`w-100 ${padding_10} ${height_40}`}
              placeholder="Please enter passcode"
              onChange={(e) => {
                setPasscode(e.target.value);
                e.target.value
                  ? setDisableVerifyButton(false)
                  : setDisableVerifyButton(true);
              }}
            />
          </div>
          <div className="pt-3">
            {dealdata.action === "auth" ? (
              <button
                onClick={checkPasscode}
                className={`w-100 ${btn_custom}`}
                disabled={disableVerifyButton}
              >
                Verify Passcode
              </button>
            ) : (
              <div className="d-flex gap-3">
                <button
                  onClick={checkPasscode}
                  className={`w-50 ${btn_custom}`}
                  disabled={disableVerifyButton}
                >
                  Verify Passcode
                </button>
                <button
                  onClick={() => setPopups(false)}
                  className={`w-50 ${btn_custom_close}`}
                  disabled={disableCloseButton}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardAuth;
