(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["cecerele"],{"0680":function(e,t,a){"use strict";var i=a("7a23");function r(e,t,a,r,l,o){const s=Object(i["x"])("lazy");return a.canExpand?(Object(i["r"])(),Object(i["e"])("figure",{key:0,class:"internal-expand",onClick:t[1]||(t[1]=(...e)=>o.openModal&&o.openModal(...e)),style:l.styles,title:a.label},[Object(i["i"])("img",{class:"render-placeholder",src:o.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,["src","width","height"]),a.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"render-media "+a.classes,poster:l.poster[0],width:a.width,height:a.height,alt:a.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(i["i"])("source",{src:l.video[1],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"render-media "+a.classes,width:a.width,height:a.height,alt:a.label},null,10,["width","height","alt"])),[[s,{src:l.storage+a.src+l.q50,loading:l.storage+a.src+l.thumb}]]),(Object(i["r"])(),Object(i["e"])(i["a"],null,Object(i["v"])(2,(e=1)=>Object(i["i"])("button",{class:"expand-modal-open-"+e,key:e,"aria-hidden":2===e,"data-no-snippet":""},Object(i["A"])(l.action)+" to open",11,["aria-hidden"])),64))],12,["title"])):(Object(i["r"])(),Object(i["e"])("figure",{key:1,style:l.styles,title:a.label},[Object(i["i"])("img",{class:"render-placeholder",src:o.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,["src","width","height"]),a.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"render-media "+a.classes,poster:l.poster[0],width:a.width,height:a.height,alt:a.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(i["i"])("source",{src:l.video[0],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"render-media "+a.classes,width:a.width,height:a.height,alt:a.label},null,10,["width","height","alt"])),[[s,{src:l.storage+a.src+l.q50,loading:l.storage+a.src+l.thumb}]])],12,["title"]))}const l="-mozjpg",o=".jpg",s=".mp4.jpg-thumb.jpg",c=".mp4-scaledown-2x",n=".mp4";var d={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:l+"3-MSSIM-tuned-kodak"+o,q50:l+"-50"+o,q100:l+"-uncompressed"+o,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let e=this.storage+this.src;this.poster[0]=e+s,this.poster[1]=e+c+s,this.video[0]=e+n,this.video[1]=e+c+n}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(e,t){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}"%3E%3C/svg%3E`},openModal(){let e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}};d.render=r;t["a"]=d},"30b7":function(e,t,a){"use strict";a.r(t);var i=a("7a23");const r=Object(i["i"])("h2",{class:"internal-title"},"Cecerelê",-1),l={class:"internal-main"},o=Object(i["g"])('<div class="internal-description"><h3 class="internal-description-text"> I met <a href="https://www.instagram.com/joananolitoral" rel="noopener" target="_blank">Joana</a> from <a href="https://www.cecerele.com.br?utm_source=luiskr.com" rel="noopener" target="_blank">Cecerelê </a>through an indication of a Friend of ours, <a href="https://www.instagram.com/saguzeiro" rel="noopener" target="_blank">Sagu</a> in November 2021 and Joana presented me with the project necessities. </h3><p class="internal-description-text"> Joana needed a website for the Cecerelê project to enable the Instagram shop feature, in a platform that was easy to maintain in the long run. </p><p class="internal-description-text"> Through many talks, working closely with Joana and taking into account all project constraints for future maintenance we came across a solution, a Brazilian e-commerce platform called &quot;Illuria&quot;. </p></div>',1),s={class:"internal-extra"},c={class:"internal-extra-scroll"},n={class:"internal-extra-item landscape"},d={class:"internal-extra-item"},h=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," Based on my previous experience in platforms as the Vtex platform, I explained all the pros and cons of using an already developed platform, and we settled on starting the project. "),Object(i["i"])("p",{class:"internal-description-text"}," The project wasn't focused on programming exclusively. Working with Joana we created an identity for the website, establish a colour palette and a general mood for the webpage. ")],-1),p={class:"internal-extra"},b={class:"internal-extra-scroll"},m={class:"internal-extra-item"},u={class:"internal-extra-item"},g={class:"internal-extra-item"},j={class:"internal-extra-item"},O={class:"internal-extra-item"},w=Object(i["g"])('<div class="internal-description"><h3 class="internal-description-text"> Every page from the homepage, to products to login and cart pages, were through to keep in mind a fun branding related to Cecerelê. </h3><p class="internal-description-text"> Cecerelê&#39;s website was a great project to work on. </p><p class="internal-description-text"> Although my main focus is programming, not every project demands a great deal of programming to be done and using my UI and UX skills is always fun. </p><p class="internal-description-text"> I loved to work with SEO. And to set up the entire project from start to finish. </p></div>',1),f={class:"internal-extra"},v={class:"internal-extra-scroll"},x={class:"internal-extra-item landscape"},k={class:"internal-extra-item landscape"},y={class:"internal-extra-item"},M={key:0,id:"#modal",class:"modal-above"};function C(e,t,a,C,V,q){const E=Object(i["w"])("Media"),_=Object(i["w"])("Related"),z=Object(i["w"])("MediaExpanded");return Object(i["r"])(),Object(i["e"])("article",null,[Object(i["i"])("div",{id:"#main",class:"project modal-below",style:"transform: translateY(-"+V.modal.transform+"px);"},[r,Object(i["i"])("div",l,[Object(i["i"])(E,{classes:"internal-main-item",src:"cecerele/cecerele-tour",width:3836,height:2056,isVideo:!0,label:"Cecerelê: criada em 2019 pela historiadora Joana Schossler para produzir jogos, contamos com a colaboração de artistas, designers e pesquisadores muito talentosos. Com o propósito de oferecer para a sociedade brinquedos bonitos, educativos e de qualidade - website tour"})]),Object(i["i"])("section",null,[o,Object(i["i"])("div",s,[Object(i["i"])("div",c,[Object(i["i"])("div",n,[Object(i["i"])(E,{src:"cecerele/cecerele-br-home-update",width:3840,height:2368,canExpand:!0,isVideo:!1,label:"Cecerelê: homepage with products updated on dec. 2021"})]),Object(i["i"])("div",d,[Object(i["i"])(E,{src:"cecerele/cecerele-br-sobre-nos",width:1920,height:5654,canExpand:!0,isVideo:!1,label:"Cecerelê: about us page"})])])])]),Object(i["i"])("section",null,[h,Object(i["i"])("div",p,[Object(i["i"])("div",b,[Object(i["i"])("div",m,[Object(i["i"])(E,{src:"cecerele/cecerele-br-pd-8e2da8-kit-para-colorir-adulto-edicao-limitada",width:1170,height:1863,canExpand:!0,isVideo:!1,label:"Cecerelê: -  product page"})]),Object(i["i"])("div",u,[Object(i["i"])(E,{src:"cecerele/cecerele-br-pd-8e3765-kit-para-colorir-infantil-edicao-limitada",width:1280,height:1815,canExpand:!0,isVideo:!1,label:"Cecerelê: kit para colorir adulto edição limitada - product page"})]),Object(i["i"])("div",g,[Object(i["i"])(E,{src:"cecerele/cecerele-br-memorelas-jogo-de-memoria-das-mulheres-brasileiras",width:1920,height:2002,canExpand:!0,isVideo:!1,label:"Cecerelê: Memorêlas jogo de memória das mulheres brasileiras - product page"})]),Object(i["i"])("div",j,[Object(i["i"])(E,{src:"cecerele/cecerele-br-minha-praia-livro-de-colorir",width:1920,height:1927,canExpand:!0,isVideo:!1,label:"Cecerelê: Minha praia, livro de colorir - product page"})]),Object(i["i"])("div",O,[Object(i["i"])(E,{src:"cecerele/cecerele-br-quebra-cabeca-revolucionarias",width:1920,height:2027,canExpand:!0,isVideo:!1,label:"Cecerelê: Quebra cabeça Revolucionárias -  product page"})])])])]),Object(i["i"])("section",null,[w,Object(i["i"])("div",f,[Object(i["i"])("div",v,[Object(i["i"])("div",x,[Object(i["i"])(E,{src:"cecerele/cecerele-br-cart-content",width:1920,height:1476,canExpand:!0,isVideo:!1,label:""})]),Object(i["i"])("div",k,[Object(i["i"])(E,{src:"cecerele/cecerele-br-login",width:1920,height:1295,canExpand:!0,isVideo:!1,label:""})]),Object(i["i"])("div",y,[Object(i["i"])(E,{src:"cecerele/cecerele-br-cart-client-address",width:1920,height:1476,canExpand:!0,isVideo:!1,label:""})])])])]),Object(i["i"])(_)],4),V.modal.open?(Object(i["r"])(),Object(i["e"])("div",M,[Object(i["i"])(z,{source:V.modal.media.source,thumb:V.modal.media.thumb,alt:V.modal.media.alt,width:V.modal.media.width,height:V.modal.media.height,isVideo:V.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):Object(i["f"])("",!0)])}var V=a("0680"),q=a("5296"),E=a("c651"),_={data(){return{modal:this.$store.getters.getModal}},created(){document.title=this.$route.meta.title},mounted(){setTimeout(()=>{window.scrollTo(0,0)},500)},components:{Media:V["a"],MediaExpanded:q["a"],Related:E["a"]},name:"Cecerele"};a("7a97");_.render=C;t["default"]=_},5296:function(e,t,a){"use strict";var i=a("7a23");const r={class:"expand-modal-content"},l={class:"expand-modal-close-bar"},o={class:"expand-modal-media-figure"};function s(e,t,a,s,c,n){const d=Object(i["x"])("lazy");return Object(i["r"])(),Object(i["e"])("div",r,[Object(i["i"])("div",l,[Object(i["i"])("button",{class:"expand-modal-close-bar-button",onClick:t[1]||(t[1]=(...e)=>n.closeModal&&n.closeModal(...e))},"[ close ]")]),Object(i["i"])("div",{class:"expand-modal-close-area",onClick:t[2]||(t[2]=(...e)=>n.closeModal&&n.closeModal(...e))}),Object(i["i"])("figure",o,[Object(i["i"])("img",{class:"expand-modal-media-placeholder",src:n.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,["src","width","height"]),a.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"expand-modal-media-item",width:a.width,height:a.height,poster:a.thumb,alt:a.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[Object(i["i"])("source",{src:a.source,type:"video/mp4"},null,8,["src"])],8,["width","height","poster","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"expand-modal-media-item",width:a.width,height:a.height,alt:a.alt},null,8,["width","height","alt"])),[[d,{src:a.source,loading:a.thumb}]]),Object(i["i"])("button",{class:"expand-modal-close-bottom",onClick:t[3]||(t[3]=(...e)=>n.closeModal&&n.closeModal(...e))},"[ close ]")])])}var c={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(e,t){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}"%3E%3C/svg%3E`},closeModal(){let e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame(()=>{window.scrollTo(0,e)})}}};c.render=s;t["a"]=c},"7a97":function(e,t,a){"use strict";a("edcd")},c651:function(e,t,a){"use strict";var i=a("7a23");const r={class:"internal-footer"},l=Object(i["i"])("h2",{class:"internal-footer-title"},"Related",-1),o={class:"internal-footer-related"},s=Object(i["h"])("Metcha"),c=Object(i["h"])("Transa"),n=Object(i["h"])("Brazilian Leather"),d=Object(i["h"])("Mor"),h=Object(i["h"])("Coza"),p=Object(i["h"])("Melissa"),b=Object(i["h"])("Minimelissa"),m=Object(i["h"])("Marco Almeida"),u=Object(i["h"])("Nathalia Bond"),g=Object(i["h"])("Cecerelê"),j=Object(i["h"])("Vibra"),O=Object(i["h"])("Genesysinf"),w=Object(i["g"])('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a></div>',1);function f(e,t,a,f,v,x){const k=Object(i["w"])("router-link");return Object(i["r"])(),Object(i["e"])("footer",r,[l,Object(i["i"])("div",o,[Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:Object(i["D"])(()=>[s]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:Object(i["D"])(()=>[c]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:Object(i["D"])(()=>[n]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:Object(i["D"])(()=>[d]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:Object(i["D"])(()=>[h]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:Object(i["D"])(()=>[p]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:Object(i["D"])(()=>[b]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:Object(i["D"])(()=>[m]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/clinica-de-desenvolvimento-nathalia-bond"},{default:Object(i["D"])(()=>[u]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/cecerele"},{default:Object(i["D"])(()=>[g]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:Object(i["D"])(()=>[j]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:Object(i["D"])(()=>[O]),_:1})]),w])}var v={name:"Related",data(){return{modal:this.$store.getters.getModal}}};v.render=f;t["a"]=v},edcd:function(e,t,a){}}]);
//# sourceMappingURL=cecerele.1b1843ca.js.map