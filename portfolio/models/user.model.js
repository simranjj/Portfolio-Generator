const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: false, lowercase: true},
    dob: {type: Date, required: false},
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {type: String, required: true,},
    description: {type: String, required: false},
    skills: {
        front_end: {type: Array},
        back_end: {type: Array},
        database: {type: Array},
    },
    github: {type: String, required: false},
    linkedin: {type: String, required: false},
    acedemic_project: [
        {
            name: {type: String},
            description: {type: String},
        },
    ],
    professional_experience: [
        {
            company_name: {type: String},
            description: {type: String},
            time_period: {type: Number},
        },
    ],
    achievements: [
        {
            name: {type: String},
            description: {type: String},
            time: {type: Number},
        },
    ],
    certificates: [
        {
            name: {type: String},
            description: {type: String},
            expires_on: {type: Date},
        },
    ],
    created_at: {type: Date, default: Date.now, index: true},
    updated_at: {type: Date, default: Date.now, index: true},
    last_login_at: {type: Date, index: true},
    token_manager: {type: Array},
});

schema.set("toJSON", {virtuals: true});
module.exports = mongoose.model("User", schema);
