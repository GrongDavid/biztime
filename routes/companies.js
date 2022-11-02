const express = require('express');
const router = new express.Router();
const expressError = require('../expressError')
const db = require('../db');


router.get('/', async function getAllCompanies(req, res, next){
    try {
        let result = await db.query('SELECT * FROM companies')
        return res.send({companies: result.rows})
    } catch (e) {
        let error = new expressError(e, 404)
        return next(error)
    }
})

router.get('/:code', async function getCompany(req, res, next){
    try {
        let {code} = req.body
        let result = await db.query('SELECT * FROM companies WHERE code=$1', [code])
        return res.send({company: result.rows})
    } catch (e) {
        let error = new expressError(e, 404)
        return next(error)
    }
})

router.post('/', async function addCompany(req, res, next){
    try {
        let {code, name, description} = req.body
        let result = await db.query('INSERT INTO companies VALUES ($1, $2, $3) RETURNING *', [code, name, description])
        return res.send({company: result.rows[0]})
    } catch (e) {
        let error = new expressError(e, 400)
        return next(error)
    }
})

router.put('/:code', async function editCompany(req, res, next){
    try {
        let {code, name, description} = req.body 
        let result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *', [name, description, code])
        return res.send({company: result.rows[0]})
    } catch (e) {
        let error = new expressError(e, 404)
        return next(error)
    }
})

router.delete('/:code', async function deleteCompany(req, res, next){
    try {
        let {code} = req.body
        await db.query('DELETE FROM companies WHERE code=$1', [code])
        return res.send({status: 'deleted'})
    } catch (e) {
        let error = new expressError(e, 404)
        return next(error)
    }
})

module.exports = router

