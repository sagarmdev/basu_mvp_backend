const db = require('../config/db.config');
const { Op, Sequelize } = require('sequelize');

//.....................models...............
const UserSession = db.user_sessions;
const Conversations = db.conversations;
const Conversations_chats = db.conversations_chat;

let users = [];

//.................function
const addUser = (userId, socketId) => {
    !users.some((user) => user.socketId == socketId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    return users
}

const getUser = (value, key = "userId") => {
    const data = users.filter(user => user[key] == value);
    return data
}


//...............middleware
async function socketAuth(socket, next) {
    try {
        const token = socket.handshake.headers && socket.handshake.headers.authorization ? socket.handshake.headers.authorization : null;
        const isAuth = await UserSession.findOne({ where: { token: token }, attributes: ['user_id'] });

        if (isAuth) {
            addUser(isAuth.user_id, socket.id);
            socket.authUser = {
                userId: isAuth.user_id
            }
            next();
        }
        else {
            throw new Error("Unauthorized user")
        }
    } catch (error) {
        console.log(error)
    }
}


//.............create message 
const createMessage = async (data) => {
    try {
        const authUser = data.authUser;

        let conversations = await Conversations.findOne({
            where: {
                [Op.and]: [
                    { [Op.or]: [{ sender_id: authUser.userId }, { receiver_id: authUser.userId }] },
                    { [Op.or]: [{ sender_id: data.receiver_id }, { receiver_id: data.receiver_id }] }
                ]
            }
        });
        if (!conversations) {
            conversations = await Conversations.create({
                sender_id: authUser.userId,
                receiver_id: data.receiver_id
            })
        }

        const message = await Conversations_chats.create({
            conversations_id: conversations.id,
            sender_id: authUser.userId,
            message: data.message
        })

        return message
    } catch (error) {
        console.log(error);
    }
}


//................Get conversations
const getConversations = async (authUser) => {
    try {
        const conversations = await Conversations.findAll({
            where: {
                [Op.or]: [
                    { receiver_id: authUser.userId },
                    { sender_id: authUser.userId }
                ]
            },
            include: [
                {
                    model: Conversations_chats,
                    order: [['created_at', 'DESC']],
                    limit: 1,
                    as: 'chat',
                },
            ],
            order: [
                [Sequelize.literal('(SELECT MAX(`created_at`) FROM `Conversations_chats` WHERE `conversations_id` = `Conversations`.`id`)'), 'DESC'],
            ],
        });


        return conversations
    } catch (error) {
        console.log(error);
    }
}


// ................socket events 
async function socketEvent(io) {

    io.on('connection', socket => {
        console.log(socket.id, 'connected....');

        socket.on('sendMessage', async (data) => {

            data.authUser = socket.authUser;
            const senders = getUser(data.authUser.userId);
            const receivers = getUser(data.receiver_id);
            const message = await createMessage(data);

            senders.map(sender => {
                io.to(sender.socketId).emit('getMessage', message)
            });

            receivers.map(receiver => {
                io.to(receiver.socketId).emit('getMessage', message)
            });

        });

        socket.on('getConversation', async () => {
            authUser = socket.authUser;
            console.log(authUser);
            const conversation = await getConversations(authUser);
            io.to(socket.id).emit("conversations", conversation);

        })

        socket.on('disconnect', () => {
            console.log(socket.id, "disconnect");
            removeUser(socket.id)

        });

    })
}


module.exports = {
    socketEvent,
    socketAuth
}