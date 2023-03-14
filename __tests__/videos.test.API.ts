import request from 'supertest'
import {app} from 'c:/proj/src/'
describe ('/videos', () => {
    it('test videos', () => {
       request (app)
           .get('/videos')
           .expect(200,[])
    })
})