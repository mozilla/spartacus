define(['i18n-abide-utils'], function(i18n) {

  var assert = chai.assert;

  suite('i18n locale utilities', function(){

    test('Test format with array', function(){
      assert.equal(i18n.format('%s_%s', ['en', 'US']), 'en_US');
    });

    test('Test format with named args', function(){
      assert.equal(i18n.format('%(foo)s_%(bar)s', {foo: 'en', bar: 'US'}, true), 'en_US');
    });

    test('Test localeFromLang en-US -> en_US', function(){
      assert.equal(i18n.localeFromLang('en-US'), 'en_US');
    });

    test('Test localeFromLang sr-Latn -> sr_Latn', function(){
      assert.equal(i18n.localeFromLang('sr-Latn'), 'sr_Latn');
    });

    test('Test localeFromLang sr-Cyrl-RS -> sr_RS', function(){
      assert.equal(i18n.localeFromLang('sr-Cyrl-RS'), 'sr_RS');
    });

    test('Test localeFromLang SR-LATN -> sr_Latn', function(){
      assert.equal(i18n.localeFromLang('SR-LATN'), 'sr_Latn');
    });

    test('Test localeFromLang unknown - no-op', function(){
      assert.equal(i18n.localeFromLang('whatever'), 'whatever');
    });

  });
});
