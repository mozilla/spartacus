(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["_macros.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var macro_t_1 = runtime.makeMacro(
["value"], 
["modifier", "disabled"], 
function (l_value, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("value", l_value);
frame.set("modifier", kwargs.hasOwnProperty("modifier") ? kwargs["modifier"] : "");
frame.set("disabled", kwargs.hasOwnProperty("disabled") ? kwargs["disabled"] : false);
var output= "";
output += "<button class=\"button";
if(runtime.contextOrFrameLookup(context, frame, "modifier")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "modifier"), env.autoesc);
;
}
output += "\"";
if(runtime.contextOrFrameLookup(context, frame, "disabled")) {
output += " disabled";
;
}
output += " type=\"submit\">";
output += runtime.suppressValue(l_value, env.autoesc);
output += "</button>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("button");
context.setVariable("button", macro_t_1);
output += "\n\n";
var macro_t_2 = runtime.makeMacro(
["value"], 
["modifier", "href", "disabled"], 
function (l_value, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("value", l_value);
frame.set("modifier", kwargs.hasOwnProperty("modifier") ? kwargs["modifier"] : "");
frame.set("href", kwargs.hasOwnProperty("href") ? kwargs["href"] : "#");
frame.set("disabled", kwargs.hasOwnProperty("disabled") ? kwargs["disabled"] : false);
var output= "";
output += "<a class=\"button";
if(runtime.contextOrFrameLookup(context, frame, "modifier")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "modifier"), env.autoesc);
;
}
if(runtime.contextOrFrameLookup(context, frame, "disabled")) {
output += " disabled";
;
}
output += "\" href=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "href"), env.autoesc);
output += "\">";
output += runtime.suppressValue(l_value, env.autoesc);
output += "</a>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("linkButton");
context.setVariable("linkButton", macro_t_2);
output += "\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["base-error.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
env.getTemplate("_macros.html", function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
t_3.getExported(function(t_5,t_3) {
if(t_5) { cb(t_5); return; }
context.setVariable("macro", t_3);
output += "\n\n";
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_pageclass(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
if(runtime.contextOrFrameLookup(context, frame, "pageclass")) {
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "pageclass"), env.autoesc);
;
}
else {
output += "full-error";
;
}
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_page(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n  <section class=\"content error\">\n    <div class=\"msg\">\n      <h1>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "heading"), env.autoesc);
output += "</h1>\n      <p>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "msg"), env.autoesc);
output += "</p>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "error_code")) {
output += "<p class=\"error-code\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "error_code"), env.autoesc);
output += "</p>";
;
}
output += "\n    </div>\n  </section>\n\n  <menu class=\"buttons\" type=\"toolbar\">\n    ";
context.getBlock("buttons")(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n  </menu>\n";
cb(null, output);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_buttons(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n      ";
output += runtime.suppressValue((lineno = 16, colno = 19, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 16, colno = 27, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Cancel"])),runtime.makeKeywordArgs({"modifier": "cancel"})])), env.autoesc);
output += "\n      ";
output += runtime.suppressValue((lineno = 17, colno = 19, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 17, colno = 27, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["OK"])),runtime.makeKeywordArgs({"modifier": "cta"})])), env.autoesc);
output += "\n    ";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_pageclass: b_pageclass,
b_page: b_page,
b_buttons: b_buttons,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["base-styleguide.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
context.getBlock("pagetitle")(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\n";
context.getBlock("nav")(env, context, frame, runtime, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
output += t_3;
output += "\n<main class=\"";
context.getBlock("mainclass")(env, context, frame, runtime, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
output += t_5;
output += "\">\n  ";
context.getBlock("content")(env, context, frame, runtime, function(t_8,t_7) {
if(t_8) { cb(t_8); return; }
output += t_7;
output += "\n</main>\n";
cb(null, output);
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_pagetitle(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_nav(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_mainclass(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_pagetitle: b_pagetitle,
b_nav: b_nav,
b_mainclass: b_mainclass,
b_content: b_content,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["base.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"page ";
context.getBlock("pageclass")(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\">\n  <div class=\"inner\">\n    ";
context.getBlock("page")(env, context, frame, runtime, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
output += t_3;
output += "\n  </div>\n</div>\n";
cb(null, output);
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_pageclass(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_page(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_pageclass: b_pageclass,
b_page: b_page,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["create-pin.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("pin-form.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
output += ">\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_heading(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += runtime.suppressValue((lineno = 1, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Create Pin"])), env.autoesc);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_heading: b_heading,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["enter-pin.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("pin-form.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
output += ">\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_heading(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += runtime.suppressValue((lineno = 1, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Enter Pin"])), env.autoesc);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_heading: b_heading,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["error.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base-error.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
env.getTemplate("_macros.html", function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
t_3.getExported(function(t_5,t_3) {
if(t_5) { cb(t_5); return; }
context.setVariable("macro", t_3);
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_buttons(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n  ";
output += runtime.suppressValue((lineno = 4, colno = 15, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 4, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Cancel"])),runtime.makeKeywordArgs({"modifier": "cancel"})])), env.autoesc);
output += "\n  ";
if(runtime.contextOrFrameLookup(context, frame, "buttonText")) {
output += "\n  ";
output += runtime.suppressValue((lineno = 6, colno = 15, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [runtime.contextOrFrameLookup(context, frame, "buttonText"),runtime.makeKeywordArgs({"modifier": "cta"})])), env.autoesc);
output += "\n  ";
;
}
output += "\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_buttons: b_buttons,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["locked.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base-error.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
env.getTemplate("_macros.html", function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
t_3.getExported(function(t_5,t_3) {
if(t_5) { cb(t_5); return; }
context.setVariable("macro", t_3);
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_buttons(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n  ";
output += runtime.suppressValue((lineno = 4, colno = 15, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 4, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["OK"])),runtime.makeKeywordArgs({"modifier": "cta"})])), env.autoesc);
output += "\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_buttons: b_buttons,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["login.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_page(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<section class=\"login\">\n  <h1>";
output += runtime.suppressValue((lineno = 4, colno = 14, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Sign In"])), env.autoesc);
output += "</h1>\n  <p>";
output += runtime.suppressValue((lineno = 5, colno = 13, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Sign in to continue with the payment"])), env.autoesc);
output += "</p>\n  <a id=\"signin\" class=\"sign-in\" href=\"#\">";
output += runtime.suppressValue((lineno = 6, colno = 50, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Sign in"])), env.autoesc);
output += "</a>\n</section>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_page: b_page,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["pin-form.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
env.getTemplate("_macros.html", function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
t_3.getExported(function(t_5,t_3) {
if(t_5) { cb(t_5); return; }
context.setVariable("macro", t_3);
output += "\n\n";
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_mainclass(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "pin";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_page(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<section class=\"content\">\n  <h1>";
context.getBlock("heading")(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "</h1>\n  <input id=\"pin\" type=\"number\" x-inputmode=\"digit\">\n  <div class=\"pinbox\">\n    <span></span>\n    <span></span>\n    <span></span>\n    <span></span>\n  </div>\n  <p class=\"err-msg hidden\"></p>\n</section>\n\n<menu class=\"buttons\" type=\"toolbar\">\n  ";
output += runtime.suppressValue((lineno = 19, colno = 15, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 19, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Cancel"]))])), env.autoesc);
output += "\n  ";
output += runtime.suppressValue((lineno = 20, colno = 15, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 20, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Continue"])),runtime.makeKeywordArgs({"modifier": "cta continue","disabled": true})])), env.autoesc);
output += "\n</menu>\n";
cb(null, output);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_heading(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_mainclass: b_mainclass,
b_page: b_page,
b_heading: b_heading,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["reset-pin.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("pin-form.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
output += ">\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_heading(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += runtime.suppressValue((lineno = 1, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Reset Pin"])), env.autoesc);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_heading: b_heading,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["throbber.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
output += "\n\n";
output += "\n\n\n\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_pageclass(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "throbber";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_page(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<progress></progress>\n<p class=\"msg\">";
if(runtime.contextOrFrameLookup(context, frame, "msg")) {
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "msg"), env.autoesc);
;
}
else {
output += runtime.suppressValue((lineno = 6, colno = 42, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Loading..."])), env.autoesc);
;
}
output += "</p>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_pageclass: b_pageclass,
b_page: b_page,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["was-locked.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("base.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n";
env.getTemplate("_macros.html", function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
t_3.getExported(function(t_5,t_3) {
if(t_5) { cb(t_5); return; }
context.setVariable("macro", t_3);
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_page(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n  <section class=\"content\">\n    <h1>";
output += runtime.suppressValue((lineno = 5, colno = 16, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Your Pin was locked"])), env.autoesc);
output += "</h1>\n    <p>";
output += runtime.suppressValue((lineno = 6, colno = 15, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Your pin was locked because you entered it incorrectly too many times. You can continue and try entering your pin again or reset your pin."])), env.autoesc);
output += "</p>\n  </section>\n\n  <menu class=\"buttons\" type=\"toolbar\">\n    ";
output += runtime.suppressValue((lineno = 10, colno = 17, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 10, colno = 25, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Reset Pin"]))])), env.autoesc);
output += "\n    ";
output += runtime.suppressValue((lineno = 11, colno = 17, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "macro")),"button", env.autoesc), "macro[\"button\"]", [(lineno = 11, colno = 25, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "gettext"), "gettext", ["Continue"])),runtime.makeKeywordArgs({"modifier": "cta"})])), env.autoesc);
output += "\n  </menu>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_page: b_page,
root: root
};
})();
})();
