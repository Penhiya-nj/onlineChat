const { Router } = require("express");
const {AuthRouter} = require('./Auth.routes');
const { websiteRouter } = require("./website.routes");

const router = Router();




router.use("/auth" , AuthRouter)
router.use("/website" , websiteRouter)




module.exports = router;
