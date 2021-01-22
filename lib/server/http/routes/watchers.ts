import express from 'express';
import watcherNodeRepository from "../../../repositories/WatcherNodeRepository";

const watchersRouter = express.Router();

watchersRouter.get('/', (req, res) => {
    const allWatchers = watcherNodeRepository.getAllWatchers();

    res.json(allWatchers);
});

export default watchersRouter;
