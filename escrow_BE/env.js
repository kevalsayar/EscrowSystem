const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DIALECT: process.env.DIALECT,
    FROM_EMAIL: process.env.FROM_EMAIL,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    JSON_RPC_URL: process.env.JSON_RPC_URL,
    SG_API_KEY : process.env.SG_API_KEY,
    INIT_DB : process.env.INIT_DB,
    PASSCODE_LENGTH : process.env.PASSCODE_LENGTH,
    TOKEN_EXPIRES_IN : process.env.TOKEN_EXPIRES_IN
}