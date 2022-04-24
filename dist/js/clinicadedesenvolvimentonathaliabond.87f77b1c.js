"use strict";(self["webpackChunkluiskr_com"]=self["webpackChunkluiskr_com"]||[]).push([[717],{950:function(a,e,i){i.d(e,{Z:function(){return B}});var t=i(252),n=i(577);const l=["title"],o=["src","width","height"],s=["width","height","alt","src"],d=["poster","width","height","alt"],r=["src"],c=["aria-hidden"],h=["title"],p=["src","width","height"],m=["width","height","alt"],g=["poster","width","height","alt"],b=["src"];function u(a,e,i,u,v,w){const k=(0,t.Q2)("lazy");return i.canExpand?((0,t.wg)(),(0,t.iD)("figure",{key:0,class:"internal-expand",onClick:e[0]||(e[0]=(...a)=>w.openModal&&w.openModal(...a)),style:(0,n.j5)(v.styles),title:i.label},[(0,t._)("img",{class:"render-placeholder",src:w.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,o),i.isVideo?((0,t.wg)(),(0,t.iD)("video",{key:1,class:(0,n.C_)("render-media "+i.classes),poster:v.poster[0],width:i.width,height:i.height,alt:i.label,playsinline:"",autoplay:"",loop:"",muted:""},[(0,t._)("source",{src:v.video[1],type:"video/mp4"},null,8,r)],10,d)):(0,t.wy)(((0,t.wg)(),(0,t.iD)("img",{key:0,class:(0,n.C_)("render-media "+i.classes),width:i.width,height:i.height,alt:i.label,src:v.storage+i.src+v.q100},null,10,s)),[[k,{src:v.storage+i.src+v.q50,loading:v.storage+i.src+v.thumb}]]),((0,t.wg)(),(0,t.iD)(t.HY,null,(0,t.Ko)(2,((a=1)=>(0,t._)("button",{class:(0,n.C_)("expand-modal-open-"+a),key:a,"aria-hidden":2===a,"data-no-snippet":""},(0,n.zw)(v.action)+" to open",11,c))),64))],12,l)):((0,t.wg)(),(0,t.iD)("figure",{key:1,style:(0,n.j5)(v.styles),title:i.label},[(0,t._)("img",{class:"render-placeholder",src:w.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,p),i.isVideo?((0,t.wg)(),(0,t.iD)("video",{key:1,class:(0,n.C_)("render-media "+i.classes),poster:v.poster[0],width:i.width,height:i.height,alt:i.label,playsinline:"",autoplay:"",loop:"",muted:""},[(0,t._)("source",{src:v.video[0],type:"video/mp4"},null,8,b)],10,g)):(0,t.wy)(((0,t.wg)(),(0,t.iD)("img",{key:0,class:(0,n.C_)("render-media "+i.classes),width:i.width,height:i.height,alt:i.label},null,10,m)),[[k,{src:v.storage+i.src+v.q50,loading:v.storage+i.src+v.thumb}]])],12,h))}const v="-mozjpg",w=".jpg",k=".mp4.jpg-thumb.jpg",x=".mp4-scaledown-2x",f=".mp4";var _={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:v+"3-MSSIM-tuned-kodak"+w,q50:v+"-50"+w,q100:v+"-uncompressed"+w,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let a=this.storage+this.src;this.poster[0]=a+k,this.poster[1]=a+x+k,this.video[0]=a+f,this.video[1]=a+x+f}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(a,e){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${a} ${e}"%3E%3C/svg%3E`},openModal(){let a=window.scrollY;this.$store.commit("setModal",{transform:a,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}},N=i(744);const E=(0,N.Z)(_,[["render",u]]);var B=E},828:function(a,e,i){i.d(e,{Z:function(){return b}});var t=i(252);const n={class:"expand-modal-content"},l={class:"expand-modal-close-bar"},o={class:"expand-modal-media-figure"},s=["src","width","height"],d=["width","height","alt","src"],r=["width","height","poster","alt"],c=["src"];function h(a,e,i,h,p,m){const g=(0,t.Q2)("lazy");return(0,t.wg)(),(0,t.iD)("div",n,[(0,t._)("div",l,[(0,t._)("button",{class:"expand-modal-close-bar-button",onClick:e[0]||(e[0]=(...a)=>m.closeModal&&m.closeModal(...a))},"[ close ]")]),(0,t._)("div",{class:"expand-modal-close-area",onClick:e[1]||(e[1]=(...a)=>m.closeModal&&m.closeModal(...a))}),(0,t._)("figure",o,[(0,t._)("img",{class:"expand-modal-media-placeholder",src:m.placeholder(i.width,i.height),width:i.width,height:i.height,"aria-hidden":"true",tabindex:"-1","data-nosnippet":""},null,8,s),i.isVideo?((0,t.wg)(),(0,t.iD)("video",{key:1,class:"expand-modal-media-item",width:i.width,height:i.height,poster:i.thumb,alt:i.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[(0,t._)("source",{src:i.source,type:"video/mp4"},null,8,c)],8,r)):(0,t.wy)(((0,t.wg)(),(0,t.iD)("img",{key:0,class:"expand-modal-media-item",width:i.width,height:i.height,alt:i.alt,src:i.source},null,8,d)),[[g,{src:i.source,loading:i.thumb}]]),(0,t._)("button",{class:"expand-modal-close-bottom",onClick:e[2]||(e[2]=(...a)=>m.closeModal&&m.closeModal(...a))},"[ close ]")])])}var p={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(a,e){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${a} ${e}" width="${a}" height="${e}" %3E%3C/svg%3E`},closeModal(){let a=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame((()=>{window.scrollTo(0,a)}))}}},m=i(744);const g=(0,m.Z)(p,[["render",h]]);var b=g},736:function(a,e,i){i.d(e,{Z:function(){return E}});var t=i(252);const n={class:"internal-footer"},l=(0,t._)("h2",{class:"internal-footer-title"},"Related",-1),o={class:"internal-footer-related"},s=(0,t.Uk)("Metcha"),d=(0,t.Uk)("Transa"),r=(0,t.Uk)("Brazilian Leather"),c=(0,t.Uk)("Mor"),h=(0,t.Uk)("Coza"),p=(0,t.Uk)("Melissa"),m=(0,t.Uk)("Minimelissa"),g=(0,t.Uk)("Marco Almeida"),b=(0,t.Uk)("Nathalia Bond"),u=(0,t.Uk)("Cecerelê"),v=(0,t.Uk)("Vibra"),w=(0,t.Uk)("Genesysinf"),k=(0,t.uE)('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz/?locale=en_US">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a><p class="internal-footer-items-note">All media on this domain was taken by screenshots from public URLs and/or local development data.<br>The current website or origin of the media may have changed or may change in the future.</p></div>',1);function x(a,e,i,x,f,_){const N=(0,t.up)("router-link");return(0,t.wg)(),(0,t.iD)("footer",n,[l,(0,t._)("div",o,[(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:(0,t.w5)((()=>[s])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:(0,t.w5)((()=>[d])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:(0,t.w5)((()=>[r])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:(0,t.w5)((()=>[c])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:(0,t.w5)((()=>[h])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:(0,t.w5)((()=>[p])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:(0,t.w5)((()=>[m])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:(0,t.w5)((()=>[g])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/clinica-de-desenvolvimento-nathalia-bond"},{default:(0,t.w5)((()=>[b])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/cecerele"},{default:(0,t.w5)((()=>[u])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:(0,t.w5)((()=>[v])),_:1}),(0,t.Wm)(N,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:(0,t.w5)((()=>[w])),_:1})]),k])}var f={name:"Related",data(){return{modal:this.$store.getters.getModal}}},_=i(744);const N=(0,_.Z)(f,[["render",x]]);var E=N},499:function(a,e,i){i.r(e),i.d(e,{default:function(){return ka}});var t=i(252),n=i(577);const l=(0,t._)("h2",{class:"internal-title"},[(0,t.Uk)("Nathalia Bond"),(0,t._)("br"),(0,t.Uk)("Cliníca de Desenvolvimento")],-1),o={class:"internal-main"},s=(0,t.uE)('<div class="internal-description"><h3 class="internal-description-text"> I met <a href="https://www.instagram.com/clinica.nathaliabond" rel="noopener" target="_blank">Nathalia</a> in Oct. 2021, from <a href="https://www.nathaliabond.com.br?utm_source=luiskr.com" rel="noopener" target="_blank">Nathalia Bond - Cliníca de Desenvolvimento</a> trought a comment friend of ours, <a href="https://www.instagram.com/marcoanu" rel="noopener" target="_blank">Marco Anuschek</a>. </h3><p class="internal-description-text"> During the first meetings, we established the project needs and expectations. </p><p class="internal-description-text"> Nathalia already had a website, created on the Wix platform by herself, with an already established visual identity and with some content. Nathalia also needed the website to be easy to maintain. </p><p class="internal-description-text"> Needing to be easy to maintain, and to be easy on the SEO side, we set up to create a website in the Squarespace, as note every case needs heavy programming efforts. </p></div>',1),d={class:"internal-extra"},r={class:"internal-extra-scroll"},c={class:"internal-extra-item"},h={class:"internal-extra-item"},p=(0,t._)("div",{class:"internal-description"},[(0,t._)("h3",{class:"internal-description-text"}," For Nathalia's new website, we looked at the logo to create a new colour pattern. "),(0,t._)("p",{class:"internal-description-text"}," And looked to similar fonts on the old website, to maintain the typography as closely as possible to the already established visual identity, while creating a huge visual refresh. "),(0,t._)("p",{class:"internal-description-text"}," Working with Nathalia, we established the need to create special pages for every especially. ")],-1),m={class:"internal-extra"},g={class:"internal-extra-scroll"},b={class:"internal-extra-item"},u={class:"internal-extra-item"},v={class:"internal-extra-item"},w={class:"internal-extra-item"},k={class:"internal-extra-item"},x={class:"internal-extra-item"},f={class:"internal-extra-item"},_={class:"internal-extra-item"},N=(0,t._)("div",{class:"internal-description"},[(0,t._)("h3",{class:"internal-description-text"}," And also, pages for every member o Nathalia's team, showing a very personal side to the website. ")],-1),E={class:"internal-extra"},B={class:"internal-extra-scroll"},y={class:"internal-extra-item landscape"},q={class:"internal-extra-item"},C={class:"internal-extra-item"},W={class:"internal-extra-item landscape"},M={class:"internal-extra-item landscape"},V={class:"internal-extra-item landscape"},D={class:"internal-extra-item landscape"},U={class:"internal-extra-item landscape"},z={class:"internal-extra-item landscape"},$={class:"internal-extra-item landscape"},S={class:"internal-extra-item landscape"},j={class:"internal-extra-item landscape"},T=(0,t._)("div",{class:"internal-description"},[(0,t._)("h3",{class:"internal-description-text"}," We established the need for constant updates to improve the website ranking on search engines, and so we also migrated the blog with a new and refreshed layout. ")],-1),Z={class:"internal-extra"},A={class:"internal-extra-scroll"},R={class:"internal-extra-item landscape"},L={class:"internal-extra-item"},F={class:"internal-extra-item"},I={class:"internal-extra-item"},K={class:"internal-extra-item"},O={class:"internal-extra-item"},P={class:"internal-extra-item"},Y={class:"internal-extra-item"},G={class:"internal-extra-item"},Q={class:"internal-extra-item"},H={class:"internal-extra-item"},J={class:"internal-extra-item"},X={class:"internal-extra-item"},aa={class:"internal-extra-item"},ea={class:"internal-extra-item"},ia={class:"internal-extra-item small"},ta={class:"internal-extra-item"},na={class:"internal-extra-item"},la={class:"internal-extra-item small"},oa=(0,t._)("div",{class:"internal-description"},[(0,t._)("h3",{class:"internal-description-text"}," Lastly, but not least, working with Nathalia, I created a new contact page for Nathalia's webpage. "),(0,t._)("p",{class:"internal-description-text"}," Every page was designed to be very approachable and fun, while being very subtle and delicate, in balance with Nathalia's visual identity. ")],-1),sa={class:"internal-extra"},da={class:"internal-extra-scroll"},ra={class:"internal-extra-item landscape"},ca={class:"internal-extra-item small"},ha={key:0,id:"#modal",class:"modal-above"};function pa(a,e,i,pa,ma,ga){const ba=(0,t.up)("Media"),ua=(0,t.up)("Related"),va=(0,t.up)("MediaExpanded");return(0,t.wg)(),(0,t.iD)("article",null,[(0,t._)("div",{id:"#main",class:"project modal-below",style:(0,n.j5)("transform: translateY(-"+ma.modal.transform+"px);")},[l,(0,t._)("div",o,[(0,t.Wm)(ba,{classes:"internal-main-item",src:"nathaliabond/home/nathaliabond.com.br-tour",width:3836,height:2056,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: homepage / tour"})]),(0,t._)("section",null,[s,(0,t._)("div",d,[(0,t._)("div",r,[(0,t._)("div",c,[(0,t.Wm)(ba,{src:"nathaliabond/home/nathaliabond-br-home-desktop",width:1920,height:8481,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: desktop homepage"})]),(0,t._)("div",h,[(0,t.Wm)(ba,{src:"nathaliabond/home/nathaliabond-br-home-mobile",width:414,height:7763,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: mobile homepage"})])])])]),(0,t._)("section",null,[p,(0,t._)("div",m,[(0,t._)("div",g,[(0,t._)("div",b,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond.com.br-nossas-especialidades",width:3836,height:2056,canExpand:!0,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades mobile page"})]),(0,t._)("div",u,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-desktop",width:1920,height:8547,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades desktop page"})]),(0,t._)("div",v,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-fonoaudiologia-desktop",width:1920,height:2796,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Fonoaudiologia, desktop page"})]),(0,t._)("div",w,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-fonoaudiologia-mobile",width:414,height:3140,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Fonoaudiologia, mobile page"})]),(0,t._)("div",k,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-psicologia-infantil-desktop",width:1920,height:2846,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Psicologia infantil, desktop page"})]),(0,t._)("div",x,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-psicomotria-desktop",width:1920,height:2627,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Psicomotria, desktop page"})]),(0,t._)("div",f,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-psicopedagogia-desktop",width:1920,height:2888,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Psicopedagogia, desktop page"})]),(0,t._)("div",_,[(0,t.Wm)(ba,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-terapia-ocupacional-desktop",width:1920,height:2218,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Terapia Ocupacional, desktop page"})])])])]),(0,t._)("section",null,[N,(0,t._)("div",E,[(0,t._)("div",B,[(0,t._)("div",y,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond.com.br-equipe",width:3836,height:2056,canExpand:!0,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe, desktop 4K page"})]),(0,t._)("div",q,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-desktop",width:1920,height:5905,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe, desktop 1920 page"})]),(0,t._)("div",C,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-mobile",width:414,height:5440,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe, mobile page"})]),(0,t._)("div",W,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-nathalia-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Nathalia, desktop page"})]),(0,t._)("div",M,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-camila-nobre-desktop",width:1920,height:1795,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Camila Nobre, desktop page"})]),(0,t._)("div",V,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-camila-teixeira-desktop",width:1920,height:1796,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Camila Teixeira, desktop page"})]),(0,t._)("div",D,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-ellen-desktop",width:1920,height:1795,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Ellen, desktop page"})]),(0,t._)("div",U,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-mariel-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Mariel, desktop page"})]),(0,t._)("div",z,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-melissa-desktop",width:1920,height:1516,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Melissa, desktop page"})]),(0,t._)("div",$,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-michela-desktop",width:1920,height:1516,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Michela, desktop page"})]),(0,t._)("div",S,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-nesrim-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Nesrim, desktop page"})]),(0,t._)("div",j,[(0,t.Wm)(ba,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-rebecca-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Rebecca, desktop page"})])])])]),(0,t._)("section",null,[T,(0,t._)("div",Z,[(0,t._)("div",A,[(0,t._)("div",R,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond.com.br-blog",width:3836,height:2056,canExpand:!0,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - desktop 4K main page"})]),(0,t._)("div",L,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog",width:1920,height:7349,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - desktop 1920 main page"})]),(0,t._)("div",F,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-mobile",width:414,height:11896,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - mobile main page"})]),(0,t._)("div",I,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-a-aprendizagem-humana-desktop",width:1920,height:2863,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - a aprendizagem humana, desktop page"})]),(0,t._)("div",K,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-a-linguagem-oral-infantil-desktop",width:1920,height:5212,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - a linguagem oral infantil, desktop page"})]),(0,t._)("div",O,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-a-psicoterapia-infantil-desktop",width:1920,height:3188,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - a psicoterapia infantil, desktop page"})]),(0,t._)("div",P,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-cuidando-dos-cuidadores-de-crianas-com-tea-desktop",width:1920,height:3489,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - cuidando dos cuidadores de crianças com TEA, desktop page"})]),(0,t._)("div",Y,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-gagueira-infantil-desktop",width:1920,height:2635,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - gagueira infantil, desktop page"})]),(0,t._)("div",G,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-gagueira-infantil",width:414,height:2853,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - gagueira infantil, mobile page"})]),(0,t._)("div",Q,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-o-terapeuta-ocupacional-desktop",width:1920,height:3124,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - terapia ocupacional, desktop page"})]),(0,t._)("div",H,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-o-trabalho-do-profissional-de-educacao-fisica-desktop",width:1920,height:3051,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - o trabalho do profissional de educacao fisica, desktop page"})]),(0,t._)("div",J,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-por-que-a-intervencao-precoce-e-tao-importante-desktop",width:1920,height:4225,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - por que a intervenção precoce e tão importante, desktop page"})]),(0,t._)("div",X,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-quando-procurar-um-psicopedagogo-desktop",width:1920,height:2975,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - quando procurar um psicopedagogo, desktop page"})]),(0,t._)("div",aa,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-quando-uma-crianca-precisa-de-fonoaudiologo-desktop",width:1920,height:3762,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - quando uma crianca precisa de fonoaudiologo, desktop page"})]),(0,t._)("div",ea,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-saiba-o-que-esperar-da-fala-da-criana-desktop",width:1920,height:2390,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - o que esperar da fala da criança, desktop page"})]),(0,t._)("div",ia,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-saiba-o-que-esperar-da-fala-da-criana",width:414,height:2907,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - o que esperar da fala da criança, mobile page"})]),(0,t._)("div",ta,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-sera-que-meu-filho-precisa-de-terapia-ocupacional-desktop",width:1920,height:8280,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - sera que meu filho precisa de terapia ocupacional, desktop page"})]),(0,t._)("div",na,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-transtorno-espectro-do-autismo-desktop",width:1920,height:2360,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - transtorno espectro do autismo, desktop page"})]),(0,t._)("div",la,[(0,t.Wm)(ba,{src:"nathaliabond/blog/nathaliabond-br-blog-transtorno-espectro-do-autismo",width:414,height:2602,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - transtorno espectro do autismo , mobile page"})])])])]),(0,t._)("section",null,[oa,(0,t._)("div",sa,[(0,t._)("div",da,[(0,t._)("div",ra,[(0,t.Wm)(ba,{src:"nathaliabond/contato/nathaliabond-br-contato-desktop",width:1920,height:2682,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Contato, desktop page"})]),(0,t._)("div",ca,[(0,t.Wm)(ba,{src:"nathaliabond/contato/nathaliabond-br-contato-mobile",width:414,height:2570,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Contato, mobile page"})])])])]),(0,t.Wm)(ua)],4),ma.modal.open?((0,t.wg)(),(0,t.iD)("div",ha,[(0,t.Wm)(va,{source:ma.modal.media.source,thumb:ma.modal.media.thumb,alt:ma.modal.media.alt,width:ma.modal.media.width,height:ma.modal.media.height,isVideo:ma.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):(0,t.kq)("",!0)])}var ma=i(950),ga=i(828),ba=i(736),ua={data(){return{modal:this.$store.getters.getModal}},created(){document.title=this.$route.meta.title},mounted(){setTimeout((()=>{window.scrollTo(0,0)}),500)},components:{Media:ma.Z,MediaExpanded:ga.Z,Related:ba.Z},name:"ClinicaDeDesenvolvimentoNathaliaBond"},va=i(744);const wa=(0,va.Z)(ua,[["render",pa]]);var ka=wa}}]);
//# sourceMappingURL=clinicadedesenvolvimentonathaliabond.87f77b1c.js.map