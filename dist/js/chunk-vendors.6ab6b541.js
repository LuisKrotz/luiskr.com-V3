(self["webpackChunkluiskr_com"]=self["webpackChunkluiskr_com"]||[]).push([[998],{444:function(e,t,n){"use strict";n.d(t,{$s:function(){return Y},BH:function(){return m},DV:function(){return M},GJ:function(){return A},L:function(){return u},LL:function(){return k},Pz:function(){return P},UI:function(){return L},US:function(){return c},X3:function(){return ne},Yr:function(){return w},ZR:function(){return T},b$:function(){return v},cI:function(){return x},dS:function(){return W},eu:function(){return C},g5:function(){return o},gK:function(){return B},gQ:function(){return $},h$:function(){return l},hl:function(){return b},hu:function(){return r},m9:function(){return J},p$:function(){return d},r3:function(){return D},ru:function(){return y},uI:function(){return _},ug:function(){return H},vZ:function(){return j},w9:function(){return O},xO:function(){return U},xb:function(){return F},zI:function(){return I}});
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const i={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"},r=function(e,t){if(!e)throw o(t)},o=function(e){return new Error("Firebase Database ("+i.SDK_VERSION+") INTERNAL ASSERT FAILED: "+e)},s=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let r=e.charCodeAt(i);r<128?t[n++]=r:r<2048?(t[n++]=r>>6|192,t[n++]=63&r|128):55296===(64512&r)&&i+1<e.length&&56320===(64512&e.charCodeAt(i+1))?(r=65536+((1023&r)<<10)+(1023&e.charCodeAt(++i)),t[n++]=r>>18|240,t[n++]=r>>12&63|128,t[n++]=r>>6&63|128,t[n++]=63&r|128):(t[n++]=r>>12|224,t[n++]=r>>6&63|128,t[n++]=63&r|128)}return t},a=function(e){const t=[];let n=0,i=0;while(n<e.length){const r=e[n++];if(r<128)t[i++]=String.fromCharCode(r);else if(r>191&&r<224){const o=e[n++];t[i++]=String.fromCharCode((31&r)<<6|63&o)}else if(r>239&&r<365){const o=e[n++],s=e[n++],a=e[n++],c=((7&r)<<18|(63&o)<<12|(63&s)<<6|63&a)-65536;t[i++]=String.fromCharCode(55296+(c>>10)),t[i++]=String.fromCharCode(56320+(1023&c))}else{const o=e[n++],s=e[n++];t[i++]=String.fromCharCode((15&r)<<12|(63&o)<<6|63&s)}}return t.join("")},c={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"===typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<e.length;r+=3){const t=e[r],o=r+1<e.length,s=o?e[r+1]:0,a=r+2<e.length,c=a?e[r+2]:0,l=t>>2,u=(3&t)<<4|s>>4;let h=(15&s)<<2|c>>6,d=63&c;a||(d=64,o||(h=64)),i.push(n[l],n[u],n[h],n[d])}return i.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(s(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):a(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<e.length;){const t=n[e.charAt(r++)],o=r<e.length,s=o?n[e.charAt(r)]:0;++r;const a=r<e.length,c=a?n[e.charAt(r)]:64;++r;const l=r<e.length,u=l?n[e.charAt(r)]:64;if(++r,null==t||null==s||null==c||null==u)throw Error();const h=t<<2|s>>4;if(i.push(h),64!==c){const e=s<<4&240|c>>2;if(i.push(e),64!==u){const e=c<<6&192|u;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},l=function(e){const t=s(e);return c.encodeByteArray(t,!0)},u=function(e){return l(e).replace(/\./g,"")},h=function(e){try{return c.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function d(e){return f(void 0,e)}function f(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:const n=t;return new Date(n.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(const n in t)t.hasOwnProperty(n)&&p(n)&&(e[n]=f(e[n],t[n]));return e}function p(e){return"__proto__"!==e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"===typeof e&&(this.promise.catch((()=>{})),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function g(){return"undefined"!==typeof navigator&&"string"===typeof navigator["userAgent"]?navigator["userAgent"]:""}function _(){return"undefined"!==typeof window&&!!(window["cordova"]||window["phonegap"]||window["PhoneGap"])&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(g())}function y(){const e="object"===typeof chrome?chrome.runtime:"object"===typeof browser?browser.runtime:void 0;return"object"===typeof e&&void 0!==e.id}function v(){return"object"===typeof navigator&&"ReactNative"===navigator["product"]}function w(){return!0===i.NODE_CLIENT||!0===i.NODE_ADMIN}function b(){return"object"===typeof indexedDB}function C(){return new Promise(((e,t)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(i),e(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var e;t((null===(e=r.error)||void 0===e?void 0:e.message)||"")}}catch(n){t(n)}}))}function I(){return!("undefined"===typeof navigator||!navigator.cookieEnabled)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const E="FirebaseError";class T extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=E,Object.setPrototypeOf(this,T.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,k.prototype.create)}}class k{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?S(r,n):"Error",s=`${this.serviceName}: ${o} (${i}).`,a=new T(i,s,n);return a}}function S(e,t){return e.replace(N,((e,n)=>{const i=t[n];return null!=i?String(i):`<${n}?>`}))}const N=/\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(e){return JSON.parse(e)}function P(e){return JSON.stringify(e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R=function(e){let t={},n={},i={},r="";try{const o=e.split(".");t=x(h(o[0])||""),n=x(h(o[1])||""),r=o[2],i=n["d"]||{},delete n["d"]}catch(o){}return{header:t,claims:n,data:i,signature:r}},O=function(e){const t=R(e),n=t.claims;return!!n&&"object"===typeof n&&n.hasOwnProperty("iat")},A=function(e){const t=R(e).claims;return"object"===typeof t&&!0===t["admin"]};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function D(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function M(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0}function F(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function L(e,t,n){const i={};for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&(i[r]=t.call(n,e[r],r,e));return i}function j(e,t){if(e===t)return!0;const n=Object.keys(e),i=Object.keys(t);for(const r of n){if(!i.includes(r))return!1;const n=e[r],o=t[r];if(q(n)&&q(o)){if(!j(n,o))return!1}else if(n!==o)return!1}for(const r of i)if(!n.includes(r))return!1;return!0}function q(e){return null!==e&&"object"===typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U(e){const t=[];for(const[n,i]of Object.entries(e))Array.isArray(i)?i.forEach((e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))})):t.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return t.length?"&"+t.join("&"):""}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ${constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const n=this.W_;if("string"===typeof e)for(let u=0;u<16;u++)n[u]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let u=0;u<16;u++)n[u]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let u=16;u<80;u++){const e=n[u-3]^n[u-8]^n[u-14]^n[u-16];n[u]=4294967295&(e<<1|e>>>31)}let i,r,o=this.chain_[0],s=this.chain_[1],a=this.chain_[2],c=this.chain_[3],l=this.chain_[4];for(let u=0;u<80;u++){u<40?u<20?(i=c^s&(a^c),r=1518500249):(i=s^a^c,r=1859775393):u<60?(i=s&a|c&(s|a),r=2400959708):(i=s^a^c,r=3395469782);const e=(o<<5|o>>>27)+i+l+r+n[u]&4294967295;l=c,c=a,a=4294967295&(s<<30|s>>>2),s=o,o=e}this.chain_[0]=this.chain_[0]+o&4294967295,this.chain_[1]=this.chain_[1]+s&4294967295,this.chain_[2]=this.chain_[2]+a&4294967295,this.chain_[3]=this.chain_[3]+c&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,t){if(null==e)return;void 0===t&&(t=e.length);const n=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;while(i<t){if(0===o)while(i<=n)this.compress_(e,i),i+=this.blockSize;if("string"===typeof e){while(i<t)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else while(i<t)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=255&t,t/=256;this.compress_(this.buf_);let n=0;for(let i=0;i<5;i++)for(let t=24;t>=0;t-=8)e[n]=this.chain_[i]>>t&255,++n;return e}}function B(e,t){return`${e} failed: ${t} argument `}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const W=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let o=e.charCodeAt(i);if(o>=55296&&o<=56319){const t=o-55296;i++,r(i<e.length,"Surrogate pair missing trail surrogate.");const n=e.charCodeAt(i)-56320;o=65536+(t<<10)+n}o<128?t[n++]=o:o<2048?(t[n++]=o>>6|192,t[n++]=63&o|128):o<65536?(t[n++]=o>>12|224,t[n++]=o>>6&63|128,t[n++]=63&o|128):(t[n++]=o>>18|240,t[n++]=o>>12&63|128,t[n++]=o>>6&63|128,t[n++]=63&o|128)}return t},H=function(e){let t=0;for(let n=0;n<e.length;n++){const i=e.charCodeAt(n);i<128?t++:i<2048?t+=2:i>=55296&&i<=56319?(t+=4,n++):t+=3}return t},z=1e3,V=2,G=144e5,K=.5;function Y(e,t=z,n=V){const i=t*Math.pow(n,e),r=Math.round(K*i*(Math.random()-.5)*2);return Math.min(G,i+r)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function J(e){return e&&e._delegate?e._delegate:e}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(e,t){return new Promise(((n,i)=>{e.onsuccess=e=>{n(e.target.result)},e.onerror=e=>{var n;i(`${t}: ${null===(n=e.target.error)||void 0===n?void 0:n.message}`)}}))}class Q{constructor(e){this._db=e,this.objectStoreNames=this._db.objectStoreNames}transaction(e,t="readonly"){return new Z(this._db.transaction.call(this._db,e,t))}createObjectStore(e,t){return new ee(this._db.createObjectStore(e,t))}close(){this._db.close()}}class Z{constructor(e){this._transaction=e,this.complete=new Promise(((e,t)=>{this._transaction.oncomplete=function(){e()},this._transaction.onerror=()=>{t(this._transaction.error)},this._transaction.onabort=()=>{t(this._transaction.error)}}))}objectStore(e){return new ee(this._transaction.objectStore(e))}}class ee{constructor(e){this._store=e}index(e){return new te(this._store.index(e))}createIndex(e,t,n){return new te(this._store.createIndex(e,t,n))}get(e){const t=this._store.get(e);return X(t,"Error reading from IndexedDB")}put(e,t){const n=this._store.put(e,t);return X(n,"Error writing to IndexedDB")}delete(e){const t=this._store.delete(e);return X(t,"Error deleting from IndexedDB")}clear(){const e=this._store.clear();return X(e,"Error clearing IndexedDB object store")}}class te{constructor(e){this._index=e}get(e){const t=this._index.get(e);return X(t,"Error reading from IndexedDB")}}function ne(e,t,n){return new Promise(((i,r)=>{try{const o=indexedDB.open(e,t);o.onsuccess=e=>{i(new Q(e.target.result))},o.onerror=e=>{var t;r(`Error opening indexedDB: ${null===(t=e.target.error)||void 0===t?void 0:t.message}`)},o.onupgradeneeded=e=>{n(new Q(o.result),e.oldVersion,e.newVersion,new Z(o.transaction))}}catch(o){r(`Error opening indexedDB: ${o.message}`)}}))}},262:function(e,t,n){"use strict";n.d(t,{Bj:function(){return o},Fl:function(){return Be},IU:function(){return Se},Jd:function(){return I},PG:function(){return Ie},SU:function(){return je},Um:function(){return we},WL:function(){return Ue},X$:function(){return S},X3:function(){return ke},XI:function(){return Me},Xl:function(){return Ne},dq:function(){return Ae},iH:function(){return De},j:function(){return T},lk:function(){return E},qj:function(){return ve},qq:function(){return v},yT:function(){return Te}});var i=n(577);let r;class o{constructor(e=!1){this.active=!0,this.effects=[],this.cleanups=[],!e&&r&&(this.parent=r,this.index=(r.scopes||(r.scopes=[])).push(this)-1)}run(e){if(this.active){const t=r;try{return r=this,e()}finally{r=t}}else 0}on(){r=this}off(){r=this.parent}stop(e){if(this.active){let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].stop(!0);if(this.parent&&!e){const e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.active=!1}}}function s(e,t=r){t&&t.active&&t.effects.push(e)}const a=e=>{const t=new Set(e);return t.w=0,t.n=0,t},c=e=>(e.w&p)>0,l=e=>(e.n&p)>0,u=({deps:e})=>{if(e.length)for(let t=0;t<e.length;t++)e[t].w|=p},h=e=>{const{deps:t}=e;if(t.length){let n=0;for(let i=0;i<t.length;i++){const r=t[i];c(r)&&!l(r)?r.delete(e):t[n++]=r,r.w&=~p,r.n&=~p}t.length=n}},d=new WeakMap;let f=0,p=1;const m=30;let g;const _=Symbol(""),y=Symbol("");class v{constructor(e,t=null,n){this.fn=e,this.scheduler=t,this.active=!0,this.deps=[],this.parent=void 0,s(this,n)}run(){if(!this.active)return this.fn();let e=g,t=b;while(e){if(e===this)return;e=e.parent}try{return this.parent=g,g=this,b=!0,p=1<<++f,f<=m?u(this):w(this),this.fn()}finally{f<=m&&h(this),p=1<<--f,g=this.parent,b=t,this.parent=void 0,this.deferStop&&this.stop()}}stop(){g===this?this.deferStop=!0:this.active&&(w(this),this.onStop&&this.onStop(),this.active=!1)}}function w(e){const{deps:t}=e;if(t.length){for(let n=0;n<t.length;n++)t[n].delete(e);t.length=0}}let b=!0;const C=[];function I(){C.push(b),b=!1}function E(){const e=C.pop();b=void 0===e||e}function T(e,t,n){if(b&&g){let t=d.get(e);t||d.set(e,t=new Map);let i=t.get(n);i||t.set(n,i=a());const r=void 0;k(i,r)}}function k(e,t){let n=!1;f<=m?l(e)||(e.n|=p,n=!c(e)):n=!e.has(g),n&&(e.add(g),g.deps.push(e))}function S(e,t,n,r,o,s){const c=d.get(e);if(!c)return;let l=[];if("clear"===t)l=[...c.values()];else if("length"===n&&(0,i.kJ)(e))c.forEach(((e,t)=>{("length"===t||t>=r)&&l.push(e)}));else switch(void 0!==n&&l.push(c.get(n)),t){case"add":(0,i.kJ)(e)?(0,i.S0)(n)&&l.push(c.get("length")):(l.push(c.get(_)),(0,i._N)(e)&&l.push(c.get(y)));break;case"delete":(0,i.kJ)(e)||(l.push(c.get(_)),(0,i._N)(e)&&l.push(c.get(y)));break;case"set":(0,i._N)(e)&&l.push(c.get(_));break}if(1===l.length)l[0]&&N(l[0]);else{const e=[];for(const t of l)t&&e.push(...t);N(a(e))}}function N(e,t){for(const n of(0,i.kJ)(e)?e:[...e])(n!==g||n.allowRecurse)&&(n.scheduler?n.scheduler():n.run())}const x=(0,i.fY)("__proto__,__v_isRef,__isVue"),P=new Set(Object.getOwnPropertyNames(Symbol).map((e=>Symbol[e])).filter(i.yk)),R=F(),O=F(!1,!0),A=F(!0),D=M();function M(){const e={};return["includes","indexOf","lastIndexOf"].forEach((t=>{e[t]=function(...e){const n=Se(this);for(let t=0,r=this.length;t<r;t++)T(n,"get",t+"");const i=n[t](...e);return-1===i||!1===i?n[t](...e.map(Se)):i}})),["push","pop","shift","unshift","splice"].forEach((t=>{e[t]=function(...e){I();const n=Se(this)[t].apply(this,e);return E(),n}})),e}function F(e=!1,t=!1){return function(n,r,o){if("__v_isReactive"===r)return!e;if("__v_isReadonly"===r)return e;if("__v_isShallow"===r)return t;if("__v_raw"===r&&o===(e?t?ge:me:t?pe:fe).get(n))return n;const s=(0,i.kJ)(n);if(!e&&s&&(0,i.RI)(D,r))return Reflect.get(D,r,o);const a=Reflect.get(n,r,o);if((0,i.yk)(r)?P.has(r):x(r))return a;if(e||T(n,"get",r),t)return a;if(Ae(a)){const e=!s||!(0,i.S0)(r);return e?a.value:a}return(0,i.Kn)(a)?e?be(a):ve(a):a}}const L=q(),j=q(!0);function q(e=!1){return function(t,n,r,o){let s=t[n];if(Ee(s)&&Ae(s)&&!Ae(r))return!1;if(!e&&!Ee(r)&&(Te(r)||(r=Se(r),s=Se(s)),!(0,i.kJ)(t)&&Ae(s)&&!Ae(r)))return s.value=r,!0;const a=(0,i.kJ)(t)&&(0,i.S0)(n)?Number(n)<t.length:(0,i.RI)(t,n),c=Reflect.set(t,n,r,o);return t===Se(o)&&(a?(0,i.aU)(r,s)&&S(t,"set",n,r,s):S(t,"add",n,r)),c}}function U(e,t){const n=(0,i.RI)(e,t),r=e[t],o=Reflect.deleteProperty(e,t);return o&&n&&S(e,"delete",t,void 0,r),o}function $(e,t){const n=Reflect.has(e,t);return(0,i.yk)(t)&&P.has(t)||T(e,"has",t),n}function B(e){return T(e,"iterate",(0,i.kJ)(e)?"length":_),Reflect.ownKeys(e)}const W={get:R,set:L,deleteProperty:U,has:$,ownKeys:B},H={get:A,set(e,t){return!0},deleteProperty(e,t){return!0}},z=(0,i.l7)({},W,{get:O,set:j}),V=e=>e,G=e=>Reflect.getPrototypeOf(e);function K(e,t,n=!1,i=!1){e=e["__v_raw"];const r=Se(e),o=Se(t);t!==o&&!n&&T(r,"get",t),!n&&T(r,"get",o);const{has:s}=G(r),a=i?V:n?Pe:xe;return s.call(r,t)?a(e.get(t)):s.call(r,o)?a(e.get(o)):void(e!==r&&e.get(t))}function Y(e,t=!1){const n=this["__v_raw"],i=Se(n),r=Se(e);return e!==r&&!t&&T(i,"has",e),!t&&T(i,"has",r),e===r?n.has(e):n.has(e)||n.has(r)}function J(e,t=!1){return e=e["__v_raw"],!t&&T(Se(e),"iterate",_),Reflect.get(e,"size",e)}function X(e){e=Se(e);const t=Se(this),n=G(t),i=n.has.call(t,e);return i||(t.add(e),S(t,"add",e,e)),this}function Q(e,t){t=Se(t);const n=Se(this),{has:r,get:o}=G(n);let s=r.call(n,e);s||(e=Se(e),s=r.call(n,e));const a=o.call(n,e);return n.set(e,t),s?(0,i.aU)(t,a)&&S(n,"set",e,t,a):S(n,"add",e,t),this}function Z(e){const t=Se(this),{has:n,get:i}=G(t);let r=n.call(t,e);r||(e=Se(e),r=n.call(t,e));const o=i?i.call(t,e):void 0,s=t.delete(e);return r&&S(t,"delete",e,void 0,o),s}function ee(){const e=Se(this),t=0!==e.size,n=void 0,i=e.clear();return t&&S(e,"clear",void 0,void 0,n),i}function te(e,t){return function(n,i){const r=this,o=r["__v_raw"],s=Se(o),a=t?V:e?Pe:xe;return!e&&T(s,"iterate",_),o.forEach(((e,t)=>n.call(i,a(e),a(t),r)))}}function ne(e,t,n){return function(...r){const o=this["__v_raw"],s=Se(o),a=(0,i._N)(s),c="entries"===e||e===Symbol.iterator&&a,l="keys"===e&&a,u=o[e](...r),h=n?V:t?Pe:xe;return!t&&T(s,"iterate",l?y:_),{next(){const{value:e,done:t}=u.next();return t?{value:e,done:t}:{value:c?[h(e[0]),h(e[1])]:h(e),done:t}},[Symbol.iterator](){return this}}}}function ie(e){return function(...t){return"delete"!==e&&this}}function re(){const e={get(e){return K(this,e)},get size(){return J(this)},has:Y,add:X,set:Q,delete:Z,clear:ee,forEach:te(!1,!1)},t={get(e){return K(this,e,!1,!0)},get size(){return J(this)},has:Y,add:X,set:Q,delete:Z,clear:ee,forEach:te(!1,!0)},n={get(e){return K(this,e,!0)},get size(){return J(this,!0)},has(e){return Y.call(this,e,!0)},add:ie("add"),set:ie("set"),delete:ie("delete"),clear:ie("clear"),forEach:te(!0,!1)},i={get(e){return K(this,e,!0,!0)},get size(){return J(this,!0)},has(e){return Y.call(this,e,!0)},add:ie("add"),set:ie("set"),delete:ie("delete"),clear:ie("clear"),forEach:te(!0,!0)},r=["keys","values","entries",Symbol.iterator];return r.forEach((r=>{e[r]=ne(r,!1,!1),n[r]=ne(r,!0,!1),t[r]=ne(r,!1,!0),i[r]=ne(r,!0,!0)})),[e,n,t,i]}const[oe,se,ae,ce]=re();function le(e,t){const n=t?e?ce:ae:e?se:oe;return(t,r,o)=>"__v_isReactive"===r?!e:"__v_isReadonly"===r?e:"__v_raw"===r?t:Reflect.get((0,i.RI)(n,r)&&r in t?n:t,r,o)}const ue={get:le(!1,!1)},he={get:le(!1,!0)},de={get:le(!0,!1)};const fe=new WeakMap,pe=new WeakMap,me=new WeakMap,ge=new WeakMap;function _e(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function ye(e){return e["__v_skip"]||!Object.isExtensible(e)?0:_e((0,i.W7)(e))}function ve(e){return Ee(e)?e:Ce(e,!1,W,ue,fe)}function we(e){return Ce(e,!1,z,he,pe)}function be(e){return Ce(e,!0,H,de,me)}function Ce(e,t,n,r,o){if(!(0,i.Kn)(e))return e;if(e["__v_raw"]&&(!t||!e["__v_isReactive"]))return e;const s=o.get(e);if(s)return s;const a=ye(e);if(0===a)return e;const c=new Proxy(e,2===a?r:n);return o.set(e,c),c}function Ie(e){return Ee(e)?Ie(e["__v_raw"]):!(!e||!e["__v_isReactive"])}function Ee(e){return!(!e||!e["__v_isReadonly"])}function Te(e){return!(!e||!e["__v_isShallow"])}function ke(e){return Ie(e)||Ee(e)}function Se(e){const t=e&&e["__v_raw"];return t?Se(t):e}function Ne(e){return(0,i.Nj)(e,"__v_skip",!0),e}const xe=e=>(0,i.Kn)(e)?ve(e):e,Pe=e=>(0,i.Kn)(e)?be(e):e;function Re(e){b&&g&&(e=Se(e),k(e.dep||(e.dep=a())))}function Oe(e,t){e=Se(e),e.dep&&N(e.dep)}function Ae(e){return!(!e||!0!==e.__v_isRef)}function De(e){return Fe(e,!1)}function Me(e){return Fe(e,!0)}function Fe(e,t){return Ae(e)?e:new Le(e,t)}class Le{constructor(e,t){this.__v_isShallow=t,this.dep=void 0,this.__v_isRef=!0,this._rawValue=t?e:Se(e),this._value=t?e:xe(e)}get value(){return Re(this),this._value}set value(e){e=this.__v_isShallow?e:Se(e),(0,i.aU)(e,this._rawValue)&&(this._rawValue=e,this._value=this.__v_isShallow?e:xe(e),Oe(this,e))}}function je(e){return Ae(e)?e.value:e}const qe={get:(e,t,n)=>je(Reflect.get(e,t,n)),set:(e,t,n,i)=>{const r=e[t];return Ae(r)&&!Ae(n)?(r.value=n,!0):Reflect.set(e,t,n,i)}};function Ue(e){return Ie(e)?e:new Proxy(e,qe)}class $e{constructor(e,t,n,i){this._setter=t,this.dep=void 0,this.__v_isRef=!0,this._dirty=!0,this.effect=new v(e,(()=>{this._dirty||(this._dirty=!0,Oe(this))})),this.effect.computed=this,this.effect.active=this._cacheable=!i,this["__v_isReadonly"]=n}get value(){const e=Se(this);return Re(e),!e._dirty&&e._cacheable||(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e)}}function Be(e,t,n=!1){let r,o;const s=(0,i.mf)(e);s?(r=e,o=i.dG):(r=e.get,o=e.set);const a=new $e(r,o,s||!o,n);return a}},252:function(e,t,n){"use strict";n.d(t,{$d:function(){return s},FN:function(){return yn},Fl:function(){return Dn},HY:function(){return At},JJ:function(){return Y},Ko:function(){return un},LL:function(){return xt},P$:function(){return se},Q2:function(){return Pt},Q6:function(){return de},U2:function(){return ce},Uk:function(){return nn},Us:function(){return vt},Wm:function(){return Qt},Y3:function(){return C},Y8:function(){return ie},YP:function(){return Q},_:function(){return Xt},aZ:function(){return fe},f3:function(){return J},h:function(){return Mn},iD:function(){return Ht},ic:function(){return Ne},j4:function(){return zt},kq:function(){return rn},nK:function(){return he},up:function(){return St},w5:function(){return U},wg:function(){return qt},wy:function(){return ht}});var i=n(262),r=n(577);function o(e,t,n,i){let r;try{r=i?e(...i):e()}catch(o){a(o,t,n)}return r}function s(e,t,n,i){if((0,r.mf)(e)){const s=o(e,t,n,i);return s&&(0,r.tI)(s)&&s.catch((e=>{a(e,t,n)})),s}const c=[];for(let r=0;r<e.length;r++)c.push(s(e[r],t,n,i));return c}function a(e,t,n,i=!0){const r=t?t.vnode:null;if(t){let i=t.parent;const r=t.proxy,s=n;while(i){const t=i.ec;if(t)for(let n=0;n<t.length;n++)if(!1===t[n](e,r,s))return;i=i.parent}const a=t.appContext.config.errorHandler;if(a)return void o(a,null,10,[e,r,s])}c(e,n,r,i)}function c(e,t,n,i=!0){console.error(e)}let l=!1,u=!1;const h=[];let d=0;const f=[];let p=null,m=0;const g=[];let _=null,y=0;const v=Promise.resolve();let w=null,b=null;function C(e){const t=w||v;return e?t.then(this?e.bind(this):e):t}function I(e){let t=d+1,n=h.length;while(t<n){const i=t+n>>>1,r=O(h[i]);r<e?t=i+1:n=i}return t}function E(e){h.length&&h.includes(e,l&&e.allowRecurse?d+1:d)||e===b||(null==e.id?h.push(e):h.splice(I(e.id),0,e),T())}function T(){l||u||(u=!0,w=v.then(A))}function k(e){const t=h.indexOf(e);t>d&&h.splice(t,1)}function S(e,t,n,i){(0,r.kJ)(e)?n.push(...e):t&&t.includes(e,e.allowRecurse?i+1:i)||n.push(e),T()}function N(e){S(e,p,f,m)}function x(e){S(e,_,g,y)}function P(e,t=null){if(f.length){for(b=t,p=[...new Set(f)],f.length=0,m=0;m<p.length;m++)p[m]();p=null,m=0,b=null,P(e,t)}}function R(e){if(g.length){const e=[...new Set(g)];if(g.length=0,_)return void _.push(...e);for(_=e,_.sort(((e,t)=>O(e)-O(t))),y=0;y<_.length;y++)_[y]();_=null,y=0}}const O=e=>null==e.id?1/0:e.id;function A(e){u=!1,l=!0,P(e),h.sort(((e,t)=>O(e)-O(t)));r.dG;try{for(d=0;d<h.length;d++){const e=h[d];e&&!1!==e.active&&o(e,null,14)}}finally{d=0,h.length=0,R(e),l=!1,w=null,(h.length||f.length||g.length)&&A(e)}}new Set;new Map;function D(e,t,...n){if(e.isUnmounted)return;const i=e.vnode.props||r.kT;let o=n;const a=t.startsWith("update:"),c=a&&t.slice(7);if(c&&c in i){const e=`${"modelValue"===c?"model":c}Modifiers`,{number:t,trim:s}=i[e]||r.kT;s?o=n.map((e=>e.trim())):t&&(o=n.map(r.He))}let l;let u=i[l=(0,r.hR)(t)]||i[l=(0,r.hR)((0,r._A)(t))];!u&&a&&(u=i[l=(0,r.hR)((0,r.rs)(t))]),u&&s(u,e,6,o);const h=i[l+"Once"];if(h){if(e.emitted){if(e.emitted[l])return}else e.emitted={};e.emitted[l]=!0,s(h,e,6,o)}}function M(e,t,n=!1){const i=t.emitsCache,o=i.get(e);if(void 0!==o)return o;const s=e.emits;let a={},c=!1;if(!(0,r.mf)(e)){const i=e=>{const n=M(e,t,!0);n&&(c=!0,(0,r.l7)(a,n))};!n&&t.mixins.length&&t.mixins.forEach(i),e.extends&&i(e.extends),e.mixins&&e.mixins.forEach(i)}return s||c?((0,r.kJ)(s)?s.forEach((e=>a[e]=null)):(0,r.l7)(a,s),i.set(e,a),a):(i.set(e,null),null)}function F(e,t){return!(!e||!(0,r.F7)(t))&&(t=t.slice(2).replace(/Once$/,""),(0,r.RI)(e,t[0].toLowerCase()+t.slice(1))||(0,r.RI)(e,(0,r.rs)(t))||(0,r.RI)(e,t))}let L=null,j=null;function q(e){const t=L;return L=e,j=e&&e.type.__scopeId||null,t}function U(e,t=L,n){if(!t)return e;if(e._n)return e;const i=(...n)=>{i._d&&Bt(-1);const r=q(t),o=e(...n);return q(r),i._d&&Bt(1),o};return i._n=!0,i._c=!0,i._d=!0,i}function $(e){const{type:t,vnode:n,proxy:i,withProxy:o,props:s,propsOptions:[c],slots:l,attrs:u,emit:h,render:d,renderCache:f,data:p,setupState:m,ctx:g,inheritAttrs:_}=e;let y,v;const w=q(e);try{if(4&n.shapeFlag){const e=o||i;y=on(d.call(e,e,f,s,m,p,g)),v=u}else{const e=t;0,y=on(e.length>1?e(s,{attrs:u,slots:l,emit:h}):e(s,null)),v=t.props?u:B(u)}}catch(C){Lt.length=0,a(C,e,1),y=Qt(Mt)}let b=y;if(v&&!1!==_){const e=Object.keys(v),{shapeFlag:t}=b;e.length&&7&t&&(c&&e.some(r.tR)&&(v=W(v,c)),b=tn(b,v))}return n.dirs&&(b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&(b.transition=n.transition),y=b,q(w),y}const B=e=>{let t;for(const n in e)("class"===n||"style"===n||(0,r.F7)(n))&&((t||(t={}))[n]=e[n]);return t},W=(e,t)=>{const n={};for(const i in e)(0,r.tR)(i)&&i.slice(9)in t||(n[i]=e[i]);return n};function H(e,t,n){const{props:i,children:r,component:o}=e,{props:s,children:a,patchFlag:c}=t,l=o.emitsOptions;if(t.dirs||t.transition)return!0;if(!(n&&c>=0))return!(!r&&!a||a&&a.$stable)||i!==s&&(i?!s||z(i,s,l):!!s);if(1024&c)return!0;if(16&c)return i?z(i,s,l):!!s;if(8&c){const e=t.dynamicProps;for(let t=0;t<e.length;t++){const n=e[t];if(s[n]!==i[n]&&!F(l,n))return!0}}return!1}function z(e,t,n){const i=Object.keys(t);if(i.length!==Object.keys(e).length)return!0;for(let r=0;r<i.length;r++){const o=i[r];if(t[o]!==e[o]&&!F(n,o))return!0}return!1}function V({vnode:e,parent:t},n){while(t&&t.subTree===e)(e=t.vnode).el=n,t=t.parent}const G=e=>e.__isSuspense;function K(e,t){t&&t.pendingBranch?(0,r.kJ)(e)?t.effects.push(...e):t.effects.push(e):x(e)}function Y(e,t){if(_n){let n=_n.provides;const i=_n.parent&&_n.parent.provides;i===n&&(n=_n.provides=Object.create(i)),n[e]=t}else 0}function J(e,t,n=!1){const i=_n||L;if(i){const o=null==i.parent?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides;if(o&&e in o)return o[e];if(arguments.length>1)return n&&(0,r.mf)(t)?t.call(i.proxy):t}else 0}const X={};function Q(e,t,n){return Z(e,t,n)}function Z(e,t,{immediate:n,deep:a,flush:c,onTrack:l,onTrigger:u}=r.kT){const h=_n;let d,f,p=!1,m=!1;if((0,i.dq)(e)?(d=()=>e.value,p=(0,i.yT)(e)):(0,i.PG)(e)?(d=()=>e,a=!0):(0,r.kJ)(e)?(m=!0,p=e.some(i.PG),d=()=>e.map((e=>(0,i.dq)(e)?e.value:(0,i.PG)(e)?ne(e):(0,r.mf)(e)?o(e,h,2):void 0))):d=(0,r.mf)(e)?t?()=>o(e,h,2):()=>{if(!h||!h.isUnmounted)return f&&f(),s(e,h,3,[g])}:r.dG,t&&a){const e=d;d=()=>ne(e())}let g=e=>{f=w.onStop=()=>{o(e,h,4)}};if(En)return g=r.dG,t?n&&s(t,h,3,[d(),m?[]:void 0,g]):d(),r.dG;let _=m?[]:X;const y=()=>{if(w.active)if(t){const e=w.run();(a||p||(m?e.some(((e,t)=>(0,r.aU)(e,_[t]))):(0,r.aU)(e,_)))&&(f&&f(),s(t,h,3,[e,_===X?void 0:_,g]),_=e)}else w.run()};let v;y.allowRecurse=!!t,v="sync"===c?y:"post"===c?()=>yt(y,h&&h.suspense):()=>{!h||h.isMounted?N(y):y()};const w=new i.qq(d,v);return t?n?y():_=w.run():"post"===c?yt(w.run.bind(w),h&&h.suspense):w.run(),()=>{w.stop(),h&&h.scope&&(0,r.Od)(h.scope.effects,w)}}function ee(e,t,n){const i=this.proxy,o=(0,r.HD)(e)?e.includes(".")?te(i,e):()=>i[e]:e.bind(i,i);let s;(0,r.mf)(t)?s=t:(s=t.handler,n=t);const a=_n;vn(this);const c=Z(o,s.bind(i),n);return a?vn(a):wn(),c}function te(e,t){const n=t.split(".");return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}function ne(e,t){if(!(0,r.Kn)(e)||e["__v_skip"])return e;if(t=t||new Set,t.has(e))return e;if(t.add(e),(0,i.dq)(e))ne(e.value,t);else if((0,r.kJ)(e))for(let n=0;n<e.length;n++)ne(e[n],t);else if((0,r.DM)(e)||(0,r._N)(e))e.forEach((e=>{ne(e,t)}));else if((0,r.PO)(e))for(const n in e)ne(e[n],t);return e}function ie(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return ke((()=>{e.isMounted=!0})),xe((()=>{e.isUnmounting=!0})),e}const re=[Function,Array],oe={name:"BaseTransition",props:{mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:re,onEnter:re,onAfterEnter:re,onEnterCancelled:re,onBeforeLeave:re,onLeave:re,onAfterLeave:re,onLeaveCancelled:re,onBeforeAppear:re,onAppear:re,onAfterAppear:re,onAppearCancelled:re},setup(e,{slots:t}){const n=yn(),r=ie();let o;return()=>{const s=t.default&&de(t.default(),!0);if(!s||!s.length)return;let a=s[0];if(s.length>1){let e=!1;for(const t of s)if(t.type!==Mt){0,a=t,e=!0;break}}const c=(0,i.IU)(e),{mode:l}=c;if(r.isLeaving)return le(a);const u=ue(a);if(!u)return le(a);const h=ce(u,c,r,n);he(u,h);const d=n.subTree,f=d&&ue(d);let p=!1;const{getTransitionKey:m}=u.type;if(m){const e=m();void 0===o?o=e:e!==o&&(o=e,p=!0)}if(f&&f.type!==Mt&&(!Gt(u,f)||p)){const e=ce(f,c,r,n);if(he(f,e),"out-in"===l)return r.isLeaving=!0,e.afterLeave=()=>{r.isLeaving=!1,n.update()},le(a);"in-out"===l&&u.type!==Mt&&(e.delayLeave=(e,t,n)=>{const i=ae(r,f);i[String(f.key)]=f,e._leaveCb=()=>{t(),e._leaveCb=void 0,delete h.delayedLeave},h.delayedLeave=n})}return a}}},se=oe;function ae(e,t){const{leavingVNodes:n}=e;let i=n.get(t.type);return i||(i=Object.create(null),n.set(t.type,i)),i}function ce(e,t,n,i){const{appear:r,mode:o,persisted:a=!1,onBeforeEnter:c,onEnter:l,onAfterEnter:u,onEnterCancelled:h,onBeforeLeave:d,onLeave:f,onAfterLeave:p,onLeaveCancelled:m,onBeforeAppear:g,onAppear:_,onAfterAppear:y,onAppearCancelled:v}=t,w=String(e.key),b=ae(n,e),C=(e,t)=>{e&&s(e,i,9,t)},I={mode:o,persisted:a,beforeEnter(t){let i=c;if(!n.isMounted){if(!r)return;i=g||c}t._leaveCb&&t._leaveCb(!0);const o=b[w];o&&Gt(e,o)&&o.el._leaveCb&&o.el._leaveCb(),C(i,[t])},enter(e){let t=l,i=u,o=h;if(!n.isMounted){if(!r)return;t=_||l,i=y||u,o=v||h}let s=!1;const a=e._enterCb=t=>{s||(s=!0,C(t?o:i,[e]),I.delayedLeave&&I.delayedLeave(),e._enterCb=void 0)};t?(t(e,a),t.length<=1&&a()):a()},leave(t,i){const r=String(e.key);if(t._enterCb&&t._enterCb(!0),n.isUnmounting)return i();C(d,[t]);let o=!1;const s=t._leaveCb=n=>{o||(o=!0,i(),C(n?m:p,[t]),t._leaveCb=void 0,b[r]===e&&delete b[r])};b[r]=e,f?(f(t,s),f.length<=1&&s()):s()},clone(e){return ce(e,t,n,i)}};return I}function le(e){if(me(e))return e=tn(e),e.children=null,e}function ue(e){return me(e)?e.children?e.children[0]:void 0:e}function he(e,t){6&e.shapeFlag&&e.component?he(e.component.subTree,t):128&e.shapeFlag?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function de(e,t=!1,n){let i=[],r=0;for(let o=0;o<e.length;o++){let s=e[o];const a=null==n?s.key:String(n)+String(null!=s.key?s.key:o);s.type===At?(128&s.patchFlag&&r++,i=i.concat(de(s.children,t,a))):(t||s.type!==Mt)&&i.push(null!=a?tn(s,{key:a}):s)}if(r>1)for(let o=0;o<i.length;o++)i[o].patchFlag=-2;return i}function fe(e){return(0,r.mf)(e)?{setup:e,name:e.name}:e}const pe=e=>!!e.type.__asyncLoader;const me=e=>e.type.__isKeepAlive;RegExp,RegExp;function ge(e,t){return(0,r.kJ)(e)?e.some((e=>ge(e,t))):(0,r.HD)(e)?e.split(",").includes(t):!!e.test&&e.test(t)}function _e(e,t){ve(e,"a",t)}function ye(e,t){ve(e,"da",t)}function ve(e,t,n=_n){const i=e.__wdc||(e.__wdc=()=>{let t=n;while(t){if(t.isDeactivated)return;t=t.parent}return e()});if(Ie(t,i,n),n){let e=n.parent;while(e&&e.parent)me(e.parent.vnode)&&we(i,t,n,e),e=e.parent}}function we(e,t,n,i){const o=Ie(t,e,i,!0);Pe((()=>{(0,r.Od)(i[t],o)}),n)}function be(e){let t=e.shapeFlag;256&t&&(t-=256),512&t&&(t-=512),e.shapeFlag=t}function Ce(e){return 128&e.shapeFlag?e.ssContent:e}function Ie(e,t,n=_n,r=!1){if(n){const o=n[e]||(n[e]=[]),a=t.__weh||(t.__weh=(...r)=>{if(n.isUnmounted)return;(0,i.Jd)(),vn(n);const o=s(t,n,e,r);return wn(),(0,i.lk)(),o});return r?o.unshift(a):o.push(a),a}}const Ee=e=>(t,n=_n)=>(!En||"sp"===e)&&Ie(e,t,n),Te=Ee("bm"),ke=Ee("m"),Se=Ee("bu"),Ne=Ee("u"),xe=Ee("bum"),Pe=Ee("um"),Re=Ee("sp"),Oe=Ee("rtg"),Ae=Ee("rtc");function De(e,t=_n){Ie("ec",e,t)}let Me=!0;function Fe(e){const t=Ue(e),n=e.proxy,o=e.ctx;Me=!1,t.beforeCreate&&je(t.beforeCreate,e,"bc");const{data:s,computed:a,methods:c,watch:l,provide:u,inject:h,created:d,beforeMount:f,mounted:p,beforeUpdate:m,updated:g,activated:_,deactivated:y,beforeDestroy:v,beforeUnmount:w,destroyed:b,unmounted:C,render:I,renderTracked:E,renderTriggered:T,errorCaptured:k,serverPrefetch:S,expose:N,inheritAttrs:x,components:P,directives:R,filters:O}=t,A=null;if(h&&Le(h,o,A,e.appContext.config.unwrapInjectedRef),c)for(const i in c){const e=c[i];(0,r.mf)(e)&&(o[i]=e.bind(n))}if(s){0;const t=s.call(n,n);0,(0,r.Kn)(t)&&(e.data=(0,i.qj)(t))}if(Me=!0,a)for(const i in a){const e=a[i],t=(0,r.mf)(e)?e.bind(n,n):(0,r.mf)(e.get)?e.get.bind(n,n):r.dG;0;const s=!(0,r.mf)(e)&&(0,r.mf)(e.set)?e.set.bind(n):r.dG,c=Dn({get:t,set:s});Object.defineProperty(o,i,{enumerable:!0,configurable:!0,get:()=>c.value,set:e=>c.value=e})}if(l)for(const i in l)qe(l[i],o,n,i);if(u){const e=(0,r.mf)(u)?u.call(n):u;Reflect.ownKeys(e).forEach((t=>{Y(t,e[t])}))}function D(e,t){(0,r.kJ)(t)?t.forEach((t=>e(t.bind(n)))):t&&e(t.bind(n))}if(d&&je(d,e,"c"),D(Te,f),D(ke,p),D(Se,m),D(Ne,g),D(_e,_),D(ye,y),D(De,k),D(Ae,E),D(Oe,T),D(xe,w),D(Pe,C),D(Re,S),(0,r.kJ)(N))if(N.length){const t=e.exposed||(e.exposed={});N.forEach((e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t})}))}else e.exposed||(e.exposed={});I&&e.render===r.dG&&(e.render=I),null!=x&&(e.inheritAttrs=x),P&&(e.components=P),R&&(e.directives=R)}function Le(e,t,n=r.dG,o=!1){(0,r.kJ)(e)&&(e=ze(e));for(const s in e){const n=e[s];let a;a=(0,r.Kn)(n)?"default"in n?J(n.from||s,n.default,!0):J(n.from||s):J(n),(0,i.dq)(a)&&o?Object.defineProperty(t,s,{enumerable:!0,configurable:!0,get:()=>a.value,set:e=>a.value=e}):t[s]=a}}function je(e,t,n){s((0,r.kJ)(e)?e.map((e=>e.bind(t.proxy))):e.bind(t.proxy),t,n)}function qe(e,t,n,i){const o=i.includes(".")?te(n,i):()=>n[i];if((0,r.HD)(e)){const n=t[e];(0,r.mf)(n)&&Q(o,n)}else if((0,r.mf)(e))Q(o,e.bind(n));else if((0,r.Kn)(e))if((0,r.kJ)(e))e.forEach((e=>qe(e,t,n,i)));else{const i=(0,r.mf)(e.handler)?e.handler.bind(n):t[e.handler];(0,r.mf)(i)&&Q(o,i,e)}else 0}function Ue(e){const t=e.type,{mixins:n,extends:i}=t,{mixins:r,optionsCache:o,config:{optionMergeStrategies:s}}=e.appContext,a=o.get(t);let c;return a?c=a:r.length||n||i?(c={},r.length&&r.forEach((e=>$e(c,e,s,!0))),$e(c,t,s)):c=t,o.set(t,c),c}function $e(e,t,n,i=!1){const{mixins:r,extends:o}=t;o&&$e(e,o,n,!0),r&&r.forEach((t=>$e(e,t,n,!0)));for(const s in t)if(i&&"expose"===s);else{const i=Be[s]||n&&n[s];e[s]=i?i(e[s],t[s]):t[s]}return e}const Be={data:We,props:Ge,emits:Ge,methods:Ge,computed:Ge,beforeCreate:Ve,created:Ve,beforeMount:Ve,mounted:Ve,beforeUpdate:Ve,updated:Ve,beforeDestroy:Ve,beforeUnmount:Ve,destroyed:Ve,unmounted:Ve,activated:Ve,deactivated:Ve,errorCaptured:Ve,serverPrefetch:Ve,components:Ge,directives:Ge,watch:Ke,provide:We,inject:He};function We(e,t){return t?e?function(){return(0,r.l7)((0,r.mf)(e)?e.call(this,this):e,(0,r.mf)(t)?t.call(this,this):t)}:t:e}function He(e,t){return Ge(ze(e),ze(t))}function ze(e){if((0,r.kJ)(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Ve(e,t){return e?[...new Set([].concat(e,t))]:t}function Ge(e,t){return e?(0,r.l7)((0,r.l7)(Object.create(null),e),t):t}function Ke(e,t){if(!e)return t;if(!t)return e;const n=(0,r.l7)(Object.create(null),e);for(const i in t)n[i]=Ve(e[i],t[i]);return n}function Ye(e,t,n,o=!1){const s={},a={};(0,r.Nj)(a,Kt,1),e.propsDefaults=Object.create(null),Xe(e,t,s,a);for(const i in e.propsOptions[0])i in s||(s[i]=void 0);n?e.props=o?s:(0,i.Um)(s):e.type.props?e.props=s:e.props=a,e.attrs=a}function Je(e,t,n,o){const{props:s,attrs:a,vnode:{patchFlag:c}}=e,l=(0,i.IU)(s),[u]=e.propsOptions;let h=!1;if(!(o||c>0)||16&c){let i;Xe(e,t,s,a)&&(h=!0);for(const o in l)t&&((0,r.RI)(t,o)||(i=(0,r.rs)(o))!==o&&(0,r.RI)(t,i))||(u?!n||void 0===n[o]&&void 0===n[i]||(s[o]=Qe(u,l,o,void 0,e,!0)):delete s[o]);if(a!==l)for(const e in a)t&&(0,r.RI)(t,e)||(delete a[e],h=!0)}else if(8&c){const n=e.vnode.dynamicProps;for(let i=0;i<n.length;i++){let o=n[i];if(F(e.emitsOptions,o))continue;const c=t[o];if(u)if((0,r.RI)(a,o))c!==a[o]&&(a[o]=c,h=!0);else{const t=(0,r._A)(o);s[t]=Qe(u,l,t,c,e,!1)}else c!==a[o]&&(a[o]=c,h=!0)}}h&&(0,i.X$)(e,"set","$attrs")}function Xe(e,t,n,o){const[s,a]=e.propsOptions;let c,l=!1;if(t)for(let i in t){if((0,r.Gg)(i))continue;const u=t[i];let h;s&&(0,r.RI)(s,h=(0,r._A)(i))?a&&a.includes(h)?(c||(c={}))[h]=u:n[h]=u:F(e.emitsOptions,i)||i in o&&u===o[i]||(o[i]=u,l=!0)}if(a){const t=(0,i.IU)(n),o=c||r.kT;for(let i=0;i<a.length;i++){const c=a[i];n[c]=Qe(s,t,c,o[c],e,!(0,r.RI)(o,c))}}return l}function Qe(e,t,n,i,o,s){const a=e[n];if(null!=a){const e=(0,r.RI)(a,"default");if(e&&void 0===i){const e=a.default;if(a.type!==Function&&(0,r.mf)(e)){const{propsDefaults:r}=o;n in r?i=r[n]:(vn(o),i=r[n]=e.call(null,t),wn())}else i=e}a[0]&&(s&&!e?i=!1:!a[1]||""!==i&&i!==(0,r.rs)(n)||(i=!0))}return i}function Ze(e,t,n=!1){const i=t.propsCache,o=i.get(e);if(o)return o;const s=e.props,a={},c=[];let l=!1;if(!(0,r.mf)(e)){const i=e=>{l=!0;const[n,i]=Ze(e,t,!0);(0,r.l7)(a,n),i&&c.push(...i)};!n&&t.mixins.length&&t.mixins.forEach(i),e.extends&&i(e.extends),e.mixins&&e.mixins.forEach(i)}if(!s&&!l)return i.set(e,r.Z6),r.Z6;if((0,r.kJ)(s))for(let h=0;h<s.length;h++){0;const e=(0,r._A)(s[h]);et(e)&&(a[e]=r.kT)}else if(s){0;for(const e in s){const t=(0,r._A)(e);if(et(t)){const n=s[e],i=a[t]=(0,r.kJ)(n)||(0,r.mf)(n)?{type:n}:n;if(i){const e=it(Boolean,i.type),n=it(String,i.type);i[0]=e>-1,i[1]=n<0||e<n,(e>-1||(0,r.RI)(i,"default"))&&c.push(t)}}}}const u=[a,c];return i.set(e,u),u}function et(e){return"$"!==e[0]}function tt(e){const t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:null===e?"null":""}function nt(e,t){return tt(e)===tt(t)}function it(e,t){return(0,r.kJ)(t)?t.findIndex((t=>nt(t,e))):(0,r.mf)(t)&&nt(t,e)?0:-1}const rt=e=>"_"===e[0]||"$stable"===e,ot=e=>(0,r.kJ)(e)?e.map(on):[on(e)],st=(e,t,n)=>{const i=U(((...e)=>ot(t(...e))),n);return i._c=!1,i},at=(e,t,n)=>{const i=e._ctx;for(const o in e){if(rt(o))continue;const n=e[o];if((0,r.mf)(n))t[o]=st(o,n,i);else if(null!=n){0;const e=ot(n);t[o]=()=>e}}},ct=(e,t)=>{const n=ot(t);e.slots.default=()=>n},lt=(e,t)=>{if(32&e.vnode.shapeFlag){const n=t._;n?(e.slots=(0,i.IU)(t),(0,r.Nj)(t,"_",n)):at(t,e.slots={})}else e.slots={},t&&ct(e,t);(0,r.Nj)(e.slots,Kt,1)},ut=(e,t,n)=>{const{vnode:i,slots:o}=e;let s=!0,a=r.kT;if(32&i.shapeFlag){const e=t._;e?n&&1===e?s=!1:((0,r.l7)(o,t),n||1!==e||delete o._):(s=!t.$stable,at(t,o)),a=t}else t&&(ct(e,t),a={default:1});if(s)for(const r in o)rt(r)||r in a||delete o[r]};function ht(e,t){const n=L;if(null===n)return e;const i=Rn(n)||n.proxy,o=e.dirs||(e.dirs=[]);for(let s=0;s<t.length;s++){let[e,n,a,c=r.kT]=t[s];(0,r.mf)(e)&&(e={mounted:e,updated:e}),e.deep&&ne(n),o.push({dir:e,instance:i,value:n,oldValue:void 0,arg:a,modifiers:c})}return e}function dt(e,t,n,r){const o=e.dirs,a=t&&t.dirs;for(let c=0;c<o.length;c++){const l=o[c];a&&(l.oldValue=a[c].value);let u=l.dir[r];u&&((0,i.Jd)(),s(u,n,8,[e.el,l,e,t]),(0,i.lk)())}}function ft(){return{app:null,config:{isNativeTag:r.NO,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let pt=0;function mt(e,t){return function(n,i=null){(0,r.mf)(n)||(n=Object.assign({},n)),null==i||(0,r.Kn)(i)||(i=null);const o=ft(),s=new Set;let a=!1;const c=o.app={_uid:pt++,_component:n,_props:i,_container:null,_context:o,_instance:null,version:Fn,get config(){return o.config},set config(e){0},use(e,...t){return s.has(e)||(e&&(0,r.mf)(e.install)?(s.add(e),e.install(c,...t)):(0,r.mf)(e)&&(s.add(e),e(c,...t))),c},mixin(e){return o.mixins.includes(e)||o.mixins.push(e),c},component(e,t){return t?(o.components[e]=t,c):o.components[e]},directive(e,t){return t?(o.directives[e]=t,c):o.directives[e]},mount(r,s,l){if(!a){const u=Qt(n,i);return u.appContext=o,s&&t?t(u,r):e(u,r,l),a=!0,c._container=r,r.__vue_app__=c,Rn(u.component)||u.component.proxy}},unmount(){a&&(e(null,c._container),delete c._container.__vue_app__)},provide(e,t){return o.provides[e]=t,c}};return c}}function gt(e,t,n,s,a=!1){if((0,r.kJ)(e))return void e.forEach(((e,i)=>gt(e,t&&((0,r.kJ)(t)?t[i]:t),n,s,a)));if(pe(s)&&!a)return;const c=4&s.shapeFlag?Rn(s.component)||s.component.proxy:s.el,l=a?null:c,{i:u,r:h}=e;const d=t&&t.r,f=u.refs===r.kT?u.refs={}:u.refs,p=u.setupState;if(null!=d&&d!==h&&((0,r.HD)(d)?(f[d]=null,(0,r.RI)(p,d)&&(p[d]=null)):(0,i.dq)(d)&&(d.value=null)),(0,r.mf)(h))o(h,u,12,[l,f]);else{const t=(0,r.HD)(h),o=(0,i.dq)(h);if(t||o){const o=()=>{if(e.f){const n=t?f[h]:h.value;a?(0,r.kJ)(n)&&(0,r.Od)(n,c):(0,r.kJ)(n)?n.includes(c)||n.push(c):t?(f[h]=[c],(0,r.RI)(p,h)&&(p[h]=f[h])):(h.value=[c],e.k&&(f[e.k]=h.value))}else t?(f[h]=l,(0,r.RI)(p,h)&&(p[h]=l)):(0,i.dq)(h)&&(h.value=l,e.k&&(f[e.k]=l))};l?(o.id=-1,yt(o,n)):o()}else 0}}function _t(){}const yt=K;function vt(e){return wt(e)}function wt(e,t){_t();const n=(0,r.E9)();n.__VUE__=!0;const{insert:o,remove:s,patchProp:a,createElement:c,createText:l,createComment:u,setText:h,setElementText:d,parentNode:f,nextSibling:p,setScopeId:m=r.dG,cloneNode:g,insertStaticContent:_}=e,y=(e,t,n,i=null,r=null,o=null,s=!1,a=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!Gt(e,t)&&(i=Z(e),K(e,r,o,!0),e=null),-2===t.patchFlag&&(c=!1,t.dynamicChildren=null);const{type:l,ref:u,shapeFlag:h}=t;switch(l){case Dt:v(e,t,n,i);break;case Mt:w(e,t,n,i);break;case Ft:null==e&&b(t,n,i,s);break;case At:M(e,t,n,i,r,o,s,a,c);break;default:1&h?T(e,t,n,i,r,o,s,a,c):6&h?F(e,t,n,i,r,o,s,a,c):(64&h||128&h)&&l.process(e,t,n,i,r,o,s,a,c,te)}null!=u&&r&&gt(u,e&&e.ref,o,t||e,!t)},v=(e,t,n,i)=>{if(null==e)o(t.el=l(t.children),n,i);else{const n=t.el=e.el;t.children!==e.children&&h(n,t.children)}},w=(e,t,n,i)=>{null==e?o(t.el=u(t.children||""),n,i):t.el=e.el},b=(e,t,n,i)=>{[e.el,e.anchor]=_(e.children,t,n,i,e.el,e.anchor)},C=({el:e,anchor:t},n,i)=>{let r;while(e&&e!==t)r=p(e),o(e,n,i),e=r;o(t,n,i)},I=({el:e,anchor:t})=>{let n;while(e&&e!==t)n=p(e),s(e),e=n;s(t)},T=(e,t,n,i,r,o,s,a,c)=>{s=s||"svg"===t.type,null==e?S(t,n,i,r,o,s,a,c):O(e,t,r,o,s,a,c)},S=(e,t,n,i,s,l,u,h)=>{let f,p;const{type:m,props:_,shapeFlag:y,transition:v,patchFlag:w,dirs:b}=e;if(e.el&&void 0!==g&&-1===w)f=e.el=g(e.el);else{if(f=e.el=c(e.type,l,_&&_.is,_),8&y?d(f,e.children):16&y&&x(e.children,f,null,i,s,l&&"foreignObject"!==m,u,h),b&&dt(e,null,i,"created"),_){for(const t in _)"value"===t||(0,r.Gg)(t)||a(f,t,null,_[t],l,e.children,i,s,Q);"value"in _&&a(f,"value",null,_.value),(p=_.onVnodeBeforeMount)&&ln(p,i,e)}N(f,e,e.scopeId,u,i)}b&&dt(e,null,i,"beforeMount");const C=(!s||s&&!s.pendingBranch)&&v&&!v.persisted;C&&v.beforeEnter(f),o(f,t,n),((p=_&&_.onVnodeMounted)||C||b)&&yt((()=>{p&&ln(p,i,e),C&&v.enter(f),b&&dt(e,null,i,"mounted")}),s)},N=(e,t,n,i,r)=>{if(n&&m(e,n),i)for(let o=0;o<i.length;o++)m(e,i[o]);if(r){let n=r.subTree;if(t===n){const t=r.vnode;N(e,t,t.scopeId,t.slotScopeIds,r.parent)}}},x=(e,t,n,i,r,o,s,a,c=0)=>{for(let l=c;l<e.length;l++){const c=e[l]=a?sn(e[l]):on(e[l]);y(null,c,t,n,i,r,o,s,a)}},O=(e,t,n,i,o,s,c)=>{const l=t.el=e.el;let{patchFlag:u,dynamicChildren:h,dirs:f}=t;u|=16&e.patchFlag;const p=e.props||r.kT,m=t.props||r.kT;let g;n&&bt(n,!1),(g=m.onVnodeBeforeUpdate)&&ln(g,n,t,e),f&&dt(t,e,n,"beforeUpdate"),n&&bt(n,!0);const _=o&&"foreignObject"!==t.type;if(h?A(e.dynamicChildren,h,l,n,i,_,s):c||B(e,t,l,null,n,i,_,s,!1),u>0){if(16&u)D(l,t,p,m,n,i,o);else if(2&u&&p.class!==m.class&&a(l,"class",null,m.class,o),4&u&&a(l,"style",p.style,m.style,o),8&u){const r=t.dynamicProps;for(let t=0;t<r.length;t++){const s=r[t],c=p[s],u=m[s];u===c&&"value"!==s||a(l,s,c,u,o,e.children,n,i,Q)}}1&u&&e.children!==t.children&&d(l,t.children)}else c||null!=h||D(l,t,p,m,n,i,o);((g=m.onVnodeUpdated)||f)&&yt((()=>{g&&ln(g,n,t,e),f&&dt(t,e,n,"updated")}),i)},A=(e,t,n,i,r,o,s)=>{for(let a=0;a<t.length;a++){const c=e[a],l=t[a],u=c.el&&(c.type===At||!Gt(c,l)||70&c.shapeFlag)?f(c.el):n;y(c,l,u,null,i,r,o,s,!0)}},D=(e,t,n,i,o,s,c)=>{if(n!==i){for(const l in i){if((0,r.Gg)(l))continue;const u=i[l],h=n[l];u!==h&&"value"!==l&&a(e,l,h,u,c,t.children,o,s,Q)}if(n!==r.kT)for(const l in n)(0,r.Gg)(l)||l in i||a(e,l,n[l],null,c,t.children,o,s,Q);"value"in i&&a(e,"value",n.value,i.value)}},M=(e,t,n,i,r,s,a,c,u)=>{const h=t.el=e?e.el:l(""),d=t.anchor=e?e.anchor:l("");let{patchFlag:f,dynamicChildren:p,slotScopeIds:m}=t;m&&(c=c?c.concat(m):m),null==e?(o(h,n,i),o(d,n,i),x(t.children,n,d,r,s,a,c,u)):f>0&&64&f&&p&&e.dynamicChildren?(A(e.dynamicChildren,p,n,r,s,a,c),(null!=t.key||r&&t===r.subTree)&&Ct(e,t,!0)):B(e,t,n,d,r,s,a,c,u)},F=(e,t,n,i,r,o,s,a,c)=>{t.slotScopeIds=a,null==e?512&t.shapeFlag?r.ctx.activate(t,n,i,s,c):L(t,n,i,r,o,s,c):j(e,t,c)},L=(e,t,n,i,r,o,s)=>{const a=e.component=gn(e,i,r);if(me(e)&&(a.ctx.renderer=te),Tn(a),a.asyncDep){if(r&&r.registerDep(a,q),!e.el){const e=a.subTree=Qt(Mt);w(null,e,t,n)}}else q(a,e,t,n,r,o,s)},j=(e,t,n)=>{const i=t.component=e.component;if(H(e,t,n)){if(i.asyncDep&&!i.asyncResolved)return void U(i,t,n);i.next=t,k(i.update),i.update()}else t.component=e.component,t.el=e.el,i.vnode=t},q=(e,t,n,o,s,a,c)=>{const l=()=>{if(e.isMounted){let t,{next:n,bu:i,u:o,parent:l,vnode:u}=e,h=n;0,bt(e,!1),n?(n.el=u.el,U(e,n,c)):n=u,i&&(0,r.ir)(i),(t=n.props&&n.props.onVnodeBeforeUpdate)&&ln(t,l,n,u),bt(e,!0);const d=$(e);0;const p=e.subTree;e.subTree=d,y(p,d,f(p.el),Z(p),e,s,a),n.el=d.el,null===h&&V(e,d.el),o&&yt(o,s),(t=n.props&&n.props.onVnodeUpdated)&&yt((()=>ln(t,l,n,u)),s)}else{let i;const{el:c,props:l}=t,{bm:u,m:h,parent:d}=e,f=pe(t);if(bt(e,!1),u&&(0,r.ir)(u),!f&&(i=l&&l.onVnodeBeforeMount)&&ln(i,d,t),bt(e,!0),c&&ie){const n=()=>{e.subTree=$(e),ie(c,e.subTree,e,s,null)};f?t.type.__asyncLoader().then((()=>!e.isUnmounted&&n())):n()}else{0;const i=e.subTree=$(e);0,y(null,i,n,o,e,s,a),t.el=i.el}if(h&&yt(h,s),!f&&(i=l&&l.onVnodeMounted)){const e=t;yt((()=>ln(i,d,e)),s)}256&t.shapeFlag&&e.a&&yt(e.a,s),e.isMounted=!0,t=n=o=null}},u=e.effect=new i.qq(l,(()=>E(e.update)),e.scope),h=e.update=u.run.bind(u);h.id=e.uid,bt(e,!0),h()},U=(e,t,n)=>{t.component=e;const r=e.vnode.props;e.vnode=t,e.next=null,Je(e,t.props,r,n),ut(e,t.children,n),(0,i.Jd)(),P(void 0,e.update),(0,i.lk)()},B=(e,t,n,i,r,o,s,a,c=!1)=>{const l=e&&e.children,u=e?e.shapeFlag:0,h=t.children,{patchFlag:f,shapeFlag:p}=t;if(f>0){if(128&f)return void z(l,h,n,i,r,o,s,a,c);if(256&f)return void W(l,h,n,i,r,o,s,a,c)}8&p?(16&u&&Q(l,r,o),h!==l&&d(n,h)):16&u?16&p?z(l,h,n,i,r,o,s,a,c):Q(l,r,o,!0):(8&u&&d(n,""),16&p&&x(h,n,i,r,o,s,a,c))},W=(e,t,n,i,o,s,a,c,l)=>{e=e||r.Z6,t=t||r.Z6;const u=e.length,h=t.length,d=Math.min(u,h);let f;for(f=0;f<d;f++){const i=t[f]=l?sn(t[f]):on(t[f]);y(e[f],i,n,null,o,s,a,c,l)}u>h?Q(e,o,s,!0,!1,d):x(t,n,i,o,s,a,c,l,d)},z=(e,t,n,i,o,s,a,c,l)=>{let u=0;const h=t.length;let d=e.length-1,f=h-1;while(u<=d&&u<=f){const i=e[u],r=t[u]=l?sn(t[u]):on(t[u]);if(!Gt(i,r))break;y(i,r,n,null,o,s,a,c,l),u++}while(u<=d&&u<=f){const i=e[d],r=t[f]=l?sn(t[f]):on(t[f]);if(!Gt(i,r))break;y(i,r,n,null,o,s,a,c,l),d--,f--}if(u>d){if(u<=f){const e=f+1,r=e<h?t[e].el:i;while(u<=f)y(null,t[u]=l?sn(t[u]):on(t[u]),n,r,o,s,a,c,l),u++}}else if(u>f)while(u<=d)K(e[u],o,s,!0),u++;else{const p=u,m=u,g=new Map;for(u=m;u<=f;u++){const e=t[u]=l?sn(t[u]):on(t[u]);null!=e.key&&g.set(e.key,u)}let _,v=0;const w=f-m+1;let b=!1,C=0;const I=new Array(w);for(u=0;u<w;u++)I[u]=0;for(u=p;u<=d;u++){const i=e[u];if(v>=w){K(i,o,s,!0);continue}let r;if(null!=i.key)r=g.get(i.key);else for(_=m;_<=f;_++)if(0===I[_-m]&&Gt(i,t[_])){r=_;break}void 0===r?K(i,o,s,!0):(I[r-m]=u+1,r>=C?C=r:b=!0,y(i,t[r],n,null,o,s,a,c,l),v++)}const E=b?It(I):r.Z6;for(_=E.length-1,u=w-1;u>=0;u--){const e=m+u,r=t[e],d=e+1<h?t[e+1].el:i;0===I[u]?y(null,r,n,d,o,s,a,c,l):b&&(_<0||u!==E[_]?G(r,n,d,2):_--)}}},G=(e,t,n,i,r=null)=>{const{el:s,type:a,transition:c,children:l,shapeFlag:u}=e;if(6&u)return void G(e.component.subTree,t,n,i);if(128&u)return void e.suspense.move(t,n,i);if(64&u)return void a.move(e,t,n,te);if(a===At){o(s,t,n);for(let e=0;e<l.length;e++)G(l[e],t,n,i);return void o(e.anchor,t,n)}if(a===Ft)return void C(e,t,n);const h=2!==i&&1&u&&c;if(h)if(0===i)c.beforeEnter(s),o(s,t,n),yt((()=>c.enter(s)),r);else{const{leave:e,delayLeave:i,afterLeave:r}=c,a=()=>o(s,t,n),l=()=>{e(s,(()=>{a(),r&&r()}))};i?i(s,a,l):l()}else o(s,t,n)},K=(e,t,n,i=!1,r=!1)=>{const{type:o,props:s,ref:a,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:h,dirs:d}=e;if(null!=a&&gt(a,null,n,e,!0),256&u)return void t.ctx.deactivate(e);const f=1&u&&d,p=!pe(e);let m;if(p&&(m=s&&s.onVnodeBeforeUnmount)&&ln(m,t,e),6&u)X(e.component,n,i);else{if(128&u)return void e.suspense.unmount(n,i);f&&dt(e,null,t,"beforeUnmount"),64&u?e.type.remove(e,t,n,r,te,i):l&&(o!==At||h>0&&64&h)?Q(l,t,n,!1,!0):(o===At&&384&h||!r&&16&u)&&Q(c,t,n),i&&Y(e)}(p&&(m=s&&s.onVnodeUnmounted)||f)&&yt((()=>{m&&ln(m,t,e),f&&dt(e,null,t,"unmounted")}),n)},Y=e=>{const{type:t,el:n,anchor:i,transition:r}=e;if(t===At)return void J(n,i);if(t===Ft)return void I(e);const o=()=>{s(n),r&&!r.persisted&&r.afterLeave&&r.afterLeave()};if(1&e.shapeFlag&&r&&!r.persisted){const{leave:t,delayLeave:i}=r,s=()=>t(n,o);i?i(e.el,o,s):s()}else o()},J=(e,t)=>{let n;while(e!==t)n=p(e),s(e),e=n;s(t)},X=(e,t,n)=>{const{bum:i,scope:o,update:s,subTree:a,um:c}=e;i&&(0,r.ir)(i),o.stop(),s&&(s.active=!1,K(a,e,t,n)),c&&yt(c,t),yt((()=>{e.isUnmounted=!0}),t),t&&t.pendingBranch&&!t.isUnmounted&&e.asyncDep&&!e.asyncResolved&&e.suspenseId===t.pendingId&&(t.deps--,0===t.deps&&t.resolve())},Q=(e,t,n,i=!1,r=!1,o=0)=>{for(let s=o;s<e.length;s++)K(e[s],t,n,i,r)},Z=e=>6&e.shapeFlag?Z(e.component.subTree):128&e.shapeFlag?e.suspense.next():p(e.anchor||e.el),ee=(e,t,n)=>{null==e?t._vnode&&K(t._vnode,null,null,!0):y(t._vnode||null,e,t,null,null,null,n),R(),t._vnode=e},te={p:y,um:K,m:G,r:Y,mt:L,mc:x,pc:B,pbc:A,n:Z,o:e};let ne,ie;return t&&([ne,ie]=t(te)),{render:ee,hydrate:ne,createApp:mt(ee,ne)}}function bt({effect:e,update:t},n){e.allowRecurse=t.allowRecurse=n}function Ct(e,t,n=!1){const i=e.children,o=t.children;if((0,r.kJ)(i)&&(0,r.kJ)(o))for(let r=0;r<i.length;r++){const e=i[r];let t=o[r];1&t.shapeFlag&&!t.dynamicChildren&&((t.patchFlag<=0||32===t.patchFlag)&&(t=o[r]=sn(o[r]),t.el=e.el),n||Ct(e,t))}}function It(e){const t=e.slice(),n=[0];let i,r,o,s,a;const c=e.length;for(i=0;i<c;i++){const c=e[i];if(0!==c){if(r=n[n.length-1],e[r]<c){t[i]=r,n.push(i);continue}o=0,s=n.length-1;while(o<s)a=o+s>>1,e[n[a]]<c?o=a+1:s=a;c<e[n[o]]&&(o>0&&(t[i]=n[o-1]),n[o]=i)}}o=n.length,s=n[o-1];while(o-- >0)n[o]=s,s=t[s];return n}const Et=e=>e.__isTeleport;const Tt="components",kt="directives";function St(e,t){return Rt(Tt,e,!0,t)||e}const Nt=Symbol();function xt(e){return(0,r.HD)(e)?Rt(Tt,e,!1)||e:e||Nt}function Pt(e){return Rt(kt,e)}function Rt(e,t,n=!0,i=!1){const o=L||_n;if(o){const n=o.type;if(e===Tt){const e=On(n);if(e&&(e===t||e===(0,r._A)(t)||e===(0,r.kC)((0,r._A)(t))))return n}const s=Ot(o[e]||n[e],t)||Ot(o.appContext[e],t);return!s&&i?n:s}}function Ot(e,t){return e&&(e[t]||e[(0,r._A)(t)]||e[(0,r.kC)((0,r._A)(t))])}const At=Symbol(void 0),Dt=Symbol(void 0),Mt=Symbol(void 0),Ft=Symbol(void 0),Lt=[];let jt=null;function qt(e=!1){Lt.push(jt=e?null:[])}function Ut(){Lt.pop(),jt=Lt[Lt.length-1]||null}let $t=1;function Bt(e){$t+=e}function Wt(e){return e.dynamicChildren=$t>0?jt||r.Z6:null,Ut(),$t>0&&jt&&jt.push(e),e}function Ht(e,t,n,i,r,o){return Wt(Xt(e,t,n,i,r,o,!0))}function zt(e,t,n,i,r){return Wt(Qt(e,t,n,i,r,!0))}function Vt(e){return!!e&&!0===e.__v_isVNode}function Gt(e,t){return e.type===t.type&&e.key===t.key}const Kt="__vInternal",Yt=({key:e})=>null!=e?e:null,Jt=({ref:e,ref_key:t,ref_for:n})=>null!=e?(0,r.HD)(e)||(0,i.dq)(e)||(0,r.mf)(e)?{i:L,r:e,k:t,f:!!n}:e:null;function Xt(e,t=null,n=null,i=0,o=null,s=(e===At?0:1),a=!1,c=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Yt(t),ref:t&&Jt(t),scopeId:j,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:o,dynamicChildren:null,appContext:null};return c?(an(l,n),128&s&&e.normalize(l)):n&&(l.shapeFlag|=(0,r.HD)(n)?8:16),$t>0&&!a&&jt&&(l.patchFlag>0||6&s)&&32!==l.patchFlag&&jt.push(l),l}const Qt=Zt;function Zt(e,t=null,n=null,o=0,s=null,a=!1){if(e&&e!==Nt||(e=Mt),Vt(e)){const i=tn(e,t,!0);return n&&an(i,n),i}if(An(e)&&(e=e.__vccOpts),t){t=en(t);let{class:e,style:n}=t;e&&!(0,r.HD)(e)&&(t.class=(0,r.C_)(e)),(0,r.Kn)(n)&&((0,i.X3)(n)&&!(0,r.kJ)(n)&&(n=(0,r.l7)({},n)),t.style=(0,r.j5)(n))}const c=(0,r.HD)(e)?1:G(e)?128:Et(e)?64:(0,r.Kn)(e)?4:(0,r.mf)(e)?2:0;return Xt(e,t,n,o,s,c,a,!0)}function en(e){return e?(0,i.X3)(e)||Kt in e?(0,r.l7)({},e):e:null}function tn(e,t,n=!1){const{props:i,ref:o,patchFlag:s,children:a}=e,c=t?cn(i||{},t):i,l={__v_isVNode:!0,__v_skip:!0,type:e.type,props:c,key:c&&Yt(c),ref:t&&t.ref?n&&o?(0,r.kJ)(o)?o.concat(Jt(t)):[o,Jt(t)]:Jt(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==At?-1===s?16:16|s:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&tn(e.ssContent),ssFallback:e.ssFallback&&tn(e.ssFallback),el:e.el,anchor:e.anchor};return l}function nn(e=" ",t=0){return Qt(Dt,null,e,t)}function rn(e="",t=!1){return t?(qt(),zt(Mt,null,e)):Qt(Mt,null,e)}function on(e){return null==e||"boolean"===typeof e?Qt(Mt):(0,r.kJ)(e)?Qt(At,null,e.slice()):"object"===typeof e?sn(e):Qt(Dt,null,String(e))}function sn(e){return null===e.el||e.memo?e:tn(e)}function an(e,t){let n=0;const{shapeFlag:i}=e;if(null==t)t=null;else if((0,r.kJ)(t))n=16;else if("object"===typeof t){if(65&i){const n=t.default;return void(n&&(n._c&&(n._d=!1),an(e,n()),n._c&&(n._d=!0)))}{n=32;const i=t._;i||Kt in t?3===i&&L&&(1===L.slots._?t._=1:(t._=2,e.patchFlag|=1024)):t._ctx=L}}else(0,r.mf)(t)?(t={default:t,_ctx:L},n=32):(t=String(t),64&i?(n=16,t=[nn(t)]):n=8);e.children=t,e.shapeFlag|=n}function cn(...e){const t={};for(let n=0;n<e.length;n++){const i=e[n];for(const e in i)if("class"===e)t.class!==i.class&&(t.class=(0,r.C_)([t.class,i.class]));else if("style"===e)t.style=(0,r.j5)([t.style,i.style]);else if((0,r.F7)(e)){const n=t[e],o=i[e];!o||n===o||(0,r.kJ)(n)&&n.includes(o)||(t[e]=n?[].concat(n,o):o)}else""!==e&&(t[e]=i[e])}return t}function ln(e,t,n,i=null){s(e,t,7,[n,i])}function un(e,t,n,i){let o;const s=n&&n[i];if((0,r.kJ)(e)||(0,r.HD)(e)){o=new Array(e.length);for(let n=0,i=e.length;n<i;n++)o[n]=t(e[n],n,void 0,s&&s[n])}else if("number"===typeof e){0,o=new Array(e);for(let n=0;n<e;n++)o[n]=t(n+1,n,void 0,s&&s[n])}else if((0,r.Kn)(e))if(e[Symbol.iterator])o=Array.from(e,((e,n)=>t(e,n,void 0,s&&s[n])));else{const n=Object.keys(e);o=new Array(n.length);for(let i=0,r=n.length;i<r;i++){const r=n[i];o[i]=t(e[r],r,i,s&&s[i])}}else o=[];return n&&(n[i]=o),o}const hn=e=>e?bn(e)?Rn(e)||e.proxy:hn(e.parent):null,dn=(0,r.l7)(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>hn(e.parent),$root:e=>hn(e.root),$emit:e=>e.emit,$options:e=>Ue(e),$forceUpdate:e=>()=>E(e.update),$nextTick:e=>C.bind(e.proxy),$watch:e=>ee.bind(e)}),fn={get({_:e},t){const{ctx:n,setupState:o,data:s,props:a,accessCache:c,type:l,appContext:u}=e;let h;if("$"!==t[0]){const i=c[t];if(void 0!==i)switch(i){case 1:return o[t];case 2:return s[t];case 4:return n[t];case 3:return a[t]}else{if(o!==r.kT&&(0,r.RI)(o,t))return c[t]=1,o[t];if(s!==r.kT&&(0,r.RI)(s,t))return c[t]=2,s[t];if((h=e.propsOptions[0])&&(0,r.RI)(h,t))return c[t]=3,a[t];if(n!==r.kT&&(0,r.RI)(n,t))return c[t]=4,n[t];Me&&(c[t]=0)}}const d=dn[t];let f,p;return d?("$attrs"===t&&(0,i.j)(e,"get",t),d(e)):(f=l.__cssModules)&&(f=f[t])?f:n!==r.kT&&(0,r.RI)(n,t)?(c[t]=4,n[t]):(p=u.config.globalProperties,(0,r.RI)(p,t)?p[t]:void 0)},set({_:e},t,n){const{data:i,setupState:o,ctx:s}=e;return o!==r.kT&&(0,r.RI)(o,t)?(o[t]=n,!0):i!==r.kT&&(0,r.RI)(i,t)?(i[t]=n,!0):!(0,r.RI)(e.props,t)&&(("$"!==t[0]||!(t.slice(1)in e))&&(s[t]=n,!0))},has({_:{data:e,setupState:t,accessCache:n,ctx:i,appContext:o,propsOptions:s}},a){let c;return!!n[a]||e!==r.kT&&(0,r.RI)(e,a)||t!==r.kT&&(0,r.RI)(t,a)||(c=s[0])&&(0,r.RI)(c,a)||(0,r.RI)(i,a)||(0,r.RI)(dn,a)||(0,r.RI)(o.config.globalProperties,a)},defineProperty(e,t,n){return null!=n.get?e._.accessCache[t]=0:(0,r.RI)(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};const pn=ft();let mn=0;function gn(e,t,n){const o=e.type,s=(t?t.appContext:e.appContext)||pn,a={uid:mn++,vnode:e,type:o,parent:t,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,scope:new i.Bj(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(s.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Ze(o,s),emitsOptions:M(o,s),emit:null,emitted:null,propsDefaults:r.kT,inheritAttrs:o.inheritAttrs,ctx:r.kT,data:r.kT,props:r.kT,attrs:r.kT,slots:r.kT,refs:r.kT,setupState:r.kT,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return a.ctx={_:a},a.root=t?t.root:a,a.emit=D.bind(null,a),e.ce&&e.ce(a),a}let _n=null;const yn=()=>_n||L,vn=e=>{_n=e,e.scope.on()},wn=()=>{_n&&_n.scope.off(),_n=null};function bn(e){return 4&e.vnode.shapeFlag}let Cn,In,En=!1;function Tn(e,t=!1){En=t;const{props:n,children:i}=e.vnode,r=bn(e);Ye(e,n,r,t),lt(e,i);const o=r?kn(e,t):void 0;return En=!1,o}function kn(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=(0,i.Xl)(new Proxy(e.ctx,fn));const{setup:s}=n;if(s){const n=e.setupContext=s.length>1?Pn(e):null;vn(e),(0,i.Jd)();const c=o(s,e,0,[e.props,n]);if((0,i.lk)(),wn(),(0,r.tI)(c)){if(c.then(wn,wn),t)return c.then((n=>{Sn(e,n,t)})).catch((t=>{a(t,e,0)}));e.asyncDep=c}else Sn(e,c,t)}else Nn(e,t)}function Sn(e,t,n){(0,r.mf)(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:(0,r.Kn)(t)&&(e.setupState=(0,i.WL)(t)),Nn(e,n)}function Nn(e,t,n){const o=e.type;if(!e.render){if(!t&&Cn&&!o.render){const t=o.template;if(t){0;const{isCustomElement:n,compilerOptions:i}=e.appContext.config,{delimiters:s,compilerOptions:a}=o,c=(0,r.l7)((0,r.l7)({isCustomElement:n,delimiters:s},i),a);o.render=Cn(t,c)}}e.render=o.render||r.dG,In&&In(e)}vn(e),(0,i.Jd)(),Fe(e),(0,i.lk)(),wn()}function xn(e){return new Proxy(e.attrs,{get(t,n){return(0,i.j)(e,"get","$attrs"),t[n]}})}function Pn(e){const t=t=>{e.exposed=t||{}};let n;return{get attrs(){return n||(n=xn(e))},slots:e.slots,emit:e.emit,expose:t}}function Rn(e){if(e.exposed)return e.exposeProxy||(e.exposeProxy=new Proxy((0,i.WL)((0,i.Xl)(e.exposed)),{get(t,n){return n in t?t[n]:n in dn?dn[n](e):void 0}}))}function On(e){return(0,r.mf)(e)&&e.displayName||e.name}function An(e){return(0,r.mf)(e)&&"__vccOpts"in e}const Dn=(e,t)=>(0,i.Fl)(e,t,En);function Mn(e,t,n){const i=arguments.length;return 2===i?(0,r.Kn)(t)&&!(0,r.kJ)(t)?Vt(t)?Qt(e,null,[t]):Qt(e,t):Qt(e,null,t):(i>3?n=Array.prototype.slice.call(arguments,2):3===i&&Vt(n)&&(n=[n]),Qt(e,t,n))}Symbol("");const Fn="3.2.33"},963:function(e,t,n){"use strict";n.d(t,{iM:function(){return te},ri:function(){return oe},uT:function(){return L}});var i=n(577),r=n(252);n(262);const o="http://www.w3.org/2000/svg",s="undefined"!==typeof document?document:null,a=s&&s.createElement("template"),c={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,i)=>{const r=t?s.createElementNS(o,e):s.createElement(e,n?{is:n}:void 0);return"select"===e&&i&&null!=i.multiple&&r.setAttribute("multiple",i.multiple),r},createText:e=>s.createTextNode(e),createComment:e=>s.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>s.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},cloneNode(e){const t=e.cloneNode(!0);return"_value"in e&&(t._value=e._value),t},insertStaticContent(e,t,n,i,r,o){const s=n?n.previousSibling:t.lastChild;if(r&&(r===o||r.nextSibling)){while(1)if(t.insertBefore(r.cloneNode(!0),n),r===o||!(r=r.nextSibling))break}else{a.innerHTML=i?`<svg>${e}</svg>`:e;const r=a.content;if(i){const e=r.firstChild;while(e.firstChild)r.appendChild(e.firstChild);r.removeChild(e)}t.insertBefore(r,n)}return[s?s.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}};function l(e,t,n){const i=e._vtc;i&&(t=(t?[t,...i]:[...i]).join(" ")),null==t?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}function u(e,t,n){const r=e.style,o=(0,i.HD)(n);if(n&&!o){for(const e in n)d(r,e,n[e]);if(t&&!(0,i.HD)(t))for(const e in t)null==n[e]&&d(r,e,"")}else{const i=r.display;o?t!==n&&(r.cssText=n):t&&e.removeAttribute("style"),"_vod"in e&&(r.display=i)}}const h=/\s*!important$/;function d(e,t,n){if((0,i.kJ)(n))n.forEach((n=>d(e,t,n)));else if(null==n&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const r=m(e,t);h.test(n)?e.setProperty((0,i.rs)(r),n.replace(h,""),"important"):e[r]=n}}const f=["Webkit","Moz","ms"],p={};function m(e,t){const n=p[t];if(n)return n;let r=(0,i._A)(t);if("filter"!==r&&r in e)return p[t]=r;r=(0,i.kC)(r);for(let i=0;i<f.length;i++){const n=f[i]+r;if(n in e)return p[t]=n}return t}const g="http://www.w3.org/1999/xlink";function _(e,t,n,r,o){if(r&&t.startsWith("xlink:"))null==n?e.removeAttributeNS(g,t.slice(6,t.length)):e.setAttributeNS(g,t,n);else{const r=(0,i.Pq)(t);null==n||r&&!(0,i.yA)(n)?e.removeAttribute(t):e.setAttribute(t,r?"":n)}}function y(e,t,n,r,o,s,a){if("innerHTML"===t||"textContent"===t)return r&&a(r,o,s),void(e[t]=null==n?"":n);if("value"===t&&"PROGRESS"!==e.tagName&&!e.tagName.includes("-")){e._value=n;const i=null==n?"":n;return e.value===i&&"OPTION"!==e.tagName||(e.value=i),void(null==n&&e.removeAttribute(t))}let c=!1;if(""===n||null==n){const r=typeof e[t];"boolean"===r?n=(0,i.yA)(n):null==n&&"string"===r?(n="",c=!0):"number"===r&&(n=0,c=!0)}try{e[t]=n}catch(l){0}c&&e.removeAttribute(t)}const[v,w]=(()=>{let e=Date.now,t=!1;if("undefined"!==typeof window){Date.now()>document.createEvent("Event").timeStamp&&(e=()=>performance.now());const n=navigator.userAgent.match(/firefox\/(\d+)/i);t=!!(n&&Number(n[1])<=53)}return[e,t]})();let b=0;const C=Promise.resolve(),I=()=>{b=0},E=()=>b||(C.then(I),b=v());function T(e,t,n,i){e.addEventListener(t,n,i)}function k(e,t,n,i){e.removeEventListener(t,n,i)}function S(e,t,n,i,r=null){const o=e._vei||(e._vei={}),s=o[t];if(i&&s)s.value=i;else{const[n,a]=x(t);if(i){const s=o[t]=P(i,r);T(e,n,s,a)}else s&&(k(e,n,s,a),o[t]=void 0)}}const N=/(?:Once|Passive|Capture)$/;function x(e){let t;if(N.test(e)){let n;t={};while(n=e.match(N))e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[(0,i.rs)(e.slice(2)),t]}function P(e,t){const n=e=>{const i=e.timeStamp||v();(w||i>=n.attached-1)&&(0,r.$d)(R(e,n.value),t,5,[e])};return n.value=e,n.attached=E(),n}function R(e,t){if((0,i.kJ)(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map((e=>t=>!t._stopped&&e&&e(t)))}return t}const O=/^on[a-z]/,A=(e,t,n,r,o=!1,s,a,c,h)=>{"class"===t?l(e,r,o):"style"===t?u(e,n,r):(0,i.F7)(t)?(0,i.tR)(t)||S(e,t,n,r,a):("."===t[0]?(t=t.slice(1),1):"^"===t[0]?(t=t.slice(1),0):D(e,t,r,o))?y(e,t,r,s,a,c,h):("true-value"===t?e._trueValue=r:"false-value"===t&&(e._falseValue=r),_(e,t,r,o))};function D(e,t,n,r){return r?"innerHTML"===t||"textContent"===t||!!(t in e&&O.test(t)&&(0,i.mf)(n)):"spellcheck"!==t&&"draggable"!==t&&"translate"!==t&&("form"!==t&&(("list"!==t||"INPUT"!==e.tagName)&&(("type"!==t||"TEXTAREA"!==e.tagName)&&((!O.test(t)||!(0,i.HD)(n))&&t in e))))}"undefined"!==typeof HTMLElement&&HTMLElement;const M="transition",F="animation",L=(e,{slots:t})=>(0,r.h)(r.P$,$(e),t);L.displayName="Transition";const j={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},q=(L.props=(0,i.l7)({},r.P$.props,j),(e,t=[])=>{(0,i.kJ)(e)?e.forEach((e=>e(...t))):e&&e(...t)}),U=e=>!!e&&((0,i.kJ)(e)?e.some((e=>e.length>1)):e.length>1);function $(e){const t={};for(const i in e)i in j||(t[i]=e[i]);if(!1===e.css)return t;const{name:n="v",type:r,duration:o,enterFromClass:s=`${n}-enter-from`,enterActiveClass:a=`${n}-enter-active`,enterToClass:c=`${n}-enter-to`,appearFromClass:l=s,appearActiveClass:u=a,appearToClass:h=c,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:f=`${n}-leave-active`,leaveToClass:p=`${n}-leave-to`}=e,m=B(o),g=m&&m[0],_=m&&m[1],{onBeforeEnter:y,onEnter:v,onEnterCancelled:w,onLeave:b,onLeaveCancelled:C,onBeforeAppear:I=y,onAppear:E=v,onAppearCancelled:T=w}=t,k=(e,t,n)=>{z(e,t?h:c),z(e,t?u:a),n&&n()},S=(e,t)=>{z(e,p),z(e,f),t&&t()},N=e=>(t,n)=>{const i=e?E:v,o=()=>k(t,e,n);q(i,[t,o]),V((()=>{z(t,e?l:s),H(t,e?h:c),U(i)||K(t,r,g,o)}))};return(0,i.l7)(t,{onBeforeEnter(e){q(y,[e]),H(e,s),H(e,a)},onBeforeAppear(e){q(I,[e]),H(e,l),H(e,u)},onEnter:N(!1),onAppear:N(!0),onLeave(e,t){const n=()=>S(e,t);H(e,d),Q(),H(e,f),V((()=>{z(e,d),H(e,p),U(b)||K(e,r,_,n)})),q(b,[e,n])},onEnterCancelled(e){k(e,!1),q(w,[e])},onAppearCancelled(e){k(e,!0),q(T,[e])},onLeaveCancelled(e){S(e),q(C,[e])}})}function B(e){if(null==e)return null;if((0,i.Kn)(e))return[W(e.enter),W(e.leave)];{const t=W(e);return[t,t]}}function W(e){const t=(0,i.He)(e);return t}function H(e,t){t.split(/\s+/).forEach((t=>t&&e.classList.add(t))),(e._vtc||(e._vtc=new Set)).add(t)}function z(e,t){t.split(/\s+/).forEach((t=>t&&e.classList.remove(t)));const{_vtc:n}=e;n&&(n.delete(t),n.size||(e._vtc=void 0))}function V(e){requestAnimationFrame((()=>{requestAnimationFrame(e)}))}let G=0;function K(e,t,n,i){const r=e._endId=++G,o=()=>{r===e._endId&&i()};if(n)return setTimeout(o,n);const{type:s,timeout:a,propCount:c}=Y(e,t);if(!s)return i();const l=s+"end";let u=0;const h=()=>{e.removeEventListener(l,d),o()},d=t=>{t.target===e&&++u>=c&&h()};setTimeout((()=>{u<c&&h()}),a+1),e.addEventListener(l,d)}function Y(e,t){const n=window.getComputedStyle(e),i=e=>(n[e]||"").split(", "),r=i(M+"Delay"),o=i(M+"Duration"),s=J(r,o),a=i(F+"Delay"),c=i(F+"Duration"),l=J(a,c);let u=null,h=0,d=0;t===M?s>0&&(u=M,h=s,d=o.length):t===F?l>0&&(u=F,h=l,d=c.length):(h=Math.max(s,l),u=h>0?s>l?M:F:null,d=u?u===M?o.length:c.length:0);const f=u===M&&/\b(transform|all)(,|$)/.test(n[M+"Property"]);return{type:u,timeout:h,propCount:d,hasTransform:f}}function J(e,t){while(e.length<t.length)e=e.concat(e);return Math.max(...t.map(((t,n)=>X(t)+X(e[n]))))}function X(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function Q(){return document.body.offsetHeight}new WeakMap,new WeakMap;const Z=["ctrl","shift","alt","meta"],ee={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&0!==e.button,middle:e=>"button"in e&&1!==e.button,right:e=>"button"in e&&2!==e.button,exact:(e,t)=>Z.some((n=>e[`${n}Key`]&&!t.includes(n)))},te=(e,t)=>(n,...i)=>{for(let e=0;e<t.length;e++){const i=ee[t[e]];if(i&&i(n,t))return}return e(n,...i)};const ne=(0,i.l7)({patchProp:A},c);let ie;function re(){return ie||(ie=(0,r.Us)(ne))}const oe=(...e)=>{const t=re().createApp(...e);const{mount:n}=t;return t.mount=e=>{const r=se(e);if(!r)return;const o=t._component;(0,i.mf)(o)||o.render||o.template||(o.template=r.innerHTML),r.innerHTML="";const s=n(r,!1,r instanceof SVGElement);return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),s},t};function se(e){if((0,i.HD)(e)){const t=document.querySelector(e);return t}return e}},577:function(e,t,n){"use strict";function i(e,t){const n=Object.create(null),i=e.split(",");for(let r=0;r<i.length;r++)n[i[r]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}n.d(t,{C_:function(){return f},DM:function(){return O},E9:function(){return ie},F7:function(){return E},Gg:function(){return H},HD:function(){return M},He:function(){return te},Kn:function(){return L},NO:function(){return C},Nj:function(){return ee},Od:function(){return S},PO:function(){return B},Pq:function(){return a},RI:function(){return x},S0:function(){return W},W7:function(){return $},WV:function(){return m},Z6:function(){return w},_A:function(){return G},_N:function(){return R},aU:function(){return Q},dG:function(){return b},e1:function(){return o},fY:function(){return i},hR:function(){return X},hq:function(){return g},ir:function(){return Z},j5:function(){return l},kC:function(){return J},kJ:function(){return P},kT:function(){return v},l7:function(){return k},mf:function(){return D},rs:function(){return Y},tI:function(){return j},tR:function(){return T},yA:function(){return c},yk:function(){return F},zw:function(){return _}});const r="Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt",o=i(r);const s="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",a=i(s);function c(e){return!!e||""===e}function l(e){if(P(e)){const t={};for(let n=0;n<e.length;n++){const i=e[n],r=M(i)?d(i):l(i);if(r)for(const e in r)t[e]=r[e]}return t}return M(e)||L(e)?e:void 0}const u=/;(?![^(]*\))/g,h=/:(.+)/;function d(e){const t={};return e.split(u).forEach((e=>{if(e){const n=e.split(h);n.length>1&&(t[n[0].trim()]=n[1].trim())}})),t}function f(e){let t="";if(M(e))t=e;else if(P(e))for(let n=0;n<e.length;n++){const i=f(e[n]);i&&(t+=i+" ")}else if(L(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}function p(e,t){if(e.length!==t.length)return!1;let n=!0;for(let i=0;n&&i<e.length;i++)n=m(e[i],t[i]);return n}function m(e,t){if(e===t)return!0;let n=A(e),i=A(t);if(n||i)return!(!n||!i)&&e.getTime()===t.getTime();if(n=P(e),i=P(t),n||i)return!(!n||!i)&&p(e,t);if(n=L(e),i=L(t),n||i){if(!n||!i)return!1;const r=Object.keys(e).length,o=Object.keys(t).length;if(r!==o)return!1;for(const n in e){const i=e.hasOwnProperty(n),r=t.hasOwnProperty(n);if(i&&!r||!i&&r||!m(e[n],t[n]))return!1}}return String(e)===String(t)}function g(e,t){return e.findIndex((e=>m(e,t)))}const _=e=>M(e)?e:null==e?"":P(e)||L(e)&&(e.toString===q||!D(e.toString))?JSON.stringify(e,y,2):String(e),y=(e,t)=>t&&t.__v_isRef?y(e,t.value):R(t)?{[`Map(${t.size})`]:[...t.entries()].reduce(((e,[t,n])=>(e[`${t} =>`]=n,e)),{})}:O(t)?{[`Set(${t.size})`]:[...t.values()]}:!L(t)||P(t)||B(t)?t:String(t),v={},w=[],b=()=>{},C=()=>!1,I=/^on[^a-z]/,E=e=>I.test(e),T=e=>e.startsWith("onUpdate:"),k=Object.assign,S=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},N=Object.prototype.hasOwnProperty,x=(e,t)=>N.call(e,t),P=Array.isArray,R=e=>"[object Map]"===U(e),O=e=>"[object Set]"===U(e),A=e=>e instanceof Date,D=e=>"function"===typeof e,M=e=>"string"===typeof e,F=e=>"symbol"===typeof e,L=e=>null!==e&&"object"===typeof e,j=e=>L(e)&&D(e.then)&&D(e.catch),q=Object.prototype.toString,U=e=>q.call(e),$=e=>U(e).slice(8,-1),B=e=>"[object Object]"===U(e),W=e=>M(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,H=i(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),z=e=>{const t=Object.create(null);return n=>{const i=t[n];return i||(t[n]=e(n))}},V=/-(\w)/g,G=z((e=>e.replace(V,((e,t)=>t?t.toUpperCase():"")))),K=/\B([A-Z])/g,Y=z((e=>e.replace(K,"-$1").toLowerCase())),J=z((e=>e.charAt(0).toUpperCase()+e.slice(1))),X=z((e=>e?`on${J(e)}`:"")),Q=(e,t)=>!Object.is(e,t),Z=(e,t)=>{for(let n=0;n<e.length;n++)e[n](t)},ee=(e,t,n)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:n})},te=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let ne;const ie=()=>ne||(ne="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:"undefined"!==typeof window?window:"undefined"!==typeof n.g?n.g:{})},721:function(e,t,n){"use strict";n.d(t,{IH:function(){return Y}});var i=n(238),r=n(333),o=n(444),s=n(463);n(578);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const a="analytics",c="firebase_id",l="origin",u=6e4,h="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",d="https://www.googletagmanager.com/gtag/js",f=new r.Yd("@firebase/analytics");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function p(e){return Promise.all(e.map((e=>e.catch((e=>e)))))}function m(e,t){const n=document.createElement("script");n.src=`${d}?l=${e}&id=${t}`,n.async=!0,document.head.appendChild(n)}function g(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function _(e,t,n,i,r,o){const s=i[r];try{if(s)await t[s];else{const e=await p(n),i=e.find((e=>e.measurementId===r));i&&await t[i.appId]}}catch(a){f.error(a)}e("config",r,o)}async function y(e,t,n,i,r){try{let o=[];if(r&&r["send_to"]){let e=r["send_to"];Array.isArray(e)||(e=[e]);const i=await p(n);for(const n of e){const e=i.find((e=>e.measurementId===n)),r=e&&t[e.appId];if(!r){o=[];break}o.push(r)}}0===o.length&&(o=Object.values(t)),await Promise.all(o),e("event",i,r||{})}catch(o){f.error(o)}}function v(e,t,n,i){async function r(r,o,s){try{"event"===r?await y(e,t,n,o,s):"config"===r?await _(e,t,n,i,o,s):e("set",o)}catch(a){f.error(a)}}return r}function w(e,t,n,i,r){let o=function(...e){window[i].push(arguments)};return window[r]&&"function"===typeof window[r]&&(o=window[r]),window[r]=v(o,e,t,n),{gtagCore:o,wrappedGtag:window[r]}}function b(){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(d))return t;return null}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C={["already-exists"]:"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",["already-initialized"]:"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.",["already-initialized-settings"]:"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",["interop-component-reg-failed"]:"Firebase Analytics Interop Component failed to instantiate: {$reason}",["invalid-analytics-context"]:"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",["indexeddb-unavailable"]:"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",["fetch-throttle"]:"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",["config-fetch-failed"]:"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",["no-api-key"]:'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',["no-app-id"]:'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.'},I=new o.LL("analytics","Analytics",C),E=30,T=1e3;class k{constructor(e={},t=T){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const S=new k;function N(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function x(e){var t;const{appId:n,apiKey:i}=e,r={method:"GET",headers:N(i)},o=h.replace("{app-id}",n),s=await fetch(o,r);if(200!==s.status&&304!==s.status){let e="";try{const n=await s.json();(null===(t=n.error)||void 0===t?void 0:t.message)&&(e=n.error.message)}catch(a){}throw I.create("config-fetch-failed",{httpStatus:s.status,responseMessage:e})}return s.json()}async function P(e,t=S,n){const{appId:i,apiKey:r,measurementId:o}=e.options;if(!i)throw I.create("no-app-id");if(!r){if(o)return{measurementId:o,appId:i};throw I.create("no-api-key")}const s=t.getThrottleMetadata(i)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new D;return setTimeout((async()=>{a.abort()}),void 0!==n?n:u),R({appId:i,apiKey:r,measurementId:o},s,a,t)}async function R(e,{throttleEndTimeMillis:t,backoffCount:n},i,r=S){const{appId:s,measurementId:a}=e;try{await O(i,t)}catch(c){if(a)return f.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${c.message}]`),{appId:s,measurementId:a};throw c}try{const t=await x(e);return r.deleteThrottleMetadata(s),t}catch(c){if(!A(c)){if(r.deleteThrottleMetadata(s),a)return f.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${c.message}]`),{appId:s,measurementId:a};throw c}const t=503===Number(c.customData.httpStatus)?(0,o.$s)(n,r.intervalMillis,E):(0,o.$s)(n,r.intervalMillis),l={throttleEndTimeMillis:Date.now()+t,backoffCount:n+1};return r.setThrottleMetadata(s,l),f.debug(`Calling attemptFetch again in ${t} millis`),R(e,l,i,r)}}function O(e,t){return new Promise(((n,i)=>{const r=Math.max(t-Date.now(),0),o=setTimeout(n,r);e.addEventListener((()=>{clearTimeout(o),i(I.create("fetch-throttle",{throttleEndTimeMillis:t}))}))}))}function A(e){if(!(e instanceof o.ZR)||!e.customData)return!1;const t=Number(e.customData["httpStatus"]);return 429===t||500===t||503===t||504===t}class D{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach((e=>e()))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function M(){if(!(0,o.hl)())return f.warn(I.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;try{await(0,o.eu)()}catch(e){return f.warn(I.create("indexeddb-unavailable",{errorInfo:e}).message),!1}return!0}async function F(e,t,n,i,r,o,s){var a;const u=P(e);u.then((t=>{n[t.measurementId]=t.appId,e.options.measurementId&&t.measurementId!==e.options.measurementId&&f.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)})).catch((e=>f.error(e))),t.push(u);const h=M().then((e=>e?i.getId():void 0)),[d,p]=await Promise.all([u,h]);b()||m(o,d.measurementId),r("js",new Date);const g=null!==(a=null===s||void 0===s?void 0:s.config)&&void 0!==a?a:{};return g[l]="firebase",g.update=!0,null!=p&&(g[c]=p),r("config",d.measurementId,g),d.measurementId}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.app=e}_delete(){return delete j[this.app.options.appId],Promise.resolve()}}let j={},q=[];const U={};let $,B,W="dataLayer",H="gtag",z=!1;function V(){const e=[];if((0,o.ru)()&&e.push("This is a browser extension environment."),(0,o.zI)()||e.push("Cookies are not available."),e.length>0){const t=e.map(((e,t)=>`(${t+1}) ${e}`)).join(" "),n=I.create("invalid-analytics-context",{errorInfo:t});f.warn(n.message)}}function G(e,t,n){V();const i=e.options.appId;if(!i)throw I.create("no-app-id");if(!e.options.apiKey){if(!e.options.measurementId)throw I.create("no-api-key");f.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`)}if(null!=j[i])throw I.create("already-exists",{id:i});if(!z){g(W);const{wrappedGtag:e,gtagCore:t}=w(j,q,U,W,H);B=e,$=t,z=!0}j[i]=F(e,q,U,t,$,W,n);const r=new L(e);return r}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K(e,t,n,i,r){if(r&&r.global)e("event",n,i);else{const r=await t,o=Object.assign(Object.assign({},i),{send_to:r});e("event",n,o)}}function Y(e=(0,i.Mq)()){e=(0,o.m9)(e);const t=(0,i.qX)(e,a);return t.isInitialized()?t.getImmediate():J(e)}function J(e,t={}){const n=(0,i.qX)(e,a);if(n.isInitialized()){const e=n.getImmediate();if((0,o.vZ)(t,n.getOptions()))return e;throw I.create("already-initialized")}const r=n.initialize({options:t});return r}function X(e,t,n,i){e=(0,o.m9)(e),K(B,j[e.app.options.appId],t,n,i).catch((e=>f.error(e)))}const Q="@firebase/analytics",Z="0.7.8";function ee(){function e(e){try{const t=e.getProvider(a).getImmediate();return{logEvent:(e,n,i)=>X(t,e,n,i)}}catch(t){throw I.create("interop-component-reg-failed",{reason:t})}}(0,i.Xd)(new s.wA(a,((e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return G(n,i,t)}),"PUBLIC")),(0,i.Xd)(new s.wA("analytics-internal",e,"PRIVATE")),(0,i.KN)(Q,Z),(0,i.KN)(Q,Z,"esm2017")}ee()},503:function(e,t,n){"use strict";n.d(t,{ZF:function(){return i.ZF}});var i=n(238),r="firebase",o="9.6.11";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(0,i.KN)(r,o,"app")},663:function(e,t,n){"use strict";n.d(t,{iU:function(){return is},U2:function(){return rs},N8:function(){return ds},iH:function(){return ns}});var i=n(238),r=n(463),o=n(444),s=n(333);const a="@firebase/database",c="0.12.8";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let l="";function u(e){l=e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){null==t?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),(0,o.Pz)(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return null==t?null:(0,o.cI)(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){null==t?delete this.cache_[e]:this.cache_[e]=t}get(e){return(0,o.r3)(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f=function(e){try{if("undefined"!==typeof window&&"undefined"!==typeof window[e]){const t=window[e];return t.setItem("firebase:sentinel","cache"),t.removeItem("firebase:sentinel"),new h(t)}}catch(t){}return new d},p=f("localStorage"),m=f("sessionStorage"),g=new s.Yd("@firebase/database"),_=function(){let e=1;return function(){return e++}}(),y=function(e){const t=(0,o.dS)(e),n=new o.gQ;n.update(t);const i=n.digest();return o.US.encodeByteArray(i)},v=function(...e){let t="";for(let n=0;n<e.length;n++){const i=e[n];Array.isArray(i)||i&&"object"===typeof i&&"number"===typeof i.length?t+=v.apply(null,i):t+="object"===typeof i?(0,o.Pz)(i):i,t+=" "}return t};let w=null,b=!0;const C=function(e,t){(0,o.hu)(!t||!0===e||!1===e,"Can't turn on custom loggers persistently."),!0===e?(g.logLevel=s["in"].VERBOSE,w=g.log.bind(g),t&&m.set("logging_enabled",!0)):"function"===typeof e?w=e:(w=null,m.remove("logging_enabled"))},I=function(...e){if(!0===b&&(b=!1,null===w&&!0===m.get("logging_enabled")&&C(!0)),w){const t=v.apply(null,e);w(t)}},E=function(e){return function(...t){I(e,...t)}},T=function(...e){const t="FIREBASE INTERNAL ERROR: "+v(...e);g.error(t)},k=function(...e){const t=`FIREBASE FATAL ERROR: ${v(...e)}`;throw g.error(t),new Error(t)},S=function(...e){const t="FIREBASE WARNING: "+v(...e);g.warn(t)},N=function(){"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&S("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},x=function(e){return"number"===typeof e&&(e!==e||e===Number.POSITIVE_INFINITY||e===Number.NEGATIVE_INFINITY)},P=function(e){if((0,o.Yr)()||"complete"===document.readyState)e();else{let t=!1;const n=function(){document.body?t||(t=!0,e()):setTimeout(n,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",(()=>{"complete"===document.readyState&&n()})),window.attachEvent("onload",n))}},R="[MIN_NAME]",O="[MAX_NAME]",A=function(e,t){if(e===t)return 0;if(e===R||t===O)return-1;if(t===R||e===O)return 1;{const n=z(e),i=z(t);return null!==n?null!==i?n-i===0?e.length-t.length:n-i:-1:null!==i?1:e<t?-1:1}},D=function(e,t){return e===t?0:e<t?-1:1},M=function(e,t){if(t&&e in t)return t[e];throw new Error("Missing required key ("+e+") in object: "+(0,o.Pz)(t))},F=function(e){if("object"!==typeof e||null===e)return(0,o.Pz)(e);const t=[];for(const i in e)t.push(i);t.sort();let n="{";for(let i=0;i<t.length;i++)0!==i&&(n+=","),n+=(0,o.Pz)(t[i]),n+=":",n+=F(e[t[i]]);return n+="}",n},L=function(e,t){const n=e.length;if(n<=t)return[e];const i=[];for(let r=0;r<n;r+=t)r+t>n?i.push(e.substring(r,n)):i.push(e.substring(r,r+t));return i};function j(e,t){for(const n in e)e.hasOwnProperty(n)&&t(n,e[n])}const q=function(e){(0,o.hu)(!x(e),"Invalid JSON number");const t=11,n=52,i=(1<<t-1)-1;let r,s,a,c,l;0===e?(s=0,a=0,r=1/e===-1/0?1:0):(r=e<0,e=Math.abs(e),e>=Math.pow(2,1-i)?(c=Math.min(Math.floor(Math.log(e)/Math.LN2),i),s=c+i,a=Math.round(e*Math.pow(2,n-c)-Math.pow(2,n))):(s=0,a=Math.round(e/Math.pow(2,1-i-n))));const u=[];for(l=n;l;l-=1)u.push(a%2?1:0),a=Math.floor(a/2);for(l=t;l;l-=1)u.push(s%2?1:0),s=Math.floor(s/2);u.push(r?1:0),u.reverse();const h=u.join("");let d="";for(l=0;l<64;l+=8){let e=parseInt(h.substr(l,8),2).toString(16);1===e.length&&(e="0"+e),d+=e}return d.toLowerCase()},U=function(){return!("object"!==typeof window||!window["chrome"]||!window["chrome"]["extension"]||/^chrome/.test(window.location.href))},$=function(){return"object"===typeof Windows&&"object"===typeof Windows.UI};const B=new RegExp("^-?(0*)\\d{1,10}$"),W=-2147483648,H=2147483647,z=function(e){if(B.test(e)){const t=Number(e);if(t>=W&&t<=H)return t}return null},V=function(e){try{e()}catch(t){setTimeout((()=>{const e=t.stack||"";throw S("Exception was thrown by user callback.",e),t}),Math.floor(0))}},G=function(){const e="object"===typeof window&&window["navigator"]&&window["navigator"]["userAgent"]||"";return e.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},K=function(e,t){const n=setTimeout(e,t);return"object"===typeof n&&n["unref"]&&n["unref"](),n};
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Y{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=null===t||void 0===t?void 0:t.getImmediate({optional:!0}),this.appCheck||null===t||void 0===t||t.get().then((e=>this.appCheck=e))}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise(((t,n)=>{setTimeout((()=>{this.appCheck?this.getToken(e).then(t,n):t(null)}),0)}))}addTokenChangeListener(e){var t;null===(t=this.appCheckProvider)||void 0===t||t.get().then((t=>t.addTokenListener(e)))}notifyForInvalidToken(){S(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e,t,n){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=n,this.auth_=null,this.auth_=n.getImmediate({optional:!0}),this.auth_||n.onInit((e=>this.auth_=e))}getToken(e){return this.auth_?this.auth_.getToken(e).catch((e=>e&&"auth/token-not-initialized"===e.code?(I("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(e))):new Promise(((t,n)=>{setTimeout((()=>{this.auth_?this.getToken(e).then(t,n):t(null)}),0)}))}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then((t=>t.addAuthTokenListener(e)))}removeTokenChangeListener(e){this.authProvider_.get().then((t=>t.removeAuthTokenListener(e)))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',S(e)}}class X{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}X.OWNER="owner";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Q="5",Z="v",ee="s",te="r",ne="f",ie=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,re="ls",oe="p",se="ac",ae="websocket",ce="long_polling";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class le{constructor(e,t,n,i,r=!1,o="",s=!1){this.secure=t,this.namespace=n,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=s,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=p.get("host:"+e)||this._host}isCacheableHost(){return"s-"===this.internalHost.substr(0,2)}isCustomHost(){return"firebaseio.com"!==this._domain&&"firebaseio-demo.com"!==this._domain}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&p.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function ue(e){return e.host!==e.internalHost||e.isCustomHost()||e.includeNamespaceInQueryParams}function he(e,t,n){let i;if((0,o.hu)("string"===typeof t,"typeof type must == string"),(0,o.hu)("object"===typeof n,"typeof params must == object"),t===ae)i=(e.secure?"wss://":"ws://")+e.internalHost+"/.ws?";else{if(t!==ce)throw new Error("Unknown connection type: "+t);i=(e.secure?"https://":"http://")+e.internalHost+"/.lp?"}ue(e)&&(n["ns"]=e.namespace);const r=[];return j(n,((e,t)=>{r.push(e+"="+t)})),i+r.join("&")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(){this.counters_={}}incrementCounter(e,t=1){(0,o.r3)(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return(0,o.p$)(this.counters_)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe={},pe={};function me(e){const t=e.toString();return fe[t]||(fe[t]=new de),fe[t]}function ge(e,t){const n=e.toString();return pe[n]||(pe[n]=t()),pe[n]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){this.pendingResponses[e]=t;while(this.pendingResponses[this.currentResponseNum]){const e=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let t=0;t<e.length;++t)e[t]&&V((()=>{this.onMessage_(e[t])}));if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ye="start",ve="close",we="pLPCommand",be="pRTLPCB",Ce="id",Ie="pw",Ee="ser",Te="cb",ke="seg",Se="ts",Ne="d",xe="dframe",Pe=1870,Re=30,Oe=Pe-Re,Ae=25e3,De=3e4;class Me{constructor(e,t,n,i,r,o,s){this.connId=e,this.repoInfo=t,this.applicationId=n,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=s,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=E(e),this.stats_=me(t),this.urlFn=e=>(this.appCheckToken&&(e[se]=this.appCheckToken),he(t,ce,e))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new _e(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout((()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null}),Math.floor(De)),P((()=>{if(this.isClosed_)return;this.scriptTagHolder=new Fe(((...e)=>{const[t,n,i,r,o]=e;if(this.incrementIncomingBytes_(e),this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,t===ye)this.id=n,this.password=i;else{if(t!==ve)throw new Error("Unrecognized command received: "+t);n?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(n,(()=>{this.onClosed_()}))):this.onClosed_()}}),((...e)=>{const[t,n]=e;this.incrementIncomingBytes_(e),this.myPacketOrderer.handleResponse(t,n)}),(()=>{this.onClosed_()}),this.urlFn);const e={};e[ye]="t",e[Ee]=Math.floor(1e8*Math.random()),this.scriptTagHolder.uniqueCallbackIdentifier&&(e[Te]=this.scriptTagHolder.uniqueCallbackIdentifier),e[Z]=Q,this.transportSessionId&&(e[ee]=this.transportSessionId),this.lastSessionId&&(e[re]=this.lastSessionId),this.applicationId&&(e[oe]=this.applicationId),this.appCheckToken&&(e[se]=this.appCheckToken),"undefined"!==typeof location&&location.hostname&&ie.test(location.hostname)&&(e[te]=ne);const t=this.urlFn(e);this.log_("Connecting via long-poll to "+t),this.scriptTagHolder.addTag(t,(()=>{}))}))}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Me.forceAllow_=!0}static forceDisallow(){Me.forceDisallow_=!0}static isAvailable(){return!(0,o.Yr)()&&(!!Me.forceAllow_||!Me.forceDisallow_&&"undefined"!==typeof document&&null!=document.createElement&&!U()&&!$())}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=(0,o.Pz)(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=(0,o.h$)(t),i=L(n,Oe);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){if((0,o.Yr)())return;this.myDisconnFrame=document.createElement("iframe");const n={};n[xe]="t",n[Ce]=e,n[Ie]=t,this.myDisconnFrame.src=this.urlFn(n),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=(0,o.Pz)(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Fe{constructor(e,t,n,i){if(this.onDisconnect=n,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(1e8*Math.random()),this.sendNewPolls=!0,(0,o.Yr)())this.commandCB=e,this.onMessageCB=t;else{this.uniqueCallbackIdentifier=_(),window[we+this.uniqueCallbackIdentifier]=e,window[be+this.uniqueCallbackIdentifier]=t,this.myIFrame=Fe.createIFrame_();let n="";if(this.myIFrame.src&&"javascript:"===this.myIFrame.src.substr(0,"javascript:".length)){const e=document.domain;n='<script>document.domain="'+e+'";<\/script>'}const i="<html><body>"+n+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(i),this.myIFrame.doc.close()}catch(r){I("frame writing exception"),r.stack&&I(r.stack),I(r)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",!document.body)throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";document.body.appendChild(e);try{const t=e.contentWindow.document;t||I("No IE domain setting required")}catch(t){const n=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+n+"';document.close();})())"}return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.innerHTML="",setTimeout((()=>{null!==this.myIFrame&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)}),Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){this.myID=e,this.myPW=t,this.alive=!0;while(this.newRequest_());}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Ce]=this.myID,e[Ie]=this.myPW,e[Ee]=this.currentSerial;let t=this.urlFn(e),n="",i=0;while(this.pendingSegs.length>0){const e=this.pendingSegs[0];if(!(e.d.length+Re+n.length<=Pe))break;{const e=this.pendingSegs.shift();n=n+"&"+ke+i+"="+e.seg+"&"+Se+i+"="+e.ts+"&"+Ne+i+"="+e.d,i++}}return t+=n,this.addLongPollTag_(t,this.currentSerial),!0}return!1}enqueueSegment(e,t,n){this.pendingSegs.push({seg:e,ts:t,d:n}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const n=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(n,Math.floor(Ae)),r=()=>{clearTimeout(i),n()};this.addTag(e,r)}addTag(e,t){(0,o.Yr)()?this.doNodeLongPoll(e,t):setTimeout((()=>{try{if(!this.sendNewPolls)return;const n=this.myIFrame.doc.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.onload=n.onreadystatechange=function(){const e=n.readyState;e&&"loaded"!==e&&"complete"!==e||(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),t())},n.onerror=()=>{I("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(n)}catch(n){}}),Math.floor(1))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Le=16384,je=45e3;let qe=null;"undefined"!==typeof MozWebSocket?qe=MozWebSocket:"undefined"!==typeof WebSocket&&(qe=WebSocket);class Ue{constructor(e,t,n,i,r,o,s){this.connId=e,this.applicationId=n,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=E(this.connId),this.stats_=me(t),this.connURL=Ue.connectionURL_(t,o,s,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,n,i){const r={};return r[Z]=Q,!(0,o.Yr)()&&"undefined"!==typeof location&&location.hostname&&ie.test(location.hostname)&&(r[te]=ne),t&&(r[ee]=t),n&&(r[re]=n),i&&(r[se]=i),he(e,ae,r)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,p.set("previous_websocket_failure",!0);try{if((0,o.Yr)()){const e=this.nodeAdmin?"AdminNode":"Node",t={headers:{"User-Agent":`Firebase/${Q}/${l}/${process.platform}/${e}`,"X-Firebase-GMPID":this.applicationId||""}};this.authToken&&(t.headers["Authorization"]=`Bearer ${this.authToken}`),this.appCheckToken&&(t.headers["X-Firebase-AppCheck"]=this.appCheckToken);const n={NODE_ENV:"production",BASE_URL:"/"},i=0===this.connURL.indexOf("wss://")?n["HTTPS_PROXY"]||n["https_proxy"]:n["HTTP_PROXY"]||n["http_proxy"];i&&(t["proxy"]={origin:i}),this.mySock=new qe(this.connURL,[],t)}else{const e={headers:{"X-Firebase-GMPID":this.applicationId||"","X-Firebase-AppCheck":this.appCheckToken||""}};this.mySock=new qe(this.connURL,[],e)}}catch(n){this.log_("Error instantiating WebSocket.");const e=n.message||n.data;return e&&this.log_(e),void this.onClosed_()}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=e=>{this.handleIncomingFrame(e)},this.mySock.onerror=e=>{this.log_("WebSocket error.  Closing connection.");const t=e.message||e.data;t&&this.log_(t),this.onClosed_()}}start(){}static forceDisallow(){Ue.forceDisallow_=!0}static isAvailable(){let e=!1;if("undefined"!==typeof navigator&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,n=navigator.userAgent.match(t);n&&n.length>1&&parseFloat(n[1])<4.4&&(e=!0)}return!e&&null!==qe&&!Ue.forceDisallow_}static previouslyFailed(){return p.isInMemoryStorage||!0===p.get("previous_websocket_failure")}markConnectionHealthy(){p.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const e=this.frames.join("");this.frames=null;const t=(0,o.cI)(e);this.onMessage(t)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if((0,o.hu)(null===this.frames,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(null===this.mySock)return;const t=e["data"];if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),null!==this.frames)this.appendFrame_(t);else{const e=this.extractFrameCount_(t);null!==e&&this.appendFrame_(e)}}send(e){this.resetKeepAlive();const t=(0,o.Pz)(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=L(t,Le);n.length>1&&this.sendString_(String(n.length));for(let i=0;i<n.length;i++)this.sendString_(n[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval((()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()}),Math.floor(je))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Ue.responsesRequiredToBeHealthy=2,Ue.healthyTimeout=3e4;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class $e{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[Me,Ue]}initTransports_(e){const t=Ue&&Ue["isAvailable"]();let n=t&&!Ue.previouslyFailed();if(e.webSocketOnly&&(t||S("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),n=!0),n)this.transports_=[Ue];else{const e=this.transports_=[];for(const t of $e.ALL_TRANSPORTS)t&&t["isAvailable"]()&&e.push(t)}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Be=6e4,We=5e3,He=10240,ze=102400,Ve="t",Ge="d",Ke="s",Ye="r",Je="e",Xe="o",Qe="a",Ze="n",et="p",tt="h";class nt{constructor(e,t,n,i,r,o,s,a,c,l){this.id=e,this.repoInfo_=t,this.applicationId_=n,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=s,this.onDisconnect_=a,this.onKill_=c,this.lastSessionId=l,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=E("c:"+this.id+":"),this.transportManager_=new $e(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e["responsesRequiredToBeHealthy"]||0;const t=this.connReceiver_(this.conn_),n=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout((()=>{this.conn_&&this.conn_.open(t,n)}),Math.floor(0));const i=e["healthyTimeout"]||0;i>0&&(this.healthyTimeout_=K((()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>ze?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>He?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))}),Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{2!==this.state_&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Ve in e){const t=e[Ve];t===Qe?this.upgradeIfSecondaryHealthy_():t===Ye?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),this.tx_!==this.secondaryConn_&&this.rx_!==this.secondaryConn_||this.close()):t===Xe&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=M("t",e),n=M("d",e);if("c"===t)this.onSecondaryControl_(n);else{if("d"!==t)throw new Error("Unknown protocol layer: "+t);this.pendingDataMessages.push(n)}}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:et,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Qe,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Ze,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=M("t",e),n=M("d",e);"c"===t?this.onControl_(n):"d"===t&&this.onDataMessage_(n)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=M(Ve,e);if(Ge in e){const n=e[Ge];if(t===tt)this.onHandshake_(n);else if(t===Ze){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let e=0;e<this.pendingDataMessages.length;++e)this.onDataMessage_(this.pendingDataMessages[e]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Ke?this.onConnectionShutdown_(n):t===Ye?this.onReset_(n):t===Je?T("Server Error: "+n):t===Xe?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):T("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,n=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,0===this.state_&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Q!==n&&S("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e["responsesRequiredToBeHealthy"]||0;const t=this.connReceiver_(this.secondaryConn_),n=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,n),K((()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())}),Math.floor(Be))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,1===this.state_?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),0===this.primaryResponsesRequired_?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):K((()=>{this.sendPingOnPrimaryIfNecessary_()}),Math.floor(We))}sendPingOnPrimaryIfNecessary_(){this.isHealthy_||1!==this.state_||(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:et,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,this.tx_!==e&&this.rx_!==e||this.close()}onConnectionLost_(e){this.conn_=null,e||0!==this.state_?1===this.state_&&this.log_("Realtime connection lost."):(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(p.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(1!==this.state_)throw"Connection is not connected";this.tx_.send(e)}close(){2!==this.state_&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{put(e,t,n,i){}merge(e,t,n,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,n){}onDisconnectMerge(e,t,n){}onDisconnectCancel(e,t){}reportStats(e){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.allowedEvents_=e,this.listeners_={},(0,o.hu)(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const n=[...this.listeners_[e]];for(let e=0;e<n.length;e++)n[e].callback.apply(n[e].context,t)}}on(e,t,n){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:n});const i=this.getInitialEvent(e);i&&t.apply(n,i)}off(e,t,n){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!n||n===i[r].context))return void i.splice(r,1)}validateEventType_(e){(0,o.hu)(this.allowedEvents_.find((t=>t===e)),"Unknown event: "+e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot extends rt{constructor(){super(["online"]),this.online_=!0,"undefined"===typeof window||"undefined"===typeof window.addEventListener||(0,o.uI)()||(window.addEventListener("online",(()=>{this.online_||(this.online_=!0,this.trigger("online",!0))}),!1),window.addEventListener("offline",(()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))}),!1))}static getInstance(){return new ot}getInitialEvent(e){return(0,o.hu)("online"===e,"Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st=32,at=768;class ct{constructor(e,t){if(void 0===t){this.pieces_=e.split("/");let t=0;for(let e=0;e<this.pieces_.length;e++)this.pieces_[e].length>0&&(this.pieces_[t]=this.pieces_[e],t++);this.pieces_.length=t,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)""!==this.pieces_[t]&&(e+="/"+this.pieces_[t]);return e||"/"}}function lt(){return new ct("")}function ut(e){return e.pieceNum_>=e.pieces_.length?null:e.pieces_[e.pieceNum_]}function ht(e){return e.pieces_.length-e.pieceNum_}function dt(e){let t=e.pieceNum_;return t<e.pieces_.length&&t++,new ct(e.pieces_,t)}function ft(e){return e.pieceNum_<e.pieces_.length?e.pieces_[e.pieces_.length-1]:null}function pt(e){let t="";for(let n=e.pieceNum_;n<e.pieces_.length;n++)""!==e.pieces_[n]&&(t+="/"+encodeURIComponent(String(e.pieces_[n])));return t||"/"}function mt(e,t=0){return e.pieces_.slice(e.pieceNum_+t)}function gt(e){if(e.pieceNum_>=e.pieces_.length)return null;const t=[];for(let n=e.pieceNum_;n<e.pieces_.length-1;n++)t.push(e.pieces_[n]);return new ct(t,0)}function _t(e,t){const n=[];for(let i=e.pieceNum_;i<e.pieces_.length;i++)n.push(e.pieces_[i]);if(t instanceof ct)for(let i=t.pieceNum_;i<t.pieces_.length;i++)n.push(t.pieces_[i]);else{const e=t.split("/");for(let t=0;t<e.length;t++)e[t].length>0&&n.push(e[t])}return new ct(n,0)}function yt(e){return e.pieceNum_>=e.pieces_.length}function vt(e,t){const n=ut(e),i=ut(t);if(null===n)return t;if(n===i)return vt(dt(e),dt(t));throw new Error("INTERNAL ERROR: innerPath ("+t+") is not within outerPath ("+e+")")}function wt(e,t){if(ht(e)!==ht(t))return!1;for(let n=e.pieceNum_,i=t.pieceNum_;n<=e.pieces_.length;n++,i++)if(e.pieces_[n]!==t.pieces_[i])return!1;return!0}function bt(e,t){let n=e.pieceNum_,i=t.pieceNum_;if(ht(e)>ht(t))return!1;while(n<e.pieces_.length){if(e.pieces_[n]!==t.pieces_[i])return!1;++n,++i}return!0}class Ct{constructor(e,t){this.errorPrefix_=t,this.parts_=mt(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let n=0;n<this.parts_.length;n++)this.byteLength_+=(0,o.ug)(this.parts_[n]);Tt(this)}}function It(e,t){e.parts_.length>0&&(e.byteLength_+=1),e.parts_.push(t),e.byteLength_+=(0,o.ug)(t),Tt(e)}function Et(e){const t=e.parts_.pop();e.byteLength_-=(0,o.ug)(t),e.parts_.length>0&&(e.byteLength_-=1)}function Tt(e){if(e.byteLength_>at)throw new Error(e.errorPrefix_+"has a key path longer than "+at+" bytes ("+e.byteLength_+").");if(e.parts_.length>st)throw new Error(e.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+st+") or object contains a cycle "+kt(e))}function kt(e){return 0===e.parts_.length?"":"in property '"+e.parts_.join(".")+"'"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St extends rt{constructor(){let e,t;super(["visible"]),"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document["hidden"]?(t="visibilitychange",e="hidden"):"undefined"!==typeof document["mozHidden"]?(t="mozvisibilitychange",e="mozHidden"):"undefined"!==typeof document["msHidden"]?(t="msvisibilitychange",e="msHidden"):"undefined"!==typeof document["webkitHidden"]&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,(()=>{const t=!document[e];t!==this.visible_&&(this.visible_=t,this.trigger("visible",t))}),!1)}static getInstance(){return new St}getInitialEvent(e){return(0,o.hu)("visible"===e,"Unknown event type: "+e),[this.visible_]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=1e3,xt=3e5,Pt=3e3,Rt=3e4,Ot=1.3,At=3e4,Dt="server_kill",Mt=3;class Ft extends it{constructor(e,t,n,i,r,s,a,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=n,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=s,this.appCheckTokenProvider_=a,this.authOverride_=c,this.id=Ft.nextPersistentConnectionId_++,this.log_=E("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Nt,this.maxReconnectDelay_=xt,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c&&!(0,o.Yr)())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");St.getInstance().on("visible",this.onVisible_,this),-1===e.host.indexOf("fblocal")&&ot.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,n){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_((0,o.Pz)(r)),(0,o.hu)(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),n&&(this.requestCBHash_[i]=n)}get(e){this.initConnection_();const t=new o.BH,n={p:e._path.toString(),q:e._queryObject},i={action:"g",request:n,onComplete:e=>{const i=e["d"];"ok"===e["s"]?(this.onDataUpdate_(n["p"],i,!1,null),t.resolve(i)):t.reject(i)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_||setTimeout((()=>{const e=this.outstandingGets_[r];void 0!==e&&i===e&&(delete this.outstandingGets_[r],this.outstandingGetCount_--,0===this.outstandingGetCount_&&(this.outstandingGets_=[]),this.log_("get "+r+" timed out on connection"),t.reject(new Error("Client is offline.")))}),Pt),this.connected_&&this.sendGet_(r),t.promise}listen(e,t,n,i){this.initConnection_();const r=e._queryIdentifier,s=e._path.toString();this.log_("Listen called for "+s+" "+r),this.listens.has(s)||this.listens.set(s,new Map),(0,o.hu)(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),(0,o.hu)(!this.listens.get(s).has(r),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:t,query:e,tag:n};this.listens.get(s).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,(n=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,0===this.outstandingGetCount_&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(n)}))}sendListen_(e){const t=e.query,n=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+n+" for "+i);const r={p:n},o="q";e.tag&&(r["q"]=t._queryObject,r["t"]=e.tag),r["h"]=e.hashFn(),this.sendRequest(o,r,(r=>{const o=r["d"],s=r["s"];Ft.warnOnListenWarnings_(o,t);const a=this.listens.get(n)&&this.listens.get(n).get(i);a===e&&(this.log_("listen response",r),"ok"!==s&&this.removeListen_(n,i),e.onComplete&&e.onComplete(s,o))}))}static warnOnListenWarnings_(e,t){if(e&&"object"===typeof e&&(0,o.r3)(e,"w")){const n=(0,o.DV)(e,"w");if(Array.isArray(n)&&~n.indexOf("no_index")){const e='".indexOn": "'+t._queryParams.getIndex().toString()+'"',n=t._path.toString();S(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${e} at ${n} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},(()=>{})),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){const t=e&&40===e.length;(t||(0,o.GJ)(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Rt)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},(()=>{}))}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=(0,o.w9)(e)?"auth":"gauth",n={cred:e};null===this.authOverride_?n["noauth"]=!0:"object"===typeof this.authOverride_&&(n["authvar"]=this.authOverride_),this.sendRequest(t,n,(t=>{const n=t["s"],i=t["d"]||"error";this.authToken_===e&&("ok"===n?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(n,i))}))}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},(e=>{const t=e["s"],n=e["d"]||"error";"ok"===t?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,n)}))}unlisten(e,t){const n=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+n+" "+i),(0,o.hu)(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query");const r=this.removeListen_(n,i);r&&this.connected_&&this.sendUnlisten_(n,i,e._queryObject,t)}sendUnlisten_(e,t,n,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r["q"]=n,r["t"]=i),this.sendRequest(o,r)}onDisconnectPut(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:n})}onDisconnectMerge(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:n})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,n,i){const r={p:t,d:n};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,(e=>{i&&setTimeout((()=>{i(e["s"],e["d"])}),Math.floor(0))}))}put(e,t,n,i){this.putInternal("p",e,t,n,i)}merge(e,t,n,i){this.putInternal("m",e,t,n,i)}putInternal(e,t,n,i,r){this.initConnection_();const o={p:t,d:n};void 0!==r&&(o["h"]=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const s=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(s):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,n=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,n,(n=>{this.log_(t+" response",n),delete this.outstandingPuts_[e],this.outstandingPutCount_--,0===this.outstandingPutCount_&&(this.outstandingPuts_=[]),i&&i(n["s"],n["d"])}))}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,(e=>{const t=e["s"];if("ok"!==t){const t=e["d"];this.log_("reportStats","Error sending stats: "+t)}}))}}onDataMessage_(e){if("r"in e){this.log_("from server: "+(0,o.Pz)(e));const t=e["r"],n=this.requestCBHash_[t];n&&(delete this.requestCBHash_[t],n(e["b"]))}else{if("error"in e)throw"A server-side error has occurred: "+e["error"];"a"in e&&this.onDataPush_(e["a"],e["b"])}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),"d"===e?this.onDataUpdate_(t["p"],t["d"],!1,t["t"]):"m"===e?this.onDataUpdate_(t["p"],t["d"],!0,t["t"]):"c"===e?this.onListenRevoked_(t["p"],t["q"]):"ac"===e?this.onAuthRevoked_(t["s"],t["d"]):"apc"===e?this.onAppCheckRevoked_(t["s"],t["d"]):"sd"===e?this.onSecurityDebugPacket_(t):T("Unrecognized action received from server: "+(0,o.Pz)(e)+"\nAre you using the latest client?")}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=(new Date).getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){(0,o.hu)(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout((()=>{this.establishConnectionTimer_=null,this.establishConnection_()}),Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Nt,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Nt,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){if(this.visible_){if(this.lastConnectionEstablishedTime_){const e=(new Date).getTime()-this.lastConnectionEstablishedTime_;e>At&&(this.reconnectDelay_=Nt),this.lastConnectionEstablishedTime_=null}}else this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=(new Date).getTime();const e=(new Date).getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Ot)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=(new Date).getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),n=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+Ft.nextConnectionId_++,r=this.lastSessionId;let s=!1,a=null;const c=function(){a?a.close():(s=!0,n())},l=function(e){(0,o.hu)(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(e)};this.realtime_={close:c,sendRequest:l};const u=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[o,c]=await Promise.all([this.authTokenProvider_.getToken(u),this.appCheckTokenProvider_.getToken(u)]);s?I("getToken() completed but was canceled"):(I("getToken() completed. Creating connection."),this.authToken_=o&&o.accessToken,this.appCheckToken_=c&&c.token,a=new nt(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,n,(e=>{S(e+" ("+this.repoInfo_.toString()+")"),this.interrupt(Dt)}),r))}catch(T){this.log_("Failed to get token: "+T),s||(this.repoInfo_.nodeAdmin&&S(T),c())}}}interrupt(e){I("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){I("Resuming connection for reason: "+e),delete this.interruptReasons_[e],(0,o.xb)(this.interruptReasons_)&&(this.reconnectDelay_=Nt,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-(new Date).getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}0===this.outstandingPutCount_&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let n;n=t?t.map((e=>F(e))).join("$"):"default";const i=this.removeListen_(e,n);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const n=new ct(e).toString();let i;if(this.listens.has(n)){const e=this.listens.get(n);i=e.get(t),e.delete(t),0===e.size&&this.listens.delete(n)}else i=void 0;return i}onAuthRevoked_(e,t){I("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Mt&&(this.reconnectDelay_=Rt,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){I("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Mt&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e["msg"].replace("\n","\nFIREBASE: "))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);while(this.onDisconnectRequestQueue_.length){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";(0,o.Yr)()&&(t=this.repoInfo_.nodeAdmin?"admin_node":"node"),e["sdk."+t+"."+l.replace(/\./g,"-")]=1,(0,o.uI)()?e["framework.cordova"]=1:(0,o.b$)()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=ot.getInstance().currentlyOnline();return(0,o.xb)(this.interruptReasons_)&&e}}Ft.nextPersistentConnectionId_=0,Ft.nextConnectionId_=0;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Lt{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new Lt(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const n=new Lt(R,e),i=new Lt(R,t);return 0!==this.compare(n,i)}minPost(){return Lt.MIN}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qt;class Ut extends jt{static get __EMPTY_NODE(){return qt}static set __EMPTY_NODE(e){qt=e}compare(e,t){return A(e.name,t.name)}isDefinedOn(e){throw(0,o.g5)("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return Lt.MIN}maxPost(){return new Lt(O,qt)}makePost(e,t){return(0,o.hu)("string"===typeof e,"KeyIndex indexValue must always be a string."),new Lt(e,qt)}toString(){return".key"}}const $t=new Ut;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e,t,n,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;while(!e.isEmpty())if(e=e,o=t?n(e.key,t):1,i&&(o*=-1),o<0)e=this.isReverse_?e.left:e.right;else{if(0===o){this.nodeStack_.push(e);break}this.nodeStack_.push(e),e=this.isReverse_?e.right:e.left}}getNext(){if(0===this.nodeStack_.length)return null;let e,t=this.nodeStack_.pop();if(e=this.resultGenerator_?this.resultGenerator_(t.key,t.value):{key:t.key,value:t.value},this.isReverse_){t=t.left;while(!t.isEmpty())this.nodeStack_.push(t),t=t.right}else{t=t.right;while(!t.isEmpty())this.nodeStack_.push(t),t=t.left}return e}hasNext(){return this.nodeStack_.length>0}peek(){if(0===this.nodeStack_.length)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Wt{constructor(e,t,n,i,r){this.key=e,this.value=t,this.color=null!=n?n:Wt.RED,this.left=null!=i?i:zt.EMPTY_NODE,this.right=null!=r?r:zt.EMPTY_NODE}copy(e,t,n,i,r){return new Wt(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=i?i:this.left,null!=r?r:this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const r=n(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,n),null):0===r?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return zt.EMPTY_NODE;let e=this;return e.left.isRed_()||e.left.left.isRed_()||(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let n,i;if(n=this,t(e,n.key)<0)n.left.isEmpty()||n.left.isRed_()||n.left.left.isRed_()||(n=n.moveRedLeft_()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed_()&&(n=n.rotateRight_()),n.right.isEmpty()||n.right.isRed_()||n.right.left.isRed_()||(n=n.moveRedRight_()),0===t(e,n.key)){if(n.right.isEmpty())return zt.EMPTY_NODE;i=n.right.min_(),n=n.copy(i.key,i.value,null,null,n.right.removeMin_())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Wt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Wt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Wt.RED=!0,Wt.BLACK=!1;class Ht{copy(e,t,n,i,r){return this}insert(e,t,n){return new Wt(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class zt{constructor(e,t=zt.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new zt(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Wt.BLACK,null,null))}remove(e){return new zt(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Wt.BLACK,null,null))}get(e){let t,n=this.root_;while(!n.isEmpty()){if(t=this.comparator_(e,n.key),0===t)return n.value;t<0?n=n.left:t>0&&(n=n.right)}return null}getPredecessorKey(e){let t,n=this.root_,i=null;while(!n.isEmpty()){if(t=this.comparator_(e,n.key),0===t){if(n.left.isEmpty())return i?i.key:null;n=n.left;while(!n.right.isEmpty())n=n.right;return n.key}t<0?n=n.left:t>0&&(i=n,n=n.right)}throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Bt(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new Bt(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new Bt(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new Bt(this.root_,null,this.comparator_,!0,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Vt(e,t){return A(e.name,t.name)}function Gt(e,t){return A(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Kt;function Yt(e){Kt=e}zt.EMPTY_NODE=new Ht;const Jt=function(e){return"number"===typeof e?"number:"+q(e):"string:"+e},Xt=function(e){if(e.isLeafNode()){const t=e.val();(0,o.hu)("string"===typeof t||"number"===typeof t||"object"===typeof t&&(0,o.r3)(t,".sv"),"Priority must be a string or number.")}else(0,o.hu)(e===Kt||e.isEmpty(),"priority of unexpected type.");(0,o.hu)(e===Kt||e.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Qt,Zt,en;class tn{constructor(e,t=tn.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,(0,o.hu)(void 0!==this.value_&&null!==this.value_,"LeafNode shouldn't be created with null/undefined value."),Xt(this.priorityNode_)}static set __childrenNodeConstructor(e){Qt=e}static get __childrenNodeConstructor(){return Qt}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new tn(this.value_,e)}getImmediateChild(e){return".priority"===e?this.priorityNode_:tn.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return yt(e)?this:".priority"===ut(e)?this.priorityNode_:tn.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return".priority"===e?this.updatePriority(t):t.isEmpty()&&".priority"!==e?this:tn.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const n=ut(e);return null===n?t:t.isEmpty()&&".priority"!==n?this:((0,o.hu)(".priority"!==n||1===ht(e),".priority must be the last token in a path"),this.updateImmediateChild(n,tn.__childrenNodeConstructor.EMPTY_NODE.updateChild(dt(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(null===this.lazyHash_){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Jt(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",e+="number"===t?q(this.value_):this.value_,this.lazyHash_=y(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===tn.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof tn.__childrenNodeConstructor?-1:((0,o.hu)(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,n=typeof this.value_,i=tn.VALUE_TYPE_ORDER.indexOf(t),r=tn.VALUE_TYPE_ORDER.indexOf(n);return(0,o.hu)(i>=0,"Unknown leaf type: "+t),(0,o.hu)(r>=0,"Unknown leaf type: "+n),i===r?"object"===n?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}return!1}}function nn(e){Zt=e}function rn(e){en=e}tn.VALUE_TYPE_ORDER=["object","boolean","number","string"];class on extends jt{compare(e,t){const n=e.node.getPriority(),i=t.node.getPriority(),r=n.compareTo(i);return 0===r?A(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return Lt.MIN}maxPost(){return new Lt(O,new tn("[PRIORITY-POST]",en))}makePost(e,t){const n=Zt(e);return new Lt(t,new tn("[PRIORITY-POST]",n))}toString(){return".priority"}}const sn=new on,an=Math.log(2);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e){const t=e=>parseInt(Math.log(e)/an,10),n=e=>parseInt(Array(e+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=n(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const ln=function(e,t,n,i){e.sort(t);const r=function(t,i){const o=i-t;let s,a;if(0===o)return null;if(1===o)return s=e[t],a=n?n(s):s,new Wt(a,s.node,Wt.BLACK,null,null);{const c=parseInt(o/2,10)+t,l=r(t,c),u=r(c+1,i);return s=e[c],a=n?n(s):s,new Wt(a,s.node,Wt.BLACK,l,u)}},o=function(t){let i=null,o=null,s=e.length;const a=function(t,i){const o=s-t,a=s;s-=t;const l=r(o+1,a),u=e[o],h=n?n(u):u;c(new Wt(h,u.node,i,null,l))},c=function(e){i?(i.left=e,i=e):(o=e,i=e)};for(let e=0;e<t.count;++e){const n=t.nextBitIsOne(),i=Math.pow(2,t.count-(e+1));n?a(i,Wt.BLACK):(a(i,Wt.BLACK),a(i,Wt.RED))}return o},s=new cn(e.length),a=o(s);return new zt(i||t,a)};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let un;const hn={};class dn{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return(0,o.hu)(hn&&sn,"ChildrenNode.ts has not been loaded"),un=un||new dn({".priority":hn},{".priority":sn}),un}get(e){const t=(0,o.DV)(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof zt?t:null}hasIndex(e){return(0,o.r3)(this.indexSet_,e.toString())}addIndex(e,t){(0,o.hu)(e!==$t,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const n=[];let i=!1;const r=t.getIterator(Lt.Wrap);let s,a=r.getNext();while(a)i=i||e.isDefinedOn(a.node),n.push(a),a=r.getNext();s=i?ln(n,e.getCompare()):hn;const c=e.toString(),l=Object.assign({},this.indexSet_);l[c]=e;const u=Object.assign({},this.indexes_);return u[c]=s,new dn(u,l)}addToIndexes(e,t){const n=(0,o.UI)(this.indexes_,((n,i)=>{const r=(0,o.DV)(this.indexSet_,i);if((0,o.hu)(r,"Missing index implementation for "+i),n===hn){if(r.isDefinedOn(e.node)){const n=[],i=t.getIterator(Lt.Wrap);let o=i.getNext();while(o)o.name!==e.name&&n.push(o),o=i.getNext();return n.push(e),ln(n,r.getCompare())}return hn}{const i=t.get(e.name);let r=n;return i&&(r=r.remove(new Lt(e.name,i))),r.insert(e,e.node)}}));return new dn(n,this.indexSet_)}removeFromIndexes(e,t){const n=(0,o.UI)(this.indexes_,(n=>{if(n===hn)return n;{const i=t.get(e.name);return i?n.remove(new Lt(e.name,i)):n}}));return new dn(n,this.indexSet_)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fn;class pn{constructor(e,t,n){this.children_=e,this.priorityNode_=t,this.indexMap_=n,this.lazyHash_=null,this.priorityNode_&&Xt(this.priorityNode_),this.children_.isEmpty()&&(0,o.hu)(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return fn||(fn=new pn(new zt(Gt),null,dn.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||fn}updatePriority(e){return this.children_.isEmpty()?this:new pn(this.children_,e,this.indexMap_)}getImmediateChild(e){if(".priority"===e)return this.getPriority();{const t=this.children_.get(e);return null===t?fn:t}}getChild(e){const t=ut(e);return null===t?this:this.getImmediateChild(t).getChild(dt(e))}hasChild(e){return null!==this.children_.get(e)}updateImmediateChild(e,t){if((0,o.hu)(t,"We should always be passing snapshot nodes"),".priority"===e)return this.updatePriority(t);{const n=new Lt(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(n,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(n,this.children_));const o=i.isEmpty()?fn:this.priorityNode_;return new pn(i,o,r)}}updateChild(e,t){const n=ut(e);if(null===n)return t;{(0,o.hu)(".priority"!==ut(e)||1===ht(e),".priority must be the last token in a path");const i=this.getImmediateChild(n).updateChild(dt(e),t);return this.updateImmediateChild(n,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let n=0,i=0,r=!0;if(this.forEachChild(sn,((o,s)=>{t[o]=s.val(e),n++,r&&pn.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1})),!e&&r&&i<2*n){const e=[];for(const n in t)e[n]=t[n];return e}return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(null===this.lazyHash_){let e="";this.getPriority().isEmpty()||(e+="priority:"+Jt(this.getPriority().val())+":"),this.forEachChild(sn,((t,n)=>{const i=n.hash();""!==i&&(e+=":"+t+":"+i)})),this.lazyHash_=""===e?"":y(e)}return this.lazyHash_}getPredecessorChildName(e,t,n){const i=this.resolveIndex_(n);if(i){const n=i.getPredecessorKey(new Lt(e,t));return n?n.name:null}return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.minKey();return e&&e.name}return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new Lt(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.maxKey();return e&&e.name}return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new Lt(t,this.children_.get(t)):null}forEachChild(e,t){const n=this.resolveIndex_(e);return n?n.inorderTraversal((e=>t(e.name,e.node))):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getIteratorFrom(e,(e=>e));{const n=this.children_.getIteratorFrom(e.name,Lt.Wrap);let i=n.peek();while(null!=i&&t.compare(i,e)<0)n.getNext(),i=n.peek();return n}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getReverseIteratorFrom(e,(e=>e));{const n=this.children_.getReverseIteratorFrom(e.name,Lt.Wrap);let i=n.peek();while(null!=i&&t.compare(i,e)>0)n.getNext(),i=n.peek();return n}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===gn?-1:0}withIndex(e){if(e===$t||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new pn(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===$t||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority())){if(this.children_.count()===t.children_.count()){const e=this.getIterator(sn),n=t.getIterator(sn);let i=e.getNext(),r=n.getNext();while(i&&r){if(i.name!==r.name||!i.node.equals(r.node))return!1;i=e.getNext(),r=n.getNext()}return null===i&&null===r}return!1}return!1}}resolveIndex_(e){return e===$t?null:this.indexMap_.get(e.toString())}}pn.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class mn extends pn{constructor(){super(new zt(Gt),pn.EMPTY_NODE,dn.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return pn.EMPTY_NODE}isEmpty(){return!1}}const gn=new mn;Object.defineProperties(Lt,{MIN:{value:new Lt(R,pn.EMPTY_NODE)},MAX:{value:new Lt(O,gn)}}),Ut.__EMPTY_NODE=pn.EMPTY_NODE,tn.__childrenNodeConstructor=pn,Yt(gn),rn(gn);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _n=!0;function yn(e,t=null){if(null===e)return pn.EMPTY_NODE;if("object"===typeof e&&".priority"in e&&(t=e[".priority"]),(0,o.hu)(null===t||"string"===typeof t||"number"===typeof t||"object"===typeof t&&".sv"in t,"Invalid priority type found: "+typeof t),"object"===typeof e&&".value"in e&&null!==e[".value"]&&(e=e[".value"]),"object"!==typeof e||".sv"in e){const n=e;return new tn(n,yn(t))}if(e instanceof Array||!_n){let n=pn.EMPTY_NODE;return j(e,((t,i)=>{if((0,o.r3)(e,t)&&"."!==t.substring(0,1)){const e=yn(i);!e.isLeafNode()&&e.isEmpty()||(n=n.updateImmediateChild(t,e))}})),n.updatePriority(yn(t))}{const n=[];let i=!1;const r=e;if(j(r,((e,t)=>{if("."!==e.substring(0,1)){const r=yn(t);r.isEmpty()||(i=i||!r.getPriority().isEmpty(),n.push(new Lt(e,r)))}})),0===n.length)return pn.EMPTY_NODE;const o=ln(n,Vt,(e=>e.name),Gt);if(i){const e=ln(n,sn.getCompare());return new pn(o,yn(t),new dn({".priority":e},{".priority":sn}))}return new pn(o,yn(t),dn.Default)}}nn(yn);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class vn extends jt{constructor(e){super(),this.indexPath_=e,(0,o.hu)(!yt(e)&&".priority"!==ut(e),"Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const n=this.extractChild(e.node),i=this.extractChild(t.node),r=n.compareTo(i);return 0===r?A(e.name,t.name):r}makePost(e,t){const n=yn(e),i=pn.EMPTY_NODE.updateChild(this.indexPath_,n);return new Lt(t,i)}maxPost(){const e=pn.EMPTY_NODE.updateChild(this.indexPath_,gn);return new Lt(O,e)}toString(){return mt(this.indexPath_,0).join("/")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn extends jt{compare(e,t){const n=e.node.compareTo(t.node);return 0===n?A(e.name,t.name):n}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return Lt.MIN}maxPost(){return Lt.MAX}makePost(e,t){const n=yn(e);return new Lt(t,n)}toString(){return".value"}}const bn=new wn,Cn="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(){let e=0;const t=[]})();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function In(e){return{type:"value",snapshotNode:e}}function En(e,t){return{type:"child_added",snapshotNode:t,childName:e}}function Tn(e,t){return{type:"child_removed",snapshotNode:t,childName:e}}function kn(e,t,n){return{type:"child_changed",snapshotNode:t,childName:e,oldSnap:n}}function Sn(e,t){return{type:"child_moved",snapshotNode:t,childName:e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e){this.index_=e}updateChild(e,t,n,i,r,s){(0,o.hu)(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(i).equals(n.getChild(i))&&a.isEmpty()===n.isEmpty()?e:(null!=s&&(n.isEmpty()?e.hasChild(t)?s.trackChildChange(Tn(t,a)):(0,o.hu)(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?s.trackChildChange(En(t,n)):s.trackChildChange(kn(t,n,a))),e.isLeafNode()&&n.isEmpty()?e:e.updateImmediateChild(t,n).withIndex(this.index_))}updateFullNode(e,t,n){return null!=n&&(e.isLeafNode()||e.forEachChild(sn,((e,i)=>{t.hasChild(e)||n.trackChildChange(Tn(e,i))})),t.isLeafNode()||t.forEachChild(sn,((t,i)=>{if(e.hasChild(t)){const r=e.getImmediateChild(t);r.equals(i)||n.trackChildChange(kn(t,i,r))}else n.trackChildChange(En(t,i))}))),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?pn.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this.indexedFilter_=new Nn(e.getIndex()),this.index_=e.getIndex(),this.startPost_=xn.getStartPost_(e),this.endPost_=xn.getEndPost_(e)}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){return this.index_.compare(this.getStartPost(),e)<=0&&this.index_.compare(e,this.getEndPost())<=0}updateChild(e,t,n,i,r,o){return this.matches(new Lt(t,n))||(n=pn.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,n,i,r,o)}updateFullNode(e,t,n){t.isLeafNode()&&(t=pn.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(pn.EMPTY_NODE);const r=this;return t.forEachChild(sn,((e,t)=>{r.matches(new Lt(e,t))||(i=i.updateImmediateChild(e,pn.EMPTY_NODE))})),this.indexedFilter_.updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}return e.getIndex().maxPost()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e){this.rangedFilter_=new xn(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft()}updateChild(e,t,n,i,r,o){return this.rangedFilter_.matches(new Lt(t,n))||(n=pn.EMPTY_NODE),e.getImmediateChild(t).equals(n)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,n,i,r,o):this.fullLimitUpdateChild_(e,t,n,r,o)}updateFullNode(e,t,n){let i;if(t.isLeafNode()||t.isEmpty())i=pn.EMPTY_NODE.withIndex(this.index_);else if(2*this.limit_<t.numChildren()&&t.isIndexed(this.index_)){let e;i=pn.EMPTY_NODE.withIndex(this.index_),e=this.reverse_?t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let n=0;while(e.hasNext()&&n<this.limit_){const t=e.getNext();let r;if(r=this.reverse_?this.index_.compare(this.rangedFilter_.getStartPost(),t)<=0:this.index_.compare(t,this.rangedFilter_.getEndPost())<=0,!r)break;i=i.updateImmediateChild(t.name,t.node),n++}}else{let e,n,r,o;if(i=t.withIndex(this.index_),i=i.updatePriority(pn.EMPTY_NODE),this.reverse_){o=i.getReverseIterator(this.index_),e=this.rangedFilter_.getEndPost(),n=this.rangedFilter_.getStartPost();const t=this.index_.getCompare();r=(e,n)=>t(n,e)}else o=i.getIterator(this.index_),e=this.rangedFilter_.getStartPost(),n=this.rangedFilter_.getEndPost(),r=this.index_.getCompare();let s=0,a=!1;while(o.hasNext()){const t=o.getNext();!a&&r(e,t)<=0&&(a=!0);const c=a&&s<this.limit_&&r(t,n)<=0;c?s++:i=i.updateImmediateChild(t.name,pn.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,n,i,r){let s;if(this.reverse_){const e=this.index_.getCompare();s=(t,n)=>e(n,t)}else s=this.index_.getCompare();const a=e;(0,o.hu)(a.numChildren()===this.limit_,"");const c=new Lt(t,n),l=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),u=this.rangedFilter_.matches(c);if(a.hasChild(t)){const e=a.getImmediateChild(t);let o=i.getChildAfterChild(this.index_,l,this.reverse_);while(null!=o&&(o.name===t||a.hasChild(o.name)))o=i.getChildAfterChild(this.index_,o,this.reverse_);const h=null==o?1:s(o,c),d=u&&!n.isEmpty()&&h>=0;if(d)return null!=r&&r.trackChildChange(kn(t,n,e)),a.updateImmediateChild(t,n);{null!=r&&r.trackChildChange(Tn(t,e));const n=a.updateImmediateChild(t,pn.EMPTY_NODE),i=null!=o&&this.rangedFilter_.matches(o);return i?(null!=r&&r.trackChildChange(En(o.name,o.node)),n.updateImmediateChild(o.name,o.node)):n}}return n.isEmpty()?e:u&&s(l,c)>=0?(null!=r&&(r.trackChildChange(Tn(l.name,l.node)),r.trackChildChange(En(t,n))),a.updateImmediateChild(t,n).updateImmediateChild(l.name,pn.EMPTY_NODE)):e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=sn}hasStart(){return this.startSet_}hasStartAfter(){return this.startAfterSet_}hasEndBefore(){return this.endBeforeSet_}isViewFromLeft(){return""===this.viewFrom_?this.startSet_:"l"===this.viewFrom_}getIndexStartValue(){return(0,o.hu)(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return(0,o.hu)(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:R}hasEnd(){return this.endSet_}getIndexEndValue(){return(0,o.hu)(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return(0,o.hu)(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:O}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&""!==this.viewFrom_}getLimit(){return(0,o.hu)(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===sn}copy(){const e=new Rn;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function On(e){return e.loadsAllData()?new Nn(e.getIndex()):e.hasLimit()?new Pn(e):new xn(e)}function An(e){const t={};if(e.isDefault())return t;let n;return e.index_===sn?n="$priority":e.index_===bn?n="$value":e.index_===$t?n="$key":((0,o.hu)(e.index_ instanceof vn,"Unrecognized index type!"),n=e.index_.toString()),t["orderBy"]=(0,o.Pz)(n),e.startSet_&&(t["startAt"]=(0,o.Pz)(e.indexStartValue_),e.startNameSet_&&(t["startAt"]+=","+(0,o.Pz)(e.indexStartName_))),e.endSet_&&(t["endAt"]=(0,o.Pz)(e.indexEndValue_),e.endNameSet_&&(t["endAt"]+=","+(0,o.Pz)(e.indexEndName_))),e.limitSet_&&(e.isViewFromLeft()?t["limitToFirst"]=e.limit_:t["limitToLast"]=e.limit_),t}function Dn(e){const t={};if(e.startSet_&&(t["sp"]=e.indexStartValue_,e.startNameSet_&&(t["sn"]=e.indexStartName_)),e.endSet_&&(t["ep"]=e.indexEndValue_,e.endNameSet_&&(t["en"]=e.indexEndName_)),e.limitSet_){t["l"]=e.limit_;let n=e.viewFrom_;""===n&&(n=e.isViewFromLeft()?"l":"r"),t["vf"]=n}return e.index_!==sn&&(t["i"]=e.index_.toString()),t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn extends it{constructor(e,t,n,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=n,this.appCheckTokenProvider_=i,this.log_=E("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return void 0!==t?"tag$"+t:((0,o.hu)(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,n,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const s=Mn.getListenId_(e,n),a={};this.listens_[s]=a;const c=An(e._queryParams);this.restRequest_(r+".json",c,((e,t)=>{let c=t;if(404===e&&(c=null,e=null),null===e&&this.onDataUpdate_(r,c,!1,n),(0,o.DV)(this.listens_,s)===a){let t;t=e?401===e?"permission_denied":"rest_error:"+e:"ok",i(t,null)}}))}unlisten(e,t){const n=Mn.getListenId_(e,t);delete this.listens_[n]}get(e){const t=An(e._queryParams),n=e._path.toString(),i=new o.BH;return this.restRequest_(n+".json",t,((e,t)=>{let r=t;404===e&&(r=null,e=null),null===e?(this.onDataUpdate_(n,r,!1,null),i.resolve(r)):i.reject(new Error(r))})),i.promise}refreshAuthToken(e){}restRequest_(e,t={},n){return t["format"]="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then((([i,r])=>{i&&i.accessToken&&(t["auth"]=i.accessToken),r&&r.token&&(t["ac"]=r.token);const s=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+(0,o.xO)(t);this.log_("Sending REST request for "+s);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(n&&4===a.readyState){this.log_("REST Response for "+s+" received. status:",a.status,"response:",a.responseText);let t=null;if(a.status>=200&&a.status<300){try{t=(0,o.cI)(a.responseText)}catch(e){S("Failed to parse JSON response for "+s+": "+a.responseText)}n(null,t)}else 401!==a.status&&404!==a.status&&S("Got unsuccessful REST response for "+s+" Status: "+a.status),n(a.status);n=null}},a.open("GET",s,!0),a.send()}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(){this.rootNode_=pn.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ln(){return{value:null,children:new Map}}function jn(e,t,n){if(yt(t))e.value=n,e.children.clear();else if(null!==e.value)e.value=e.value.updateChild(t,n);else{const i=ut(t);e.children.has(i)||e.children.set(i,Ln());const r=e.children.get(i);t=dt(t),jn(r,t,n)}}function qn(e,t,n){null!==e.value?n(t,e.value):Un(e,((e,i)=>{const r=new ct(t.toString()+"/"+e);qn(i,r,n)}))}function Un(e,t){e.children.forEach(((e,n)=>{t(n,e)}))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&j(this.last_,((e,n)=>{t[e]=t[e]-n})),this.last_=e,t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=1e4,Wn=3e4,Hn=3e5;class zn{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new $n(e);const n=Bn+(Wn-Bn)*Math.random();K(this.reportStats_.bind(this),Math.floor(n))}reportStats_(){const e=this.statsListener_.get(),t={};let n=!1;j(e,((e,i)=>{i>0&&(0,o.r3)(this.statsToReport_,e)&&(t[e]=i,n=!0)})),n&&this.server_.reportStats(t),K(this.reportStats_.bind(this),Math.floor(2*Math.random()*Hn))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Vn;function Gn(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Kn(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Yn(e){return{fromUser:!1,fromServer:!0,queryId:e,tagged:!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(e){e[e["OVERWRITE"]=0]="OVERWRITE",e[e["MERGE"]=1]="MERGE",e[e["ACK_USER_WRITE"]=2]="ACK_USER_WRITE",e[e["LISTEN_COMPLETE"]=3]="LISTEN_COMPLETE"})(Vn||(Vn={}));class Jn{constructor(e,t,n){this.path=e,this.affectedTree=t,this.revert=n,this.type=Vn.ACK_USER_WRITE,this.source=Gn()}operationForChild(e){if(yt(this.path)){if(null!=this.affectedTree.value)return(0,o.hu)(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new ct(e));return new Jn(lt(),t,this.revert)}}return(0,o.hu)(ut(this.path)===e,"operationForChild called for unrelated child."),new Jn(dt(this.path),this.affectedTree,this.revert)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Xn{constructor(e,t,n){this.source=e,this.path=t,this.snap=n,this.type=Vn.OVERWRITE}operationForChild(e){return yt(this.path)?new Xn(this.source,lt(),this.snap.getImmediateChild(e)):new Xn(this.source,dt(this.path),this.snap)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn{constructor(e,t,n){this.source=e,this.path=t,this.children=n,this.type=Vn.MERGE}operationForChild(e){if(yt(this.path)){const t=this.children.subtree(new ct(e));return t.isEmpty()?null:t.value?new Xn(this.source,lt(),t.value):new Qn(this.source,lt(),t)}return(0,o.hu)(ut(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Qn(this.source,dt(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(e,t,n){this.node_=e,this.fullyInitialized_=t,this.filtered_=n}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(yt(e))return this.isFullyInitialized()&&!this.filtered_;const t=ut(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function ti(e,t,n,i){const r=[],o=[];return t.forEach((t=>{"child_changed"===t.type&&e.index_.indexedValueChanged(t.oldSnap,t.snapshotNode)&&o.push(Sn(t.childName,t.snapshotNode))})),ni(e,r,"child_removed",t,i,n),ni(e,r,"child_added",t,i,n),ni(e,r,"child_moved",o,i,n),ni(e,r,"child_changed",t,i,n),ni(e,r,"value",t,i,n),r}function ni(e,t,n,i,r,o){const s=i.filter((e=>e.type===n));s.sort(((t,n)=>ri(e,t,n))),s.forEach((n=>{const i=ii(e,n,o);r.forEach((r=>{r.respondsTo(n.type)&&t.push(r.createEvent(i,e.query_))}))}))}function ii(e,t,n){return"value"===t.type||"child_removed"===t.type||(t.prevName=n.getPredecessorChildName(t.childName,t.snapshotNode,e.index_)),t}function ri(e,t,n){if(null==t.childName||null==n.childName)throw(0,o.g5)("Should only compare child_ events.");const i=new Lt(t.childName,t.snapshotNode),r=new Lt(n.childName,n.snapshotNode);return e.index_.compare(i,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oi(e,t){return{eventCache:e,serverCache:t}}function si(e,t,n,i){return oi(new Zn(t,n,i),e.serverCache)}function ai(e,t,n,i){return oi(e.eventCache,new Zn(t,n,i))}function ci(e){return e.eventCache.isFullyInitialized()?e.eventCache.getNode():null}function li(e){return e.serverCache.isFullyInitialized()?e.serverCache.getNode():null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ui;const hi=()=>(ui||(ui=new zt(D)),ui);class di{constructor(e,t=hi()){this.value=e,this.children=t}static fromObject(e){let t=new di(null);return j(e,((e,n)=>{t=t.set(new ct(e),n)})),t}isEmpty(){return null===this.value&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(null!=this.value&&t(this.value))return{path:lt(),value:this.value};if(yt(e))return null;{const n=ut(e),i=this.children.get(n);if(null!==i){const r=i.findRootMostMatchingPathAndValue(dt(e),t);if(null!=r){const e=_t(new ct(n),r.path);return{path:e,value:r.value}}return null}return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,(()=>!0))}subtree(e){if(yt(e))return this;{const t=ut(e),n=this.children.get(t);return null!==n?n.subtree(dt(e)):new di(null)}}set(e,t){if(yt(e))return new di(t,this.children);{const n=ut(e),i=this.children.get(n)||new di(null),r=i.set(dt(e),t),o=this.children.insert(n,r);return new di(this.value,o)}}remove(e){if(yt(e))return this.children.isEmpty()?new di(null):new di(null,this.children);{const t=ut(e),n=this.children.get(t);if(n){const i=n.remove(dt(e));let r;return r=i.isEmpty()?this.children.remove(t):this.children.insert(t,i),null===this.value&&r.isEmpty()?new di(null):new di(this.value,r)}return this}}get(e){if(yt(e))return this.value;{const t=ut(e),n=this.children.get(t);return n?n.get(dt(e)):null}}setTree(e,t){if(yt(e))return t;{const n=ut(e),i=this.children.get(n)||new di(null),r=i.setTree(dt(e),t);let o;return o=r.isEmpty()?this.children.remove(n):this.children.insert(n,r),new di(this.value,o)}}fold(e){return this.fold_(lt(),e)}fold_(e,t){const n={};return this.children.inorderTraversal(((i,r)=>{n[i]=r.fold_(_t(e,i),t)})),t(e,this.value,n)}findOnPath(e,t){return this.findOnPath_(e,lt(),t)}findOnPath_(e,t,n){const i=!!this.value&&n(t,this.value);if(i)return i;if(yt(e))return null;{const i=ut(e),r=this.children.get(i);return r?r.findOnPath_(dt(e),_t(t,i),n):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,lt(),t)}foreachOnPath_(e,t,n){if(yt(e))return this;{this.value&&n(t,this.value);const i=ut(e),r=this.children.get(i);return r?r.foreachOnPath_(dt(e),_t(t,i),n):new di(null)}}foreach(e){this.foreach_(lt(),e)}foreach_(e,t){this.children.inorderTraversal(((n,i)=>{i.foreach_(_t(e,n),t)})),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal(((t,n)=>{n.value&&e(t,n.value)}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fi{constructor(e){this.writeTree_=e}static empty(){return new fi(new di(null))}}function pi(e,t,n){if(yt(t))return new fi(new di(n));{const i=e.writeTree_.findRootMostValueAndPath(t);if(null!=i){const r=i.path;let o=i.value;const s=vt(r,t);return o=o.updateChild(s,n),new fi(e.writeTree_.set(r,o))}{const i=new di(n),r=e.writeTree_.setTree(t,i);return new fi(r)}}}function mi(e,t,n){let i=e;return j(n,((e,n)=>{i=pi(i,_t(t,e),n)})),i}function gi(e,t){if(yt(t))return fi.empty();{const n=e.writeTree_.setTree(t,new di(null));return new fi(n)}}function _i(e,t){return null!=yi(e,t)}function yi(e,t){const n=e.writeTree_.findRootMostValueAndPath(t);return null!=n?e.writeTree_.get(n.path).getChild(vt(n.path,t)):null}function vi(e){const t=[],n=e.writeTree_.value;return null!=n?n.isLeafNode()||n.forEachChild(sn,((e,n)=>{t.push(new Lt(e,n))})):e.writeTree_.children.inorderTraversal(((e,n)=>{null!=n.value&&t.push(new Lt(e,n.value))})),t}function wi(e,t){if(yt(t))return e;{const n=yi(e,t);return new fi(null!=n?new di(n):e.writeTree_.subtree(t))}}function bi(e){return e.writeTree_.isEmpty()}function Ci(e,t){return Ii(lt(),e.writeTree_,t)}function Ii(e,t,n){if(null!=t.value)return n.updateChild(e,t.value);{let i=null;return t.children.inorderTraversal(((t,r)=>{".priority"===t?((0,o.hu)(null!==r.value,"Priority writes must always be leaf nodes"),i=r.value):n=Ii(_t(e,t),r,n)})),n.getChild(e).isEmpty()||null===i||(n=n.updateChild(_t(e,".priority"),i)),n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ei(e,t){return Vi(t,e)}function Ti(e,t,n,i,r){(0,o.hu)(i>e.lastWriteId,"Stacking an older write on top of newer ones"),void 0===r&&(r=!0),e.allWrites.push({path:t,snap:n,writeId:i,visible:r}),r&&(e.visibleWrites=pi(e.visibleWrites,t,n)),e.lastWriteId=i}function ki(e,t){for(let n=0;n<e.allWrites.length;n++){const i=e.allWrites[n];if(i.writeId===t)return i}return null}function Si(e,t){const n=e.allWrites.findIndex((e=>e.writeId===t));(0,o.hu)(n>=0,"removeWrite called with nonexistent writeId.");const i=e.allWrites[n];e.allWrites.splice(n,1);let r=i.visible,s=!1,a=e.allWrites.length-1;while(r&&a>=0){const t=e.allWrites[a];t.visible&&(a>=n&&Ni(t,i.path)?r=!1:bt(i.path,t.path)&&(s=!0)),a--}if(r){if(s)return xi(e),!0;if(i.snap)e.visibleWrites=gi(e.visibleWrites,i.path);else{const t=i.children;j(t,(t=>{e.visibleWrites=gi(e.visibleWrites,_t(i.path,t))}))}return!0}return!1}function Ni(e,t){if(e.snap)return bt(e.path,t);for(const n in e.children)if(e.children.hasOwnProperty(n)&&bt(_t(e.path,n),t))return!0;return!1}function xi(e){e.visibleWrites=Ri(e.allWrites,Pi,lt()),e.allWrites.length>0?e.lastWriteId=e.allWrites[e.allWrites.length-1].writeId:e.lastWriteId=-1}function Pi(e){return e.visible}function Ri(e,t,n){let i=fi.empty();for(let r=0;r<e.length;++r){const s=e[r];if(t(s)){const e=s.path;let t;if(s.snap)bt(n,e)?(t=vt(n,e),i=pi(i,t,s.snap)):bt(e,n)&&(t=vt(e,n),i=pi(i,lt(),s.snap.getChild(t)));else{if(!s.children)throw(0,o.g5)("WriteRecord should have .snap or .children");if(bt(n,e))t=vt(n,e),i=mi(i,t,s.children);else if(bt(e,n))if(t=vt(e,n),yt(t))i=mi(i,lt(),s.children);else{const e=(0,o.DV)(s.children,ut(t));if(e){const n=e.getChild(dt(t));i=pi(i,lt(),n)}}}}}return i}function Oi(e,t,n,i,r){if(i||r){const o=wi(e.visibleWrites,t);if(!r&&bi(o))return n;if(r||null!=n||_i(o,lt())){const o=function(e){return(e.visible||r)&&(!i||!~i.indexOf(e.writeId))&&(bt(e.path,t)||bt(t,e.path))},s=Ri(e.allWrites,o,t),a=n||pn.EMPTY_NODE;return Ci(s,a)}return null}{const i=yi(e.visibleWrites,t);if(null!=i)return i;{const i=wi(e.visibleWrites,t);if(bi(i))return n;if(null!=n||_i(i,lt())){const e=n||pn.EMPTY_NODE;return Ci(i,e)}return null}}}function Ai(e,t,n){let i=pn.EMPTY_NODE;const r=yi(e.visibleWrites,t);if(r)return r.isLeafNode()||r.forEachChild(sn,((e,t)=>{i=i.updateImmediateChild(e,t)})),i;if(n){const r=wi(e.visibleWrites,t);return n.forEachChild(sn,((e,t)=>{const n=Ci(wi(r,new ct(e)),t);i=i.updateImmediateChild(e,n)})),vi(r).forEach((e=>{i=i.updateImmediateChild(e.name,e.node)})),i}{const n=wi(e.visibleWrites,t);return vi(n).forEach((e=>{i=i.updateImmediateChild(e.name,e.node)})),i}}function Di(e,t,n,i,r){(0,o.hu)(i||r,"Either existingEventSnap or existingServerSnap must exist");const s=_t(t,n);if(_i(e.visibleWrites,s))return null;{const t=wi(e.visibleWrites,s);return bi(t)?r.getChild(n):Ci(t,r.getChild(n))}}function Mi(e,t,n,i){const r=_t(t,n),o=yi(e.visibleWrites,r);if(null!=o)return o;if(i.isCompleteForChild(n)){const t=wi(e.visibleWrites,r);return Ci(t,i.getNode().getImmediateChild(n))}return null}function Fi(e,t){return yi(e.visibleWrites,t)}function Li(e,t,n,i,r,o,s){let a;const c=wi(e.visibleWrites,t),l=yi(c,lt());if(null!=l)a=l;else{if(null==n)return[];a=Ci(c,n)}if(a=a.withIndex(s),a.isEmpty()||a.isLeafNode())return[];{const e=[],t=s.getCompare(),n=o?a.getReverseIteratorFrom(i,s):a.getIteratorFrom(i,s);let c=n.getNext();while(c&&e.length<r)0!==t(c,i)&&e.push(c),c=n.getNext();return e}}function ji(){return{visibleWrites:fi.empty(),allWrites:[],lastWriteId:-1}}function qi(e,t,n,i){return Oi(e.writeTree,e.treePath,t,n,i)}function Ui(e,t){return Ai(e.writeTree,e.treePath,t)}function $i(e,t,n,i){return Di(e.writeTree,e.treePath,t,n,i)}function Bi(e,t){return Fi(e.writeTree,_t(e.treePath,t))}function Wi(e,t,n,i,r,o){return Li(e.writeTree,e.treePath,t,n,i,r,o)}function Hi(e,t,n){return Mi(e.writeTree,e.treePath,t,n)}function zi(e,t){return Vi(_t(e.treePath,t),e.writeTree)}function Vi(e,t){return{treePath:e,writeTree:t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,n=e.childName;(0,o.hu)("child_added"===t||"child_changed"===t||"child_removed"===t,"Only child changes supported for tracking"),(0,o.hu)(".priority"!==n,"Only non-priority child changes can be tracked.");const i=this.changeMap.get(n);if(i){const r=i.type;if("child_added"===t&&"child_removed"===r)this.changeMap.set(n,kn(n,e.snapshotNode,i.snapshotNode));else if("child_removed"===t&&"child_added"===r)this.changeMap.delete(n);else if("child_removed"===t&&"child_changed"===r)this.changeMap.set(n,Tn(n,i.oldSnap));else if("child_changed"===t&&"child_added"===r)this.changeMap.set(n,En(n,e.snapshotNode));else{if("child_changed"!==t||"child_changed"!==r)throw(0,o.g5)("Illegal combination of changes: "+e+" occurred after "+i);this.changeMap.set(n,kn(n,e.snapshotNode,i.oldSnap))}}else this.changeMap.set(n,e)}getChanges(){return Array.from(this.changeMap.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{getCompleteChild(e){return null}getChildAfterChild(e,t,n){return null}}const Yi=new Ki;class Ji{constructor(e,t,n=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=n}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const t=null!=this.optCompleteServerCache_?new Zn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Hi(this.writes_,e,t)}}getChildAfterChild(e,t,n){const i=null!=this.optCompleteServerCache_?this.optCompleteServerCache_:li(this.viewCache_),r=Wi(this.writes_,i,t,1,n,e);return 0===r.length?null:r[0]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xi(e){return{filter:e}}function Qi(e,t){(0,o.hu)(t.eventCache.getNode().isIndexed(e.filter.getIndex()),"Event snap not indexed"),(0,o.hu)(t.serverCache.getNode().isIndexed(e.filter.getIndex()),"Server snap not indexed")}function Zi(e,t,n,i,r){const s=new Gi;let a,c;if(n.type===Vn.OVERWRITE){const l=n;l.source.fromUser?a=ir(e,t,l.path,l.snap,i,r,s):((0,o.hu)(l.source.fromServer,"Unknown source."),c=l.source.tagged||t.serverCache.isFiltered()&&!yt(l.path),a=nr(e,t,l.path,l.snap,i,r,c,s))}else if(n.type===Vn.MERGE){const l=n;l.source.fromUser?a=or(e,t,l.path,l.children,i,r,s):((0,o.hu)(l.source.fromServer,"Unknown source."),c=l.source.tagged||t.serverCache.isFiltered(),a=ar(e,t,l.path,l.children,i,r,c,s))}else if(n.type===Vn.ACK_USER_WRITE){const o=n;a=o.revert?ur(e,t,o.path,i,r,s):cr(e,t,o.path,o.affectedTree,i,r,s)}else{if(n.type!==Vn.LISTEN_COMPLETE)throw(0,o.g5)("Unknown operation type: "+n.type);a=lr(e,t,n.path,i,s)}const l=s.getChanges();return er(t,a,l),{viewCache:a,changes:l}}function er(e,t,n){const i=t.eventCache;if(i.isFullyInitialized()){const r=i.getNode().isLeafNode()||i.getNode().isEmpty(),o=ci(e);(n.length>0||!e.eventCache.isFullyInitialized()||r&&!i.getNode().equals(o)||!i.getNode().getPriority().equals(o.getPriority()))&&n.push(In(ci(t)))}}function tr(e,t,n,i,r,s){const a=t.eventCache;if(null!=Bi(i,n))return t;{let c,l;if(yt(n))if((0,o.hu)(t.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),t.serverCache.isFiltered()){const n=li(t),r=n instanceof pn?n:pn.EMPTY_NODE,o=Ui(i,r);c=e.filter.updateFullNode(t.eventCache.getNode(),o,s)}else{const n=qi(i,li(t));c=e.filter.updateFullNode(t.eventCache.getNode(),n,s)}else{const u=ut(n);if(".priority"===u){(0,o.hu)(1===ht(n),"Can't have a priority with additional path components");const r=a.getNode();l=t.serverCache.getNode();const s=$i(i,n,r,l);c=null!=s?e.filter.updatePriority(r,s):a.getNode()}else{const o=dt(n);let h;if(a.isCompleteForChild(u)){l=t.serverCache.getNode();const e=$i(i,n,a.getNode(),l);h=null!=e?a.getNode().getImmediateChild(u).updateChild(o,e):a.getNode().getImmediateChild(u)}else h=Hi(i,u,t.serverCache);c=null!=h?e.filter.updateChild(a.getNode(),u,h,o,r,s):a.getNode()}}return si(t,c,a.isFullyInitialized()||yt(n),e.filter.filtersNodes())}}function nr(e,t,n,i,r,o,s,a){const c=t.serverCache;let l;const u=s?e.filter:e.filter.getIndexedFilter();if(yt(n))l=u.updateFullNode(c.getNode(),i,null);else if(u.filtersNodes()&&!c.isFiltered()){const e=c.getNode().updateChild(n,i);l=u.updateFullNode(c.getNode(),e,null)}else{const e=ut(n);if(!c.isCompleteForPath(n)&&ht(n)>1)return t;const r=dt(n),o=c.getNode().getImmediateChild(e),s=o.updateChild(r,i);l=".priority"===e?u.updatePriority(c.getNode(),s):u.updateChild(c.getNode(),e,s,r,Yi,null)}const h=ai(t,l,c.isFullyInitialized()||yt(n),u.filtersNodes()),d=new Ji(r,h,o);return tr(e,h,n,r,d,a)}function ir(e,t,n,i,r,o,s){const a=t.eventCache;let c,l;const u=new Ji(r,t,o);if(yt(n))l=e.filter.updateFullNode(t.eventCache.getNode(),i,s),c=si(t,l,!0,e.filter.filtersNodes());else{const r=ut(n);if(".priority"===r)l=e.filter.updatePriority(t.eventCache.getNode(),i),c=si(t,l,a.isFullyInitialized(),a.isFiltered());else{const o=dt(n),l=a.getNode().getImmediateChild(r);let h;if(yt(o))h=i;else{const e=u.getCompleteChild(r);h=null!=e?".priority"===ft(o)&&e.getChild(gt(o)).isEmpty()?e:e.updateChild(o,i):pn.EMPTY_NODE}if(l.equals(h))c=t;else{const n=e.filter.updateChild(a.getNode(),r,h,o,u,s);c=si(t,n,a.isFullyInitialized(),e.filter.filtersNodes())}}}return c}function rr(e,t){return e.eventCache.isCompleteForChild(t)}function or(e,t,n,i,r,o,s){let a=t;return i.foreach(((i,c)=>{const l=_t(n,i);rr(t,ut(l))&&(a=ir(e,a,l,c,r,o,s))})),i.foreach(((i,c)=>{const l=_t(n,i);rr(t,ut(l))||(a=ir(e,a,l,c,r,o,s))})),a}function sr(e,t,n){return n.foreach(((e,n)=>{t=t.updateChild(e,n)})),t}function ar(e,t,n,i,r,o,s,a){if(t.serverCache.getNode().isEmpty()&&!t.serverCache.isFullyInitialized())return t;let c,l=t;c=yt(n)?i:new di(null).setTree(n,i);const u=t.serverCache.getNode();return c.children.inorderTraversal(((n,i)=>{if(u.hasChild(n)){const c=t.serverCache.getNode().getImmediateChild(n),u=sr(e,c,i);l=nr(e,l,new ct(n),u,r,o,s,a)}})),c.children.inorderTraversal(((n,i)=>{const c=!t.serverCache.isCompleteForChild(n)&&void 0===i.value;if(!u.hasChild(n)&&!c){const c=t.serverCache.getNode().getImmediateChild(n),u=sr(e,c,i);l=nr(e,l,new ct(n),u,r,o,s,a)}})),l}function cr(e,t,n,i,r,o,s){if(null!=Bi(r,n))return t;const a=t.serverCache.isFiltered(),c=t.serverCache;if(null!=i.value){if(yt(n)&&c.isFullyInitialized()||c.isCompleteForPath(n))return nr(e,t,n,c.getNode().getChild(n),r,o,a,s);if(yt(n)){let i=new di(null);return c.getNode().forEachChild($t,((e,t)=>{i=i.set(new ct(e),t)})),ar(e,t,n,i,r,o,a,s)}return t}{let l=new di(null);return i.foreach(((e,t)=>{const i=_t(n,e);c.isCompleteForPath(i)&&(l=l.set(e,c.getNode().getChild(i)))})),ar(e,t,n,l,r,o,a,s)}}function lr(e,t,n,i,r){const o=t.serverCache,s=ai(t,o.getNode(),o.isFullyInitialized()||yt(n),o.isFiltered());return tr(e,s,n,i,Yi,r)}function ur(e,t,n,i,r,s){let a;if(null!=Bi(i,n))return t;{const c=new Ji(i,t,r),l=t.eventCache.getNode();let u;if(yt(n)||".priority"===ut(n)){let n;if(t.serverCache.isFullyInitialized())n=qi(i,li(t));else{const e=t.serverCache.getNode();(0,o.hu)(e instanceof pn,"serverChildren would be complete if leaf node"),n=Ui(i,e)}n=n,u=e.filter.updateFullNode(l,n,s)}else{const r=ut(n);let o=Hi(i,r,t.serverCache);null==o&&t.serverCache.isCompleteForChild(r)&&(o=l.getImmediateChild(r)),u=null!=o?e.filter.updateChild(l,r,o,dt(n),c,s):t.eventCache.getNode().hasChild(r)?e.filter.updateChild(l,r,pn.EMPTY_NODE,dt(n),c,s):l,u.isEmpty()&&t.serverCache.isFullyInitialized()&&(a=qi(i,li(t)),a.isLeafNode()&&(u=e.filter.updateFullNode(u,a,s)))}return a=t.serverCache.isFullyInitialized()||null!=Bi(i,lt()),si(t,u,a,e.filter.filtersNodes())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const n=this.query_._queryParams,i=new Nn(n.getIndex()),r=On(n);this.processor_=Xi(r);const o=t.serverCache,s=t.eventCache,a=i.updateFullNode(pn.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(pn.EMPTY_NODE,s.getNode(),null),l=new Zn(a,o.isFullyInitialized(),i.filtersNodes()),u=new Zn(c,s.isFullyInitialized(),r.filtersNodes());this.viewCache_=oi(u,l),this.eventGenerator_=new ei(this.query_)}get query(){return this.query_}}function dr(e){return ci(e.viewCache_)}function fr(e,t){const n=li(e.viewCache_);return n&&(e.query._queryParams.loadsAllData()||!yt(t)&&!n.getImmediateChild(ut(t)).isEmpty())?n.getChild(t):null}function pr(e,t,n,i){t.type===Vn.MERGE&&null!==t.source.queryId&&((0,o.hu)(li(e.viewCache_),"We should always have a full cache before handling merges"),(0,o.hu)(ci(e.viewCache_),"Missing event cache, even though we have a server cache"));const r=e.viewCache_,s=Zi(e.processor_,r,t,n,i);return Qi(e.processor_,s.viewCache),(0,o.hu)(s.viewCache.serverCache.isFullyInitialized()||!r.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),e.viewCache_=s.viewCache,mr(e,s.changes,s.viewCache.eventCache.getNode(),null)}function mr(e,t,n,i){const r=i?[i]:e.eventRegistrations_;return ti(e.eventGenerator_,t,n,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gr,_r;class yr{constructor(){this.views=new Map}}function vr(e){(0,o.hu)(!gr,"__referenceConstructor has already been defined"),gr=e}function wr(e,t,n,i){const r=t.source.queryId;if(null!==r){const s=e.views.get(r);return(0,o.hu)(null!=s,"SyncTree gave us an op for an invalid query."),pr(s,t,n,i)}{let r=[];for(const o of e.views.values())r=r.concat(pr(o,t,n,i));return r}}function br(e,t,n,i,r){const o=t._queryIdentifier,s=e.views.get(o);if(!s){let e=qi(n,r?i:null),o=!1;e?o=!0:i instanceof pn?(e=Ui(n,i),o=!1):(e=pn.EMPTY_NODE,o=!1);const s=oi(new Zn(e,o,!1),new Zn(i,r,!1));return new hr(t,s)}return s}function Cr(e,t){let n=null;for(const i of e.views.values())n=n||fr(i,t);return n}function Ir(e){(0,o.hu)(!_r,"__referenceConstructor has already been defined"),_r=e}class Er{constructor(e){this.listenProvider_=e,this.syncPointTree_=new di(null),this.pendingWriteTree_=ji(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Tr(e,t,n,i,r){return Ti(e.pendingWriteTree_,t,n,i,r),r?Ar(e,new Xn(Gn(),t,n)):[]}function kr(e,t,n=!1){const i=ki(e.pendingWriteTree_,t),r=Si(e.pendingWriteTree_,t);if(r){let t=new di(null);return null!=i.snap?t=t.set(lt(),!0):j(i.children,(e=>{t=t.set(new ct(e),!0)})),Ar(e,new Jn(i.path,t,n))}return[]}function Sr(e,t,n){return Ar(e,new Xn(Kn(),t,n))}function Nr(e,t,n){const i=di.fromObject(n);return Ar(e,new Qn(Kn(),t,i))}function xr(e,t,n,i){const r=Fr(e,i);if(null!=r){const i=Lr(r),o=i.path,s=i.queryId,a=vt(o,t),c=new Xn(Yn(s),a,n);return jr(e,o,c)}return[]}function Pr(e,t,n,i){const r=Fr(e,i);if(r){const i=Lr(r),o=i.path,s=i.queryId,a=vt(o,t),c=di.fromObject(n),l=new Qn(Yn(s),a,c);return jr(e,o,l)}return[]}function Rr(e,t,n){const i=!0,r=e.pendingWriteTree_,o=e.syncPointTree_.findOnPath(t,((e,n)=>{const i=vt(e,t),r=Cr(n,i);if(r)return r}));return Oi(r,t,o,n,i)}function Or(e,t){const n=t._path;let i=null;e.syncPointTree_.foreachOnPath(n,((e,t)=>{const r=vt(e,n);i=i||Cr(t,r)}));let r=e.syncPointTree_.get(n);r?i=i||Cr(r,lt()):(r=new yr,e.syncPointTree_=e.syncPointTree_.set(n,r));const o=null!=i,s=o?new Zn(i,!0,!1):null,a=Ei(e.pendingWriteTree_,t._path),c=br(r,t,a,o?s.getNode():pn.EMPTY_NODE,o);return dr(c)}function Ar(e,t){return Dr(t,e.syncPointTree_,null,Ei(e.pendingWriteTree_,lt()))}function Dr(e,t,n,i){if(yt(e.path))return Mr(e,t,n,i);{const r=t.get(lt());null==n&&null!=r&&(n=Cr(r,lt()));let o=[];const s=ut(e.path),a=e.operationForChild(s),c=t.children.get(s);if(c&&a){const e=n?n.getImmediateChild(s):null,t=zi(i,s);o=o.concat(Dr(a,c,e,t))}return r&&(o=o.concat(wr(r,e,i,n))),o}}function Mr(e,t,n,i){const r=t.get(lt());null==n&&null!=r&&(n=Cr(r,lt()));let o=[];return t.children.inorderTraversal(((t,r)=>{const s=n?n.getImmediateChild(t):null,a=zi(i,t),c=e.operationForChild(t);c&&(o=o.concat(Mr(c,r,s,a)))})),r&&(o=o.concat(wr(r,e,i,n))),o}function Fr(e,t){return e.tagToQueryMap.get(t)}function Lr(e){const t=e.indexOf("$");return(0,o.hu)(-1!==t&&t<e.length-1,"Bad queryKey."),{queryId:e.substr(t+1),path:new ct(e.substr(0,t))}}function jr(e,t,n){const i=e.syncPointTree_.get(t);(0,o.hu)(i,"Missing sync point for query tag that we're tracking");const r=Ei(e.pendingWriteTree_,t);return wr(i,n,r,null)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class qr{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new qr(t)}node(){return this.node_}}class Ur{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=_t(this.path_,e);return new Ur(this.syncTree_,t)}node(){return Rr(this.syncTree_,this.path_)}}const $r=function(e){return e=e||{},e["timestamp"]=e["timestamp"]||(new Date).getTime(),e},Br=function(e,t,n){return e&&"object"===typeof e?((0,o.hu)(".sv"in e,"Unexpected leaf node or priority contents"),"string"===typeof e[".sv"]?Wr(e[".sv"],t,n):"object"===typeof e[".sv"]?Hr(e[".sv"],t):void(0,o.hu)(!1,"Unexpected server value: "+JSON.stringify(e,null,2))):e},Wr=function(e,t,n){switch(e){case"timestamp":return n["timestamp"];default:(0,o.hu)(!1,"Unexpected server value: "+e)}},Hr=function(e,t,n){e.hasOwnProperty("increment")||(0,o.hu)(!1,"Unexpected server value: "+JSON.stringify(e,null,2));const i=e["increment"];"number"!==typeof i&&(0,o.hu)(!1,"Unexpected increment value: "+i);const r=t.node();if((0,o.hu)(null!==r&&"undefined"!==typeof r,"Expected ChildrenNode.EMPTY_NODE for nulls"),!r.isLeafNode())return i;const s=r,a=s.getValue();return"number"!==typeof a?i:a+i},zr=function(e,t,n,i){return Gr(t,new Ur(n,e),i)},Vr=function(e,t,n){return Gr(e,new qr(t),n)};function Gr(e,t,n){const i=e.getPriority().val(),r=Br(i,t.getImmediateChild(".priority"),n);let o;if(e.isLeafNode()){const i=e,o=Br(i.getValue(),t,n);return o!==i.getValue()||r!==i.getPriority().val()?new tn(o,yn(r)):e}{const i=e;return o=i,r!==i.getPriority().val()&&(o=o.updatePriority(new tn(r))),i.forEachChild(sn,((e,i)=>{const r=Gr(i,t.getImmediateChild(e),n);r!==i&&(o=o.updateImmediateChild(e,r))})),o}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e="",t=null,n={children:{},childCount:0}){this.name=e,this.parent=t,this.node=n}}function Yr(e,t){let n=t instanceof ct?t:new ct(t),i=e,r=ut(n);while(null!==r){const e=(0,o.DV)(i.node.children,r)||{children:{},childCount:0};i=new Kr(r,i,e),n=dt(n),r=ut(n)}return i}function Jr(e){return e.node.value}function Xr(e,t){e.node.value=t,ro(e)}function Qr(e){return e.node.childCount>0}function Zr(e){return void 0===Jr(e)&&!Qr(e)}function eo(e,t){j(e.node.children,((n,i)=>{t(new Kr(n,e,i))}))}function to(e,t,n,i){n&&!i&&t(e),eo(e,(e=>{to(e,t,!0,i)})),n&&i&&t(e)}function no(e,t,n){let i=n?e:e.parent;while(null!==i){if(t(i))return!0;i=i.parent}return!1}function io(e){return new ct(null===e.parent?e.name:io(e.parent)+"/"+e.name)}function ro(e){null!==e.parent&&oo(e.parent,e.name,e)}function oo(e,t,n){const i=Zr(n),r=(0,o.r3)(e.node.children,t);i&&r?(delete e.node.children[t],e.node.childCount--,ro(e)):i||r||(e.node.children[t]=n.node,e.node.childCount++,ro(e))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const so=/[\[\].#$\/\u0000-\u001F\u007F]/,ao=/[\[\].#$\u0000-\u001F\u007F]/,co=10485760,lo=function(e){return"string"===typeof e&&0!==e.length&&!so.test(e)},uo=function(e){return"string"===typeof e&&0!==e.length&&!ao.test(e)},ho=function(e){return e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),uo(e)},fo=function(e,t,n){const i=n instanceof ct?new Ct(n,e):n;if(void 0===t)throw new Error(e+"contains undefined "+kt(i));if("function"===typeof t)throw new Error(e+"contains a function "+kt(i)+" with contents = "+t.toString());if(x(t))throw new Error(e+"contains "+t.toString()+" "+kt(i));if("string"===typeof t&&t.length>co/3&&(0,o.ug)(t)>co)throw new Error(e+"contains a string greater than "+co+" utf8 bytes "+kt(i)+" ('"+t.substring(0,50)+"...')");if(t&&"object"===typeof t){let n=!1,r=!1;if(j(t,((t,o)=>{if(".value"===t)n=!0;else if(".priority"!==t&&".sv"!==t&&(r=!0,!lo(t)))throw new Error(e+" contains an invalid key ("+t+") "+kt(i)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');It(i,t),fo(e,o,i),Et(i)})),n&&r)throw new Error(e+' contains ".value" child '+kt(i)+" in addition to actual children.")}},po=function(e,t,n,i){if((!i||void 0!==n)&&!uo(n))throw new Error((0,o.gK)(e,t)+'was an invalid path = "'+n+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"')},mo=function(e,t,n,i){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),po(e,t,n,i)},go=function(e,t){const n=t.path.toString();if("string"!==typeof t.repoInfo.host||0===t.repoInfo.host.length||!lo(t.repoInfo.namespace)&&"localhost"!==t.repoInfo.host.split(":")[0]||0!==n.length&&!ho(n))throw new Error((0,o.gK)(e,"url")+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".')};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class _o{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function yo(e,t){let n=null;for(let i=0;i<t.length;i++){const r=t[i],o=r.getPath();null===n||wt(o,n.path)||(e.eventLists_.push(n),n=null),null===n&&(n={events:[],path:o}),n.events.push(r)}n&&e.eventLists_.push(n)}function vo(e,t,n){yo(e,n),bo(e,(e=>wt(e,t)))}function wo(e,t,n){yo(e,n),bo(e,(e=>bt(e,t)||bt(t,e)))}function bo(e,t){e.recursionDepth_++;let n=!0;for(let i=0;i<e.eventLists_.length;i++){const r=e.eventLists_[i];if(r){const o=r.path;t(o)?(Co(e.eventLists_[i]),e.eventLists_[i]=null):n=!1}}n&&(e.eventLists_=[]),e.recursionDepth_--}function Co(e){for(let t=0;t<e.events.length;t++){const n=e.events[t];if(null!==n){e.events[t]=null;const i=n.getEventRunner();w&&I("event: "+n.toString()),V(i)}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Io="repo_interrupt",Eo=25;class To{constructor(e,t,n,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=n,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new _o,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Ln(),this.transactionQueueTree_=new Kr,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function ko(e,t,n){if(e.stats_=me(e.repoInfo_),e.forceRestClient_||G())e.server_=new Mn(e.repoInfo_,((t,n,i,r)=>{xo(e,t,n,i,r)}),e.authTokenProvider_,e.appCheckProvider_),setTimeout((()=>Po(e,!0)),0);else{if("undefined"!==typeof n&&null!==n){if("object"!==typeof n)throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{(0,o.Pz)(n)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}e.persistentConnection_=new Ft(e.repoInfo_,t,((t,n,i,r)=>{xo(e,t,n,i,r)}),(t=>{Po(e,t)}),(t=>{Ro(e,t)}),e.authTokenProvider_,e.appCheckProvider_,n),e.server_=e.persistentConnection_}e.authTokenProvider_.addTokenChangeListener((t=>{e.server_.refreshAuthToken(t)})),e.appCheckProvider_.addTokenChangeListener((t=>{e.server_.refreshAppCheckToken(t.token)})),e.statsReporter_=ge(e.repoInfo_,(()=>new zn(e.stats_,e.server_))),e.infoData_=new Fn,e.infoSyncTree_=new Er({startListening:(t,n,i,r)=>{let o=[];const s=e.infoData_.getNode(t._path);return s.isEmpty()||(o=Sr(e.infoSyncTree_,t._path,s),setTimeout((()=>{r("ok")}),0)),o},stopListening:()=>{}}),Oo(e,"connected",!1),e.serverSyncTree_=new Er({startListening:(t,n,i,r)=>(e.server_.listen(t,i,n,((n,i)=>{const o=r(n,i);wo(e.eventQueue_,t._path,o)})),[]),stopListening:(t,n)=>{e.server_.unlisten(t,n)}})}function So(e){const t=e.infoData_.getNode(new ct(".info/serverTimeOffset")),n=t.val()||0;return(new Date).getTime()+n}function No(e){return $r({timestamp:So(e)})}function xo(e,t,n,i,r){e.dataUpdateCount++;const s=new ct(t);n=e.interceptServerDataCallback_?e.interceptServerDataCallback_(t,n):n;let a=[];if(r)if(i){const t=(0,o.UI)(n,(e=>yn(e)));a=Pr(e.serverSyncTree_,s,t,r)}else{const t=yn(n);a=xr(e.serverSyncTree_,s,t,r)}else if(i){const t=(0,o.UI)(n,(e=>yn(e)));a=Nr(e.serverSyncTree_,s,t)}else{const t=yn(n);a=Sr(e.serverSyncTree_,s,t)}let c=s;a.length>0&&(c=$o(e,s)),wo(e.eventQueue_,c,a)}function Po(e,t){Oo(e,"connected",t),!1===t&&Mo(e)}function Ro(e,t){j(t,((t,n)=>{Oo(e,t,n)}))}function Oo(e,t,n){const i=new ct("/.info/"+t),r=yn(n);e.infoData_.updateSnapshot(i,r);const o=Sr(e.infoSyncTree_,i,r);wo(e.eventQueue_,i,o)}function Ao(e){return e.nextWriteId_++}function Do(e,t){const n=Or(e.serverSyncTree_,t);return null!=n?Promise.resolve(n):e.server_.get(t).then((n=>{const i=yn(n).withIndex(t._queryParams.getIndex()),r=Sr(e.serverSyncTree_,t._path,i);return vo(e.eventQueue_,t._path,r),Promise.resolve(i)}),(n=>(Lo(e,"get for query "+(0,o.Pz)(t)+" failed: "+n),Promise.reject(new Error(n)))))}function Mo(e){Lo(e,"onDisconnectEvents");const t=No(e),n=Ln();qn(e.onDisconnect_,lt(),((i,r)=>{const o=zr(i,r,e.serverSyncTree_,t);jn(n,i,o)}));let i=[];qn(n,lt(),((t,n)=>{i=i.concat(Sr(e.serverSyncTree_,t,n));const r=Go(e,t);$o(e,r)})),e.onDisconnect_=Ln(),wo(e.eventQueue_,lt(),i)}function Fo(e){e.persistentConnection_&&e.persistentConnection_.interrupt(Io)}function Lo(e,...t){let n="";e.persistentConnection_&&(n=e.persistentConnection_.id+":"),I(n,...t)}function jo(e,t,n){return Rr(e.serverSyncTree_,t,n)||pn.EMPTY_NODE}function qo(e,t=e.transactionQueueTree_){if(t||Vo(e,t),Jr(t)){const n=Ho(e,t);(0,o.hu)(n.length>0,"Sending zero length transaction queue");const i=n.every((e=>0===e.status));i&&Uo(e,io(t),n)}else Qr(t)&&eo(t,(t=>{qo(e,t)}))}function Uo(e,t,n){const i=n.map((e=>e.currentWriteId)),r=jo(e,t,i);let s=r;const a=r.hash();for(let u=0;u<n.length;u++){const e=n[u];(0,o.hu)(0===e.status,"tryToSendTransactionQueue_: items in queue should all be run."),e.status=1,e.retryCount++;const i=vt(t,e.path);s=s.updateChild(i,e.currentOutputSnapshotRaw)}const c=s.val(!0),l=t;e.server_.put(l.toString(),c,(i=>{Lo(e,"transaction put response",{path:l.toString(),status:i});let r=[];if("ok"===i){const i=[];for(let t=0;t<n.length;t++)n[t].status=2,r=r.concat(kr(e.serverSyncTree_,n[t].currentWriteId)),n[t].onComplete&&i.push((()=>n[t].onComplete(null,!0,n[t].currentOutputSnapshotResolved))),n[t].unwatcher();Vo(e,Yr(e.transactionQueueTree_,t)),qo(e,e.transactionQueueTree_),wo(e.eventQueue_,t,r);for(let e=0;e<i.length;e++)V(i[e])}else{if("datastale"===i)for(let e=0;e<n.length;e++)3===n[e].status?n[e].status=4:n[e].status=0;else{S("transaction at "+l.toString()+" failed: "+i);for(let e=0;e<n.length;e++)n[e].status=4,n[e].abortReason=i}$o(e,t)}}),a)}function $o(e,t){const n=Wo(e,t),i=io(n),r=Ho(e,n);return Bo(e,r,i),i}function Bo(e,t,n){if(0===t.length)return;const i=[];let r=[];const s=t.filter((e=>0===e.status)),a=s.map((e=>e.currentWriteId));for(let c=0;c<t.length;c++){const s=t[c],l=vt(n,s.path);let u,h=!1;if((0,o.hu)(null!==l,"rerunTransactionsUnderNode_: relativePath should not be null."),4===s.status)h=!0,u=s.abortReason,r=r.concat(kr(e.serverSyncTree_,s.currentWriteId,!0));else if(0===s.status)if(s.retryCount>=Eo)h=!0,u="maxretry",r=r.concat(kr(e.serverSyncTree_,s.currentWriteId,!0));else{const n=jo(e,s.path,a);s.currentInputSnapshot=n;const i=t[c].update(n.val());if(void 0!==i){fo("transaction failed: Data returned ",i,s.path);let t=yn(i);const c="object"===typeof i&&null!=i&&(0,o.r3)(i,".priority");c||(t=t.updatePriority(n.getPriority()));const l=s.currentWriteId,u=No(e),h=Vr(t,n,u);s.currentOutputSnapshotRaw=t,s.currentOutputSnapshotResolved=h,s.currentWriteId=Ao(e),a.splice(a.indexOf(l),1),r=r.concat(Tr(e.serverSyncTree_,s.path,h,s.currentWriteId,s.applyLocally)),r=r.concat(kr(e.serverSyncTree_,l,!0))}else h=!0,u="nodata",r=r.concat(kr(e.serverSyncTree_,s.currentWriteId,!0))}wo(e.eventQueue_,n,r),r=[],h&&(t[c].status=2,function(e){setTimeout(e,Math.floor(0))}(t[c].unwatcher),t[c].onComplete&&("nodata"===u?i.push((()=>t[c].onComplete(null,!1,t[c].currentInputSnapshot))):i.push((()=>t[c].onComplete(new Error(u),!1,null)))))}Vo(e,e.transactionQueueTree_);for(let o=0;o<i.length;o++)V(i[o]);qo(e,e.transactionQueueTree_)}function Wo(e,t){let n,i=e.transactionQueueTree_;n=ut(t);while(null!==n&&void 0===Jr(i))i=Yr(i,n),t=dt(t),n=ut(t);return i}function Ho(e,t){const n=[];return zo(e,t,n),n.sort(((e,t)=>e.order-t.order)),n}function zo(e,t,n){const i=Jr(t);if(i)for(let r=0;r<i.length;r++)n.push(i[r]);eo(t,(t=>{zo(e,t,n)}))}function Vo(e,t){const n=Jr(t);if(n){let e=0;for(let t=0;t<n.length;t++)2!==n[t].status&&(n[e]=n[t],e++);n.length=e,Xr(t,n.length>0?n:void 0)}eo(t,(t=>{Vo(e,t)}))}function Go(e,t){const n=io(Wo(e,t)),i=Yr(e.transactionQueueTree_,t);return no(i,(t=>{Ko(e,t)})),Ko(e,i),to(i,(t=>{Ko(e,t)})),n}function Ko(e,t){const n=Jr(t);if(n){const i=[];let r=[],s=-1;for(let t=0;t<n.length;t++)3===n[t].status||(1===n[t].status?((0,o.hu)(s===t-1,"All SENT items should be at beginning of queue."),s=t,n[t].status=3,n[t].abortReason="set"):((0,o.hu)(0===n[t].status,"Unexpected transaction status in abort"),n[t].unwatcher(),r=r.concat(kr(e.serverSyncTree_,n[t].currentWriteId,!0)),n[t].onComplete&&i.push(n[t].onComplete.bind(null,new Error("set"),!1,null))));-1===s?Xr(t,void 0):n.length=s+1,wo(e.eventQueue_,io(t),r);for(let e=0;e<i.length;e++)V(i[e])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yo(e){let t="";const n=e.split("/");for(let r=0;r<n.length;r++)if(n[r].length>0){let e=n[r];try{e=decodeURIComponent(e.replace(/\+/g," "))}catch(i){}t+="/"+e}return t}function Jo(e){const t={};"?"===e.charAt(0)&&(e=e.substring(1));for(const n of e.split("&")){if(0===n.length)continue;const i=n.split("=");2===i.length?t[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):S(`Invalid query segment '${n}' in query '${e}'`)}return t}const Xo=function(e,t){const n=Qo(e),i=n.namespace;"firebase.com"===n.domain&&k(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),i&&"undefined"!==i||"localhost"===n.domain||k("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||N();const r="ws"===n.scheme||"wss"===n.scheme;return{repoInfo:new le(n.host,n.secure,i,r,t,"",i!==n.subdomain),path:new ct(n.pathString)}},Qo=function(e){let t="",n="",i="",r="",o="",s=!0,a="https",c=443;if("string"===typeof e){let l=e.indexOf("//");l>=0&&(a=e.substring(0,l-1),e=e.substring(l+2));let u=e.indexOf("/");-1===u&&(u=e.length);let h=e.indexOf("?");-1===h&&(h=e.length),t=e.substring(0,Math.min(u,h)),u<h&&(r=Yo(e.substring(u,h)));const d=Jo(e.substring(Math.min(e.length,h)));l=t.indexOf(":"),l>=0?(s="https"===a||"wss"===a,c=parseInt(t.substring(l+1),10)):l=t.length;const f=t.slice(0,l);if("localhost"===f.toLowerCase())n="localhost";else if(f.split(".").length<=2)n=f;else{const e=t.indexOf(".");i=t.substring(0,e).toLowerCase(),n=t.substring(e+1),o=i}"ns"in d&&(o=d["ns"])}return{host:t,port:c,domain:n,subdomain:i,secure:s,scheme:a,pathString:r,namespace:o}};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Zo{constructor(e,t,n,i){this._repo=e,this._path=t,this._queryParams=n,this._orderByCalled=i}get key(){return yt(this._path)?null:ft(this._path)}get ref(){return new es(this._repo,this._path)}get _queryIdentifier(){const e=Dn(this._queryParams),t=F(e);return"{}"===t?"default":t}get _queryObject(){return Dn(this._queryParams)}isEqual(e){if(e=(0,o.m9)(e),!(e instanceof Zo))return!1;const t=this._repo===e._repo,n=wt(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&n&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+pt(this._path)}}class es extends Zo{constructor(e,t){super(e,t,new Rn,!1)}get parent(){const e=gt(this._path);return null===e?null:new es(this._repo,e)}get root(){let e=this;while(null!==e.parent)e=e.parent;return e}}class ts{constructor(e,t,n){this._node=e,this.ref=t,this._index=n}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new ct(e),n=is(this.ref,e);return new ts(this._node.getChild(t),n,sn)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){if(this._node.isLeafNode())return!1;const t=this._node;return!!t.forEachChild(this._index,((t,n)=>e(new ts(n,is(this.ref,t),sn))))}hasChild(e){const t=new ct(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return!this._node.isLeafNode()&&!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function ns(e,t){return e=(0,o.m9)(e),e._checkNotDeleted("ref"),void 0!==t?is(e._root,t):e._root}function is(e,t){return e=(0,o.m9)(e),null===ut(e._path)?mo("child","path",t,!1):po("child","path",t,!1),new es(e._repo,_t(e._path,t))}function rs(e){return e=(0,o.m9)(e),Do(e._repo,e).then((t=>new ts(t,new es(e._repo,e._path),e._queryParams.getIndex())))}vr(es),Ir(es);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const os="FIREBASE_DATABASE_EMULATOR_HOST",ss={};let as=!1;function cs(e,t,n,i,r){let o=i||e.options.databaseURL;void 0===o&&(e.options.projectId||k("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),I("Using default host for project ",e.options.projectId),o=`${e.options.projectId}-default-rtdb.firebaseio.com`);let s,a,c=Xo(o,r),l=c.repoInfo;"undefined"!==typeof process&&(a={NODE_ENV:"production",BASE_URL:"/"}[os]),a?(s=!0,o=`http://${a}?ns=${l.namespace}`,c=Xo(o,r),l=c.repoInfo):s=!c.repoInfo.secure;const u=r&&s?new X(X.OWNER):new J(e.name,e.options,t);go("Invalid Firebase Database URL",c),yt(c.path)||k("Database URL must point to the root of a Firebase Database (not including a child path).");const h=us(l,e,u,new Y(e.name,n));return new hs(h,e)}function ls(e,t){const n=ss[t];n&&n[e.key]===e||k(`Database ${t}(${e.repoInfo_}) has already been deleted.`),Fo(e),delete n[e.key]}function us(e,t,n,i){let r=ss[t.name];r||(r={},ss[t.name]=r);let o=r[e.toURLString()];return o&&k("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),o=new To(e,as,n,i),r[e.toURLString()]=o,o}class hs{constructor(e,t){this._repoInternal=e,this.app=t,this["type"]="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(ko(this._repoInternal,this.app.options.appId,this.app.options["databaseAuthVariableOverride"]),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new es(this._repo,lt())),this._rootInternal}_delete(){return null!==this._rootInternal&&(ls(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){null===this._rootInternal&&k("Cannot call "+e+" on a deleted database.")}}function ds(e=(0,i.Mq)(),t){return(0,i.qX)(e,"database").getImmediate({identifier:t})}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function fs(e){u(i.Jn),(0,i.Xd)(new r.wA("database",((e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return cs(n,i,r,t)}),"PUBLIC").setMultipleInstances(!0)),(0,i.KN)(a,c,e),(0,i.KN)(a,c,"esm2017")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ft.prototype.simpleListen=function(e,t){this.sendRequest("q",{p:e},t)},Ft.prototype.echo=function(e,t){this.sendRequest("echo",{d:e},t)};fs()},678:function(e,t,n){"use strict";n.d(t,{r:function(){return Je}});var i=n(444),r=n(333),o=n(238),s=n(463);n(578);const a="@firebase/performance",c="0.5.8",l=c,u="FB-PERF-TRACE-START",h="FB-PERF-TRACE-STOP",d="FB-PERF-TRACE-MEASURE",f="_wt_",p="_fp",m="_fcp",g="_fid",_="@firebase/performance/config",y="@firebase/performance/configexpire",v="performance",w="Performance",b={["trace started"]:"Trace {$traceName} was started before.",["trace stopped"]:"Trace {$traceName} is not running.",["nonpositive trace startTime"]:"Trace {$traceName} startTime should be positive.",["nonpositive trace duration"]:"Trace {$traceName} duration should be positive.",["no window"]:"Window is not available.",["no app id"]:"App id is not available.",["no project id"]:"Project id is not available.",["no api key"]:"Api key is not available.",["invalid cc log"]:"Attempted to queue invalid cc event",["FB not default"]:"Performance can only start when Firebase app instance is the default one.",["RC response not ok"]:"RC response is not ok",["invalid attribute name"]:"Attribute name {$attributeName} is invalid.",["invalid attribute value"]:"Attribute value {$attributeValue} is invalid.",["invalid custom metric name"]:"Custom metric name {$customMetricName} is invalid",["invalid String merger input"]:"Input for String merger is invalid, contact support team to resolve.",["already initialized"]:"initializePerformance() has already been called with different options. To avoid this error, call initializePerformance() with the same options as when it was originally called, or call getPerformance() to return the already initialized instance."},C=new i.LL(v,w,b),I=new r.Yd(w);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let E,T,k,S;I.logLevel=r["in"].INFO;class N{constructor(e){if(this.window=e,!e)throw C.create("no window");this.performance=e.performance,this.PerformanceObserver=e.PerformanceObserver,this.windowLocation=e.location,this.navigator=e.navigator,this.document=e.document,this.navigator&&this.navigator.cookieEnabled&&(this.localStorage=e.localStorage),e.perfMetrics&&e.perfMetrics.onFirstInputDelay&&(this.onFirstInputDelay=e.perfMetrics.onFirstInputDelay)}getUrl(){return this.windowLocation.href.split("?")[0]}mark(e){this.performance&&this.performance.mark&&this.performance.mark(e)}measure(e,t,n){this.performance&&this.performance.measure&&this.performance.measure(e,t,n)}getEntriesByType(e){return this.performance&&this.performance.getEntriesByType?this.performance.getEntriesByType(e):[]}getEntriesByName(e){return this.performance&&this.performance.getEntriesByName?this.performance.getEntriesByName(e):[]}getTimeOrigin(){return this.performance&&(this.performance.timeOrigin||this.performance.timing.navigationStart)}requiredApisAvailable(){return fetch&&Promise&&(0,i.zI)()?!!(0,i.hl)()||(I.info("IndexedDB is not supported by current browswer"),!1):(I.info("Firebase Performance cannot start if browser does not support fetch and Promise or cookie is disabled."),!1)}setupObserver(e,t){if(!this.PerformanceObserver)return;const n=new this.PerformanceObserver((e=>{for(const n of e.getEntries())t(n)}));n.observe({entryTypes:[e]})}static getInstance(){return void 0===E&&(E=new N(T)),E}}function x(e){T=e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P(e){const t=e.getId();return t.then((e=>{k=e})),t}function R(){return k}function O(e){const t=e.getToken();return t.then((e=>{})),t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A(e,t){const n=e.length-t.length;if(n<0||n>1)throw C.create("invalid String merger input");const i=[];for(let r=0;r<e.length;r++)i.push(e.charAt(r)),t.length>r&&i.push(t.charAt(r));return i.join("")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{constructor(){this.instrumentationEnabled=!0,this.dataCollectionEnabled=!0,this.loggingEnabled=!1,this.tracesSamplingRate=1,this.networkRequestsSamplingRate=1,this.logEndPointUrl="https://firebaselogging.googleapis.com/v0cc/log?format=json_proto",this.flTransportEndpointUrl=A("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),this.transportKey=A("AzSC8r6ReiGqFMyfvgow","Iayx0u-XT3vksVM-pIV"),this.logSource=462,this.logTraceAfterSampling=!1,this.logNetworkAfterSampling=!1,this.configTimeToLive=12}getFlTransportFullUrl(){return this.flTransportEndpointUrl.concat("?key=",this.transportKey)}static getInstance(){return void 0===S&&(S=new D),S}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var M;(function(e){e[e["UNKNOWN"]=0]="UNKNOWN",e[e["VISIBLE"]=1]="VISIBLE",e[e["HIDDEN"]=2]="HIDDEN"})(M||(M={}));const F=["firebase_","google_","ga_"],L=new RegExp("^[a-zA-Z]\\w*$"),j=40,q=100;function U(){const e=N.getInstance().navigator;return"serviceWorker"in e?e.serviceWorker.controller?2:3:1}function $(){const e=N.getInstance().document,t=e.visibilityState;switch(t){case"visible":return M.VISIBLE;case"hidden":return M.HIDDEN;default:return M.UNKNOWN}}function B(){const e=N.getInstance().navigator,t=e.connection,n=t&&t.effectiveType;switch(n){case"slow-2g":return 1;case"2g":return 2;case"3g":return 3;case"4g":return 4;default:return 0}}function W(e){if(0===e.length||e.length>j)return!1;const t=F.some((t=>e.startsWith(t)));return!t&&!!e.match(L)}function H(e){return 0!==e.length&&e.length<=q}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(e){var t;const n=null===(t=e.options)||void 0===t?void 0:t.appId;if(!n)throw C.create("no app id");return n}function V(e){var t;const n=null===(t=e.options)||void 0===t?void 0:t.projectId;if(!n)throw C.create("no project id");return n}function G(e){var t;const n=null===(t=e.options)||void 0===t?void 0:t.apiKey;if(!n)throw C.create("no api key");return n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K="0.0.1",Y={loggingEnabled:!0},J="FIREBASE_INSTALLATIONS_AUTH";function X(e,t){const n=Q();return n?(ne(n),Promise.resolve()):te(e,t).then(ne).then((e=>Z(e)),(()=>{}))}function Q(){const e=N.getInstance().localStorage;if(!e)return;const t=e.getItem(y);if(!t||!ie(t))return;const n=e.getItem(_);if(n)try{const e=JSON.parse(n);return e}catch(i){return}}function Z(e){const t=N.getInstance().localStorage;e&&t&&(t.setItem(_,JSON.stringify(e)),t.setItem(y,String(Date.now()+60*D.getInstance().configTimeToLive*60*1e3)))}const ee="Could not fetch config, will use default configs";function te(e,t){return O(e.installations).then((n=>{const i=V(e.app),r=G(e.app),o=`https://firebaseremoteconfig.googleapis.com/v1/projects/${i}/namespaces/fireperf:fetch?key=${r}`,s=new Request(o,{method:"POST",headers:{Authorization:`${J} ${n}`},body:JSON.stringify({app_instance_id:t,app_instance_id_token:n,app_id:z(e.app),app_version:l,sdk_version:K})});return fetch(s).then((e=>{if(e.ok)return e.json();throw C.create("RC response not ok")}))})).catch((()=>{I.info(ee)}))}function ne(e){if(!e)return e;const t=D.getInstance(),n=e.entries||{};return void 0!==n.fpr_enabled?t.loggingEnabled="true"===String(n.fpr_enabled):t.loggingEnabled=Y.loggingEnabled,n.fpr_log_source&&(t.logSource=Number(n.fpr_log_source)),n.fpr_log_endpoint_url&&(t.logEndPointUrl=n.fpr_log_endpoint_url),n.fpr_log_transport_key&&(t.transportKey=n.fpr_log_transport_key),void 0!==n.fpr_vc_network_request_sampling_rate&&(t.networkRequestsSamplingRate=Number(n.fpr_vc_network_request_sampling_rate)),void 0!==n.fpr_vc_trace_sampling_rate&&(t.tracesSamplingRate=Number(n.fpr_vc_trace_sampling_rate)),t.logTraceAfterSampling=re(t.tracesSamplingRate),t.logNetworkAfterSampling=re(t.networkRequestsSamplingRate),e}function ie(e){return Number(e)>Date.now()}function re(e){return Math.random()<=e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oe,se=1;function ae(e){return se=2,oe=oe||le(e),oe}function ce(){return 3===se}function le(e){return ue().then((()=>P(e.installations))).then((t=>X(e,t))).then((()=>he()),(()=>he()))}function ue(){const e=N.getInstance().document;return new Promise((t=>{if(e&&"complete"!==e.readyState){const n=()=>{"complete"===e.readyState&&(e.removeEventListener("readystatechange",n),t())};e.addEventListener("readystatechange",n)}else t()}))}function he(){se=3}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const de=1e4,fe=5500,pe=3,me=1e3;let ge,_e=pe,ye=[],ve=!1;function we(){ve||(be(fe),ve=!0)}function be(e){setTimeout((()=>{if(0!==_e)return ye.length?void Ce():be(de)}),e)}function Ce(){const e=ye.splice(0,me),t=e.map((e=>({source_extension_json_proto3:e.message,event_time_ms:String(e.eventTime)}))),n={request_time_ms:String(Date.now()),client_info:{client_type:1,js_client_info:{}},log_source:D.getInstance().logSource,log_event:t};Ie(n,e).catch((()=>{ye=[...e,...ye],_e--,I.info(`Tries left: ${_e}.`),be(de)}))}function Ie(e,t){return Ee(e).then((e=>(e.ok||I.info("Call to Firebase backend failed."),e.json()))).then((e=>{const n=Number(e.nextRequestWaitMillis);let i=de;isNaN(n)||(i=Math.max(n,i));const r=e.logResponseDetails;Array.isArray(r)&&r.length>0&&"RETRY_REQUEST_LATER"===r[0].responseAction&&(ye=[...t,...ye],I.info("Retry transport request later.")),_e=pe,be(i)}))}function Ee(e){const t=D.getInstance().getFlTransportFullUrl();return fetch(t,{method:"POST",body:JSON.stringify(e)})}function Te(e){if(!e.eventTime||!e.message)throw C.create("invalid cc log");ye=[...ye,e]}function ke(e){return(...t)=>{const n=e(...t);Te({message:n,eventTime:Date.now()})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(e,t){ge||(ge=ke(Re)),ge(e,t)}function Ne(e){const t=D.getInstance();!t.instrumentationEnabled&&e.isAuto||(t.dataCollectionEnabled||e.isAuto)&&N.getInstance().requiredApisAvailable()&&(e.isAuto&&$()!==M.VISIBLE||(ce()?xe(e):ae(e.performanceController).then((()=>xe(e)),(()=>xe(e)))))}function xe(e){if(!R())return;const t=D.getInstance();t.loggingEnabled&&t.logTraceAfterSampling&&setTimeout((()=>Se(e,1)),0)}function Pe(e){const t=D.getInstance();if(!t.instrumentationEnabled)return;const n=e.url,i=t.logEndPointUrl.split("?")[0],r=t.flTransportEndpointUrl.split("?")[0];n!==i&&n!==r&&t.loggingEnabled&&t.logNetworkAfterSampling&&setTimeout((()=>Se(e,0)),0)}function Re(e,t){return 0===t?Oe(e):Ae(e)}function Oe(e){const t={url:e.url,http_method:e.httpMethod||0,http_response_code:200,response_payload_bytes:e.responsePayloadBytes,client_start_time_us:e.startTimeUs,time_to_response_initiated_us:e.timeToResponseInitiatedUs,time_to_response_completed_us:e.timeToResponseCompletedUs},n={application_info:De(e.performanceController.app),network_request_metric:t};return JSON.stringify(n)}function Ae(e){const t={name:e.name,is_auto:e.isAuto,client_start_time_us:e.startTimeUs,duration_us:e.durationUs};0!==Object.keys(e.counters).length&&(t.counters=e.counters);const n=e.getAttributes();0!==Object.keys(n).length&&(t.custom_attributes=n);const i={application_info:De(e.performanceController.app),trace_metric:t};return JSON.stringify(i)}function De(e){return{google_app_id:z(e),app_instance_id:R(),web_app_info:{sdk_version:l,page_url:N.getInstance().getUrl(),service_worker_status:U(),visibility_state:$(),effective_connection_type:B()},application_process_state:0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me=100,Fe="_",Le=[p,m,g];function je(e,t){return!(0===e.length||e.length>Me)&&(t&&t.startsWith(f)&&Le.indexOf(e)>-1||!e.startsWith(Fe))}function qe(e){const t=Math.floor(e);return t<e&&I.info(`Metric value should be an Integer, setting the value as : ${t}.`),t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e,t,n=!1,i){this.performanceController=e,this.name=t,this.isAuto=n,this.state=1,this.customAttributes={},this.counters={},this.api=N.getInstance(),this.randomId=Math.floor(1e6*Math.random()),this.isAuto||(this.traceStartMark=`${u}-${this.randomId}-${this.name}`,this.traceStopMark=`${h}-${this.randomId}-${this.name}`,this.traceMeasure=i||`${d}-${this.randomId}-${this.name}`,i&&this.calculateTraceMetrics())}start(){if(1!==this.state)throw C.create("trace started",{traceName:this.name});this.api.mark(this.traceStartMark),this.state=2}stop(){if(2!==this.state)throw C.create("trace stopped",{traceName:this.name});this.state=3,this.api.mark(this.traceStopMark),this.api.measure(this.traceMeasure,this.traceStartMark,this.traceStopMark),this.calculateTraceMetrics(),Ne(this)}record(e,t,n){if(e<=0)throw C.create("nonpositive trace startTime",{traceName:this.name});if(t<=0)throw C.create("nonpositive trace duration",{traceName:this.name});if(this.durationUs=Math.floor(1e3*t),this.startTimeUs=Math.floor(1e3*e),n&&n.attributes&&(this.customAttributes=Object.assign({},n.attributes)),n&&n.metrics)for(const i of Object.keys(n.metrics))isNaN(Number(n.metrics[i]))||(this.counters[i]=Math.floor(Number(n.metrics[i])));Ne(this)}incrementMetric(e,t=1){void 0===this.counters[e]?this.putMetric(e,t):this.putMetric(e,this.counters[e]+t)}putMetric(e,t){if(!je(e,this.name))throw C.create("invalid custom metric name",{customMetricName:e});this.counters[e]=qe(null!==t&&void 0!==t?t:0)}getMetric(e){return this.counters[e]||0}putAttribute(e,t){const n=W(e),i=H(t);if(n&&i)this.customAttributes[e]=t;else{if(!n)throw C.create("invalid attribute name",{attributeName:e});if(!i)throw C.create("invalid attribute value",{attributeValue:t})}}getAttribute(e){return this.customAttributes[e]}removeAttribute(e){void 0!==this.customAttributes[e]&&delete this.customAttributes[e]}getAttributes(){return Object.assign({},this.customAttributes)}setStartTime(e){this.startTimeUs=e}setDuration(e){this.durationUs=e}calculateTraceMetrics(){const e=this.api.getEntriesByName(this.traceMeasure),t=e&&e[0];t&&(this.durationUs=Math.floor(1e3*t.duration),this.startTimeUs=Math.floor(1e3*(t.startTime+this.api.getTimeOrigin())))}static createOobTrace(e,t,n,i){const r=N.getInstance().getUrl();if(!r)return;const o=new Ue(e,f+r,!0),s=Math.floor(1e3*N.getInstance().getTimeOrigin());o.setStartTime(s),t&&t[0]&&(o.setDuration(Math.floor(1e3*t[0].duration)),o.putMetric("domInteractive",Math.floor(1e3*t[0].domInteractive)),o.putMetric("domContentLoadedEventEnd",Math.floor(1e3*t[0].domContentLoadedEventEnd)),o.putMetric("loadEventEnd",Math.floor(1e3*t[0].loadEventEnd)));const a="first-paint",c="first-contentful-paint";if(n){const e=n.find((e=>e.name===a));e&&e.startTime&&o.putMetric(p,Math.floor(1e3*e.startTime));const t=n.find((e=>e.name===c));t&&t.startTime&&o.putMetric(m,Math.floor(1e3*t.startTime)),i&&o.putMetric(g,Math.floor(1e3*i))}Ne(o)}static createUserTimingTrace(e,t){const n=new Ue(e,t,!1,t);Ne(n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $e(e,t){const n=t;if(!n||void 0===n.responseStart)return;const i=N.getInstance().getTimeOrigin(),r=Math.floor(1e3*(n.startTime+i)),o=n.responseStart?Math.floor(1e3*(n.responseStart-n.startTime)):void 0,s=Math.floor(1e3*(n.responseEnd-n.startTime)),a=n.name&&n.name.split("?")[0],c={performanceController:e,url:a,responsePayloadBytes:n.transferSize,startTimeUs:r,timeToResponseInitiatedUs:o,timeToResponseCompletedUs:s};Pe(c)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Be=5e3;function We(e){R()&&(setTimeout((()=>ze(e)),0),setTimeout((()=>He(e)),0),setTimeout((()=>Ve(e)),0))}function He(e){const t=N.getInstance(),n=t.getEntriesByType("resource");for(const i of n)$e(e,i);t.setupObserver("resource",(t=>$e(e,t)))}function ze(e){const t=N.getInstance(),n=t.getEntriesByType("navigation"),i=t.getEntriesByType("paint");if(t.onFirstInputDelay){let r=setTimeout((()=>{Ue.createOobTrace(e,n,i),r=void 0}),Be);t.onFirstInputDelay((t=>{r&&(clearTimeout(r),Ue.createOobTrace(e,n,i,t))}))}else Ue.createOobTrace(e,n,i)}function Ve(e){const t=N.getInstance(),n=t.getEntriesByType("measure");for(const i of n)Ge(e,i);t.setupObserver("measure",(t=>Ge(e,t)))}function Ge(e,t){const n=t.name;n.substring(0,d.length)!==d&&Ue.createUserTimingTrace(e,n)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e,t){this.app=e,this.installations=t,this.initialized=!1}_init(e){this.initialized||(void 0!==(null===e||void 0===e?void 0:e.dataCollectionEnabled)&&(this.dataCollectionEnabled=e.dataCollectionEnabled),void 0!==(null===e||void 0===e?void 0:e.instrumentationEnabled)&&(this.instrumentationEnabled=e.instrumentationEnabled),N.getInstance().requiredApisAvailable()?(0,i.eu)().then((e=>{e&&(we(),ae(this).then((()=>We(this)),(()=>We(this))),this.initialized=!0)})).catch((e=>{I.info(`Environment doesn't support IndexedDB: ${e}`)})):I.info('Firebase Performance cannot start if the browser does not support "Fetch" and "Promise", or cookies are disabled.'))}set instrumentationEnabled(e){D.getInstance().instrumentationEnabled=e}get instrumentationEnabled(){return D.getInstance().instrumentationEnabled}set dataCollectionEnabled(e){D.getInstance().dataCollectionEnabled=e}get dataCollectionEnabled(){return D.getInstance().dataCollectionEnabled}}const Ye="[DEFAULT]";function Je(e=(0,o.Mq)()){e=(0,i.m9)(e);const t=(0,o.qX)(e,"performance"),n=t.getImmediate();return n}const Xe=(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();if(n.name!==Ye)throw C.create("FB not default");if("undefined"===typeof window)throw C.create("no window");x(window);const r=new Ke(n,i);return r._init(t),r};function Qe(){(0,o.Xd)(new s.wA("performance",Xe,"PUBLIC")),(0,o.KN)(a,c),(0,o.KN)(a,c,"esm2017")}Qe()},205:function(e,t,n){"use strict";n.d(t,{z:function(){return o}});var i,r=function(){return Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))};function o(e,t){void 0===t&&(t={});var n=t.registrationOptions;void 0===n&&(n={}),delete t.registrationOptions;var o=function(e){var n=[],i=arguments.length-1;while(i-- >0)n[i]=arguments[i+1];t&&t[e]&&t[e].apply(t,n)};"serviceWorker"in navigator&&i.then((function(){r()?(c(e,o,n),navigator.serviceWorker.ready.then((function(e){o("ready",e)})).catch((function(e){return s(o,e)}))):(a(e,o,n),navigator.serviceWorker.ready.then((function(e){o("ready",e)})).catch((function(e){return s(o,e)})))}))}function s(e,t){navigator.onLine||e("offline"),e("error",t)}function a(e,t,n){navigator.serviceWorker.register(e,n).then((function(e){t("registered",e),e.waiting?t("updated",e):e.onupdatefound=function(){t("updatefound",e);var n=e.installing;n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?t("updated",e):t("cached",e))}}})).catch((function(e){return s(t,e)}))}function c(e,t,n){fetch(e).then((function(i){404===i.status?(t("error",new Error("Service worker not found at "+e)),l()):-1===i.headers.get("content-type").indexOf("javascript")?(t("error",new Error("Expected "+e+" to have javascript content-type, but received "+i.headers.get("content-type"))),l()):a(e,t,n)})).catch((function(e){return s(t,e)}))}function l(){"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){return s(emit,e)}))}"undefined"!==typeof window&&(i="undefined"!==typeof Promise?new Promise((function(e){return window.addEventListener("load",e)})):{then:function(e){return window.addEventListener("load",e)}})},744:function(e,t){"use strict";t.Z=(e,t)=>{const n=e.__vccOpts||e;for(const[i,r]of t)n[i]=r;return n}},119:function(e,t,n){"use strict";n.d(t,{PO:function(){return z},p7:function(){return tt}});var i=n(252),r=n(262);
/*!
  * vue-router v4.0.14
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const o="function"===typeof Symbol&&"symbol"===typeof Symbol.toStringTag,s=e=>o?Symbol(e):"_vr_"+e,a=s("rvlm"),c=s("rvd"),l=s("r"),u=s("rl"),h=s("rvl"),d="undefined"!==typeof window;function f(e){return e.__esModule||o&&"Module"===e[Symbol.toStringTag]}const p=Object.assign;function m(e,t){const n={};for(const i in t){const r=t[i];n[i]=Array.isArray(r)?r.map(e):e(r)}return n}const g=()=>{};const _=/\/$/,y=e=>e.replace(_,"");function v(e,t,n="/"){let i,r={},o="",s="";const a=t.indexOf("?"),c=t.indexOf("#",a>-1?a:0);return a>-1&&(i=t.slice(0,a),o=t.slice(a+1,c>-1?c:t.length),r=e(o)),c>-1&&(i=i||t.slice(0,c),s=t.slice(c,t.length)),i=S(null!=i?i:t,n),{fullPath:i+(o&&"?")+o+s,path:i,query:r,hash:s}}function w(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function b(e,t){return t&&e.toLowerCase().startsWith(t.toLowerCase())?e.slice(t.length)||"/":e}function C(e,t,n){const i=t.matched.length-1,r=n.matched.length-1;return i>-1&&i===r&&I(t.matched[i],n.matched[r])&&E(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function I(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function E(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!T(e[n],t[n]))return!1;return!0}function T(e,t){return Array.isArray(e)?k(e,t):Array.isArray(t)?k(t,e):e===t}function k(e,t){return Array.isArray(t)?e.length===t.length&&e.every(((e,n)=>e===t[n])):1===e.length&&e[0]===t}function S(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),i=e.split("/");let r,o,s=n.length-1;for(r=0;r<i.length;r++)if(o=i[r],1!==s&&"."!==o){if(".."!==o)break;s--}return n.slice(0,s).join("/")+"/"+i.slice(r-(r===i.length?1:0)).join("/")}var N,x;(function(e){e["pop"]="pop",e["push"]="push"})(N||(N={})),function(e){e["back"]="back",e["forward"]="forward",e["unknown"]=""}(x||(x={}));function P(e){if(!e)if(d){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return"/"!==e[0]&&"#"!==e[0]&&(e="/"+e),y(e)}const R=/^[^#]+#/;function O(e,t){return e.replace(R,"#")+t}function A(e,t){const n=document.documentElement.getBoundingClientRect(),i=e.getBoundingClientRect();return{behavior:t.behavior,left:i.left-n.left-(t.left||0),top:i.top-n.top-(t.top||0)}}const D=()=>({left:window.pageXOffset,top:window.pageYOffset});function M(e){let t;if("el"in e){const n=e.el,i="string"===typeof n&&n.startsWith("#");0;const r="string"===typeof n?i?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!r)return;t=A(r,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(null!=t.left?t.left:window.pageXOffset,null!=t.top?t.top:window.pageYOffset)}function F(e,t){const n=history.state?history.state.position-t:-1;return n+e}const L=new Map;function j(e,t){L.set(e,t)}function q(e){const t=L.get(e);return L.delete(e),t}let U=()=>location.protocol+"//"+location.host;function $(e,t){const{pathname:n,search:i,hash:r}=t,o=e.indexOf("#");if(o>-1){let t=r.includes(e.slice(o))?e.slice(o).length:1,n=r.slice(t);return"/"!==n[0]&&(n="/"+n),b(n,"")}const s=b(n,e);return s+i+r}function B(e,t,n,i){let r=[],o=[],s=null;const a=({state:o})=>{const a=$(e,location),c=n.value,l=t.value;let u=0;if(o){if(n.value=a,t.value=o,s&&s===c)return void(s=null);u=l?o.position-l.position:0}else i(a);r.forEach((e=>{e(n.value,c,{delta:u,type:N.pop,direction:u?u>0?x.forward:x.back:x.unknown})}))};function c(){s=n.value}function l(e){r.push(e);const t=()=>{const t=r.indexOf(e);t>-1&&r.splice(t,1)};return o.push(t),t}function u(){const{history:e}=window;e.state&&e.replaceState(p({},e.state,{scroll:D()}),"")}function h(){for(const e of o)e();o=[],window.removeEventListener("popstate",a),window.removeEventListener("beforeunload",u)}return window.addEventListener("popstate",a),window.addEventListener("beforeunload",u),{pauseListeners:c,listen:l,destroy:h}}function W(e,t,n,i=!1,r=!1){return{back:e,current:t,forward:n,replaced:i,position:window.history.length,scroll:r?D():null}}function H(e){const{history:t,location:n}=window,i={value:$(e,n)},r={value:t.state};function o(i,o,s){const a=e.indexOf("#"),c=a>-1?(n.host&&document.querySelector("base")?e:e.slice(a))+i:U()+e+i;try{t[s?"replaceState":"pushState"](o,"",c),r.value=o}catch(l){console.error(l),n[s?"replace":"assign"](c)}}function s(e,n){const s=p({},t.state,W(r.value.back,e,r.value.forward,!0),n,{position:r.value.position});o(e,s,!0),i.value=e}function a(e,n){const s=p({},r.value,t.state,{forward:e,scroll:D()});o(s.current,s,!0);const a=p({},W(i.value,e,null),{position:s.position+1},n);o(e,a,!1),i.value=e}return r.value||o(i.value,{back:null,current:i.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0),{location:i,state:r,push:a,replace:s}}function z(e){e=P(e);const t=H(e),n=B(e,t.state,t.location,t.replace);function i(e,t=!0){t||n.pauseListeners(),history.go(e)}const r=p({location:"",base:e,go:i,createHref:O.bind(null,e)},t,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>t.state.value}),r}function V(e){return"string"===typeof e||e&&"object"===typeof e}function G(e){return"string"===typeof e||"symbol"===typeof e}const K={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},Y=s("nf");var J;(function(e){e[e["aborted"]=4]="aborted",e[e["cancelled"]=8]="cancelled",e[e["duplicated"]=16]="duplicated"})(J||(J={}));function X(e,t){return p(new Error,{type:e,[Y]:!0},t)}function Q(e,t){return e instanceof Error&&Y in e&&(null==t||!!(e.type&t))}const Z="[^/]+?",ee={sensitive:!1,strict:!1,start:!0,end:!0},te=/[.+*?^${}()[\]/\\]/g;function ne(e,t){const n=p({},ee,t),i=[];let r=n.start?"^":"";const o=[];for(const u of e){const e=u.length?[]:[90];n.strict&&!u.length&&(r+="/");for(let t=0;t<u.length;t++){const i=u[t];let s=40+(n.sensitive?.25:0);if(0===i.type)t||(r+="/"),r+=i.value.replace(te,"\\$&"),s+=40;else if(1===i.type){const{value:e,repeatable:n,optional:a,regexp:c}=i;o.push({name:e,repeatable:n,optional:a});const h=c||Z;if(h!==Z){s+=10;try{new RegExp(`(${h})`)}catch(l){throw new Error(`Invalid custom RegExp for param "${e}" (${h}): `+l.message)}}let d=n?`((?:${h})(?:/(?:${h}))*)`:`(${h})`;t||(d=a&&u.length<2?`(?:/${d})`:"/"+d),a&&(d+="?"),r+=d,s+=20,a&&(s+=-8),n&&(s+=-20),".*"===h&&(s+=-50)}e.push(s)}i.push(e)}if(n.strict&&n.end){const e=i.length-1;i[e][i[e].length-1]+=.7000000000000001}n.strict||(r+="/?"),n.end?r+="$":n.strict&&(r+="(?:/|$)");const s=new RegExp(r,n.sensitive?"":"i");function a(e){const t=e.match(s),n={};if(!t)return null;for(let i=1;i<t.length;i++){const e=t[i]||"",r=o[i-1];n[r.name]=e&&r.repeatable?e.split("/"):e}return n}function c(t){let n="",i=!1;for(const r of e){i&&n.endsWith("/")||(n+="/"),i=!1;for(const e of r)if(0===e.type)n+=e.value;else if(1===e.type){const{value:o,repeatable:s,optional:a}=e,c=o in t?t[o]:"";if(Array.isArray(c)&&!s)throw new Error(`Provided param "${o}" is an array but it is not repeatable (* or + modifiers)`);const l=Array.isArray(c)?c.join("/"):c;if(!l){if(!a)throw new Error(`Missing required param "${o}"`);r.length<2&&(n.endsWith("/")?n=n.slice(0,-1):i=!0)}n+=l}}return n}return{re:s,score:i,keys:o,parse:a,stringify:c}}function ie(e,t){let n=0;while(n<e.length&&n<t.length){const i=t[n]-e[n];if(i)return i;n++}return e.length<t.length?1===e.length&&80===e[0]?-1:1:e.length>t.length?1===t.length&&80===t[0]?1:-1:0}function re(e,t){let n=0;const i=e.score,r=t.score;while(n<i.length&&n<r.length){const e=ie(i[n],r[n]);if(e)return e;n++}return r.length-i.length}const oe={type:0,value:""},se=/[a-zA-Z0-9_]/;function ae(e){if(!e)return[[]];if("/"===e)return[[oe]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(e){throw new Error(`ERR (${n})/"${l}": ${e}`)}let n=0,i=n;const r=[];let o;function s(){o&&r.push(o),o=[]}let a,c=0,l="",u="";function h(){l&&(0===n?o.push({type:0,value:l}):1===n||2===n||3===n?(o.length>1&&("*"===a||"+"===a)&&t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`),o.push({type:1,value:l,regexp:u,repeatable:"*"===a||"+"===a,optional:"*"===a||"?"===a})):t("Invalid state to consume buffer"),l="")}function d(){l+=a}while(c<e.length)if(a=e[c++],"\\"!==a||2===n)switch(n){case 0:"/"===a?(l&&h(),s()):":"===a?(h(),n=1):d();break;case 4:d(),n=i;break;case 1:"("===a?n=2:se.test(a)?d():(h(),n=0,"*"!==a&&"?"!==a&&"+"!==a&&c--);break;case 2:")"===a?"\\"==u[u.length-1]?u=u.slice(0,-1)+a:n=3:u+=a;break;case 3:h(),n=0,"*"!==a&&"?"!==a&&"+"!==a&&c--,u="";break;default:t("Unknown state");break}else i=n,n=4;return 2===n&&t(`Unfinished custom RegExp for param "${l}"`),h(),s(),r}function ce(e,t,n){const i=ne(ae(e.path),n);const r=p(i,{record:e,parent:t,children:[],alias:[]});return t&&!r.record.aliasOf===!t.record.aliasOf&&t.children.push(r),r}function le(e,t){const n=[],i=new Map;function r(e){return i.get(e)}function o(e,n,i){const r=!i,a=he(e);a.aliasOf=i&&i.record;const l=me(t,e),u=[a];if("alias"in e){const t="string"===typeof e.alias?[e.alias]:e.alias;for(const e of t)u.push(p({},a,{components:i?i.record.components:a.components,path:e,aliasOf:i?i.record:a}))}let h,d;for(const t of u){const{path:u}=t;if(n&&"/"!==u[0]){const e=n.record.path,i="/"===e[e.length-1]?"":"/";t.path=n.record.path+(u&&i+u)}if(h=ce(t,n,l),i?i.alias.push(h):(d=d||h,d!==h&&d.alias.push(h),r&&e.name&&!fe(h)&&s(e.name)),"children"in a){const e=a.children;for(let t=0;t<e.length;t++)o(e[t],h,i&&i.children[t])}i=i||h,c(h)}return d?()=>{s(d)}:g}function s(e){if(G(e)){const t=i.get(e);t&&(i.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(s),t.alias.forEach(s))}else{const t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&i.delete(e.record.name),e.children.forEach(s),e.alias.forEach(s))}}function a(){return n}function c(e){let t=0;while(t<n.length&&re(e,n[t])>=0&&(e.record.path!==n[t].record.path||!ge(e,n[t])))t++;n.splice(t,0,e),e.record.name&&!fe(e)&&i.set(e.record.name,e)}function l(e,t){let r,o,s,a={};if("name"in e&&e.name){if(r=i.get(e.name),!r)throw X(1,{location:e});s=r.record.name,a=p(ue(t.params,r.keys.filter((e=>!e.optional)).map((e=>e.name))),e.params),o=r.stringify(a)}else if("path"in e)o=e.path,r=n.find((e=>e.re.test(o))),r&&(a=r.parse(o),s=r.record.name);else{if(r=t.name?i.get(t.name):n.find((e=>e.re.test(t.path))),!r)throw X(1,{location:e,currentLocation:t});s=r.record.name,a=p({},t.params,e.params),o=r.stringify(a)}const c=[];let l=r;while(l)c.unshift(l.record),l=l.parent;return{name:s,path:o,params:a,matched:c,meta:pe(c)}}return t=me({strict:!1,end:!0,sensitive:!1},t),e.forEach((e=>o(e))),{addRoute:o,resolve:l,removeRoute:s,getRoutes:a,getRecordMatcher:r}}function ue(e,t){const n={};for(const i of t)i in e&&(n[i]=e[i]);return n}function he(e){return{path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:void 0,beforeEnter:e.beforeEnter,props:de(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||{}:{default:e.component}}}function de(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const i in e.components)t[i]="boolean"===typeof n?n:n[i];return t}function fe(e){while(e){if(e.record.aliasOf)return!0;e=e.parent}return!1}function pe(e){return e.reduce(((e,t)=>p(e,t.meta)),{})}function me(e,t){const n={};for(const i in e)n[i]=i in t?t[i]:e[i];return n}function ge(e,t){return t.children.some((t=>t===e||ge(e,t)))}const _e=/#/g,ye=/&/g,ve=/\//g,we=/=/g,be=/\?/g,Ce=/\+/g,Ie=/%5B/g,Ee=/%5D/g,Te=/%5E/g,ke=/%60/g,Se=/%7B/g,Ne=/%7C/g,xe=/%7D/g,Pe=/%20/g;function Re(e){return encodeURI(""+e).replace(Ne,"|").replace(Ie,"[").replace(Ee,"]")}function Oe(e){return Re(e).replace(Se,"{").replace(xe,"}").replace(Te,"^")}function Ae(e){return Re(e).replace(Ce,"%2B").replace(Pe,"+").replace(_e,"%23").replace(ye,"%26").replace(ke,"`").replace(Se,"{").replace(xe,"}").replace(Te,"^")}function De(e){return Ae(e).replace(we,"%3D")}function Me(e){return Re(e).replace(_e,"%23").replace(be,"%3F")}function Fe(e){return null==e?"":Me(e).replace(ve,"%2F")}function Le(e){try{return decodeURIComponent(""+e)}catch(t){}return""+e}function je(e){const t={};if(""===e||"?"===e)return t;const n="?"===e[0],i=(n?e.slice(1):e).split("&");for(let r=0;r<i.length;++r){const e=i[r].replace(Ce," "),n=e.indexOf("="),o=Le(n<0?e:e.slice(0,n)),s=n<0?null:Le(e.slice(n+1));if(o in t){let e=t[o];Array.isArray(e)||(e=t[o]=[e]),e.push(s)}else t[o]=s}return t}function qe(e){let t="";for(let n in e){const i=e[n];if(n=De(n),null==i){void 0!==i&&(t+=(t.length?"&":"")+n);continue}const r=Array.isArray(i)?i.map((e=>e&&Ae(e))):[i&&Ae(i)];r.forEach((e=>{void 0!==e&&(t+=(t.length?"&":"")+n,null!=e&&(t+="="+e))}))}return t}function Ue(e){const t={};for(const n in e){const i=e[n];void 0!==i&&(t[n]=Array.isArray(i)?i.map((e=>null==e?null:""+e)):null==i?i:""+i)}return t}function $e(){let e=[];function t(t){return e.push(t),()=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)}}function n(){e=[]}return{add:t,list:()=>e,reset:n}}function Be(e,t,n,i,r){const o=i&&(i.enterCallbacks[r]=i.enterCallbacks[r]||[]);return()=>new Promise(((s,a)=>{const c=e=>{!1===e?a(X(4,{from:n,to:t})):e instanceof Error?a(e):V(e)?a(X(2,{from:t,to:e})):(o&&i.enterCallbacks[r]===o&&"function"===typeof e&&o.push(e),s())},l=e.call(i&&i.instances[r],t,n,c);let u=Promise.resolve(l);e.length<3&&(u=u.then(c)),u.catch((e=>a(e)))}))}function We(e,t,n,i){const r=[];for(const o of e)for(const e in o.components){let s=o.components[e];if("beforeRouteEnter"===t||o.instances[e])if(He(s)){const a=s.__vccOpts||s,c=a[t];c&&r.push(Be(c,n,i,o,e))}else{let a=s();0,r.push((()=>a.then((r=>{if(!r)return Promise.reject(new Error(`Couldn't resolve component "${e}" at "${o.path}"`));const s=f(r)?r.default:r;o.components[e]=s;const a=s.__vccOpts||s,c=a[t];return c&&Be(c,n,i,o,e)()}))))}}return r}function He(e){return"object"===typeof e||"displayName"in e||"props"in e||"__vccOpts"in e}function ze(e){const t=(0,i.f3)(l),n=(0,i.f3)(u),o=(0,i.Fl)((()=>t.resolve((0,r.SU)(e.to)))),s=(0,i.Fl)((()=>{const{matched:e}=o.value,{length:t}=e,i=e[t-1],r=n.matched;if(!i||!r.length)return-1;const s=r.findIndex(I.bind(null,i));if(s>-1)return s;const a=Je(e[t-2]);return t>1&&Je(i)===a&&r[r.length-1].path!==a?r.findIndex(I.bind(null,e[t-2])):s})),a=(0,i.Fl)((()=>s.value>-1&&Ye(n.params,o.value.params))),c=(0,i.Fl)((()=>s.value>-1&&s.value===n.matched.length-1&&E(n.params,o.value.params)));function h(n={}){return Ke(n)?t[(0,r.SU)(e.replace)?"replace":"push"]((0,r.SU)(e.to)).catch(g):Promise.resolve()}return{route:o,href:(0,i.Fl)((()=>o.value.href)),isActive:a,isExactActive:c,navigate:h}}const Ve=(0,i.aZ)({name:"RouterLink",props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:ze,setup(e,{slots:t}){const n=(0,r.qj)(ze(e)),{options:o}=(0,i.f3)(l),s=(0,i.Fl)((()=>({[Xe(e.activeClass,o.linkActiveClass,"router-link-active")]:n.isActive,[Xe(e.exactActiveClass,o.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive})));return()=>{const r=t.default&&t.default(n);return e.custom?r:(0,i.h)("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:s.value},r)}}}),Ge=Ve;function Ke(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&(void 0===e.button||0===e.button)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function Ye(e,t){for(const n in t){const i=t[n],r=e[n];if("string"===typeof i){if(i!==r)return!1}else if(!Array.isArray(r)||r.length!==i.length||i.some(((e,t)=>e!==r[t])))return!1}return!0}function Je(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Xe=(e,t,n)=>null!=e?e:null!=t?t:n,Qe=(0,i.aZ)({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},setup(e,{attrs:t,slots:n}){const o=(0,i.f3)(h),s=(0,i.Fl)((()=>e.route||o.value)),l=(0,i.f3)(c,0),u=(0,i.Fl)((()=>s.value.matched[l]));(0,i.JJ)(c,l+1),(0,i.JJ)(a,u),(0,i.JJ)(h,s);const d=(0,r.iH)();return(0,i.YP)((()=>[d.value,u.value,e.name]),(([e,t,n],[i,r,o])=>{t&&(t.instances[n]=e,r&&r!==t&&e&&e===i&&(t.leaveGuards.size||(t.leaveGuards=r.leaveGuards),t.updateGuards.size||(t.updateGuards=r.updateGuards))),!e||!t||r&&I(t,r)&&i||(t.enterCallbacks[n]||[]).forEach((t=>t(e)))}),{flush:"post"}),()=>{const r=s.value,o=u.value,a=o&&o.components[e.name],c=e.name;if(!a)return Ze(n.default,{Component:a,route:r});const l=o.props[e.name],h=l?!0===l?r.params:"function"===typeof l?l(r):l:null,f=e=>{e.component.isUnmounted&&(o.instances[c]=null)},m=(0,i.h)(a,p({},h,t,{onVnodeUnmounted:f,ref:d}));return Ze(n.default,{Component:m,route:r})||m}}});function Ze(e,t){if(!e)return null;const n=e(t);return 1===n.length?n[0]:n}const et=Qe;function tt(e){const t=le(e.routes,e),n=e.parseQuery||je,o=e.stringifyQuery||qe,s=e.history;const a=$e(),c=$e(),f=$e(),_=(0,r.XI)(K);let y=K;d&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const b=m.bind(null,(e=>""+e)),I=m.bind(null,Fe),E=m.bind(null,Le);function T(e,n){let i,r;return G(e)?(i=t.getRecordMatcher(e),r=n):r=e,t.addRoute(r,i)}function k(e){const n=t.getRecordMatcher(e);n&&t.removeRoute(n)}function S(){return t.getRoutes().map((e=>e.record))}function x(e){return!!t.getRecordMatcher(e)}function P(e,i){if(i=p({},i||_.value),"string"===typeof e){const r=v(n,e,i.path),o=t.resolve({path:r.path},i),a=s.createHref(r.fullPath);return p(r,o,{params:E(o.params),hash:Le(r.hash),redirectedFrom:void 0,href:a})}let r;if("path"in e)r=p({},e,{path:v(n,e.path,i.path).path});else{const t=p({},e.params);for(const e in t)null==t[e]&&delete t[e];r=p({},e,{params:I(e.params)}),i.params=I(i.params)}const a=t.resolve(r,i),c=e.hash||"";a.params=b(E(a.params));const l=w(o,p({},e,{hash:Oe(c),path:a.path})),u=s.createHref(l);return p({fullPath:l,hash:c,query:o===qe?Ue(e.query):e.query||{}},a,{redirectedFrom:void 0,href:u})}function R(e){return"string"===typeof e?v(n,e,_.value.path):p({},e)}function O(e,t){if(y!==e)return X(8,{from:t,to:e})}function A(e){return $(e)}function L(e){return A(p(R(e),{replace:!0}))}function U(e){const t=e.matched[e.matched.length-1];if(t&&t.redirect){const{redirect:n}=t;let i="function"===typeof n?n(e):n;return"string"===typeof i&&(i=i.includes("?")||i.includes("#")?i=R(i):{path:i},i.params={}),p({query:e.query,hash:e.hash,params:e.params},i)}}function $(e,t){const n=y=P(e),i=_.value,r=e.state,s=e.force,a=!0===e.replace,c=U(n);if(c)return $(p(R(c),{state:r,force:s,replace:a}),t||n);const l=n;let u;return l.redirectedFrom=t,!s&&C(o,i,n)&&(u=X(16,{to:l,from:i}),re(i,i,!0,!1)),(u?Promise.resolve(u):W(l,i)).catch((e=>Q(e)?Q(e,2)?e:ie(e):te(e,l,i))).then((e=>{if(e){if(Q(e,2))return $(p(R(e.to),{state:r,force:s,replace:a}),t||l)}else e=z(l,i,!0,a,r);return H(l,i,e),e}))}function B(e,t){const n=O(e,t);return n?Promise.reject(n):Promise.resolve()}function W(e,t){let n;const[i,r,o]=it(e,t);n=We(i.reverse(),"beforeRouteLeave",e,t);for(const a of i)a.leaveGuards.forEach((i=>{n.push(Be(i,e,t))}));const s=B.bind(null,e,t);return n.push(s),nt(n).then((()=>{n=[];for(const i of a.list())n.push(Be(i,e,t));return n.push(s),nt(n)})).then((()=>{n=We(r,"beforeRouteUpdate",e,t);for(const i of r)i.updateGuards.forEach((i=>{n.push(Be(i,e,t))}));return n.push(s),nt(n)})).then((()=>{n=[];for(const i of e.matched)if(i.beforeEnter&&!t.matched.includes(i))if(Array.isArray(i.beforeEnter))for(const r of i.beforeEnter)n.push(Be(r,e,t));else n.push(Be(i.beforeEnter,e,t));return n.push(s),nt(n)})).then((()=>(e.matched.forEach((e=>e.enterCallbacks={})),n=We(o,"beforeRouteEnter",e,t),n.push(s),nt(n)))).then((()=>{n=[];for(const i of c.list())n.push(Be(i,e,t));return n.push(s),nt(n)})).catch((e=>Q(e,8)?e:Promise.reject(e)))}function H(e,t,n){for(const i of f.list())i(e,t,n)}function z(e,t,n,i,r){const o=O(e,t);if(o)return o;const a=t===K,c=d?history.state:{};n&&(i||a?s.replace(e.fullPath,p({scroll:a&&c&&c.scroll},r)):s.push(e.fullPath,r)),_.value=e,re(e,t,n,a),ie()}let V;function Y(){V=s.listen(((e,t,n)=>{const i=P(e),r=U(i);if(r)return void $(p(r,{replace:!0}),i).catch(g);y=i;const o=_.value;d&&j(F(o.fullPath,n.delta),D()),W(i,o).catch((e=>Q(e,12)?e:Q(e,2)?($(e.to,i).then((e=>{Q(e,20)&&!n.delta&&n.type===N.pop&&s.go(-1,!1)})).catch(g),Promise.reject()):(n.delta&&s.go(-n.delta,!1),te(e,i,o)))).then((e=>{e=e||z(i,o,!1),e&&(n.delta?s.go(-n.delta,!1):n.type===N.pop&&Q(e,20)&&s.go(-1,!1)),H(i,o,e)})).catch(g)}))}let J,Z=$e(),ee=$e();function te(e,t,n){ie(e);const i=ee.list();return i.length?i.forEach((i=>i(e,t,n))):console.error(e),Promise.reject(e)}function ne(){return J&&_.value!==K?Promise.resolve():new Promise(((e,t)=>{Z.add([e,t])}))}function ie(e){return J||(J=!e,Y(),Z.list().forEach((([t,n])=>e?n(e):t())),Z.reset()),e}function re(t,n,r,o){const{scrollBehavior:s}=e;if(!d||!s)return Promise.resolve();const a=!r&&q(F(t.fullPath,0))||(o||!r)&&history.state&&history.state.scroll||null;return(0,i.Y3)().then((()=>s(t,n,a))).then((e=>e&&M(e))).catch((e=>te(e,t,n)))}const oe=e=>s.go(e);let se;const ae=new Set,ce={currentRoute:_,addRoute:T,removeRoute:k,hasRoute:x,getRoutes:S,resolve:P,options:e,push:A,replace:L,go:oe,back:()=>oe(-1),forward:()=>oe(1),beforeEach:a.add,beforeResolve:c.add,afterEach:f.add,onError:ee.add,isReady:ne,install(e){const t=this;e.component("RouterLink",Ge),e.component("RouterView",et),e.config.globalProperties.$router=t,Object.defineProperty(e.config.globalProperties,"$route",{enumerable:!0,get:()=>(0,r.SU)(_)}),d&&!se&&_.value===K&&(se=!0,A(s.location).catch((e=>{0})));const n={};for(const r in K)n[r]=(0,i.Fl)((()=>_.value[r]));e.provide(l,t),e.provide(u,(0,r.qj)(n)),e.provide(h,_);const o=e.unmount;ae.add(e),e.unmount=function(){ae.delete(e),ae.size<1&&(y=K,V&&V(),_.value=K,se=!1,J=!1),o()}}};return ce}function nt(e){return e.reduce(((e,t)=>e.then((()=>t()))),Promise.resolve())}function it(e,t){const n=[],i=[],r=[],o=Math.max(t.matched.length,e.matched.length);for(let s=0;s<o;s++){const o=t.matched[s];o&&(e.matched.find((e=>I(e,o)))?i.push(o):n.push(o));const a=e.matched[s];a&&(t.matched.find((e=>I(e,a)))||r.push(a))}return[n,i,r]}},888:function(e,t,n){"use strict";
/*!
 * Vue3-Lazyload.js v0.2.5-beta
 * A Vue3.x image lazyload plugin
 * (c) 2021 MuRong <admin@imuboy.cn>
 * Released under the MIT License.
 */
var i;n.d(t,{Z:function(){return y}}),function(e){e["LOADING"]="loading",e["LOADED"]="loaded",e["ERROR"]="error"}(i||(i={}));var r="undefined"!==typeof window&&null!==window,o=h(),s=Object.prototype.propertyIsEnumerable,a=Object.getOwnPropertySymbols;function c(e){return"function"===typeof e||"[object Object]"===toString.call(e)}function l(e){return"object"===typeof e?null===e:"function"!==typeof e}function u(e){return"__proto__"!==e&&"constructor"!==e&&"prototype"!==e}function h(){return!!(r&&"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype)&&("isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}}),!0)}function d(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!c(e))throw new TypeError("expected the first argument to be an object");if(0===t.length||"function"!==typeof Symbol||"function"!==typeof a)return e;for(var i=0,r=t;i<r.length;i++)for(var o=r[i],l=a(o),u=0,h=l;u<h.length;u++){var d=h[u];s.call(o,d)&&(e[d]=o[d])}return e}function f(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=0;for(l(e)&&(e=t[i++]),e||(e={});i<t.length;i++)if(c(t[i])){for(var r=0,o=Object.keys(t[i]);r<o.length;r++){var s=o[r];u(s)&&(c(e[s])&&c(t[i][s])?f(e[s],t[i][s]):e[s]=t[i][s])}d(e,t[i])}return e}var p={rootMargin:"0px",threshold:0},m="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",g="",_=function(){function e(e){this.options={loading:m,error:g,observerOptions:p,log:!0,lifecycle:{}},this._images=new WeakMap,this.config(e)}return e.prototype.config=function(e){void 0===e&&(e={}),f(this.options,e)},e.prototype.mount=function(e,t){var n=this._valueFormatter(t.value),r=n.src,s=n.loading,a=n.error,c=n.lifecycle;this._lifecycle(i.LOADING,c,e),e.setAttribute("src",s||m),o||(this.loadImages(e,r,a,c),this._log((function(){throw new Error("Not support IntersectionObserver!")}))),this._initIntersectionObserver(e,r,a,c)},e.prototype.update=function(e,t){var n;null===(n=this._realObserver(e))||void 0===n||n.unobserve(e);var i=this._valueFormatter(t.value),r=i.src,o=i.error,s=i.lifecycle;this._initIntersectionObserver(e,r,o,s)},e.prototype.unmount=function(e){var t;null===(t=this._realObserver(e))||void 0===t||t.unobserve(e),this._images.delete(e)},e.prototype.loadImages=function(e,t,n,i){this._setImageSrc(e,t,n,i)},e.prototype._setImageSrc=function(e,t,n,r){var o=this;if("img"===e.tagName.toLowerCase()){if(t){var s=e.getAttribute("src");s!==t&&e.setAttribute("src",t)}this._listenImageStatus(e,(function(){o._lifecycle(i.LOADED,r,e)}),(function(){var t;e.onload=null,o._lifecycle(i.ERROR,r,e),null===(t=o._realObserver(e))||void 0===t||t.disconnect(),n&&e.setAttribute("src",n),o._log((function(){throw new Error("Image failed to load!")}))}))}else e.style.backgroundImage="url('"+t+"')"},e.prototype._initIntersectionObserver=function(e,t,n,i){var r,o=this,s=this.options.observerOptions;this._images.set(e,new IntersectionObserver((function(r){Array.prototype.forEach.call(r,(function(r){var s;r.isIntersecting&&(null===(s=o._realObserver(e))||void 0===s||s.unobserve(r.target),o._setImageSrc(e,t,n,i))}))}),s)),null===(r=this._realObserver(e))||void 0===r||r.observe(e)},e.prototype._listenImageStatus=function(e,t,n){e.onload=t,e.onerror=n},e.prototype._valueFormatter=function(e){var t=e,n=this.options.loading,i=this.options.error,r=this.options.lifecycle;return c(e)&&(t=e.src,n=e.loading||this.options.loading,i=e.error||this.options.error,r=e.lifecycle||this.options.lifecycle),{src:t,loading:n,error:i,lifecycle:r}},e.prototype._log=function(e){this.options.log&&e()},e.prototype._lifecycle=function(e,t,n){switch(e){case i.LOADING:null===n||void 0===n||n.setAttribute("lazy",i.LOADING),(null===t||void 0===t?void 0:t.loading)&&t.loading(n);break;case i.LOADED:null===n||void 0===n||n.setAttribute("lazy",i.LOADED),(null===t||void 0===t?void 0:t.loaded)&&t.loaded(n);break;case i.ERROR:null===n||void 0===n||n.setAttribute("lazy",i.ERROR),(null===t||void 0===t?void 0:t.error)&&t.error(n);break}},e.prototype._realObserver=function(e){return this._images.get(e)},e}(),y={install:function(e,t){var n=new _(t);e.config.globalProperties.$Lazyload=n,e.provide("Lazyload",n),e.directive("lazy",{mounted:n.mount.bind(n),updated:n.update.bind(n),unmounted:n.unmount.bind(n)})}}},493:function(e){!function(t,n){e.exports=n()}(0,(function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var o;n.r(t);var s=function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},a=function(){return{duration:500,offset:0,container:window,updateHistory:!0,easingFunction:null}},c=Symbol("smoothScrollCtx"),l=function(e){var t=e.scrollTo,n=e.offset,i=e.duration,r=e.container,a=e.updateHistory,c=e.hash,l=e.easingFunction;o||(o=window.requestAnimationFrame||function(e){return window.setTimeout(e,16)}),a&&window.history.pushState&&location.hash!==c&&window.history.pushState("","",c);var u,h,d="number"==typeof t,f=r.scrollTop||window.pageYOffset,p=(d?t:(h=f,"HTML"===(u=t).nodeName?-h:u.getBoundingClientRect().top+h))+n,m="function"==typeof l?l:s,g=Date.now();!function e(){var n=Date.now()-g,s=n<i,c=s?f+(p-f)*m(n/i):p;s?o(e):a&&!d&&location.replace("#"+t.id),r===window?r.scrollTo(0,c):r.scrollTop=c}()},u={install:function(e,t){var n,o=!e.version.startsWith("3"),s=function(){return t?Object.assign(a(),t):a()};e.directive("smooth-scroll",(i(n={},o?"inserted":"mounted",(function(e,t,n){if("object"===("undefined"==typeof window?"undefined":r(window))&&void 0!==window.pageYOffset){var i=Object.assign(s(),t.value);"string"==typeof i.container&&(i.container=document.querySelector(i.container));var a=function(e){e.preventDefault();var t=o?n.data.attrs.href:n.props.href,r=document.getElementById(t.substring(1));r&&l(Object.assign(i,{scrollTo:r,hash:t}))};e.addEventListener("click",a),e[c]={clickHandler:a}}})),i(n,o?"unbind":"unmounted",(function(e){e.removeEventListener("click",e[c].clickHandler),e[c]=null})),n));var u=function(e){var t=Object.assign(s(),e);return l(t)};(o?e.prototype:e.config.globalProperties).$smoothScroll=u,o||e.provide("smoothScroll",u)}};t.default=u}]).default}))},146:function(e,t,n){"use strict";n.d(t,{MT:function(){return G}});var i=n(252),r=n(262);function o(){return s().__VUE_DEVTOOLS_GLOBAL_HOOK__}function s(){return"undefined"!==typeof navigator?window:"undefined"!==typeof n.g?n.g:{}}const a="devtools-plugin:setup";function c(e,t){const n=o();if(n)n.emit(a,e,t);else{const n=s(),i=n.__VUE_DEVTOOLS_PLUGINS__=n.__VUE_DEVTOOLS_PLUGINS__||[];i.push({pluginDescriptor:e,setupFn:t})}}
/*!
 * vuex v4.0.2
 * (c) 2021 Evan You
 * @license MIT
 */
var l="store";function u(e,t){Object.keys(e).forEach((function(n){return t(e[n],n)}))}function h(e){return null!==e&&"object"===typeof e}function d(e){return e&&"function"===typeof e.then}function f(e,t){return function(){return e(t)}}function p(e,t,n){return t.indexOf(e)<0&&(n&&n.prepend?t.unshift(e):t.push(e)),function(){var n=t.indexOf(e);n>-1&&t.splice(n,1)}}function m(e,t){e._actions=Object.create(null),e._mutations=Object.create(null),e._wrappedGetters=Object.create(null),e._modulesNamespaceMap=Object.create(null);var n=e.state;_(e,n,[],e._modules.root,!0),g(e,n,t)}function g(e,t,n){var i=e._state;e.getters={},e._makeLocalGettersCache=Object.create(null);var o=e._wrappedGetters,s={};u(o,(function(t,n){s[n]=f(t,e),Object.defineProperty(e.getters,n,{get:function(){return s[n]()},enumerable:!0})})),e._state=(0,r.qj)({data:t}),e.strict&&I(e),i&&n&&e._withCommit((function(){i.data=null}))}function _(e,t,n,i,r){var o=!n.length,s=e._modules.getNamespace(n);if(i.namespaced&&(e._modulesNamespaceMap[s],e._modulesNamespaceMap[s]=i),!o&&!r){var a=E(t,n.slice(0,-1)),c=n[n.length-1];e._withCommit((function(){a[c]=i.state}))}var l=i.context=y(e,s,n);i.forEachMutation((function(t,n){var i=s+n;w(e,i,t,l)})),i.forEachAction((function(t,n){var i=t.root?n:s+n,r=t.handler||t;b(e,i,r,l)})),i.forEachGetter((function(t,n){var i=s+n;C(e,i,t,l)})),i.forEachChild((function(i,o){_(e,t,n.concat(o),i,r)}))}function y(e,t,n){var i=""===t,r={dispatch:i?e.dispatch:function(n,i,r){var o=T(n,i,r),s=o.payload,a=o.options,c=o.type;return a&&a.root||(c=t+c),e.dispatch(c,s)},commit:i?e.commit:function(n,i,r){var o=T(n,i,r),s=o.payload,a=o.options,c=o.type;a&&a.root||(c=t+c),e.commit(c,s,a)}};return Object.defineProperties(r,{getters:{get:i?function(){return e.getters}:function(){return v(e,t)}},state:{get:function(){return E(e.state,n)}}}),r}function v(e,t){if(!e._makeLocalGettersCache[t]){var n={},i=t.length;Object.keys(e.getters).forEach((function(r){if(r.slice(0,i)===t){var o=r.slice(i);Object.defineProperty(n,o,{get:function(){return e.getters[r]},enumerable:!0})}})),e._makeLocalGettersCache[t]=n}return e._makeLocalGettersCache[t]}function w(e,t,n,i){var r=e._mutations[t]||(e._mutations[t]=[]);r.push((function(t){n.call(e,i.state,t)}))}function b(e,t,n,i){var r=e._actions[t]||(e._actions[t]=[]);r.push((function(t){var r=n.call(e,{dispatch:i.dispatch,commit:i.commit,getters:i.getters,state:i.state,rootGetters:e.getters,rootState:e.state},t);return d(r)||(r=Promise.resolve(r)),e._devtoolHook?r.catch((function(t){throw e._devtoolHook.emit("vuex:error",t),t})):r}))}function C(e,t,n,i){e._wrappedGetters[t]||(e._wrappedGetters[t]=function(e){return n(i.state,i.getters,e.state,e.getters)})}function I(e){(0,i.YP)((function(){return e._state.data}),(function(){0}),{deep:!0,flush:"sync"})}function E(e,t){return t.reduce((function(e,t){return e[t]}),e)}function T(e,t,n){return h(e)&&e.type&&(n=t,t=e,e=e.type),{type:e,payload:t,options:n}}var k="vuex bindings",S="vuex:mutations",N="vuex:actions",x="vuex",P=0;function R(e,t){c({id:"org.vuejs.vuex",app:e,label:"Vuex",homepage:"https://next.vuex.vuejs.org/",logo:"https://vuejs.org/images/icons/favicon-96x96.png",packageName:"vuex",componentStateTypes:[k]},(function(n){n.addTimelineLayer({id:S,label:"Vuex Mutations",color:O}),n.addTimelineLayer({id:N,label:"Vuex Actions",color:O}),n.addInspector({id:x,label:"Vuex",icon:"storage",treeFilterPlaceholder:"Filter stores..."}),n.on.getInspectorTree((function(n){if(n.app===e&&n.inspectorId===x)if(n.filter){var i=[];j(i,t._modules.root,n.filter,""),n.rootNodes=i}else n.rootNodes=[L(t._modules.root,"")]})),n.on.getInspectorState((function(n){if(n.app===e&&n.inspectorId===x){var i=n.nodeId;v(t,i),n.state=q($(t._modules,i),"root"===i?t.getters:t._makeLocalGettersCache,i)}})),n.on.editInspectorState((function(n){if(n.app===e&&n.inspectorId===x){var i=n.nodeId,r=n.path;"root"!==i&&(r=i.split("/").filter(Boolean).concat(r)),t._withCommit((function(){n.set(t._state.data,r,n.state.value)}))}})),t.subscribe((function(e,t){var i={};e.payload&&(i.payload=e.payload),i.state=t,n.notifyComponentUpdate(),n.sendInspectorTree(x),n.sendInspectorState(x),n.addTimelineEvent({layerId:S,event:{time:Date.now(),title:e.type,data:i}})})),t.subscribeAction({before:function(e,t){var i={};e.payload&&(i.payload=e.payload),e._id=P++,e._time=Date.now(),i.state=t,n.addTimelineEvent({layerId:N,event:{time:e._time,title:e.type,groupId:e._id,subtitle:"start",data:i}})},after:function(e,t){var i={},r=Date.now()-e._time;i.duration={_custom:{type:"duration",display:r+"ms",tooltip:"Action duration",value:r}},e.payload&&(i.payload=e.payload),i.state=t,n.addTimelineEvent({layerId:N,event:{time:Date.now(),title:e.type,groupId:e._id,subtitle:"end",data:i}})}})}))}var O=8702998,A=6710886,D=16777215,M={label:"namespaced",textColor:D,backgroundColor:A};function F(e){return e&&"root"!==e?e.split("/").slice(-2,-1)[0]:"Root"}function L(e,t){return{id:t||"root",label:F(t),tags:e.namespaced?[M]:[],children:Object.keys(e._children).map((function(n){return L(e._children[n],t+n+"/")}))}}function j(e,t,n,i){i.includes(n)&&e.push({id:i||"root",label:i.endsWith("/")?i.slice(0,i.length-1):i||"Root",tags:t.namespaced?[M]:[]}),Object.keys(t._children).forEach((function(r){j(e,t._children[r],n,i+r+"/")}))}function q(e,t,n){t="root"===n?t:t[n];var i=Object.keys(t),r={state:Object.keys(e.state).map((function(t){return{key:t,editable:!0,value:e.state[t]}}))};if(i.length){var o=U(t);r.getters=Object.keys(o).map((function(e){return{key:e.endsWith("/")?F(e):e,editable:!1,value:B((function(){return o[e]}))}}))}return r}function U(e){var t={};return Object.keys(e).forEach((function(n){var i=n.split("/");if(i.length>1){var r=t,o=i.pop();i.forEach((function(e){r[e]||(r[e]={_custom:{value:{},display:e,tooltip:"Module",abstract:!0}}),r=r[e]._custom.value})),r[o]=B((function(){return e[n]}))}else t[n]=B((function(){return e[n]}))})),t}function $(e,t){var n=t.split("/").filter((function(e){return e}));return n.reduce((function(e,i,r){var o=e[i];if(!o)throw new Error('Missing module "'+i+'" for path "'+t+'".');return r===n.length-1?o:o._children}),"root"===t?e:e.root._children)}function B(e){try{return e()}catch(t){return t}}var W=function(e,t){this.runtime=t,this._children=Object.create(null),this._rawModule=e;var n=e.state;this.state=("function"===typeof n?n():n)||{}},H={namespaced:{configurable:!0}};H.namespaced.get=function(){return!!this._rawModule.namespaced},W.prototype.addChild=function(e,t){this._children[e]=t},W.prototype.removeChild=function(e){delete this._children[e]},W.prototype.getChild=function(e){return this._children[e]},W.prototype.hasChild=function(e){return e in this._children},W.prototype.update=function(e){this._rawModule.namespaced=e.namespaced,e.actions&&(this._rawModule.actions=e.actions),e.mutations&&(this._rawModule.mutations=e.mutations),e.getters&&(this._rawModule.getters=e.getters)},W.prototype.forEachChild=function(e){u(this._children,e)},W.prototype.forEachGetter=function(e){this._rawModule.getters&&u(this._rawModule.getters,e)},W.prototype.forEachAction=function(e){this._rawModule.actions&&u(this._rawModule.actions,e)},W.prototype.forEachMutation=function(e){this._rawModule.mutations&&u(this._rawModule.mutations,e)},Object.defineProperties(W.prototype,H);var z=function(e){this.register([],e,!1)};function V(e,t,n){if(t.update(n),n.modules)for(var i in n.modules){if(!t.getChild(i))return void 0;V(e.concat(i),t.getChild(i),n.modules[i])}}z.prototype.get=function(e){return e.reduce((function(e,t){return e.getChild(t)}),this.root)},z.prototype.getNamespace=function(e){var t=this.root;return e.reduce((function(e,n){return t=t.getChild(n),e+(t.namespaced?n+"/":"")}),"")},z.prototype.update=function(e){V([],this.root,e)},z.prototype.register=function(e,t,n){var i=this;void 0===n&&(n=!0);var r=new W(t,n);if(0===e.length)this.root=r;else{var o=this.get(e.slice(0,-1));o.addChild(e[e.length-1],r)}t.modules&&u(t.modules,(function(t,r){i.register(e.concat(r),t,n)}))},z.prototype.unregister=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1],i=t.getChild(n);i&&i.runtime&&t.removeChild(n)},z.prototype.isRegistered=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1];return!!t&&t.hasChild(n)};function G(e){return new K(e)}var K=function(e){var t=this;void 0===e&&(e={});var n=e.plugins;void 0===n&&(n=[]);var i=e.strict;void 0===i&&(i=!1);var r=e.devtools;this._committing=!1,this._actions=Object.create(null),this._actionSubscribers=[],this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new z(e),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._makeLocalGettersCache=Object.create(null),this._devtools=r;var o=this,s=this,a=s.dispatch,c=s.commit;this.dispatch=function(e,t){return a.call(o,e,t)},this.commit=function(e,t,n){return c.call(o,e,t,n)},this.strict=i;var l=this._modules.root.state;_(this,l,[],this._modules.root),g(this,l),n.forEach((function(e){return e(t)}))},Y={state:{configurable:!0}};K.prototype.install=function(e,t){e.provide(t||l,this),e.config.globalProperties.$store=this;var n=void 0!==this._devtools&&this._devtools;n&&R(e,this)},Y.state.get=function(){return this._state.data},Y.state.set=function(e){0},K.prototype.commit=function(e,t,n){var i=this,r=T(e,t,n),o=r.type,s=r.payload,a=(r.options,{type:o,payload:s}),c=this._mutations[o];c&&(this._withCommit((function(){c.forEach((function(e){e(s)}))})),this._subscribers.slice().forEach((function(e){return e(a,i.state)})))},K.prototype.dispatch=function(e,t){var n=this,i=T(e,t),r=i.type,o=i.payload,s={type:r,payload:o},a=this._actions[r];if(a){try{this._actionSubscribers.slice().filter((function(e){return e.before})).forEach((function(e){return e.before(s,n.state)}))}catch(l){0}var c=a.length>1?Promise.all(a.map((function(e){return e(o)}))):a[0](o);return new Promise((function(e,t){c.then((function(t){try{n._actionSubscribers.filter((function(e){return e.after})).forEach((function(e){return e.after(s,n.state)}))}catch(l){0}e(t)}),(function(e){try{n._actionSubscribers.filter((function(e){return e.error})).forEach((function(t){return t.error(s,n.state,e)}))}catch(l){0}t(e)}))}))}},K.prototype.subscribe=function(e,t){return p(e,this._subscribers,t)},K.prototype.subscribeAction=function(e,t){var n="function"===typeof e?{before:e}:e;return p(n,this._actionSubscribers,t)},K.prototype.watch=function(e,t,n){var r=this;return(0,i.YP)((function(){return e(r.state,r.getters)}),t,Object.assign({},n))},K.prototype.replaceState=function(e){var t=this;this._withCommit((function(){t._state.data=e}))},K.prototype.registerModule=function(e,t,n){void 0===n&&(n={}),"string"===typeof e&&(e=[e]),this._modules.register(e,t),_(this,this.state,e,this._modules.get(e),n.preserveState),g(this,this.state)},K.prototype.unregisterModule=function(e){var t=this;"string"===typeof e&&(e=[e]),this._modules.unregister(e),this._withCommit((function(){var n=E(t.state,e.slice(0,-1));delete n[e[e.length-1]]})),m(this)},K.prototype.hasModule=function(e){return"string"===typeof e&&(e=[e]),this._modules.isRegistered(e)},K.prototype.hotUpdate=function(e){this._modules.update(e),m(this,!0)},K.prototype._withCommit=function(e){var t=this._committing;this._committing=!0,e(),this._committing=t},Object.defineProperties(K.prototype,Y);Q((function(e,t){var n={};return J(t).forEach((function(t){var i=t.key,r=t.val;n[i]=function(){var t=this.$store.state,n=this.$store.getters;if(e){var i=Z(this.$store,"mapState",e);if(!i)return;t=i.context.state,n=i.context.getters}return"function"===typeof r?r.call(this,t,n):t[r]},n[i].vuex=!0})),n})),Q((function(e,t){var n={};return J(t).forEach((function(t){var i=t.key,r=t.val;n[i]=function(){var t=[],n=arguments.length;while(n--)t[n]=arguments[n];var i=this.$store.commit;if(e){var o=Z(this.$store,"mapMutations",e);if(!o)return;i=o.context.commit}return"function"===typeof r?r.apply(this,[i].concat(t)):i.apply(this.$store,[r].concat(t))}})),n})),Q((function(e,t){var n={};return J(t).forEach((function(t){var i=t.key,r=t.val;r=e+r,n[i]=function(){if(!e||Z(this.$store,"mapGetters",e))return this.$store.getters[r]},n[i].vuex=!0})),n})),Q((function(e,t){var n={};return J(t).forEach((function(t){var i=t.key,r=t.val;n[i]=function(){var t=[],n=arguments.length;while(n--)t[n]=arguments[n];var i=this.$store.dispatch;if(e){var o=Z(this.$store,"mapActions",e);if(!o)return;i=o.context.dispatch}return"function"===typeof r?r.apply(this,[i].concat(t)):i.apply(this.$store,[r].concat(t))}})),n}));function J(e){return X(e)?Array.isArray(e)?e.map((function(e){return{key:e,val:e}})):Object.keys(e).map((function(t){return{key:t,val:e[t]}})):[]}function X(e){return Array.isArray(e)||h(e)}function Q(e){return function(t,n){return"string"!==typeof t?(n=t,t=""):"/"!==t.charAt(t.length-1)&&(t+="/"),e(t,n)}}function Z(e,t,n){var i=e._modulesNamespaceMap[n];return i}},238:function(e,t,n){"use strict";n.d(t,{Jn:function(){return V},KN:function(){return Y},Mq:function(){return K},Xd:function(){return $},ZF:function(){return G},qX:function(){return B}});var i=n(463),r=n(333),o=n(444);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class s{constructor(e){this.container=e}getPlatformInfoString(){const e=this.container.getProviders();return e.map((e=>{if(a(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}function a(e){const t=e.getComponent();return"VERSION"===(null===t||void 0===t?void 0:t.type)}const c="@firebase/app",l="0.7.21",u=new r.Yd("@firebase/app"),h="@firebase/app-compat",d="@firebase/analytics-compat",f="@firebase/analytics",p="@firebase/app-check-compat",m="@firebase/app-check",g="@firebase/auth",_="@firebase/auth-compat",y="@firebase/database",v="@firebase/database-compat",w="@firebase/functions",b="@firebase/functions-compat",C="@firebase/installations",I="@firebase/installations-compat",E="@firebase/messaging",T="@firebase/messaging-compat",k="@firebase/performance",S="@firebase/performance-compat",N="@firebase/remote-config",x="@firebase/remote-config-compat",P="@firebase/storage",R="@firebase/storage-compat",O="@firebase/firestore",A="@firebase/firestore-compat",D="firebase",M="9.6.11",F="[DEFAULT]",L={[c]:"fire-core",[h]:"fire-core-compat",[f]:"fire-analytics",[d]:"fire-analytics-compat",[m]:"fire-app-check",[p]:"fire-app-check-compat",[g]:"fire-auth",[_]:"fire-auth-compat",[y]:"fire-rtdb",[v]:"fire-rtdb-compat",[w]:"fire-fn",[b]:"fire-fn-compat",[C]:"fire-iid",[I]:"fire-iid-compat",[E]:"fire-fcm",[T]:"fire-fcm-compat",[k]:"fire-perf",[S]:"fire-perf-compat",[N]:"fire-rc",[x]:"fire-rc-compat",[P]:"fire-gcs",[R]:"fire-gcs-compat",[O]:"fire-fst",[A]:"fire-fst-compat","fire-js":"fire-js",[D]:"fire-js-all"},j=new Map,q=new Map;function U(e,t){try{e.container.addComponent(t)}catch(n){u.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function $(e){const t=e.name;if(q.has(t))return u.debug(`There were multiple attempts to register component ${t}.`),!1;q.set(t,e);for(const n of j.values())U(n,e);return!0}function B(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const W={["no-app"]:"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",["bad-app-name"]:"Illegal App name: '{$appName}",["duplicate-app"]:"Firebase App named '{$appName}' already exists with different options or config",["app-deleted"]:"Firebase App named '{$appName}' already deleted",["invalid-app-argument"]:"firebase.{$appName}() takes either no argument or a Firebase App instance.",["invalid-log-argument"]:"First argument to `onLog` must be null or a function.",["storage-open"]:"Error thrown when opening storage. Original error: {$originalErrorMessage}.",["storage-get"]:"Error thrown when reading from storage. Original error: {$originalErrorMessage}.",["storage-set"]:"Error thrown when writing to storage. Original error: {$originalErrorMessage}.",["storage-delete"]:"Error thrown when deleting from storage. Original error: {$originalErrorMessage}."},H=new o.LL("app","Firebase",W);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class z{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new i.wA("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw H.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V=M;function G(e,t={}){if("object"!==typeof t){const e=t;t={name:e}}const n=Object.assign({name:F,automaticDataCollectionEnabled:!1},t),r=n.name;if("string"!==typeof r||!r)throw H.create("bad-app-name",{appName:String(r)});const s=j.get(r);if(s){if((0,o.vZ)(e,s.options)&&(0,o.vZ)(n,s.config))return s;throw H.create("duplicate-app",{appName:r})}const a=new i.H0(r);for(const i of q.values())a.addComponent(i);const c=new z(e,n,a);return j.set(r,c),c}function K(e=F){const t=j.get(e);if(!t)throw H.create("no-app",{appName:e});return t}function Y(e,t,n){var r;let o=null!==(r=L[e])&&void 0!==r?r:e;n&&(o+=`-${n}`);const s=o.match(/\s|\//),a=t.match(/\s|\//);if(s||a){const e=[`Unable to register library "${o}" with version "${t}":`];return s&&e.push(`library name "${o}" contains illegal characters (whitespace or "/")`),s&&a&&e.push("and"),a&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void u.warn(e.join(" "))}$(new i.wA(`${o}-version`,(()=>({library:o,version:t})),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const J="firebase-heartbeat-database",X=1,Q="firebase-heartbeat-store";let Z=null;function ee(){return Z||(Z=(0,o.X3)(J,X,((e,t)=>{switch(t){case 0:e.createObjectStore(Q)}})).catch((e=>{throw H.create("storage-open",{originalErrorMessage:e.message})}))),Z}async function te(e){try{const t=await ee();return t.transaction(Q).objectStore(Q).get(ie(e))}catch(t){throw H.create("storage-get",{originalErrorMessage:t.message})}}async function ne(e,t){try{const n=await ee(),i=n.transaction(Q,"readwrite"),r=i.objectStore(Q);return await r.put(t,ie(e)),i.complete}catch(n){throw H.create("storage-set",{originalErrorMessage:n.message})}}function ie(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re=1024,oe=2592e6;class se{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new le(t),this._heartbeatsCachePromise=this._storage.read().then((e=>(this._heartbeatsCache=e,e)))}async triggerHeartbeat(){const e=this.container.getProvider("platform-logger").getImmediate(),t=e.getPlatformInfoString(),n=ae();if(null===this._heartbeatsCache&&(this._heartbeatsCache=await this._heartbeatsCachePromise),this._heartbeatsCache.lastSentHeartbeatDate!==n&&!this._heartbeatsCache.heartbeats.some((e=>e.date===n)))return this._heartbeatsCache.heartbeats.push({date:n,agent:t}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter((e=>{const t=new Date(e.date).valueOf(),n=Date.now();return n-t<=oe})),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null===this._heartbeatsCache||0===this._heartbeatsCache.heartbeats.length)return"";const e=ae(),{heartbeatsToSend:t,unsentEntries:n}=ce(this._heartbeatsCache.heartbeats),i=(0,o.L)(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function ae(){const e=new Date;return e.toISOString().substring(0,10)}function ce(e,t=re){const n=[];let i=e.slice();for(const r of e){const e=n.find((e=>e.agent===r.agent));if(e){if(e.dates.push(r.date),ue(n)>t){e.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),ue(n)>t){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class le{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,o.hl)()&&(0,o.eu)().then((()=>!0)).catch((()=>!1))}async read(){const e=await this._canUseIndexedDBPromise;if(e){const e=await te(this.app);return e||{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;const n=await this._canUseIndexedDBPromise;if(n){const n=await this.read();return ne(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;const n=await this._canUseIndexedDBPromise;if(n){const n=await this.read();return ne(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function ue(e){return(0,o.L)(JSON.stringify({version:2,heartbeats:e})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(e){$(new i.wA("platform-logger",(e=>new s(e)),"PRIVATE")),$(new i.wA("heartbeat",(e=>new se(e)),"PRIVATE")),Y(c,l,e),Y(c,l,"esm2017"),Y("fire-js","")}he("")},463:function(e,t,n){"use strict";n.d(t,{H0:function(){return l},wA:function(){return r}});var i=n(444);class r{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new i.BH;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null===e||void 0===e?void 0:e.identifier),i=null!==(t=null===e||void 0===e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(i)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(r){if(i)return null;throw r}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(c(e))try{this.getOrInitializeService({instanceIdentifier:o})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:i});n.resolve(e)}catch(t){}}}}clearInstance(e=o){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter((e=>"INTERNAL"in e)).map((e=>e.INTERNAL.delete())),...e.filter((e=>"_delete"in e)).map((e=>e._delete()))])}isComponentSet(){return null!=this.component}isInitialized(e=o){return this.instances.has(e)}getOptions(e=o){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[r,o]of this.instancesDeferred.entries()){const e=this.normalizeInstanceIdentifier(r);n===e&&o.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),r=null!==(n=this.onInitCallbacks.get(i))&&void 0!==n?n:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch(i){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:a(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(i){}return n||null}normalizeInstanceIdentifier(e=o){return this.component?this.component.multipleInstances?e:o:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}function a(e){return e===o?void 0:e}function c(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){const t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new s(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}},578:function(e,t,n){"use strict";var i=n(238),r=n(463),o=n(444);const s="@firebase/installations",a="0.5.8",c=1e4,l=`w:${a}`,u="FIS_v2",h="https://firebaseinstallations.googleapis.com/v1",d=36e5,f="installations",p="Installations",m={["missing-app-config-values"]:'Missing App configuration value: "{$valueName}"',["not-registered"]:"Firebase Installation is not registered.",["installation-not-found"]:"Firebase Installation not found.",["request-failed"]:'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',["app-offline"]:"Could not process request. Application offline.",["delete-pending-registration"]:"Can't delete installation while there is a pending registration request."},g=new o.LL(f,p,m);function _(e){return e instanceof o.ZR&&e.code.includes("request-failed")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y({projectId:e}){return`${h}/projects/${e}/installations`}function v(e){return{token:e.token,requestStatus:2,expiresIn:E(e.expiresIn),creationTime:Date.now()}}async function w(e,t){const n=await t.json(),i=n.error;return g.create("request-failed",{requestName:e,serverCode:i.code,serverMessage:i.message,serverStatus:i.status})}function b({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function C(e,{refreshToken:t}){const n=b(e);return n.append("Authorization",T(t)),n}async function I(e){const t=await e();return t.status>=500&&t.status<600?e():t}function E(e){return Number(e.replace("s","000"))}function T(e){return`${u} ${e}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function k({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const i=y(e),r=b(e),o=t.getImmediate({optional:!0});if(o){const e=await o.getHeartbeatsHeader();e&&r.append("x-firebase-client",e)}const s={fid:n,authVersion:u,appId:e.appId,sdkVersion:l},a={method:"POST",headers:r,body:JSON.stringify(s)},c=await I((()=>fetch(i,a)));if(c.ok){const e=await c.json(),t={fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:v(e.authToken)};return t}throw await w("Create Installation",c)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(e){return new Promise((t=>{setTimeout(t,e)}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(e){const t=btoa(String.fromCharCode(...e));return t.replace(/\+/g,"-").replace(/\//g,"_")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x=/^[cdef][\w-]{21}$/,P="";function R(){try{const e=new Uint8Array(17),t=self.crypto||self.msCrypto;t.getRandomValues(e),e[0]=112+e[0]%16;const n=O(e);return x.test(n)?n:P}catch(e){return P}}function O(e){const t=N(e);return t.substr(0,22)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A(e){return`${e.appName}!${e.appId}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D=new Map;function M(e,t){const n=A(e);F(n,t),L(n,t)}function F(e,t){const n=D.get(e);if(n)for(const i of n)i(t)}function L(e,t){const n=q();n&&n.postMessage({key:e,fid:t}),U()}let j=null;function q(){return!j&&"BroadcastChannel"in self&&(j=new BroadcastChannel("[Firebase] FID Change"),j.onmessage=e=>{F(e.data.key,e.data.fid)}),j}function U(){0===D.size&&j&&(j.close(),j=null)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $="firebase-installations-database",B=1,W="firebase-installations-store";let H=null;function z(){return H||(H=(0,o.X3)($,B,((e,t)=>{switch(t){case 0:e.createObjectStore(W)}}))),H}async function V(e,t){const n=A(e),i=await z(),r=i.transaction(W,"readwrite"),o=r.objectStore(W),s=await o.get(n);return await o.put(t,n),await r.complete,s&&s.fid===t.fid||M(e,t.fid),t}async function G(e){const t=A(e),n=await z(),i=n.transaction(W,"readwrite");await i.objectStore(W).delete(t),await i.complete}async function K(e,t){const n=A(e),i=await z(),r=i.transaction(W,"readwrite"),o=r.objectStore(W),s=await o.get(n),a=t(s);return void 0===a?await o.delete(n):await o.put(a,n),await r.complete,!a||s&&s.fid===a.fid||M(e,a.fid),a}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y(e){let t;const n=await K(e.appConfig,(n=>{const i=J(n),r=X(e,i);return t=r.registrationPromise,r.installationEntry}));return n.fid===P?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function J(e){const t=e||{fid:R(),registrationStatus:0};return te(t)}function X(e,t){if(0===t.registrationStatus){if(!navigator.onLine){const e=Promise.reject(g.create("app-offline"));return{installationEntry:t,registrationPromise:e}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},i=Q(e,n);return{installationEntry:n,registrationPromise:i}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:Z(e)}:{installationEntry:t}}async function Q(e,t){try{const n=await k(e,t);return V(e.appConfig,n)}catch(n){throw _(n)&&409===n.customData.serverCode?await G(e.appConfig):await V(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Z(e){let t=await ee(e.appConfig);while(1===t.registrationStatus)await S(100),t=await ee(e.appConfig);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:n}=await Y(e);return n||t}return t}function ee(e){return K(e,(e=>{if(!e)throw g.create("installation-not-found");return te(e)}))}function te(e){return ne(e)?{fid:e.fid,registrationStatus:0}:e}function ne(e){return 1===e.registrationStatus&&e.registrationTime+c<Date.now()}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ie({appConfig:e,heartbeatServiceProvider:t},n){const i=re(e,n),r=C(e,n),o=t.getImmediate({optional:!0});if(o){const e=await o.getHeartbeatsHeader();e&&r.append("x-firebase-client",e)}const s={installation:{sdkVersion:l,appId:e.appId}},a={method:"POST",headers:r,body:JSON.stringify(s)},c=await I((()=>fetch(i,a)));if(c.ok){const e=await c.json(),t=v(e);return t}throw await w("Generate Auth Token",c)}function re(e,{fid:t}){return`${y(e)}/${t}/authTokens:generate`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oe(e,t=!1){let n;const i=await K(e.appConfig,(i=>{if(!le(i))throw g.create("not-registered");const r=i.authToken;if(!t&&ue(r))return i;if(1===r.requestStatus)return n=se(e,t),i;{if(!navigator.onLine)throw g.create("app-offline");const t=de(i);return n=ce(e,t),t}})),r=n?await n:i.authToken;return r}async function se(e,t){let n=await ae(e.appConfig);while(1===n.authToken.requestStatus)await S(100),n=await ae(e.appConfig);const i=n.authToken;return 0===i.requestStatus?oe(e,t):i}function ae(e){return K(e,(e=>{if(!le(e))throw g.create("not-registered");const t=e.authToken;return fe(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e}))}async function ce(e,t){try{const n=await ie(e,t),i=Object.assign(Object.assign({},t),{authToken:n});return await V(e.appConfig,i),n}catch(n){if(!_(n)||401!==n.customData.serverCode&&404!==n.customData.serverCode){const n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await V(e.appConfig,n)}else await G(e.appConfig);throw n}}function le(e){return void 0!==e&&2===e.registrationStatus}function ue(e){return 2===e.requestStatus&&!he(e)}function he(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+d}function de(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function fe(e){return 1===e.requestStatus&&e.requestTime+c<Date.now()}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pe(e){const t=e,{installationEntry:n,registrationPromise:i}=await Y(t);return i?i.catch(console.error):oe(t).catch(console.error),n.fid}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function me(e,t=!1){const n=e;await ge(n);const i=await oe(n,t);return i.token}async function ge(e){const{registrationPromise:t}=await Y(e);t&&await t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _e(e){if(!e||!e.options)throw ye("App Configuration");if(!e.name)throw ye("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw ye(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function ye(e){return g.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ve="installations",we="installations-internal",be=e=>{const t=e.getProvider("app").getImmediate(),n=_e(t),r=(0,i.qX)(t,"heartbeat"),o={app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()};return o},Ce=e=>{const t=e.getProvider("app").getImmediate(),n=(0,i.qX)(t,ve).getImmediate(),r={getId:()=>pe(n),getToken:e=>me(n,e)};return r};function Ie(){(0,i.Xd)(new r.wA(ve,be,"PUBLIC")),(0,i.Xd)(new r.wA(we,Ce,"PRIVATE"))}Ie(),(0,i.KN)(s,a),(0,i.KN)(s,a,"esm2017")},333:function(e,t,n){"use strict";n.d(t,{Yd:function(){return l},in:function(){return r}});
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const i=[];var r;(function(e){e[e["DEBUG"]=0]="DEBUG",e[e["VERBOSE"]=1]="VERBOSE",e[e["INFO"]=2]="INFO",e[e["WARN"]=3]="WARN",e[e["ERROR"]=4]="ERROR",e[e["SILENT"]=5]="SILENT"})(r||(r={}));const o={debug:r.DEBUG,verbose:r.VERBOSE,info:r.INFO,warn:r.WARN,error:r.ERROR,silent:r.SILENT},s=r.INFO,a={[r.DEBUG]:"log",[r.VERBOSE]:"log",[r.INFO]:"info",[r.WARN]:"warn",[r.ERROR]:"error"},c=(e,t,...n)=>{if(t<e.logLevel)return;const i=(new Date).toISOString(),r=a[t];if(!r)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[r](`[${i}]  ${e.name}:`,...n)};class l{constructor(e){this.name=e,this._logLevel=s,this._logHandler=c,this._userLogHandler=null,i.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in r))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"===typeof e?o[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!==typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,r.DEBUG,...e),this._logHandler(this,r.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,r.VERBOSE,...e),this._logHandler(this,r.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,r.INFO,...e),this._logHandler(this,r.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,r.WARN,...e),this._logHandler(this,r.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,r.ERROR,...e),this._logHandler(this,r.ERROR,...e)}}}}]);
//# sourceMappingURL=chunk-vendors.6ab6b541.js.map