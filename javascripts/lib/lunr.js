/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.5.2
 * Copyright (C) 2014 Oliver Nightingale
 * MIT Licensed
 * @license
 */
!function(){var t=function(e){var i=new t.Index;return i.pipeline.add(t.trimmer,t.stopWordFilter,t.stemmer),e&&e.call(i,i),i};t.version="0.5.2",/*!
 * lunr.utils
 * Copyright (C) 2014 Oliver Nightingale
 */
t.utils={},t.utils.warn=function(t){return function(e){t.console&&console.warn&&console.warn(e)}}(this),/*!
 * lunr.EventEmitter
 * Copyright (C) 2014 Oliver Nightingale
 */
t.EventEmitter=function(){this.events={}},t.EventEmitter.prototype.addListener=function(){var t=Array.prototype.slice.call(arguments),e=t.pop(),i=t;if("function"!=typeof e)throw new TypeError("last argument must be a function");i.forEach(function(t){this.hasHandler(t)||(this.events[t]=[]),this.events[t].push(e)},this)},t.EventEmitter.prototype.removeListener=function(t,e){if(this.hasHandler(t)){var i=this.events[t].indexOf(e);this.events[t].splice(i,1),this.events[t].length||delete this.events[t]}},t.EventEmitter.prototype.emit=function(t){if(this.hasHandler(t)){var e=Array.prototype.slice.call(arguments,1);this.events[t].forEach(function(t){t.apply(void 0,e)})}},t.EventEmitter.prototype.hasHandler=function(t){return t in this.events},/*!
 * lunr.tokenizer
 * Copyright (C) 2014 Oliver Nightingale
 */
t.tokenizer=function(t){if(!arguments.length||null==t||void 0==t)return[];if(Array.isArray(t))return t.map(function(t){return t.toLowerCase()});for(var e=t.toString().replace(/^\s+/,""),i=e.length-1;i>=0;i--)if(/\S/.test(e.charAt(i))){e=e.substring(0,i+1);break}return e.split(/\s+/).map(function(t){return t.toLowerCase()})},/*!
 * lunr.Pipeline
 * Copyright (C) 2014 Oliver Nightingale
 */
t.Pipeline=function(){this._stack=[]},t.Pipeline.registeredFunctions={},t.Pipeline.registerFunction=function(e,i){i in this.registeredFunctions&&t.utils.warn("Overwriting existing registered function: "+i),e.label=i,t.Pipeline.registeredFunctions[e.label]=e},t.Pipeline.warnIfFunctionNotRegistered=function(e){var i=e.label&&e.label in this.registeredFunctions;i||t.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},t.Pipeline.load=function(e){var i=new t.Pipeline;return e.forEach(function(e){var n=t.Pipeline.registeredFunctions[e];if(!n)throw new Error("Cannot load un-registered function: "+e);i.add(n)}),i},t.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){t.Pipeline.warnIfFunctionNotRegistered(e),this._stack.push(e)},this)},t.Pipeline.prototype.after=function(e,i){t.Pipeline.warnIfFunctionNotRegistered(i);var n=this._stack.indexOf(e)+1;this._stack.splice(n,0,i)},t.Pipeline.prototype.before=function(e,i){t.Pipeline.warnIfFunctionNotRegistered(i);var n=this._stack.indexOf(e);this._stack.splice(n,0,i)},t.Pipeline.prototype.remove=function(t){var e=this._stack.indexOf(t);this._stack.splice(e,1)},t.Pipeline.prototype.run=function(t){for(var e=[],i=t.length,n=this._stack.length,o=0;i>o;o++){for(var s=t[o],r=0;n>r&&(s=this._stack[r](s,o,t),void 0!==s);r++);void 0!==s&&e.push(s)}return e},t.Pipeline.prototype.reset=function(){this._stack=[]},t.Pipeline.prototype.toJSON=function(){return this._stack.map(function(e){return t.Pipeline.warnIfFunctionNotRegistered(e),e.label})},/*!
 * lunr.Vector
 * Copyright (C) 2014 Oliver Nightingale
 */
