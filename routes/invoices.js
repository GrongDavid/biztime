const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");
let router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
      const result = await db.query(
            'SELECT id, comp_code FROM invoices' 
      );
      return res.json({invoices: result.rows})
    } catch (e) {
      let error = new ExpressError(e, 404)
      return next(error)
    }
});

router.get("/:id", async function (req, res, next) {
    try {
        let {id} = req.params
        const result = await db.query(
            `SELECT invoices.id, 
                    invoices.comp_code, 
                    invoices.amt, 
                    invoices.paid, 
                    invoices.add_date, 
                    invoices.paid_date, 
                    companies.name, 
                    companies.description 
                FROM invoices INNER JOIN companies ON (invoices.comp_code = companies.code)  
                WHERE id = $1`, [id])

        const data = result.rows[0]
        const invoice = {
        id: data.id,
        company: {
            code: data.comp_code,
            name: data.name,
            description: data.description,
        },
        amt: data.amt,
        paid: data.paid,
        add_date: data.add_date,
        paid_date: data.paid_date,
        }

        return res.json({invoice: invoice})
    } catch (e) {
        let error = new ExpressError(e, 404)
        return next(error)
    }
});

router.post("/", async function (req, res, next) {
    try {
      let {comp_code, amt} = req.body
  
      const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) 
             RETURNING *`, [comp_code, amt])
  
      return res.json({invoice: result.rows[0]})
    }
  
    catch (e) {
      let error = new ExpressError(e, 400)
      return next(error)
    }
  });

router.put("/:id", async function (req, res, next) {
    try {
        let {amt, paid} = req.body
        let {id} = req.params
        let datePaid = null

        const currResult = await db.query(
            'SELECT paid FROM invoices WHERE id = $1', [id])

        const currdatePaid = currResult.rows[0].paid_date

        if (!currdatePaid && paid) {
        datePaid = new Date()
        } 
        else if (!paid) {
        datePaid = null
        } 
        else {
        datePaid = currdatePaid
        }

        const result = await db.query(
            `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4
                RETURNING *`, [amt, paid, datePaid, id])

        return res.json({invoice: result.rows[0]})
    }

    catch (e) {
        let error = new ExpressError(e, 404)
        return next(error)
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
      let {id} = req.params
  
      await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING *`, [id])

      return res.json({status: "deleted"})
    }
  
    catch (e) {
      let error = new ExpressError(e, 404)
      return next(error)
    }
  });
  
  
module.exports = router;
  