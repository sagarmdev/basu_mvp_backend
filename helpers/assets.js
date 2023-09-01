"use strict"
const config = require("../config/config")

module.exports.getProfileUrl = (fileName, folderName) => {
    return 'http://localhost:3001' + `/${folderName}/` + fileName;
}

module.exports.getMediaUrl = (fileName, folderName) => {
    return config.appPath + `/images` + `/${folderName}/` + fileName;
}


