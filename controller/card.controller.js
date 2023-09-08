const Validator = require("validatorjs");
const db = require('../config/db.config');
const Card = db.card;

const addCard = async (req, res) => {
    let validation = new Validator(req.body, {
        card_number: 'required|numeric',
        cvc: 'required|numeric',
        expiry_date: 'required',
        cardholder_name: 'required|alpha',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const { card_number, cvc, expiry_date, cardholder_name } = req.body;

        const authUser = req.user.id;

        const card = await Card.create({ user_id: authUser, card_number, cvc, expiry_date, cardholder_name });


        return RESPONSE.success(res, 2101, card);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


module.exports = {
    addCard
}
