const  express  =  require('express');
const app = express();
const connectDB = require('./startup/db');
const cors = require('cors');

const accounts = require('./routes/accounts');
const auth = require('./routes/auth');

connectDB();

app.use(cors());
app.use(express.json()); 
app.use('/api/auth', auth)
app.use('/api/accounts', accounts)



const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});