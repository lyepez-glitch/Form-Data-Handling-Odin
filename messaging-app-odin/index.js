const express = require('express')
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/signUp', (req, res) => {
    res.send('Sign Up!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})