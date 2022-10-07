import React, { useEffect, useState } from "react";
import styles from "./createDeal.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import ReCaptcha from "../../../components/captcha";
import {
  API_RESPONSE_FIELD,
  errorMessage,
  LS_KEYS,
  TOAST_RESPONSE,
  WEI,
} from "../../../utils/constants.utils";
import { toastMessage } from "../../../utils/helper.utils";
import { addDeal } from "../../../services/landingPage.services";
import { useNavigate } from "react-router-dom";
import { weiFunctions } from "../../../services/web3.services";

// error messages
const { REQUIRED_ERROR, EMAIL_ERROR, CAPTCHA_WARNING } = errorMessage;

// individual errors
const ERRORS = {
  LEADIND_TRAILING_SPACE:
    "The contact name cannot include leading and trailing spaces",
  MINIMUM_AMOUNT: "Minimum 0.01 BNB required",
  EMAIL_MUST_DIFFERENT: "Buyer and Seller email must be different",
};

// form field constant
const FIELD_NAME = {
  TITLE: "title",
  DESCRIPTION: "description",
  AMOUNT: "amount",
  SELLER_EMAIL: "seller_email",
  BUYER_EMAIL: "buyer_email",
  CAPTCHA: "captcha",
};

// yup validation schema for the form validation
const validationSchema = yup.object().shape({
  title: yup
    .string()
    .trim(ERRORS.LEADIND_TRAILING_SPACE)
    .strict(true)
    .required(REQUIRED_ERROR),
  description: yup
    .string()
    .trim(ERRORS.LEADIND_TRAILING_SPACE)
    .strict(true)
    .required(REQUIRED_ERROR),
  amount: yup
    .number()
    .min(0.01, ERRORS.MINIMUM_AMOUNT)
    .required(REQUIRED_ERROR),
  buyer_email: yup
    .string()
    .email(EMAIL_ERROR)
    .required(REQUIRED_ERROR)
    .notOneOf([yup.ref("seller_email")], ERRORS.EMAIL_MUST_DIFFERENT),
  seller_email: yup
    .string()
    .email(EMAIL_ERROR)
    .required(REQUIRED_ERROR)
    .notOneOf([yup.ref("buyer_email")], ERRORS.EMAIL_MUST_DIFFERENT),
  captcha: yup.boolean().isTrue(CAPTCHA_WARNING),
});

//empty values for the form
const initialFieldVal = {
  title: "",
  description: "",
  amount: "",
  buyer_email: "",
  seller_email: "",
  captcha: false,
};

