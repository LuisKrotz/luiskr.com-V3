(function(){
/*!
* css-vars-ponyfill
* v2.4.9
* https://jhildenbiddle.github.io/css-vars-ponyfill/
* (c) 2018-2024 John Hildenbiddle <http://hildenbiddle.com>
* MIT license
*/
function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},e.apply(this,arguments)}
/*!
* get-css-data
* v2.1.0
* https://github.com/jhildenbiddle/get-css-data
* (c) 2018-2022 John Hildenbiddle <http://hildenbiddle.com>
* MIT license
*/function t(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n={mimeType:t.mimeType||null,onBeforeSend:t.onBeforeSend||Function.prototype,onSuccess:t.onSuccess||Function.prototype,onError:t.onError||Function.prototype,onComplete:t.onComplete||Function.prototype},r=Array.isArray(e)?e:[e],i=Array.apply(null,Array(r.length)).map((function(e){return null}));function a(e){var t=typeof e==`string`,n=t&&e.trim().charAt(0)===`<`;return t&&!n}function o(e,t){n.onError(e,r[t],t)}function s(e,t){var a=n.onSuccess(e,r[t],t);e=a===!1?``:a||e,i[t]=e,i.indexOf(null)===-1&&n.onComplete(i)}var c=document.createElement(`a`);r.forEach((function(e,t){if(c.setAttribute(`href`,e),c.href=String(c.href),document.all&&!window.atob&&c.host.split(`:`)[0]!==location.host.split(`:`)[0]){if(c.protocol===location.protocol){var r=new XDomainRequest;r.open(`GET`,e),r.timeout=0,r.onprogress=Function.prototype,r.ontimeout=Function.prototype,r.onload=function(){var e=r.responseText;a(e)?s(e,t):o(r,t)},r.onerror=function(e){o(r,t)},setTimeout((function(){r.send()}),0)}else console.warn(`Internet Explorer 9 Cross-Origin (CORS) requests must use the same protocol (${e})`),o(null,t)}else{var i=new XMLHttpRequest;i.open(`GET`,e),n.mimeType&&i.overrideMimeType&&i.overrideMimeType(n.mimeType),n.onBeforeSend(i,e,t),i.onreadystatechange=function(){if(i.readyState===4){var e=i.responseText;i.status<400&&a(e)||i.status===0&&a(e)?s(e,t):o(i,t)}},i.send()}}))}
/**
* Gets CSS data from <style> and <link> nodes (including @imports), then
* returns data in order processed by DOM. Allows specifying nodes to
* include/exclude and filtering CSS data using RegEx.
*
* @preserve
* @param {object}   [options] The options object
* @param {object}   [options.rootElement=document] Root element to traverse for
*                   <link> and <style> nodes.
* @param {string}   [options.include] CSS selector matching <link> and <style>
*                   nodes to include
* @param {string}   [options.exclude] CSS selector matching <link> and <style>
*                   nodes to exclude
* @param {object}   [options.filter] Regular expression used to filter node CSS
*                   data. Each block of CSS data is tested against the filter,
*                   and only matching data is included.
* @param {boolean}  [options.skipDisabled=true] Determines if disabled
*                   stylesheets will be skipped while collecting CSS data.
* @param {boolean}  [options.useCSSOM=false] Determines if CSS data will be
*                   collected from a stylesheet's runtime values instead of its
*                   text content. This is required to get accurate CSS data
*                   when a stylesheet has been modified using the deleteRule()
*                   or insertRule() methods because these modifications will
*                   not be reflected in the stylesheet's text content.
* @param {function} [options.onBeforeSend] Callback before XHR is sent. Passes
*                   1) the XHR object, 2) source node reference, and 3) the
*                   source URL as arguments.
* @param {function} [options.onSuccess] Callback on each CSS node read. Passes
*                   1) CSS text, 2) source node reference, and 3) the source
*                   URL as arguments.
* @param {function} [options.onError] Callback on each error. Passes 1) the XHR
*                   object for inspection, 2) soure node reference, and 3) the
*                   source URL that failed (either a <link> href or an @import)
*                   as arguments
* @param {function} [options.onComplete] Callback after all nodes have been
*                   processed. Passes 1) concatenated CSS text, 2) an array of
*                   CSS text in DOM order, and 3) an array of nodes in DOM
*                   order as arguments.
*
* @example
*
*   getCssData({
*     rootElement : document,
*     include     : 'style,link[rel="stylesheet"]',
*     exclude     : '[href="skip.css"]',
*     filter      : /red/,
*     skipDisabled: true,
*     useCSSOM    : false,
*     onBeforeSend(xhr, node, url) {
*       // ...
*     }
*     onSuccess(cssText, node, url) {
*       // ...
*     }
*     onError(xhr, node, url) {
*       // ...
*     },
*     onComplete(cssText, cssArray, nodeArray) {
*       // ...
*     }
*   });
*/function n(e){var n={cssComments:/\/\*[\s\S]+?\*\//g,cssImports:/(?:@import\s*)(?:url\(\s*)?(?:['"])([^'"]*)(?:['"])(?:\s*\))?(?:[^;]*;)/g},a={rootElement:e.rootElement||document,include:e.include||`style,link[rel="stylesheet"]`,exclude:e.exclude||null,filter:e.filter||null,skipDisabled:e.skipDisabled!==!1,useCSSOM:e.useCSSOM||!1,onBeforeSend:e.onBeforeSend||Function.prototype,onSuccess:e.onSuccess||Function.prototype,onError:e.onError||Function.prototype,onComplete:e.onComplete||Function.prototype},o=Array.apply(null,a.rootElement.querySelectorAll(a.include)).filter((function(e){return!i(e,a.exclude)})),s=Array.apply(null,Array(o.length)).map((function(e){return null}));function c(){if(s.indexOf(null)===-1){s.reduce((function(e,t,n){return t===``&&e.push(n),e}),[]).reverse().forEach((function(e){return[o,s].forEach((function(t){return t.splice(e,1)}))}));var e=s.join(``);a.onComplete(e,s,o)}}function l(e,t,n,r){var i=a.onSuccess(e,n,r);e=i!==void 0&&!i?``:i||e,d(e,n,r,(function(e,r){s[t]===null&&(r.forEach((function(e){return a.onError(e.xhr,n,e.url)})),s[t]=!a.filter||a.filter.test(e)?e:``,c())}))}function u(e,t){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:[],a={};return a.rules=(e.replace(n.cssComments,``).match(n.cssImports)||[]).filter((function(e){return i.indexOf(e)===-1})),a.urls=a.rules.map((function(e){return e.replace(n.cssImports,`$1`)})),a.absoluteUrls=a.urls.map((function(e){return r(e,t)})),a.absoluteRules=a.rules.map((function(e,n){var i=a.urls[n],o=r(a.absoluteUrls[n],t);return e.replace(i,o)})),a}function d(e,n,r,i){var o=arguments.length>4&&arguments[4]!==void 0?arguments[4]:[],s=arguments.length>5&&arguments[5]!==void 0?arguments[5]:[],c=u(e,r,s);c.rules.length?t(c.absoluteUrls,{onBeforeSend:function(e,t,r){a.onBeforeSend(e,n,t)},onSuccess:function(e,t,r){var i=a.onSuccess(e,n,t);e=i===!1?``:i||e;var o=u(e,t,s);return o.rules.forEach((function(t,n){e=e.replace(t,o.absoluteRules[n])})),e},onError:function(t,a,l){o.push({xhr:t,url:a}),s.push(c.rules[l]),d(e,n,r,i,o,s)},onComplete:function(t){t.forEach((function(t,n){e=e.replace(c.rules[n],t)})),d(e,n,r,i,o,s)}}):i(e,o)}o.length?o.forEach((function(e,n){var i=e.getAttribute(`href`),o=e.getAttribute(`rel`),u=e.nodeName.toLowerCase()===`link`&&i&&o&&o.toLowerCase().indexOf(`stylesheet`)!==-1,d=a.skipDisabled!==!1&&e.disabled,f=e.nodeName.toLowerCase()===`style`;if(u&&!d){if(i.indexOf(`data:text/css`)!==-1){var p=decodeURIComponent(i.substring(i.indexOf(`,`)+1));a.useCSSOM&&(p=Array.apply(null,e.sheet.cssRules).map((function(e){return e.cssText})).join(``)),l(p,n,e,location.href)}else t(i,{mimeType:`text/css`,onBeforeSend:function(t,n,r){a.onBeforeSend(t,e,n)},onSuccess:function(t,a,o){l(t,n,e,r(i))},onError:function(t,r,i){s[n]=``,a.onError(t,e,r),c()}})}else if(f&&!d){var m=e.textContent;a.useCSSOM&&(m=Array.apply(null,e.sheet.cssRules).map((function(e){return e.cssText})).join(``)),l(m,n,e,location.href)}else s[n]=``,c()})):a.onComplete(``,[])}function r(e,t){var n=document.implementation.createHTMLDocument(``),r=n.createElement(`base`),i=n.createElement(`a`);return n.head.appendChild(r),n.body.appendChild(i),r.href=t||document.baseURI||(document.querySelector(`base`)||{}).href||location.href,i.href=e,i.href}function i(e,t){return(e.matches||e.matchesSelector||e.webkitMatchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector).call(e,t)}var a=o;function o(e,t,n){e instanceof RegExp&&(e=s(e,n)),t instanceof RegExp&&(t=s(t,n));var r=c(e,t,n);return r&&{start:r[0],end:r[1],pre:n.slice(0,r[0]),body:n.slice(r[0]+e.length,r[1]),post:n.slice(r[1]+t.length)}}function s(e,t){var n=t.match(e);return n?n[0]:null}o.range=c;function c(e,t,n){var r,i,a,o,s,c=n.indexOf(e),l=n.indexOf(t,c+1),u=c;if(c>=0&&l>0){if(e===t)return[c,l];for(r=[],a=n.length;u>=0&&!s;)u==c?(r.push(u),c=n.indexOf(e,u+1)):r.length==1?s=[r.pop(),l]:(i=r.pop(),i<a&&(a=i,o=l),l=n.indexOf(t,u+1)),u=c<l&&c>=0?c:l;r.length&&(s=[a,o])}return s}function l(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e({},{preserveStatic:!0,removeComments:!1},n),i=[];function o(e){throw Error(`CSS parse error: ${e}`)}function s(e){var n=e.exec(t);if(n)return t=t.slice(n[0].length),n}function c(){return s(/^{\s*/)}function l(){return s(/^}/)}function u(){s(/^\s*/)}function d(){if(u(),t[0]===`/`&&t[1]===`*`){for(var e=2;t[e]&&(t[e]!==`*`||t[e+1]!==`/`);)e++;if(!t[e])return o(`end of comment is missing`);var n=t.slice(2,e);return t=t.slice(e+2),{type:`comment`,comment:n}}}function f(){for(var e=[],t;t=d();)e.push(t);return r.removeComments?[]:e}function p(){for(u();t[0]===`}`;)o(`extra closing bracket`);var e=s(/^(("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^{])+)/);if(e){var n=e[0].trim(),r;/\/\*/.test(n)&&(n=n.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g,``));var i=/["']\w*,\w*["']/.test(n);return i&&(n=n.replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g,(function(e){return e.replace(/,/g,`‌`)}))),r=/,/.test(n)?n.split(/\s*(?![^(]*\)),\s*/):[n],i&&(r=r.map((function(e){return e.replace(/\u200C/g,`,`)}))),r}}function m(){if(t[0]===`@`)return D();s(/^([;\s]*)+/);var e=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,n=s(/^(\*?[-#/*\\\w.]+(\[[0-9a-z_-]+\])?)\s*/);if(n){if(n=n[0].trim(),!s(/^:\s*/))return o(`property missing ':'`);var r=s(/^((?:\/\*.*?\*\/|'(?:\\'|.)*?'|"(?:\\"|.)*?"|\((\s*'(?:\\'|.)*?'|"(?:\\"|.)*?"|[^)]*?)\s*\)|[^};])+)/),i={type:`declaration`,property:n.replace(e,``),value:r?r[0].replace(e,``).trim():``};return s(/^[;\s]*/),i}}function h(){if(!c())return o(`missing '{'`);for(var e,t=f();e=m();)t.push(e),t=t.concat(f());return l()?t:o(`missing '}'`)}function g(){u();for(var e=[],t;t=s(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/);)e.push(t[1]),s(/^,\s*/);if(e.length)return{type:`keyframe`,values:e,declarations:h()}}function _(){var e=s(/^@([-\w]+)?keyframes\s*/);if(e){var t=e[1];if(e=s(/^([-\w]+)\s*/),!e)return o(`@keyframes missing name`);var n=e[1];if(!c())return o(`@keyframes missing '{'`);for(var r,i=f();r=g();)i.push(r),i=i.concat(f());return l()?{type:`keyframes`,name:n,vendor:t,keyframes:i}:o(`@keyframes missing '}'`)}}function v(){if(s(/^@page */))return{type:`page`,selectors:p()||[],declarations:h()}}function y(){var e=s(/@(top|bottom|left|right)-(left|center|right|top|middle|bottom)-?(corner)?\s*/);if(e)return{type:`page-margin-box`,name:`${e[1]}-${e[2]}`+(e[3]?`-${e[3]}`:``),declarations:h()}}function b(){if(s(/^@font-face\s*/))return{type:`font-face`,declarations:h()}}function x(){var e=s(/^@supports *([^{]+)/);if(e)return{type:`supports`,supports:e[1].trim(),rules:k()}}function S(){if(s(/^@host\s*/))return{type:`host`,rules:k()}}function C(){var e=s(/^@media([^{]+)*/);if(e)return{type:`media`,media:(e[1]||``).trim(),rules:k()}}function w(){var e=s(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);if(e)return{type:`custom-media`,name:e[1].trim(),media:e[2].trim()}}function T(){var e=s(/^@([-\w]+)?document *([^{]+)/);if(e)return{type:`document`,document:e[2].trim(),vendor:e[1]?e[1].trim():null,rules:k()}}function E(){var e=s(/^@(import|charset|namespace)\s*([^;]+);/);if(e)return{type:e[1],name:e[2].trim()}}function D(){if(u(),t[0]===`@`){var e=E()||b()||C()||_()||x()||T()||w()||S()||v()||y();if(e&&!r.preserveStatic){var n=!1;return n=e.declarations?e.declarations.some((function(e){return/var\(/.test(e.value)})):(e.keyframes||e.rules||[]).some((function(e){return(e.declarations||[]).some((function(e){return/var\(/.test(e.value)}))})),n?e:{}}return e}}function O(){if(!r.preserveStatic){var e=a(`{`,`}`,t);if(e){var n=/:(?:root|host)(?![.:#(])/.test(e.pre)&&/--\S*\s*:/.test(e.body),i=/var\(/.test(e.body);if(!n&&!i)return t=t.slice(e.end+1),{}}}var s=p()||[],c=r.preserveStatic?h():h().filter((function(e){var t=s.some((function(e){return/:(?:root|host)(?![.:#(])/.test(e)}))&&/^--\S/.test(e.property),n=/var\(/.test(e.value);return t||n}));return s.length||o(`selector missing`),{type:`rule`,selectors:s,declarations:c}}function k(e){if(!e&&!c())return o(`missing '{'`);for(var n,r=f();t.length&&(e||t[0]!==`}`)&&(n=D()||O());)n.type&&r.push(n),r=r.concat(f());return!e&&!l()?o(`missing '}'`):r}return{type:`stylesheet`,stylesheet:{rules:k(!0),errors:i}}}function u(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e({},{parseHost:!1,store:{},onWarning:function(){}},n),i=RegExp(`:${r.parseHost?`host`:`root`}\$`);return typeof t==`string`&&(t=l(t,r)),t.stylesheet.rules.forEach((function(e){e.type!==`rule`||!e.selectors.some((function(e){return i.test(e)}))||e.declarations.forEach((function(e,t){var n=e.property,i=e.value;n&&n.indexOf(`--`)===0&&(r.store[n]=i)}))})),r.store}function d(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:``,n=arguments.length>2?arguments[2]:void 0,r={charset:function(e){return`@charset `+e.name+`;`},comment:function(e){return e.comment.indexOf(`__CSSVARSPONYFILL`)===0?`/*`+e.comment+`*/`:``},"custom-media":function(e){return`@custom-media `+e.name+` `+e.media+`;`},declaration:function(e){return e.property+`:`+e.value+`;`},document:function(e){return`@`+(e.vendor||``)+`document `+e.document+`{`+i(e.rules)+`}`},"font-face":function(e){return`@font-face{`+i(e.declarations)+`}`},host:function(e){return`@host{`+i(e.rules)+`}`},import:function(e){return`@import `+e.name+`;`},keyframe:function(e){return e.values.join(`,`)+`{`+i(e.declarations)+`}`},keyframes:function(e){return`@`+(e.vendor||``)+`keyframes `+e.name+`{`+i(e.keyframes)+`}`},media:function(e){return`@media `+e.media+`{`+i(e.rules)+`}`},namespace:function(e){return`@namespace `+e.name+`;`},page:function(e){return`@page `+(e.selectors.length?e.selectors.join(`, `):``)+`{`+i(e.declarations)+`}`},"page-margin-box":function(e){return`@`+e.name+`{`+i(e.declarations)+`}`},rule:function(e){var t=e.declarations;if(t.length)return e.selectors.join(`,`)+`{`+i(t)+`}`},supports:function(e){return`@supports `+e.supports+`{`+i(e.rules)+`}`}};function i(e){for(var i=``,a=0;a<e.length;a++){var o=e[a];n&&n(o);var s=r[o.type](o);s&&(i+=s,s.length&&o.selectors&&(i+=t))}return i}return i(e.stylesheet.rules)}function f(e,t){e.rules.forEach((function(n){if(n.rules){f(n,t);return}if(n.keyframes){n.keyframes.forEach((function(e){e.type===`keyframe`&&t(e.declarations,n)}));return}n.declarations&&t(n.declarations,e)}))}var p=`--`,m=`var`;function h(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e({},{preserveStatic:!0,preserveVars:!1,variables:{},onWarning:function(){}},n);return typeof t==`string`&&(t=l(t,r)),f(t.stylesheet,(function(e,t){for(var n=0;n<e.length;n++){var i=e[n],a=i.type,o=i.property,s=i.value;if(a===`declaration`){if(!r.preserveVars&&o&&o.indexOf(p)===0){e.splice(n,1),n--;continue}if(s.indexOf(m+`(`)!==-1){var c=_(s,r);c!==i.value&&(c=g(c),r.preserveVars?(e.splice(n,0,{type:a,property:o,value:c}),n++):i.value=c)}}}})),d(t)}function g(e){return(e.match(/calc\(([^)]+)\)/g)||[]).forEach((function(t){var n=`calc${t.split(`calc`).join(``)}`;e=e.replace(t,n)})),e}function _(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=arguments.length>2?arguments[2]:void 0;if(e.indexOf(`var(`)===-1)return e;var r=a(`(`,`)`,e);function i(e){var r=e.split(`,`)[0].replace(/[\s\n\t]/g,``),i=(e.match(/(?:\s*,\s*){1}(.*)?/)||[])[1],a=Object.prototype.hasOwnProperty.call(t.variables,r)?String(t.variables[r]):void 0,o=a||(i?String(i):void 0),s=n||e;return a||t.onWarning(`variable "${r}" is undefined`),o&&o!==`undefined`&&o.length>0?_(o,t,s):`var(${s})`}return r?r.pre.slice(-3)===`var`?r.body.trim().length===0?(t.onWarning(`var() must contain a non-whitespace string`),e):r.pre.slice(0,-3)+i(r.body)+_(r.post,t):r.pre+`(${_(r.body,t)})`+_(r.post,t):(e.indexOf(`var(`)!==-1&&t.onWarning(`missing closing ")" in the value "${e}"`),e)}var v=typeof window<`u`,y=v&&window.CSS&&window.CSS.supports&&window.CSS.supports(`(--a: 0)`),b={group:0,job:0},x={rootElement:v?document:null,shadowDOM:!1,include:`style,link[rel=stylesheet]`,exclude:``,variables:{},onlyLegacy:!0,preserveStatic:!0,preserveVars:!1,silent:!1,updateDOM:!0,updateURLs:!0,watch:null,onBeforeSend:function(){},onError:function(){},onWarning:function(){},onSuccess:function(){},onComplete:function(){},onFinally:function(){}},S={cssComments:/\/\*[\s\S]+?\*\//g,cssKeyframes:/@(?:-\w*-)?keyframes/,cssMediaQueries:/@media[^{]+\{([\s\S]+?})\s*}/g,cssUrls:/url\((?!['"]?(?:data|http|\/\/):)['"]?([^'")]*)['"]?\)/g,cssVarDeclRules:/(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^}]*})/g,cssVarDecls:/(?:[\s;]*)(-{2}\w[\w-]*)(?:\s*:\s*)([^;]*);/g,cssVarFunc:/var\(\s*--[\w-]/,cssVars:/(?:(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^;]*;*\s*)|(?:var\(\s*))(--[^:)]+)(?:\s*[:)])/},C={dom:{},job:{},user:{}},w=!1,T=null,E=0,D=null,O=!1;
/**
* Fetches, parses, and transforms CSS custom properties from specified
* <style> and <link> elements into static values, then appends a new <style>
* element with static values to the DOM to provide CSS custom property
* compatibility for legacy browsers. Also provides a single interface for
* live updates of runtime values in both modern and legacy browsers.
*
* @preserve
* @param {object}   [options] Options object
* @param {object}   [options.rootElement=document] Root element to traverse for
*                   <link> and <style> nodes
* @param {boolean}  [options.shadowDOM=false] Determines if shadow DOM <link>
*                   and <style> nodes will be processed.
* @param {string}   [options.include="style,link[rel=stylesheet]"] CSS selector
*                   matching <link re="stylesheet"> and <style> nodes to
*                   process
* @param {string}   [options.exclude] CSS selector matching <link
*                   rel="stylehseet"> and <style> nodes to exclude from those
*                   matches by options.include
* @param {object}   [options.variables] A map of custom property name/value
*                   pairs. Property names can omit or include the leading
*                   double-hyphen (—), and values specified will override
*                   previous values
* @param {boolean}  [options.onlyLegacy=true] Determines if the ponyfill will
*                   only generate legacy-compatible CSS in browsers that lack
*                   native support (i.e., legacy browsers)
* @param {boolean}  [options.preserveStatic=true] Determines if CSS
*                   declarations that do not reference a custom property will
*                   be preserved in the transformed CSS
* @param {boolean}  [options.preserveVars=false] Determines if CSS custom
*                   property declarations will be preserved in the transformed
*                   CSS
* @param {boolean}  [options.silent=false] Determines if warning and error
*                   messages will be displayed on the console
* @param {boolean}  [options.updateDOM=true] Determines if the ponyfill will
*                   update the DOM after processing CSS custom properties
* @param {boolean}  [options.updateURLs=true] Determines if relative url()
*                   paths will be converted to absolute urls in external CSS
* @param {boolean}  [options.watch=false] Determines if a MutationObserver will
*                   be created that will execute the ponyfill when a <link> or
*                   <style> DOM mutation is observed
* @param {function} [options.onBeforeSend] Callback before XHR is sent. Passes
*                   1) the XHR object, 2) source node reference, and 3) the
*                   source URL as arguments
* @param {function} [options.onError] Callback after a CSS parsing error has
*                   occurred or an XHR request has failed. Passes 1) an error
*                   message, and 2) source node reference, 3) xhr, and 4 url as
*                   arguments.
* @param {function} [options.onWarning] Callback after each CSS parsing warning
*                   has occurred. Passes 1) a warning message as an argument.
* @param {function} [options.onSuccess] Callback after CSS data has been
*                   collected from each node and before CSS custom properties
*                   have been transformed. Allows modifying the CSS data before
*                   it is transformed by returning any string value (or false
*                   to skip). Passes 1) CSS text, 2) source node reference, and
*                   3) the source URL as arguments.
* @param {function} [options.onComplete] Callback after all CSS has been
*                   processed, legacy-compatible CSS has been generated, and
*                   (optionally) the DOM has been updated. Passes 1) a CSS
*                   string with CSS variable values resolved, 2) an array of
*                   output <style> node references that have been appended to
*                   the DOM, 3) an object containing all custom properies names
*                   and values, and 4) the ponyfill execution time in
*                   milliseconds.
* @param {function} [options.onFinally] Callback in modern and legacy browsers
*                   after the ponyfill has finished all tasks. Passes 1) a
*                   boolean indicating if the last ponyfill call resulted in a
*                   style change, 2) a boolean indicating if the current
*                   browser provides native support for CSS custom properties,
*                   and 3) the ponyfill execution time in milliseconds.
* @example
*
*   cssVars({
*     rootElement   : document,
*     shadowDOM     : false,
*     include       : 'style,link[rel="stylesheet"]',
*     exclude       : '',
*     variables     : {},
*     onlyLegacy    : true,
*     preserveStatic: true,
*     preserveVars  : false,
*     silent        : false,
*     updateDOM     : true,
*     updateURLs    : true,
*     watch         : false,
*     onBeforeSend(xhr, node, url) {},
*     onError(message, node, xhr, url) {},
*     onWarning(message) {},
*     onSuccess(cssText, node, url) {},
*     onComplete(cssText, styleNode, cssVariables, benchmark) {},
*     onFinally(hasChanged, hasNativeSupport, benchmark)
*   });
*/function k(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=`cssVars(): `,i=e({},x,t);function a(e,t,n,a){!i.silent&&window.console&&console.error(`${r}${e}
`,t),i.onError(e,t,n,a)}function o(e){!i.silent&&window.console&&console.warn(`${r}${e}`),i.onWarning(e)}function s(e){i.onFinally(!!e,y,I()-i.__benchmark)}if(v){if(i.watch){i.watch=x.watch,A(i),k(i);return}if(i.watch===!1&&T&&(T.disconnect(),T=null),!i.__benchmark){if(w===i.rootElement){j(t);return}var c=[].slice.call(i.rootElement.querySelectorAll(`[data-cssvars]:not([data-cssvars="out"])`));i.__benchmark=I(),i.exclude=[T?`[data-cssvars]:not([data-cssvars=""])`:`[data-cssvars="out"]`,`link[disabled]:not([data-cssvars])`,i.exclude].filter((function(e){return e})).join(`,`),i.variables=P(i.variables),c.forEach((function(e){var t=e.nodeName.toLowerCase()===`style`&&e.__cssVars.text,n=t&&e.textContent!==e.__cssVars.text;t&&n&&(e.sheet&&(e.sheet.disabled=!1),e.setAttribute(`data-cssvars`,``))})),T||([].slice.call(i.rootElement.querySelectorAll(`[data-cssvars="out"]`)).forEach((function(e){var t=e.getAttribute(`data-cssvars-group`);t&&i.rootElement.querySelector(`[data-cssvars="src"][data-cssvars-group="${t}"]`)||e.parentNode.removeChild(e)})),E&&c.length<E&&(E=c.length,C.dom={}))}if(document.readyState!==`loading`){if(y&&i.onlyLegacy){var f=!1;if(i.updateDOM){var p=i.rootElement.host||(i.rootElement===document?document.documentElement:i.rootElement);Object.keys(i.variables).forEach((function(e){var t=i.variables[e];f=f||t!==getComputedStyle(p).getPropertyValue(e),p.style.setProperty(e,t)}))}s(f)}else!O&&(i.shadowDOM||i.rootElement.shadowRoot||i.rootElement.host)?n({rootElement:x.rootElement,include:x.include,exclude:i.exclude,skipDisabled:!1,onSuccess:function(e,t,n){return(t.sheet||{}).disabled&&!t.__cssVars?!1:(e=e.replace(S.cssComments,``).replace(S.cssMediaQueries,``),e=(e.match(S.cssVarDeclRules)||[]).join(``),e||!1)},onComplete:function(e,t,n){u(e,{store:C.dom,onWarning:o}),O=!0,k(i)}}):(w=i.rootElement,n({rootElement:i.rootElement,include:i.include,exclude:i.exclude,skipDisabled:!1,onBeforeSend:i.onBeforeSend,onError:function(e,t,n){var r=e.responseURL||F(n,location.href),i=e.statusText?`(${e.statusText})`:`Unspecified Error`+(e.status===0?` (possibly CORS related)`:``);a(`CSS XHR Error: ${r} ${e.status} ${i}`,t,e,r)},onSuccess:function(e,t,n){if((t.sheet||{}).disabled&&!t.__cssVars)return!1;var r=t.nodeName.toLowerCase()===`link`,a=t.nodeName.toLowerCase()===`style`&&e!==t.textContent,o=i.onSuccess(e,t,n);return e=o!==void 0&&!o?``:o||e,i.updateURLs&&(r||a)&&(e=N(e,n)),e},onComplete:function(t,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:[],c=e({},C.dom,C.user),f=!1;if(C.job={},r.forEach((function(e,t){var r=n[t];if(e.__cssVars=e.__cssVars||{},e.__cssVars.text=r,S.cssVars.test(r))try{var s=l(r,{preserveStatic:i.preserveStatic,removeComments:!0});u(s,{parseHost:!!i.rootElement.host,store:C.dom,onWarning:o}),e.__cssVars.tree=s}catch(t){a(t.message,e)}})),e(C.job,C.dom),i.updateDOM?(e(C.user,i.variables),e(C.job,C.user)):(e(C.job,C.user,i.variables),e(c,i.variables)),f=b.job>0&&!!(Object.keys(C.job).length>Object.keys(c).length||Object.keys(c).length&&Object.keys(C.job).some((function(e){return C.job[e]!==c[e]}))),f)L(i.rootElement),k(i);else{var p=[],m=[],g=!1;if(i.updateDOM&&b.job++,r.forEach((function(t,r){var s=!t.__cssVars.tree;if(t.__cssVars.tree)try{h(t.__cssVars.tree,e({},i,{variables:C.job,onWarning:o}));var c=d(t.__cssVars.tree);if(i.updateDOM){var l=n[r],u=S.cssVarFunc.test(l);if(t.getAttribute(`data-cssvars`)||t.setAttribute(`data-cssvars`,`src`),c.length&&u){var f=t.getAttribute(`data-cssvars-group`)||++b.group,_=c.replace(/\s/g,``),v=i.rootElement.querySelector(`[data-cssvars="out"][data-cssvars-group="${f}"]`)||document.createElement(`style`);g=g||S.cssKeyframes.test(c),i.preserveStatic&&t.sheet&&(t.sheet.disabled=!0),v.hasAttribute(`data-cssvars`)||v.setAttribute(`data-cssvars`,`out`),_===t.textContent.replace(/\s/g,``)?(s=!0,v&&v.parentNode&&(t.removeAttribute(`data-cssvars-group`),v.parentNode.removeChild(v))):_!==v.textContent.replace(/\s/g,``)&&([t,v].forEach((function(e){e.setAttribute(`data-cssvars-job`,b.job),e.setAttribute(`data-cssvars-group`,f)})),v.textContent=c,p.push(c),m.push(v),v.parentNode||t.parentNode.insertBefore(v,t.nextSibling))}}else t.textContent.replace(/\s/g,``)!==c&&p.push(c)}catch(e){a(e.message,t)}s&&t.setAttribute(`data-cssvars`,`skip`),t.hasAttribute(`data-cssvars-job`)||t.setAttribute(`data-cssvars-job`,b.job)})),E=i.rootElement.querySelectorAll(`[data-cssvars]:not([data-cssvars="out"])`).length,i.shadowDOM)for(var _=[].concat(i.rootElement,[].slice.call(i.rootElement.querySelectorAll(`*`))),v=0,y;y=_[v];++v)y.shadowRoot&&y.shadowRoot.querySelector(`style`)&&k(e({},i,{rootElement:y.shadowRoot}));i.updateDOM&&g&&M(i.rootElement),w=!1,i.onComplete(p.join(``),m,JSON.parse(JSON.stringify(C.job)),I()-i.__benchmark),s(m.length)}}}))}else document.addEventListener(`DOMContentLoaded`,(function e(n){k(t),document.removeEventListener(`DOMContentLoaded`,e)}))}}k.reset=function(){for(var e in b.job=0,b.group=0,w=!1,T&&(T.disconnect(),T=null),E=0,D=null,O=!1,C)C[e]={}};function A(e){function t(e){var t=n(e)&&e.hasAttribute(`disabled`),r=(e.sheet||{}).disabled;return t||r}function n(e){return e.nodeName.toLowerCase()===`link`&&(e.getAttribute(`rel`)||``).indexOf(`stylesheet`)!==-1}function r(e){return e.nodeName.toLowerCase()===`style`}function i(r){var i=!1;if(r.type===`attributes`&&n(r.target)&&!t(r.target)){var a=r.attributeName===`disabled`,o=r.attributeName===`href`,s=r.target.getAttribute(`data-cssvars`)===`skip`,c=r.target.getAttribute(`data-cssvars`)===`src`;a?i=!s&&!c:o&&(s?r.target.setAttribute(`data-cssvars`,``):c&&L(e.rootElement,!0),i=!0)}return i}function a(e){var t=!1;if(e.type===`childList`){var n=r(e.target),i=e.target.getAttribute(`data-cssvars`)===`out`;t=n&&!i}return t}function o(e){var i=!1;return e.type===`childList`&&(i=[].slice.call(e.addedNodes).some((function(e){var i=e.nodeType===1&&e.hasAttribute(`data-cssvars`),a=r(e)&&S.cssVars.test(e.textContent);return!i&&(n(e)||a)&&!t(e)}))),i}function s(t){var n=!1;return t.type===`childList`&&(n=[].slice.call(t.removedNodes).some((function(t){var n=t.nodeType===1,r=n&&t.getAttribute(`data-cssvars`)===`out`,i=n&&t.getAttribute(`data-cssvars`)===`src`,a=i;if(i||r){var o=t.getAttribute(`data-cssvars-group`),s=e.rootElement.querySelector(`[data-cssvars-group="${o}"]`);i&&L(e.rootElement,!0),s&&s.parentNode.removeChild(s)}return a}))),n}window.MutationObserver&&(T&&(T.disconnect(),T=null),T=new MutationObserver((function(t){t.some((function(e){return i(e)||a(e)||o(e)||s(e)}))&&k(e)})),T.observe(document.documentElement,{attributes:!0,attributeFilter:[`disabled`,`href`],childList:!0,subtree:!0}))}function j(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:100;clearTimeout(D),D=setTimeout((function(){e.__benchmark=null,k(e)}),t)}function M(e){var t=[`animation-name`,`-moz-animation-name`,`-webkit-animation-name`].filter((function(e){return getComputedStyle(document.body)[e]}))[0];if(t){for(var n=[].slice.call(e.querySelectorAll(`*`)),r=[],i=`__CSSVARSPONYFILL-KEYFRAMES__`,a=0,o=n.length;a<o;a++){var s=n[a];getComputedStyle(s)[t]!==`none`&&(s.style[t]+=i,r.push(s))}document.body.offsetHeight;for(var c=0,l=r.length;c<l;c++){var u=r[c].style;u[t]=u[t].replace(i,``)}}}function N(e,t){return(e.replace(S.cssComments,``).match(S.cssUrls)||[]).forEach((function(n){var r=n.replace(S.cssUrls,`$1`),i=F(r,t);e=e.replace(n,n.replace(r,i))})),e}function P(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=/^-{2}/;return Object.keys(e).reduce((function(n,r){var i=t.test(r)?r:`--${r.replace(/^-+/,``)}`;return n[i]=e[r],n}),{})}function F(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:location.href,n=document.implementation.createHTMLDocument(``),r=n.createElement(`base`),i=n.createElement(`a`);return n.head.appendChild(r),n.body.appendChild(i),r.href=t,i.href=e,i.href}function I(){return v&&(window.performance||{}).now?window.performance.now():new Date().getTime()}function L(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1];[].slice.call(e.querySelectorAll(`[data-cssvars="skip"],[data-cssvars="src"]`)).forEach((function(e){return e.setAttribute(`data-cssvars`,``)})),t&&(C.dom={})}let R=Object.freeze({UNDEFINED:`undefined`,FUNCTION:`function`,OBJECT:`object`,STRING:`string`,BOOLEAN:`boolean`,NUMBER:`number`});typeof window!==R.UNDEFINED&&k({watch:!0,onlyLegacy:!0,preserveStatic:!1,include:`style,link[rel="stylesheet"]`})})();