(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["metcha"],{"0680":function(e,t,a){"use strict";var i=a("7a23");function c(e,t,a,c,s,r){const l=Object(i["x"])("lazy");return a.canExpand?(Object(i["r"])(),Object(i["e"])("figure",{key:0,class:"internal-expand",onClick:t[1]||(t[1]=(...e)=>r.openModal&&r.openModal(...e)),style:s.styles,title:a.label},[Object(i["i"])("img",{class:"render-placeholder",src:r.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,["src","width","height"]),a.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"render-media "+a.classes,poster:s.poster[0],width:a.width,height:a.height,alt:a.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(i["i"])("source",{src:s.video[1],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"render-media "+a.classes,width:a.width,height:a.height,alt:a.label},null,10,["width","height","alt"])),[[l,{src:s.storage+a.src+s.q50,loading:s.storage+a.src+s.thumb}]]),(Object(i["r"])(),Object(i["e"])(i["a"],null,Object(i["v"])(2,(e=1)=>Object(i["i"])("button",{class:"expand-modal-open-"+e,key:e,"aria-hidden":2===e,"data-no-snippet":""},Object(i["A"])(s.action)+" to open",11,["aria-hidden"])),64))],12,["title"])):(Object(i["r"])(),Object(i["e"])("figure",{key:1,style:s.styles,title:a.label},[Object(i["i"])("img",{class:"render-placeholder",src:r.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,["src","width","height"]),a.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"render-media "+a.classes,poster:s.poster[0],width:a.width,height:a.height,alt:a.label,playsinline:"",autoplay:"",loop:"",muted:""},[Object(i["i"])("source",{src:s.video[0],type:"video/mp4"},null,8,["src"])],10,["poster","width","height","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"render-media "+a.classes,width:a.width,height:a.height,alt:a.label},null,10,["width","height","alt"])),[[l,{src:s.storage+a.src+s.q50,loading:s.storage+a.src+s.thumb}]])],12,["title"]))}const s="-mozjpg",r=".jpg",l=".mp4.jpg-thumb.jpg",n=".mp4-scaledown-2x",o=".mp4";var h={name:"Media",data(){return{storage:this.$store.getters.getStorage,thumb:s+"3-MSSIM-tuned-kodak"+r,q50:s+"-50"+r,q100:s+"-uncompressed"+r,high:!1,styles:"",poster:[],video:[],action:this.$store.getters.getClickOrTap}},props:{classes:{type:String,default:"",required:!1},src:{type:String,required:!0},label:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},canExpand:{type:Boolean,default:!1,required:!1},isVideo:{type:Boolean,default:!1,required:!1}},created(){if(this.isVideo){let e=this.storage+this.src;this.poster[0]=e+l,this.poster[1]=e+n+l,this.video[0]=e+o,this.video[1]=e+n+o}},mounted(){this.canExpand&&(this.styles={position:"relative"})},methods:{placeholder(e,t){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}"%3E%3C/svg%3E`},openModal(){let e=window.scrollY;this.$store.commit("setModal",{transform:e,class:"modal-open",open:!0,media:{source:this.isVideo?this.video[0]:this.storage+this.src+this.q100,thumb:this.isVideo?this.poster[0]:this.storage+this.src+this.thumb,alt:this.label,width:this.width,height:this.height,isVideo:this.isVideo}}),window.scrollTo(0,0)}}};h.render=c;t["a"]=h},"15e3":function(e,t,a){"use strict";a.r(t);var i=a("7a23");const c=Object(i["i"])("h2",{class:"internal-title"},"METCHA",-1),s={class:"internal-main"},r=Object(i["g"])('<div class="internal-description"><h3 class="internal-description-text"><a href="https://metcha.com?utm_source=luiskr.com" target="_blank">METCHA</a> is the oracle of leather design culture. </h3><p class="internal-description-text"> Seeking to tell the most compelling stories within the worlds of design, art, fashion and lifestyle, shining a spotlight on the subjects and the individuals that make up the everyday lives of the people who shape the world of today. </p><p class="internal-description-text"> Through bold, fresh and honest storytelling, METCHA hopes to encourage innovative thinking, inspiring people to continue to evolve the ever-expanding culture of creativity. </p><p class="internal-description-text"><a href="https://transainc.com/category/metcha?utm_source=luiskr.com" target="_blank">METCHA&#39;s mission is to bring forward the best projects and curate the most stimulating stories</a>, inspiring a generation of tastemakers, trendsetters &amp; style-conscious individuals to also understand and see leather as an exciting creative partner. </p><p class="internal-description-text"> The project started in 2019, conceived, created and developed at <a href="https://transainc.com?utm_source=luiskr.com" target="_blank">Transa</a>. </p><p class="internal-description-text"> I&#39;m currently the Leading front end developer of the project. </p><p class="internal-description-text"> To realize <a href="https://transainc.com/cases/metcha?utm_source=luiskr.com" target="_blank">METCHA&#39;s project</a>, VUE.js, Sass and PHP (Laravel) were used on the development, specially VUE, to enable all the styling and the website identity while keeping a fast, dynamic and smooth experience. </p></div>',1),l={class:"internal-extra"},n={class:"internal-extra-scroll"},o={class:"internal-extra-item"},h={class:"internal-extra-item landscape"},d={class:"internal-extra-item landscape"},m={class:"internal-extra-item"},b={class:"internal-extra-item"},p=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," Speaking of dynamic experiences, check out some of the incredible layouts created by a very talented team working on metcha.com. "),Object(i["i"])("p",{class:"internal-description-text"}," Those articles were a real challenge to code, METCHA's uses CSS and typography heavily to enable unique experiences and feels for every article. ")],-1),u={class:"internal-extra"},g={class:"internal-extra-scroll"},j={class:"internal-extra-item"},w={class:"internal-extra-item landscape"},O={class:"internal-extra-item landscape"},f={class:"internal-extra-item"},v={class:"internal-extra-item"},x={class:"internal-extra-item landscape"},E={class:"internal-extra-item"},k={class:"internal-extra-item"},A={class:"internal-extra-item"},M={class:"internal-extra-item"},y={class:"internal-extra-item"},C={class:"internal-extra-item"},T={class:"internal-extra-item"},H={class:"internal-extra-item"},V={class:"internal-extra-item"},S={class:"internal-extra-item"},_={class:"internal-extra-item"},z={class:"internal-extra-item"},q={class:"internal-extra-item"},D={class:"internal-extra-item"},R={class:"internal-extra-item"},B={class:"internal-extra-item"},$={class:"internal-extra-item"},I={class:"internal-extra-item"},L={class:"internal-extra-item"},N={class:"internal-extra-item"},F={class:"internal-extra-item"},P={class:"internal-extra-item"},U={class:"internal-extra-item"},W={class:"internal-extra-item"},G={class:"internal-extra-item"},J={class:"internal-extra-item"},X={class:"internal-extra-item"},Y={class:"internal-extra-item"},K={class:"internal-extra-item"},Q={class:"internal-extra-item"},Z={class:"internal-extra-item"},ee={class:"internal-extra-item"},te=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," All those articles, and many more, powered by a powerful CMS, developed by Renan Machado, and with the front end customized by myself to the team at Transa. ")],-1),ae={class:"internal-extra"},ie={class:"internal-extra-scroll"},ce={class:"internal-extra-item landscape"},se={class:"internal-extra-item landscape"},re={class:"internal-extra-item landscape"},le={class:"internal-extra-item landscape"},ne=Object(i["i"])("div",{class:"internal-description"},[Object(i["i"])("h3",{class:"internal-description-text"}," Another challenge was METCHA's newsletter, created dynamically on the metcha CMS, and sent weekly with a unique identity. ")],-1),oe={class:"internal-extra"},he={class:"internal-extra-scroll"},de={class:"internal-extra-item"},me={class:"internal-extra-item landscape"},be={class:"internal-extra-item"},pe={class:"internal-extra-item"},ue=Object(i["g"])('<div class="internal-description"><h3 class="internal-description-text"> In Nov. 2021 METCHA launched the <a href="https://metcha.com/metcha-forward?utm_source=luiskr.com" rel="noopener">METCHA FORWARD 2022 report</a>, a page compiling over 500+ monthly pieces of content produced with a fresh blend of EXCLUSIVENESS in partnership with CREATIVE EXPONENTS after constant research performed by METCHA&#39;s multicultural digital native team. </h3><p class="internal-description-text"> The first <a href="https://metcha.com/metcha-forward?utm_source=luiskr.com" rel="noopener">METCHA FORWARD</a>release is an analysis of behavioural movements that METCHA&#39;s team has been identifying over the last months. It compiles more than 20 global trends to guide the near future, covering all major leather industry-related categories. </p><p class="internal-description-text"> I participated in the design of this page, with <strong>all team members</strong>, working especially close with <a href="https://www.instagram.com/miabrclls" rel="noopener">Mia</a> and <a href="https://www.instagram.com/saguzeiro" rel="noopener">Sagu</a> for the layout. </p><p class="internal-description-text"> Before, in the coding phase, I used Vue.js, Sass(CSS3) and Laravel(PHP/HTML5) to realize the designed layout and deliver the report by download. </p><p class="internal-description-text"> I also worked with <a href="https://www.instagram.com/renanmachadoloureiro">Renan Machado</a> in the backend of the application. </p></div>',1),ge={class:"internal-extra"},je={class:"internal-extra-scroll"},we={class:"internal-extra-item landscape"},Oe={class:"internal-extra-item"},fe={key:0,id:"#modal",class:"modal-above"};function ve(e,t,a,ve,xe,Ee){const ke=Object(i["w"])("Media"),Ae=Object(i["w"])("Related"),Me=Object(i["w"])("MediaExpanded");return Object(i["r"])(),Object(i["e"])("article",null,[Object(i["i"])("div",{id:"#main",class:"project modal-below",style:"transform: translateY(-"+xe.modal.transform+"px);"},[c,Object(i["i"])("div",s,[Object(i["i"])(ke,{classes:"internal-main-item",src:"metcha/feed/metcha.com-2020-2021-website-tour",width:1924,height:928,isVideo:!0,label:"METCHA -  feed 2020/2021 tour"})]),Object(i["i"])("section",null,[r,Object(i["i"])("div",l,[Object(i["i"])("div",n,[Object(i["i"])("div",o,[Object(i["i"])(ke,{src:"metcha/feed/metcha.com-2021-mobile-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"METCHA - feed 2021 mobile tour"})]),Object(i["i"])("div",h,[Object(i["i"])(ke,{src:"metcha/feed/metcha.com-2019-website-tour",width:1463,height:800,isVideo:!0,canExpand:!0,label:"METCHA - feed 2019 tour"})]),Object(i["i"])("div",d,[Object(i["i"])(ke,{src:"metcha/feed/metcha.com-mobile",width:832,height:1728,isVideo:!0,canExpand:!0,label:"METCHA - feed 2019 mobile tour"})]),Object(i["i"])("div",m,[Object(i["i"])(ke,{src:"metcha/feed/metcha.com-2020-2021-website-feed-full-page",width:1920,height:28800,canExpand:!0,label:"METCHA - feed 2020/2021 screenshoot"})]),Object(i["i"])("div",b,[Object(i["i"])(ke,{src:"metcha/acessibility/metcha-acessibility-jun-2021-mobile-mobile",width:831,height:1712,isVideo:!0,canExpand:!0,label:"METCHA - Acessibility features"})])])])]),Object(i["i"])("section",null,[p,Object(i["i"])("div",u,[Object(i["i"])("div",g,[Object(i["i"])("div",j,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com-article-all-we-know-about-the-new-chevy-beast-concept",width:828,height:1696,canExpand:!0,isVideo:!0,label:"METCHA - Article: All we know about the new Chevy Beast concept"})]),Object(i["i"])("div",w,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com-article-avril-lavigne-brings-pop-punk-back-with-bite-me",width:3840,height:2056,canExpand:!0,isVideo:!0,label:"METCHA - Article: Avril Lavigne brings pop punk back with Bite Me"})]),Object(i["i"])("div",O,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com-article-tradition-high-end-materials-at-villa-rinascimentale",width:828,height:1692,canExpand:!0,isVideo:!0,label:"METCHA - Article: Tradition high end materials at Villa Rinascimentale"})]),Object(i["i"])("div",f,[Object(i["i"])(ke,{src:"metcha/articles/metcha-article-the-shoe-surgeon-took-an-exclusive-sneaker-to-the-metaverse",width:3840,height:13837,canExpand:!0,label:"METCHA - Article: The Shoe Surgeon took an exclusive sneaker to the metaverse"})]),Object(i["i"])("div",v,[Object(i["i"])(ke,{src:"metcha/articles/metcha-article-a-custom-mercedes-benz-300-sl-with-matelasse-like-seats",width:3840,height:17407,canExpand:!0,label:"METCHA - Article: A custom Mercedes Benz 300SL with matelasse like seats"})]),Object(i["i"])("div",x,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-full-article-tour",width:1929,height:1008,canExpand:!0,isVideo:!0,label:"METCHA - Article: Cruella's villainism fashionism is premiering next week tour"})]),Object(i["i"])("div",E,[Object(i["i"])(ke,{src:"metcha/articles/metcha-willow-smith-mobile-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"METCHA - Article: Willow Smith mobile tour"})]),Object(i["i"])("div",k,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-5-looks-to-steal-from-elsa-hosk-2021-04-25",width:1920,height:11507,canExpand:!0,label:"METCHA - Article: 5-looks-to-steal-from-elsa-hosk screenshoot"})]),Object(i["i"])("div",A,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-a-very-special-project-the-lv-x-maison-tamboite-new-bike-2020-12-15",width:1920,height:10159,canExpand:!0,label:"METCHA - Article: a-very-special-project-the-lv-x-maison-tamboite-new-bike screenshoot"})]),Object(i["i"])("div",M,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-air-dior-1-and-the-sneaker-market-worth-us-79-billion-2021-06-03-13",width:1920,height:8084,canExpand:!0,label:"METCHA - Article: air-dior-1-and-the-sneaker-market-worth-us-79-billion-20 screenshoot"})]),Object(i["i"])("div",y,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-apartment-13-by-studio-modektura-2021-06-03-13",width:1920,height:9128,canExpand:!0,label:"METCHA - Article: apartment-13-by-studio-modektura-20 screenshoot"})]),Object(i["i"])("div",C,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-ashya-is-revolutionizing-the-travel-goods-market-2021-04-25",width:1920,height:20971,canExpand:!0,label:"METCHA - Article: ashya-is-revolutionizing-the-travel-goods-market screenshoot"})]),Object(i["i"])("div",T,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-behind-the-creation-of-the-aj-xi-prototype-2020-12-15",width:1920,height:19679,canExpand:!0,label:"METCHA - Article: behind-the-creation-of-the-aj-xi-prototype screenshoot"})]),Object(i["i"])("div",H,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-bill-amberg-studio-moore-giles-collection-2021-06-03-13",width:1920,height:17382,canExpand:!0,label:"METCHA - Article: bill-amberg-studio-moore-giles-collection-20 screenshoot"})]),Object(i["i"])("div",V,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-13",width:1920,height:14137,canExpand:!0,label:"METCHA - Article: cruella-s-villainism-fashionism-is-premiering-next-week-20 screenshoot"})]),Object(i["i"])("div",S,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-daniel-arsham-s-art-storage-space-2021-06-03-13",width:1920,height:11282,canExpand:!0,label:"METCHA - Article: daniel-arsham-s-art-storage-space-20 screenshoot"})]),Object(i["i"])("div",_,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-deston-isas-pics-of-la-s-automotive-scene-2021-06-03-13",width:1920,height:10630,canExpand:!0,label:"METCHA - Article: deston-isas-pics-of-la-s-automotive-scene-20 screenshoot"})]),Object(i["i"])("div",z,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-dion-lee-ss21-the-need-for-new-sustainable-choices-2020-12-15",width:1920,height:8361,canExpand:!0,label:"METCHA - Article: dion-lee-ss21-the-need-for-new-sustainable-choices screenshoot"})]),Object(i["i"])("div",q,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-hunt-house-in-malibu-2021-06-03-13",width:1920,height:10310,canExpand:!0,label:"METCHA - Article: hunt-house-in-malibu-20 screenshoot"})]),Object(i["i"])("div",D,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-kylie-jenner-for-tmrw-2021-06-03-13",width:1920,height:11419,canExpand:!0,label:"METCHA - Article: kylie-jenner-for-tmrw-20 screenshoot"})]),Object(i["i"])("div",R,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-maido-by-child-studio-2021-06-03-13",width:1920,height:9787,canExpand:!0,label:"METCHA - Article: maido-by-child-studio-20 screenshoot"})]),Object(i["i"])("div",B,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-max-poglia-s-bags-are-never-alike-2021-06-03-13",width:1920,height:18828,canExpand:!0,label:"METCHA - Article: max-poglia-s-bags-are-never-alike-20 screenshoot"})]),Object(i["i"])("div",$,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-mercedes-benz-eqs-interior-show-a-green-tech-statement-2021-04-25",width:1920,height:9413,canExpand:!0,label:"METCHA - Article: mercedes-benz-eqs-interior-show-a-green-tech-statement screenshoot"})]),Object(i["i"])("div",I,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-new-bugatti-s-les-legendes-du-ciel-2021-06-03-13",width:1920,height:13685,canExpand:!0,label:"METCHA - Article: new-bugatti-s-les-legendes-du-ciel-20 screenshoot"})]),Object(i["i"])("div",L,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-niamh-algar-comments-on-working-with-her-idol-2020-12-15",width:1920,height:7546,canExpand:!0,label:"METCHA - Article: niamh-algar-comments-on-working-with-her-idol screenshoot"})]),Object(i["i"])("div",N,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-niels-van-roij-x-heritage-customs-2021-06-03-13",width:1920,height:11445,canExpand:!0,label:"METCHA - Article: niels-van-roij-x-heritage-customs-20 screenshoot"})]),Object(i["i"])("div",F,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-off-white-x-nike-air-force-1-low-2021-06-03-13",width:1920,height:8447,canExpand:!0,label:"METCHA - Article: off-white-x-nike-air-force-1-low-20 screenshoot"})]),Object(i["i"])("div",P,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-rtfkt-studios-brings-the-future-of-kicks-2020-12-15",width:1920,height:6665,canExpand:!0,label:"METCHA - Article: rtfkt-studios-brings-the-future-of-kicks screenshoot"})]),Object(i["i"])("div",U,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-shahd-batal-s-sneaker-collection-2021-06-03-14",width:1920,height:9247,canExpand:!0,label:"METCHA - Article: shahd-batal-s-sneaker-collection-20 screenshoot"})]),Object(i["i"])("div",W,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-2021-06-03-13",width:1920,height:11679,canExpand:!0,label:"METCHA - Article: stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-20 screenshoot"})]),Object(i["i"])("div",G,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-the-7-best-new-balance-drops-from-may-2021-06-03-14",width:1920,height:22243,canExpand:!0,label:"METCHA - Article: the-7-best-new-balance-drops-from-may-20 screenshoot"})]),Object(i["i"])("div",J,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-the-biggest-fits-of-the-week-2021-06-03-13",width:1920,height:16315,canExpand:!0,label:"METCHA - Article: the-biggest-fits-of-the-week-20 screenshoot"})]),Object(i["i"])("div",X,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-the-classic-ajs-arrived-in-april-2021-04-25",width:1920,height:9623,canExpand:!0,label:"METCHA - Article: the-classic-ajs-arrived-in-april screenshoot"})]),Object(i["i"])("div",Y,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-the-design-museum-london-the-past-and-future-of-sneakers-2021-04-25",width:1920,height:10267,canExpand:!0,label:"METCHA - Article: the-design-museum-london-the-past-and-future-of-sneakers screenshoot"})]),Object(i["i"])("div",K,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma-2021-04-25",width:1920,height:11058,canExpand:!0,label:"METCHA - Article: the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma screenshoot"})]),Object(i["i"])("div",Q,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-troye-sivan-s-victorian-era-melbourne-house-2021-04-25",width:1920,height:10844,canExpand:!0,label:"METCHA - Article: troye-sivan-s-victorian-era-melbourne-house screenshoot"})]),Object(i["i"])("div",Z,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione-2020-12-15",width:1920,height:9619,canExpand:!0,label:"METCHA - Article: we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione screenshoot"})]),Object(i["i"])("div",ee,[Object(i["i"])(ke,{src:"metcha/articles/metcha.com--article-you-gotta-see-croft-house-s-approach-to-leather-furn-2021-04-25",width:1920,height:21718,canExpand:!0,label:"METCHA - Article: you-gotta-see-croft-house-s-approach-to-leather-furn screenshoot"})])])])]),Object(i["i"])("section",null,[te,Object(i["i"])("div",ae,[Object(i["i"])("div",ie,[Object(i["i"])("div",ce,[Object(i["i"])(ke,{src:"metcha/cms/metcha.com-cms",width:1443,height:784,canExpand:!0,isVideo:!0,label:"METCHA CMS: tour"})]),Object(i["i"])("div",se,[Object(i["i"])(ke,{src:"metcha/cms/metcha.com-cms-metcha-midia-editor",width:1920,height:1247,canExpand:!0,label:"METCHA CMS: media editor"})]),Object(i["i"])("div",re,[Object(i["i"])(ke,{src:"metcha/cms/metcha.com-cms-metcha-posts-6-editar-feed",width:1920,height:4632,canExpand:!0,label:"METCHA CMS: post editing tool"})]),Object(i["i"])("div",le,[Object(i["i"])(ke,{src:"metcha/cms/metcha.com-cms-metcha-posts-editar",width:1920,height:1144,canExpand:!0,label:"METCHA CMS: post editing"})])])])]),Object(i["i"])("section",null,[ne,Object(i["i"])("div",oe,[Object(i["i"])("div",he,[Object(i["i"])("div",de,[Object(i["i"])(ke,{src:"metcha/newsletter/metcha-newsletter",width:831,height:1728,canExpand:!0,isVideo:!0,label:"METCHA: newsletter"})]),Object(i["i"])("div",me,[Object(i["i"])(ke,{src:"metcha/newsletter/metcha.com-cms-metcha-newsletter-generator",width:1455,height:768,canExpand:!0,isVideo:!0,label:"METCHA CMS: newsletter generator"})]),Object(i["i"])("div",be,[Object(i["i"])(ke,{src:"metcha/newsletter/newsletter-generator-mobile",width:828,height:1712,canExpand:!0,isVideo:!0,label:"METCHA CMS: newsletter generator mobile"})]),Object(i["i"])("div",pe,[Object(i["i"])(ke,{src:"metcha/newsletter/metcha-newsletter-full-page",width:1920,height:7066,canExpand:!0,label:"METCHA: newsletter"})])])])]),Object(i["i"])("section",null,[ue,Object(i["i"])("div",ge,[Object(i["i"])("div",je,[Object(i["i"])("div",we,[Object(i["i"])(ke,{src:"metcha/forward-2021/metcha-metcha-forward",width:3840,height:2056,canExpand:!0,isVideo:!0,label:"METCHA Forward: 2021/2022 Report - Tour"})]),Object(i["i"])("div",Oe,[Object(i["i"])(ke,{src:"metcha/forward-2021/metcha-metcha-forward",width:3840,height:4895,canExpand:!0,isVideo:!0,label:"METCHA: Forward: 2021/2022 Report - Full page"})])])])]),Object(i["i"])(Ae)],4),xe.modal.open?(Object(i["r"])(),Object(i["e"])("div",fe,[Object(i["i"])(Me,{source:xe.modal.media.source,thumb:xe.modal.media.thumb,alt:xe.modal.media.alt,width:xe.modal.media.width,height:xe.modal.media.height,isVideo:xe.modal.media.isVideo},null,8,["source","thumb","alt","width","height","isVideo"])])):Object(i["f"])("",!0)])}var xe=a("0680"),Ee=a("5296"),ke=a("c651"),Ae={data(){return{modal:this.$store.getters.getModal}},created(){document.title=this.$route.meta.title},mounted(){setTimeout(()=>{window.scrollTo(0,0)},500)},components:{Media:xe["a"],MediaExpanded:Ee["a"],Related:ke["a"]},name:"METCHA"};a("db7b");Ae.render=ve;t["default"]=Ae},5296:function(e,t,a){"use strict";var i=a("7a23");const c={class:"expand-modal-content"},s={class:"expand-modal-close-bar"},r={class:"expand-modal-media-figure"};function l(e,t,a,l,n,o){const h=Object(i["x"])("lazy");return Object(i["r"])(),Object(i["e"])("div",c,[Object(i["i"])("div",s,[Object(i["i"])("button",{class:"expand-modal-close-bar-button",onClick:t[1]||(t[1]=(...e)=>o.closeModal&&o.closeModal(...e))},"[ close ]")]),Object(i["i"])("div",{class:"expand-modal-close-area",onClick:t[2]||(t[2]=(...e)=>o.closeModal&&o.closeModal(...e))}),Object(i["i"])("figure",r,[Object(i["i"])("img",{class:"expand-modal-media-placeholder",src:o.placeholder(a.width,a.height),width:a.width,height:a.height,alt:" "},null,8,["src","width","height"]),a.isVideo?(Object(i["r"])(),Object(i["e"])("video",{key:1,class:"expand-modal-media-item",width:a.width,height:a.height,poster:a.thumb,alt:a.alt,playsinline:"",autoplay:"",loop:"",muted:"",controls:""},[Object(i["i"])("source",{src:a.source,type:"video/mp4"},null,8,["src"])],8,["width","height","poster","alt"])):Object(i["E"])((Object(i["r"])(),Object(i["e"])("img",{key:0,class:"expand-modal-media-item",width:a.width,height:a.height,alt:a.alt},null,8,["width","height","alt"])),[[h,{src:a.source,loading:a.thumb}]]),Object(i["i"])("button",{class:"expand-modal-close-bottom",onClick:t[3]||(t[3]=(...e)=>o.closeModal&&o.closeModal(...e))},"[ close ]")])])}var n={name:"MediaExpanded",props:{source:{type:String,required:!0},thumb:{type:String,required:!0},alt:{type:String,default:"",required:!1},width:{type:Number,required:!0},height:{type:Number,required:!0},isVideo:{type:Boolean,default:!1,required:!1}},methods:{placeholder(e,t){return`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}"%3E%3C/svg%3E`},closeModal(){let e=this.$store.getters.getModal.transform;this.$store.commit("setModal",{transform:0,class:"",open:!1,media:{source:void 0,thumb:void 0,alt:void 0,width:void 0,height:void 0,isVideo:void 0}}),window.requestAnimationFrame(()=>{window.scrollTo(0,e)})}}};n.render=l;t["a"]=n},"5fc6":function(e,t,a){},c651:function(e,t,a){"use strict";var i=a("7a23");const c={class:"internal-footer"},s=Object(i["i"])("h2",{class:"internal-footer-title"},"Related",-1),r={class:"internal-footer-related"},l=Object(i["h"])("Metcha"),n=Object(i["h"])("Transa"),o=Object(i["h"])("Brazilian Leather"),h=Object(i["h"])("Mor"),d=Object(i["h"])("Coza"),m=Object(i["h"])("Melissa"),b=Object(i["h"])("Minimelissa"),p=Object(i["h"])("Marco Almeida"),u=Object(i["h"])("Nathalia Bond"),g=Object(i["h"])("Cecerelê"),j=Object(i["h"])("Vibra"),w=Object(i["h"])("Genesysinf"),O=Object(i["g"])('<div class="internal-footer-items"><a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a><span class="internal-footer-items-separator">•</span><a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a></div>',1);function f(e,t,a,f,v,x){const E=Object(i["w"])("router-link");return Object(i["r"])(),Object(i["e"])("footer",c,[s,Object(i["i"])("div",r,[Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/metcha"},{default:Object(i["D"])(()=>[l]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/transa"},{default:Object(i["D"])(()=>[n]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/brazilian-leather"},{default:Object(i["D"])(()=>[o]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/mor"},{default:Object(i["D"])(()=>[h]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/coza"},{default:Object(i["D"])(()=>[d]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/melissa"},{default:Object(i["D"])(()=>[m]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/minimelissa"},{default:Object(i["D"])(()=>[b]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/aboutmarco"},{default:Object(i["D"])(()=>[p]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/clinica-de-desenvolvimento-nathalia-bond"},{default:Object(i["D"])(()=>[u]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/cecerele"},{default:Object(i["D"])(()=>[g]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/vibra"},{default:Object(i["D"])(()=>[j]),_:1}),Object(i["i"])(E,{class:"internal-footer-related-link",to:"/portfolio/genesysinf-sageweb"},{default:Object(i["D"])(()=>[w]),_:1})]),O])}var v={name:"Related",data(){return{modal:this.$store.getters.getModal}}};v.render=f;t["a"]=v},db7b:function(e,t,a){"use strict";a("5fc6")}}]);
//# sourceMappingURL=metcha.42e88022.js.map