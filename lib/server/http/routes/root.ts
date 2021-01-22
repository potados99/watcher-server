import express from 'express';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

export default indexRouter;
