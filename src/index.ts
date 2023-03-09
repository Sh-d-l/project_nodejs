import express from 'express';
import {addDays} from 'date-fns';
const app = express()
app.use(express.json())
const port = 3000

const videos:VideoType[] = [];
type VideoType = {
        id: number,
        title: string,
        author: string,
        canBeDownloaded: boolean,
        minAgeRestriction: null | number,
        createdAt: string,
        publicationDate: string,
        availableResolutions: string[]
}
const arrResolutionVideo = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
const resCheckErr:Array<errType> = [];

type errType =
        {
            message: string,
            field: string,
        }

let err:errType =
        {
            message: "string",
            field: "string",
        };

/*----------------------------POST-----------------------------------*/

app.post('/videos', (req,res) => {
    const time = new Date();

    let filterPostResolutions: string[] = req.body.availableResolutions.filter((p:string) => arrResolutionVideo.includes(p))

    if ((typeof req.body.title == "string" && typeof req.body.title !== null) && (typeof req.body.author == "string"
        && typeof req.body.author !== null)
        && (req.body.title).length <= 40 && (req.body.author).length <= 20
        && filterPostResolutions.length == (req.body.availableResolutions).length) {
        const newVideo:VideoType = {
            id: +time,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: time.toISOString(),
            publicationDate:addDays(time,+1).toISOString(),
            availableResolutions: req.body.availableResolutions
        }
        videos.push(newVideo)
        if(videos.length > 0) {
            res.status(201).send(newVideo)
        }
        else {
            res.sendStatus(404)
        }
    }

    if(typeof req.body.title !== 'string' || (typeof req.body.title == 'string' && (req.body.title).length > 40)) {
        err.message = "title must be a string or length > 20 or null ";
        err.field = "title";
        resCheckErr.push(err);
    }
    if (typeof req.body.author !== 'string' || (typeof req.body.author == 'string' && (req.body.author).length > 20)) {
        err.message = "author must be a string or length > 20 or null ";
        err.field = "author";
        resCheckErr.push(err);
    }
    if (filterPostResolutions.length !== req.body.availableResolutions.length) {
        err.message = "incorrect resolution";
        err.field = "availableResolutions";
        resCheckErr.push(err);
    }
    if (resCheckErr.length > 0) {
        res.status(400).send({"errorsMessages": resCheckErr})
        return;
    }
})

/*------------------------------GET ALL VIDEOS-----------------------------*/

app.get ('/videos', (req, res) => {
    res.status(200).send(videos)
})

/*------------------------------GET VIDEO BY ID-----------------------------------------*/

app.get ('/videos/:id', (req,res) => {
    let videoId = videos.find(p => p.id === +req.params.id)
    if(videoId) {
        res.status(200).send(videoId)
    }
    else {
        res.sendStatus(404)
        return;
    }
})

/*------------------------------PUT----------------------------------------------------*/

app.put ('/videos/:id', (req,res) => {
    let filterResolutions = req.body.availableResolutions.filter((el:string) =>  arrResolutionVideo.includes(el))

    if (typeof req.body.title === "string" && typeof req.body.author === "string"
        && (req.body.title).length <= 40 && (req.body.author).length <= 20 && filterResolutions.length === (req.body.availableResolutions).length &&
        req.body.canBeDownloaded == true && typeof req.body.minAgeRestriction !== "number" && req.body.minAgeRestriction >= 1 && req.body.minAgeRestriction <= 18 && typeof
        req.body.publicationDate !== "string") {

        for (let obj of videos) {
            if (obj.id === +req.params.id) {
                obj.title = req.body.title;
                obj.author = req.body.author;
                obj.availableResolutions = req.body.availableResolutions;
                obj.canBeDownloaded = req.body.canBeDownloaded;
                obj.minAgeRestriction = req.body.minAgeRestriction;
                obj.publicationDate = new Date().toISOString();
                res.sendStatus(204)
                return;
            }
        }
    }

    if(typeof req.body.title !== "string" || (req.body.title).length >  40) {
        err.message = "title must be a string or length < 40"
        err.field = "title"
        resCheckErr.push(err)
    }
    if (typeof req.body.author !== "string" || (req.body.author).length > 20) {
        err.message = "author must be a string or length < 20"
        err.field = "author"
        resCheckErr.push(err)
    }
    if(filterResolutions.length !== (req.body.availableResolutions).length) {
        err.message = "incorrect resolutions"
        err.field = "availableResolutions"
        resCheckErr.push(err)
    }
    if (req.body.canBeDownloaded !== true) {
        err.message = "canBeDownloaded not true"
        err.field = "canBeDownloaded"
        resCheckErr.push(err)
    }
    if(typeof req.body.minAgeRestriction !== "number" || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
        err.message = "minAgeRestriction must have a number type and 1 < minAgeRestriction < 18"
        err.field = "minAgeRestriction"
        resCheckErr.push(err)
    }

    if(typeof req.body.publicationDate !== "string")   {
        err.message = "publicationDate must have a string"
        err.field = "publicationDate"
        resCheckErr.push(err)

    }
    if(resCheckErr.length > 0) {
        res.status(400).send({"errorsMessages":resCheckErr})
        return;
    }
    else {
        res.sendStatus(404)
        return;
    }
})

/*-----------------------------DELETE ID-------------------------------------------------*/

app.delete('/videos/:id', (req, res) => {
    let deleteId = videos.filter((elem) => elem.id === +req.params.id);
    if(deleteId.length > 0) {
        videos.splice(videos.indexOf(deleteId[0]),1)
        res.sendStatus(204)
        return;
    }
    else {
        res.sendStatus(404)
        return;
    }
})

/*-----------------------------DELETE ALL------------------------------------------------*/

app.delete('/testing/all-data', (req,res) => {
    videos.splice(0,videos.length);
    if(videos.length === 0) {
        res.sendStatus(204)
    }
    else {
        res.sendStatus(405)
    }

})

/*----------------------------------------------------------------------------------------*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})