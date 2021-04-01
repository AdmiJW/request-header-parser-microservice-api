
require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();


app.use('/public', express.static('./public') );

//  Resolve CORS issue if the request is from some place
//  If the environment file does not have DISABLE XORIGIN specified
if (!process.env.DISABLE_XORIGIN) {
    //  Apply the origin allowing middleware
    app.use(function(req, res, next) {    
      var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];   //  Universal allowed origin
      var origin = req.headers.origin || '*';                                               //  Use headers origin, or * otherwise
      if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){           //  if environment does not specify XORIG_RESTRUCT, or origin is indeed in universal allowed origin
           console.log(origin);
           res.setHeader('Access-Control-Allow-Origin', origin);
           res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      }
      next();
    });
}


app.get('/', (req,res)=> {
    res.sendFile( path.join(__dirname, '/views/index.html') );
});


app.get('/api/whoami', (req,res)=> {
    const language = req.headers['accept-language'];
    const software = req.headers['user-agent'];
    const ipaddress = req.headers['x-forwarded-for'] || req.ip;
    res.json({
        ipaddress, language, software
    });
});





app.listen( process.env.PORT || 3000, ()=> {
    console.log("Request Header Parser Microservice started on port " + (process.env.PORT || 3000) )
})