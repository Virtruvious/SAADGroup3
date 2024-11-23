const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: "elanco-activity-monitor",
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AML API' });
});

require('./Routes/auth.routes')(app);
require('./Routes/books.routes')(app);

const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});