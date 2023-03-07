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
let resCheckErr = [];
const err = {
    "errorsMessages": [
        {
            "message": "string",
            "field": "string"
        }
    ]
};
/*----------------------------POST-----------------------------------*/
app.post('/videos', (req, res) => {
    const time = new Date();
    let filterPostResolutions = req.body.availableResolutions.filter((p) => arrResolutionVideo.includes(p));
    if (typeof req.body.title == "string" && typeof req.body.author == "string"
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
        res.status(201).send(newVideo);
    }
    if (typeof req.body.title !== 'string' || (req.body.title).length > 40) {
        err.errorsMessages[0].message = "title must be a string or length > 40 ch.";
        err.errorsMessages[0].field = "title";
        resCheckErr.push(err);
    }
    /*if (typeof req.body.title !== 'string' && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "title must be a string and incorrect resolution"
        err.errorsMessages[0].field = "title & availableResolutions"
        resCheckErr.push(err)
    }*/
    if (typeof req.body.author !== 'string' || (req.body.author).length > 20) {
        err.errorsMessages[0].message = "author must be a string or length > 20 ";
        err.errorsMessages[0].field = "author ";
        resCheckErr.push(err);
    }
    if (filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "incorrect resolution";
        err.errorsMessages[0].field = "availableResolutions";
        resCheckErr.push(err);
    }
    /*if (typeof req.body.author !== 'string' && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "author must be a string and incorrect resolution"
        err.errorsMessages[0].field = "author & availableResolutions"
        resCheckErr.push(err)
    }
    if (typeof req.body.title !== 'string' && typeof req.body.author !== 'string') {
        err.errorsMessages[0].message = "title & author must be a string "
        err.errorsMessages[0].field = "title & author"
        resCheckErr.push(err)
    }
    if (typeof req.body.title !== 'string' && typeof req.body.author !== 'string' && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "title & author must be a string and incorrect resolution"
        err.errorsMessages[0].field = "title & author & availableResolutions"
        resCheckErr.push(err)
    }
    if ((req.body.title).length > 40 && (req.body.author).length <= 20 && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "more than 40 characters in title"
        err.errorsMessages[0].field = "title"
        resCheckErr.push(err)
    }
    if ((req.body.title).length <= 40 && (req.body.author).length > 20 && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "more than 20 characters in author"
        err.errorsMessages[0].field = "author"
        resCheckErr.push(err)
    }
    if ((req.body.title).length <= 40 && (req.body.author).length <= 20 && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "incorrect resolution"
        err.errorsMessages[0].field = "availableResolutions"
        resCheckErr.push(err)
    }
    if ((req.body.title).length > 40 && (req.body.author).length >20 && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "title > 40 characters and author > 20 characters"
        err.errorsMessages[0].field = "title & author"
        resCheckErr.push(err)
    }
    if ((req.body.title).length > 40 && (req.body.author).length <= 20 && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "title > 40 characters and incorrect resolution"
        err.errorsMessages[0].field = "title & availableResolutions"
        resCheckErr.push(err)
    }
    if ((req.body.title).length <= 40 && (req.body.author).length > 20 && filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.errorsMessages[0].message = "author > 20 characters and incorrect resolution"
        err.errorsMessages[0].field = "author & availableResolutions"
        resCheckErr.push(err)
    }*/
    if (resCheckErr.length > 0) {
        res.status(404).send(resCheckErr);
        resCheckErr = [];
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
    if (typeof req.body.title === "string" && typeof req.body.author === "string"
        && (req.body.title).length <= 40 && (req.body.author).length <= 20 && filterResolutions.length === (req.body.availableResolutions).length &&
        req.body.canBeDownloaded == true && typeof req.body.minAgeRestriction !== "number" && req.body.minAgeRestriction >= 1 && req.body.minAgeRestriction <= 18 && typeof req.body.publicationDate !== "string") {
        for (let obj of videos) {
            if (obj.id === +req.params.id) {
                obj.title = req.body.title,
                    obj.author = req.body.author,
                    obj.availableResolutions = req.body.availableResolutions,
                    obj.canBeDownloaded = true,
                    obj.minAgeRestriction = 18,
                    obj.publicationDate = new Date().toISOString();
            }
            else {
                res.sendStatus(404);
                return;
            }
        }
        res.status(204).send(videos);
        return;
    }
    if (typeof req.body.title !== "string" || (req.body.title).length > 40) {
        err.errorsMessages[0].message = "title must be a string or length < 40";
        err.errorsMessages[0].field = "title";
        resCheckErr.push(err);
    }
    if (typeof req.body.author === "string" || (req.body.author).length > 20) {
        err.errorsMessages[0].message = "author must be a string or length < 20";
        err.errorsMessages[0].field = "author";
        resCheckErr.push(err);
    }
    if (filterResolutions.length !== (req.body.availableResolutions).length) {
        err.errorsMessages[0].message = "incorrect resolutions";
        err.errorsMessages[0].field = "availableResolutions";
        resCheckErr.push(err);
    }
    if (typeof req.body.minAgeRestriction !== "number" || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
        err.errorsMessages[0].message = "minAgeRestriction must have a number type and 1 < minAgeRestriction < 18";
        err.errorsMessages[0].field = "minAgeRestriction";
        resCheckErr.push(err);
    }
    if (typeof req.body.publicationDate !== "string") {
        err.errorsMessages[0].message = "publicationDate must have a string";
        err.errorsMessages[0].field = "publicationDate";
        resCheckErr.push(err);
    }
    if (resCheckErr.length > 0) {
        res.status(400).send(resCheckErr);
        return;
    }
});
/*-----------------------------DELETE--------------------------------------------------*/
app.delete('/videos/:id', (req, res) => {
    let deleteId = videos.filter((p, i) => p.id === +req.params.id);
    if (deleteId) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
/*---------------------------------------------------------------------------------------*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});