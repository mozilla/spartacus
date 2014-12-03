define([
  'jquery',
  'models/session',
  'provider',
  'utils'
], function($, SessionModel, provider, utils) {

  var assert = chai.assert;

  suite('Provider object tests', function(){

    setup(function() {
      window.app = {};
      window.app.session = new SessionModel();
      window.app.session.set('logged_in_user', 'foo@bar.com');

      var mockStorage = function() {
        this.store = {};
        this.getItem = function(key) {
          return this.store[key];
        };
        this.setItem = function(key, value) {
          return this.store[key] = value;
        };
        this.clear = function() {
          this.store = {};
        };
      };
      this.mockStorage = new mockStorage();
      this.oldMpp = utils.mozPaymentProvider;
    });

    teardown(function(){
      utils.mozPaymentProvider = this.oldMpp;
      this.mockStorage.clear();
    });

    test('Check basic provider instance.', function(){
      var genericProvider = provider.providerFactory();
      assert.equal(genericProvider instanceof provider.Provider, true);
    });

    test('Check Bango provider instance.', function(){
      var bangoProvider = provider.providerFactory('bango');
      assert.equal(bangoProvider instanceof provider.Bango, true);
    });

    test('Check basic provider dep injection', function(){
      var genericProvider = provider.providerFactory(null, {storage: 'whatever'});
      assert.equal(genericProvider.storage, 'whatever');
    });

    test('Check Bango provider dep injection', function(){
      var bangoProvider = provider.providerFactory('bango', {storage: 'whatever-bango'});
      assert.equal(bangoProvider.storage, 'whatever-bango');
    });

    test('Check generic provider user changes', function(done){
      this.mockStorage.setItem('spa-user', 'whatever');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll().always(function() {
        assert.ok(spy.calledOnce);
        done();
      });
    });

    test('Check Bango provider user changes', function(done){
      this.mockStorage.setItem('spa-user', 'whatever-bango');
      var prov = provider.providerFactory('bango', {storage: this.mockStorage});
      var stub = sinon.stub(prov, 'logout', function() {
        return $.Deferred().resolve();
      });
      prov.prepareAll().always(function() {
        assert.ok(stub.calledOnce);
        done();
      });
    });

    test("Check spa-user doesn't change", function(done){
      this.mockStorage.setItem('spa-user', 'foo@bar.com');
      var prov = provider.providerFactory('bango', {storage: this.mockStorage});
      var stub = sinon.stub(prov, 'logout', function() {
        return $.Deferred().resolve();
      });
      prov.prepareAll().always(function() {
        assert.equal(stub.callCount, 0);
        done();
      });
    });

    test("Check spa-user doesn't change but logout required", function(done){
      this.mockStorage.setItem('spa-user', 'foo@bar.com');
      this.mockStorage.setItem('needs-provider-logout', true);
      var prov = provider.providerFactory('bango', {storage: this.mockStorage});
      var stub = sinon.stub(prov, 'logout', function() {
        return $.Deferred().resolve();
      });
      prov.prepareAll().always(function() {
        assert.equal(stub.callCount, 1);
        // Now check on the second time we prepare with the same user
        // we don't call the provider logout - e.g. it stays as 1.
        prov.prepareAll().always(function() {
          assert.equal(stub.callCount, 1);
          done();
        });
      });
    });

    test('Check iccKey hash no changes 1.4+', function(done){
      utils.mozPaymentProvider = {
        iccInfo: {
          0: {
            iccId: '1234',
            mcc: '222',
            mnc: '333',
            dataPrimary: false
          },
          1: {
            iccId: '5678',
            mcc: 'aa',
            mnc: '555',
            dataPrimary: true
          }
        }
      };
      this.mockStorage.setItem('spa-user', 'foo@bar.com');
      this.mockStorage.setItem('spa-last-icc', '1234');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll().always(function() {
        assert.equal(spy.callCount, 0);
        done();
      });
    });

    test('Check iccKey hash changes 1.4+', function(done){
      utils.mozPaymentProvider = {
        iccInfo: {
          0: {
            iccId: '1234',
            mcc: '222',
            mnc: '333',
            dataPrimary: false
          },
          1: {
            iccId: '5678',
            mcc: 'aa',
            mnc: '555',
            dataPrimary: true
          }
        }
      };
      this.mockStorage.setItem('spa-user', 'foo@bar.com');
      this.mockStorage.setItem('spa-last-icc', '432764');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll().always(function() {
        assert.ok(spy.calledOnce);
        done();
      });
    });

    test('Check iccKey hash no changes < 1.4', function(done){
      utils.mozPaymentProvider.iccIds = ['1234','4562'];
      this.mockStorage.setItem('spa-user', 'foo@bar.com');
      this.mockStorage.setItem('spa-last-icc', '1234;4562');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll().always(function() {
        assert.equal(spy.callCount, 0);
        done();
      });
    });

    test('Check iccKey hash changes < 1.4', function(done){
      utils.mozPaymentProvider.iccIds = ['1234','4562'];
      this.mockStorage.setItem('spa-user', 'foo@bar.com');
      this.mockStorage.setItem('spa-last-icc', '432;764');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll().always(function() {
        assert.ok(spy.calledOnce);
        done();
      });
    });

  });

});
