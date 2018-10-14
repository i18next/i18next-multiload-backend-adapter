import Backend from '../src/';
import Interpolator from 'i18next/dist/commonjs/Interpolator';
import MockBackend from './MockBackend';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

function getBackEnd(options = {}) {
  return new Backend(
    { interpolator: new Interpolator() },
    { ...options, backend: MockBackend, backendOption: {} }
  );
}

describe('chained backend', () => {
  let options;

  beforeEach(() => {
    options = {
      debounceInterval: 0
    };
  });

  it('should save missing', () => {
    const backEnd = getBackEnd(options);

    backEnd.create('en', 'test', 'key1', 'test1');

    expect(backEnd.backend.added['en.test.key1']).to.eql('test1');
  });

  describe('basic read', () => {
    beforeEach(() => {
      options.multiLanguage = true;
    });

    it('should load all the data at once', done => {
      const backEnd = getBackEnd(options);

      const callbackEn1 = sinon.spy();
      const callbackEn2 = sinon.spy();
      const callbackDe1 = sinon.spy();
      const callbackDe2 = sinon.spy();

      backEnd.read('en', 'test', callbackEn1);
      backEnd.read('en', 'test2', callbackEn2);
      backEnd.read('de', 'test2', callbackDe1);
      backEnd.read('de', 'test3', callbackDe2);

      process.nextTick(() => {
        expect(backEnd.backend.calls[0]).to.deep.equal({
          languages: ['en', 'de'],
          namespaces: ['test', 'test2', 'test3']
        });

        done();
      });
    });

    it('should return data', done => {
      const backEnd = getBackEnd(options);

      const callbackEn1 = sinon.spy();
      const callbackEn2 = sinon.spy();
      const callbackDe1 = sinon.spy();
      const callbackDe2 = sinon.spy();

      backEnd.read('en', 'test', callbackEn1);
      backEnd.read('en', 'test2', callbackEn2);
      backEnd.read('de', 'test2', callbackDe1);
      backEnd.read('de', 'test3', callbackDe2);

      process.nextTick(() => {
        callbackEn1.should.have.been.calledWith(null, { foo: 'bar' });
        callbackEn2.should.have.been.calledWith(null, { foo: 'bar' });
        callbackDe1.should.have.been.calledWith(null, { foo: 'bar' });
        callbackDe2.should.have.been.calledWith(null, { foo: 'bar' });

        done();
      });
    });
  });

  describe('read 1 language at a time', () => {
    beforeEach(() => {
      options.multiLanguage = false;
    });

    it('should load namespaces 1 language at a time', done => {
      const backEnd = getBackEnd(options);

      const callbackEn1 = sinon.spy();
      const callbackEn2 = sinon.spy();
      const callbackDe1 = sinon.spy();
      const callbackDe2 = sinon.spy();

      backEnd.read('en', 'test', callbackEn1);
      backEnd.read('en', 'test2', callbackEn2);
      backEnd.read('de', 'test2', callbackDe1);
      backEnd.read('de', 'test3', callbackDe2);

      process.nextTick(() => {
        expect(backEnd.backend.calls[0]).to.deep.equal({
          languages: ['en'],
          namespaces: ['test', 'test2']
        });
        expect(backEnd.backend.calls[1]).to.deep.equal({
          languages: ['de'],
          namespaces: ['test2', 'test3']
        });

        done();
      });
    });

    it('should return data for each language', done => {
      const backEnd = getBackEnd(options);

      const callbackEn1 = sinon.spy();
      const callbackEn2 = sinon.spy();
      const callbackDe1 = sinon.spy();
      const callbackDe2 = sinon.spy();

      backEnd.read('en', 'test', callbackEn1);
      backEnd.read('en', 'test2', callbackEn2);
      backEnd.read('de', 'test2', callbackDe1);
      backEnd.read('de', 'test3', callbackDe2);

      process.nextTick(() => {
        callbackEn1.should.have.been.calledWith(null, { foo: 'bar' });
        callbackEn2.should.have.been.calledWith(null, { foo: 'bar' });
        callbackDe1.should.have.been.calledWith(null, { foo: 'bar' });
        callbackDe2.should.have.been.calledWith(null, { foo: 'bar' });

        done();
      });
    });
  });
});
