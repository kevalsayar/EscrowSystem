import React, { useEffect } from "react";

const ReCaptcha = ({ setFieldValue, name }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.google.com/recaptcha/api.js";
    //For head
    document.head.appendChild(script);
    window.dataCallback = (e) => e && setFieldValue(name, true);
    window.dataExpireCallback = (e) => e && setFieldValue(name, false);
    return () => {
      document.head.removeChild(script);
      window.dataCallback = null;
      window.dataExpireCallback = null;
    };
  }, []);

  return (
    <div
      className="g-recaptcha"
      data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      data-callback="dataCallback"
      // TODO: expiring callback is not working. have to debug further
      data-expired-callback="dataExpireCallback"
      //   data-error-callback="logInConsole"
    ></div>
  );
};

export default ReCaptcha;
