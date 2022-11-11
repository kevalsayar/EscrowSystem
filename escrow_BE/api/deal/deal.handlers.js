const { addDealDetails, getDealDetails, updateDealDetails, searchInfoOfDeal} = require("./deal.services");
const DealHandlers = (function () {

    /**
     * @param { Request } req 
     * @param { Response } res 
     */
    const getHandler = async function (req, res) {
        const response = await getDealDetails(req.query);
        res.status(response.code).json(response);
    };

    /**     
     * @param { Request } req 
     * @param { Response } res 
     */
    const postHandler = async function (req, res) {
        const response = await addDealDetails(req.body);
        res.status(response.code).json(response);
    };

    /**
     * @param { Request } req 
     * @param { Response } res 
     */
    const patchHandler = async function (req, res) {
        const response = await updateDealDetails(req.body);
        res.status(response.code).json(response);
    };

    /**
     * @param { Request } req 
     * @param { Response } res 
     */
    const deleteHandler = async function (req, res) {

    };

    const searchHandler = async function (req, res) {
        const response = await searchInfoOfDeal({
            ...req.query, ...req.body
        });
        res.status(response.code).json(response);
    }

    return {
        getHandler,
        postHandler,
        patchHandler,
        deleteHandler,
        searchHandler
    }
})();

module.exports = {
    DealHandlers
}