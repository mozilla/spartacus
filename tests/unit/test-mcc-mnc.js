define(['models/transaction', 'utils'], function(TransactionModel, utils) {

  var assert = chai.assert;

  suite('MCC/MNC extraction', function(){

    setup(function(){
      this.tx = new TransactionModel();
      this.oldMpp = utils.mozPaymentProvider;
    });

    teardown(function(){
      utils.mozPaymentProvider = this.oldMpp;
    });

    test('Check mcc/mnc extraction pre 1.4', function(){
      utils.mozPaymentProvider = {mcc: ['123'], mnc: ['321']};
      var networkCodes = this.tx.getNetworkCodes();
      assert.equal(networkCodes.mcc, '123');
      assert.equal(networkCodes.mnc, '321');
    });

    test('Check invalid extraction pre 1.4', function(){
      utils.mozPaymentProvider = { mcc: ['aaa'], mnc: ['321']};
      assert.deepEqual(this.tx.getNetworkCodes(), {});
    });

    test('Check mcc/mnc extraction multi-sim (1.4+)', function(){
      utils.mozPaymentProvider = {
        iccInfo: {
          serviceId1: {
            iccId: '1234',
            mcc: '222',
            mnc: '333',
            dataPrimary: false
          },
          serviceIdN: {
            iccId: '5678',
            mcc: '444',
            mnc: '555',
            dataPrimary: true
          }
        }
      };
      assert.deepEqual(this.tx.getNetworkCodes(), {mcc: '444', mnc: '555'});
    });

    test('Check mcc/mnc extraction failure multi-sim (1.4+)', function(){
      utils.mozPaymentProvider = {
        iccInfo: {
          serviceId1: {
            iccId: '1234',
            mcc: '222',
            mnc: '333',
            dataPrimary: false
          },
          serviceIdN: {
            iccId: '5678',
            mcc: 'aa',
            mnc: '555',
            dataPrimary: true
          }
        }
      };
      assert.deepEqual(this.tx.getNetworkCodes(), {});
    });
  });
});
