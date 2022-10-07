import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDealData } from "../../../services/landingPage.services";
import { web3 } from "../../../services/web3.services";
import { LS_KEYS, TOAST_RESPONSE } from "../../../utils/constants.utils";
import { toastMessage } from "../../../utils/helper.utils";
import styles from "./createDeal.module.css";
import FirstStep from "./firstStep";
import LoaderComponent from "./loaderComponent";
import ProgressBar from "./progressBar";
import SecondStep from "./secondStep";
import ThirdStep from "./thirdStep";

const CreateDeal = () => {
  const { form_container, progress_bar } = styles;
  const [dealData, setDealData] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { deal_id } = useParams();
  const navigate = useNavigate();

  // varifing local storage data and if exist set them to the state and updating state
  useEffect(() => {
    if (deal_id) {
      getDealDataOnLoad();
    } else {
      const localStorageDealData = JSON.parse(
        localStorage.getItem(LS_KEYS.DEAL_DATA)
      );
      if (localStorageDealData) {
        setDealData({ ...localStorageDealData });
      }
      setLoading(false);
    }
  }, []);

  const getDealDataOnLoad = async () => {
    const res = await getDealData(deal_id);
    if (res.status) {
      if (res.data.deal_list.length === 0) {
        navigate("/create-deal");
      } else if (res.data.deal_list[0].tx_hash) {
        // TODO: correct below code after development
        navigate(
          `/dashboard?id=${res.data.deal_list[0].id}&email=${res.data.deal_list[0].buyer_email}`
        );
        // setDealData({
        //   ...res.data.deal_list[0],
        //   amount: web3.utils.fromWei(res.data.deal_list[0].amount.toString()),
        // });
        // setStep(3);
      } else {
        setDealData({
          ...res.data.deal_list[0],
          amount: web3.utils.fromWei(res.data.deal_list[0].amount.toString()),
        });
        localStorage.setItem(
          LS_KEYS.DEAL_DATA,
          JSON.stringify({
            ...res.data.deal_list[0],
            amount: web3.utils.fromWei(res.data.deal_list[0].amount.toString()),
          })
        );
        if (res.data.deal_list[0].deal_status) setStep(3);
        else setStep(2);
      }
    } else {
      navigate("/create-deal");
      toastMessage(res?.message, "get_deal_data", TOAST_RESPONSE.ERROR);
    }
    setLoading(false);
  };

  // to upadate state for deal data without removing extra entries
  const addDealData = (values) =>
    setDealData((prevState) => {
      return { ...prevState, ...values };
    });

  const getStep = (step) => {
    switch (step) {
      case 2:
        return (
          <SecondStep
            setStep={setStep}
            addDealData={addDealData}
            dealData={dealData}
          />
        );
      case 3:
        return (
          <ThirdStep
            setStep={setStep}
            addDealData={addDealData}
            dealData={dealData}
          />
        );

      default:
        return <FirstStep setStep={setStep} addDealData={addDealData} />;
    }
  };

  return (
    <div className={form_container}>
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          {getStep(step)}
          <div className={progress_bar}>
            <ProgressBar step={step} setStep={setStep} />
          </div>
        </>
      )}
    </div>
  );
};

export default CreateDeal;
