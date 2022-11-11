const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors({origin : '*'}));
app.use(bodyParser.json());

const indexRouter = require("./api/index");
app.use('/',indexRouter);

app.use('/api-doc', express.static(__dirname+'/doc'));

const { PORT } = require("./env")
app.listen(PORT, function () {
    console.log("Started server...");
});