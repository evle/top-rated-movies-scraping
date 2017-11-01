const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const port = 8081;

app.get('/', function (req, res) {

    url = 'http://www.imdb.com/chart/top?ref_=nv_mv_250_6';

    request(url, function (error, response, html) {

        if (!error) {

            var $ = cheerio.load(html);

            let json = [];
            
            movies = $('.titleColumn').each((i, elem) => {
                json.push({
                   rank: i + 1,
                   title: $(elem).children('a').text(),
                   release: $(elem).children().last().text(),
                   rating: $(elem).siblings('.ratingColumn').children('strong').text(),
                   img: $(elem).siblings('.posterColumn').children().children().attr('src')
                });
            });

            res.send(json);

            fs.writeFile('output.json', JSON.stringify(json, null, 4), (err) => {
                console.log('File successfully written! Check the output.json file');
            });
        }
    });


});

app.listen(port);
console.log(`Magic happens on port ${port}`);