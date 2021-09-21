const  express  =  require('express');
const app = express();
const connectDB = require('./startup/db');
const cors = require('cors');

const accounts = require('./routes/accounts');

connectDB();

app.use(cors());
app.use(express.json()); 
app.use('/api/accounts', accounts)



const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});