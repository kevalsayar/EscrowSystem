const { Op } = require("sequelize");
const uuid = require("uuid");
const { UserModel, PersistentTokensModel } = require("./user.model");
require("../wallet/wallet.queries");

const UserQueries = function () {
    /**
     * @description create user
     * @param {User} user 
     * @returns 
     */
    const create = async function (user) {
        const results = await UserModel.create({
            id : uuid.v1(),
            full_name : user?.fullName,
            email_address : user?.emailAddress,
            password : user?.password,
            passcode : user?.passcodeHash
        });
        return results;
    }

    const checkExistance = async function (emailAddress) {
        const results = await UserModel.findOne({
            where : {
                email_address : emailAddress
            }
        });
        return results ? true : false;
    }

    const verifyAndUpdate = async function (user) {
        const results = await UserModel.update({
            passcode : null
        },{
            where : {
                email_address : user.emailAddress,
                passcode : { [Op.eq]: user.passcode }
            }
        });
        return results[0] == 0 ? false : true;
    }

    const checkCredentials = async function (user) {
        const results = await UserModel.findOne({
            where :{
                email_address : user.emailAddress,
                password : user.password,
                passcode : {
                    [Op.eq] : null
                }
            },
            attributes : ['id', ['full_name', 'fullName'], ['email_address', 'emailAddress'],'createdAt']
        });
        return results? results.dataValues : null;
    }

    const userVerificationStatus = async function (emailAddress) {
        const results = await UserModel.findOne({
            where : {
                email_address : emailAddress
            },
            attributes : ['passcode']
        });
        return results.getDataValue('passcode') ? false : true;
    }

    const isPasswordSet = async function(emailAddress) {
        const results = await UserModel.findOne({
            where : {
                email_address : emailAddress
            },
            attributes : ['password']
        });

        return results.getDataValue('password') ? true : false;
    }

    const changePassword = async function (newPassword, emailAddress) {
        const results = await UserModel.update({
            password : newPassword
        }, {
            where : {
                email_address: emailAddress
            }
        });
        return results ? true : false;
    }

    const updatePasscode = async function (newPasscode, emailAddress) {
        
        const results = await UserModel.update({
            passcode : newPasscode
        }, {
            where : {
                email_address : emailAddress,
                passcode : {
                    [Op.eq] : null
                }
            }
        });

        return results ? true : false;
    }

    const isUserVerified = async function (emailAddress) {
        const results = await UserModel.findOne({
            where : {
                email_address : emailAddress,
                passcode : {
                    [Op.ne] : null
                }
            }, 
            attributes : ['passcode']
        });
        return results ? true : false;
    }

    return {
        create,
        checkExistance,
        verifyAndUpdate,
        checkCredentials,
        userVerificationStatus,
        isPasswordSet,
        changePassword,
        isUserVerified,
        updatePasscode
    }
} 

const PersistentTokensQueries = function () {
    /**
     * @param {String} token 
     * @param {String} publicKey 
     * @returns 
     */
    const addNewUserToken = async function (token, publicKey) {
        const results = await PersistentTokensModel.create({
            jwt : token,
            publicKey : publicKey
        });
        return results;
    }

    /**
     * @param {String} jwt 
     * @returns 
     */
    const getPublicKey = async function (jwt) {
        const results = await PersistentTokensModel.findOne({
            where : {
                jwt
            },
            attributes : ['jwt', 'publicKey']
        });
        return results ? results.dataValues : false;
    }

    /**
     * @description remove jwt token record from database
     * @param {String} jwt 
     * @returns 
     */
    const removeToken = async function (jwt) {
        const results = await PersistentTokensModel.destroy({
            where : {
                jwt
            }
        });

        return results ? true : false;
    }

    return {
        addNewUserToken,
        getPublicKey,
        removeToken
    }

} 

module.exports = {
    UserModel: UserQueries(),
    PersistentTokenModel: PersistentTokensQueries()
};