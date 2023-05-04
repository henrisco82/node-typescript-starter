import { expect } from 'chai';
import app  from '../src/app';
import 'mocha'

describe('App', () => {
  let server: any;
  before((done) => {
    server = app.listen(9000, done);
  });

  after((done) => {
    server.close(done);
  });
  
});