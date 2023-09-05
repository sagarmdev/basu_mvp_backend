const Validator = require('validatorjs');
const db = require("../config/db.config");
// const db = require('../models'); 
const Save = db.saves;
// const { Sequelize, Op } = require('sequelize');

const savePost = async (req, res) => {
    try {
        const { user: { id }, body: { roomId, eventId, roommateId } } = req;
        const post = await Save.create({ userId: id, roomId, eventId, roommateId })
        return RESPONSE.success(res, 1104, post);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
};



module.exports = {
    savePost
}
