const { Router } = require("express");
const {productRouter} = require('./product.routes')
const {AuthRouter} = require('./Auth.routes');

const router = Router();




router.use("/auth" , AuthRouter)




module.exports = router;
