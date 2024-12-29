const { Schema, model, Types } = require("mongoose");
const UserModel = require('./user.model')

const websiteSchema = new Schema({
    chatwoot_id: { type: Number, required: true },
    url: { type: String, required: true, unique: true },
    name: { type: String, required: true , unique: true },
    owner : {type : Types.ObjectId , ref: 'user' , required : true },
    operators: [{ type: Types.ObjectId, ref: "operator" , required : false}]

},  { timestamps: true })

websiteSchema.post('save', async function (doc, next) {
    try {
        await UserModel.findByIdAndUpdate(
            doc.owner,
            { $addToSet: { websites: doc._id } }, // Add to the array if it doesn't already exist
            { new: true }
        );
        next();
    } catch (err) {
        console.error("Error adding website ID to user:", err);
        next(err);
    }
});

// Remove website ID from user after deletion
websiteSchema.post('findOneAndDelete', async function (doc, next) {
    try {
        if (doc && doc.owner) {
            await UserModel.findByIdAndUpdate(
                doc.owner,
                { $pull: { websites: doc._id } }, // Remove the website ID from the array
                { new: true }
            );
        }
        next();
    } catch (err) {
        console.error("Error removing website ID from user:", err);
        next(err);
    }
});




const websiteModel = model("website", websiteSchema);

module.exports = websiteModel;