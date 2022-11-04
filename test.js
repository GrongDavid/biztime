/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const request = require('request')
const app = require('./app')
const db = require('./db')

beforeEach(async () => {
    await db.query(`INSERT INTO companies VALUES 
                    ('apple', 'Apple Computer', 'Maker of OSX.'), 
                    ('ibm', 'IBM', 'Big blue.')`)
})
afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})
afterAll(async () => {
    await db.end()
})

describe('test companies', () => {

    test('get all companies', async () => {
        const resp = await request(app).get('/companies')
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual({
            companies: [{id: 'apple', name: 'Apple Computer'}, {id: 'ibm', name: 'IBM'}]
        })
    })

    test('get specific company by id', async () => {
        const resp = await request(app).get('/companies/1')
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual({company: {id: 'apple', name: 'Apple Computer', description: 'Maker of OSX'}})
    })
})