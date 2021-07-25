
require('dotenv').config()

const path = require('path');
const express = require('express');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

//===========================
// Rate Limiting
//===========================
const staticRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,            // 5 Min, 300 second
    max: 300                            // Maximum of 200 request for 5 min
});
const apiRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,            // 5 Min, 300 second
    max: 600                            // Maximum of 600 request for 5 min
});


app.use('/public', staticRateLimiter, express.static('./public') );

// HelmetJS for improved security
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", 'unpkg.com', 'kit.fontawesome.com'],
            connectSrc: ["'self'", "fontawesome.com", "*.fontawesome.com"]
        }
    }
}));

//  FreeCodeCamp's CORS
if (!process.env.DISABLE_XORIGIN) {
    //  Apply the origin allowing middleware
    app.use(function(req, res, next) {    
      var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];   //  Universal allowed origin
      var origin = req.headers.origin || '*';                                               //  Use headers origin, or * otherwise
      if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){           //  if environment does not specify XORIG_RESTRUCT, or origin is indeed in universal allowed origin
           res.setHeader('Access-Control-Allow-Origin', origin);
           res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      }
      next();
    });
}


//===========================
// Routes
//===========================
app.get('/', apiRateLimiter, (req,res)=> {
    res.sendFile( path.join(__dirname, '/views/index.html') );
});


app.get('/api/whoami', apiRateLimiter, (req,res)=> {
    const language = req.headers['accept-language'];
    const software = req.headers['user-agent'];
    const ipaddress = req.headers['x-forwarded-for'] || req.ip;
    res.json({
        ipaddress, language, software
    });
});





app.listen( process.env.PORT || 3000, ()=> {
    console.log("Request Header Parser Microservice started on port " + (process.env.PORT || 3000) );
    console.log("Mode: " + process.env.NODE_ENV);
});