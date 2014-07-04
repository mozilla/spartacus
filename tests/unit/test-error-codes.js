define(['error-codes'], function(errorCodes) {

  var assert = chai.assert;

  suite('Test error code lookup', function(){

    test('Check format in error code string', function(){
      assert.include(errorCodes.BAD_ICON_KEY, 'icon_64.png');
    });

    test('Check ordered format in error code string', function(){
      var noDefaultLoc = errorCodes.NO_DEFAULT_LOC;
      assert.include(noDefaultLoc, 'locales');
      assert.include(noDefaultLoc, 'defaultLocale');
      assert.ok(noDefaultLoc.indexOf('locale') < noDefaultLoc.indexOf('defaultLocale'));
    });

  });

});
