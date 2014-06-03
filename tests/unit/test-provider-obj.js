define(['jquery', 'provider', 'utils'], function($, provider, utils) {

  var assert = chai.assert;

  suite('Provider object tests', function(){

    setup(function() {
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

    test('Check generic provider user hash changes', function(done){
      this.mockStorage.setItem('spa-user-hash', 'whatever');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll('mc-hammer').always(function() {
        assert.ok(spy.calledOnce);
        done();
      });
    });

    test('Check Bango provider user hash changes', function(done){
      this.mockStorage.setItem('spa-user-hash', 'whatever-bango');
      var prov = provider.providerFactory('bango', {storage: this.mockStorage});
      var stub = sinon.stub(prov, 'logout', function() {
        return $.Deferred().resolve();
      });
      prov.prepareAll('mc-hammer-bango').always(function() {
        assert.ok(stub.calledOnce);
        done();
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
      this.mockStorage.setItem('spa-user-hash', 'humpty-dumpty');
      this.mockStorage.setItem('spa-last-icc', '1234');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll('humpty-dumpty').always(function() {
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
      this.mockStorage.setItem('spa-user-hash', 'humpty-dumpty');
      this.mockStorage.setItem('spa-last-icc', '432764');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll('humpty-dumpty').always(function() {
        assert.ok(spy.calledOnce);
        done();
      });
    });

    test('Check iccKey hash no changes < 1.4', function(done){
      utils.mozPaymentProvider.iccIds = ['1234','4562'];
      this.mockStorage.setItem('spa-user-hash', 'humpty-dumpty');
      this.mockStorage.setItem('spa-last-icc', '1234;4562');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll('humpty-dumpty').always(function() {
        assert.equal(spy.callCount, 0);
        done();
      });
    });

    test('Check iccKey hash changes < 1.4', function(done){
      utils.mozPaymentProvider.iccIds = ['1234','4562'];
      this.mockStorage.setItem('spa-user-hash', 'humpty-dumpty');
      this.mockStorage.setItem('spa-last-icc', '432;764');
      var prov = provider.providerFactory('', {storage: this.mockStorage});
      var spy = sinon.spy(prov, 'logout');
      prov.prepareAll('humpty-dumpty').always(function() {
        assert.ok(spy.calledOnce);
        done();
      });
    });

  });

});
