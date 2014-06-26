define(['jquery'], function($) {

  var assert = chai.assert;
  var $body = $('body');

  suite('Settings Tests', function(){

    setup(function() {
      this.origSettings = $body.data('settings');
      require.undef('settings');
      $body.data('settings', {whatever: 'something', poll_interval: '500'});
    });

    teardown(function() {
      $body.data('settings', this.origSettings);
    });

    test('Check settings can be added.', function(done){
      require(['settings'], function(settings){
        assert.equal(settings.whatever, 'something');
        done();
      });
    });

    test('Check settings can be overidden.', function(done){
      require(['settings'], function(settings){
        assert.equal(settings.poll_interval, 500);
        done();
      });
    });

  });

});
