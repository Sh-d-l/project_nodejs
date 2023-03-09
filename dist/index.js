"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const date_fns_1 = require("date-fns");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
const videos = [];
const arrResolutionVideo = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
const resCheckErrPost = [];
const resCheckErrPut = [];
let count = 0;
const err = {
    message: "string",
    field: "string",
};
/*----------------------------POST-----------------------------------*/
app.post('/videos', (req, res) => {
    const time = new Date();
    let filterPostResolutions = req.body.availableResolutions.filter((p) => arrResolutionVideo.includes(p));
    if ((typeof req.body.title == "string" && typeof req.body.title !== null) && (typeof req.body.author == "string"
        && typeof req.body.author !== null)
        && (req.body.title).length <= 40 && (req.body.author).length <= 20
        && filterPostResolutions.length == (req.body.availableResolutions).length) {
        const newVideo = {
            id: +time,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: time.toISOString(),
            publicationDate: (0, date_fns_1.addDays)(time, +1).toISOString(),
            availableResolutions: req.body.availableResolutions
        };
        videos.push(newVideo);
        if (videos.length > 0) {
            res.status(201).send(newVideo);
        }
        else {
            res.sendStatus(404);
        }
    }
    if (typeof req.body.title !== 'string' || (typeof req.body.title == 'string' && (req.body.title).length > 40)) {
        err.message = "title must be a string or length > 20 or null ";
        err.field = "title";
        resCheckErrPost.push(err);
    }
    if (typeof req.body.author !== 'string' || (typeof req.body.author == 'string' && (req.body.author).length > 20)) {
        err.message = "author must be a string or length > 20 or null ";
        err.field = "author";
        resCheckErrPost.push(err);
    }
    if (filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.message = "incorrect resolution";
        err.field = "availableResolutions";
        resCheckErrPost.push(err);
    }
    if (resCheckErrPost.length > 0) {
        res.status(400).send({ "errorsMessages": resCheckErrPost });
        return;
    }
});
/*------------------------------GET ALL VIDEOS-----------------------------*/
app.get('/videos', (req, res) => {
    res.status(200).send(videos);
});
/*------------------------------GET VIDEO BY ID-----------------------------------------*/
app.get('/videos/:id', (req, res) => {
    let videoId = videos.find(p => p.id === +req.params.id);
    if (videoId) {
        res.status(200).send(videoId);
    }
    else {
        res.sendStatus(404);
        return;
    }
});
/*------------------------------PUT----------------------------------------------------*/
app.put('/videos/:id', (req, res) => {
    let filterResolutions = req.body.availableResolutions.filter((el) => arrResolutionVideo.includes(el));
    if (typeof req.body.title !== "string" || (req.body.title).length > 40) {
        err.message = "title must be a string or length < 40";
        err.field = "title";
        resCheckErrPut.push(err);
    }
    if (typeof req.body.author !== "string" || (req.body.author).length > 20) {
        err.message = "author must be a string or length < 20";
        err.field = "author";
        resCheckErrPut.push(err);
    }
    if (filterResolutions.length !== (req.body.availableResolutions).length) {
        err.message = "incorrect resolutions";
        err.field = "availableResolutions";
        resCheckErrPut.push(err);
    }
    if (typeof req.body.minAgeRestriction !== "number" || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
        err.message = "minAgeRestriction must have a number type and 1 < minAgeRestriction < 18";
        err.field = "minAgeRestriction";
        resCheckErrPut.push(err);
    }
    if (typeof req.body.publicationDate !== "string") {
        err.message = "publicationDate must have a string";
        err.field = "publicationDate";
        resCheckErrPut.push(err);
    }
    if (resCheckErrPut.length > 0) {
        res.status(400).send({ "errorsMessages": resCheckErrPut });
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
    /*
            for (let obj of videos) {
                if (obj.id === +req.params.id) {
                    obj.title = req.body.title;
                    obj.author = req.body.author;
                    obj.availableResolutions = req.body.availableResolutions;
                    obj.canBeDownloaded = req.body.canBeDownloaded;
                    obj.minAgeRestriction = req.body.minAgeRestriction;
                    obj.publicationDate = new Date().toISOString();
    
                }
            }
            res.sendStatus(204)
            return;*/
});
/*-----------------------------DELETE ID-------------------------------------------------*/
app.delete('/videos/:id', (req, res) => {
    let deleteId = videos.filter((elem) => elem.id === +req.params.id);
    if (deleteId.length > 0) {
        videos.splice(videos.indexOf(deleteId[0]), 1);
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
/*-----------------------------DELETE ALL------------------------------------------------*/
app.delete('/testing/all-data', (req, res) => {
    videos.splice(0, videos.length);
    if (videos.length === 0) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(405);
    }
});
/*----------------------------------------------------------------------------------------*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
