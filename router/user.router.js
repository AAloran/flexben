const express = require('express');
const userRule = require('../business/user.rules');

let router = express.Router();

router.get('/login', async (req, res, next) => {

    try{
        res = await userRule.userLogin(req, res, next);
    } catch (e) {
        next(e)
    }

});

router.get('/logoff', async (req, res, next) => {

    try {
        res = await userRule.userLogout(req, res, next)
    } catch (e) {
        next (e)
    }
    
});


module.exports = router;