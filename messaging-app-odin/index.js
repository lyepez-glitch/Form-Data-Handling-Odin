import express from 'express'
const app = express()
const port = 3000
import cors from 'cors';
import usersRouter from './routes/users.js'
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({
    allowedHeaders: 'Content-Type,Authorization'
}))
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/users', usersRouter)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})