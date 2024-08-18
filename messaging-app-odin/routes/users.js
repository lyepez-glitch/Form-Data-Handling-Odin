import express from 'express'
const router = express.Router()

router.get('/signUp', (req, res) => {
    res.json({ msg: "sign up route" })
})


export default router;