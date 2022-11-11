const { UserModel, PersistentTokenModel} = require("./user.queries");
const { User, Messages } = require("./../common/members");
const { createResponse, genrateHash, genratePasscode, signAndGet} = require("./../common/helpers");
const { em } = require("./../pubsub/index");

const register = async function (userInfo) {
    const user = new User(userInfo);
    const isExist = await UserModel.checkExistance(user.emailAddress);
    if(!isExist) {
        await UserModel.create(user);
        // TODO sent an email to verify user
        em.emit("register");
        return createResponse(200, true, Messages.user.success["user-created"]);
    } else {
        return createResponse(400, false, Messages.user.error["user-already-exist"]);
    }
};

/**
 * @description login process
 * @param {User} user 
 * @returns 
 */
const validate = async function (user) {
    const verified = await UserModel.userVerificationStatus(user.emailAddress);
    if(verified){
        user.password = genrateHash(user.password);
        const queryResults = await UserModel.checkCredentials(user);
        if(queryResults) {
            // TODO : genrate jwt authentication
            const {token, publicKey} = await signAndGet({
                id : queryResults.id
            });

            const result = await PersistentTokenModel.addNewUserToken(token, publicKey);
            if(result) {
                return createResponse(200, true, "User login success", {
                    token,
                    userInfo : queryResults
                }); 
            }else {
                return createResponse(500, false, "Internal server error");
            }
        } else {
            return createResponse(400, false, "Username or password does not match!");
        }
    } else {
        return createResponse(400, false, "User is not verified!");
    }
}

/**
 * @description verification process
 * @param {Object} verificationInfo 
 * @returns 
 */
const verify = async function (verificationInfo) {
    verificationInfo.passcode = genrateHash(verificationInfo.passcode);
    const isVerified = await UserModel.verifyAndUpdate(verificationInfo);
    if(isVerified) {
        const isPasswordSet = await UserModel.isPasswordSet(verificationInfo.emailAddress);
        if(!isPasswordSet) {
            // Auto genrate password and sent via mail to user
            const newPassword = genrateHash(genratePasscode().toString());
            const isSet = await UserModel.changePassword(newPassword, verificationInfo.emailAddress);
            if(isSet) {
                // sent mail of set password
                return createResponse(200, true, Messages.user.success.verified);
            } else {
                // return error response
                return createResponse(200, true, Messages.user.success.verified);
            }
        }
        return createResponse(200, true, Messages.user.success.verified);
    } else {
        return createResponse(400, false, Messages.user.error.verification);
    }
}

/**
 * @description remove record from persistent table from database
 * @param {String} jwt 
 */
const logout = async function (jwt) {
    const isRemoved = await PersistentTokenModel.removeToken(jwt);
    if(isRemoved) return createResponse(200, true, Messages.user.success.logout)
    else return createResponse(400, false, "User already logged out!");
}

module.exports = {
    register,
    verify,
    validate,
    logout
}