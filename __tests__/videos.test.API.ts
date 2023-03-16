import request from 'supertest'
import {app} from 'c:/proj/src/'
import {HTTP_STATUS} from "../src";
describe ('/videos', () => {
    beforeAll(async() => {
        await request (app)
            .delete("/videos")
    } )
    const video_POST = {
        "id": 123,
        "title": "123",
        "author": "null",
        "canBeDownloaded": true,
        "minAgeRestriction": 15,
        "createdAt": "2023-03-14T13:32:54.407Z",
        "publicationDate": "2023-03-14T13:32:54.407Z",
        "availableResolutions": [
            "P144"
        ]
    }
    it("should post", async () =>
    await request(app)
        .post('/videos')
        .send(video_POST)
        .expect(HTTP_STATUS.CREATED_201))

    it ("should delete videos", async () =>
    await request(app)
        .delete('/videos')
        .expect(HTTP_STATUS.OK_200))
        /*it('should create video', async() =>
            await request(app)
                .post('/videos')
                .send(video_POST)
                .expect(HTTP_STATUS.CREATED_201)
        )
        it("Should return all videos", async () => {
            const response = await request(app).get("/videos");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        /*it("should return 404 no video added", async () =>
            await request(app)
                .get('/videos/-100').expect(HTTP_STATUS.NOT_FOUND_404, []))*/
       /* it("should NOT return video with incorrect id", async () => {
            const response = await request(app).get("/videos/-100");
            expect(response.status).toBe(404);
        });*/






    //beforeAll("should delete video")
    /*it('should return array empty', async () => {
       await request (app)
           .get('/videos')
           .expect(200,[])
    })
    it("should return 404 for not existing video", async () => {
        await request(app)
            .get('/videos/4646')
            .expect(404)
    })
    it("should not create video ", async () => {
        await request(app)
            .post ('/videos')
            .send ({
                "title": "string",
                "author": "string",
                "availableResolutions": [
                    "P144"
                ]
            })
            .expect()
    })*/
})