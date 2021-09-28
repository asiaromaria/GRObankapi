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
        paymentType: { type: String, required: true}
    })

    const  userSchema  =  new  mongoose.Schema({ 
        name:  { type: String, required: true, minlength: 5, maxlength: 50 },
        email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
        password: { type: String, required: true, minlength: 5, maxlength: 1024 },
        ssn: {type: String, required: true },
        dob: {type: Date, required: true },
        isAdmin: { type: Boolean, default: false},
        savingsPlanSettings: {type: savingsPlanSchema },
        despositHistory: {type: [depositSchema]},
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
            ssn: Joi.string().min(5).max(50).required(),
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