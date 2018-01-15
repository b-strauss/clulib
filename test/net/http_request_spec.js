goog.module('test.clulib.net.http_request');

const env = goog.require('testing.environment');
const http = goog.require('clulib.net.http_request');
const ErrorType = goog.require('goog.net.EventType');

const jsonFile = `${env.basePath}/test-assets/json/dummy.json`;
const jsonString = 'Hello, world!';

exports = function () {
  describe('clulib.net.xhr', () => {
    describe('httpRequest', () => {
      it('should make http requests', async () => {
        const {promise} = http.httpRequest(jsonFile);
        const result = await promise;
        const resultJson = JSON.parse(result.response);

        expect(resultJson['string']).toBe(jsonString);
      });

      it('should fail on invalid urls', async () => {
        const {promise} = http.httpRequest(`${jsonFile}abc`);

        try {
          await promise;
        } catch (error) {
          expect(error.type).toBe(ErrorType.ERROR);
        }
      });

      it('should be cancelable', async () => {
        const {promise, cancel} = http.httpRequest(`${jsonFile}`);

        cancel();

        try {
          await promise;
        } catch (error) {
          expect(error.type).toBe(ErrorType.ABORT);
        }
      });
    });

    describe('httpGetText', () => {
      it('should get text content', async () => {
        const {promise} = http.httpGetText(jsonFile);
        const result = await promise;
        const resultJson = JSON.parse(result.response);

        expect(resultJson['string']).toBe(jsonString);
      });
    });

    describe('httpGetJson', () => {
      it('should get json content', async () => {
        const {promise} = http.httpGetJson(jsonFile);
        const result = await promise;

        expect(result.response['string']).toBe(jsonString);
      });
    });
  });
};
