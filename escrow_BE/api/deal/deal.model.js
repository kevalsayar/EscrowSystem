const { db } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const {INIT_DB} = require("../../env");
const Deal = db.define('deal', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.BIGINT
    },
    buyer_email: {
        type: DataTypes.STRING
    },
    seller_email: {
        type: DataTypes.STRING
    },
    tx_hash: {
        type: DataTypes.STRING
    },
    seller_wallet_address: {
        type: DataTypes.STRING
    },
    buyer_wallet_address: {
        type: DataTypes.STRING
    },
    deal_status: {
        type: DataTypes.STRING
    },
    contract_address : {
        type: DataTypes.STRING 
    },
    share_link: {
        type: DataTypes.STRING
    }
});
Deal.sync({ force: INIT_DB == "true" ? true : false });
module.exports = { Deal };