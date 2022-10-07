import React from "react";
import CreateDeal from "./createDeal";
import LandingText from "./landingText";
import styles from "./home.module.css";
import appstyles from '../../styles/app.module.css';
const Home = () => {
  return (
    <div className={`${styles.main_container} ${appstyles.body_container}`}>
      <div className={styles.step_container}>
        <CreateDeal />
        <LandingText />
      </div>
    </div>
  );
};

export default Home;
