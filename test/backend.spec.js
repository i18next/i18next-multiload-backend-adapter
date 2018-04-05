import Backend from '../src/';
import Interpolator from 'i18next/dist/commonjs/Interpolator';
import MockBackend from './MockBackend';


describe('chained backend', () => {

  describe('basic read', () => {
    let backend;

    before(() => {
      backend = new Backend({
        interpolator: new Interpolator()
      }, {
        backend: MockBackend,
        backendOption: {}
      });
    });

    it('should load data', (done) => {
      let todo = 2;

      const doneOne = () => {
        todo--;
        if (!todo) done();
      }

      backend.read('en', 'test', function(err, data) {
        expect(data).to.eql({ foo: 'bar' });
      });

      backend.read('de', 'test2', function(err, data) {
        expect(data).to.eql({ foo: 'bar' });
        done();
      });
    });

    it('should save missing', () => {
      backend.create('en', 'test', 'key1', 'test1');
      expect(backend.backend.added['en.test.key1']).to.eql('test1');
    });

  });


  // describe('with loadPath function', () => {
  //   let backend;
  //   let loadPathSpy = sinon.spy(function(languages, namespaces) {
  //     return 'http://localhost:9876/locales/' + languages[0] + '/' + namespaces[0] + '.json';
  //   });
  //
  //   before(() => {
  //     backend = new XHR({
  //       interpolator: new Interpolator()
  //     }, {
  //       loadPath: loadPathSpy
  //     });
  //   });
  //
  //   describe('#read', () => {
  //
  //     it('should load data', (done) => {
  //       backend.read('en', 'test', function(err, data) {
  //         expect(err).to.be.not.ok;
  //         expect(loadPathSpy.calledWith(['en'], ['test'])).to.be.ok;
  //         expect(data).to.eql({key: 'passing'});
  //         done();
  //       });
  //     });
  //
  //   });
  //
  // });

});
