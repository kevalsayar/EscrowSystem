const { Op } = require("sequelize");
const { v4 } = require("uuid");
const { Deal } = require("./deal.model");

const DealTable = (function () {
  const add = async (dealDetails) => {
    const queryResult = await Deal.create({ id: v4(), ...dealDetails });
    return queryResult.getDataValue("id");
  };

  const update = async (dealDetails) => {
    const queryResult = await Deal.update(
      {
        tx_hash: dealDetails.tx_hash,
        buyer_wallet_address: dealDetails.buyer_wallet_address,
      },
      { where: { id: dealDetails.id, tx_hash: { [Op.eq]: null } } }
    );
    return queryResult;
  };

  const getDealById = async (deal_id) => {
    const queryResult = await Deal.findAll({ where: { id: deal_id } });
    return queryResult;
  };

  const getDealsByWalletAddress = async (
    wallet_address,
    offset = 0,
    limit = 10
  ) => {
    const queryResult = await Deal.findAll({
      where: { buyer_wallet_address: wallet_address },
      $or: [
        {
          seller_wallet_address: wallet_address,
        },
      ],
      offset,
      limit,
    });
    return queryResult;
  };

  const getDealsByEmail = async (email, offset = 0, limit = 10) => {
    const queryResult = await Deal.findAll({
      where: {
        [Op.or]: [
          {
            buyer_email: email,
          },
          {
            seller_email: email,
          },
        ],
      },
      offset,
      limit,
      order: [["updatedAt", "DESC"]],
    });
    return queryResult;
  };

  const getTotalDeals = async (email) => {
    const queryResult = await Deal.findAll({
      where: {
        [Op.or]: [{ buyer_email: email }, { seller_email: email }],
      },
    });
    return queryResult.length;
  };

  /**
   * @description update deal status to funded
   * @param {Object} dealDetails
   * @returns
   */
  const updateDealToFunded = async (dealDetails) => {
    const queryResult = await Deal.update(
      {
        buyer_wallet_address: dealDetails.buyer_wallet_address,
        amount: dealDetails.amount,
        deal_status: dealDetails.deal_status,
      },
      { where: { id: dealDetails.id } }
    );
    return queryResult;
  };

  const updateDealToAccepted = async (dealDetails) => {
    const queryResult = await Deal.update(
      {
        seller_wallet_address: dealDetails.seller_wallet_address,
        deal_status: dealDetails.deal_status,
      },
      { where: { id: dealDetails.id } }
    );
    return queryResult;
  };

  const updateDealToClosed = async (dealDetails) => {
    const queryResult = await Deal.update(
      {
        deal_status: dealDetails.deal_status,
      },
      { where: { id: dealDetails.id } }
    );
    return queryResult;
  };

  const searchInfo = async (searchString, offset = 0, limit = 10) => {
    const queryResult = await Deal.findAndCountAll({
      raw: true,
      where: {
        [Op.or]: [
          {
            buyer_email: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            seller_email: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            title: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            tx_hash: {
              [Op.like]: `%${searchString}%`,
            },
          },
        ],
      },
      limit,
      offset,
      order: [["updatedAt", "DESC"]],
    });
    return queryResult;
  };

  return {
    add,
    update,
    getDealById,
    getDealsByWalletAddress,
    getDealsByEmail,
    getTotalDeals,
    updateDealToFunded,
    updateDealToAccepted,
    updateDealToClosed,
    searchInfo,
  };
})();

module.exports = {
  DealTable,
};
