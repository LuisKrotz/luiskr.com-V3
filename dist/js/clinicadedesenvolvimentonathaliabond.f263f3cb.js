(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["clinicadedesenvolvimentonathaliabond"],{"0680":function(e,a,t){"use strict";var i=t("7a23");function n(e,a,t,n,l,o){const s=Object(i["x"])("lazy");return t.canExpand?(Object(i["r"])(),Object(i["e"])("figure",{key:0,class:"internal-expand",onClick:a[1]||(a[1]=(...e)=>o.openModal&&o.openModal(...e)),style:l.styles,title:t.label},[Object(i["i"])("img",{class:"render-placeholder",src:o.placeholder(t.width,t.height),width:t.width,height:t.height,alt:" "},null,8,["src","width","height"]),t.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"render-media "+t.classes,poster:l.poster[0],width:t.width,height:t.height,alt:t.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(i["i"])("source",{src:l.video[1],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"render-media "+t.classes,width:t.width,height:t.height,alt:t.label,src:l.storage+t.src+l.q100},null,10,["width","height","alt","src"])),[[s,{src:l.storage+t.src+l.q50,loading:l.storage+t.src+l.thumb}]]),(Object(i["r"])(),Object(i["e"])(i["a"],null,Object(i["v"])(2,(e=1)=>Object(i["i"])("button",{class:"expand-modal-open-"+e,key:e,"aria-hidden":2===e,"data-no-snippet":""},Object(i["A"])(l.action)+" to open",11,["aria-hidden"])),64))],12,["title"])):(Object(i["r"])(),Object(i["e"])("figure",{key:1,style:l.styles,title:t.label},[Object(i["i"])("img",{class:"render-placeholder",src:o.placeholder(t.width,t.height),width:t.width,height:t.height,alt:" "},null,8,["src","width","height"]),t.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"render-media "+t.classes,poster:l.poster[0],width:t.width,height:t.height,alt:t.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(i["i"])("source",{src:l.video[0],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"render-media "+t.classes,width:t.width,height:t.height,alt:t.label},null,10,["width","height","alt"])),[[s,{src:l.storage+t.src+l.q50,loading:l.storage+t.src+l.thumb}]])],12,["title"]))}const l="-mozjpg",o=".jpg",s=".mp4.jpg-thumb.jpg",d=".mp4-scaledown-2x",c=".mp4";var r={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:l+"3-MSSIM-tuned-kodak"+o,q50:l+"-50"+o,q100:l+"-uncompressed"+o,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let e=this.storage+this.src;this.poster[0]=e+s,this.poster[1]=e+d+s,this.video[0]=e+c,this.video[1]=e+d+c}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(e,a){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${a}"%3E%3C/svg%3E`},openModal(){let e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}};r.render=n;a["a"]=r},5296:function(e,a,t){"use strict";var i=t("7a23");const n={class:"expand-modal-content"},l={class:"expand-modal-close-bar"},o={class:"expand-modal-media-figure"};function s(e,a,t,s,d,c){const r=Object(i["x"])("lazy");return Object(i["r"])(),Object(i["e"])("div",n,[Object(i["i"])("div",l,[Object(i["i"])("button",{class:"expand-modal-close-bar-button",onClick:a[1]||(a[1]=(...e)=>c.closeModal&&c.closeModal(...e))},"[ close ]")]),Object(i["i"])("div",{class:"expand-modal-close-area",onClick:a[2]||(a[2]=(...e)=>c.closeModal&&c.closeModal(...e))}),Object(i["i"])("figure",o,[Object(i["i"])("img",{class:"expand-modal-media-placeholder",src:c.placeholder(t.width,t.height),width:t.width,height:t.height,"aria-hidden":"true",tabindex:"-1","data-nosnippet":""},null,8,["src","width","height"]),t.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"expand-modal-media-item",width:t.width,height:t.height,poster:t.thumb,alt:t.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[Object(i["i"])("source",{src:t.source,type:"video/mp4"},null,8,["src"])],8,["width","height","poster","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"expand-modal-media-item",width:t.width,height:t.height,alt:t.alt,src:t.source},null,8,["width","height","alt","src"])),[[r,{src:t.source,loading:t.thumb}]]),Object(i["i"])("button",{class:"expand-modal-close-bottom",onClick:a[3]||(a[3]=(...e)=>c.closeModal&&c.closeModal(...e))},"[ close ]")])])}var d={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(e,a){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${a}" width="${e}" height="${a}" %3E%3C/svg%3E`},closeModal(){let e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame(()=>{window.scrollTo(0,e)})}}};d.render=s;a["a"]=d},"5fb7":function(e,a,t){},6754:function(e,a,t){"use strict";t.r(a);var i=t("7a23");const n=Object(i["i"])("h2",{class:"internal-title"},[Object(i["h"])("Nathalia Bond"),Object(i["i"])("br"),Object(i["h"])("Cliníca de Desenvolvimento")],-1),l={class:"internal-main"},o=Object(i["g"])('<div class="internal-description"><h3 class="internal-description-text"> I met <a href="https://www.instagram.com/clinica.nathaliabond" rel="noopener" target="_blank">Nathalia</a> in Oct. 2021, from <a href="https://www.nathaliabond.com.br?utm_source=luiskr.com" rel="noopener" target="_blank">Nathalia Bond - Cliníca de Desenvolvimento</a> trought a comment friend of ours, <a href="https://www.instagram.com/marcoanu" rel="noopener" target="_blank">Marco Anuschek</a>. </h3><p class="internal-description-text"> During the first meetings, we established the project needs and expectations. </p><p class="internal-description-text"> Nathalia already had a website, created on the Wix platform by herself, with an already established visual identity and with some content. Nathalia also needed the website to be easy to maintain. </p><p class="internal-description-text"> Needing to be easy to maintain, and to be easy on the SEO side, we set up to create a website in the Squarespace, as note every case needs heavy programming efforts. </p></div>',1),s={class:"internal-extra"},d={class:"internal-extra-scroll"},c={class:"internal-extra-item"},r={class:"internal-extra-item"},h=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," For Nathalia's new website, we looked at the logo to create a new colour pattern. "),Object(i["i"])("p",{class:"internal-description-text"}," And looked to similar fonts on the old website, to maintain the typography as closely as possible to the already established visual identity, while creating a huge visual refresh. "),Object(i["i"])("p",{class:"internal-description-text"}," Working with Nathalia, we established the need to create special pages for every especially. ")],-1),b={class:"internal-extra"},p={class:"internal-extra-scroll"},m={class:"internal-extra-item"},g={class:"internal-extra-item"},u={class:"internal-extra-item"},v={class:"internal-extra-item"},j={class:"internal-extra-item"},O={class:"internal-extra-item"},w={class:"internal-extra-item"},x={class:"internal-extra-item"},f=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," And also, pages for every member o Nathalia's team, showing a very personal side to the website. ")],-1),k={class:"internal-extra"},N={class:"internal-extra-scroll"},E={class:"internal-extra-item landscape"},B={class:"internal-extra-item"},y={class:"internal-extra-item"},q={class:"internal-extra-item landscape"},C={class:"internal-extra-item landscape"},M={class:"internal-extra-item landscape"},_={class:"internal-extra-item landscape"},V={class:"internal-extra-item landscape"},D={class:"internal-extra-item landscape"},$={class:"internal-extra-item landscape"},z={class:"internal-extra-item landscape"},S={class:"internal-extra-item landscape"},T=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," We established the need for constant updates to improve the website ranking on search engines, and so we also migrated the blog with a new and refreshed layout. ")],-1),A={class:"internal-extra"},R={class:"internal-extra-scroll"},L={class:"internal-extra-item landscape"},F={class:"internal-extra-item"},I={class:"internal-extra-item"},P={class:"internal-extra-item"},K={class:"internal-extra-item"},W={class:"internal-extra-item"},G={class:"internal-extra-item"},J={class:"internal-extra-item"},Y={class:"internal-extra-item"},U={class:"internal-extra-item"},H={class:"internal-extra-item"},Q={class:"internal-extra-item"},X={class:"internal-extra-item"},Z={class:"internal-extra-item"},ee={class:"internal-extra-item"},ae={class:"internal-extra-item small"},te={class:"internal-extra-item"},ie={class:"internal-extra-item"},ne={class:"internal-extra-item small"},le=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," Lastly, but not least, working with Nathalia, I created a new contact page for Nathalia's webpage. "),Object(i["i"])("p",{class:"internal-description-text"}," Every page was designed to be very approachable and fun, while being very subtle and delicate, in balance with Nathalia's visual identity. ")],-1),oe={class:"internal-extra"},se={class:"internal-extra-scroll"},de={class:"internal-extra-item landscape"},ce={class:"internal-extra-item small"},re={key:0,id:"#modal",class:"modal-above"};function he(e,a,t,he,be,pe){const me=Object(i["w"])("Media"),ge=Object(i["w"])("Related"),ue=Object(i["w"])("MediaExpanded");return Object(i["r"])(),Object(i["e"])("article",null,[Object(i["i"])("div",{id:"#main",class:"project modal-below",style:"transform: translateY(-"+be.modal.transform+"px);"},[n,Object(i["i"])("div",l,[Object(i["i"])(me,{classes:"internal-main-item",src:"nathaliabond/home/nathaliabond.com.br-tour",width:3836,height:2056,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: homepage / tour"})]),Object(i["i"])("section",null,[o,Object(i["i"])("div",s,[Object(i["i"])("div",d,[Object(i["i"])("div",c,[Object(i["i"])(me,{src:"nathaliabond/home/nathaliabond-br-home-desktop",width:1920,height:8481,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: desktop homepage"})]),Object(i["i"])("div",r,[Object(i["i"])(me,{src:"nathaliabond/home/nathaliabond-br-home-mobile",width:414,height:7763,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: mobile homepage"})])])])]),Object(i["i"])("section",null,[h,Object(i["i"])("div",b,[Object(i["i"])("div",p,[Object(i["i"])("div",m,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond.com.br-nossas-especialidades",width:3836,height:2056,canExpand:!0,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades mobile page"})]),Object(i["i"])("div",g,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-desktop",width:1920,height:8547,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades desktop page"})]),Object(i["i"])("div",u,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-fonoaudiologia-desktop",width:1920,height:2796,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Fonoaudiologia, desktop page"})]),Object(i["i"])("div",v,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-fonoaudiologia-mobile",width:414,height:3140,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Fonoaudiologia, mobile page"})]),Object(i["i"])("div",j,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-psicologia-infantil-desktop",width:1920,height:2846,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Psicologia infantil, desktop page"})]),Object(i["i"])("div",O,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-psicomotria-desktop",width:1920,height:2627,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Psicomotria, desktop page"})]),Object(i["i"])("div",w,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-psicopedagogia-desktop",width:1920,height:2888,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Psicopedagogia, desktop page"})]),Object(i["i"])("div",x,[Object(i["i"])(me,{src:"nathaliabond/especialidades/nathaliabond-br-nossas-especialidades-terapia-ocupacional-desktop",width:1920,height:2218,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossas Especialidades - Terapia Ocupacional, desktop page"})])])])]),Object(i["i"])("section",null,[f,Object(i["i"])("div",k,[Object(i["i"])("div",N,[Object(i["i"])("div",E,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond.com.br-equipe",width:3836,height:2056,canExpand:!0,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe, desktop 4K page"})]),Object(i["i"])("div",B,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-desktop",width:1920,height:5905,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe, desktop 1920 page"})]),Object(i["i"])("div",y,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-mobile",width:414,height:5440,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe, mobile page"})]),Object(i["i"])("div",q,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-nathalia-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Nathalia, desktop page"})]),Object(i["i"])("div",C,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-camila-nobre-desktop",width:1920,height:1795,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Camila Nobre, desktop page"})]),Object(i["i"])("div",M,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-camila-teixeira-desktop",width:1920,height:1796,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Camila Teixeira, desktop page"})]),Object(i["i"])("div",_,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-ellen-desktop",width:1920,height:1795,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Ellen, desktop page"})]),Object(i["i"])("div",V,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-mariel-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Mariel, desktop page"})]),Object(i["i"])("div",D,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-melissa-desktop",width:1920,height:1516,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Melissa, desktop page"})]),Object(i["i"])("div",$,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-michela-desktop",width:1920,height:1516,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Michela, desktop page"})]),Object(i["i"])("div",z,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-nesrim-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Nesrim, desktop page"})]),Object(i["i"])("div",S,[Object(i["i"])(me,{src:"nathaliabond/equipe/nathaliabond-br-nossa-equipe-rebecca-desktop",width:1920,height:1621,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Nossa Equipe - Rebecca, desktop page"})])])])]),Object(i["i"])("section",null,[T,Object(i["i"])("div",A,[Object(i["i"])("div",R,[Object(i["i"])("div",L,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond.com.br-blog",width:3836,height:2056,canExpand:!0,isVideo:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - desktop 4K main page"})]),Object(i["i"])("div",F,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog",width:1920,height:7349,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - desktop 1920 main page"})]),Object(i["i"])("div",I,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-mobile",width:414,height:11896,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - mobile main page"})]),Object(i["i"])("div",P,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-a-aprendizagem-humana-desktop",width:1920,height:2863,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - a aprendizagem humana, desktop page"})]),Object(i["i"])("div",K,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-a-linguagem-oral-infantil-desktop",width:1920,height:5212,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - a linguagem oral infantil, desktop page"})]),Object(i["i"])("div",W,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-a-psicoterapia-infantil-desktop",width:1920,height:3188,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - a psicoterapia infantil, desktop page"})]),Object(i["i"])("div",G,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-cuidando-dos-cuidadores-de-crianas-com-tea-desktop",width:1920,height:3489,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - cuidando dos cuidadores de crianças com TEA, desktop page"})]),Object(i["i"])("div",J,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-gagueira-infantil-desktop",width:1920,height:2635,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - gagueira infantil, desktop page"})]),Object(i["i"])("div",Y,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-gagueira-infantil",width:414,height:2853,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - gagueira infantil, mobile page"})]),Object(i["i"])("div",U,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-o-terapeuta-ocupacional-desktop",width:1920,height:3124,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - terapia ocupacional, desktop page"})]),Object(i["i"])("div",H,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-o-trabalho-do-profissional-de-educacao-fisica-desktop",width:1920,height:3051,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - o trabalho do profissional de educacao fisica, desktop page"})]),Object(i["i"])("div",Q,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-por-que-a-intervencao-precoce-e-tao-importante-desktop",width:1920,height:4225,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - por que a intervenção precoce e tão importante, desktop page"})]),Object(i["i"])("div",X,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-quando-procurar-um-psicopedagogo-desktop",width:1920,height:2975,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - quando procurar um psicopedagogo, desktop page"})]),Object(i["i"])("div",Z,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-quando-uma-crianca-precisa-de-fonoaudiologo-desktop",width:1920,height:3762,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - quando uma crianca precisa de fonoaudiologo, desktop page"})]),Object(i["i"])("div",ee,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-saiba-o-que-esperar-da-fala-da-criana-desktop",width:1920,height:2390,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - o que esperar da fala da criança, desktop page"})]),Object(i["i"])("div",ae,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-saiba-o-que-esperar-da-fala-da-criana",width:414,height:2907,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - o que esperar da fala da criança, mobile page"})]),Object(i["i"])("div",te,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-sera-que-meu-filho-precisa-de-terapia-ocupacional-desktop",width:1920,height:8280,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - sera que meu filho precisa de terapia ocupacional, desktop page"})]),Object(i["i"])("div",ie,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-transtorno-espectro-do-autismo-desktop",width:1920,height:2360,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - transtorno espectro do autismo, desktop page"})]),Object(i["i"])("div",ne,[Object(i["i"])(me,{src:"nathaliabond/blog/nathaliabond-br-blog-transtorno-espectro-do-autismo",width:414,height:2602,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Blog - transtorno espectro do autismo , mobile page"})])])])]),Object(i["i"])("section",null,[le,Object(i["i"])("div",oe,[Object(i["i"])("div",se,[Object(i["i"])("div",de,[Object(i["i"])(me,{src:"nathaliabond/contato/nathaliabond-br-contato-desktop",width:1920,height:2682,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Contato, desktop page"})]),Object(i["i"])("div",ce,[Object(i["i"])(me,{src:"nathaliabond/contato/nathaliabond-br-contato-mobile",width:414,height:2570,canExpand:!0,label:"Nathalia Bond - Clínica de desenvolvimento: Contato, mobile page"})])])])]),Object(i["i"])(ge)],4),be.modal.open?(Object(i["r"])(),Object(i["e"])("div",re,[Object(i["i"])(ue,{source:be.modal.media.source,thumb:be.modal.media.thumb,alt:be.modal.media.alt,width:be.modal.media.width,height:be.modal.media.height,isVideo:be.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):Object(i["f"])("",!0)])}var be=t("0680"),pe=t("5296"),me=t("c651"),ge={data(){return{modal:this.$store.getters.getModal}},created(){document.title=this.$route.meta.title},mounted(){setTimeout(()=>{window.scrollTo(0,0)},500)},components:{Media:be["a"],MediaExpanded:pe["a"],Related:me["a"]},name:"ClinicaDeDesenvolvimentoNathaliaBond"};t("ed7a");ge.render=he;a["default"]=ge},c651:function(e,a,t){"use strict";var i=t("7a23");const n={class:"internal-footer"},l=Object(i["i"])("h2",{class:"internal-footer-title"},"Related",-1),o={class:"internal-footer-related"},s=Object(i["h"])("Metcha"),d=Object(i["h"])("Transa"),c=Object(i["h"])("Brazilian Leather"),r=Object(i["h"])("Mor"),h=Object(i["h"])("Coza"),b=Object(i["h"])("Melissa"),p=Object(i["h"])("Minimelissa"),m=Object(i["h"])("Marco Almeida"),g=Object(i["h"])("Nathalia Bond"),u=Object(i["h"])("Cecerelê"),v=Object(i["h"])("Vibra"),j=Object(i["h"])("Genesysinf"),O=Object(i["g"])('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a><p class="internal-footer-items-note">All media on this domain was taken by screenshots from public URLs and/or local development data.<br>The current website or origin of the media may have changed or may change in the future.</p></div>',1);function w(e,a,t,w,x,f){const k=Object(i["w"])("router-link");return Object(i["r"])(),Object(i["e"])("footer",n,[l,Object(i["i"])("div",o,[Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:Object(i["D"])(()=>[s]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:Object(i["D"])(()=>[d]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:Object(i["D"])(()=>[c]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:Object(i["D"])(()=>[r]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:Object(i["D"])(()=>[h]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:Object(i["D"])(()=>[b]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:Object(i["D"])(()=>[p]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:Object(i["D"])(()=>[m]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/clinica-de-desenvolvimento-nathalia-bond"},{default:Object(i["D"])(()=>[g]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/cecerele"},{default:Object(i["D"])(()=>[u]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:Object(i["D"])(()=>[v]),_:1}),Object(i["i"])(k,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:Object(i["D"])(()=>[j]),_:1})]),O])}var x={name:"Related",data(){return{modal:this.$store.getters.getModal}}};x.render=w;a["a"]=x},ed7a:function(e,a,t){"use strict";t("5fb7")}}]);
//# sourceMappingURL=clinicadedesenvolvimentonathaliabond.f263f3cb.js.map