let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./app');
let should = chai.should();

chai.use(chaiHttp);

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

const person4 = {
  username: 'Ina',
  password: 'Abc1234',
};

let token;
//Register
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
        token = res.body.token;
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

const wrongID = '239579c7087237149ef01a34';
const post = {
  content: 'trial',
};

let post_id;
describe('/POST createPost', () => {
  it('it should create a post', (done) => {
    chai
      .request(server)
      .post('/createPost')
      .auth(token, { type: 'bearer' })
      .send(post)
      .end((err, res) => {
        res.body.should.be.a('object');
        post_id = res.body._id;
        done();
      });
  });
});

describe('/GET postId', () => {
  it('it should load a post', (done) => {
    chai
      .request(server)
      .get('/' + post_id)
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('content').eql('trial');
        done();
      });
  });
  it('it should not lead a post since the id does not exist', (done) => {
    chai
      .request(server)
      .get('/' + wrongID)
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Post does not exist');
        done();
      });
  });
});

describe('/Put postId', () => {
  it('it should update a post', (done) => {
    const update = { newContent: 'updated' };
    chai
      .request(server)
      .put('/' + post_id)
      .auth(token, { type: 'bearer' })
      .send(update)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('content').eql('updated');
        done();
      });
  });
  it('it should not update a post since the id does not exist', (done) => {
    const update = { newContent: 'updated' };
    chai
      .request(server)
      .put('/' + wrongID)
      .auth(token, { type: 'bearer' })
      .send(update)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Post does not exist');
        done();
      });
  });
});
describe('/Delete postId', () => {
  it('it should delete a post', (done) => {
    chai
      .request(server)
      .delete('/' + post_id)
      .auth(token, { type: 'bearer' })
      .send()
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('delete successful');
        done();
      });
  });
  it('it should not delete a post since the id does not exist', (done) => {
    chai
      .request(server)
      .delete('/' + wrongID)
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Post does not exist');
        done();
      });
  });
});
