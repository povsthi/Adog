const express = require('express')
const app = express()
const msql = require('mysql2');
const port = 3000
const db = {
    host : '18.214.104.16',
    port : 3306,
    user : '00000000000',
    password : '00000000000',
    database : '00000000000'
    }
    
app.get('/', (req, res) => {
res.send('Hello World!')
})
app.listen(port, () => {
console.log('App escutando a porta: ${port}')
})

