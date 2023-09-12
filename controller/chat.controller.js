const db = require('../config/db.config')
let users = [];


const addUser = (userId, socketId) => {
    !users.some((user) => user.userId == userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    return users
}

const getUser = (value, key = "userId") => {
    const data = users.find(user => user[key] == value)
    return data
}




async function socketAuth(socket, next) {
    try {
        const token = socket.handshake.headers && socket.handshake.headers.authorization ? socket.handshake.headers.authorization : null;
        console.log(token);
        const UserSession = db.user_sessions;
        const isAuth = await UserSession.findOne({ where: { token: token }, attributes: ['user_id'] });

        if (isAuth) {
            addUser(isAuth.user_id, socket.id);
            socket.authUser = {
                userId: isAuth.user_id
            }
            // console.log(users);
            next()
        }
        else {
            throw new Error("Unauthorized user")
        }
    } catch (error) {
        console.log(error)
    }
}


async function socketEvent(io) {

    io.on('connection', socket => {
        console.log('connected....');


        socket.on('new-user-joined', name => {
            // console.log("New user", name);
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name)
        });

        socket.on('sendMessage', (message) => {
            message.authUser = socket.authUser;
            const sender = getUser(message.authUser.userId);
            console.log(sender);
            // console.log('message', message);
            socket.broadcast.emit('getMessage', { message: message, name: users[socket.id] })
        });

        // socket.on('disconnect', message => {
        //     console.log(socket.id, "disconnect");

        //     socket.broadcast.emit('leave', users[socket.id]);
        //     delete users[socket.id];
        // });

    })
}


module.exports = {
    socketEvent,
    socketAuth
}