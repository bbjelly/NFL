/*
YUI 3.10.3 (build 655e25f)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("oop",function(e,t){function a(t,n,i,s,o){if(t&&t[o]&&t!==e)return t[o].call(t,n,i);switch(r.test(t)){case 1:return r[o](t,n,i);case 2:return r[o](e.Array(t,0,!0),n,i);default:return e.Object[o](t,n,i,s)}}var n=e.Lang,r=e.Array,i=Object.prototype,s="_~yuim~_",o=i.hasOwnProperty,u=i.toString;e.augment=function(t,n,r,i,s){var a=t.prototype,f=a&&n,l=n.prototype,c=a||t,h,p,d,v,m;return s=s?e.Array(s):[],f&&(p={},d={},v={},h=function(e,t){if(r||!(t in a))u.call(e)==="[object Function]"?(v[t]=e,p[t]=d[t]=function(){return m(this,e,arguments)}):p[t]=e},m=function(e,t,r){for(var i in v)o.call(v,i)&&e[i]===d[i]&&(e[i]=v[i]);return n.apply(e,s),t.apply(e,r)},i?e.Array.each(i,function(e){e in l&&h(l[e],e)}):e.Object.each(l,h,null,!0)),e.mix(c,p||l,r,i),f||n.apply(c,s),t},e.aggregate=function(t,n,r,i){return e.mix(t,n,r,i,0,!0)},e.extend=function(t,n,r,s){(!n||!t)&&e.error("extend failed, verify dependencies");var o=n.prototype,u=e.Object(o);return t.prototype=u,u.constructor=t,t.superclass=o,n!=Object&&o.constructor==i.constructor&&(o.constructor=n),r&&e.mix(u,r,!0),s&&e.mix(t,s,!0),t},e.each=function(e,t,n,r){return a(e,t,n,r,"each")},e.some=function(e,t,n,r){return a(e,t,n,r,"some")},e.clone=function(t,r,i,o,u,a){var f,l,c;if(!n.isObject(t)||e.instanceOf(t,YUI)||t.addEventListener||t.attachEvent)return t;l=a||{};switch(n.type(t)){case"date":return new Date(t);case"regexp":return t;case"function":return t;case"array":f=[];break;default:if(t[s])return l[t[s]];c=e.guid(),f=r?{}:e.Object(t),t[s]=c,l[c]=t}return e.each(t,function(n,a){(a||a===0)&&(!i||i.call(o||this,n,a,this,t)!==!1)&&a!==s&&a!="prototype"&&(this[a]=e.clone(n,r,i,o,u||t,l))},f),a||(e.Object.each(l,function(e,t){if(e[s])try{delete e[s]}catch(n){e[s]=null}},this),l=null),f},e.bind=function(t,r){var i=arguments.length>2?e.Array(arguments,2,!0):null;return function(){var s=n.isString(t)?r[t]:t,o=i?i.concat(e.Array(arguments,0,!0)):arguments;return s.apply(r||s,o)}},e.rbind=function(t,r){var i=arguments.length>2?e.Array(arguments,2,!0):null;return function(){var s=n.isString(t)?r[t]:t,o=i?e.Array(arguments,0,!0).concat(i):arguments;return s.apply(r||s,o)}}},"3.10.3",{requires:["yui-base"]});

;/*
YUI 3.10.3 (build 655e25f)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("event-custom-base",function(e,t){e.Env.evt={handles:{},plugins:{}};var n=0,r=1,i={objs:null,before:function(t,r,i,s){var o=t,u;return s&&(u=[t,s].concat(e.Array(arguments,4,!0)),o=e.rbind.apply(e,u)),this._inject(n,o,r,i)},after:function(t,n,i,s){var o=t,u;return s&&(u=[t,s].concat(e.Array(arguments,4,!0)),o=e.rbind.apply(e,u)),this._inject(r,o,n,i)},_inject:function(t,n,r,i){var s=e.stamp(r),o,u;return r._yuiaop||(r._yuiaop={}),o=r._yuiaop,o[i]||(o[i]=new e.Do.Method(r,i),r[i]=function(){return o[i].exec.apply(o[i],arguments)}),u=s+e.stamp(n)+i,o[i].register(u,n,t),new e.EventHandle(o[i],u)},detach:function(e){e.detach&&e.detach()}};e.Do=i,i.Method=function(e,t){this.obj=e,this.methodName=t,this.method=e[t],this.before={},this.after={}},i.Method.prototype.register=function(e,t,n){n?this.after[e]=t:this.before[e]=t},i.Method.prototype._delete=function(e){delete this.before[e],delete this.after[e]},i.Method.prototype.exec=function(){var t=e.Array(arguments,0,!0),n,r,s,o=this.before,u=this.after,a=!1;for(n in o)if(o.hasOwnProperty(n)){r=o[n].apply(this.obj,t);if(r)switch(r.constructor){case i.Halt:return r.retVal;case i.AlterArgs:t=r.newArgs;break;case i.Prevent:a=!0;break;default:}}a||(r=this.method.apply(this.obj,t)),i.originalRetVal=r,i.currentRetVal=r;for(n in u)if(u.hasOwnProperty(n)){s=u[n].apply(this.obj,t);if(s&&s.constructor===i.Halt)return s.retVal;s&&s.constructor===i.AlterReturn&&(r=s.newRetVal,i.currentRetVal=r)}return r},i.AlterArgs=function(e,t){this.msg=e,this.newArgs=t},i.AlterReturn=function(e,t){this.msg=e,this.newRetVal=t},i.Halt=function(e,t){this.msg=e,this.retVal=t},i.Prevent=function(e){this.msg=e},i.Error=i.Halt;var s=e.Array,o="after",u=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","async","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],a=s.hash(u),f=Array.prototype.slice,l=9,c="yui:log",h=function(e,t,n){var r;for(r in t)a[r]&&(n||!(r in e))&&(e[r]=t[r]);return e};e.CustomEvent=function(t,n){this._kds=e.CustomEvent.keepDeprecatedSubs,this.id=e.guid(),this.type=t,this.silent=this.logSystem=t===c,this._kds&&(this.subscribers={},this.afters={}),n&&h(this,n,!0)},e.CustomEvent.keepDeprecatedSubs=!1,e.CustomEvent.mixConfigs=h,e.CustomEvent.prototype={constructor:e.CustomEvent,signature:l,context:e,preventable:!0,bubbles:!0,hasSubs:function(e){var t=0,n=0,r=this._subscribers,i=this._afters,s=this.sibling;return r&&(t=r.length),i&&(n=i.length),s&&(r=s._subscribers,i=s._afters,r&&(t+=r.length),i&&(n+=i.length)),e?e==="after"?n:t:t+n},monitor:function(e){this.monitored=!0;var t=this.id+"|"+this.type+"_"+e,n=f.call(arguments,0);return n[0]=t,this.host.on.apply(this.host,n)},getSubs:function(){var e=this.sibling,t=this._subscribers,n=this._afters,r,i;return e&&(r=e._subscribers,i=e._afters),r?t?t=t.concat(r):t=r.concat():t?t=t.concat():t=[],i?n?n=n.concat(i):n=i.concat():n?n=n.concat():n=[],[t,n]},applyConfig:function(e,t){h(this,e,t)},_on:function(t,n,r,i){var s=new e.Subscriber(t,n,r,i);return this.fireOnce&&this.fired&&(this.async?setTimeout(e.bind(this._notify,this,s,this.firedWith),0):this._notify(s,this.firedWith)),i===o?(this._afters||(this._afters=[],this._hasAfters=!0),this._afters.push(s)):(this._subscribers||(this._subscribers=[],this._hasSubs=!0),this._subscribers.push(s)),this._kds&&(i===o?this.afters[s.id]=s:this.subscribers[s.id]=s),new e.EventHandle(this,s)},subscribe:function(e,t){var n=arguments.length>2?f.call(arguments,2):null;return this._on(e,t,n,!0)},on:function(e,t){var n=arguments.length>2?f.call(arguments,2):null;return this.monitored&&this.host&&this.host._monitor("attach",this,{args:arguments}),this._on(e,t,n,!0)},after:function(e,t){var n=arguments.length>2?f.call(arguments,2):null;return this._on(e,t,n,o)},detach:function(e,t){if(e&&e.detach)return e.detach();var n,r,i=0,s=this._subscribers,o=this._afters;if(s)for(n=s.length;n>=0;n--)r=s[n],r&&(!e||e===r.fn)&&(this._delete(r,s,n),i++);if(o)for(n=o.length;n>=0;n--)r=o[n],r&&(!e||e===r.fn)&&(this._delete(r,o,n),i++);return i},unsubscribe:function(){return this.detach.apply(this,arguments)},_notify:function(e,t,n){var r;return r=e.notify(t,this),!1===r||this.stopped>1?!1:!0},log:function(e,t){},fire:function(){var e=[];return e.push.apply(e,arguments),this._fire(e)},_fire:function(e){return this.fireOnce&&this.fired?!0:(this.fired=!0,this.fireOnce&&(this.firedWith=e),this.emitFacade?this.fireComplex(e):this.fireSimple(e))},fireSimple:function(e){this.stopped=0,this.prevented=0;if(this.hasSubs()){var t=this.getSubs();this._procSubs(t[0],e),this._procSubs(t[1],e)}return this.broadcast&&this._broadcast(e),this.stopped?!1:!0},fireComplex:function(e){return e[0]=e[0]||{},this.fireSimple(e)},_procSubs:function(e,t,n){var r,i,s;for(i=0,s=e.length;i<s;i++){r=e[i];if(r&&r.fn){!1===this._notify(r,t,n)&&(this.stopped=2);if(this.stopped===2)return!1}}return!0},_broadcast:function(t){if(!this.stopped&&this.broadcast){var n=t.concat();n.unshift(this.type),this.host!==e&&e.fire.apply(e,n),this.broadcast===2&&e.Global.fire.apply(e.Global,n)}},unsubscribeAll:function(){return this.detachAll.apply(this,arguments)},detachAll:function(){return this.detach()},_delete:function(e,t,n){var r=e._when;t||(t=r===o?this._afters:this._subscribers),t&&(n=s.indexOf(t,e,0),e&&t[n]===e&&(t.splice(n,1),t.length===0&&(r===o?this._hasAfters=!1:this._hasSubs=!1))),this._kds&&(r===o?delete this.afters[e.id]:delete this.subscribers[e.id]),this.monitored&&this.host&&this.host._monitor("detach",this,{ce:this,sub:e}),e&&(e.deleted=!0)}},e.Subscriber=function(t,n,r,i){this.fn=t,this.context=n,this.id=e.guid(),this.args=r,this._when=i},e.Subscriber.prototype={constructor:e.Subscriber,_notify:function(e,t,n){if(this.deleted&&!this.postponed){if(!this.postponed)return delete this.postponed,null;delete this.fn,delete this.context}var r=this.args,i;switch(n.signature){case 0:i=this.fn.call(e,n.type,t,e);break;case 1
:i=this.fn.call(e,t[0]||null,e);break;default:r||t?(t=t||[],r=r?t.concat(r):t,i=this.fn.apply(e,r)):i=this.fn.call(e)}return this.once&&n._delete(this),i},notify:function(t,n){var r=this.context,i=!0;r||(r=n.contextFn?n.contextFn():n.context);if(e.config&&e.config.throwFail)i=this._notify(r,t,n);else try{i=this._notify(r,t,n)}catch(s){e.error(this+" failed: "+s.message,s)}return i},contains:function(e,t){return t?this.fn===e&&this.context===t:this.fn===e},valueOf:function(){return this.id}},e.EventHandle=function(e,t){this.evt=e,this.sub=t},e.EventHandle.prototype={batch:function(t,n){t.call(n||this,this),e.Lang.isArray(this.evt)&&e.Array.each(this.evt,function(e){e.batch.call(n||e,t)})},detach:function(){var t=this.evt,n=0,r;if(t)if(e.Lang.isArray(t))for(r=0;r<t.length;r++)n+=t[r].detach();else t._delete(this.sub),n=1;return n},monitor:function(e){return this.evt.monitor.apply(this.evt,arguments)}};var p=e.Lang,d=":",v="|",m="~AFTER~",g=/(.*?)(:)(.*?)/,y=e.cached(function(e){return e.replace(g,"*$2$3")}),b=function(e,t){return!t||e.indexOf(d)>-1?e:t+d+e},w=e.cached(function(e,t){var n=e,r,i,s;return p.isString(n)?(s=n.indexOf(m),s>-1&&(i=!0,n=n.substr(m.length)),s=n.indexOf(v),s>-1&&(r=n.substr(0,s),n=n.substr(s+1),n==="*"&&(n=null)),[r,t?b(n,t):n,i,n]):n}),E=function(t){var n=this._yuievt,r;n||(n=this._yuievt={events:{},targets:null,config:{host:this,context:this},chain:e.config.chain}),r=n.config,t&&(h(r,t,!0),t.chain!==undefined&&(n.chain=t.chain),t.prefix&&(r.prefix=t.prefix))};E.prototype={constructor:E,once:function(){var e=this.on.apply(this,arguments);return e.batch(function(e){e.sub&&(e.sub.once=!0)}),e},onceAfter:function(){var e=this.after.apply(this,arguments);return e.batch(function(e){e.sub&&(e.sub.once=!0)}),e},parseType:function(e,t){return w(e,t||this._yuievt.config.prefix)},on:function(t,n,r){var i=this._yuievt,s=w(t,i.config.prefix),o,u,a,l,c,h,d,v=e.Env.evt.handles,g,y,b,E=e.Node,S,x,T;this._monitor("attach",s[1],{args:arguments,category:s[0],after:s[2]});if(p.isObject(t))return p.isFunction(t)?e.Do.before.apply(e.Do,arguments):(o=n,u=r,a=f.call(arguments,0),l=[],p.isArray(t)&&(T=!0),g=t._after,delete t._after,e.each(t,function(e,t){p.isObject(e)&&(o=e.fn||(p.isFunction(e)?e:o),u=e.context||u);var n=g?m:"";a[0]=n+(T?e:t),a[1]=o,a[2]=u,l.push(this.on.apply(this,a))},this),i.chain?this:new e.EventHandle(l));h=s[0],g=s[2],b=s[3];if(E&&e.instanceOf(this,E)&&b in E.DOM_EVENTS)return a=f.call(arguments,0),a.splice(2,0,E.getDOMNode(this)),e.on.apply(e,a);t=s[1];if(e.instanceOf(this,YUI)){y=e.Env.evt.plugins[t],a=f.call(arguments,0),a[0]=b,E&&(S=a[2],e.instanceOf(S,e.NodeList)?S=e.NodeList.getDOMNodes(S):e.instanceOf(S,E)&&(S=E.getDOMNode(S)),x=b in E.DOM_EVENTS,x&&(a[2]=S));if(y)d=y.on.apply(e,a);else if(!t||x)d=e.Event._attach(a)}return d||(c=i.events[t]||this.publish(t),d=c._on(n,r,arguments.length>3?f.call(arguments,3):null,g?"after":!0),t.indexOf("*:")!==-1&&(this._hasSiblings=!0)),h&&(v[h]=v[h]||{},v[h][t]=v[h][t]||[],v[h][t].push(d)),i.chain?this:d},subscribe:function(){return this.on.apply(this,arguments)},detach:function(t,n,r){var i=this._yuievt.events,s,o=e.Node,u=o&&e.instanceOf(this,o);if(!t&&this!==e){for(s in i)i.hasOwnProperty(s)&&i[s].detach(n,r);return u&&e.Event.purgeElement(o.getDOMNode(this)),this}var a=w(t,this._yuievt.config.prefix),l=p.isArray(a)?a[0]:null,c=a?a[3]:null,h,d=e.Env.evt.handles,v,m,g,y,b=function(e,t,n){var r=e[t],i,s;if(r)for(s=r.length-1;s>=0;--s)i=r[s].evt,(i.host===n||i.el===n)&&r[s].detach()};if(l){m=d[l],t=a[1],v=u?e.Node.getDOMNode(this):this;if(m){if(t)b(m,t,v);else for(s in m)m.hasOwnProperty(s)&&b(m,s,v);return this}}else{if(p.isObject(t)&&t.detach)return t.detach(),this;if(u&&(!c||c in o.DOM_EVENTS))return g=f.call(arguments,0),g[2]=o.getDOMNode(this),e.detach.apply(e,g),this}h=e.Env.evt.plugins[c];if(e.instanceOf(this,YUI)){g=f.call(arguments,0);if(h&&h.detach)return h.detach.apply(e,g),this;if(!t||!h&&o&&t in o.DOM_EVENTS)return g[0]=t,e.Event.detach.apply(e.Event,g),this}return y=i[a[1]],y&&y.detach(n,r),this},unsubscribe:function(){return this.detach.apply(this,arguments)},detachAll:function(e){return this.detach(e)},unsubscribeAll:function(){return this.detachAll.apply(this,arguments)},publish:function(t,n){var r,i=this._yuievt,s=i.config,o=s.prefix;return typeof t=="string"?(o&&(t=b(t,o)),r=this._publish(t,s,n)):(r={},e.each(t,function(e,t){o&&(t=b(t,o)),r[t]=this._publish(t,s,e||n)},this)),r},_getFullType:function(e){var t=this._yuievt.config.prefix;return t?t+d+e:e},_publish:function(t,n,r){var i,s=this._yuievt,o=s.config,u=o.host,a=o.context,f=s.events;return i=f[t],(o.monitored&&!i||i&&i.monitored)&&this._monitor("publish",t,{args:arguments}),i||(i=f[t]=new e.CustomEvent(t,n),n||(i.host=u,i.context=a)),r&&h(i,r,!0),i},_monitor:function(e,t,n){var r,i,s;if(t){typeof t=="string"?(s=t,i=this.getEvent(t,!0)):(i=t,s=t.type);if(this._yuievt.config.monitored&&(!i||i.monitored)||i&&i.monitored)r=s+"_"+e,n.monitored=e,this.fire.call(this,r,n)}},fire:function(e){var t=typeof e=="string",n=arguments.length,r=e,i=this._yuievt,s=i.config,o=s.prefix,u,a,l,c;t&&n<=3?n===2?c=[arguments[1]]:n===3?c=[arguments[1],arguments[2]]:c=[]:c=f.call(arguments,t?1:0),t||(r=e&&e.type),o&&(r=b(r,o)),a=i.events[r],this._hasSiblings&&(l=this.getSibling(r,a),l&&!a&&(a=this.publish(r))),(s.monitored&&(!a||a.monitored)||a&&a.monitored)&&this._monitor("fire",a||r,{args:c});if(!a){if(i.hasTargets)return this.bubble({type:r},c,this);u=!0}else l&&(a.sibling=l),u=a._fire(c);return i.chain?this:u},getSibling:function(e,t){var n;return e.indexOf(d)>-1&&(e=y(e),n=this.getEvent(e,!0),n&&(n.applyConfig(t),n.bubbles=!1,n.broadcast=0)),n},getEvent:function(e,t){var n,r;return t||(n=this._yuievt.config.prefix,e=n?b(e,n):e),r=this._yuievt.events,r[e]||null},after:function(t,n){var r=f.call(arguments,0);switch(p.type(t)){case"function":return e.Do.after.apply(e.Do,arguments);case"array":case"object":r[0]._after=!0;break;default:r[0]=m+t}return this.on.apply(this,r)},
before:function(){return this.on.apply(this,arguments)}},e.EventTarget=E,e.mix(e,E.prototype),E.call(e,{bubbles:!1}),YUI.Env.globalEvents=YUI.Env.globalEvents||new E,e.Global=YUI.Env.globalEvents},"3.10.3",{requires:["oop"]});

;/*
YUI 3.10.3 (build 655e25f)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

(function(){var e=YUI.Env;e._ready||(e._ready=function(){e.DOMReady=!0,e.remove(YUI.config.doc,"DOMContentLoaded",e._ready)},e.add(YUI.config.doc,"DOMContentLoaded",e._ready))})(),YUI.add("event-base",function(e,t){e.publish("domready",{fireOnce:!0,async:!0}),YUI.Env.DOMReady?e.fire("domready"):e.Do.before(function(){e.fire("domready")},YUI.Env,"_ready");var n=e.UA,r={},i={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9,63272:46,63273:36,63275:35},s=function(t){if(!t)return t;try{t&&3==t.nodeType&&(t=t.parentNode)}catch(n){return null}return e.one(t)},o=function(e,t,n){this._event=e,this._currentTarget=t,this._wrapper=n||r,this.init()};e.extend(o,Object,{init:function(){var e=this._event,t=this._wrapper.overrides,r=e.pageX,o=e.pageY,u,a=this._currentTarget;this.altKey=e.altKey,this.ctrlKey=e.ctrlKey,this.metaKey=e.metaKey,this.shiftKey=e.shiftKey,this.type=t&&t.type||e.type,this.clientX=e.clientX,this.clientY=e.clientY,this.pageX=r,this.pageY=o,u=e.keyCode||e.charCode,n.webkit&&u in i&&(u=i[u]),this.keyCode=u,this.charCode=u,this.which=e.which||e.charCode||u,this.button=this.which,this.target=s(e.target),this.currentTarget=s(a),this.relatedTarget=s(e.relatedTarget);if(e.type=="mousewheel"||e.type=="DOMMouseScroll")this.wheelDelta=e.detail?e.detail*-1:Math.round(e.wheelDelta/80)||(e.wheelDelta<0?-1:1);this._touch&&this._touch(e,a,this._wrapper)},stopPropagation:function(){this._event.stopPropagation(),this._wrapper.stopped=1,this.stopped=1},stopImmediatePropagation:function(){var e=this._event;e.stopImmediatePropagation?e.stopImmediatePropagation():this.stopPropagation(),this._wrapper.stopped=2,this.stopped=2},preventDefault:function(e){var t=this._event;t.preventDefault(),t.returnValue=e||!1,this._wrapper.prevented=1,this.prevented=1},halt:function(e){e?this.stopImmediatePropagation():this.stopPropagation(),this.preventDefault()}}),o.resolve=s,e.DOM2EventFacade=o,e.DOMEventFacade=o,function(){e.Env.evt.dom_wrappers={},e.Env.evt.dom_map={};var t=e.Env.evt,n=e.config,r=n.win,i=YUI.Env.add,s=YUI.Env.remove,o=function(){YUI.Env.windowLoaded=!0,e.Event._load(),s(r,"load",o)},u=function(){e.Event._unload()},a="domready",f="~yui|2|compat~",l=function(t){try{return t&&typeof t!="string"&&e.Lang.isNumber(t.length)&&!t.tagName&&!e.DOM.isWindow(t)}catch(n){return!1}},c=e.CustomEvent.prototype._delete,h=function(t){var n=c.apply(this,arguments);return this.hasSubs()||e.Event._clean(this),n},p=function(){var n=!1,o=0,c=[],d=t.dom_wrappers,v=null,m=t.dom_map;return{POLL_RETRYS:1e3,POLL_INTERVAL:40,lastError:null,_interval:null,_dri:null,DOMReady:!1,startInterval:function(){p._interval||(p._interval=setInterval(p._poll,p.POLL_INTERVAL))},onAvailable:function(t,n,r,i,s,u){var a=e.Array(t),f,l;for(f=0;f<a.length;f+=1)c.push({id:a[f],fn:n,obj:r,override:i,checkReady:s,compat:u});return o=this.POLL_RETRYS,setTimeout(p._poll,0),l=new e.EventHandle({_delete:function(){if(l.handle){l.handle.detach();return}var e,t;for(e=0;e<a.length;e++)for(t=0;t<c.length;t++)a[e]===c[t].id&&c.splice(t,1)}}),l},onContentReady:function(e,t,n,r,i){return p.onAvailable(e,t,n,r,!0,i)},attach:function(t,n,r,i){return p._attach(e.Array(arguments,0,!0))},_createWrapper:function(t,n,s,o,u){var a,f=e.stamp(t),l="event:"+f+n;return!1===u&&(l+="native"),s&&(l+="capture"),a=d[l],a||(a=e.publish(l,{silent:!0,bubbles:!1,emitFacade:!1,contextFn:function(){return o?a.el:(a.nodeRef=a.nodeRef||e.one(a.el),a.nodeRef)}}),a.overrides={},a.el=t,a.key=l,a.domkey=f,a.type=n,a.fn=function(e){a.fire(p.getEvent(e,t,o||!1===u))},a.capture=s,t==r&&n=="load"&&(a.fireOnce=!0,v=l),a._delete=h,d[l]=a,m[f]=m[f]||{},m[f][l]=a,i(t,n,a.fn,s)),a},_attach:function(t,n){var i,s,o,u,a,c=!1,h,d=t[0],v=t[1],m=t[2]||r,g=n&&n.facade,y=n&&n.capture,b=n&&n.overrides;t[t.length-1]===f&&(i=!0);if(!v||!v.call)return!1;if(l(m))return s=[],e.each(m,function(e,r){t[2]=e,s.push(p._attach(t.slice(),n))}),new e.EventHandle(s);if(e.Lang.isString(m)){if(i)o=e.DOM.byId(m);else{o=e.Selector.query(m);switch(o.length){case 0:o=null;break;case 1:o=o[0];break;default:return t[2]=o,p._attach(t,n)}}if(!o)return h=p.onAvailable(m,function(){h.handle=p._attach(t,n)},p,!0,!1,i),h;m=o}return m?(e.Node&&e.instanceOf(m,e.Node)&&(m=e.Node.getDOMNode(m)),u=p._createWrapper(m,d,y,i,g),b&&e.mix(u.overrides,b),m==r&&d=="load"&&YUI.Env.windowLoaded&&(c=!0),i&&t.pop(),a=t[3],h=u._on(v,a,t.length>4?t.slice(4):null),c&&u.fire(),h):!1},detach:function(t,n,r,i){var s=e.Array(arguments,0,!0),o,u,a,c,h,v;s[s.length-1]===f&&(o=!0);if(t&&t.detach)return t.detach();typeof r=="string"&&(o?r=e.DOM.byId(r):(r=e.Selector.query(r),u=r.length,u<1?r=null:u==1&&(r=r[0])));if(!r)return!1;if(r.detach)return s.splice(2,1),r.detach.apply(r,s);if(l(r)){a=!0;for(c=0,u=r.length;c<u;++c)s[2]=r[c],a=e.Event.detach.apply(e.Event,s)&&a;return a}return!t||!n||!n.call?p.purgeElement(r,!1,t):(h="event:"+e.stamp(r)+t,v=d[h],v?v.detach(n):!1)},getEvent:function(t,n,i){var s=t||r.event;return i?s:new e.DOMEventFacade(s,n,d["event:"+e.stamp(n)+t.type])},generateId:function(t){return e.DOM.generateID(t)},_isValidCollection:l,_load:function(t){n||(n=!0,e.fire&&e.fire(a),p._poll())},_poll:function(){if(p.locked)return;if(e.UA.ie&&!YUI.Env.DOMReady){p.startInterval();return}p.locked=!0;var t,r,i,s,u,a,f=!n;f||(f=o>0),u=[],a=function(t,n){var r,i=n.override;try{n.compat?(n.override?i===!0?r=n.obj:r=i:r=t,n.fn.call(r,n.obj)):(r=n.obj||e.one(t),n.fn.apply(r,e.Lang.isArray(i)?i:[]))}catch(s){}};for(t=0,r=c.length;t<r;++t)i=c[t],i&&!i.checkReady&&(s=i.compat?e.DOM.byId(i.id):e.Selector.query(i.id,null,!0),s?(a(s,i),c[t]=null):u.push(i));for(t=0,r=c.length;t<r;++t){i=c[t];if(i&&i.checkReady){s=i.compat?e.DOM.byId(i.id):e.Selector.query(i.id,null,!0);if(s){if(n||s.get&&s.get("nextSibling")||s.nextSibling)a(s,i),c[t]=null}else u.push(i)}}o=u.length===0?0:o-1,f?p.startInterval():(clearInterval(p._interval),p._interval=null),p.locked=!1;return},purgeElement:function(t,n,r){var i=e.Lang.isString(t)?e.Selector.query(t,null,!0):t,s=p.getListeners
(i,r),o,u,a,f;if(n&&i){s=s||[],a=e.Selector.query("*",i),u=a.length;for(o=0;o<u;++o)f=p.getListeners(a[o],r),f&&(s=s.concat(f))}if(s)for(o=0,u=s.length;o<u;++o)s[o].detachAll()},_clean:function(t){var n=t.key,r=t.domkey;s(t.el,t.type,t.fn,t.capture),delete d[n],delete e._yuievt.events[n],m[r]&&(delete m[r][n],e.Object.size(m[r])||delete m[r])},getListeners:function(n,r){var i=e.stamp(n,!0),s=m[i],o=[],u=r?"event:"+i+r:null,a=t.plugins;return s?(u?(a[r]&&a[r].eventDef&&(u+="_synth"),s[u]&&o.push(s[u]),u+="native",s[u]&&o.push(s[u])):e.each(s,function(e,t){o.push(e)}),o.length?o:null):null},_unload:function(t){e.each(d,function(e,n){e.type=="unload"&&e.fire(t),e.detachAll()}),s(r,"unload",u)},nativeAdd:i,nativeRemove:s}}();e.Event=p,n.injected||YUI.Env.windowLoaded?o():i(r,"load",o),e.UA.ie&&e.on(a,p._poll);try{i(r,"unload",u)}catch(d){}p.Custom=e.CustomEvent,p.Subscriber=e.Subscriber,p.Target=e.EventTarget,p.Handle=e.EventHandle,p.Facade=e.EventFacade,p._poll()}(),e.Env.evt.plugins.available={on:function(t,n,r,i){var s=arguments.length>4?e.Array(arguments,4,!0):null;return e.Event.onAvailable.call(e.Event,r,n,i,s)}},e.Env.evt.plugins.contentready={on:function(t,n,r,i){var s=arguments.length>4?e.Array(arguments,4,!0):null;return e.Event.onContentReady.call(e.Event,r,n,i,s)}}},"3.10.3",{requires:["event-custom-base"]});