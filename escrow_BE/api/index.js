const router = require("express").Router();
const dealRoutes = require("./deal/deal.routes");
const userRoutes = require("./user/user.routes");
const {
    ENDPOINTS
} = require("./common/members");

router.get('/', function (request, response) {
    response.json({
        project_name: "Escrow v2.0.0",
        description: "Blockchain based escrow system"
    });
});

/**
 * @description common error handler
 */
router.use((error, req, res, next) => {
    res.send("Error accured!");
});

router.use(ENDPOINTS.DEAL, dealRoutes);

router.use(ENDPOINTS.USER, userRoutes);

module.exports = router;