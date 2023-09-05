const MESSAGES = {
    //auth controller
    '1001': 'Signup successfully!',
    '1002': 'Login successfully!',
    '1003': 'email already exists',
    '1004': 'User not found!',
    '1005': 'Incorrect password',
    '1006': "Reset password email has been successfully sent",
    '1007': "Invalid reset token",
    '1008': "Password reset successful",
    '1009': "Invaild token",

    //ROOM
    '1101': "Added room successfully",
    '1102': "get all Room types",
    '1103': "data null",
    '1104': "get all rooms",
    '1105': "Data not found!",
    '1106': "Room Booking successfully..",

    //event 
    '2001': 'Get event categories successfully.',
    '2002': 'event categories not found.',
    '2003': 'Get event amenities successfully.',
    '2004': 'event amenities not found.',
    '2005': 'Create event successfully..',

    //item sale & rent 
    '2101': 'Create item successfully..',
    '2102': 'Get item categories successfully..',
    '2103': 'item categories not found',
    '2104': 'Get Rent & Sale successfully..',
    '2105': 'Sale Or Rent not found',

    //roommate
    '2201': 'Add roommate  successfully..',
    '2202': 'You can upload only one image',
    '2203': 'Get roommate successfully',
    '2204': 'roommate data not found',

    // roommate booking
    '2301': 'Roommate Booking successfully',
    '2302': 'Enter a valid minimum stay',

}

module.exports.getMessage = function (messageCode) {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};