const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

chai.use(chaiHttp)

describe('it should run without any problem', () => {
    it('should run without any problem', () => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200)

        })
    })
})

describe('Github Profile', () => {
    it('should data from github profile', () => {
      chai.request(app)
        .get('/github/haidarafif0809')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.have.property('username')
          expect(res.username).to.equal('haidarafif0809')
          expect(res).to.have.property('name')
          expect(res).to.have.property('languages')
          expect(res).to.have.property('repo')
        })
    })
})

describe('Twitter Profile', () => {
  it('should get data from twitter profile', () => {
    chai.request(app)
      .get('/twitter/sitirohimahzha')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.have.property('name')
        expect(res.name).to.equal('Siti Rohimah')
        expect(res).to.have.property('posts')
        expect(res.posts).to.be.an(Array)
        expect(res).to.have.property('tweets')
        expect(res).to.have.property('following')
        expect(res).to.have.property('followers')
        expect(res).to.have.property('likes')
      })
  })
})
