(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["mor"],{"020a":function(e,t,i){"use strict";i("a224")},"0680":function(e,t,i){"use strict";var a=i("7a23"),r=Object(a["i"])("button",{class:"expand-modal-open"},"Tap to open",-1);function o(e,t,i,o,s,n){var l=Object(a["x"])("lazy");return i.canExpand?(Object(a["r"])(),Object(a["e"])("figure",{key:0,class:"internal-expand",onClick:t[1]||(t[1]=function(){return n.openModal&&n.openModal.apply(n,arguments)}),style:s.styles,title:i.label},[Object(a["i"])("img",{class:"render-placeholder",src:n.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,["src","width","height"]),i.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"render-media "+i.classes,poster:s.poster[0],width:i.width,height:i.height,alt:i.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(a["i"])("source",{src:s.video[1],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"render-media "+i.classes,width:i.width,height:i.height,alt:i.label},null,10,["width","height","alt"])),[[l,{src:s.storage+i.src+s.q50,loading:s.storage+i.src+s.thumb}]]),r],12,["title"])):(Object(a["r"])(),Object(a["e"])("figure",{key:1,style:s.styles,title:i.label},[Object(a["i"])("img",{class:"render-placeholder",src:n.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,["src","width","height"]),i.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"render-media "+i.classes,poster:s.poster[0],width:i.width,height:i.height,alt:i.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(a["i"])("source",{src:s.video[0],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"render-media "+i.classes,width:i.width,height:i.height,alt:i.label},null,10,["width","height","alt"])),[[l,{src:s.storage+i.src+s.q50,loading:s.storage+i.src+s.thumb}]])],12,["title"]))}i("a9e3"),i("99af");var s="-mozjpg",n=".jpg",l=".mp4.jpg-thumb.jpg",c=".mp4-scaledown-2x",d=".mp4",h={name:"Media",data:function(){return{storage:this.$store.getters.getStorage,thumb:s+"3-MSSIM-tuned-kodak"+n,q50:s+"-50"+n,q100:s+"-uncompressed"+n,high:!1,styles:"",poster:[],video:[]}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created:function(){if(this.isVideo){var e=this.storage+this.src;this.poster[0]=e+l,this.poster[1]=e+c+l,this.video[0]=e+d,this.video[1]=e+c+d}},mounted:function(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder:function(e,t){return'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(e," ").concat(t,'"%3E%3C/svg%3E')},openModal:function(){var e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}};h.render=o;t["a"]=h},"1dde":function(e,t,i){var a=i("d039"),r=i("b622"),o=i("2d00"),s=r("species");e.exports=function(e){return o>=51||!a((function(){var t=[],i=t.constructor={};return i[s]=function(){return{foo:1}},1!==t[e](Boolean).foo}))}},5296:function(e,t,i){"use strict";var a=i("7a23"),r={class:"expand-modal-content"},o={class:"expand-modal-close-bar"},s={class:"expand-modal-media-figure"};function n(e,t,i,n,l,c){var d=Object(a["x"])("lazy");return Object(a["r"])(),Object(a["e"])("div",r,[Object(a["i"])("div",o,[Object(a["i"])("button",{class:"expand-modal-close-bar-button",onClick:t[1]||(t[1]=function(){return c.closeModal&&c.closeModal.apply(c,arguments)})},"[ close ]")]),Object(a["i"])("div",{class:"expand-modal-close-area",onClick:t[2]||(t[2]=function(){return c.closeModal&&c.closeModal.apply(c,arguments)})}),Object(a["i"])("figure",s,[Object(a["i"])("img",{class:"expand-modal-media-placeholder",src:c.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,["src","width","height"]),i.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"expand-modal-media-item",width:i.width,height:i.height,poster:i.thumb,alt:i.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[Object(a["i"])("source",{src:i.source,type:"video/mp4"},null,8,["src"])],8,["width","height","poster","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"expand-modal-media-item",width:i.width,height:i.height,alt:i.alt},null,8,["width","height","alt"])),[[d,{src:i.source,loading:i.thumb}]]),Object(a["i"])("button",{class:"expand-modal-close-bottom",onClick:t[3]||(t[3]=function(){return c.closeModal&&c.closeModal.apply(c,arguments)})},"[ close ]")])])}i("a9e3"),i("99af");var l={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder:function(e,t){return'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(e," ").concat(t,'"%3E%3C/svg%3E')},closeModal:function(){var e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame((function(){window.scrollTo(0,e)}))}}};l.render=n;t["a"]=l},8418:function(e,t,i){"use strict";var a=i("c04e"),r=i("9bf2"),o=i("5c6c");e.exports=function(e,t,i){var s=a(t);s in e?r.f(e,s,o(0,i)):e[s]=i}},"99af":function(e,t,i){"use strict";var a=i("23e7"),r=i("d039"),o=i("e8b5"),s=i("861d"),n=i("7b0b"),l=i("50c4"),c=i("8418"),d=i("65f0"),h=i("1dde"),u=i("b622"),b=i("2d00"),m=u("isConcatSpreadable"),p=9007199254740991,f="Maximum allowed index exceeded",g=b>=51||!r((function(){var e=[];return e[m]=!1,e.concat()[0]!==e})),j=h("concat"),O=function(e){if(!s(e))return!1;var t=e[m];return void 0!==t?!!t:o(e)},w=!g||!j;a({target:"Array",proto:!0,forced:w},{concat:function(e){var t,i,a,r,o,s=n(this),h=d(s,0),u=0;for(t=-1,a=arguments.length;t<a;t++)if(o=-1===t?s:arguments[t],O(o)){if(r=l(o.length),u+r>p)throw TypeError(f);for(i=0;i<r;i++,u++)i in o&&c(h,u,o[i])}else{if(u>=p)throw TypeError(f);c(h,u++,o)}return h.length=u,h}})},a224:function(e,t,i){},ba94:function(e,t,i){"use strict";i.r(t);var a=i("7a23"),r=Object(a["i"])("h2",{class:"internal-title"},"MOR",-1),o={class:"internal-main"},s=Object(a["g"])('<div class="internal-description"><h3 class="internal-description-text"><a href="https://transainc.com/cases/mor?utm_source=luiskr.com" target="_blank">MOR&#39;s website</a> was developed at Transa. </h3><p class="internal-description-text"> It uses Vanilla JS, Less and Laravel (PHP). </p><p class="internal-description-text"> The goal of the project was to build a fast and beautiful experience connecting MOR&#39;s channels and community in one place. </p><p class="internal-description-text"> The JS and CSS are both less than 50k in size for the entire website to be loaded at blazing fast speeds and engage with MOR&#39;s community. </p><p class="internal-description-text"> The main challenge was to code a feed with articles and links to MOR&#39;s VTEX store, which was also re-designed by Transa, creating a cohesive experience between the store and the website. </p></div>',1),n={class:"internal-extra"},l={class:"internal-extra-scroll"},c={class:"internal-extra-item"},d={class:"internal-extra-item"},h={class:"internal-extra-item"},u=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," The store was re-stylized, changing the entire identity inside the already built store using the VTEX e-commerce platform. ")],-1),b={class:"internal-extra"},m={class:"internal-extra-scroll"},p={class:"internal-extra-item landscape"},f={class:"internal-extra-item"},g={class:"internal-extra-item"},j={class:"internal-extra-item"},O=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," Working at Transa, we also built a where to find for the brand, listing its main locations using the Google Maps API. ")],-1),w={class:"internal-extra"},v={class:"internal-extra-scroll"},x={class:"internal-extra-item landscape"},y={class:"internal-extra-item"},k={key:0,id:"#modal",class:"modal-above"};function M(e,t,i,M,E,V){var q=Object(a["w"])("Media"),_=Object(a["w"])("Related"),R=Object(a["w"])("MediaExpanded");return Object(a["r"])(),Object(a["e"])("article",{class:E.modal.class},[Object(a["i"])("div",{id:"#main",class:"internal modal-below",style:"transform: translateY(-"+E.modal.transform+"px);"},[r,Object(a["i"])("div",o,[Object(a["i"])(q,{classes:"internal-main-item",src:"mor/site/mor.com.br-31-03-19",width:1947,height:976,isVideo:!0,label:"MOR: homepage full tour"})]),Object(a["i"])("section",null,[s,Object(a["i"])("div",n,[Object(a["i"])("div",l,[Object(a["i"])("div",c,[Object(a["i"])(q,{src:"mor/site/mor.com.br-31-03-19-1-mobile",width:1920,height:4167,canExpand:!0,isVideo:!0,label:""})]),Object(a["i"])("div",d,[Object(a["i"])(q,{src:"mor/site/mor-article--mor-explica-como-cuidar-da-sua-piscina",width:1920,height:5996,canExpand:!0,label:""})]),Object(a["i"])("div",h,[Object(a["i"])(q,{src:"mor/site/mor-article--cada-doçura-da-linha-baby",width:1920,height:4318,canExpand:!0,label:""})])])])]),Object(a["i"])("section",null,[u,Object(a["i"])("div",b,[Object(a["i"])("div",m,[Object(a["i"])("div",p,[Object(a["i"])(q,{src:"mor/loja/mor-lojamor-tour",width:1939,height:976,canExpand:!0,isVideo:!0,label:"MOR: store tour "})]),Object(a["i"])("div",f,[Object(a["i"])(q,{src:"mor/loja/https-www.lojamor.com.br-mobile",width:833,height:1728,canExpand:!0,isVideo:!0,label:"MOR: store mobile tour "})]),Object(a["i"])("div",g,[Object(a["i"])(q,{src:"mor/loja/mor-lojamor--categoria-isotermicos-2020-12-15",width:1920,height:5017,canExpand:!0,label:"MOR: store - category page screenshoot"})]),Object(a["i"])("div",j,[Object(a["i"])(q,{src:"mor/loja/mor-lojamor--produto-sombrinha-joy-sortida-3778-verde-p-2020-12-15",width:1920,height:5112,canExpand:!0,label:"MOR: store - product page screenshoot"})])])])]),Object(a["i"])("section",null,[O,Object(a["i"])("div",w,[Object(a["i"])("div",v,[Object(a["i"])("div",x,[Object(a["i"])(q,{src:"mor/where-to-find/mor-onde-encontrar",width:1947,height:976,canExpand:!0,isVideo:!0,label:"MOR: where to find tour"})]),Object(a["i"])("div",y,[Object(a["i"])(q,{src:"mor/where-to-find/mor.com.br-onde-encontrar-31-03-19-1-mobile",width:834,height:1728,canExpand:!0,isVideo:!0,label:"MOR: where to find mobile tour"})])])])]),Object(a["i"])(_)],4),E.modal.open?(Object(a["r"])(),Object(a["e"])("div",k,[Object(a["i"])(R,{source:E.modal.media.source,thumb:E.modal.media.thumb,alt:E.modal.media.alt,width:E.modal.media.width,height:E.modal.media.height,isVideo:E.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):Object(a["f"])("",!0)],2)}var E=i("0680"),V=i("5296"),q=i("c651"),_={data:function(){return{modal:this.$store.getters.getModal}},created:function(){document.title=this.$route.meta.title},mounted:function(){setTimeout((function(){window.scrollTo(0,0)}),500)},components:{Media:E["a"],MediaExpanded:V["a"],Related:q["a"]},name:"Mor"};i("020a");_.render=M;t["default"]=_},c651:function(e,t,i){"use strict";var a=i("7a23"),r={class:"internal-footer"},o=Object(a["i"])("h2",{class:"internal-footer-title"},"Related",-1),s={class:"internal-footer-related"},n=Object(a["h"])("brazilian leather"),l=Object(a["h"])("coza"),c=Object(a["h"])("genesysinf"),d=Object(a["h"])("marco almeida"),h=Object(a["h"])("melissa"),u=Object(a["h"])("metcha"),b=Object(a["h"])("minimelissa"),m=Object(a["h"])("mor"),p=Object(a["h"])("transa"),f=Object(a["h"])("vibra"),g=Object(a["g"])('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a></div>',1);function j(e,t,i,j,O,w){var v=Object(a["w"])("router-link");return Object(a["r"])(),Object(a["e"])("footer",r,[o,Object(a["i"])("div",s,[Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:Object(a["D"])((function(){return[n]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:Object(a["D"])((function(){return[l]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:Object(a["D"])((function(){return[c]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:Object(a["D"])((function(){return[d]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:Object(a["D"])((function(){return[h]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:Object(a["D"])((function(){return[u]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:Object(a["D"])((function(){return[b]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:Object(a["D"])((function(){return[m]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:Object(a["D"])((function(){return[p]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:Object(a["D"])((function(){return[f]})),_:1})]),g])}var O={name:"Related",data:function(){return{modal:this.$store.getters.getModal}}};O.render=j;t["a"]=O}}]);
//# sourceMappingURL=mor.d17e679c.js.map