let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./app');
let should = chai.should();

chai.use(chaiHttp);

//Register
const person = {
  username: 'lxy',
  password: 'Abc123',
};
const person2 = {
  username: 'lxy2',
  password: 'Abc123',
};
const person3 = {
  username: 'lxy',
  password: 'Abc1234',
};

describe('/POST register', () => {
  it('it should register successfully when the credentials are valid', (done) => {
    chai
      .request(server)
      .post('/register')
      .send(person)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('it should not register a user with duplicate username', (done) => {
    chai
      .request(server)
      .post('/register')
      .send(person)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Username already exists');
        done();
      });
  });
});

describe('/POST login', () => {
  it('it should login successfully when the credentials are correct', (done) => {
    chai
      .request(server)
      .post('/login')
      .send(person)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Log in Success');
        done();
      });
  });
  it('it should not login a user with a wrong password', (done) => {
    chai
      .request(server)
      .post('/login')
      .send(person3)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Incorrect Password/Username');
        done();
      });
  });
  it('it should not login a user with a not registered username', (done) => {
    chai
      .request(server)
      .post('/login')
      .send(person2)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Incorrect Password/Username');
        done();
      });
  });
});
