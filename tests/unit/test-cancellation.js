define(['cancel', 'jquery', 'utils'], function(cancel, $, utils) {

  var assert = chai.assert;

  suite('Cancellation', function(){

    setup(function(){
      this.oldErrorCode = utils.bodyData.errorCode;
      this.oldApp = window.app;
      window.app = {
        error: {
          close: function() {},
        },
        throbber: {
          render: function() {},
        }
      };
      this.stub = sinon.stub(utils.mozPaymentProvider, 'paymentFailed');
    });

    teardown(function(){
      utils.bodyData.errorCode = this.oldErrorCode;
      window.app = this.oldApp;
      this.stub.restore();
    });

    test('Check paymentFailed called with errorCode from attr', function(){
      utils.bodyData.errorCode = 'WHATEVER';
      cancel.callPayFailure();
      assert.ok(this.stub.calledWithExactly('WHATEVER'));
    });

    test('Check paymentFailed called with fallback errorCode', function(){
      cancel.callPayFailure();
      assert.ok(this.stub.calledWithExactly('USER_CANCELLED'));
    });

  });
});
