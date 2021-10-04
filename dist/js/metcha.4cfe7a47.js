(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["metcha"],{"0680":function(e,t,i){"use strict";var a=i("7a23"),c=Object(a["i"])("button",{class:"expand-modal-open"},"Tap to open",-1);function s(e,t,i,s,r,l){var n=Object(a["x"])("lazy");return i.canExpand?(Object(a["r"])(),Object(a["e"])("figure",{key:0,class:"internal-expand",onClick:t[1]||(t[1]=function(){return l.openModal&&l.openModal.apply(l,arguments)}),style:r.styles,title:i.label},[Object(a["i"])("img",{class:"render-placeholder",src:l.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,["src","width","height"]),i.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"render-media "+i.classes,poster:r.poster[0],width:i.width,height:i.height,alt:i.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(a["i"])("source",{src:r.video[1],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"render-media "+i.classes,width:i.width,height:i.height,alt:i.label},null,10,["width","height","alt"])),[[n,{src:r.storage+i.src+r.q50,loading:r.storage+i.src+r.thumb}]]),c],12,["title"])):(Object(a["r"])(),Object(a["e"])("figure",{key:1,style:r.styles,title:i.label},[Object(a["i"])("img",{class:"render-placeholder",src:l.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,["src","width","height"]),i.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"render-media "+i.classes,poster:r.poster[0],width:i.width,height:i.height,alt:i.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(a["i"])("source",{src:r.video[0],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"render-media "+i.classes,width:i.width,height:i.height,alt:i.label},null,10,["width","height","alt"])),[[n,{src:r.storage+i.src+r.q50,loading:r.storage+i.src+r.thumb}]])],12,["title"]))}i("a9e3"),i("99af");var r="-mozjpg",l=".jpg",n=".mp4.jpg-thumb.jpg",o=".mp4-scaledown-2x",h=".mp4",d={name:"Media",data:function(){return{storage:this.$store.getters.getStorage,thumb:r+"3-MSSIM-tuned-kodak"+l,q50:r+"-50"+l,q100:r+"-uncompressed"+l,high:!1,styles:"",poster:[],video:[]}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created:function(){if(this.isVideo){var e=this.storage+this.src;this.poster[0]=e+n,this.poster[1]=e+o+n,this.video[0]=e+h,this.video[1]=e+o+h}},mounted:function(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder:function(e,t){return'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(e," ").concat(t,'"%3E%3C/svg%3E')},openModal:function(){var e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}};d.render=s;t["a"]=d},"15e3":function(e,t,i){"use strict";i.r(t);var a=i("7a23"),c=Object(a["i"])("h2",{class:"internal-title"},"METCHA",-1),s={class:"internal-main"},r=Object(a["g"])('<div class="internal-description"><h3 class="internal-description-text"><a href="https://metcha.com?utm_source=luiskr.com" target="_blank">METCHA</a> is the oracle of leather design culture. </h3><p class="internal-description-text"> Seeking to tell the most compelling stories within the worlds of design, art, fashion and lifestyle, shining a spotlight on the subjects and the individuals that make up the everyday lives of the people who shape the world of today. </p><p class="internal-description-text"> Through bold, fresh and honest storytelling, METCHA hopes to encourage innovative thinking, inspiring people to continue to evolve the ever-expanding culture of creativity. </p><p class="internal-description-text"><a href="https://transainc.com/category/metcha?utm_source=luiskr.com" target="_blank">METCHA&#39;s mission is to bring forward the best projects and curate the most stimulating stories</a>, inspiring a generation of tastemakers, trendsetters &amp; style-conscious individuals to also understand and see leather as an exciting creative partner. </p><p class="internal-description-text"> The project started in 2019, conceived, created and developed at <a href="https://transainc.com?utm_source=luiskr.com" target="_blank">Transa</a>. </p><p class="internal-description-text"> I&#39;m currently the Leading front end developer of the project. </p><p class="internal-description-text"> To realize <a href="https://transainc.com/cases/metcha?utm_source=luiskr.com" target="_blank">METCHA&#39;s project</a>, VUE.js, Sass and PHP (Laravel) were used on the development, specially VUE, to enable all the styling and the website identity while keeping a fast, dynamic and smooth experience. </p></div>',1),l={class:"internal-extra"},n={class:"internal-extra-scroll"},o={class:"internal-extra-item"},h={class:"internal-extra-item landscape"},d={class:"internal-extra-item landscape"},m={class:"internal-extra-item"},b={class:"internal-extra-item"},u=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," Speaking of dynamic experiences, check out some of the incredible layouts created by a very talented team working on metcha.com. "),Object(a["i"])("p",{class:"internal-description-text"}," Those articles were a real challenge to code, METCHA's uses CSS and typography heavily to enable unique experiences and feels for every article. ")],-1),p={class:"internal-extra"},g={class:"internal-extra-scroll"},j={class:"internal-extra-item landscape"},f={class:"internal-extra-item"},O={class:"internal-extra-item"},w={class:"internal-extra-item"},v={class:"internal-extra-item"},x={class:"internal-extra-item"},E={class:"internal-extra-item"},k={class:"internal-extra-item"},y={class:"internal-extra-item"},A={class:"internal-extra-item"},M={class:"internal-extra-item"},C={class:"internal-extra-item"},T={class:"internal-extra-item"},H={class:"internal-extra-item"},V={class:"internal-extra-item"},S={class:"internal-extra-item"},_={class:"internal-extra-item"},q={class:"internal-extra-item"},z={class:"internal-extra-item"},D={class:"internal-extra-item"},B={class:"internal-extra-item"},$={class:"internal-extra-item"},R={class:"internal-extra-item"},L={class:"internal-extra-item"},N={class:"internal-extra-item"},I={class:"internal-extra-item"},P={class:"internal-extra-item"},J={class:"internal-extra-item"},U={class:"internal-extra-item"},Y={class:"internal-extra-item"},F={class:"internal-extra-item"},G={class:"internal-extra-item"},K={class:"internal-extra-item"},W=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," All those articles, and many more, powered by a powerful CMS, developed by Renan Machado, and with the front end customized by myself to the team at Transa. ")],-1),Q={class:"internal-extra"},X={class:"internal-extra-scroll"},Z={class:"internal-extra-item landscape"},ee={class:"internal-extra-item landscape"},te={class:"internal-extra-item landscape"},ie={class:"internal-extra-item landscape"},ae=Object(a["i"])("div",{class:"internal-description"},[Object(a["i"])("h3",{class:"internal-description-text"}," Another challenge was METCHA's newsletter, created dynamically on the metcha CMS, and sent weekly with a unique identity. ")],-1),ce={class:"internal-extra"},se={class:"internal-extra-scroll"},re={class:"internal-extra-item"},le={class:"internal-extra-item landscape"},ne={class:"internal-extra-item"},oe={class:"internal-extra-item"},he={key:0,id:"#modal",class:"modal-above"};function de(e,t,i,de,me,be){var ue=Object(a["w"])("Media"),pe=Object(a["w"])("Related"),ge=Object(a["w"])("MediaExpanded");return Object(a["r"])(),Object(a["e"])("article",{class:me.modal.class},[Object(a["i"])("div",{id:"#main",class:"project modal-below",style:"transform: translateY(-"+me.modal.transform+"px);"},[c,Object(a["i"])("div",s,[Object(a["i"])(ue,{classes:"internal-main-item",src:"metcha/feed/metcha.com-2020-2021-website-tour",width:1924,height:928,isVideo:!0,label:"METCHA -  feed 2020/2021 tour"})]),Object(a["i"])("section",null,[r,Object(a["i"])("div",l,[Object(a["i"])("div",n,[Object(a["i"])("div",o,[Object(a["i"])(ue,{src:"metcha/feed/metcha.com-2021-mobile-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"METCHA - feed 2021 mobile tour"})]),Object(a["i"])("div",h,[Object(a["i"])(ue,{src:"metcha/feed/metcha.com-2019-website-tour",width:1463,height:800,isVideo:!0,canExpand:!0,label:"METCHA - feed 2019 tour"})]),Object(a["i"])("div",d,[Object(a["i"])(ue,{src:"metcha/feed/metcha.com-mobile",width:832,height:1728,isVideo:!0,canExpand:!0,label:"METCHA - feed 2019 mobile tour"})]),Object(a["i"])("div",m,[Object(a["i"])(ue,{src:"metcha/feed/metcha.com-2020-2021-website-feed-full-page",width:1920,height:28800,canExpand:!0,label:"METCHA - feed 2020/2021 screenshoot"})]),Object(a["i"])("div",b,[Object(a["i"])(ue,{src:"metcha/acessibility/metcha-acessibility-jun-2021-mobile-mobile",width:831,height:1712,isVideo:!0,canExpand:!0,label:"METCHA - Acessibility features"})])])])]),Object(a["i"])("section",null,[u,Object(a["i"])("div",p,[Object(a["i"])("div",g,[Object(a["i"])("div",j,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-full-article-tour",width:1929,height:1008,canExpand:!0,isVideo:!0,label:"METCHA - Article: Cruella's villainism fashionism is premiering next week tour"})]),Object(a["i"])("div",f,[Object(a["i"])(ue,{src:"metcha/articles/metcha-willow-smith-mobile-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"METCHA - Article: Willow Smith mobile tour"})]),Object(a["i"])("div",O,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-5-looks-to-steal-from-elsa-hosk-2021-04-25",width:1920,height:11507,canExpand:!0,label:"METCHA - Article: 5-looks-to-steal-from-elsa-hosk screenshoot"})]),Object(a["i"])("div",w,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-a-very-special-project-the-lv-x-maison-tamboite-new-bike-2020-12-15",width:1920,height:10159,canExpand:!0,label:"METCHA - Article: a-very-special-project-the-lv-x-maison-tamboite-new-bike screenshoot"})]),Object(a["i"])("div",v,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-air-dior-1-and-the-sneaker-market-worth-us-79-billion-2021-06-03-13",width:1920,height:8084,canExpand:!0,label:"METCHA - Article: air-dior-1-and-the-sneaker-market-worth-us-79-billion-20 screenshoot"})]),Object(a["i"])("div",x,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-apartment-13-by-studio-modektura-2021-06-03-13",width:1920,height:9128,canExpand:!0,label:"METCHA - Article: apartment-13-by-studio-modektura-20 screenshoot"})]),Object(a["i"])("div",E,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-ashya-is-revolutionizing-the-travel-goods-market-2021-04-25",width:1920,height:20971,canExpand:!0,label:"METCHA - Article: ashya-is-revolutionizing-the-travel-goods-market screenshoot"})]),Object(a["i"])("div",k,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-behind-the-creation-of-the-aj-xi-prototype-2020-12-15",width:1920,height:19679,canExpand:!0,label:"METCHA - Article: behind-the-creation-of-the-aj-xi-prototype screenshoot"})]),Object(a["i"])("div",y,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-bill-amberg-studio-moore-giles-collection-2021-06-03-13",width:1920,height:17382,canExpand:!0,label:"METCHA - Article: bill-amberg-studio-moore-giles-collection-20 screenshoot"})]),Object(a["i"])("div",A,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-13",width:1920,height:14137,canExpand:!0,label:"METCHA - Article: cruella-s-villainism-fashionism-is-premiering-next-week-20 screenshoot"})]),Object(a["i"])("div",M,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-daniel-arsham-s-art-storage-space-2021-06-03-13",width:1920,height:11282,canExpand:!0,label:"METCHA - Article: daniel-arsham-s-art-storage-space-20 screenshoot"})]),Object(a["i"])("div",C,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-deston-isas-pics-of-la-s-automotive-scene-2021-06-03-13",width:1920,height:10630,canExpand:!0,label:"METCHA - Article: deston-isas-pics-of-la-s-automotive-scene-20 screenshoot"})]),Object(a["i"])("div",T,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-dion-lee-ss21-the-need-for-new-sustainable-choices-2020-12-15",width:1920,height:8361,canExpand:!0,label:"METCHA - Article: dion-lee-ss21-the-need-for-new-sustainable-choices screenshoot"})]),Object(a["i"])("div",H,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-hunt-house-in-malibu-2021-06-03-13",width:1920,height:10310,canExpand:!0,label:"METCHA - Article: hunt-house-in-malibu-20 screenshoot"})]),Object(a["i"])("div",V,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-kylie-jenner-for-tmrw-2021-06-03-13",width:1920,height:11419,canExpand:!0,label:"METCHA - Article: kylie-jenner-for-tmrw-20 screenshoot"})]),Object(a["i"])("div",S,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-maido-by-child-studio-2021-06-03-13",width:1920,height:9787,canExpand:!0,label:"METCHA - Article: maido-by-child-studio-20 screenshoot"})]),Object(a["i"])("div",_,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-max-poglia-s-bags-are-never-alike-2021-06-03-13",width:1920,height:18828,canExpand:!0,label:"METCHA - Article: max-poglia-s-bags-are-never-alike-20 screenshoot"})]),Object(a["i"])("div",q,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-mercedes-benz-eqs-interior-show-a-green-tech-statement-2021-04-25",width:1920,height:9413,canExpand:!0,label:"METCHA - Article: mercedes-benz-eqs-interior-show-a-green-tech-statement screenshoot"})]),Object(a["i"])("div",z,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-new-bugatti-s-les-legendes-du-ciel-2021-06-03-13",width:1920,height:13685,canExpand:!0,label:"METCHA - Article: new-bugatti-s-les-legendes-du-ciel-20 screenshoot"})]),Object(a["i"])("div",D,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-niamh-algar-comments-on-working-with-her-idol-2020-12-15",width:1920,height:7546,canExpand:!0,label:"METCHA - Article: niamh-algar-comments-on-working-with-her-idol screenshoot"})]),Object(a["i"])("div",B,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-niels-van-roij-x-heritage-customs-2021-06-03-13",width:1920,height:11445,canExpand:!0,label:"METCHA - Article: niels-van-roij-x-heritage-customs-20 screenshoot"})]),Object(a["i"])("div",$,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-off-white-x-nike-air-force-1-low-2021-06-03-13",width:1920,height:8447,canExpand:!0,label:"METCHA - Article: off-white-x-nike-air-force-1-low-20 screenshoot"})]),Object(a["i"])("div",R,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-rtfkt-studios-brings-the-future-of-kicks-2020-12-15",width:1920,height:6665,canExpand:!0,label:"METCHA - Article: rtfkt-studios-brings-the-future-of-kicks screenshoot"})]),Object(a["i"])("div",L,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-shahd-batal-s-sneaker-collection-2021-06-03-14",width:1920,height:9247,canExpand:!0,label:"METCHA - Article: shahd-batal-s-sneaker-collection-20 screenshoot"})]),Object(a["i"])("div",N,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-2021-06-03-13",width:1920,height:11679,canExpand:!0,label:"METCHA - Article: stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-20 screenshoot"})]),Object(a["i"])("div",I,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-the-7-best-new-balance-drops-from-may-2021-06-03-14",width:1920,height:22243,canExpand:!0,label:"METCHA - Article: the-7-best-new-balance-drops-from-may-20 screenshoot"})]),Object(a["i"])("div",P,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-the-biggest-fits-of-the-week-2021-06-03-13",width:1920,height:16315,canExpand:!0,label:"METCHA - Article: the-biggest-fits-of-the-week-20 screenshoot"})]),Object(a["i"])("div",J,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-the-classic-ajs-arrived-in-april-2021-04-25",width:1920,height:9623,canExpand:!0,label:"METCHA - Article: the-classic-ajs-arrived-in-april screenshoot"})]),Object(a["i"])("div",U,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-the-design-museum-london-the-past-and-future-of-sneakers-2021-04-25",width:1920,height:10267,canExpand:!0,label:"METCHA - Article: the-design-museum-london-the-past-and-future-of-sneakers screenshoot"})]),Object(a["i"])("div",Y,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma-2021-04-25",width:1920,height:11058,canExpand:!0,label:"METCHA - Article: the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma screenshoot"})]),Object(a["i"])("div",F,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-troye-sivan-s-victorian-era-melbourne-house-2021-04-25",width:1920,height:10844,canExpand:!0,label:"METCHA - Article: troye-sivan-s-victorian-era-melbourne-house screenshoot"})]),Object(a["i"])("div",G,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione-2020-12-15",width:1920,height:9619,canExpand:!0,label:"METCHA - Article: we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione screenshoot"})]),Object(a["i"])("div",K,[Object(a["i"])(ue,{src:"metcha/articles/metcha.com--article-you-gotta-see-croft-house-s-approach-to-leather-furn-2021-04-25",width:1920,height:21718,canExpand:!0,label:"METCHA - Article: you-gotta-see-croft-house-s-approach-to-leather-furn screenshoot"})])])])]),Object(a["i"])("section",null,[W,Object(a["i"])("div",Q,[Object(a["i"])("div",X,[Object(a["i"])("div",Z,[Object(a["i"])(ue,{src:"metcha/cms/metcha.com-cms",width:1443,height:784,canExpand:!0,isVideo:!0,label:"METCHA CMS: tour"})]),Object(a["i"])("div",ee,[Object(a["i"])(ue,{src:"metcha/cms/metcha.com-cms-metcha-midia-editor",width:1920,height:1247,canExpand:!0,label:"METCHA CMS: media editor"})]),Object(a["i"])("div",te,[Object(a["i"])(ue,{src:"metcha/cms/metcha.com-cms-metcha-posts-6-editar-feed",width:1920,height:4632,canExpand:!0,label:"METCHA CMS: post editing tool"})]),Object(a["i"])("div",ie,[Object(a["i"])(ue,{src:"metcha/cms/metcha.com-cms-metcha-posts-editar",width:1920,height:1144,canExpand:!0,label:"METCHA CMS: post editing"})])])])]),Object(a["i"])("section",null,[ae,Object(a["i"])("div",ce,[Object(a["i"])("div",se,[Object(a["i"])("div",re,[Object(a["i"])(ue,{src:"metcha/newsletter/metcha-newsletter",width:831,height:1728,canExpand:!0,isVideo:!0,label:"METCHA: newsletter"})]),Object(a["i"])("div",le,[Object(a["i"])(ue,{src:"metcha/newsletter/metcha.com-cms-metcha-newsletter-generator",width:1455,height:768,canExpand:!0,isVideo:!0,label:"METCHA CMS: newsletter generator"})]),Object(a["i"])("div",ne,[Object(a["i"])(ue,{src:"metcha/newsletter/newsletter-generator-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"METCHA CMS: newsletter generator mobile"})]),Object(a["i"])("div",oe,[Object(a["i"])(ue,{src:"metcha/newsletter/metcha-newsletter-full-page",width:1920,height:7066,canExpand:!0,label:"METCHA: newsletter"})])])])]),Object(a["i"])(pe)],4),me.modal.open?(Object(a["r"])(),Object(a["e"])("div",he,[Object(a["i"])(ge,{source:me.modal.media.source,thumb:me.modal.media.thumb,alt:me.modal.media.alt,width:me.modal.media.width,height:me.modal.media.height,isVideo:me.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):Object(a["f"])("",!0)],2)}var me=i("0680"),be=i("5296"),ue=i("c651"),pe={data:function(){return{modal:this.$store.getters.getModal}},created:function(){document.title=this.$route.meta.title},mounted:function(){setTimeout((function(){window.scrollTo(0,0)}),500)},components:{Media:me["a"],MediaExpanded:be["a"],Related:ue["a"]},name:"METCHA"};i("6871");pe.render=de;t["default"]=pe},"1dde":function(e,t,i){var a=i("d039"),c=i("b622"),s=i("2d00"),r=c("species");e.exports=function(e){return s>=51||!a((function(){var t=[],i=t.constructor={};return i[r]=function(){return{foo:1}},1!==t[e](Boolean).foo}))}},"3f8a":function(e,t,i){},5296:function(e,t,i){"use strict";var a=i("7a23"),c={class:"expand-modal-content"},s={class:"expand-modal-close-bar"},r={class:"expand-modal-media-figure"};function l(e,t,i,l,n,o){var h=Object(a["x"])("lazy");return Object(a["r"])(),Object(a["e"])("div",c,[Object(a["i"])("div",s,[Object(a["i"])("button",{class:"expand-modal-close-bar-button",onClick:t[1]||(t[1]=function(){return o.closeModal&&o.closeModal.apply(o,arguments)})},"[ close ]")]),Object(a["i"])("div",{class:"expand-modal-close-area",onClick:t[2]||(t[2]=function(){return o.closeModal&&o.closeModal.apply(o,arguments)})}),Object(a["i"])("figure",r,[Object(a["i"])("img",{class:"expand-modal-media-placeholder",src:o.placeholder(i.width,i.height),width:i.width,height:i.height,alt:" "},null,8,["src","width","height"]),i.isVideo?(Object(a["r"])(),Object(a["e"])("video",{key:1,class:"expand-modal-media-item",width:i.width,height:i.height,poster:i.thumb,alt:i.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[Object(a["i"])("source",{src:i.source,type:"video/mp4"},null,8,["src"])],8,["width","height","poster","alt"])):Object(a["E"])((Object(a["r"])(),Object(a["e"])("img",{key:0,class:"expand-modal-media-item",width:i.width,height:i.height,alt:i.alt},null,8,["width","height","alt"])),[[h,{src:i.source,loading:i.thumb}]]),Object(a["i"])("button",{class:"expand-modal-close-bottom",onClick:t[3]||(t[3]=function(){return o.closeModal&&o.closeModal.apply(o,arguments)})},"[ close ]")])])}i("a9e3"),i("99af");var n={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder:function(e,t){return'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(e," ").concat(t,'"%3E%3C/svg%3E')},closeModal:function(){var e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame((function(){window.scrollTo(0,e)}))}}};n.render=l;t["a"]=n},6871:function(e,t,i){"use strict";i("3f8a")},8418:function(e,t,i){"use strict";var a=i("c04e"),c=i("9bf2"),s=i("5c6c");e.exports=function(e,t,i){var r=a(t);r in e?c.f(e,r,s(0,i)):e[r]=i}},"99af":function(e,t,i){"use strict";var a=i("23e7"),c=i("d039"),s=i("e8b5"),r=i("861d"),l=i("7b0b"),n=i("50c4"),o=i("8418"),h=i("65f0"),d=i("1dde"),m=i("b622"),b=i("2d00"),u=m("isConcatSpreadable"),p=9007199254740991,g="Maximum allowed index exceeded",j=b>=51||!c((function(){var e=[];return e[u]=!1,e.concat()[0]!==e})),f=d("concat"),O=function(e){if(!r(e))return!1;var t=e[u];return void 0!==t?!!t:s(e)},w=!j||!f;a({target:"Array",proto:!0,forced:w},{concat:function(e){var t,i,a,c,s,r=l(this),d=h(r,0),m=0;for(t=-1,a=arguments.length;t<a;t++)if(s=-1===t?r:arguments[t],O(s)){if(c=n(s.length),m+c>p)throw TypeError(g);for(i=0;i<c;i++,m++)i in s&&o(d,m,s[i])}else{if(m>=p)throw TypeError(g);o(d,m++,s)}return d.length=m,d}})},c651:function(e,t,i){"use strict";var a=i("7a23"),c={class:"internal-footer"},s=Object(a["i"])("h2",{class:"internal-footer-title"},"Related",-1),r={class:"internal-footer-related"},l=Object(a["h"])("brazilian leather"),n=Object(a["h"])("coza"),o=Object(a["h"])("genesysinf"),h=Object(a["h"])("marco almeida"),d=Object(a["h"])("melissa"),m=Object(a["h"])("metcha"),b=Object(a["h"])("minimelissa"),u=Object(a["h"])("mor"),p=Object(a["h"])("transa"),g=Object(a["h"])("vibra"),j=Object(a["g"])('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a></div>',1);function f(e,t,i,f,O,w){var v=Object(a["w"])("router-link");return Object(a["r"])(),Object(a["e"])("footer",c,[s,Object(a["i"])("div",r,[Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:Object(a["D"])((function(){return[l]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:Object(a["D"])((function(){return[n]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:Object(a["D"])((function(){return[o]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:Object(a["D"])((function(){return[h]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:Object(a["D"])((function(){return[d]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:Object(a["D"])((function(){return[m]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:Object(a["D"])((function(){return[b]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:Object(a["D"])((function(){return[u]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:Object(a["D"])((function(){return[p]})),_:1}),Object(a["i"])(v,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:Object(a["D"])((function(){return[g]})),_:1})]),j])}var O={name:"Related",data:function(){return{modal:this.$store.getters.getModal}}};O.render=f;t["a"]=O}}]);
//# sourceMappingURL=metcha.4cfe7a47.js.map