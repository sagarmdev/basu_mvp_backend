let fs = require("fs");
let path = require("path");
const config = require("../config/config");
let suid = require("rand-token").suid;
let uid = require("rand-token").uid;

function imageUpload(fileObjArray, pathFolder = "image") {
    let imagearr = [];
    for (let index = 0, len = fileObjArray.length; index < len; ++index) {
        if (fileObjArray[index].fieldname === "mediaImg") {
            console.log('fileObjArray[index]', fileObjArray[index])
            const image = uid(16) + path.extname(fileObjArray[index].originalname);
            const uploadPath = "./public/" + pathFolder + "/" + image;
            const outStream = fs.createWriteStream(uploadPath);
            outStream.write(fileObjArray[index].buffer);
            outStream.end();

            imagearr.push(image);
        }
    }
    return imagearr;
}

function videoUpload(fileObjArray, pathFolder = "video") {
    let imagearr = [];
    for (let index = 0, len = fileObjArray.length; index < len; ++index) {
        if (fileObjArray[index].fieldname === "mediaVideo") {
            const image = uid(16) + path.extname(fileObjArray[index].originalname);
            const uploadPath = "./public/" + pathFolder + "/" + image;
            const outStream = fs.createWriteStream(uploadPath);
            outStream.write(fileObjArray[index].buffer);
            outStream.end();

            imagearr.push(image);
        }
    }
    return imagearr;
}



function uploadRoommateFiles(fileObjArray, pathFolder = "roommate_media") {
    let imagearr = [];

    for (let index = 0, len = fileObjArray.length; index < len; ++index) {
        if (fileObjArray[index].fieldname === "media") {

            const roommate_media = uid(16) + path.extname(fileObjArray[index].originalname);
            const uploadPath = "./public/" + pathFolder + "/" + roommate_media;
            const outStream = fs.createWriteStream(uploadPath);
            outStream.write(fileObjArray[index].buffer);
            outStream.end();

            // let data = { roommate_media }
            // if (fileObjArray[index].fieldname === "photos") {
            //     data.media_type = 1
            // } else {
            //     data.media_type = 2
            // }

            imagearr.push(roommate_media);
        }
    }
    return imagearr;
}

function UploadFiles(fileObjArray, pathFolder = "images", fieldname) {
    let imagearr = [];
    for (let index = 0, len = fileObjArray.length; index < len; ++index) {
        if (fileObjArray[index].fieldname === fieldname) {
            const image = uid(16) + path.extname(fileObjArray[index].originalname);
            const uploadPath = "./public/" + pathFolder + "/" + image;
            const outStream = fs.createWriteStream(uploadPath);
            outStream.write(fileObjArray[index].buffer);
            outStream.end();

            imagearr.push(image);
        }
    }
    return imagearr;
}


module.exports = { imageUpload, videoUpload, uploadRoommateFiles, UploadFiles };
