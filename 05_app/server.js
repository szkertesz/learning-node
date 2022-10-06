var express = require('express')
var app = express()
app.use(express.static(__dirname))

var messages = [
    {
        name: 'Kertész', message: 'Hello!'
    },
    {
        name: 'Hédi', message: 'Szia!'
    }
]

app.get('/messages', (req, res) => {
    res.send(messages)
})

var server = app.listen(3000, () => {
    console.log('serve is listening on port', server.address().port)
})