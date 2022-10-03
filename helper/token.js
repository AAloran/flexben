const bcrypt = require('bcrypt');
const dbQuery = require('../db/user.db');
const jwt = require('jsonwebtoken');
const errorHelper = require('../error');
const { throwError } = require('../error');

const verifyUser = (exports.verifyUser = async function (username, password) {

    try {
        // Fetch user information from the data base
        let result = await dbQuery.getUserInfo(username);

        //checks if user exist and password matches
        if (result && result.length !== 0) {
            let hashedPassword = await bcrypt.hash(password, result.salt);

        // create token with the user information in the bearer header    
            if (hashedPassword === result.password) {
                const user = {
                    firstname   : result.firstname,
                    lastname    : result.lastname,
                    role        : result.role,
                    employee_id : result.employee_id,
                }
    
                let token = jwt.sign({user: user}, process.env.SECRET_KEY);
                return token;
            } else {                        
                throw Error ( "Username/Password does not match")
            }

        } else {
            throw new Error ("Username/Password does not match")
        }

    } catch (e) {
       throw Error (e);
    }  
});

const storeToken = (exports.storeToken = async function (token) {

    // checks if the token already exist in the black list if not the token gets stored in the Db
    try {
        const results = await dbQuery.getExpiredToken(token)
        
        if (!results || results.length === 0) {
            try {
                const results = await dbQuery.addExpiredToken(token)
            } catch (e) {
                throw Error (e)
            }            
        } else {
            throw Error ("Token already existing in the black list")
        }

    } catch (e) {
        throw Error (e)
    }
     
});

const verifyToken = (exports.verifyToken = async function (token) {
 
    try {
        let isExpired = await dbQuery.getExpiredToken(token)
        if (isExpired.length !== 0) { 
            throw Error ("Token Already Expired")
        } else {
            jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
                if (err) {
                    throw Error (err) 
                } else {
                    return authData
                }
            })
        }
    } catch (e) {
        throw Error (e)
    }
     
});

