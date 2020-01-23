const express = require('express')
const  bodyParser = require('body-parser')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const ip = require('ip');
const app = express()
var cors = require('cors')

const processedData = [
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
]

async function main() {

    app.use(cors(), bodyParser.json(), bodyParser.urlencoded({ extended: true }), logger('dev'), errorHandler())

   
    app.get('/test', (req, resp) => {

        console.log(req.body)
        resp.status(200).send(JSON.stringify(processedData))
    })

    app.listen(3001 , () => console.log(`Server started at ${ip.address()}:${3000}`));
}

main().then(() => {

    console.log('Main program complete.');

}).catch((e) => {

    console.log('Main program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});