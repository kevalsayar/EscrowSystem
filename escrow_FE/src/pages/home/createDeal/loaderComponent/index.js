import React from "react";
import styles from "./loaderComponent.module.css";
import Skeleton from "react-loading-skeleton";

const LoaderComponent = () => {
  const { loader_container } = styles;
  return (
    <div className={loader_container}>
      <Skeleton
        containerClassName='w-100 d-flex justify-content-center align-item-center p-1 mb-3'
        height={50}
        width='60%'
      />
      <div className='d-flex justify-content-between align-item-center mb-4'>
        <div className='w-50'>
          <Skeleton containerClassName='w-100' height={30} width='100%' />
        </div>
        <div className='w-50'>
          <Skeleton containerClassName='w-100' height={30} width='100%' />
        </div>
      </div>
      <div className='mb-4'>
        <Skeleton containerClassName='w-100' height={30} width='100%' />
      </div>
      <div className='mb-4'>
        <Skeleton containerClassName='w-100' height={30} width='100%' />
      </div>
      <div className='mb-4'>
        <Skeleton containerClassName='w-100' height={30} width='100%' />
      </div>
      <div className='mb-4'>
        <Skeleton containerClassName='w-100' height={60} width='100%' />
      </div>
      <div className='mb-4'>
        <Skeleton containerClassName='w-100' height={40} width='100%' />
      </div>
      <div className='d-flex justify-content-around align-item-center mb-4'>
        <div style={{ width: "40px" }}>
          <Skeleton containerClassName='w-100' circle height={40} width='30' />
        </div>
        <div style={{ width: "40px" }}>
          <Skeleton containerClassName='w-100' circle height={40} width='40' />
        </div>
        <div style={{ width: "40px" }}>
          <Skeleton containerClassName='w-100' circle height={40} width='40' />
        </div>
      </div>
    </div>
  );
};

export default LoaderComponent;
