import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/chars', async(req, res) => {
    const names = ['Waldo', 'Batman', 'Scooby'];
    const { innerWidth, innerHeight } = req.query;
    names.forEach(async(name) => {
        // let randomXCoord = Math.floor(Math.random() * (innerWidth - 100));

        // let randomYCoord = Math.floor(Math.random() * (innerHeight - 100))

        randomXCoord = Math.floor(Math.random() * 100);

        randomYCoord = Math.floor(Math.random() * 100)

        const upsertChar = await prisma.char.upsert({
            where: {
                name: name
            },
            update: {
                name: name,
                xcoord: randomXCoord,
                ycoord: randomYCoord
            },
            create: {
                name: name,
                xcoord: randomXCoord,
                ycoord: randomYCoord
            },
        })
    })
    const foundChars = await prisma.char.findMany()
    console.log('foundChars', foundChars)
    res.json({ foundChars })
})

app.post('/validate', (req, res) => {
    const { cursorClick, charActual } = req.body;

    function isWithin(cursorClick, charActual) {
        console.log('cursorClick', cursorClick, 'charActual', charActual)
        const distanceX = Math.abs(charActual.clientWidth - cursorClick.clientWidth)
        const distanceY = Math.abs(charActual.clientHeight - cursorClick.clientHeight)
        return (distanceX <= 100 && distanceY <= 100);
    }
    const within = isWithin(cursorClick, charActual);
    console.log('is within', within)
    res.json({ within });

})

app.post('/users', (req, res) => {
    const { name } = req.body;
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