const FirstStep = ({ setStep, addDealData }) => {
  const {
    form_header,
    input_container,
    error_message,
    form_control,
    custom_btn,
    floating_lable,
    floating_lable_small,
  } = styles;

  const [initialFormValues, setInitialFormValues] = useState(initialFieldVal);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const navigate = useNavigate();

  // retriving form data if exist in the localstorage
  useEffect(() => {
    const localStorageData = JSON.parse(
      localStorage.getItem(LS_KEYS.DEAL_DATA)
    );
    const formData = localStorageData ? localStorageData : initialFieldVal;
    //captcha always will be false
    setInitialFormValues({ ...formData, captcha: false });
  }, []);

  const submitData = async (values) => {
    const updatedValues = JSON.parse(JSON.stringify(values));
    updatedValues.amount = weiFunctions(
      updatedValues.amount.toString(),
      WEI.TO_WEI
    ).toString();
    setDisableSubmitBtn(true);
    //save initial values in form and state and then called the api
    localStorage.setItem(LS_KEYS.DEAL_DATA, JSON.stringify({ ...values }));
    addDealData({ ...values });
    //api call to create deal
    const res = await addDeal({ ...updatedValues });
    if (res.status) {
      addDealData({ ...res.data });
      toastMessage(res.message, "toast_step1_success", TOAST_RESPONSE.SUCCESS);
      //TODO: add deal id from the api
      setTimeout(() => {
        navigate(`/create-deal/${res.data[API_RESPONSE_FIELD.ID]}`);
        setStep(2);
      }, 1000);
    } else {
      setDisableSubmitBtn(false);
      toastMessage(res.message, "toast_step1_error", TOAST_RESPONSE.ERROR);
    }
  };

  return (
    <React.Fragment>
      <div className={form_header}>Well, Just Escro It!</div>
      <Formik
        onSubmit={submitData}
        initialValues={initialFormValues}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({ setFieldValue, errors, touched, values }) => (
          <Form>
            <div className={input_container}>
              <div className={styles.title_amount_container}>
                <div className="position-relative mb-4">
                  <Field
                    type="text"
                    name={FIELD_NAME.TITLE}
                    id={FIELD_NAME.TITLE}
                    className={`${form_control} rounded-0 ${
                      errors[FIELD_NAME.TITLE] &&
                      touched[FIELD_NAME.TITLE] &&
                      "border border-danger"
                    }`}
                  />
                  <label
                    htmlFor={FIELD_NAME.TITLE}
                    className={
                      values[FIELD_NAME.TITLE] || touched[FIELD_NAME.TITLE]
                        ? `${floating_lable_small} ${
                            errors[FIELD_NAME.TITLE] && "text-danger"
                          }`
                        : floating_lable
                    }
                  >
                    Title*
                  </label>
                  <ErrorMessage
                    name={FIELD_NAME.TITLE}
                    className={error_message}
                    component="div"
                  />
                </div>
                <div className={styles["pd-5"]}></div>
                <div className="position-relative mb-4">
                  <Field
                    type="number"
                    name={FIELD_NAME.AMOUNT}
                    id={FIELD_NAME.AMOUNT}
                    className={`${form_control} rounded-0 ${
                      errors[FIELD_NAME.AMOUNT] &&
                      touched[FIELD_NAME.AMOUNT] &&
                      "border border-danger"
                    }`}
                  />
                  <label
                    htmlFor={FIELD_NAME.AMOUNT}
                    className={
                      touched[FIELD_NAME.AMOUNT] || values[FIELD_NAME.AMOUNT]
                        ? `${floating_lable_small} ${
                            errors[FIELD_NAME.AMOUNT] && "text-danger"
                          }`
                        : floating_lable
                    }
                  >
                    Amount to escro*
                  </label>
                  <ErrorMessage
                    name={FIELD_NAME.AMOUNT}
                    className={error_message}
                    component="div"
                  />
                </div>
              </div>
              <div className="position-relative mb-4">
                <Field
                  type="text"
                  name={FIELD_NAME.DESCRIPTION}
                  id={FIELD_NAME.DESCRIPTION}
                  className={`${form_control} rounded-0 ${
                    errors[FIELD_NAME.DESCRIPTION] &&
                    touched[FIELD_NAME.DESCRIPTION] &&
                    "border border-danger"
                  }`}
                />
                <label
                  htmlFor={FIELD_NAME.DESCRIPTION}
                  className={
                    touched[FIELD_NAME.DESCRIPTION] ||
                    values[FIELD_NAME.DESCRIPTION]
                      ? `${floating_lable_small} ${
                          errors[FIELD_NAME.DESCRIPTION] && "text-danger"
                        }`
                      : floating_lable
                  }
                >
                  Description*
                </label>
                <ErrorMessage
                  name={FIELD_NAME.DESCRIPTION}
                  className={error_message}
                  component="div"
                />
              </div>
              <div className="position-relative mb-4">
                <Field
                  type="text"
                  name={FIELD_NAME.BUYER_EMAIL}
                  id={FIELD_NAME.BUYER_EMAIL}
                  className={`${form_control} rounded-0 ${
                    errors[FIELD_NAME.BUYER_EMAIL] &&
                    touched[FIELD_NAME.BUYER_EMAIL] &&
                    "border border-danger"
                  }`}
                />
                <label
                  htmlFor={FIELD_NAME.BUYER_EMAIL}
                  className={
                    touched[FIELD_NAME.BUYER_EMAIL] ||
                    values[FIELD_NAME.BUYER_EMAIL]
                      ? `${floating_lable_small} ${
                          errors[FIELD_NAME.BUYER_EMAIL] && "text-danger"
                        }`
                      : floating_lable
                  }
                >
                  Buyer's email*
                </label>
                <ErrorMessage
                  name={FIELD_NAME.BUYER_EMAIL}
                  className={error_message}
                  component="div"
                />
              </div>
              <div className="position-relative mb-4">
                <Field
                  type="text"
                  name={FIELD_NAME.SELLER_EMAIL}
                  id={FIELD_NAME.SELLER_EMAIL}
                  className={`${form_control} rounded-0 ${
                    errors[FIELD_NAME.SELLER_EMAIL] &&
                    touched[FIELD_NAME.SELLER_EMAIL] &&
                    "border border-danger"
                  }`}
                />
                <label
                  htmlFor={FIELD_NAME.SELLER_EMAIL}
                  className={
                    touched[FIELD_NAME.SELLER_EMAIL] ||
                    values[FIELD_NAME.SELLER_EMAIL]
                      ? `${floating_lable_small} ${
                          errors[FIELD_NAME.SELLER_EMAIL] && "text-danger"
                        }`
                      : floating_lable
                  }
                >
                  Seller's email*
                </label>
                <ErrorMessage
                  name={FIELD_NAME.SELLER_EMAIL}
                  className={error_message}
                  component="div"
                />
              </div>
              <div className="position-relative" style={{ minHeight: "80px" }}>
                <ReCaptcha
                  setFieldValue={setFieldValue}
                  name={FIELD_NAME.CAPTCHA}
                />
                <ErrorMessage
                  name={FIELD_NAME.CAPTCHA}
                  className={error_message}
                  component="div"
                />
              </div>
            </div>
            <div className="d-grid gap-2" style={{ padding: "1rem 24px" }}>
              <button
                type="submit"
                className={custom_btn}
                disabled={disableSubmitBtn ? true : false}
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default FirstStep;
