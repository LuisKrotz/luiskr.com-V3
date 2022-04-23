(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["minimelissa"],{"0680":function(e,i,t){"use strict";var a=t("7a23");function s(e,i,t,s,l,n){const c=Object(a["x"])("lazy");return t.canExpand?(Object(a["r"])(),Object(a["e"])("figure",{key:0,class:"internal-expand",onClick:i[1]||(i[1]=(...e)=>n.openModal&&n.openModal(...e)),style:l.styles,title:t.label},[Object(a["i"])("img",{class:"render-placeholder",src:n.placeholder(t.width,t.height),width:t.width,height:t.height,alt:" "},null,8,["src","width","height"]),t.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"render-media "+t.classes,poster:l.poster[0],width:t.width,height:t.height,alt:t.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(a["i"])("source",{src:l.video[1],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"render-media "+t.classes,width:t.width,height:t.height,alt:t.label,src:l.storage+t.src+l.q100},null,10,["width","height","alt","src"])),[[c,{src:l.storage+t.src+l.q50,loading:l.storage+t.src+l.thumb}]]),(Object(a["r"])(),Object(a["e"])(a["a"],null,Object(a["v"])(2,(e=1)=>Object(a["i"])("button",{class:"expand-modal-open-"+e,key:e,"aria-hidden":2===e,"data-no-snippet":""},Object(a["A"])(l.action)+" to open",11,["aria-hidden"])),64))],12,["title"])):(Object(a["r"])(),Object(a["e"])("figure",{key:1,style:l.styles,title:t.label},[Object(a["i"])("img",{class:"render-placeholder",src:n.placeholder(t.width,t.height),width:t.width,height:t.height,alt:" "},null,8,["src","width","height"]),t.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"render-media "+t.classes,poster:l.poster[0],width:t.width,height:t.height,alt:t.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(a["i"])("source",{src:l.video[0],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"render-media "+t.classes,width:t.width,height:t.height,alt:t.label},null,10,["width","height","alt"])),[[c,{src:l.storage+t.src+l.q50,loading:l.storage+t.src+l.thumb}]])],12,["title"]))}const l="-mozjpg",n=".jpg",c=".mp4.jpg-thumb.jpg",r=".mp4-scaledown-2x",o=".mp4";var d={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:l+"3-MSSIM-tuned-kodak"+n,q50:l+"-50"+n,q100:l+"-uncompressed"+n,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let e=this.storage+this.src;this.poster[0]=e+c,this.poster[1]=e+r+c,this.video[0]=e+o,this.video[1]=e+r+o}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(e,i){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${i}"%3E%3C/svg%3E`},openModal(){let e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}};d.render=s;i["a"]=d},"0c1d":function(e,i,t){"use strict";t.r(i);var a=t("7a23");const s=Object(a["i"])("h2",{class:"internal-title"},"Minimelissa",-1),l={class:"internal-main"},n=Object(a["g"])('<div class="internal-description"><h3 class="internal-description-text"><a href="https://transainc.com/cases/mini-melissa?utm_source=luiskr.com" target="_blank">Minimelissa</a> was a project developed at <a href="https://transainc.com?utm_source=luiskr.com" target="_blank">Transa</a> for the Grendene Group as a channel for the Minimelissa brand. </h3><p class="internal-description-text"> The project lasted from 2018 to 2020 and was made entirely with Jquery, CSS (Less) and PHP (Laravel). </p><p class="internal-description-text"> The website consisted of a Content feed and a Social feed on the homepage with infinite scroll leading to many <a href="https://transainc.com/category/mini-melissa?utm_source=luiskr.com" target="_blank">Minimelissa exclusive content</a>. </p></div>',1),c={class:"internal-extra"},r={class:"internal-extra-scroll"},o={class:"internal-extra-item"},d={class:"internal-extra-item"},m={class:"internal-extra-item"},b=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," The where to find page was developed with the Google Maps API and was a central location to find all places where Mini Melissas were sold and Mini Melissa clubs in Brazil and around the world. ")],-1),h={class:"internal-extra"},p={class:"internal-extra-scroll"},j={class:"internal-extra-item landscape"},O={class:"internal-extra-item"},u=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," On Minimelissa I was the Leading front end developer and created a CSS framework for the project. "),Object(a["i"])("p",{class:"internal-description-text"},[Object(a["h"])(" The framework was called "),Object(a["i"])("em",null,"candy"),Object(a["h"])(" with many ready to use and highly customizable components, to allow the fast development of collections and special pages. ")])],-1),g={class:"internal-extra"},w={class:"internal-extra-scroll"},f={class:"internal-extra-item landscape"},v={class:"internal-extra-item"},x=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," Speaking of collections, check out some of Minimelissa's collections: "),Object(a["i"])("p",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Color me"'),Object(a["h"])(", Spring-Summer collection of 2020, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),M={class:"internal-extra"},y={class:"internal-extra-scroll"},k={class:"internal-extra-item landscape"},S={class:"internal-extra-item"},V=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Dance Machine"'),Object(a["h"])(", Autumn-Winter collection of 2016, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),E={class:"internal-extra"},C={class:"internal-extra-scroll"},_={class:"internal-extra-item landscape"},q={class:"internal-extra-item"},T=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Dreamers"'),Object(a["h"])(", Autumn-Winter collection of 2020, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),D={class:"internal-extra"},L={class:"internal-extra-scroll"},$={class:"internal-extra-item landscape"},z={class:"internal-extra-item"},F=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Family"'),Object(a["h"])(", Spring-Summer collection of 2019, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),H={class:"internal-extra"},A={class:"internal-extra-scroll"},B={class:"internal-extra-item landscape"},W={class:"internal-extra-item"},G=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Flygrl"'),Object(a["h"])(", Autumn-Winter collection of 2017, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),N={class:"internal-extra"},R={class:"internal-extra-scroll"},I={class:"internal-extra-item landscape"},P={class:"internal-extra-item"},J=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Mapping"'),Object(a["h"])(", Spring-Summer collection of 2018, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),Y={class:"internal-extra"},K={class:"internal-extra-scroll"},U={class:"internal-extra-item landscape"},Q={class:"internal-extra-item"},X=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Mashup"'),Object(a["h"])(", Spring-Summer collection of 2017, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),Z={class:"internal-extra"},ee={class:"internal-extra-scroll"},ie={class:"internal-extra-item landscape"},te={class:"internal-extra-item"},ae=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Mirror"'),Object(a["h"])(", Autumn-Winter collection of 2019, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),se={class:"internal-extra"},le={class:"internal-extra-scroll"},ne={class:"internal-extra-item landscape"},ce={class:"internal-extra-item"},re=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Open Vibes"'),Object(a["h"])(", Autumn-Winter collection of 2018, developed in CSS and HTML only, was the first collection page to be displayed on the Minimelissa website. ")]),Object(a["i"])("p",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Open Vibes"'),Object(a["h"])(" was the page that kickstarted the idea of Minimelissa's "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(" in response to the need to develop collection pages in a short space of time, keeping high-quality pixel-perfect layouts and fast pages. ")])],-1),oe={class:"internal-extra"},de={class:"internal-extra-scroll"},me={class:"internal-extra-item landscape"},be={class:"internal-extra-item"},he=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"},[Object(a["i"])("strong",null,'"Wanna be Carioca"'),Object(a["h"])(", Spring-Summer collection of 2016, developed with the "),Object(a["i"])("em",null,"candy framework"),Object(a["h"])(", CSS and HTML only. ")])],-1),pe={class:"internal-extra"},je={class:"internal-extra-scroll"},Oe={class:"internal-extra-item landscape"},ue={class:"internal-extra-item"},ge={key:0,id:"#modal",class:"modal-above"};function we(e,i,t,we,fe,ve){const xe=Object(a["w"])("Media"),Me=Object(a["w"])("Related"),ye=Object(a["w"])("MediaExpanded");return Object(a["r"])(),Object(a["e"])("article",null,[Object(a["i"])("div",{id:"#main",class:"project modal-below",style:"transform: translateY(-"+fe.modal.transform+"px);"},[s,Object(a["i"])("div",l,[Object(a["i"])(xe,{classes:"internal-main-item",src:"minimelissa/website/minimelissa.com.br-31-03-19",width:1943,height:976,isVideo:!0,label:"Minimelissa: homepage full tour"})]),Object(a["i"])("section",null,[n,Object(a["i"])("div",c,[Object(a["i"])("div",r,[Object(a["i"])("div",o,[Object(a["i"])(xe,{src:"minimelissa/website/minimelissa.com.br-31-03-19-1-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"Miminelissa: mobile tour"})]),Object(a["i"])("div",d,[Object(a["i"])(xe,{src:"minimelissa/website/mini-melissa-cover-2020",width:1920,height:1001,canExpand:!0,label:"Minimelissa: Feed cover"})]),Object(a["i"])("div",m,[Object(a["i"])(xe,{src:"minimelissa/website/mini-melissa-feed-2020",width:1920,height:32491,canExpand:!0,label:"Minimelissa: Feed screenshoot 2020"})])])])]),Object(a["i"])("section",null,[b,Object(a["i"])("div",h,[Object(a["i"])("div",p,[Object(a["i"])("div",j,[Object(a["i"])(xe,{src:"minimelissa/where-to-find/mini-melissa-onde-encontrar-2020",width:1932,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Where to find"})]),Object(a["i"])("div",O,[Object(a["i"])(xe,{src:"minimelissa/where-to-find/minimelissa.com.br-onde-encotrar-31-03-19-1-mobile",width:833,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: where to find - mobile"})])])])]),Object(a["i"])("section",null,[u,Object(a["i"])("div",g,[Object(a["i"])("div",w,[Object(a["i"])("div",f,[Object(a["i"])(xe,{src:"minimelissa/collections/candy-framework/mini-melissa-candy-framework",width:1918,height:960,canExpand:!0,isVideo:!0,label:"Minimelissa: Candy Framework"})]),Object(a["i"])("div",v,[Object(a["i"])(xe,{src:"minimelissa/collections/candy-framework/minimelissa.com.br-candy-31-03-19-1-mobile",width:834,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Candy Framework mobile"})])])])]),Object(a["i"])("section",null,[x,Object(a["i"])("div",M,[Object(a["i"])("div",y,[Object(a["i"])("div",k,[Object(a["i"])(xe,{src:"minimelissa/collections/color-me-ss20/minimelissa-ss20",width:1440,height:784,canExpand:!0,isVideo:!0,label:"Minimelissa: Color Me"})]),Object(a["i"])("div",S,[Object(a["i"])(xe,{src:"minimelissa/collections/color-me-ss20/minimelissa-ss20-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"Minimelissa: Color Me mobile"})])])])]),Object(a["i"])("section",null,[V,Object(a["i"])("div",E,[Object(a["i"])("div",C,[Object(a["i"])("div",_,[Object(a["i"])(xe,{src:"minimelissa/collections/dance-machine-aw16/minimelissa.com.br-aw16-31-03-19",width:1928,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Dance Machine"})]),Object(a["i"])("div",q,[Object(a["i"])(xe,{src:"minimelissa/collections/dance-machine-aw16/minimelissa.com.br-aw16-31-03-19-1-mobile",width:833,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Dance Machine mobile"})])])])]),Object(a["i"])("section",null,[T,Object(a["i"])("div",D,[Object(a["i"])("div",L,[Object(a["i"])("div",$,[Object(a["i"])(xe,{src:"minimelissa/collections/dreamers-aw20/minimelissa-aw20",width:1440,height:784,canExpand:!0,isVideo:!0,label:"Minimelissa: Dreamers"})]),Object(a["i"])("div",z,[Object(a["i"])(xe,{src:"minimelissa/collections/dreamers-aw20/minimelissa-aw20-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"Minimelissa: Dreamers mobile"})])])])]),Object(a["i"])("section",null,[F,Object(a["i"])("div",H,[Object(a["i"])("div",A,[Object(a["i"])("div",B,[Object(a["i"])(xe,{src:"minimelissa/collections/family-ss19/minimelissa.com.br-SS19-31-03-19",width:1932,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Family"})]),Object(a["i"])("div",W,[Object(a["i"])(xe,{src:"minimelissa/collections/family-ss19/minimelissa.com.br-SS19-31-03-19-1-mobile",width:834,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Family mobile"})])])])]),Object(a["i"])("section",null,[G,Object(a["i"])("div",N,[Object(a["i"])("div",R,[Object(a["i"])("div",I,[Object(a["i"])(xe,{src:"minimelissa/collections/flygrl-aw17/minimelissa.com.br-aw17-31-03-19",width:1932,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Flygrl"})]),Object(a["i"])("div",P,[Object(a["i"])(xe,{src:"minimelissa/collections/flygrl-aw17/minimelissa.com.br-aw17-31-03-19-1-mobile",width:832,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Flygrl mobile"})])])])]),Object(a["i"])("section",null,[J,Object(a["i"])("div",Y,[Object(a["i"])("div",K,[Object(a["i"])("div",U,[Object(a["i"])(xe,{src:"minimelissa/collections/mapping-ss18/minimelissa.com.br-ss18-31-03-19",width:1932,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Mapping"})]),Object(a["i"])("div",Q,[Object(a["i"])(xe,{src:"minimelissa/collections/mapping-ss18/minimelissa.com.br-ss18-31-03-19-1-mobile",width:832,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Mapping mobile"})])])])]),Object(a["i"])("section",null,[X,Object(a["i"])("div",Z,[Object(a["i"])("div",ee,[Object(a["i"])("div",ie,[Object(a["i"])(xe,{src:"minimelissa/collections/mashup-ss17/minimelissa.com.br-ss17-31-03-19",width:1928,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Mashup"})]),Object(a["i"])("div",te,[Object(a["i"])(xe,{src:"minimelissa/collections/mashup-ss17/minimelissa.com.br-ss17-31-03-19-1-mobile",width:833,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Mashup mobile"})])])])]),Object(a["i"])("section",null,[ae,Object(a["i"])("div",se,[Object(a["i"])("div",le,[Object(a["i"])("div",ne,[Object(a["i"])(xe,{src:"minimelissa/collections/mirror-aw19/minimelissa.com.br-aw19-31-03-19",width:1936,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Mirror"})]),Object(a["i"])("div",ce,[Object(a["i"])(xe,{src:"minimelissa/collections/mirror-aw19/minimelissa.com.br-aw19-31-03-19-1-mobile",width:831,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Mirror mobile"})])])])]),Object(a["i"])("section",null,[re,Object(a["i"])("div",oe,[Object(a["i"])("div",de,[Object(a["i"])("div",me,[Object(a["i"])(xe,{src:"minimelissa/collections/open-vibes-aw18/aw18",width:1924,height:928,canExpand:!0,isVideo:!0,label:"Minimelissa: Open Vibes"})]),Object(a["i"])("div",be,[Object(a["i"])(xe,{src:"minimelissa/collections/open-vibes-aw18/minimelissa.com.br-aw18-31-03-19-1-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"Minimelissa: Open Vibes mobile"})])])])]),Object(a["i"])("section",null,[he,Object(a["i"])("div",pe,[Object(a["i"])("div",je,[Object(a["i"])("div",Oe,[Object(a["i"])(xe,{src:"minimelissa/collections/wanna-be-carioca-ss16/minimelissa.com.br-ss16-31-03-19",width:1928,height:944,canExpand:!0,isVideo:!0,label:"Minimelissa: Wanna be Carioca"})]),Object(a["i"])("div",ue,[Object(a["i"])(xe,{src:"minimelissa/collections/wanna-be-carioca-ss16/minimelissa.com.br-ss16-31-03-19-1-mobile",width:831,height:1728,canExpand:!0,isVideo:!0,label:"Minimelissa: Wanna be Carioca mobile"})])])])]),Object(a["i"])(Me)],4),fe.modal.open?(Object(a["r"])(),Object(a["e"])("div",ge,[Object(a["i"])(ye,{source:fe.modal.media.source,thumb:fe.modal.media.thumb,alt:fe.modal.media.alt,width:fe.modal.media.width,height:fe.modal.media.height,isVideo:fe.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):Object(a["f"])("",!0)])}var fe=t("0680"),ve=t("5296"),xe=t("c651"),Me={data(){return{modal:this.$store.getters.getModal}},created(){document.title=this.$route.meta.title},mounted(){setTimeout(()=>{window.scrollTo(0,0)},500)},components:{Media:fe["a"],MediaExpanded:ve["a"],Related:xe["a"]},name:"Minimelissa"};t("e2e2");Me.render=we;i["default"]=Me},5296:function(e,i,t){"use strict";var a=t("7a23");const s={class:"expand-modal-content"},l={class:"expand-modal-close-bar"},n={class:"expand-modal-media-figure"};function c(e,i,t,c,r,o){const d=Object(a["x"])("lazy");return Object(a["r"])(),Object(a["e"])("div",s,[Object(a["i"])("div",l,[Object(a["i"])("button",{class:"expand-modal-close-bar-button",onClick:i[1]||(i[1]=(...e)=>o.closeModal&&o.closeModal(...e))},"[ close ]")]),Object(a["i"])("div",{class:"expand-modal-close-area",onClick:i[2]||(i[2]=(...e)=>o.closeModal&&o.closeModal(...e))}),Object(a["i"])("figure",n,[Object(a["i"])("img",{class:"expand-modal-media-placeholder",src:o.placeholder(t.width,t.height),width:t.width,height:t.height,"aria-hidden":"true",tabindex:"-1","data-nosnippet":""},null,8,["src","width","height"]),t.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"expand-modal-media-item",width:t.width,height:t.height,poster:t.thumb,alt:t.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[Object(a["i"])("source",{src:t.source,type:"video/mp4"},null,8,["src"])],8,["width","height","poster","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"expand-modal-media-item",width:t.width,height:t.height,alt:t.alt,src:t.source},null,8,["width","height","alt","src"])),[[d,{src:t.source,loading:t.thumb}]]),Object(a["i"])("button",{class:"expand-modal-close-bottom",onClick:i[3]||(i[3]=(...e)=>o.closeModal&&o.closeModal(...e))},"[ close ]")])])}var r={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(e,i){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${i}" width="${e}" height="${i}" %3E%3C/svg%3E`},closeModal(){let e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame(()=>{window.scrollTo(0,e)})}}};r.render=c;i["a"]=r},c080:function(e,i,t){},c651:function(e,i,t){"use strict";var a=t("7a23");const s={class:"internal-footer"},l=Object(a["i"])("h2",{class:"internal-footer-title"},"Related",-1),n={class:"internal-footer-related"},c=Object(a["h"])("Metcha"),r=Object(a["h"])("Transa"),o=Object(a["h"])("Brazilian Leather"),d=Object(a["h"])("Mor"),m=Object(a["h"])("Coza"),b=Object(a["h"])("Melissa"),h=Object(a["h"])("Minimelissa"),p=Object(a["h"])("Marco Almeida"),j=Object(a["h"])("Nathalia Bond"),O=Object(a["h"])("Cecerelê"),u=Object(a["h"])("Vibra"),g=Object(a["h"])("Genesysinf"),w=Object(a["g"])('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a><p class="internal-footer-items-note">All media on this domain was taken by screenshots from public URLs and/or local development data.<br>The current website or origin of the media may have changed or may change in the future.</p></div>',1);function f(e,i,t,f,v,x){const M=Object(a["w"])("router-link");return Object(a["r"])(),Object(a["e"])("footer",s,[l,Object(a["i"])("div",n,[Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:Object(a["D"])(()=>[c]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:Object(a["D"])(()=>[r]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:Object(a["D"])(()=>[o]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:Object(a["D"])(()=>[d]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:Object(a["D"])(()=>[m]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:Object(a["D"])(()=>[b]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:Object(a["D"])(()=>[h]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:Object(a["D"])(()=>[p]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/clinica-de-desenvolvimento-nathalia-bond"},{default:Object(a["D"])(()=>[j]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/cecerele"},{default:Object(a["D"])(()=>[O]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:Object(a["D"])(()=>[u]),_:1}),Object(a["i"])(M,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:Object(a["D"])(()=>[g]),_:1})]),w])}var v={name:"Related",data(){return{modal:this.$store.getters.getModal}}};v.render=f;i["a"]=v},e2e2:function(e,i,t){"use strict";t("c080")}}]);
//# sourceMappingURL=minimelissa.833c94ef.js.map