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
        let notFound = !users.some(u => u.uid === uid)
        if (notFound) {
            users.push({uid, skid})
        }
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

        // Event user send recall msg to room
        socket.on("sendChangeChat", ({roomId , ...data}) => {
            // Sent to room Id
            io.to(roomId).emit("getChangeChat", data)
        });

        // Event Stop pending chat
        socket.on("stop-pendingChat", ({roomId, recivers}) => {
            recivers.forEach(user => {
                let reciver = findUser(user._id)
                if (reciver[0]) {
                    io.to(roomId).to(reciver[0].skid).emit("stopPendingByFriend", true)
                } else {
                    io.to(roomId).emit("stopPendingByFriend", true)
                }
            })
        });

        // Event mute user
        socket.on("send-muteUser", ({roomId, recivers}) => {
            recivers.forEach(user => {
                let reciver = findUser(user._id)
                io.to(reciver[0].skid).emit("getMuteUser",{ roomId, user})
            })
        });

        // Event unmute user
        socket.on("send-unMute", ({roomId, recivers, result}) => {
            recivers.forEach(user => {
                let reciver = findUser(user._id)
                io.to(reciver[0].skid).emit("getUnMuteUser", { roomId, user, result})
            })
        });

        // Event pending chat 
        socket.on("send-PendingChat", ({roomId, recivers, sender }) => {
            // Sent to friend Id
            recivers.forEach(user => {
                let reciver = findUser(user._id)
                
                if (reciver[0]) {
                    let reciverId = user._id 

                    // Sent back new msg to reciver and room
                    io.to(roomId).to(reciver[0].skid).emit("getPendingByFriend", {
                        roomId, 
                        reciverId,
                        sender
                    })
                } else {
                    // Sent on room
                    io.to(roomId).emit("getPendingByFriend", {sender})
                }
            });

        });

        socket.on("send-deleteGroup", ({roomId, recivers, sender }) => {
            // Sent to friend Id
            recivers.forEach(user => {
                let reciver = findUser(user._id)
                
                if (reciver[0]) {
                    let reciverId = user._id 

                    // Sent back new msg to reciver and room
                    io.to(roomId).to(reciver[0].skid).emit("getDeleteGroup", {
                        roomId, 
                        reciverId,
                        sender
                    })
                }
            });
        });

        socket.on("send-createGroup", ({recivers, sender, group}) => {
            // Sent to friend Id
            recivers.forEach(user => {
                let reciver = findUser(user._id)
                
                if (reciver[0]) {
                    let reciverId = user._id 

                    // Sent back new msg to reciver and room
                    io.to(reciver[0].skid).emit("getCreateGroup", {
                        reciverId,
                        sender,
                        group
                    })
                }
            });
        });

        // Event friend online to display last message
        socket.on("sendToFriendOnline", ({recivers , ...data}) => {
            // Sent to friend Id
            let sender = findUser(data.sender)

            recivers.forEach(user => {
                let friend = findUser(user._id)
            
                if (friend[0] && sender[0]) {
                    // Sent back new msg to sender and reciver
                    io.to(friend[0].skid).to(sender[0].skid).emit("getSomeOneMessage", data)
                } else if (sender[0]) {
                    // Sent back new msg for sender
                    io.to(sender[0].skid).emit("getSomeOneMessage", data)
                }
            })
        });

        // Event friend online to display last activity message (edit or recall)
        socket.on("sendLastActivity", ({recivers , ...data}) => {
            // Sent to friend Id
            let sender = findUser(data.result.sender)

            recivers.forEach(user => {
                let friend = findUser(user._id) 
                if (friend[0] && sender[0]) {
                    // Sent back new msg to sender and reciver
                    io.to(friend[0].skid).to(sender[0].skid).emit("getLastActivity", data)
                } else if (sender[0]) {
                    // Sent back new msg for sender
                    io.to(sender[0].skid).emit("getLastActivity", data)
                }
            })
        });

        // Event Add friend online 
        socket.on("sendAddFriend", ({reciverId, ...data}) => {
            let reciver = findUser(reciverId)
            if (reciver[0]) {
                io.to(reciver[0].skid).emit("getAddFriend", data)
            }
        })

        // Event Add group online 
        socket.on("sendGroupRequest", ({reciverId, ...data}) => {
            let reciver = findUser(reciverId)
            if (reciver[0]) {
                io.to(reciver[0].skid).emit("getGroupRequest", data)
            }
        })

        // User disconnect & remove this user online
        socket.on("disconnect", (reason) => {
            console.log("User disconnect", reason);
            removeUser(socket.id)
            // update users online again
            io.emit("getUser", users)
        })
    });

    return httpServer
}





module.exports = socketIo