t.Vector=function(){this._magnitude=null,this.list=void 0,this.length=0},t.Vector.Node=function(t,e,i){this.idx=t,this.val=e,this.next=i},t.Vector.prototype.insert=function(e,i){var n=this.list;if(!n)return this.list=new t.Vector.Node(e,i,n),this.length++;for(var o=n,s=n.next;void 0!=s;){if(e<s.idx)return o.next=new t.Vector.Node(e,i,s),this.length++;o=s,s=s.next}return o.next=new t.Vector.Node(e,i,s),this.length++},t.Vector.prototype.magnitude=function(){if(this._magniture)return this._magnitude;for(var t,e=this.list,i=0;e;)t=e.val,i+=t*t,e=e.next;return this._magnitude=Math.sqrt(i)},t.Vector.prototype.dot=function(t){for(var e=this.list,i=t.list,n=0;e&&i;)e.idx<i.idx?e=e.next:e.idx>i.idx?i=i.next:(n+=e.val*i.val,e=e.next,i=i.next);return n},t.Vector.prototype.similarity=function(t){return this.dot(t)/(this.magnitude()*t.magnitude())},/*!
 * lunr.SortedSet
 * Copyright (C) 2014 Oliver Nightingale
 */
t.SortedSet=function(){this.length=0,this.elements=[]},t.SortedSet.load=function(t){var e=new this;return e.elements=t,e.length=t.length,e},t.SortedSet.prototype.add=function(){Array.prototype.slice.call(arguments).forEach(function(t){~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t)},this),this.length=this.elements.length},t.SortedSet.prototype.toArray=function(){return this.elements.slice()},t.SortedSet.prototype.map=function(t,e){return this.elements.map(t,e)},t.SortedSet.prototype.forEach=function(t,e){return this.elements.forEach(t,e)},t.SortedSet.prototype.indexOf=function(t,e,i){var e=e||0,i=i||this.elements.length,n=i-e,o=e+Math.floor(n/2),s=this.elements[o];return 1>=n?s===t?o:-1:t>s?this.indexOf(t,o,i):s>t?this.indexOf(t,e,o):s===t?o:void 0},t.SortedSet.prototype.locationFor=function(t,e,i){var e=e||0,i=i||this.elements.length,n=i-e,o=e+Math.floor(n/2),s=this.elements[o];if(1>=n){if(s>t)return o;if(t>s)return o+1}return t>s?this.locationFor(t,o,i):s>t?this.locationFor(t,e,o):void 0},t.SortedSet.prototype.intersect=function(e){for(var i=new t.SortedSet,n=0,o=0,s=this.length,r=e.length,a=this.elements,l=e.elements;;){if(n>s-1||o>r-1)break;a[n]!==l[o]?a[n]<l[o]?n++:a[n]>l[o]&&o++:(i.add(a[n]),n++,o++)}return i},t.SortedSet.prototype.clone=function(){var e=new t.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},t.SortedSet.prototype.union=function(t){var e,i,n;return this.length>=t.length?(e=this,i=t):(e=t,i=this),n=e.clone(),n.add.apply(n,i.toArray()),n},t.SortedSet.prototype.toJSON=function(){return this.toArray()},/*!
 * lunr.Index
 * Copyright (C) 2014 Oliver Nightingale
 */
