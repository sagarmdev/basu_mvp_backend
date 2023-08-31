const Validator = require("validatorjs");
const db = require('../config/db.config');
const { Op } = require('sequelize')

//...................models............
const Item_categories = db.items_categories;
const Items = db.items;
const Items_photos = db.item_photos;
const { imageUpload } = require('../helpers/file')


//.......................get All Items_categories.......
const getAllItemsCategories = async (req, res) => {
    try {
        const authUser = req.user;

        const itemCategories = await Item_categories.findAll();

        if (!itemCategories) {
            return RESPONSE.error(res, 2103);
        }

        return RESPONSE.success(res, 2102, itemCategories);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//..............add item for sale & rent.................
const addItem = async (req, res) => {
    let validation = new Validator(req.body, {
        item_type: 'required|in:Rent,Sale',
        title: 'required|string',
        description: 'required|string',
        price: 'required|numeric',
        city: 'required|string',
        price_duration: 'required_if:item_type,Rent|in:per day,per month',
        security_deposite: 'required_if:item_type,Rent',
        lat: 'required',
        long: 'required',
        item_category_id: 'required',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const { item_type, title, description, price, city, price_duration, security_deposite, lat, long, item_category_id } = req.body;

        const authUser = req.user;

        const itemData = await Items.create({ item_type, title, description, price, city, price_duration, security_deposite, lat, long, item_category_id });

        //..................upload photo....
        if (itemData) {
            let photos = [];
            if (typeof req.files !== 'undefined' && req.files.length > 0) {
                photos = await imageUpload(req.files, 'images/roommate_media');
            }

            for (const image of photos) {
                await Items_photos.create({
                    items_id: itemData.id,
                    photo: image
                })
            }
        }

        const findItem = await Items.findOne({
            where: { id: itemData.id },
            include: [
                {
                    model: Items_photos,
                    attributes: ['photo', 'id']
                },
                {
                    model: Item_categories,
                    attributes: ['name', 'id']
                },
            ],
        });

        return RESPONSE.success(res, 2101, findItem);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//...................get All Rent & sale .................

const getAllRentAndSale = async (req, res) => {
    let validation = new Validator(req.query, {
        item_type: 'required|in:Rent,Sale',
        min_budget: 'numeric|min:0',
        max_budget: 'numeric|min:0'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const { item_type, item_category_id, city, min_budget, max_budget } = req.query;

        let condition = {
            item_type: item_type
        }

        if (item_category_id) {
            condition.item_category_id = item_category_id
        }

        if (city) {
            condition.city = city
        }

        if (min_budget && max_budget) {
            condition.price = { [Op.gte]: min_budget, [Op.lte]: max_budget }
        }

        const findAllData = await Items.findAll({
            where: condition
        });

        if (!findAllData.length) {
            return RESPONSE.error(res, 2105);
        }

        return RESPONSE.success(res, 2104, findAllData);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//...........................get Rent and Sale by id...............
const getRentAndSaleById = async (req, res) => {
    let validation = new Validator(req.query, {
        item_type: 'required|in:Rent,Sale',
        id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    try {
        const { item_type, id } = req.query;

        const findData = await Items.findOne({ where: { id: id, item_type: item_type } })

        if (!findData) {
            return RESPONSE.error(res, 2105);
        }

        return RESPONSE.success(res, 2104, findData);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}



module.exports = {
    getAllItemsCategories,
    addItem,
    getAllRentAndSale,
    getRentAndSaleById
}