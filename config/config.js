require('dotenv').config();

module.exports = {

    protocol: process.env.PROTOCOL || 'http',
    appPath: process.env.APPPATH,
    database: {
        database: process.env.DB_DATABASE || 'captaincorportaion',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
    },
    sslCertificates: {
        privkey: process.env.PRIVKEY,
        fullchain: process.env.FULLCHAIN
    },
    email: {
        fromEmail: process.env.EMAIL_FROM || "priyansh.webappdev@gmail.com",
    },
};
