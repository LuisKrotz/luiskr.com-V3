(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["notfound"],{"2c9c":function(e,t,n){"use strict";n("f23f")},9703:function(e,t,n){"use strict";n.r(t);var o=n("7a23");const c={class:"not-found-decoration"},i=Object(o["h"])(" 404 "),r={id:"#main",class:"not-found"},s=Object(o["i"])("h2",{class:"not-found-title"},"Looks like someone's lost here.",-1),u=Object(o["h"])("Click here to go to the main page.");function a(e,t,n,a,d,b){const l=Object(o["w"])("router-link");return Object(o["r"])(),Object(o["e"])(o["a"],null,[Object(o["i"])("div",c,[(Object(o["r"])(!0),Object(o["e"])(o["a"],null,Object(o["v"])(d.marquee,e=>(Object(o["r"])(),Object(o["e"])("div",{key:e,class:"not-found-decoration-marquee","aria-hidden":"true","data-no-snippet":""},[(Object(o["r"])(),Object(o["e"])(o["a"],null,Object(o["v"])(10,e=>(Object(o["r"])(),Object(o["e"])(o["a"],{key:e},[i],64))),64))]))),128))]),Object(o["i"])("div",r,[Object(o["i"])("div",null,[s,Object(o["i"])(l,{class:"not-found-link",to:"/"},{default:Object(o["D"])(()=>[u]),_:1})])])],64)}var d={data(){return{marquee:Number}},name:"Not Found",created(){document.title=this.$route.meta.title},mounted(){this.$store.commit("setMarqueeAmount"),this.marquee=this.$store.getters.getMarqueeAmount,window.addEventListener("resize",()=>{this.$store.commit("setMarqueeAmount"),this.marquee=this.$store.getters.getMarqueeAmount},!0)}};n("2c9c");d.render=a;t["default"]=d},f23f:function(e,t,n){}}]);
//# sourceMappingURL=notfound.a10b808a.js.map