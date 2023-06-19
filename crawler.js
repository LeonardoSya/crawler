const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://m.dm530w.net/';
const today = new Date().getDay();
const day = new Array("日", "一", "二", "三", "四", "五", "六");
const str = "周" + day[today];

https.get(url, (res) => {
    console.log(`状态码:${res.statusCode}`);
    console.log(`响应头:${JSON.stringify(res.headers)}`);

    let html = '';
    res.on('data', (chunk) => {
        html += chunk;
    });

    res.on('end', () => {
        const $ = cheerio.load(html);
        let files = [];
        files.push(`${str}更新:`);
        $(`.tlist ul:nth-child(${today}) li`).each(function () {
            const title = $('>a', this).text();
            const part = $('span a', this).text();
            files.push({ title, part });
        })
        files.push('最近更新');
        $('.list ul li').each(function () {
            const title = $('>a', this).text();
            const part = $('.itemimgtext', this).text();
            files.push({ title, part });
        })
        // console.log(files);
        console.log('爬取成功');

        fs.writeFile('./dramaFiles.json', JSON.stringify(files), (err, data) => {
            if (err) throw err;
            console.log('写入成功');
        });
    });
})