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
