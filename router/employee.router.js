const express = require('express');
const auth = require('../helper/auth');
const empRule = require('../business/employee.rules');

let router = express.Router();

router.post('/reimbursement', async (req, res, next) => {

     try {
        res = await empRule.postReimbursementDetail(req, res, next)
     } catch (e) {
        next(e)
     }  
}) 

router.delete('/reimbursement', async (req, res, next) => {

   try {
      res = await empRule.deleteReimbursementDetail(req, res, next)
   } catch (e) {
      next(e)
   }

}) 

router.patch('/submit', async (req, res, next) => {

   try {
      res = await empRule.submitReimbursementDetail(req, res, next)
   } catch (e) {
      next(e)
   }

}) 

router.get('/flexpoints', async (req, res, next) => {

   try {
      res = await empRule.computeFlexPoints(req, res, next)
   } catch (e) {
      next(e)
   }

}) 

router.get('/print', async (req, res, next) => {

   try {
      res = await empRule.forReimbursementPrint(req, res, next)
   } catch (e) {
      next(e)
   }

}) 


module.exports = router;