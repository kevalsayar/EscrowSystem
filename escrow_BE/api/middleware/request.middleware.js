const { createResponse } = require("../common/helpers");
const { Messages } = require("../common/members");
const { REQUEST_CODE } = require("../common/members");
const url = require("node:url");

/**
 * @description validate request body
 * @param {Joi.Schema} reqSchema
 * @returns
 */
const validateReqBody = function (reqSchema) {
  return (req, res, next) => {
    let response;
    if (req.body) {
      const { error } = reqSchema.validate(req.body);
      if (error) {
        response = createResponse(
          REQUEST_CODE.BAD_REQUEST,
          false,
          error.message
        );
        res.status(response.code).json(response);
      } else next();
    } else {
      response = createResponse(
        REQUEST_CODE.BAD_REQUEST,
        false,
        Messages.request.validation["body-not-exist"]
      );
      res.status(response.code).json(response);
    }
  };
};

const validateQueryParam = function (queryParamSchema) {
  return (req, res, next) => {
    const urlInfo = url.parse(req.url);
    let response;
    if (req.query.deal_id || req.query.email || req.query.wallet_address) {
      const { error } = queryParamSchema.validate(req.query);
      if (error) {
        response = createResponse(
          REQUEST_CODE.BAD_REQUEST,
          false,
          error.message
        );
        res.status(response.code).json(response);
      } else next();
    } else if (
      req.query.page_num &&
      req.query.record_limit &&
      urlInfo.pathname == "/search"
    ) {
      const { error } = queryParamSchema.validate(req.query);
      if (error) {
        response = createResponse(
          REQUEST_CODE.BAD_REQUEST,
          false,
          error.message
        );
        res.status(response.code).json(response);
      } else next();
    } else {
      response = createResponse(
        REQUEST_CODE.BAD_REQUEST,
        false,
        Messages.request.validation["query-params-not-exist"]
      );
      res.status(response.code).json(response);
    }
  };
};

module.exports = {
  validateReqBody,
  validateQueryParam,
};
