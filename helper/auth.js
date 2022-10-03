const dbQuery = require('../db/user.db');
const jwt = require('jsonwebtoken');


const auth = {  
    checkToken : async (req, res, next) => {

        const resToken = req.headers['authorization'];     
        if (typeof resToken !== 'undefined') {

            const bearer = resToken.split(' ');
            const bearerToken = bearer[1];  

            try {
                let isExpired = await dbQuery.getExpiredToken(bearerToken)
        
                if (isExpired.length !== 0) { 
                    throw Error ("Token Already Expired")
                } else {
                    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
                        if (err) {
                            throw Error (err) 
                        } else {
                            req.authData = authData
                        }
                    })
                }
            } catch (e) {
                throw Error (e)
            }
 
             
 
        } else {
             throw Error ("No token found or  invalid token") 
        }
     },

};

const verifyToken = async function (token) {
 
    
     
};

module.exports = auth;