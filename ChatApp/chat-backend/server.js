const express = require("express")
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
require('./connection')
const userRoutes = require('./routes/userRoutes')
const User = require('./models/users')
const Message = require('./models/message')

const  app = express()
const rooms = ['general','tech','finance','crypto']

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use('/users',userRoutes)

const server = http.createServer(app)
const PORT = 5001
const io = socket(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST']
    }
})

app.get('/rooms', (req,res)=>{
    res.json(rooms)
})

async function getLastMessagesFromRoom(room){
    let roomMessages = await Message.aggregate([
        {$match: {to: room}},
        {$group: {_id: '$date',messagesByDate:{$push: '$$ROOT'}}}
    ])
    return roomMessages
}

function sortRoomMessagesByDate(messages){
    return messages.sort(function(a,b){
        let date1 = a._id.split('/')
        let date2 = b._id.split('/')

        date1 = date1[2] + date1[0] + date1[1]
        date2 = date2[2] + date2[0] + date2[1]

        return date1 < date2 ? -1 : 1
    })
}

//socket connection
io.on('connection',(socket)=>{

    socket.on('new-user',async ()=>{
        const member = await User.find()
        io.emit('new-user', member)
    })

    socket.on('join-room', async (newRoom, prevRoom) => {
        socket.join(newRoom)
        socket.leave(prevRoom)
        let roomMessages = await getLastMessagesFromRoom(newRoom)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        socket.emit('room-messages',roomMessages)
    })

    socket.on('message-room',async(room, content, sender, time, date)=>{
        
        const newMessage = await Message.create({content, from:sender, time, date, to:room})
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        //sending message to room
        io.to(room).emit('room-messages',roomMessages)
        
        socket.broadcast.emit('notifications',room)

    })

    app.delete('/logout', async ( req,res )=>{
        try {
            const {_id,newMessages} = req.body
            const user = await User.findById(_id)
            user.status = 'offline'
            user.newMessages = newMessages
            await user.save()
            const members = await User.find()
            socket.broadcast.emit('new-user',members)
            res.status(200).send()
        } catch (e) {
            console.log(e)
            res.status(400).send()
        }
    })
})

server.listen(PORT,()=>{
    console.log('listening to post',PORT)
})