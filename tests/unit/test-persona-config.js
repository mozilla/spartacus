define(['id', 'utils'], function(id, utils) {

  var assert = chai.assert;
  var $html = utils.$html;
  var $body = utils.$body;

  suite('i18n persona config', function(){

    setup(function() {
      this.oldLang = $html.attr('lang');
      this.oldBodyData = utils.bodyData;
      $html.attr('lang', 'es');
      $body.data('staticDocsUrl', 'https://marketplace-dev-cdn.allizom.org/');
      utils.bodyData = $body.data();
    });

    teardown(function() {
      $html.attr('lang', this.oldLang);
      utils.bodyData = this.oldBodyData;
    });

    test('Test localized privacy policy', function(){
      assert.equal(id.getRequestConfig().privacyPolicy.split('?')[0], 'https://marketplace-dev-cdn.allizom.org/media/docs/privacy/es.html');
    });

    test('Test localized T&Cs', function(){
      assert.equal(id.getRequestConfig().termsOfService.split('?')[0], 'https://marketplace-dev-cdn.allizom.org/media/docs/terms/es.html');
    });

  });

});
