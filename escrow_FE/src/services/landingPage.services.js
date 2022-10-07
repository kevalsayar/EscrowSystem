import axiosIntance from "../configs/axios.config";

export const addDeal = async (values) => {
  const { amount, buyer_email, description, seller_email, title } = {
    ...values,
  };
  try {
    const res = await axiosIntance.post("/deal", {
      amount,
      buyer_email,
      description,
      seller_email,
      title,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

export const updateDealService = async (values) => {
  try {
    const res = await axiosIntance.patch("/deal", { ...values });
    return res.data;
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

export const getDealData = async (deal_id) => {
  try {
    const res = await axiosIntance.get("/deal", { params: { deal_id } });
    return res.data;
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};
