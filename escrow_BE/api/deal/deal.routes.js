const router = require("express").Router();
const { DealHandlers } = require("./deal.handlers");
const {
  validateReqBody,
  validateQueryParam,
} = require("./../middleware/request.middleware");
const { auth } = require("../middleware/auth.middleware");
const {
  addDealReqSchema,
  updateDealReqSchema,
  getDealQuerySchema,
  paginationParams,
  searchReqSchema,
} = require("../common/validationSchema");

/**
 * @apiGroup Deal
 * @apiName Get deal
 * @api {GET} /deal get deal's data
 * @apiQuery {string} email buyer's email address
 * @apiQuery {string} page_num page number
 * @apiQuery {string} record_limit number of records on each page
 * @apiDescription get all or specific deal data
 * @apiSampleRequest /deal
 * @apiVersion 0.1.0
 * @apiSuccessExample {JSON} Success:
 * {
 *  "code": number,
 *  "status": true,
 *  "message": string,
 *  "data" : {
 *     "total_pages": 5,
 *     "deal_list": [{
 *        "id": "e1437ffb-73a5-49ba-9ece-fc9610c62b7f",
 *        "title": "abc",
 *        "description": "abcd",
 *        "amount": 19,
 *        "buyer_email": "abc@abc.com",
 *        "seller_email": "abcd@abcd.com",
 *        "tx_hash": null,
 *        "seller_wallet_address": null,
 *        "buyer_wallet_address": null,
 *        "createdAt": "2022-08-16T10:14:06.000Z",
 *        "updatedAt": "2022-08-16T10:14:06.000Z"
 *      }]
 *   }
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data" : { ... }
 */
router.get(
  "/",
  [auth, validateQueryParam(getDealQuerySchema)],
  DealHandlers.getHandler
);

/**
 * @apiGroup Deal
 * @apiName Add deal
 * @api {POST} /deal add deal
 * @apiDescription add specific deal
 * @apiSampleRequest /deal
 * @apiVersion 0.1.0
 * @apiBody {string} title deal's title
 * @apiBody {string} description deal's description
 * @apiBody {string} buyer_email buyer's email address
 * @apiBody {string} seller_email seller's email address
 * @apiBody {number} amount deal's escrow amount
 * @apiSuccessExample {JSON} Success:
 * {
 *  "code": number,
 *  "status": true,
 *  "message": string,
 *  "data": {
 *      "id": "f18bf714-1c9c-416d-a1ae-860f72fec8b3"
 *  }
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.post(
  "/",
  [validateReqBody(addDealReqSchema)], // middlewares
  DealHandlers.postHandler
);

/**
 * @apiGroup Deal
 * @apiName Search
 * @api {POST} /deal/search search
 * @apiDescription search deals on the basis of title, description, tx hash, buyer seller email address
 * @apiQuery {string} page_num page number
 * @apiQuery {string} record_limit number of records on each page
 * @apiSampleRequest /deal/search
 * @apiVersion 0.1.0
 * @apiBody {string} searchValue search value
 * @apiSuccessExample {JSON} Success:
 * {
 *  "code": number,
 *  "status": true,
 *  "message": string,
 *  "data": {
 *      "total_pages": 66,
 *		"search_list": [
 *			{
 *				"id": "8a2f36bc-5de3-4f87-9e64-6bca95dc7b72",
 *				"title": "news",
 *				"description": "news",
 *				"amount": 10000000000000000,
 *				"buyer_email": "senderdashboardtests@gmail.com",
 *				"seller_email": "receiverdashboardtests@gmail.com",
 *				"tx_hash": "0x7d295ef7560a71c265850b65222850d7fd9d5ca8a9d362333f3b5c0a15dfe715",
 *				"seller_wallet_address": null,
 *				"buyer_wallet_address": "0x3721430091076C0be6e96CE17E7DC22A2e173b57",
 *				"deal_status": "1",
 *				"share_link": null,
 *				"createdAt": "2022-09-02T09:55:43.000Z",
 *				"updatedAt": "2022-09-02T09:56:02.000Z"
 *			},
 *        ]
 *      }
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.post(
  "/search",
  [
    auth,
    validateReqBody(searchReqSchema),
    validateQueryParam(paginationParams),
  ],
  DealHandlers.searchHandler
);

/**
 * @apiGroup Deal
 * @apiName Update deal
 * @api {PATCH} /deal update deal
 * @apiDescription update specific deal
 * @apiSampleRequest /deal
 * @apiVersion 0.1.0
 * @apiBody {string} id deal's id
 * @apiBody {string} buyer_wallet_address buyer's wallet address
 * @apiBody {string} tx_hash transaction hash
 * @apiBody {string} passcode deal's passcode
 * @apiSuccessExample {JSON} Success:
 * {
 *  "code": number,
 *  "status": true,
 *  "message": string,
 *  "data": { ... }
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.patch(
  "/",
  [auth, validateReqBody(updateDealReqSchema)],
  DealHandlers.patchHandler
);

module.exports = router;
