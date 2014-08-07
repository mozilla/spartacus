define(['models/session', 'utils'], function(SessionModel, utils) {

  var assert = chai.assert;
  var $html = utils.$html;
  var $body = utils.$body;
  var cdnBase = 'https://marketplace-dev-cdn.allizom.org/media/docs/';

  suite('i18n persona config', function(){

    setup(function() {
      this.oldLang = $html.attr('lang');
      this.oldBodyData = utils.bodyData;
      $html.attr('lang', 'es');
      $body.data('staticDocsUrl', 'https://marketplace-dev-cdn.allizom.org/');
      utils.bodyData = $body.data();
      this.session = new SessionModel();
    });

    teardown(function() {
      $html.attr('lang', this.oldLang);
      utils.bodyData = this.oldBodyData;
    });

    test('Test localized privacy policy', function(){
      assert.equal(this.session.getRequestConfig().privacyPolicy.split('?')[0],
                   cdnBase + 'privacy/es.html');
    });

    test('Test localized T&Cs', function(){
      assert.equal(this.session.getRequestConfig().termsOfService.split('?')[0],
                   cdnBase + 'terms/es.html');
    });

  });

});
