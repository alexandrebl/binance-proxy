const { Spot } = require('@binance/connector')
const moment = require('moment')

const { Console } = require('console')
const fs = require('fs');
const internal = require('stream');

const apiKey = process.env.BINANCE_API_KEY; 
const apiSecret = process.env.BINANCE_API_SECRET;

const client = new Spot(apiKey, apiSecret);

client.depositWithdrawalHistory(0)
    .then(response => {
        var deposits = response.data.data;

        if (!fs.existsSync("/crypto")) {
            fs.mkdirSync("/crypto", 0777);
        }

        const current = moment().utc().format('YYYYMMDD_HHmmss_SSS')
        let amount = 0.0;

        for(var index = 0; index < deposits.length; index++){
            
            var deposit = deposits[index];

            console.log(JSON.stringify(deposit));

            if(deposit.status == "Successful") {
                amount = amount + Number.parseFloat(deposits[index].amount);
            }

            var fileName = '/crypto/deposits_' + current + '.json';

            fs.appendFileSync(fileName, JSON.stringify(deposit) + '\r\n', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                console.log(data);
              });
        }        

        console.log("Total amount: " + amount);
    }).catch(error => console.log(error));