t.Index=function(){this._fields=[],this._ref="id",this.pipeline=new t.Pipeline,this.documentStore=new t.Store,this.tokenStore=new t.TokenStore,this.corpusTokens=new t.SortedSet,this.eventEmitter=new t.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},t.Index.prototype.on=function(){var t=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,t)},t.Index.prototype.off=function(t,e){return this.eventEmitter.removeListener(t,e)},t.Index.load=function(e){e.version!==t.version&&t.utils.warn("version mismatch: current "+t.version+" importing "+e.version);var i=new this;return i._fields=e.fields,i._ref=e.ref,i.documentStore=t.Store.load(e.documentStore),i.tokenStore=t.TokenStore.load(e.tokenStore),i.corpusTokens=t.SortedSet.load(e.corpusTokens),i.pipeline=t.Pipeline.load(e.pipeline),i},t.Index.prototype.field=function(t,e){var e=e||{},i={name:t,boost:e.boost||1};return this._fields.push(i),this},t.Index.prototype.ref=function(t){return this._ref=t,this},t.Index.prototype.add=function(e,i){var n={},o=new t.SortedSet,s=e[this._ref],i=void 0===i?!0:i;this._fields.forEach(function(i){var s=this.pipeline.run(t.tokenizer(e[i.name]));n[i.name]=s,t.SortedSet.prototype.add.apply(o,s)},this),this.documentStore.set(s,o),t.SortedSet.prototype.add.apply(this.corpusTokens,o.toArray());for(var r=0;r<o.length;r++){var a=o.elements[r],l=this._fields.reduce(function(t,e){var i=n[e.name].length;if(!i)return t;var o=n[e.name].filter(function(t){return t===a}).length;return t+o/i*e.boost},0);this.tokenStore.add(a,{ref:s,tf:l})}i&&this.eventEmitter.emit("add",e,this)},t.Index.prototype.remove=function(t,e){var i=t[this._ref],e=void 0===e?!0:e;if(this.documentStore.has(i)){var n=this.documentStore.get(i);this.documentStore.remove(i),n.forEach(function(t){this.tokenStore.remove(t,i)},this),e&&this.eventEmitter.emit("remove",t,this)}},t.Index.prototype.update=function(t,e){var e=void 0===e?!0:e;this.remove(t,!1),this.add(t,!1),e&&this.eventEmitter.emit("update",t,this)},t.Index.prototype.idf=function(t){var e="@"+t;if(Object.prototype.hasOwnProperty.call(this._idfCache,e))return this._idfCache[e];var i=this.tokenStore.count(t),n=1;return i>0&&(n=1+Math.log(this.tokenStore.length/i)),this._idfCache[e]=n},t.Index.prototype.search=function(e){var i=this.pipeline.run(t.tokenizer(e)),n=new t.Vector,o=[],s=this._fields.reduce(function(t,e){return t+e.boost},0),r=i.some(function(t){return this.tokenStore.has(t)},this);if(!r)return[];i.forEach(function(e,i,r){var a=1/r.length*this._fields.length*s,l=this,c=this.tokenStore.expand(e).reduce(function(i,o){var s=l.corpusTokens.indexOf(o),r=l.idf(o),c=1,h=new t.SortedSet;if(o!==e){var u=Math.max(3,o.length-e.length);c=1/Math.log(u)}return s>-1&&n.insert(s,a*r*c),Object.keys(l.tokenStore.get(o)).forEach(function(t){h.add(t)}),i.union(h)},new t.SortedSet);o.push(c)},this);var a=o.reduce(function(t,e){return t.intersect(e)});return a.map(function(t){return{ref:t,score:n.similarity(this.documentVector(t))}},this).sort(function(t,e){return e.score-t.score})},t.Index.prototype.documentVector=function(e){for(var i=this.documentStore.get(e),n=i.length,o=new t.Vector,s=0;n>s;s++){var r=i.elements[s],a=this.tokenStore.get(r)[e].tf,l=this.idf(r);o.insert(this.corpusTokens.indexOf(r),a*l)}return o},t.Index.prototype.toJSON=function(){return{version:t.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),tokenStore:this.tokenStore.toJSON(),corpusTokens:this.corpusTokens.toJSON(),pipeline:this.pipeline.toJSON()}},t.Index.prototype.use=function(t){var e=Array.prototype.slice.call(arguments,1);e.unshift(this),t.apply(this,e)},/*!
 * lunr.Store
 * Copyright (C) 2014 Oliver Nightingale
 */
t.Store=function(){this.store={},this.length=0},t.Store.load=function(e){var i=new this;return i.length=e.length,i.store=Object.keys(e.store).reduce(function(i,n){return i[n]=t.SortedSet.load(e.store[n]),i},{}),i},t.Store.prototype.set=function(t,e){this.store[t]=e,this.length=Object.keys(this.store).length},t.Store.prototype.get=function(t){return this.store[t]},t.Store.prototype.has=function(t){return t in this.store},t.Store.prototype.remove=function(t){this.has(t)&&(delete this.store[t],this.length--)},t.Store.prototype.toJSON=function(){return{store:this.store,length:this.length}},/*!
 * lunr.stemmer
 * Copyright (C) 2014 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */
