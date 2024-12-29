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

        if (!user.chatwoot_admin) {
            
        }
        let result;
        try {
            result = await this.#api.createAccount(
                {
                    name: data.name,
                    domain: data.domain,
                    locale: "fa",
                    support_email: data.email || user.email
                }
            )

            result = await this.#api.updateAccount(result.id, { features: { agent_management: false } })

            const website = await this.#WebsiteModel.create({
                chatwoot_id: result.id,
                name: result.name,
                url: result.domain,
                owner: user._id
            })
            return website;
        } catch (error) {
            //delete if there was an error 
            await this.#api.deleteAccount(result.id)
            console.log(error)
            error.level = 'service'
            error.status = 500
            throw error
        }

    }


    async getOne(websiteId, user) {
        try {
            //console.log(user)

            const result = await this.findWebsiteAndVerifyOwnership(websiteId, user._id);

            if (!result.success)
                throw createHttpError.NotFound("website doesn't exist")
            return await this.#api.getAccount(result.data.chatwoot_id)

        } catch (error) {
            console.error('Error in listUserWebsites:', error);
            error.level = 'service'
            error.status = 404
            throw error
        }

    }

    async getAll(user) {
        try {
            if (!mongoose.isValidObjectId(user._id)) {
                throw new Error('Invalid userId format');
            }
            const websites = await this.#WebsiteModel.find({ owner: user._id })
                .select('_id name url operators').lean()


            return { success: true, data: websites };
        } catch (error) {
            console.error('Error in listUserWebsites:', error);
            error.level = 'service'
            error.status = 404
            throw error
        }
    }


    async update(user, websiteId, data) {
        let result
        try {
            const website = await this.findWebsiteAndVerifyOwnership(websiteId, user._id)

            if(!website.success) throw createHttpError.NotFound("website doesn't exist or wrong id")

            result = await this.#api.updateAccount(website.data.chatwoot_id,
                {
                    name: data.name,
                    domain: data.domain,
                    ...(data.email && { support_email: data.email })
                }
            )

            const localWebsite = await this.#WebsiteModel.findById(website.data._id)
            localWebsite.name = result.name
            localWebsite.url = result.domain

            return localWebsite
        } catch (error) {
            throw error
        }
    }

    async delete(user, websiteId) {

        try {
            const website = await this.findWebsiteAndVerifyOwnership(websiteId, user._id)

            if (!website.success) throw createHttpError.NotFound("website doesn't exist")

            const result = await this.#api.deleteAccount(website.data.chatwoot_id)

            const localResult = this.#WebsiteModel.findByIdAndDelete(website.data._id)

            return localResult;
        } catch (error) {
            throw error
        }
    }




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

module.exports = new WebsiteService()