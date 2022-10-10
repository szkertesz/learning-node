if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = process.env.MONGODB_CONNECTION_STRING

var Message = mongoose.model('Message', {
    name: String,
    message: String
})
// var messages = [
//     {
//         name: 'Kertész', message: 'Hello!'
//     },
//     {
//         name: 'Hédi', message: 'Szia!'
//     }
// ]

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

// app.post('/messages', (req, res) => {
//     var message = new Message(req.body)
//     // callback based solution:
//     // message.save(err => {
//     //     if (err) sendStatus(500)

//     //     Message.findOne({ message: 'badword' }, (err, censored) => {
//     //         if (censored) {
//     //             console.log('censorable term found: ', censored)
//     //             Message.deleteOne({ _id: censored.id }, err => {
//     //                 console.log('Censored item removed')
//     //             })
//     //         }

//     //     })
//     //     // messages.push(req.body)
//     //     io.emit('message', req.body)
//     //     res.sendStatus(200)
//     // })

//     // promise based solution:
//     message.save().then(() => {
//         console.log('Saved')
//         return Message.findOne({ message: 'badword' })
//     })
//         .then(censored => {
//             if (censored) {
//                 console.log('censorable term found: ', censored)
//                 return Message.deleteOne({ _id: censored.id })
//             }
//             io.emit('message', req.body)
//             res.sendStatus(200)
//         })
//         .catch(err => {
//             res.sendStatus(500)
//             return console.error(err)
//         })

// })

// async await solution
app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()
        console.log('Saved')
        var censored = await Message.findOne({ message: 'badword' })
        if (censored) {
            await Message.deleteOne({ _id: censored.id })
        } else {
            io.emit('message', req.body)
        }
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('message post called')
    }
})

io.on('connection', socket => {
    console.log('user connected')
})

mongoose.connect(dbUrl, err => console.log('mongodb connection: ', err))

var server = http.listen(3000, () => {
    console.log('serve is listening on port', server.address().port)
})
