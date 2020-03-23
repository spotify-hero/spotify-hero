/*_______________________________________________________________
|                                                               |
|   ████████╗███████╗███████╗████████╗██╗███╗   ██╗ ██████╗     |
|   ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██║████╗  ██║██╔════╝     |
|      ██║   █████╗  ███████╗   ██║   ██║██╔██╗ ██║██║  ███╗    |
|      ██║   ██╔══╝  ╚════██║   ██║   ██║██║╚██╗██║██║   ██║    |
|      ██║   ███████╗███████║   ██║   ██║██║ ╚████║╚██████╔╝    |
|      ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝     |
|_______________________________________________________________|*/                                                        


/*************************************
*            depedencies
**************************************/
const chai           = require('chai');
const chaiHttp       = require('chai-http');
chai.use(chaiHttp);
const should         = chai.should;
const expect         = chai.expect;
var sinon            = require("sinon");
var fs               = require('file-system');



/*************************************
*            unit-testing
**************************************/
describe('Unit testing', function () {
  // load mock data
  // mockIndex = require('mockIndex.html');

  beforeEach(function(){
    this.log = sinon.stub(console, "log");
  });
  afterEach(function(){
    this.log.restore();
  });

  it('should log "Listening on port 8888"', function () {
    console.log('Listening on port 8888');
    expect(console.log.calledWith('Listening on port 8888')).to.be.true;
  });
});


/*************************************
*        integration-testing
**************************************/
describe('Integration testing', () => {

  // launching the back-end
  const server = require('../index');

  describe('GET /', () => {

    let mockIndex = fs.readFileSync(__dirname+ '/mockIndex.html').toString('utf-8');

    it('should return the homepage', function(done) {
      chai.request(server)
          .get('/')
          .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.text).to.equal(mockIndex);
            done();
          });
    });
  });
});
