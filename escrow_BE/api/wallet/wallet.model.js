const { db } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const { INIT_DB } = require("../../env");

const WalletModel = db.define('user_wallets', {
    id : {
        type : DataTypes.UUID,
        primaryKey: true
    },
    user_id : {
        type : DataTypes.UUID,
        references : {
            model : 'users',
            key : 'id'
        } 
    },
    wallet_address : {
        type : DataTypes.STRING
    }
});

WalletModel.sync({ force: INIT_DB == "true" ? true : false });

module.exports = {
    WalletModel
}