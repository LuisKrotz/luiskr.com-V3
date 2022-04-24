"use strict";(self["webpackChunkluiskr_com"]=self["webpackChunkluiskr_com"]||[]).push([[654],{950:function(e,a,t){t.d(a,{Z:function(){return W}});var i=t(252),o=t(577);const r=["title"],s=["src","width","height"],l=["width","height","alt","src"],n=["poster","width","height","alt"],d=["src"],c=["aria-hidden"],m=["title"],h=["src","width","height"],u=["width","height","alt"],p=["poster","width","height","alt"],g=["src"];function w(e,a,t,w,b,f){const v=(0,i.Q2)("lazy");return t.canExpand?((0,i.wg)(),(0,i.iD)("figure",{key:0,class:"internal-expand",onClick:a[0]||(a[0]=(...e)=>f.openModal&&f.openModal(...e)),style:(0,o.j5)(b.styles),title:t.label},[(0,i._)("img",{class:"render-placeholder",src:f.placeholder(t.width,t.height),width:t.width,height:t.height,alt:" "},null,8,s),t.isVideo?((0,i.wg)(),(0,i.iD)("video",{key:1,class:(0,o.C_)("render-media "+t.classes),poster:b.poster[0],width:t.width,height:t.height,alt:t.label,playsinline:"",autoplay:"",loop:"",muted:""},[(0,i._)("source",{src:b.video[1],type:"video/mp4"},null,8,d)],10,n)):(0,i.wy)(((0,i.wg)(),(0,i.iD)("img",{key:0,class:(0,o.C_)("render-media "+t.classes),width:t.width,height:t.height,alt:t.label,src:b.storage+t.src+b.q100},null,10,l)),[[v,{src:b.storage+t.src+b.q50,loading:b.storage+t.src+b.thumb}]]),((0,i.wg)(),(0,i.iD)(i.HY,null,(0,i.Ko)(2,((e=1)=>(0,i._)("button",{class:(0,o.C_)("expand-modal-open-"+e),key:e,"aria-hidden":2===e,"data-no-snippet":""},(0,o.zw)(b.action)+" to open",11,c))),64))],12,r)):((0,i.wg)(),(0,i.iD)("figure",{key:1,style:(0,o.j5)(b.styles),title:t.label},[(0,i._)("img",{class:"render-placeholder",src:f.placeholder(t.width,t.height),width:t.width,height:t.height,alt:" "},null,8,h),t.isVideo?((0,i.wg)(),(0,i.iD)("video",{key:1,class:(0,o.C_)("render-media "+t.classes),poster:b.poster[0],width:t.width,height:t.height,alt:t.label,playsinline:"",autoplay:"",loop:"",muted:""},[(0,i._)("source",{src:b.video[0],type:"video/mp4"},null,8,g)],10,p)):(0,i.wy)(((0,i.wg)(),(0,i.iD)("img",{key:0,class:(0,o.C_)("render-media "+t.classes),width:t.width,height:t.height,alt:t.label},null,10,u)),[[v,{src:b.storage+t.src+b.q50,loading:b.storage+t.src+b.thumb}]])],12,m))}const b="-mozjpg",f=".jpg",v=".mp4.jpg-thumb.jpg",k=".mp4-scaledown-2x",_=".mp4";var x={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:b+"3-MSSIM-tuned-kodak"+f,q50:b+"-50"+f,q100:b+"-uncompressed"+f,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let e=this.storage+this.src;this.poster[0]=e+v,this.poster[1]=e+k+v,this.video[0]=e+_,this.video[1]=e+k+_}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(e,a){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${a}"%3E%3C/svg%3E`},openModal(){let e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}},y=t(744);const M=(0,y.Z)(x,[["render",w]]);var W=M},828:function(e,a,t){t.d(a,{Z:function(){return g}});var i=t(252);const o={class:"expand-modal-content"},r={class:"expand-modal-close-bar"},s={class:"expand-modal-media-figure"},l=["src","width","height"],n=["width","height","alt","src"],d=["width","height","poster","alt"],c=["src"];function m(e,a,t,m,h,u){const p=(0,i.Q2)("lazy");return(0,i.wg)(),(0,i.iD)("div",o,[(0,i._)("div",r,[(0,i._)("button",{class:"expand-modal-close-bar-button",onClick:a[0]||(a[0]=(...e)=>u.closeModal&&u.closeModal(...e))},"[ close ]")]),(0,i._)("div",{class:"expand-modal-close-area",onClick:a[1]||(a[1]=(...e)=>u.closeModal&&u.closeModal(...e))}),(0,i._)("figure",s,[(0,i._)("img",{class:"expand-modal-media-placeholder",src:u.placeholder(t.width,t.height),width:t.width,height:t.height,"aria-hidden":"true",tabindex:"-1","data-nosnippet":""},null,8,l),t.isVideo?((0,i.wg)(),(0,i.iD)("video",{key:1,class:"expand-modal-media-item",width:t.width,height:t.height,poster:t.thumb,alt:t.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[(0,i._)("source",{src:t.source,type:"video/mp4"},null,8,c)],8,d)):(0,i.wy)(((0,i.wg)(),(0,i.iD)("img",{key:0,class:"expand-modal-media-item",width:t.width,height:t.height,alt:t.alt,src:t.source},null,8,n)),[[p,{src:t.source,loading:t.thumb}]]),(0,i._)("button",{class:"expand-modal-close-bottom",onClick:a[2]||(a[2]=(...e)=>u.closeModal&&u.closeModal(...e))},"[ close ]")])])}var h={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(e,a){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${a}" width="${e}" height="${a}" %3E%3C/svg%3E`},closeModal(){let e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame((()=>{window.scrollTo(0,e)}))}}},u=t(744);const p=(0,u.Z)(h,[["render",m]]);var g=p},736:function(e,a,t){t.d(a,{Z:function(){return M}});var i=t(252);const o={class:"internal-footer"},r=(0,i._)("h2",{class:"internal-footer-title"},"Related",-1),s={class:"internal-footer-related"},l=(0,i.Uk)("Metcha"),n=(0,i.Uk)("Transa"),d=(0,i.Uk)("Brazilian Leather"),c=(0,i.Uk)("Mor"),m=(0,i.Uk)("Coza"),h=(0,i.Uk)("Melissa"),u=(0,i.Uk)("Minimelissa"),p=(0,i.Uk)("Marco Almeida"),g=(0,i.Uk)("Nathalia Bond"),w=(0,i.Uk)("Cecerelê"),b=(0,i.Uk)("Vibra"),f=(0,i.Uk)("Genesysinf"),v=(0,i.uE)('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz/?locale=en_US">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a><p class="internal-footer-items-note">All media on this domain was taken by screenshots from public URLs and/or local development data.<br>The current website or origin of the media may have changed or may change in the future.</p></div>',1);function k(e,a,t,k,_,x){const y=(0,i.up)("router-link");return(0,i.wg)(),(0,i.iD)("footer",o,[r,(0,i._)("div",s,[(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:(0,i.w5)((()=>[l])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:(0,i.w5)((()=>[n])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:(0,i.w5)((()=>[d])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:(0,i.w5)((()=>[c])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:(0,i.w5)((()=>[m])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:(0,i.w5)((()=>[h])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:(0,i.w5)((()=>[u])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:(0,i.w5)((()=>[p])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/clinica-de-desenvolvimento-nathalia-bond"},{default:(0,i.w5)((()=>[g])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/cecerele"},{default:(0,i.w5)((()=>[w])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:(0,i.w5)((()=>[b])),_:1}),(0,i.Wm)(y,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:(0,i.w5)((()=>[f])),_:1})]),v])}var _={name:"Related",data(){return{modal:this.$store.getters.getModal}}},x=t(744);const y=(0,x.Z)(_,[["render",k]]);var M=y},390:function(e,a,t){t.r(a),t.d(a,{default:function(){return j}});var i=t(252),o=t(577);const r=(0,i._)("h2",{class:"internal-title"},"Marco Almeida",-1),s={class:"internal-main"},l=(0,i.uE)('<div class="internal-description"><h3 class="internal-description-text"><a href="https://aboutmarco.com?utm_source=luiskr.com" target="_blank">Marco&#39;s Portfolio</a> was developed as a Freelancing project in 2021. </h3><p class="internal-description-text"> It uses Vue.JS and Sass. </p><p class="internal-description-text"> All animations are created in CSS. </p><p class="internal-description-text"> The main goal was to create a pixel-perfect project, with smooth animations and a pixel perfect UI. </p><p class="internal-description-text"> I also did the server setup at Digital Ocean. </p></div>',1),n={class:"internal-extra"},d={class:"internal-extra-scroll"},c={class:"internal-extra-item"},m={class:"internal-extra-item"},h={class:"internal-extra-item"},u={class:"internal-extra-item"},p={class:"internal-extra-item"},g={class:"internal-extra-item"},w={class:"internal-extra-item"},b={class:"internal-extra-item"},f=(0,i._)("div",{class:"internal-description"},[(0,i._)("h3",{class:"internal-description-text"},[(0,i.Uk)(" Check below for some of the awards received by "),(0,i._)("a",{href:"https://aboutmarco.com?utm_source=luiskr.com",target:"_blank"},"Marco's portfolio"),(0,i.Uk)(". ")])],-1),v={class:"internal-extra"},k={class:"internal-extra-scroll"},_={class:"internal-extra-item landscape"},x={class:"internal-extra-item landscape"},y={class:"internal-extra-item landscape"},M={class:"internal-extra-item landscape"},W={class:"internal-extra-item landscape"},q={class:"internal-extra-item landscape"},C={key:0,id:"#modal",class:"modal-above"};function E(e,a,t,E,V,U){const z=(0,i.up)("Media"),D=(0,i.up)("Related"),S=(0,i.up)("MediaExpanded");return(0,i.wg)(),(0,i.iD)("article",null,[(0,i._)("div",{id:"#main",class:"project modal-below",style:(0,o.j5)("transform: translateY(-"+V.modal.transform+"px);")},[r,(0,i._)("div",s,[(0,i.Wm)(z,{classes:"internal-main-item",src:"aboutmarco/home/aboutmarco.com-2020-full-page-home-tour",width:1462,height:784,isVideo:!0,label:"aboutmarco.com - homepage full tour"})]),(0,i._)("section",null,[l,(0,i._)("div",n,[(0,i._)("div",d,[(0,i._)("div",c,[(0,i.Wm)(z,{src:"aboutmarco/home/aboutmarco.com-mobile-mobile",width:830,height:1712,canExpand:!0,isVideo:!0,label:"aboutmarco.com - mobile tour"})]),(0,i._)("div",m,[(0,i.Wm)(z,{src:"aboutmarco/home/aboutmarco.com-2020-home",width:1920,height:3003,canExpand:!0,label:"aboutmarco.com - homepage"})]),(0,i._)("div",h,[(0,i.Wm)(z,{src:"aboutmarco/pages/aboutmarco.com-pages--melissa-insider-2020-12-15",width:1920,height:10094,canExpand:!0,label:"aboutmarco.com - melissa insider"})]),(0,i._)("div",u,[(0,i.Wm)(z,{src:"aboutmarco/pages/aboutmarco.com-pages--melissa-2020-12-15",width:1920,height:10229,canExpand:!0,label:"aboutmarco.com - melissa"})]),(0,i._)("div",p,[(0,i.Wm)(z,{src:"aboutmarco/pages/aboutmarco.com-pages--coza-2020-12-15",width:1920,height:26871,canExpand:!0,label:"aboutmarco.com - coza"})]),(0,i._)("div",g,[(0,i.Wm)(z,{src:"aboutmarco/pages/aboutmarco.com-pages--brazilian-leather-2020-12-15",width:1920,height:16075,canExpand:!0,label:"aboutmarco.com - brazilian leather"})]),(0,i._)("div",w,[(0,i.Wm)(z,{src:"aboutmarco/about/aboutmarco.com-me-2020-12-15-23_29_35",width:1920,height:7137,canExpand:!0,label:"aboutmarco.com - me"})]),(0,i._)("div",b,[(0,i.Wm)(z,{src:"aboutmarco/about/aboutmarco.com-archive-2020-12-15-23_31_53",width:1920,height:3788,canExpand:!0,label:"aboutmarco.com - archive"})])])])]),(0,i._)("section",null,[f,(0,i._)("div",v,[(0,i._)("div",k,[(0,i._)("div",_,[(0,i.Wm)(z,{src:"aboutmarco/awards/aboutmarco.com-awards--admiretheweb",width:1440,height:820,label:"aboutmarco.com - admiretheweb"})]),(0,i._)("div",x,[(0,i.Wm)(z,{src:"aboutmarco/awards/aboutmarco.com-awards--cssawards",width:1440,height:740,label:"aboutmarco.com - css awards"})]),(0,i._)("div",y,[(0,i.Wm)(z,{src:"aboutmarco/awards/aboutmarco.com-awards--csswinner",width:1440,height:652,label:"aboutmarco.com - css awards winner"})]),(0,i._)("div",M,[(0,i.Wm)(z,{src:"aboutmarco/awards/aboutmarco.com-awards--hm",width:920,height:654,label:"aboutmarco.com - Honorable Mention"})]),(0,i._)("div",W,[(0,i.Wm)(z,{src:"aboutmarco/awards/aboutmarco.com-awards--me",width:1440,height:652,label:"aboutmarco.com - ME"})]),(0,i._)("div",q,[(0,i.Wm)(z,{src:"aboutmarco/awards/aboutmarco.com-awards--mindspark",width:677,height:722,label:"aboutmarco.com - mindspark"})])])])]),(0,i.Wm)(D)],4),V.modal.open?((0,i.wg)(),(0,i.iD)("div",C,[(0,i.Wm)(S,{source:V.modal.media.source,thumb:V.modal.media.thumb,alt:V.modal.media.alt,width:V.modal.media.width,height:V.modal.media.height,isVideo:V.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):(0,i.kq)("",!0)])}var V=t(950),U=t(828),z=t(736),D={data(){return{modal:this.$store.getters.getModal}},created(){document.title=this.$route.meta.title},mounted(){setTimeout((()=>{window.scrollTo(0,0)}),500)},components:{Media:V.Z,MediaExpanded:U.Z,Related:z.Z},name:"Marco Almeida"},S=t(744);const $=(0,S.Z)(D,[["render",E]]);var j=$}}]);
//# sourceMappingURL=aboutmarco.e3bd2240.js.map