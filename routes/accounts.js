const express = require('express');
const router = express.Router();
const { User, validateUser, SavingsPlan, validateSave, Deposit, validateDep, savingsPlanSchema, depositSchema } = require('../models/account');
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
            ssn: req.body.ssn,
            dob: req.body.dob,
            isAdmin: req.body.isAdmin,
            // balance: "$1256.34",
            // transactions: [ 
            //     {
            //         transaction: "Taco Bell",
            //         transAmount: "$8.34",
            //     },
            //     {
            //         transaction: "Spotify",
            //         transAmount: "$9.99", 
            //     },
            //     {
            //         transaction: "Applebees",
            //         transAmount: "$29.35", 
            //     },
            //     {
            //         transaction: "Target",
            //         transAmount: "$47.94", 
            //     }
            // ],
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

//savingsPlan
router.post('/savingsplan', [auth], async (req, res) => {
    try{
        // validate the body to confirm it matches our desired structure for a savings plan
        const { error } = validateSave(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Get the user from the database
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
        }

        const savings = new SavingsPlan({
        amount: req.body.amount,
        monthDayOfDeposit: req.body.monthDayOfDeposit,
        paymentType: req.body.paymentType,
        });

        user.savingsPlanSettings = savings;
        await user.save();
        return res.status(201).send(user);
    return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
      }
});
    
    // Take the user we got back from the database and set that user's savingsPlanSettings equal to the savings plan
        // that was sent in the body
    // Save that user object so it updates its savingsPlanSettings property in the database
    // Return 200 status code as well as the user


// router.put('/savingsPlan', [auth], async (req, res) => {
//     try{
//         const user = await User.findById(req.user._id);
//         if(!user){
//             return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
//         };
//         const savingsIndex = user.savingsPlanSettings.findIndex((savings) => savings._id == req.params.savingsId)
//         if (savingsIndex== -1)
//         return res.status(400).send(`The savings plan with id "${req.params.savingsId}" does not exist.`);
//         const { error } = validateSave(req.body);
//         if (error) return res.status(400).send(error.details[0].message);

//         const savings = await SavingsPlan.findByIdAndUpdate(
//             req.params.savingsId
//         )
//     }
// })

module.exports = router;