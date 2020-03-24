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

  describe('GET all links in html tags <a> or <img>', () => {

    var rootPages = ['/', '/select', '/game', '/spotify'];
    var linksToTest = rootPages;


    // we search all links available in root pages
    before((done) => {

      promises = [];
      rootPages.forEach((link) => {
        promises.push(getHTML(server, link));
      });

      Promise.all(promises)
      .then((results) => {
        
        // get all the html code
        html = results.join(' ');

        // parse it with regex
        const regex = RegExp('(src|href)="([^ ]*)"','ig');
        let result;
        while ((result = regex.exec(html)) !== null) {
          if (result[2] && result[2].charAt(0) === "/" && ! linksToTest.includes(result[2])) {

            // retrieve the link
            linksToTest.push(result[2]);
          }
        }
        done();
      })
      .catch((err) => {
        throw err;
      })
    });


    it('all links should result in HTTP status 200', function(done) {

      // we create a promise for each link to be tested
      promises = [];
      linksToTest.forEach((link) => {
        promises.push(testLink(server, link));
      });

      Promise.all(promises)
      .then((results) => {
        console.log('      '+results.join('\n      '));
        done();
      })
      .catch((err) => {
        throw err;
      })
    });
  });
});


// used in before() to retrieve links from HTML code
const getHTML = function(server, link) {
  return new Promise(function(resolve, reject) {
    chai.request(server)
        .get(link)
        .end((err, res) => {
            resolve(res.text);
        });
  });
}


// actual test
const testLink = function(server, link) {
  return new Promise(function(resolve, reject) {
    chai.request(server)
        .get(link)
        .end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            resolve(link);
        });
  });
}