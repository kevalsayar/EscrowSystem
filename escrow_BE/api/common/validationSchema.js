// joi validation schema
const joi = require("joi");

const title = joi.string().label("Title");
const description = joi.string().label("Description");
const emailAddress = joi.string().email().label("Email Address");
const amount = joi.string().label("Amount");
const txHash = joi.string().label("Transaction Hash");
const wallet_address = joi.string().label("Wallet Address");
const deal_id = joi.string().label("Deal Id");
const number = joi.number().label("Number");

// validation schema to check deal details
const addDealReqSchema = joi.object({
    title: title.required(),
    description: description.required(),
    buyer_email: emailAddress.required(),
    seller_email: emailAddress.required(),
    amount: amount.required()
});

const updateDealReqSchema = joi.object({
    id: deal_id.required(),
    buyer_wallet_address: wallet_address.required(),
    tx_hash: txHash.required()
});

const getDealQuerySchema = joi.object({
    deal_id: deal_id,
    email: emailAddress,
    page_num: number.optional(),
    record_limit: number.optional()
}).when(".deal_id", {
    is: joi.exist(),
    then: joi.object({ email: emailAddress.optional() }),
    otherwise: joi.object({ email: emailAddress.required() })
});

const paginationParams = joi.object({
    page_num: number.optional(),
    record_limit: number.optional()
});

const searchReqSchema = joi.object({
    searchValue: joi.string().required().label("Search value")
});

module.exports = {
    addDealReqSchema,
    updateDealReqSchema,
    getDealQuerySchema,
    paginationParams,
    searchReqSchema
}