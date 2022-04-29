(function(){"use strict";var t={627:function(t,e,o){var n=o(963),a=o(252),i=o(577);const s={key:0,class:"nav"},r={key:2},l={class:"nav-separator"},c={key:1,class:"cookies"},u=["innerHTML"],d={class:"cookies-buttons"};function m(t,e,o,m,g,p){const h=(0,a.up)("router-link"),f=(0,a.up)("router-view");return(0,a.wg)(),(0,a.iD)(a.HY,null,[g.translations?((0,a.wg)(),(0,a.iD)("div",{key:0,class:(0,i.C_)(g.modal.class)},[""===g.modal.class?((0,a.wg)(),(0,a.iD)("div",s,["Home"!==t.$router.currentRoute.value.name?((0,a.wg)(),(0,a.j4)(h,{key:0,class:"nav-link back",to:"/"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,i.zw)(g.translations.title),1)])),_:1})):((0,a.wg)(),(0,a.iD)("button",{key:1,class:"nav-link active",onClick:e[0]||(e[0]=t=>p.scrollTop())},(0,i.zw)(g.translations.title),1)),"Not Found"!==t.$router.currentRoute.value.name?((0,a.wg)(),(0,a.iD)("div",r,["About"!==t.$router.currentRoute.value.name?((0,a.wg)(),(0,a.j4)(h,{key:0,class:"nav-link",to:g.translations.about.link},{default:(0,a.w5)((()=>[(0,a.Uk)((0,i.zw)(g.translations.about.description),1)])),_:1},8,["to"])):((0,a.wg)(),(0,a.iD)("button",{key:1,class:"nav-link active",onClick:e[1]||(e[1]=t=>p.scrollTop())},(0,i.zw)(g.translations.about.description),1)),(0,a._)("span",l,(0,i.zw)(g.onBottom?"▲":"|"),1),g.onBottom?((0,a.wg)(),(0,a.iD)("button",{key:3,class:"nav-link scroll-up",onClick:e[3]||(e[3]=t=>p.scrollTop())},(0,i.zw)(g.translations.scrollup),1)):((0,a.wg)(),(0,a.iD)("button",{key:2,class:"nav-link scroll-down",onClick:e[2]||(e[2]=t=>p.scrollBottom())},["Home"===t.$router.currentRoute.value.name||"About"===t.$router.currentRoute.value.name?((0,a.wg)(),(0,a.iD)(a.HY,{key:0},[(0,a.Uk)((0,i.zw)(g.translations.contact),1)],64)):((0,a.wg)(),(0,a.iD)(a.HY,{key:1},[(0,a.Uk)((0,i.zw)(g.translations.related),1)],64))]))])):(0,a.kq)("",!0)])):((0,a.wg)(),(0,a.iD)("div",{key:1,onClick:e[5]||(e[5]=t=>p.closeModal()),class:"nav"},[(0,a._)("button",{class:"nav-link",onClick:e[4]||(e[4]=t=>p.scrollTop())},(0,i.zw)(g.translations.title),1)])),(0,a.Wm)(f,null,{default:(0,a.w5)((({Component:t})=>[(0,a.Wm)(n.uT,{name:"fade"},{default:(0,a.w5)((()=>[((0,a.wg)(),(0,a.j4)((0,a.LL)(t)))])),_:2},1024)])),_:1})],2)):(0,a.kq)("",!0),g.translations&&!g.renderCookies?((0,a.wg)(),(0,a.iD)("aside",c,[(0,a._)("p",{class:"cookies-info",innerHTML:g.translations.cookies.message},null,8,u),(0,a._)("div",d,[(0,a._)("button",{class:"cookies-buttons-accept",onClick:e[6]||(e[6]=t=>p.cookieAction(!0))},(0,i.zw)(g.translations.cookies.accept),1),(0,a._)("button",{class:"cookies-buttons-refuse",onClick:e[7]||(e[7]=t=>p.cookieAction(!1))},(0,i.zw)(g.translations.cookies.refuse),1)])])):(0,a.kq)("",!0)],64)}var g=o(663);const p="cookie",h="cookieAction";var f={name:"App",data(){return{modal:this.$store.getters.getModal,onBottom:!1,renderCookies:!1,translations:!1}},methods:{checkScroll(){document.body.scrollHeight-window.scrollY<=window.innerHeight+200?this.onBottom=!0:this.onBottom=!1},closeModal(){let t=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame((()=>{window.scrollTo(0,t)}))},cookieAction(t){console.log(t),localStorage.setItem(p,t),document.dispatchEvent(new Event(h)),setTimeout((()=>this.renderCookies=!0),2e3)},scrollBottom(){this.$smoothScroll({duration:1e3,updateHistory:!0,scrollTo:document.body.scrollHeight,hash:""})},scrollTop(){this.$smoothScroll({duration:1e3,updateHistory:!0,scrollTo:0,hash:""})},loadData(){let t;this.$store.commit("setLang",this.$store.getters.getlang.locale),this.renderCookies=JSON.parse(localStorage.getItem(p)),t=this.$store.getters.getlang.database+this.$store.getters.getlang.locale,this.translations||(0,g.U2)((0,g.iU)((0,g.iH)((0,g.N8)()),`${t}/APP`)).then((t=>{t.exists()?(this.translations=t.val(),this.$store.commit("setClickOrTap",{click:this.translations.actions.click,tap:this.translations.actions.tap})):console.log("%cERROR: could't find APP DATA",this.$sharedData.styles.info)})).catch((t=>{console.error(t)})),this.$store.getters.getlang.components||(0,g.U2)((0,g.iU)((0,g.iH)((0,g.N8)()),`${t}/components`)).then((t=>{t.exists()?this.$store.commit("setComponentLang",t.val()):console.log("%cERROR: could't find COMPONENT DATA",this.$sharedData.styles.info)})).catch((t=>{console.error(t)}))}},created(){this.loadData()},mounted(){window.addEventListener("scroll",(()=>this.checkScroll())),window.addEventListener("resize",(()=>this.checkScroll()))},watch:{$route(){this.loadData()}}},w=o(744);const v=(0,w.Z)(f,[["render",m]]);var k=v,b=o(205);(0,b.z)("/service-worker.js",{ready(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(){console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){console.log("New content is available; please refresh.")},offline(){console.log("No internet connection found. App is running in offline mode.")},error(t){console.error("Error during service worker registration:",t)}});var y=o(119);const D={id:"home"},M={id:"portfolio",class:"portfolio-title"},_={class:"hdn"},C={key:0},T={key:1},$=(0,a._)("span",null,"▲",-1),x={key:0},A={key:1},H={class:"portfolio"},z={key:0,class:"portfolio-grid"},j={key:1,class:"portfolio-grid"},O=["viewBox","alt"],S=["points"],q=["transform"];function R(t,e,o,s,r,l){const c=(0,a.up)("DrawComputer"),u=(0,a.up)("Contact");return(0,a.wg)(),(0,a.iD)("article",{class:(0,i.C_)(r.has_touch?"has_touch":"")},[(0,a._)("div",D,[(0,a._)("div",M,[(0,a._)("h2",_,[r.translations?((0,a.wg)(),(0,a.iD)("span",C,(0,i.zw)(r.translations.message)+":",1)):((0,a.wg)(),(0,a.iD)("span",T,(0,i.zw)(r.loading.msg1),1))]),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(r.marquee,(t=>((0,a.wg)(),(0,a.iD)("div",{key:t,class:"portfolio-title-marquee","aria-hidden":"true","data-no-snippet":"",tabindex:"-1"},[((0,a.wg)(),(0,a.iD)(a.HY,null,(0,a.Ko)(3,(t=>((0,a.wg)(),(0,a.iD)(a.HY,{key:t},[$,r.translations?((0,a.wg)(),(0,a.iD)("span",x,(0,i.zw)(r.translations.message),1)):((0,a.wg)(),(0,a.iD)("span",A,(0,i.zw)(r.loading.msg1),1))],64)))),64))])))),128))]),(0,a._)("section",H,[r.translations?.portfoliolist?((0,a.wg)(),(0,a.iD)("ul",z,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(r.translations.portfoliolist,((t,o)=>((0,a.wg)(),(0,a.iD)("li",{class:"portfolio-item",key:o,onMouseenter:e[0]||(e[0]=(0,n.iM)((t=>l.hover(t)),["self"])),onMousemove:e[1]||(e[1]=t=>l.onMouseMove(t)),onMouseleave:e[2]||(e[2]=t=>l.clear())},[(0,a.Wm)(c,{link:"/portfolio/"+t.link,image:r.storage+"covers/"+t.image,width:t.width,height:t.height,label:t.label,description:t.description},null,8,["link","image","width","height","label","description"])],32)))),128))])):((0,a.wg)(),(0,a.iD)("ul",j,[((0,a.wg)(),(0,a.iD)(a.HY,null,(0,a.Ko)(8,(t=>(0,a._)("li",{class:"portfolio-item",key:t},[(0,a.Wm)(c,{label:r.loading.msg2,description:r.loading.msg3},null,8,["label","description"])]))),64))]))])]),(0,a.Wm)(u),r.translations&&!r.has_touch?((0,a.wg)(),(0,a.iD)("svg",{key:0,viewBox:r.svg.viewBox,class:"hover",alt:r.tap+r.translations.explore[0]+r.translations.explore[1],style:(0,i.j5)("transform: translate3D("+r.page.left+"px, "+r.page.top+"px, 0); "+(r.showhover?"opacity: 1":"opacity: 0")),"aria-hidden":"true"},[(0,a._)("title",null,(0,i.zw)(r.tap+r.translations.explore[0]+r.translations.explore[1]),1),(0,a._)("g",null,[(0,a._)("polygon",{class:"hover-triangle-2",points:r.svg.polygonPoints[1]},null,8,S),(0,a._)("text",{class:"hover-text",transform:r.svg.textTransform},"<"+(0,i.zw)(r.translations.explore[1])+"/>",9,q)])],12,O)):(0,a.kq)("",!0)],2)}var L=o(425);const E={class:"portfolio-item-computer"},P={class:"portfolio-item-computer-frame"},B={class:"portfolio-item-computer-screen"},N={key:0,class:"portfolio-item-computer-screen-image"},Y=["src","alt","width","height"],G=["src","alt","width","height"],U={key:1,class:"portfolio-item-computer-screen-image"},V=(0,a._)("div",{class:"portfolio-item-computer-chin"},null,-1),W=(0,a._)("div",{class:"portfolio-item-computer-stand"},null,-1),I=(0,a._)("div",{class:"portfolio-item-computer-base"},null,-1),K={class:"portfolio-item-label"},F={class:"portfolio-item-label-title"},Z=["innerHTML"],Q={key:0,class:"portfolio-item-label-button"};function J(t,e,o,n,s,r){const l=(0,a.up)("LoadSVG"),c=(0,a.up)("router-link"),u=(0,a.Q2)("lazy");return(0,a.wg)(),(0,a.j4)(c,{class:"portfolio-item-link",to:o.link},{default:(0,a.w5)((()=>[(0,a._)("div",E,[(0,a._)("div",P,[(0,a._)("div",B,[void 0!==o.image?((0,a.wg)(),(0,a.iD)("div",N,[((0,a.wg)(),(0,a.iD)(a.HY,null,(0,a.Ko)(2,((t=1)=>((0,a.wg)(),(0,a.iD)(a.HY,{key:t},[s.viewport>=640?(0,a.wy)(((0,a.wg)(),(0,a.iD)("img",{key:0,class:(0,i.C_)("portfolio-item-computer-screen-image-item-"+t),src:o.image+s.ext,alt:o.label,width:o.width[0],height:o.height[0]},null,10,Y)),[[u,{src:o.image+s.ext,loading:o.image+s.loadext+s.ext}]]):(0,a.wy)(((0,a.wg)(),(0,a.iD)("img",{key:1,class:(0,i.C_)("portfolio-item-computer-screen-image-item-"+t),src:o.image+s.mobileext+s.ext,alt:o.label,width:o.width[1],height:o.height[1]},null,10,G)),[[u,{src:o.image+s.mobileext+s.ext,loading:o.image+s.loadext+s.mobileext+s.ext}]])],64)))),64))])):((0,a.wg)(),(0,a.iD)("div",U,[(0,a.Wm)(l,{classes:"load-svg",renderText:!1})]))])]),V,W,I]),(0,a._)("div",K,[(0,a._)("h4",F,(0,i.zw)(o.label),1),(0,a._)("p",{class:"portfolio-item-label-description",innerHTML:o.description},null,8,Z),t.transitions?((0,a.wg)(),(0,a.iD)("button",Q,(0,i.zw)(s.action)+" "+(0,i.zw)(s.translations.action),1)):(0,a.kq)("",!0)])])),_:1},8,["to"])}var X=o(978),tt={data(){return{viewport:Number,loadext:"-mozjpg3-MSSIM-tuned-kodak",mobileext:"-mobile",ext:".jpg",action:this.$store.getters.getClickOrTap,translations:!1}},name:"Draw Computer",components:{LoadSVG:X.Z},props:{link:{required:!1,type:String,default:"/"},label:{required:!0,type:String},description:{required:!0,type:String},image:{required:!1,type:String},width:{required:!1,type:Array},height:{required:!1,type:Array}},watch:{"$store.state.lang.components":{immediate:!0,handler(){this.translations=this.$store.getters.getlang.components.draw}}},created(){let t=document.createElement("link");t.rel="preload",t.as="image",t.href=this.image+this.loadext+(window.innerWidth>=640?"":this.mobileext)+this.ext,document.getElementsByTagName("head")[0].appendChild(t)},mounted(){this.setViewport(),window.addEventListener("resize",this.setViewport,!1)},methods:{setViewport(){this.viewport=window.outerWidth}}};const et=(0,w.Z)(tt,[["render",J]]);var ot=et,nt={data(){return{loading:this.$store.getters.getlang.loading,storage:this.$store.getters.getStorage,translations:!1,svg:this.$store.getters.getSVG,has_touch:this.$store.getters.getTouch,showhover:this.$store.getters.getHover,tap:this.$store.getters.getClickOrTap,page:this.$store.getters.getOnMouseMove,marquee:Number}},name:"Home",components:{DrawComputer:ot,Contact:L.Z},methods:{scrollTo(t){this.$smoothScroll({offset:-100,duration:1e3,updateHistory:!1,scrollTo:this.$refs[t]})},onMouseMove(t){this.$store.commit("setOnMouseMove",t),this.page=this.$store.getters.getOnMouseMove},hover(t){this.$store.commit("setHover",t),this.showhover=this.$store.getters.getHover},clear(){this.$store.commit("setClear"),this.showhover=this.$store.getters.getHover}},created(){let t=this.$store.getters.getlang;document.title=this.$route.meta.title,(0,g.U2)((0,g.iU)((0,g.iH)((0,g.N8)()),t.database+t.locale+t.pagesPath+this.$route.meta.translation)).then((t=>{t.exists()?this.translations=t.val():console.log("%cERROR: could't find HOME DATA",this.$sharedData.styles.info)})).catch((t=>{console.error(t)}))},mounted(){this.$store.commit("setMarqueeAmount"),this.marquee=this.$store.getters.getMarqueeAmount,setTimeout((()=>{window.scrollTo(0,0)}),500),window.addEventListener("resize",(()=>{this.$store.commit("setMarqueeAmount"),this.marquee=this.$store.getters.getMarqueeAmount}),!0)}};const at=(0,w.Z)(nt,[["render",R]]);var it=at;const st="Luis Krötz",rt=[{path:"/",name:"Home",component:it,meta:{title:st,translation:"HOME"}},{path:"/about",name:"About",component:()=>o.e(443).then(o.bind(o,789)),meta:{title:st+" | About",translation:"about"}},{path:"/portfolio/metcha",name:"METCHA",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | METCHA",translation:"metcha",projectRoute:!0}},{path:"/portfolio/transa",name:"Transa",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | TRANSA",translation:"transa",projectRoute:!0}},{path:"/portfolio/aboutmarco",name:"Marco Almeida",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Marco Almeida",translation:"aboutmarco",projectRoute:!0}},{path:"/portfolio/melissa",name:"Melissa",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Melissa",translation:"melissa",projectRoute:!0}},{path:"/portfolio/minimelissa",name:"Minimelissa",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Minimelissa",translation:"mini-melissa",projectRoute:!0}},{path:"/portfolio/mor",name:"Mor",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | MOR",translation:"mor",projectRoute:!0}},{path:"/portfolio/coza",name:"Coza",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Coza",translation:"coza",projectRoute:!0}},{path:"/portfolio/brazilian-leather",name:"Brazilian Leather",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Brazilian Leather",translation:"cicb",projectRoute:!0}},{path:"/portfolio/cecerele",name:"Cecerelê",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Cecerelê",translation:"cecerele",projectRoute:!0}},{path:"/portfolio/clinica-de-desenvolvimento-nathalia-bond",name:"Cliníca de Desenvolvimento - Nathalia Bond",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Cliníca de Desenvolvimento - Nathalia Bond",translation:"nathalia-bond",projectRoute:!0}},{path:"/portfolio/vibra",name:"Vibra",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Vibra",translation:"vibra",projectRoute:!0}},{path:"/portfolio/genesysinf-sageweb",name:"Genesysinf Sageweb",component:()=>o.e(242).then(o.bind(o,696)),meta:{title:st+" | Genesysinf / Sageweb",translation:"sage",projectRoute:!0}},{path:"/privacy-policy",name:"Privacy Policy",component:()=>o.e(871).then(o.bind(o,985)),meta:{title:st+" | Privacy Policy",translation:"privacy-policy",legalRoute:!0}},{path:"/gdpr",name:"GDPR",component:()=>o.e(871).then(o.bind(o,985)),meta:{title:st+" | GDPR",translation:"GDPR",legalRoute:!0}},{path:"/terms-of-use",name:"Terms of Use",component:()=>o.e(871).then(o.bind(o,985)),meta:{title:st+" | Terms of Use",translation:"terms-of-use",legalRoute:!0}},{path:"/:pathMatch(.*)*",name:"Not Found",component:()=>o.e(245).then(o.bind(o,583)),meta:{title:st+" | Page not found",translation:"not-found"}}],lt=(0,y.p7)({history:(0,y.PO)("/"),routes:rt});var ct=lt,ut=o(146),dt=(0,ut.MT)({state:{clickortap:String,defaultSVG:{viewBox:"0 0 117.29 122.67",polygonPoints:["58.65 1 0.87 101.08 116.43 101.08 58.65 1","58.65 22.09 0.87 122.17 116.43 122.17 58.65 22.09"],textTransform:"translate(18.28 115.62)"},has_touch:"ontouchstart"in window||navigator.msMaxTouchPoints>0,lang:{components:!1,database:"translations/",loading:{msg1:"Loading",msg2:"...",msg3:"Gathering some data on the server ... Hold on just a second while the Websockets are working!"},locale:"en",pagesPath:"/pages/",projectPath:"/projects/"},marqueeamount:Number,modalObject:{transform:"translateY(0)",class:"",open:!1,media:{source:"",thumb:"",alt:"",width:0,height:0,isVideo:!1}},origin:window.location.origin,page:{left:0,top:0},showhover:!1,storage:"https://storage.googleapis.com/luiskr.com/public/_v3/"},mutations:{setClear(t){document.body.classList.remove("mouseenter"),t.showhover=!1},setClickOrTap(t,e){t.clickortap=t.has_touch?e.tap:e.click},setComponentLang(t,e){t.lang.components=e},setHover(t,e){t.has_touch||(t.showhover=!0,document.body.classList.add("mouseenter"),this.commit("setOnMouseMove",e))},setLang(t,e){switch(t.lang.locale=e,t.lang.locale){case"br":t.lang.loading.msg1="Carregando",t.lang.loading.msg2="Trazendo dados do servidor ... Aguarde um momento enquanto os Websockets estão trabalhando!";break}},setMarqueeAmount(t){let e=window.innerWidth,o=window.innerHeight;switch(window.outerWidth){case e>=2560:t.marqueeamount=Math.ceil(o/377);break;case e>=1280:t.marqueeamount=Math.ceil(o/144);break;case e>=768:t.marqueeamount=Math.ceil(o/89);break;default:t.marqueeamount=Math.ceil(o/144);break}},setModal(t,e){t.modalObject.transform=e.transform,t.modalObject.class=e.class,t.modalObject.open=e.open,t.modalObject.media=e.media},setOnMouseMove(t,e){t.page.left=e.pageX-60,t.page.top=e.pageY-60}},getters:{getClickOrTap:t=>t.clickortap,getHover:t=>t.showhover,getlang:t=>t.lang,getMarqueeAmount:t=>t.marqueeamount,getModal:t=>t.modalObject,getOnMouseMove:t=>t.page,getStorage:t=>t.storage,getSVG:t=>t.defaultSVG,getTouch:t=>t.has_touch},actions:{},modules:{}}),mt=o(888),gt=o(493),pt=o.n(gt),ht=o(503),ft=o(762),wt=o(423);const vt={apiKey:"AIzaSyDeDr3LDdc34IDBAQc-6BiUOeI32_Hd7HI",authDomain:"luiskr-com.firebaseapp.com",databaseURL:"https://luiskr-com.firebaseio.com",projectId:"luiskr-com",storageBucket:"luiskr-com.appspot.com",messagingSenderId:"967717102790",appId:"1:967717102790:web:eea19f216fd097a08163c7",measurementId:"G-B2CJGG5FS9"},kt=(0,ht.ZF)(vt),bt=((0,wt.yu)(kt,{provider:new wt.z9("6LcyiK0fAAAAANToWCva8yfKdcDzeEOp3FxQnHdP"),isTokenAutoRefreshEnabled:!0}),(0,ft.IH)(kt),(0,n.ri)(k));bt.config.globalProperties.$sharedData=window.globals,bt.use(mt.Z,{log:!1}).use(pt()).use(dt).use(ct).mount("#app")},425:function(t,e,o){o.d(e,{Z:function(){return D}});var n=o(252),a=o(577);const i={class:"contact"},s={id:"contact",class:"contact-title",ref:"contact"},r=["innerHTML"],l={key:1},c={key:0,class:"contact-social"},u=["href"],d={key:0,class:"contact-social-separator"},m={key:1,class:"contact-social"},g={lass:"contact-social-link"},p={key:2,class:"contact-other"},h={key:0,class:"contact-social-separator"},f={key:3,class:"contact-other"},w={class:"contact-other-link"};function v(t,e,o,v,k,b){const y=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)("footer",i,[(0,n._)("h2",s,[k.translations?((0,n.wg)(),(0,n.iD)("span",{key:0,innerHTML:k.translations.title},null,8,r)):((0,n.wg)(),(0,n.iD)("span",l,(0,a.zw)(k.loading.msg1),1))],512),k.translations?((0,n.wg)(),(0,n.iD)("div",c,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(k.translations.line1,((t,e)=>((0,n.wg)(),(0,n.iD)(n.HY,{key:e},[(0,n._)("a",{href:t.link,target:"_blank",class:"contact-social-link"},(0,a.zw)(t.description),9,u),e<k.translations.line1.length-1?((0,n.wg)(),(0,n.iD)("span",d,"•")):(0,n.kq)("",!0)],64)))),128))])):((0,n.wg)(),(0,n.iD)("div",m,[(0,n._)("span",g,(0,a.zw)(k.loading.msg2),1)])),k.translations?((0,n.wg)(),(0,n.iD)("div",p,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(k.translations.line2,((t,e)=>((0,n.wg)(),(0,n.iD)(n.HY,{key:e},[(0,n.Wm)(y,{class:"contact-other-link",to:t.link},{default:(0,n.w5)((()=>[(0,n.Uk)((0,a.zw)(t.description),1)])),_:2},1032,["to"]),e<k.translations.line2.length-1?((0,n.wg)(),(0,n.iD)("span",h,"•")):(0,n.kq)("",!0)],64)))),128))])):((0,n.wg)(),(0,n.iD)("div",f,[(0,n._)("span",w,(0,a.zw)(k.loading.msg3),1)]))])}var k={name:"Contact",data(){return{loading:this.$store.getters.getlang.loading,translations:!1}},watch:{"$store.state.lang.components":{immediate:!0,handler(){this.translations=this.$store.getters.getlang.components.contact}}}},b=o(744);const y=(0,b.Z)(k,[["render",v]]);var D=y},978:function(t,e,o){o.d(e,{Z:function(){return m}});var n=o(252),a=o(577);const i=["viewBox","alt"],s=["points"],r=["transform"];function l(t,e,o,l,c,u){return(0,n.wg)(),(0,n.iD)("svg",{class:(0,a.C_)(o.classes),viewBox:c.svg.viewBox,alt:c.loading.msg1,"aria-hidden":"true"},[(0,n._)("title",null,(0,a.zw)(c.loading.msg1),1),(0,n._)("g",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(c.svg.polygonPoints,((t,e)=>((0,n.wg)(),(0,n.iD)("polygon",{class:"load-svg-triangle-1",points:t,key:e},null,8,s)))),128)),o.renderText?((0,n.wg)(),(0,n.iD)("text",{key:0,class:"load-svg-text",transform:c.svg.textTransform},"<"+(0,a.zw)(c.loading.msg1)+"/>",9,r)):(0,n.kq)("",!0)])],10,i)}var c={name:"LoadSVG",data(){return{svg:this.$store.getters.getSVG,loading:this.$store.getters.getlang.loading}},props:{classes:{required:!0,type:String},renderText:{required:!1,default:!0}}},u=o(744);const d=(0,u.Z)(c,[["render",l]]);var m=d}},e={};function o(n){var a=e[n];if(void 0!==a)return a.exports;var i=e[n]={exports:{}};return t[n].call(i.exports,i,i.exports,o),i.exports}o.m=t,function(){var t=[];o.O=function(e,n,a,i){if(!n){var s=1/0;for(u=0;u<t.length;u++){n=t[u][0],a=t[u][1],i=t[u][2];for(var r=!0,l=0;l<n.length;l++)(!1&i||s>=i)&&Object.keys(o.O).every((function(t){return o.O[t](n[l])}))?n.splice(l--,1):(r=!1,i<s&&(s=i));if(r){t.splice(u--,1);var c=a();void 0!==c&&(e=c)}}return e}i=i||0;for(var u=t.length;u>0&&t[u-1][2]>i;u--)t[u]=t[u-1];t[u]=[n,a,i]}}(),function(){o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,{a:e}),e}}(),function(){o.d=function(t,e){for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})}}(),function(){o.f={},o.e=function(t){return Promise.all(Object.keys(o.f).reduce((function(e,n){return o.f[n](t,e),e}),[]))}}(),function(){o.u=function(t){return"js/"+{242:"project",245:"notfound",443:"about",871:"legal"}[t]+"."+{242:"830d2f85",245:"59d9aeda",443:"d3466bc6",871:"aeb9bf12"}[t]+".js"}}(),function(){o.miniCssF=function(t){return"css/"+{242:"project",245:"notfound",443:"about",871:"legal"}[t]+"."+{242:"fd07716f",245:"f0e6fc18",443:"33c4647f",871:"b2f023b5"}[t]+".css"}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={},e="luiskr.com:";o.l=function(n,a,i,s){if(t[n])t[n].push(a);else{var r,l;if(void 0!==i)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var d=c[u];if(d.getAttribute("src")==n||d.getAttribute("data-webpack")==e+i){r=d;break}}r||(l=!0,r=document.createElement("script"),r.charset="utf-8",r.timeout=120,o.nc&&r.setAttribute("nonce",o.nc),r.setAttribute("data-webpack",e+i),r.src=n),t[n]=[a];var m=function(e,o){r.onerror=r.onload=null,clearTimeout(g);var a=t[n];if(delete t[n],r.parentNode&&r.parentNode.removeChild(r),a&&a.forEach((function(t){return t(o)})),e)return e(o)},g=setTimeout(m.bind(null,void 0,{type:"timeout",target:r}),12e4);r.onerror=m.bind(null,r.onerror),r.onload=m.bind(null,r.onload),l&&document.head.appendChild(r)}}}(),function(){o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){o.p="/"}(),function(){var t=function(t,e,o,n){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var i=function(i){if(a.onerror=a.onload=null,"load"===i.type)o();else{var s=i&&("load"===i.type?"missing":i.type),r=i&&i.target&&i.target.href||e,l=new Error("Loading CSS chunk "+t+" failed.\n("+r+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=s,l.request=r,a.parentNode.removeChild(a),n(l)}};return a.onerror=a.onload=i,a.href=e,document.head.appendChild(a),a},e=function(t,e){for(var o=document.getElementsByTagName("link"),n=0;n<o.length;n++){var a=o[n],i=a.getAttribute("data-href")||a.getAttribute("href");if("stylesheet"===a.rel&&(i===t||i===e))return a}var s=document.getElementsByTagName("style");for(n=0;n<s.length;n++){a=s[n],i=a.getAttribute("data-href");if(i===t||i===e)return a}},n=function(n){return new Promise((function(a,i){var s=o.miniCssF(n),r=o.p+s;if(e(s,r))return a();t(n,r,a,i)}))},a={143:0};o.f.miniCss=function(t,e){var o={242:1,245:1,443:1,871:1};a[t]?e.push(a[t]):0!==a[t]&&o[t]&&e.push(a[t]=n(t).then((function(){a[t]=0}),(function(e){throw delete a[t],e})))}}(),function(){var t={143:0};o.f.j=function(e,n){var a=o.o(t,e)?t[e]:void 0;if(0!==a)if(a)n.push(a[2]);else{var i=new Promise((function(o,n){a=t[e]=[o,n]}));n.push(a[2]=i);var s=o.p+o.u(e),r=new Error,l=function(n){if(o.o(t,e)&&(a=t[e],0!==a&&(t[e]=void 0),a)){var i=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.src;r.message="Loading chunk "+e+" failed.\n("+i+": "+s+")",r.name="ChunkLoadError",r.type=i,r.request=s,a[1](r)}};o.l(s,l,"chunk-"+e,e)}},o.O.j=function(e){return 0===t[e]};var e=function(e,n){var a,i,s=n[0],r=n[1],l=n[2],c=0;if(s.some((function(e){return 0!==t[e]}))){for(a in r)o.o(r,a)&&(o.m[a]=r[a]);if(l)var u=l(o)}for(e&&e(n);c<s.length;c++)i=s[c],o.o(t,i)&&t[i]&&t[i][0](),t[i]=0;return o.O(u)},n=self["webpackChunkluiskr_com"]=self["webpackChunkluiskr_com"]||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))}();var n=o.O(void 0,[998],(function(){return o(627)}));n=o.O(n)})();
//# sourceMappingURL=app.15e9cd10.js.map