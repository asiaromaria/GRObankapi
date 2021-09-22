const  express  =  require('express');
const app = express();
const connectDB = require('./startup/db');
const cors = require('cors');

const accounts = require('./routes/accounts');
const auth = require('./routes/auth');
const balances = require('./routes/balances');

connectDB();

app.use(cors());
app.use(express.json()); 
app.use('/api/auth', auth)
app.use('/api/accounts', accounts)
app.use('/api/balance', balances)



const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});