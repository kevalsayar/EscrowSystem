import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import axiosIntance from "../../configs/axios.config";
import ReactPaginate from "react-paginate";
import { weiFunctions } from "../../services/web3.services";
import { ACTION_TYPE, DEAL_STATUS, WEI } from "../../utils/constants.utils";
import UserDashboardAuth from "../../components/dashboardAuth";
import Skeleton from "react-loading-skeleton";
import TableLoader from "../home/createDeal/loaderComponent/tableLoader";

const Livedeals = ({ email, fundDeal }) => {
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
  const [currentpage, setCurrentPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
  const [poups, setPopups] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dealdata, setDealData] = useState({});

  const handlePageClick = (clickedPageNumber) => {
    setCurrentPage(clickedPageNumber.selected + 1);
  };
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

  const fetchApi = () => {
    axiosIntance
      .get("/deal", {
        params: { email: email, page_num: currentpage, record_limit: "6" },
      })
      .then((res) => {
        if (res.status === 200 && res.data.data.deal_list.length) {
          setDeals(res.data.data.deal_list);
          setTotalPage(Math.ceil(res.data.data.total_records / 6));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };
  useEffect(() => {
    fetchApi();
    // setLoading(false);
  }, [currentpage]);

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
              onClick={() => {
                setPopups(true);
                setDealData({ ...value, action: ACTION_TYPE.ACCEPT });
              }}
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
              onClick={() => {
                setPopups(true);
                setDealData({ ...value, action: ACTION_TYPE.RELEASEFUND });
              }}
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
      {poups ? (
        <div className={margin_minus40}>
          <UserDashboardAuth setPopups={setPopups} dealdata={dealdata} />
        </div>
      ) : (
        <>
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
                {loading ? (
                  <TableLoader row="5" />
                ) : deals.length === 0 ? (
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
                        {checkAction(
                          value.deal_status,
                          value.buyer_email,
                          value
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="paginate">
            {deals.length !== 0 ? (
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={totalpage}
                previousLabel="<"
                containerClassName={`${list} d-flex w-100`}
                pageClassName={styles.page_number_box}
                breakClassName={styles.page_number_box}
                previousClassName={styles.pre_next_div}
                nextClassName={styles.pre_next_div}
                activeClassName={styles.active_page}
                pageLinkClassName={styles.page_links}
                previousLinkClassName={styles.page_links}
                nextLinkClassName={styles.page_links}
                breakLinkClassName={styles.page_links}
              />
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default Livedeals;
