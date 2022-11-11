// Database configurations
const { Sequelize } = require("sequelize");
const {
  DB_HOST,
  DB_USERNAME,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DIALECT,
} = require("../../env");
const db = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  dialect: DIALECT,
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
  dialectOptions: {
    socketPath: "/var/run/mysqld/mysqld.sock",
  },
});

db.authenticate()
  .then((response) => console.log(response))
  .catch((error) => console.log(error));

module.exports = {
  db,
};
