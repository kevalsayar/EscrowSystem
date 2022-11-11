const { genrateHash, genratePasscode } = require("./helpers");

const Messages = {
    "request" : {
        "validation" : {
            "body-not-exist" : "Body not exist!",
            "query-params-not-exist": "Query params not exist"
        }
    },
    "deal" : {
        "success" : {
            "deal-added" : "Deal added!",
            "deal-info" : "Details of deals"
        },
        "error" : {
            "internal" : "Internal server error"
        }
    },
    "user" : {
        "success" : {
            "user-created" :  "User created",
            "verified" : "User verified",
            "logout" : "User logged out"
        }, 
        "error" : {
            "user-already-exist" : "User already exist!",
            "verification" : "User is already verified or not exist!"
        }
    }
}

const REQUEST_CODE = {
    BAD_REQUEST: "400",
    SUCCESS: "200",
    INTERNAL_SERVER_ERROR: "500",
    ENTRY_ADDED: "201",
    UNAUTHORIZED_USER: "401"
}

const ENDPOINTS = Object.freeze({
    DEAL : '/deal',
    USER : '/user',
    LOGIN : '/login',
    VERIFY : '/verify',
    LOGOUT : '/logout'
});

class User {
    constructor (newUser) {
        this.fullName = newUser.fullName ? newUser.fullName : null;
        this.emailAddress = newUser.emailAddress;
        this.password = newUser.password ? genrateHash(newUser.password) : null;
        this.passcode = genratePasscode().toString();
        this.passcodeHash = genrateHash(this.passcode);
    }
    get () {
        return {
            fullName : this.fullName,
            emailAddress : this.emailAddress,
            password : this.password
        }
    }

    set setPassword (newPassword) {
        this.password = genrateHash(newPassword);
    }
}

module.exports = {
    Messages,
    REQUEST_CODE,
    ENDPOINTS,
    User
}