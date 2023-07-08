const http = require('http');
const fs = require('fs');
const _ =require('lodash');

const server = http.createServer((req,res)=>{
    console.log(req.url, req.method);


    res.setHeader('Content-Type', 'text/html');

    // fs.readFile('./views/login.html', (err, data)=>{
    //     if (err) {
    //         console.log(err);
    //         res.end();
    //     }
    //     else {
    //         res.write(data);
    //         res.end();
    //     }
    // })
    let path = './views/';
    switch(req.url) {
        case '/':
            path +='login.html';
            break;
        case '/about':
            path +='about.html';
            break;
        default:
            path +='404.html';
            break;
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            // res.write(data);
            res.end(data);
        }
    });

    
});

server.listen(3000,'localhost', () => {
    console.log('Listening for requests on port 3000')
});
 