const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/account');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        return res.send(users);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');
        const salt = await bcrypt.genSalt(10);

            user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
            isAdmin: req.body.isAdmin,
        });
        await user.save();
        const token = user.generateAuthToken();
        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({ _id: user._id, name: user.name, email: user.email });
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:userId', auth, async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error);

        const user = await User.findByIdAndUpdate(req.params.userId);
        if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        await user.save();
        const token = user.generateAuthToken();
        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({ _id: user._id, name: user.name, email: user.email });
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// router.delete('/:userId', async, (req, res) => {
//     try {
//         const user = await User.findByIdAndRemove(req.params.userId);
//         if (!user) return res.status(400).send(`The user with id "${req.params.userId}" could not be found.`);
//         await user.save();
//         return res.send(user);
//     }   catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`);
//     }
// });

module.exports = router;