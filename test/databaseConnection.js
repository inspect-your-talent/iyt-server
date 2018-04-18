const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

const mongoose = require('mongoose')
const dbURL = 'mongodb://inspecta-db-user:Cl9EAyHVeuHZpp9c@inspecta-shard-00-00-jfzqf.mongodb.net:27017,inspecta-shard-00-01-jfzqf.mongodb.net:27017,inspecta-shard-00-02-jfzqf.mongodb.net:27017/inspecta-db?ssl=true&replicaSet=inspecta-shard-0&authSource=admin';

chai.use(chaiHttp)

describe('Database connection', () => {
    it('should connected to the database', function () {
        mongoose.connect(dbURL, err => {
            let result = ''
            if (!err){
                result = 'Connected to database';
            } else {
                result = 'Error Connect to database';
            }
            expect(result).to.equal('Connected to database');
        });
    });
});
