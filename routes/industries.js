const express = require('express');
const router = new express.Router();
const expressError = require('../expressError')
const db = require('../db');

router.post('/', async function addIndustry(req, res, next){
    try {
        let {code, industry} = req.body
        const result = await db.query(`
        INSERT INTO industries 
        VALUES ($1, $2) RETURNING *`, [code, industry])
        return res.send(result.rows)
    } catch (e) {
        let error = new expressError(e, 400)
        return next(error)
    }
})

router.get('/', async function getIndustries(req, res, next){
    try {
        const result = await db.query(`
        SELECT i.code, c.code 
        FROM industries as i 
        LEFT JOIN companies_industries AS ci 
        ON i.code = ci.industry_code 
        LEFT JOIN companies as c 
        ON ci.company_code = c.code RETURNING *`)

        res.send(result.rows)
    } catch (e) {
        let error = new expressError(e, 404)
        return next(error)
    }
})