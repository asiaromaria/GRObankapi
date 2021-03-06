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


router.get('/:userId', auth, async (req, res) => {
    try {
        const users = await User.findById();
        const token = user.generateAuthToken();
        return res.send(users);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.post('/', auth, async (req, res) => {
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
            // paymentsToGro: [],
            // creditScoreHistory: [],
            // paymentHistory: req.body.paymentHistory,
            // accountsOwed: req.body.accountsOwed,
            // lengthOfCredit: req.body.lengthOfCredit,
            // creditCards: req.body.creditCards,
            // loans: req.body.loans,
            // retailCards: req.body.retailCards,
            // mortgageLoans: req.body.mortgageLoans,
            // recentCreditLines: req.body.recentCreditLines,
            dob: req.body.dob,
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

router.put('/', auth, async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error);

        const user = await User(req.params.user);
        if (!user) return res.status(400).send(`The user with id "${req.params.user}" does not exist.`);

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

router.delete('/:userId', auth, async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
        await user.delete();
        const token = user.generateAuthToken();
        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({ _id: user._id, name: user.name, email: user.email });
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
 
    }
})


//savingsPlan

router.get('/savingsplan', [auth], async (req, res) => {
    try {
        const savings = await SavingsPlan.find();
        return res.send(savings);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    };
})


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
        additonalAmount: req.body.additonalAmount,
        paymentType: req.body.paymentType,
        });

        user.savingsPlanSettings = savings;
        await user.save();
        return res.status(201).send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
      }
});
    
    // Take the user we got back from the database and set that user's savingsPlanSettings equal to the savings plan
        // that was sent in the body
    // Save that user object so it updates its savingsPlanSettings property in the database
    // Return 200 status code as well as the user


router.put('/savingsPlan/:savingsId', [auth], async (req, res) => {
    try{
        const { error } = validateSave(req.body);
        if (error) return res.status(401).send(error.details[0].message)


        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
        };
        
        
        const savings = await User.findByIdAndUpdate(
            req.params.savingsId,
            {
                amount: req.body.amount,
                monthDayOfDeposit: req.body.monthDayOfDeposit,
                additonalAmount: req.body.additonalAmount,
                paymentType: req.body.paymentType
            },
            { new: true }
        );
        await user.save();
        return res.status(201).send(user);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
      }
});

module.exports = router;