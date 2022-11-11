const { db } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const { INIT_DB } = require("../../env");

const UserModel = db.define('user', {
    id : {
        type: DataTypes.UUID,
        primaryKey : true
    },
    full_name : {
        type :  DataTypes.STRING
    },
    email_address : {
        type : DataTypes.STRING
    },
    password : {
        type : DataTypes.STRING,
    },
    passcode : {
        type : DataTypes.STRING
    },
    is_verified : {
        type : DataTypes.BOOLEAN
    }
});

const PersistentTokensModel = db.define('peristent_tokens', {
    jwt : {
        type : DataTypes.STRING(500)
    },
    publicKey : {
        type : DataTypes.STRING(1500)
    }
});

UserModel.sync({ force: INIT_DB == "true" ? true : false });
PersistentTokensModel.sync({ force: INIT_DB == "true" ? true : false });
module.exports = { UserModel, PersistentTokensModel };
