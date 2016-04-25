/*
YUI 3.10.3 (build 655e25f)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("querystring-parse",function(e,t){var n=e.namespace("QueryString"),r=function(t){return function r(i,s){var o,u,a,f,l;return arguments.length!==2?(i=i.split(t),r(n.unescape(i.shift()),n.unescape(i.join(t)))):(i=i.replace(/^\s+|\s+$/g,""),e.Lang.isString(s)&&(s=s.replace(/^\s+|\s+$/g,""),isNaN(s)||(u=+s,s===u.toString(10)&&(s=u))),o=/(.*)\[([^\]]*)\]$/.exec(i),o?(f=o[2],a=o[1],f?(l={},l[f]=s,r(a,l)):r(a,[s])):(l={},i&&(l[i]=s),l))}},i=function(t,n){return t?e.Lang.isArray(t)?t.concat(n):!e.Lang.isObject(t)||!e.Lang.isObject(n)?[t].concat(n):s(t,n):n},s=function(e,t){for(var n in t)n&&t.hasOwnProperty(n)&&(e[n]=i(e[n],t[n]));return e};n.parse=function(t,n,s){return e.Array.reduce(e.Array.map(t.split(n||"&"),r(s||"=")),{},i)},n.unescape=function(e){return decodeURIComponent(e.replace(/\+/g," "))}},"3.10.3",{requires:["yui-base","array-extras"]});

;/*
YUI 3.10.3 (build 655e25f)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("querystring-stringify",function(e,t){var n=e.namespace("QueryString"),r=[],i=e.Lang;n.escape=encodeURIComponent,n.stringify=function(e,t,s){var o,u,a,f,l,c,h=t&&t.sep?t.sep:"&",p=t&&t.eq?t.eq:"=",d=t&&t.arrayKey?t.arrayKey:!1;if(i.isNull(e)||i.isUndefined(e)||i.isFunction(e))return s?n.escape(s)+p:"";if(i.isBoolean(e)||Object.prototype.toString.call(e)==="[object Boolean]")e=+e;if(i.isNumber(e)||i.isString(e))return n.escape(s)+p+n.escape(e);if(i.isArray(e)){c=[],s=d?s+"[]":s,f=e.length;for(a=0;a<f;a++)c.push(n.stringify(e[a],t,s));return c.join(h)}for(a=r.length-1;a>=0;--a)if(r[a]===e)throw new Error("QueryString.stringify. Cyclical reference");r.push(e),c=[],o=s?s+"[":"",u=s?"]":"";for(a in e)e.hasOwnProperty(a)&&(l=o+a+u,c.push(n.stringify(e[a],t,l)));return r.pop(),c=c.join(h),!c&&s?s+"=":c}},"3.10.3",{requires:["yui-base"]});
