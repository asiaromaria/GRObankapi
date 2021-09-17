const  express  =  require('express');
const app = express();
const connectDB = require('./startup/db');



connectDB();

app.use(cors())
app.use(express.json()); 




const port = process.env.PORT || 1000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});