// IO SET UP
const { createServer } = require("http");
const { Server } = require("socket.io");

const socketIo = (app) => {

    const httpServer = createServer(app);
    const io = new Server(httpServer,  {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    let users = []

    // Check in array add in not exist
    function addUser(uid , skid) {
        !users.some(u => u.uid === uid) &&
        users.push({uid, skid})
    }

    // Find In array user
    function findUser(uid) {
        return users.filter(u => u.uid === uid)
    }

    // Remove user by socket id
    function removeUser(skid) {
        users = users.filter(u => u.skid !== skid)
    }

    io.on("connection", (socket) => {

        // User online push and get user Online
        console.log("User connect");
        socket.on("join server" , (uid) => {
            addUser(uid, socket.id)
            io.emit("getUser", users)
        })

        // Every time user go in on conversation page then get list user for client
        socket.on('join conversation', () => {
            io.emit("getUser", users)
        })

        // Event when user chose conversation
        socket.on("join room", (roomId) => {
            socket.join(roomId)
        })

        // Event when user chose anoder conversation leave prev conversation
        socket.on("leave room", (roomId) => {
            socket.leave(roomId)
        })

        // Event user send msg to room
        socket.on("send-msg", ({roomId , ...data}) => {
            // Sent to room Id
            io.to(roomId).emit("getMessage", data)
        });


        // Event friend online to display last message
        socket.on("sendToFriendOnline", ({friendId , ...data}) => {
            // Sent to friend Id
            let friend = findUser(friendId)
            let sender = findUser(data.sender)
            if (friend[0] && sender[0]) {
                // Sent back new msg to sender and reciver
                io.to(friend[0].skid).to(sender[0].skid).emit("getSomeOneMessage", data)
            } else if (sender[0]) {
                // Sent back new msg for sender
                io.to(sender[0].skid).emit("getSomeOneMessage", data)
            }
        });

        socket.on("sendAddFriend", ({reciverId, ...data}) => {
            let reciver = findUser(reciverId)
            if (reciver[0]) {
                io.to(reciver[0].skid).emit("getAddFriend", data)
            }
        })

        // User disconnect & remove this user online
        socket.on("disconnect", () => {
            console.log("User disconnect");
            removeUser(socket.id)
            // update users online again
            io.emit("getUser", users)
        })
    });

    return httpServer
}





module.exports = socketIo
