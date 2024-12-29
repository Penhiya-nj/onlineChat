const createHttpError = require("http-errors");
const autoBind = require("auto-bind");
const WebsiteService = require('../services/Website.service')

class WebsiteController {

    #service;
    constructor() {
      autoBind(this);
      this.#service = WebsiteService;
    }

    async all(req , res, next ){
            try{

                const websites = await this.#service.getAll(req.user)

                return res.status(200).json({
                    success: websites.success,
                    data:websites.data
                })
            }
            catch(error){
                console.log(error)
                next(error)
            }
    }


    async create(req , res , next){
        try{
            const {name , domain ,email} =req.body  

           const result =  await this.#service.create(req.user ,{name , domain , email} )

           res.send(result)
        }catch(error) {
            next(error)
        }
    }
    async getOne(req , res , next){
        try{
           const {id} = req.params 
           
           const result =  await this.#service.getOne(id,req.user)

           res.send(result)
        }catch(error) {
            next(error)
        }
    }
    async update(req , res , next){
        try{
           const {id} = req.params 
           
           const result =  await this.#service.update(req.user ,id , req.body)

           res.send(result)
        }catch(error) {
            next(error)
        }
    }

    async delete(req ,res , next ){
        try{    
            const {id} = req.params

            const result = await this.#service.delete(req.user , id)

            res.status(200).json({
                success : true,
                data : result
            })

            
        }catch(error){
            next(error)
        }
    }
}

module.exports = new WebsiteController()