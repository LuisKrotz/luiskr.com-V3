if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let a={};const o=e=>i(e,c),d={module:{uri:c},exports:a,require:o};s[c]=Promise.all(r.map((e=>d[e]||o(e)))).then((e=>(n(...e),a)))}}define(["./workbox-2d118ab0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"luiskr.com"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/android-chrome-144x144.png",revision:"3d5fb9bbc41548326c97696c6e3dec9a"},{url:"/android-chrome-192x192.png",revision:"92dd91ea0acab960a83c0aed051a7976"},{url:"/android-chrome-256x256.png",revision:"f72c22e9aa8b9c8737ec71d8896f442b"},{url:"/apple-touch-icon.png",revision:"1558bef342bb65fc2f299aa55b630686"},{url:"/browserconfig.xml",revision:"d2df81ad65b5328b978ef56fc53d5f09"},{url:"/css/about.b6ea24d9.css",revision:null},{url:"/css/app.37f40e45.css",revision:null},{url:"/css/legal.456037c7.css",revision:null},{url:"/css/notfound.26e29036.css",revision:null},{url:"/css/project.6edc33fe.css",revision:null},{url:"/favicon-16x16.png",revision:"cf0618db0ee601dc8a04fec6252663d3"},{url:"/favicon-32x32.png",revision:"05da880be966abaf1e8af78c5f86b4a7"},{url:"/favicon.ico",revision:"c1aad3949658fbac38f7c40b9d0de0ff"},{url:"/favicon.svg",revision:"246f9f81897beb34283570f565001622"},{url:"/index-unminified.html",revision:"a9fcb7c0280549c55bad7332e3ced799"},{url:"/index.html",revision:"d4bc7cc5568b2f8b43120ab4bf67af4d"},{url:"/js/about.5194a003.js",revision:null},{url:"/js/about.5194a003.js.map",revision:"81cc50bddaeab4053beb0baa6d4ac58d"},{url:"/js/app.7cd51b86.js",revision:null},{url:"/js/app.7cd51b86.js.map",revision:"f50e137941c95db511dab615508d5b62"},{url:"/js/chunk-vendors.83a77c2f.js",revision:null},{url:"/js/chunk-vendors.83a77c2f.js.map",revision:"23893e894a64219e275710740e2e3326"},{url:"/js/legal.19e9474b.js",revision:null},{url:"/js/legal.19e9474b.js.map",revision:"a6010c5e764c64debc221c1e32682649"},{url:"/js/notfound.4d7aed99.js",revision:null},{url:"/js/notfound.4d7aed99.js.map",revision:"3e2a053aab0192859b231b39d79bfc4b"},{url:"/js/project.d7f27133.js",revision:null},{url:"/js/project.d7f27133.js.map",revision:"8168306b618879afede425d637d37650"},{url:"/mstile-150x150.png",revision:"3bdeaac6684d2a06ea24206810d48690"},{url:"/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/safari-pinned-tab.svg",revision:"d31c748fece42c7ce6685b58374bd4cb"},{url:"/share.png",revision:"b659d07cfb7ea1a375f361101d4a9f21"},{url:"/site.webmanifest",revision:"75e337955f4d9d398225f1819f64e864"},{url:"/sitemap.xml",revision:"3df8cc94cd3f0bd132634dca8d022a65"}],{})}));
//# sourceMappingURL=service-worker.js.map
