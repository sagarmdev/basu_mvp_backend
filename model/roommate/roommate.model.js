module.exports = (sequelize, Sequelize) => {
    const roommate = sequelize.define('roommates', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lat: {
            type: Sequelize.STRING,
            allowNull: false
        },
        long: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.STRING,
            enum: ['Male', 'Female', 'Other'],
            allowNull: false
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Occupation: {
            type: Sequelize.STRING,
            allowNull: false
        },
        food_choice: {
            type: Sequelize.STRING,
            allowNull: false,
            enum: ['Vegetarian', 'Non-Vegetarian']
        },
        religion: {
            type: Sequelize.STRING,
            allowNull: false,
            enum: ['Hindu', 'Muslim', 'Christianity', 'Buddhism', 'Other'],
        },
        monthly_rent: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        minimum_stay: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bathroom: {
            type: Sequelize.STRING,
            allowNull: false,
            enum: ['Yes', 'No']
        },
        required_roommate: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        marital_status: {
            type: Sequelize.STRING,
            allowNull: false,
            enum: ['Single', 'Married']
        },
        gender_preference: {
            type: Sequelize.STRING,
            enum: ['Male', 'Female', 'Other'],
            allowNull: false
        },
        preference_food_choice: {
            type: Sequelize.STRING,
            allowNull: false,
            enum: ['Vegetarian', 'Non-Vegetarian']
        },
        preference_age: {
            type: Sequelize.STRING,
            enum: ['12-18 Year', '18-35 Year', '35-50 Year'],
            allowNull: false
        },
        other: {
            type: Sequelize.STRING,
            allowNull: false,
            enum: ['Pet Friendly', 'Non-smoker']
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
        deletedAt: {
            field: 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'roommates',
        paranoid: "true"
    });
    return roommate
}