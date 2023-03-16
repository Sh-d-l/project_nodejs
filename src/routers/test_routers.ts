import {Router} from "express";
export const testsRouter = Router({})
import {videos} from "./videos-router";

testsRouter.delete("/", (req,res) => {
    videos.splice(0,videos.length);
    if(videos.length === 0) {
        res.sendStatus(204)
    }
    else {
        res.sendStatus(405)
    }
})