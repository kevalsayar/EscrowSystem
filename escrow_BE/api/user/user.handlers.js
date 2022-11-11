const { register, verify, validate, logout} = require("./user.services")

const UserHandlers = function () {
    const registerUser = async function (req, res) {
        const response = await register(req.body);
        res.status(response.code).json(response);
    }

    const loginUser = async function (req, res) {
        const response = await validate(req.body);
        res.status(response.code).json(response);
    }

    const verifyUser = async function (req, res) {
        const response = await verify(req.body);
        res.status(response.code).json(response);
    }

    const logoutUser = async function (req, res) {
        const response = await logout(req.headers.authorization.split(" ")[1]);
        res.status(response.code).json(response);
    }

    return {
        registerUser,
        loginUser,
        verifyUser,
        logoutUser
    }
}

module.exports = UserHandlers();