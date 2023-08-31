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


}

module.exports.getMessage = function (messageCode) {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};