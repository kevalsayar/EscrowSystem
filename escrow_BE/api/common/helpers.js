const { sgMail } = require("./../config/mail.config");
const { FROM_EMAIL } = require("./../../env");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const { PASSCODE_LENGTH } = require("./../../env");
const { createHmac } = require("crypto");
const { TOKEN_EXPIRES_IN } = require("./../../env");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * @description create response payload
 * @param { 400 | 401 | 500 | 200 | 201} code - response's code
 * @param { boolean } status - define request's success or failure
 * @param { string } message - define message
 * @param { string } data - an option parameters to pass additional data
 * @returns 
 */
const createResponse = function (code, status, message, data = null, metaData = null) {
    const response = { code, status, message };
    if (data) response.data = data;
    if (metaData) response.metaData = metaData;
    return response;
}

/**
 * @description send email
 * @param {Object} data 
 * @param {string} templateName 
 */
const sendEmail = async function (data, templateName) {
    try {
        const { subject, ...rest } = data;
        const html = await getTemplate(templateName, rest);
        await sgMail.send({
            from: FROM_EMAIL,
            to: rest.sendToEmail,
            subject: subject,
            html
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description get template to send in email
 * @param { string } templateName 
 * @param { object } data 
 * @returns 
 */
const getTemplate = function (templateName, data) {
    return new Promise((resolve, rejects) => {
        fs.readFile(path.join(__dirname, "..", "templates", templateName, "index.html"), function (err, fileData) {
            if (!err) {
                const template = fileData.toString();
                const HandleBarsFunction = Handlebars.compile(template);
                const html = HandleBarsFunction(data);
                resolve(html);
            } else {
                rejects(err);
            }
        });
    });
}

const genratePasscode = function () {
    return Math.floor(Math.random() * (10 ** PASSCODE_LENGTH))
}

/**
 * @description genrate hash of provided string
 * @param {Object} data 
 * @returns 
 */
const genrateHash = function (data) {
    const hash = createHmac("sha256","123456"); // TODO : add salt
    return hash.update(data).digest("hex");
}

const signAndGet = function (data) {
    return new Promise((resolve, rejects) => {
        crypto.generateKeyPair("dsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
          }, (err, publicKey, privateKey) => {
            if(!err){
                const token = jwt.sign(data,privateKey, { algorithm : "ES256"});
                resolve({
                    publicKey,
                    token
                })
            }else{
                rejects(err);
            }
        });
    });
}

/**
 * @description verify jwt token
 * @param {String} publicKey 
 * @param {String} token 
 * @returns 
 */
const verifyToken = function (token, publicKey) {
    const payload = jwt.verify(token,publicKey);
    return payload;
}

module.exports = {
    createResponse,
    sendEmail,
    genratePasscode,
    genrateHash,
    signAndGet,
    verifyToken
}