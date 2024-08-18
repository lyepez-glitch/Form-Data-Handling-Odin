import express from 'express';
const app = express()
const port = 3000
import cors from 'cors';
app.use(cors());
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(express.urlencoded({ extended: false }));
app.get('/chars', async(req, res) => {
    const names = ['Waldo', 'Batman', 'Scooby'];
    const { innerWidth, innerHeight } = req.query;

    const promises = names.map(async(name) => {
        // let randomXCoord = Math.floor(Math.random() * (innerWidth - 100));

        // let randomYCoord = Math.floor(Math.random() * (innerHeight - 100))

        const randomXCoord = Math.floor(Math.random() * 100);

        const randomYCoord = Math.floor(Math.random() * 100)
        const newUser = await prisma.user.create({
            data: {
                name: 'test'
            }
        })
        console.log('new user', newUser)
        const upsertChar = await prisma.char.upsert({
            where: {
                name: name
            },
            update: {
                name: name,
                xcoord: randomXCoord,
                ycoord: randomYCoord,
                showMarker: false
            },
            create: {
                name: name,
                xcoord: randomXCoord,
                ycoord: randomYCoord,
                showMarker: false
            },
        })

    })
    await Promise.all(promises);
    const foundChars = await prisma.char.findMany()
    console.log('foundChars', foundChars)
    res.json({ foundChars })
})

app.post('/validate', async(req, res) => {
    console.log('body', req.body);
    const { cursorClick, charActual, name } = req.body;

    function isWithin(cursorClick, charActual) {
        console.log('cursorClick', cursorClick, 'charActual', charActual)
        const distanceX = Math.abs(charActual.clientWidth - cursorClick.clientWidth)
        const distanceY = Math.abs(charActual.clientHeight - cursorClick.clientHeight)
        return (distanceX <= 100 && distanceY <= 100);
    }
    const within = isWithin(cursorClick, charActual);
    console.log('is within', within)
    if (within) {
        const updateChars = await prisma.char.update({
            where: {
                name: name
            },
            data: {
                showMarker: true
            }
        })
        console.log('update char', updateChars);



        // then in the react file make get req to get users and update
    }
    const chars = await prisma.char.findMany();
    res.json({ chars, within });

})

app.post('/users', async(req, res) => {
    const { name } = req.body;

    console.log('name', name, req.body)
    const user = await prisma.user.create({
        data: {
            name
        },
    })
    console.log('user created ', user)
    res.json({ user: { msg: `user ${name} created` } })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})