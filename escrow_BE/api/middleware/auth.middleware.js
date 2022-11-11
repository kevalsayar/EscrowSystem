const { verifyToken } = require("./../common/helpers");
const { PersistentTokenModel } = require("./../user/user.queries");
/**
 * @description check bearer token exist or not
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
 const auth = async function (req, res, next) {
    if(req.headers.authorization) {
        const jwtToken = req.headers.authorization;
        if(jwtToken.includes("Bearer")) {
            
            // TODO get jwt token's public key
            const persistentToken = await PersistentTokenModel.getPublicKey(jwtToken.split(" ")[1]);
            
            if(persistentToken) {
                // TODO verify jwt token
                const payLoad = verifyToken(persistentToken.jwt, persistentToken.publicKey);
                // Move to next middleware
                next();
            } else {
                res.send("Error");
            }

        } else {
            // send authorization error
            res.send("Error");
        }
    } else {
        // send authorization error
        res.send("Error");
    }

}

module.exports = {
    auth
}