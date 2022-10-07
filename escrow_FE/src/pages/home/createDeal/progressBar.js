import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./progressBar.module.css";

const ProgressBar = ({ step, setStep }) => {
  const { progress_bar, circle, progress_container, active } = styles;
  const navigate = useNavigate();

  /**
   *
   * @param {Number} step step number to change
   * @param {String} LS_KEY localstorage key to remove that entry | optional
   */
  const changeStep = (step, LS_KEY = null) => {
    setStep(1);
    navigate("/create-deal");
  };

  return (
    <div className={progress_container}>
      <div
        className={
          step === 3
            ? `w-100 ${progress_bar}`
            : step === 2
            ? `w-50 ${progress_bar}`
            : progress_bar
        }
      ></div>
      <div
        className={step > 0 ? `${circle} ${active}` : `${circle}`}
        onClick={() => step > 1 && changeStep(1)}
      >
        1
      </div>
      <div className={step > 1 ? `${circle} ${active}` : `${circle}`}>2</div>
      <div className={step > 2 ? `${circle} ${active}` : `${circle}`}>3</div>
    </div>
  );
};

export default ProgressBar;
