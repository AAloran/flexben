const express = require('express');
const userRouter = require('./router/user.router');
const employeeRouter = require('./router/employee.router');
const hrRouter = require('./router/hr.router');
const errorHelper = require('./error')

require('dotenv').config;

let app = express();

app.use(express.json());
app.use('/api/', userRouter);
app.use('/api/', employeeRouter);
app.use('/api/', hrRouter);

app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.errorHandler);
app.use(errorHelper.clientErrorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`***  Server Running On Port ${PORT}  ***`)
});