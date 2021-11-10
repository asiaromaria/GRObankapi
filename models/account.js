const  mongoose  =  require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const { number } = require('joi');


    const depositSchema = new mongoose.Schema({
        amount: {type: Number, required: true },
        dateOfDeposit: {type: Date, default: Date.now }
    });

    const savingsPlanSchema = new mongoose.Schema({
        amount: {type: Number, required: true },
        monthDayOfDeposit: {type: Number, required: true },
        additonalAmount: {type: Number, required: true },
        paymentType: { type: String, required: true}
    })

    const  userSchema  =  new  mongoose.Schema({ 
        name:  { type: String, required: true, minlength: 5, maxlength: 50 },
        email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
        password: { type: String, required: true, minlength: 5, maxlength: 1024 },
        // paymentsToGro: {type: [], required: false },
        // creditScoreHistory: {type: [{creditScore: Number, date: Date, }], required: false },
        // paymentHistory: {type: Number, required: true },
        // accountsOwed: {type: Number, required: true },
        // lengthOfCredit: {type: Number, required: true },
        // creditCards: {type: Number, required: true },
        // loans: {type: Number, required: true },
        // retailCards: {type: Number, required: true },
        // mortgageLoans: {type: Number, required: true },
        // recentCreditLines: {type: Number, required: true },
        dob: {type: Date, required: true },
        // isAdmin: { type: Boolean, default: false},
        // savingsPlanSettings: {type: savingsPlanSchema },
        // despositHistory: {type: [depositSchema]},
    }); 

    userSchema.methods.generateAuthToken = function () {
        return jwt.sign({ _id: this._id, name: this.name }, config.get('jwtSecret'));
       };
    
    const Deposit = mongoose.model('Deposit', depositSchema);
    const SavingsPlan = mongoose.model('SavingsPlan', savingsPlanSchema);
    const User = mongoose.model('User', userSchema);

    // 


    function validateSave(savings) {
        const schema = Joi.object({
            amount: Joi.number(),
            monthDayOfDeposit: Joi.number(),
            additonalAmount: Joi.number(),
            paymentType: Joi.string().min(5).max(50).required(),
        });
        return schema.validate(savings);
    }

    function validateDep(deposit) {
        const schema = Joi.object({
            amount: Joi.number().min(2).max(10).require(),
            dateOfDeposit: Joi.date().require(),
        });
        return schema.validate(deposit);
    }

    function validateUser(user) {
        const schema = Joi.object({
            name: Joi.string().min(5).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(1024).required(),
            // paymentsToGro: Joi.array(),
            // creditScoreHistory: Joi.array(),
            // paymentHistory: Joi.number(),
            // accountsOwed: Joi.number(),
            // lengthOfCredit: Joi.number(),
            // creditCards: Joi.number(),
            // loans: Joi.number(),
            // retailCards: Joi.number(),
            // mortgageLoans: Joi.number(),
            // recentCreditLines: Joi.number(),
            dob: Joi.date(),
        });
        return schema.validate(user);
    }

exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
exports.Deposit = Deposit;
exports.validateDep = validateDep;
exports.depositSchema = depositSchema;
exports.SavingsPlan = SavingsPlan;
exports.validateSave = validateSave;
exports.savingsPlanSchema = savingsPlanSchema;