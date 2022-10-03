const token = require('../helper/token');

const userRule = {
    userLogin : async (req, res, next) => {

        const base64Encoding = req.headers.authorization.split(" ")[1];
        const credentials = Buffer.from(base64Encoding, "base64").toString().split(":");
        const username = credentials[0];
        const password = credentials[1];

        try {
            let resToken = await token.verifyUser(username, password)
            let data = {resToken};

            res.status(200).json({
                "status"      : 200,
                "statusText"  : "OK",
                "message"     : "Login Successful",
                "data"        : data      
            }) 

        } catch (e) {
           throw new Error (e)
        }
    },
    userLogout : async (req, res, next) => {
        const resToken = req.headers['authorization'];

        try {
            await token.storeToken(resToken)

            res.status(200).json({
                "status"      : 200,
                "statusText"  : "OK",
                "message"     : "Logout Successful"
            }) 

        } catch (e) {
            throw  Error (e)
        }
    },
};

module.exports = userRule;