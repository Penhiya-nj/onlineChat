const autoBind = require("auto-bind");
const nodemailer = require("nodemailer");
const UserModel = require("../../database/models/user.model");
const createHttpError = require("http-errors");
const { randomInt } = require("crypto");
require("dotenv").config();
const bcrypt = require("bcrypt");
const websiteModel = require("../../database/models/website.model");
const fetch = require('node-fetch');
const ChatwootAPI = require("../common/utils/chatwootApi.util");
const { features } = require("process");
const mongoose = require('mongoose');

/**this class do all the dirty work behind the scene for controller class 
 * the website Controller class uses this class to communicate with local DB (mongoDB) 
 * also communicate with chatwoot api service  to effect on chatwoot DB as well 
 * ach method in the controller class relies on a dedicated and 
 * corresponding method in the service class   */
class WebsiteService {
    #UserModel;
    #WebsiteModel
    #api
    constructor() {
        autoBind(this);
        this.#UserModel = UserModel;
        this.#WebsiteModel = websiteModel
        this.#api = new ChatwootAPI(process.env.chatwoot_api_base_url, process.env.chatwoot_api_token);
    }

    async create(user, data) {
        let result;
        try {

            // create an account in chatwoot by chatwoot api (chatwoot DB)
            result = await this.#api.createAccount(
                {
                    name: data.name,
                    domain: data.domain,
                    locale: "fa",
                    support_email: data.email || user.email
                }
            )

            // update account for take agent management from creator in chatwoot dashboard   
            //result = await this.#api.updateAccount(result.id, { features: { agent_management: false } })


            //assign an admin user to created account ( accounts need at least  1 admin to be maintained)
            const resultUserAccount = await this.#api.createAccountUser(result.id, {
                user_id: user.chatwoot_admin.chatwoot_id,
                role: 'administrator'
            })

            // add hte created account to express database(local app DB)
            const website = await this.#WebsiteModel.create({
                chatwoot_id: result.id,//55
                name: result.name,
                url: result.domain,
                owner: user._id
            })
            return website;
        } catch (error) {
            //delete account if there was an error (rollback) 
            await this.#api.deleteAccount(result.id)
            console.log(error)
            error.level = 'service'
            error.status = 500
            throw error
        }

    }

    /**
     * 
     * @param {*} websiteId 
     * @param {*} user 
     * @returns website(from chatwoot DB)
     */
    async getOne(websiteId, user) {
        try {
            //console.log(user)
            //check the account(website) ownership and return it 
            const result = await this.findWebsiteAndVerifyOwnership(websiteId, user._id);

            //return error if the user was not the owner or the website did not exist 
            if (!result.success)
                throw createHttpError.NotFound("website doesn't exist")


            //return the website data 
            return await this.#api.getAccount(result.data.chatwoot_id)

        } catch (error) {
            console.error('Error in listUserWebsites:', error);
            error.level = 'service'
            error.status = 404
            throw error
        }

    }
    /**
     * returns all website created by the given user 
     * @param {*} user 
     * @returns [WebsiteModel]
     */
    async getAll(user) {
        try {
            //check if user is valid (its unnecessary  BTW)
            if (!mongoose.isValidObjectId(user._id)) {
                throw new Error('Invalid userId format');
            }

            //find  all websites from local database (express DB ) and select some fields  
            const websites = await this.#WebsiteModel.find({ owner: user._id })
                .select('_id name url operators').lean()

            //return the data to controller 
            return { success: true, data: websites };
        } catch (error) {
            console.error('Error in listUserWebsites:', error);
            error.level = 'service'
            error.status = 404
            throw error
        }
    }

    /**
     * gets a website id and data to update 
     * the website in both chatwoot and local database 
     * @param {*} user 
     * @param {*} websiteId 
     * @param {*} data 
     * @returns 
     */
    async update(user, websiteId, data) {
        let result
        try {
            //find website and validate the ownership 
            const website = await this.findWebsiteAndVerifyOwnership(websiteId, user._id)

            //return error if the user was not the owner of the given website
            if (!website.success) throw createHttpError.NotFound("website doesn't exist or wrong id")

            //update the website in chatwoot
            result = await this.#api.updateAccount(website.data.chatwoot_id,
                {
                    name: data.name,
                    domain: data.domain,
                    ...(data.email && { support_email: data.email })
                }
            )

            // update the website in local DB 
            const localWebsite = await this.#WebsiteModel.findById(website.data._id)
            localWebsite.name = result.name
            localWebsite.url = result.domain

            //return the updated website 
            return localWebsite
        } catch (error) {
            throw error
        }
    }

    /**
     * get a website id and deletes it in both DBs 
     * @param {*} user 
     * @param {*} websiteId 
     * @returns 
     */
    async delete(user, websiteId) {

        try {
            //check the ownership of website with the given user and website id 
            const website = await this.findWebsiteAndVerifyOwnership(websiteId, user._id)

            //return errors fo above check results
            if (!website.success) throw createHttpError.NotFound("website doesn't exist")

            //if no error, delete the account in chatwoot      
            const result = await this.#api.deleteAccount(website.data.chatwoot_id)

            //if no errors, delete the website in local DB 
            const localResult = this.#WebsiteModel.findByIdAndDelete(website.data._id)

            //return the data of deleted website 
            return localResult;
        } catch (error) {
            throw error
        }
    }




    /**
     * the helper for check the ownership of a website by the given user 
     * @param {*} websiteId 
     * @param {*} userId 
     * @returns 
     */

    async findWebsiteAndVerifyOwnership(websiteId, userId) {
        try {
            const website = await this.#WebsiteModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(websiteId) } // Match the website by ID
                },
                {
                    $lookup: {
                        from: 'users', // Reference the User collection
                        localField: '_id', // Website ID
                        foreignField: 'websites', // Array of website IDs in User
                        as: 'user' // Alias for the joined data
                    }
                },
                {
                    $unwind: { path: '$user', preserveNullAndEmptyArrays: true } // Unwind user array
                },
                {
                    $match: { 'user._id': new mongoose.Types.ObjectId(userId) } // Check if user owns this website
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        url: 1,
                        chatwoot_id: 1,
                        owner: 1,
                        operators: 1
                    }
                }
            ]);

            if (website.length === 0) {
                return { success: false, message: 'Either the website does not exist or is not associated with the given user.' };
            }

            return { success: true, data: website[0] };
        } catch (error) {
            console.error("Error in findWebsiteAndVerifyOwnership:", error);
            error.status = 500
            error.level = 'service'
            throw error;
        }
    }

}

//export a module so can be used in other modules 
module.exports = new WebsiteService()