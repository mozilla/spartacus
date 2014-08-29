define([
  'cancel',
  'jquery',
  'utils',
  'views/error'
], function(cancel, $, utils, ErrorView) {

  var assert = chai.assert;

  suite('Cancellation', function(){

    setup(function(){
      this.oldApp = window.app;
      this.error = new ErrorView();
      window.app = {
        error: {
          close: function() {},
        },
        throbber: {
          render: function() {},
          close: function() {},
        }
      };
      this.stub = sinon.stub(utils.mozPaymentProvider, 'paymentFailed');
    });

    teardown(function(){
      window.app = this.oldApp;
      this.stub.restore();
    });

    test('Check paymentFailed called with passed errorCode', function(){
      cancel.callPayFailure(null, 'WHATEVER');
      assert.ok(this.stub.calledWithExactly('WHATEVER'));
    });

    test('Check paymentFailed called with fallback errorCode', function(){
      cancel.callPayFailure();
      assert.ok(this.stub.calledWithExactly('USER_CANCELLED'));
    });

    test('Check correct error codes are sent to default cancel func', function(){
      this.error.render({errorCode: 'TEST_ERROR_CODE'});
      $('.cancel').click();
      assert.ok(this.stub.calledWithExactly('TEST_ERROR_CODE'));
    });

    test('Check default errorCode used with default cancel.', function(){
      this.error.render({errorCode: null});
      $('.cancel').click();
      assert.ok(this.stub.calledWithExactly('USER_CANCELLED'));
    });
  });
});