t.stemmer=function(){var t={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},e={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},i="[^aeiou]",n="[aeiouy]",o=i+"[^aeiouy]*",s=n+"[aeiou]*",r="^("+o+")?"+s+o,a="^("+o+")?"+s+o+"("+s+")?$",l="^("+o+")?"+s+o+s+o,c="^("+o+")?"+n;return function(i){var s,h,u,d,f,p,g;if(i.length<3)return i;if(u=i.substr(0,1),"y"==u&&(i=u.toUpperCase()+i.substr(1)),d=/^(.+?)(ss|i)es$/,f=/^(.+?)([^s])s$/,d.test(i)?i=i.replace(d,"$1$2"):f.test(i)&&(i=i.replace(f,"$1$2")),d=/^(.+?)eed$/,f=/^(.+?)(ed|ing)$/,d.test(i)){var m=d.exec(i);d=new RegExp(r),d.test(m[1])&&(d=/.$/,i=i.replace(d,""))}else if(f.test(i)){var m=f.exec(i);s=m[1],f=new RegExp(c),f.test(s)&&(i=s,f=/(at|bl|iz)$/,p=new RegExp("([^aeiouylsz])\\1$"),g=new RegExp("^"+o+n+"[^aeiouwxy]$"),f.test(i)?i+="e":p.test(i)?(d=/.$/,i=i.replace(d,"")):g.test(i)&&(i+="e"))}if(d=/^(.+?)y$/,d.test(i)){var m=d.exec(i);s=m[1],d=new RegExp(c),d.test(s)&&(i=s+"i")}if(d=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,d.test(i)){var m=d.exec(i);s=m[1],h=m[2],d=new RegExp(r),d.test(s)&&(i=s+t[h])}if(d=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,d.test(i)){var m=d.exec(i);s=m[1],h=m[2],d=new RegExp(r),d.test(s)&&(i=s+e[h])}if(d=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,f=/^(.+?)(s|t)(ion)$/,d.test(i)){var m=d.exec(i);s=m[1],d=new RegExp(l),d.test(s)&&(i=s)}else if(f.test(i)){var m=f.exec(i);s=m[1]+m[2],f=new RegExp(l),f.test(s)&&(i=s)}if(d=/^(.+?)e$/,d.test(i)){var m=d.exec(i);s=m[1],d=new RegExp(l),f=new RegExp(a),p=new RegExp("^"+o+n+"[^aeiouwxy]$"),(d.test(s)||f.test(s)&&!p.test(s))&&(i=s)}return d=/ll$/,f=new RegExp(l),d.test(i)&&f.test(i)&&(d=/.$/,i=i.replace(d,"")),"y"==u&&(i=u.toLowerCase()+i.substr(1)),i}}(),t.Pipeline.registerFunction(t.stemmer,"stemmer"),/*!
 * lunr.stopWordFilter
 * Copyright (C) 2014 Oliver Nightingale
 */
t.stopWordFilter=function(e){return-1===t.stopWordFilter.stopWords.indexOf(e)?e:void 0},t.stopWordFilter.stopWords=new t.SortedSet,t.stopWordFilter.stopWords.length=119,t.stopWordFilter.stopWords.elements=["","a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"],t.Pipeline.registerFunction(t.stopWordFilter,"stopWordFilter"),/*!
 * lunr.trimmer
 * Copyright (C) 2014 Oliver Nightingale
 */
t.trimmer=function(t){return t.replace(/^\W+/,"").replace(/\W+$/,"")},t.Pipeline.registerFunction(t.trimmer,"trimmer"),/*!
 * lunr.stemmer
 * Copyright (C) 2014 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */
t.TokenStore=function(){this.root={docs:{}},this.length=0},t.TokenStore.load=function(t){var e=new this;return e.root=t.root,e.length=t.length,e},t.TokenStore.prototype.add=function(t,e,i){var i=i||this.root,n=t[0],o=t.slice(1);return n in i||(i[n]={docs:{}}),0===o.length?(i[n].docs[e.ref]=e,void(this.length+=1)):this.add(o,e,i[n])},t.TokenStore.prototype.has=function(t){if(!t)return!1;for(var e=this.root,i=0;i<t.length;i++){if(!e[t[i]])return!1;e=e[t[i]]}return!0},t.TokenStore.prototype.getNode=function(t){if(!t)return{};for(var e=this.root,i=0;i<t.length;i++){if(!e[t[i]])return{};e=e[t[i]]}return e},t.TokenStore.prototype.get=function(t,e){return this.getNode(t,e).docs||{}},t.TokenStore.prototype.count=function(t,e){return Object.keys(this.get(t,e)).length},t.TokenStore.prototype.remove=function(t,e){if(t){for(var i=this.root,n=0;n<t.length;n++){if(!(t[n]in i))return;i=i[t[n]]}delete i.docs[e]}},t.TokenStore.prototype.expand=function(t,e){var i=this.getNode(t),n=i.docs||{},e=e||[];return Object.keys(n).length&&e.push(t),Object.keys(i).forEach(function(i){"docs"!==i&&e.concat(this.expand(t+i,e))},this),e},t.TokenStore.prototype.toJSON=function(){return{root:this.root,length:this.length}},function(t,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():t.lunr=e()}(this,function(){return t})}();