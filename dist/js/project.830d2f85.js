"use strict";(self["webpackChunkluiskr_com"]=self["webpackChunkluiskr_com"]||[]).push([[242],{696:function(e,t,a){a.r(t),a.d(t,{default:function(){return ve}});var s=a(252),i=a(577),l=a(963);const o={class:"internal-title"},n=["innerHTML"],r={key:"ttl2"},d={class:"internal-main"},c={key:"section-data"},h={key:0,class:"internal-description"},g=["innerHTML"],p=["innerHTML"],u={key:1,class:"internal-extra"},m={class:"internal-extra-scroll"},w={key:"load-data"},y={class:"internal-description"},v={class:"internal-description-text"},k={class:"internal-extra"},f={class:"internal-extra-scroll"},x={key:0,id:"#modal",class:"modal-above"};function b(e,t,a,b,D,_){const M=(0,s.up)("Media"),$=(0,s.up)("LoadSVG"),H=(0,s.up)("Related"),q=(0,s.up)("MediaExpanded");return(0,s.wg)(),(0,s.iD)("article",null,[(0,s._)("div",{id:"main",class:"project modal-below",style:(0,i.j5)("transform: translateY(-"+D.modal.transform+"px);")},[(0,s._)("h2",o,[D.translations?((0,s.wg)(),(0,s.iD)("span",{innerHTML:D.translations.title,key:"ttl1"},null,8,n)):((0,s.wg)(),(0,s.iD)("span",r,(0,i.zw)(D.loading.msg1),1))]),(0,s._)("div",d,[D.translations?((0,s.wg)(),(0,s.j4)(M,{classes:"internal-main-item",src:D.translations.folder+D.translations.cover.src,width:D.translations.cover.size[0],height:D.translations.cover.size[1],isVideo:D.translations.cover?.isVideo??!1,autoPlay:!0,label:D.translations.cover.label,key:this.$store.getters.getlang.locale+this.$route.meta.translation},null,8,["src","width","height","isVideo","label"])):((0,s.wg)(),(0,s.j4)($,{classes:"load-svg internal-main-item",renderText:!1,key:"loadSVG1"}))]),(0,s.Wm)(l.uT,{name:"fade"},{default:(0,s.w5)((()=>[D.translations?.sections?((0,s.wg)(),(0,s.iD)("div",c,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(D.translations.sections.length,(e=>((0,s.wg)(),(0,s.iD)("section",{key:e},[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(D.translations.sections[e-1],((e,t)=>((0,s.wg)(),(0,s.iD)(s.HY,{key:t},["string"===typeof e[0]?((0,s.wg)(),(0,s.iD)("div",h,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e,((e,a)=>((0,s.wg)(),(0,s.iD)(s.HY,{key:a},[0===t&&a<1?((0,s.wg)(),(0,s.iD)("h3",{key:0,class:"internal-description-text",innerHTML:e},null,8,g)):((0,s.wg)(),(0,s.iD)("p",{key:1,class:"internal-description-text",innerHTML:e},null,8,p))],64)))),128))])):((0,s.wg)(),(0,s.iD)("div",u,[(0,s._)("div",m,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e,((e,t)=>((0,s.wg)(),(0,s.iD)("div",{key:t,class:(0,i.C_)("internal-extra-item "+(e?.class??""))},[(0,s.Wm)(M,{src:D.translations.folder+e.src,width:e.size[0],height:e.size[1],canExpand:e?.canExpand??!1,isVideo:e?.isVideo??!1,label:e.label},null,8,["src","width","height","canExpand","isVideo","label"])],2)))),128))])]))],64)))),128))])))),128))])):((0,s.wg)(),(0,s.iD)("div",w,[(0,s._)("div",y,[(0,s._)("p",v,(0,i.zw)(D.loading.msg3),1)]),(0,s._)("div",k,[(0,s._)("div",f,[((0,s.wg)(),(0,s.iD)(s.HY,null,(0,s.Ko)(5,(e=>(0,s._)("div",{class:"internal-extra-item",key:e},[(0,s._)("figure",null,[(0,s.Wm)($,{classes:"load-svg render-media "+(e%2===0?"flip":""),renderText:!1},null,8,["classes"])])]))),64))])])]))])),_:1}),(0,s.Wm)(H)],4),D.modal.open?((0,s.wg)(),(0,s.iD)("div",x,[(0,s.Wm)(q,{source:D.modal.media.source,thumb:D.modal.media.thumb,alt:D.modal.media.alt,width:D.modal.media.width,height:D.modal.media.height,autoPlay:!0,isVideo:D.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):(0,s.kq)("",!0)])}var D=a(663);const _=["title"],M=["src","width","height"],$=["width","height","alt","src"],H=["poster","width","height","alt"],q=["src"],T=["poster","width","height","alt"],V=["src"],z=["aria-hidden"];function C(e,t,a,l,o,n){const r=(0,s.Q2)("lazy");return(0,s.wg)(),(0,s.iD)("figure",{class:(0,i.C_)(a.canExpand?"internal-expand":""),onClick:t[5]||(t[5]=e=>a.canExpand?n.openModal:void 0),style:(0,i.j5)(o.styles),title:a.label},[(0,s._)("img",{class:"render-placeholder",src:n.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,M),a.isVideo?a.autoPlay?((0,s.wg)(),(0,s.iD)("video",{key:1,class:(0,i.C_)("render-media "+a.classes),poster:o.poster[0],width:a.width,height:a.height,alt:a.label,playsinline:"",loop:"",muted:"",autoplay:""},[(0,s._)("source",{src:o.video[1],type:"video/mp4"},null,8,q)],10,H)):((0,s.wg)(),(0,s.iD)("video",{key:2,class:(0,i.C_)("render-media "+a.classes),poster:o.poster[0],width:a.width,height:a.height,alt:a.label,playsinline:"",loop:"",muted:"",onMousedown:t[0]||(t[0]=e=>n.play(e)),onMouseover:t[1]||(t[1]=e=>n.play(e)),onMouseenter:t[2]||(t[2]=e=>n.play(e)),onMouseout:t[3]||(t[3]=e=>n.pause(e)),onMouseleave:t[4]||(t[4]=e=>n.pause(e))},[(0,s._)("source",{src:o.video[1],type:"video/mp4"},null,8,V)],42,T)):(0,s.wy)(((0,s.wg)(),(0,s.iD)("img",{key:0,class:(0,i.C_)("render-media "+a.classes),width:a.width,height:a.height,alt:a.label,src:o.storage+a.src+o.q100},null,10,$)),[[r,{src:o.storage+a.src+o.q50,loading:o.storage+a.src+o.thumb}]]),a.canExpand?((0,s.wg)(),(0,s.iD)(s.HY,{key:3},(0,s.Ko)(2,((e=1)=>(0,s._)("button",{class:(0,i.C_)("expand-modal-open-"+e),key:e,"aria-hidden":2===e,"data-no-snippet":""},(0,i.zw)(o.action)+" "+(0,i.zw)(o.translations.toOpen),11,z))),64)):(0,s.kq)("",!0)],14,_)}const E="-mozjpg",j=".jpg",Y=".mp4.jpg-thumb.jpg",S=".mp4-scaledown-2x",L=".mp4";var K={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:E+"3-MSSIM-tuned-kodak"+j,q50:E+"-50"+j,q100:E+"-uncompressed"+j,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap,translations:this.$store.getters.getlang.components.media}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1},autoPlay:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let e=this.storage+this.src;this.poster[0]=e+Y,this.poster[1]=e+S+Y,this.video[0]=e+L,this.video[1]=e+S+L}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(e,t){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}"%3E%3C/svg%3E`},openModal(){let e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)},play(e){let t;t=e.target,t.play()},pause(e){let t;t=e.target,t.pause()}}},R=a(744);const P=(0,R.Z)(K,[["render",C]]);var B=P;const N={class:"expand-modal-content"},W={class:"expand-modal-close-bar"},Z={class:"expand-modal-media-figure"},O=["src","width","height"],A=["width","height","alt","src"],G=["width","height","poster","alt"],U=["src"];function Q(e,t,a,l,o,n){const r=(0,s.Q2)("lazy");return(0,s.wg)(),(0,s.iD)("div",N,[(0,s._)("div",W,[(0,s._)("button",{class:"expand-modal-close-bar-button",onClick:t[0]||(t[0]=(...e)=>n.closeModal&&n.closeModal(...e))},(0,i.zw)(o.translations.close),1)]),(0,s._)("div",{class:"expand-modal-close-area",onClick:t[1]||(t[1]=(...e)=>n.closeModal&&n.closeModal(...e))}),(0,s._)("figure",Z,[(0,s._)("img",{class:"expand-modal-media-placeholder",src:n.placeholder(a.width,a.height),width:a.width,height:a.height,"aria-hidden":"true",tabindex:"-1","data-nosnippet":""},null,8,O),a.isVideo?((0,s.wg)(),(0,s.iD)("video",{key:1,class:"expand-modal-media-item",width:a.width,height:a.height,poster:a.thumb,alt:a.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[(0,s._)("source",{src:a.source,type:"video/mp4"},null,8,U)],8,G)):(0,s.wy)(((0,s.wg)(),(0,s.iD)("img",{key:0,class:"expand-modal-media-item",width:a.width,height:a.height,alt:a.alt,src:a.source},null,8,A)),[[r,{src:a.source,loading:a.thumb}]]),(0,s._)("button",{class:"expand-modal-close-bottom",onClick:t[2]||(t[2]=(...e)=>n.closeModal&&n.closeModal(...e))},(0,i.zw)(o.translations.close),1)])])}var F={name:"MediaExpanded",data(){return{translations:this.$store.getters.getlang.components.media}},props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(e,t){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}" %3E%3C/svg%3E`},closeModal(){let e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame((()=>{window.scrollTo(0,e)}))}}};const I=(0,R.Z)(F,[["render",Q]]);var J=I,X=a(978);const ee={class:"internal-footer"},te={class:"internal-footer-title"},ae=["innerHTML"],se={key:"ttl2"},ie={class:"internal-footer-related"},le={key:0,class:"internal-footer-items"},oe=["href"],ne={key:0,class:"internal-footer-items-separator"},re=["innerHTML"],de={key:1,class:"internal-footer-items","data-nosnippet":""},ce={class:"internal-footer-items-link"},he={class:"internal-footer-items-note"};function ge(e,t,a,l,o,n){const r=(0,s.up)("router-link");return(0,s.wg)(),(0,s.iD)("footer",ee,[(0,s._)("h2",te,[o.translations?.title?((0,s.wg)(),(0,s.iD)("span",{innerHTML:o.translations.title,key:"ttl1"},null,8,ae)):((0,s.wg)(),(0,s.iD)("span",se,(0,i.zw)(o.loading.msg1),1))]),(0,s._)("div",ie,[o.translations?.projects?((0,s.wg)(!0),(0,s.iD)(s.HY,{key:0},(0,s.Ko)(o.translations.projects,((e,t)=>((0,s.wg)(),(0,s.j4)(r,{class:"internal-footer-related-link",to:o.translations.path+e.link,key:t},{default:(0,s.w5)((()=>[(0,s.Uk)((0,i.zw)(e.page),1)])),_:2},1032,["to"])))),128)):((0,s.wg)(),(0,s.iD)(s.HY,{key:1},(0,s.Ko)(12,(e=>(0,s._)("span",{class:"internal-footer-related-link",key:e,"data-nosnippet":""},(0,i.zw)(o.loading.msg2),1))),64))]),o.translations?.socials?((0,s.wg)(),(0,s.iD)("div",le,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(o.translations.socials,((e,t)=>((0,s.wg)(),(0,s.iD)(s.HY,{key:t},[(0,s._)("a",{href:e.link,target:"_blank",class:"internal-footer-items-link"},(0,i.zw)(e.network),9,oe),t<o.translations.socials.length-1?((0,s.wg)(),(0,s.iD)("span",ne,"•")):(0,s.kq)("",!0)],64)))),128)),(0,s._)("p",{class:"internal-footer-items-note",innerHTML:o.translations.note},null,8,re)])):((0,s.wg)(),(0,s.iD)("div",de,[(0,s._)("span",ce,(0,i.zw)(o.loading.msg2),1),(0,s._)("p",he,(0,i.zw)(o.loading.msg3),1)]))])}var pe={name:"Related",data(){return{loading:this.$store.getters.getlang.loading,translations:{}}},watch:{"$store.state.lang.components":{immediate:!0,handler(){this.translations=this.$store.getters.getlang.components.related}}}};const ue=(0,R.Z)(pe,[["render",ge]]);var me=ue,we={data(){return{loading:this.$store.getters.getlang.loading,modal:this.$store.getters.getModal,translations:!1}},components:{Media:B,MediaExpanded:J,Related:me,LoadSVG:X.Z},name:"Render Project",created(){this.loadData()},mounted(){setTimeout((()=>{window.scrollTo(0,0)}),500)},watch:{$route(e){const t=1e3;e.meta?.projectRoute&&(this.$smoothScroll({duration:t,updateHistory:!1,scrollTo:0}),this.loadData(t))}},methods:{loadData(e=!1){let t=this.$store.getters.getlang;document.title=this.$route.meta.title,this.translations=!1,(0,D.U2)((0,D.iU)((0,D.iH)((0,D.N8)()),t.database+t.locale+t.projectPath+this.$route.meta.translation)).then((t=>{t.exists()?e?setTimeout((()=>{this.translations=t.val()}),e):this.translations=t.val():console.log("%cERROR: could't find PROJECT DATA",this.$sharedData.styles.info)})).catch((e=>{console.error(e)}))}}};const ye=(0,R.Z)(we,[["render",b]]);var ve=ye}}]);
//# sourceMappingURL=project.830d2f85.js.map