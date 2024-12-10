const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const authController = require('./Controllers/auth.controller');

const app = express();

//allows requests from the frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ 
    verify: (req, res, buf) => {
        if (req.method === 'GET') {
            req.body = {};
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "aml-library-secret-Dn$!q%tynv9ji8$9mF",
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AML API' });
});

app.post('/auth/register', authController.registerUser);

require('./Routes/auth.routes')(app);
require('./Routes/books.routes')(app);
require('./Routes/wishList.routes')(app);
require('./Routes/accountant.routes')(app);
require('./Routes/purchaseMan.routes')(app);
require('./Routes/aml-admin.routes')(app);

const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});