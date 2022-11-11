const { DealTable } = require("./deal.queries");
const {
  createResponse,
  genratePasscode,
  genrateHash,
} = require("./../common/helpers");
const { REQUEST_CODE, Messages, User } = require("../common/members");
const { em } = require("./../pubsub/index");
const { register } = require("../user/user.services");
const { UserModel } = require("./../user/user.queries");
require("./deal.listeners");

/**
 * @description user's deal details
 * @param {Object} dealDetails
 * @returns
 */
const addDealDetails = async function (dealDetails) {
  try {
    const id = await DealTable.add(dealDetails);
    if (!(await UserModel.checkExistance(dealDetails.buyer_email))) {
      await register({ emailAddress: dealDetails.buyer_email });
    } else {
      // TODO check if user is verified or not
      if (!(await UserModel.isUserVerified(dealDetails.buyer_email))) {
        const user = new User({
          email_address: dealDetails.buyer_email,
        });

        // TODO send verification passcode
        const isUpdated = UserModel.updatePasscode(user.passcodeHash);

        if (
          isUpdated // TODO emit email;
        );
        else; //TODO internal server error
      }
    }
    return createResponse(
      REQUEST_CODE.SUCCESS,
      true,
      Messages.deal.success["deal-added"],
      { id }
    );
  } catch (error) {
    return createResponse(
      REQUEST_CODE.INTERNAL_SERVER_ERROR,
      false,
      Messages.deal.error.internal
    );
  }
};

/**
 * @description get data of deals
 * @param {string} dealId
 */
const getDealDetails = async function (data) {
  try {
    let queryResult;
    let total_records;
    if (data.deal_id) {
      queryResult = await DealTable.getDealById(data.deal_id);
    } else if (data.wallet_address) {
      total_records = await DealTable.getTotalDeals(data.wallet_address);
      queryResult = await DealTable.getDealsByWalletAddress(
        data.wallet_address,
        parseInt(data.record_limit * (data.page_num - 1)),
        parseInt(data.record_limit)
      );
    } else if (data.email) {
      total_records = await DealTable.getTotalDeals(data.email);
      queryResult = await DealTable.getDealsByEmail(
        data.email,
        parseInt(data.record_limit * (data.page_num - 1)),
        parseInt(data.record_limit)
      );
    }
    return createResponse(
      REQUEST_CODE.SUCCESS,
      true,
      Messages.deal.success["deal-info"],
      { total_records, deal_list: queryResult }
    );
  } catch (error) {
    return createResponse(
      REQUEST_CODE.INTERNAL_SERVER_ERROR,
      false,
      Messages.deal.error.internal
    );
  }
};

/**
 * @description update deal details
 * @param {object} dealInfo
 */
const updateDealDetails = async function (dealInfo) {
  try {
    await DealTable.update(dealInfo);
    const dealDetails = await DealTable.getDealById(dealInfo.id);
    em.emit("deal-funded", {
      passcode: dealInfo.passcode,
      ...dealDetails[0].dataValues,
    });
    return createResponse(REQUEST_CODE.SUCCESS, true, "Deal updated", {
      ...dealDetails[0].dataValues,
      share_link: `http://localhost:3000/dashboard?id=${dealInfo.id}&email=${dealDetails[0].dataValues.seller_email}`,
    });
  } catch (error) {
    return createResponse(
      REQUEST_CODE.INTERNAL_SERVER_ERROR,
      false,
      Messages.deal.error.internal
    );
  }
};

/**
 * @param {Object} data
 * @returns
 */
const searchInfoOfDeal = async function (data) {
  try {
    const searchResult = await DealTable.searchInfo(
      data.searchValue,
      parseInt(data.record_limit * (data.page_num - 1)),
      parseInt(data.record_limit)
    );
    if (searchResult.count == 0)
      return createResponse(REQUEST_CODE.BAD_REQUEST, true, "Record not found");
    return createResponse(REQUEST_CODE.SUCCESS, true, "Search result", {
      total_pages: searchResult.count,
      search_list: searchResult.rows,
    });
  } catch (error) {
    return createResponse(
      REQUEST_CODE.INTERNAL_SERVER_ERROR,
      false,
      Messages.deal.error.internal
    );
  }
};

module.exports = {
  addDealDetails,
  getDealDetails,
  updateDealDetails,
  searchInfoOfDeal,
};
