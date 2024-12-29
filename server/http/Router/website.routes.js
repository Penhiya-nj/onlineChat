const { Router } = require("express");

const rateLimit = require('express-rate-limit');
const Authorization = require("../common/guard/Authorization.guard");
const WebsiteController = require("../controllers/Website.controller");
const websiteValidate = require("../middlewares/website.validate");
const router = Router();

const loginRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    },
});

//to create website we need body contains fields : name (string) 
router.post('/',
    Authorization.TokenCheck,
    websiteValidate.validatePost,
    WebsiteController.create
);

router.get('/:id',
    Authorization.TokenCheck,
    WebsiteController.getOne
);

router.get('/',
    Authorization.TokenCheck,
    WebsiteController.all);

router.patch('/:id', Authorization.TokenCheck, WebsiteController.update);

router.delete('/:id', Authorization.TokenCheck, WebsiteController.delete );


//agents 
router.post('/operator', (req, res) => {
    res.send("add an operator to a website") //body website id & operator id 
});
router.delete('/operator', (req, res) => {
    res.send("remove an operator from a website")
});





module.exports = { websiteRouter: router }

