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

describe('Facebook Profile', () => {
  it('should get data from facebook profile', () => {
    chai.request(app)
      .get('/facebook/gustafpahlevi')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.have.property('experiences').to.be.an('array')
        expect(res).to.have.property('name').to.be.a('string')
        expect(res).to.have.property('favorites').to.be.an('array')
        expect(res).to.have.property('photo_profile').to.be.a('string')
      })
  })
})
