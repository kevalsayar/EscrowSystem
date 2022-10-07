import React from "react";
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import axiosIntance from "../../configs/axios.config";
import { weiFunctions } from "../../services/web3.services";
import { toastMessage } from "../../utils/helper.utils";
import {
  TOAST_RESPONSE,
  DEAL_STATUS,
  WEI,
  errorMessage,
  LS_KEYS,
} from "../../utils/constants.utils";
import { useNavigate } from "react-router-dom";

const CurrentDeal = ({ currentID, email, fundDeal }) => {
  const {
    line_height,
    t_head,
    border_radius_none,
    list,
    min_width_220,
    margin_minus40,
    t_body,
  } = styles;
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  const setDealID = (id) => {
    let firtsStr = id.substring(0, 4);
    return firtsStr;
  };
  const setTnxHash = (tnx) => {
    if (!tnx) {
      return "-";
    }
    let trnsactionhas = tnx.substring(0, 4);
    let endhash = tnx.substring(tnx.length - 3);
    let newhash = trnsactionhas + "..." + endhash;
    return newhash;
  };
  const setDate = (createDate) => {
    const utcDate = new Date(createDate);
    const fullDate =
      utcDate.getDate() +
      "/" +
      utcDate.getMonth() +
      "/" +
      utcDate.getFullYear();
    const getTime =
      utcDate.getHours() +
      ":" +
      utcDate.getMinutes() +
      ":" +
      utcDate.getSeconds();
    return (
      <>
        <span>
          {fullDate} <span className="d-block">{getTime}</span>
        </span>
      </>
    );
  };

  useEffect(() => {
    // TODO: CALL API FROM SERVICE
    axiosIntance
      .get("/deal", { params: { deal_id: currentID } })
      .then((res) => {
        if (!res || res.data.data.deal_list.length) {
          setDeals(res.data.data.deal_list);
        } else {
          navigate("/");
          toastMessage(
            errorMessage.NETWORK_ERROR,
            "toast_wrongNetwork_error",
            TOAST_RESPONSE.ERROR
          );
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const checkStatus = (currentStatus) => {
    switch (currentStatus) {
      case "1":
        return DEAL_STATUS.FUNDED;
      case "2":
        return DEAL_STATUS.ACCEPTED;
      case "3":
        return DEAL_STATUS.CLOSED;
      default:
        return DEAL_STATUS.INIT;
    }
  };

  const checkAction = (action, buyerEmail, value) => {
    switch (action) {
      case "1":
        return email === buyerEmail ? (
          <td>
            <button
              className={` ${border_radius_none} btn btn-outline-primary w-100`}
            >
              Cancel
            </button>
          </td>
        ) : (
          <td className="gap-2">
            <button
              className={`btn btn-outline-success ${border_radius_none} w-100`}
              // TODO: Uncomment when current deal's card layout's designed.
              // onClick={() => {
              //   acceptDeal(value);
              // }}
            >
              {" "}
              Accept
            </button>
          </td>
        );
      case "2":
        return (
          <td>
            <button
              className={` ${border_radius_none} btn btn-outline-success w-100`}
              // TODO: Uncomment when current deal's card layout's designed.
              // onClick={() => {
              //   releaseFund(value);
              // }}
            >
              Release Fund
            </button>
          </td>
        );
      case "3":
        return (
          <td>
            <button
              className={` ${border_radius_none}  btn btn-danger w-100`}
              disabled
            >
              CLOSED
            </button>
          </td>
        );
      default:
        return (
          <td>
            <button
              className={` ${border_radius_none} btn btn-outline-warning w-100`}
              onClick={() => {
                fundDeal(value);
              }}
            >
              Please Fund the deal
            </button>
          </td>
        );
    }
  };

  return (
    <>
      {/* TODO: Create card layout for this */}
      <div className="table-responsive">
        <table className={`${line_height} w-100 table`}>
          <thead className={t_head}>
            <tr>
              <th>Deal ID</th>
              <th>Txn Hash</th>
              <th>Deal Title</th>
              <th>Deal Description</th>
              <th>Created At</th>
              <th>Deal Amount</th>
              <th>Deal Status</th>
              <th className={`${min_width_220}`}>Action</th>
            </tr>
          </thead>

          <tbody className={t_body}>
            {deals.length === 0 ? (
              <tr>
                {" "}
                <td colSpan={7} className="text-center">
                  No Data Found
                </td>
              </tr>
            ) : (
              deals.map((value) => {
                return (
                  <tr key={value.id}>
                    <td>{setDealID(value.id)}</td>
                    <td>{setTnxHash(value.tx_hash)}</td>
                    <td>{value.title}</td>
                    <td>{value.description}</td>
                    <td>{setDate(value.createdAt)}</td>
                    <td>
                      {weiFunctions(value.amount.toString(), WEI.FROM_WEI)}
                      {" BNB"}
                    </td>
                    <td>{checkStatus(value.deal_status)}</td>
                    {checkAction(value.deal_status, value.buyer_email, value)}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CurrentDeal;
