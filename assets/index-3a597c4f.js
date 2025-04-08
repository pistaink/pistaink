var fe=Object.defineProperty;var he=(a,e,t)=>e in a?fe(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var K=(a,e,t)=>(he(a,typeof e!="symbol"?e+"":e,t),t);import{d as Z,r as E,c as L,a as J,o as F,b as de,e as C,f as n,g as ve,t as y,F as G,h as j,u as b,i as $,n as T,w as R,v as q,j as be,k as A,l as ue,m as ae,p as ge,q as ye,s as W,x as _e,y as we}from"./vendor-564f3e5a.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(s){if(s.ep)return;s.ep=!0;const c=t(s);fetch(s.href,c)}})();const Y="pistaink_app_data",H="pistaink_settings";class ke{async getData(){try{const e=localStorage.getItem(Y);return e?JSON.parse(e):null}catch(e){return console.error("Error loading app data:",e),null}}async loadDefaultData(){var s,c;const e=["/static/default.json","./static/default.json","static/default.json","../static/default.json",window.location.origin+"/static/default.json"],t=new Date().getTime();for(const l of e){const d=`${l}?_=${t}`;console.log(`尝试从路径加载默认数据: ${d}`);try{const u=await fetch(d);if(!u.ok){console.warn(`路径 ${d} 加载失败: HTTP错误 ${u.status}`);continue}console.log(`成功从 ${d} 获取响应`);const v=await u.text();if(!v||v.trim()===""){console.warn(`路径 ${d} 返回的数据为空`);continue}try{const r=JSON.parse(v);return console.log("成功解析default.json数据:",{engines:((s=r.engines)==null?void 0:s.length)||0,shortcuts:((c=r.shortcuts)==null?void 0:c.length)||0,defaultEngine:r.defaultEngine}),this.saveData(r),console.log("默认数据已保存到本地存储"),r}catch(r){console.error(`解析JSON失败 (${d}):`,r);continue}}catch(u){console.warn(`尝试路径 ${d} 时出错:`,u)}}console.error("所有路径都无法加载默认数据，创建基本的默认数据");const o={engines:[{id:"google",name:{zh:"谷歌",en:"Google"},url:"https://www.google.com/search?q=",iconUrl:"https://www.google.com/favicon.ico"},{id:"bing",name:{zh:"必应",en:"Microsoft Bing"},url:"https://www.bing.com/search?q=",iconUrl:"https://www.bing.com/favicon.ico"},{id:"baidu",name:{zh:"百度",en:"Baidu"},url:"https://www.baidu.com/s?wd=",iconUrl:"https://www.baidu.com/favicon.ico"}],shortcuts:[{id:"github",name:{zh:"GitHub",en:"GitHub"},url:"https://github.com",iconUrl:"https://github.com/favicon.ico"},{id:"youtube",name:{zh:"YouTube",en:"YouTube"},url:"https://youtube.com",iconUrl:"https://www.youtube.com/favicon.ico"}],defaultEngine:"bing",defaultLanguage:"zh",languages:{}};return this.saveData(o),o}async saveData(e){try{localStorage.setItem(Y,JSON.stringify(e))}catch(t){throw console.error("Error saving app data:",t),t}}getSettings(){try{const e=localStorage.getItem(H);return e?JSON.parse(e):null}catch(e){return console.error("Error loading settings:",e),null}}saveSettings(e){try{localStorage.setItem(H,JSON.stringify(e))}catch(t){throw console.error("Error saving settings:",t),t}}getIconCache(){try{const e=localStorage.getItem("pistaink_icons");return e?JSON.parse(e):{}}catch(e){return console.error("Error loading icon cache:",e),{}}}saveIconCache(e){try{localStorage.setItem("pistaink_icons",JSON.stringify(e))}catch(t){throw console.error("Error saving icon cache:",t),t}}exportData(){try{const e=localStorage.getItem(Y)||"{}",t=localStorage.getItem(H)||"{}",o={appData:JSON.parse(e),settings:JSON.parse(t)};return JSON.stringify(o,null,2)}catch(e){throw console.error("Error exporting data:",e),e}}importData(e){try{const t=JSON.parse(e);return t.appData&&localStorage.setItem(Y,JSON.stringify(t.appData)),t.settings&&localStorage.setItem(H,JSON.stringify(t.settings)),!0}catch(t){return console.error("Error importing data:",t),!1}}clearAllData(){localStorage.removeItem(Y),localStorage.removeItem(H),localStorage.removeItem("pistaink_icons")}}const N=new ke;function se(a=8){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let t="";const o=e.length;for(let s=0;s<a;s++)t+=e.charAt(Math.floor(Math.random()*o));return t}function pe(a){return a?a.startsWith("http://")||a.startsWith("https://")?a:`https://${a}`:""}const ee=Z("data",()=>{const a=E([]),e=E([]),t=E(""),o=E(!1),s=E(null),c=L(()=>h=>a.value.find(p=>p.id===h)),l=L(()=>h=>e.value.find(p=>p.id===h));async function d(){o.value=!0,s.value=null;try{console.log("开始加载数据...");let h=await N.getData();if(console.log("本地存储数据检查结果:",h?"找到数据":"未找到数据"),h||(console.log("本地未找到数据，尝试加载默认数据..."),h=await N.loadDefaultData(),console.log("默认数据加载结果:",h?"加载成功":"加载失败")),h)console.log("成功获取数据，更新状态..."),a.value=h.engines||[],e.value=h.shortcuts||[],t.value=h.defaultEngine||"",console.log(`加载了 ${a.value.length} 个搜索引擎`),console.log(`加载了 ${e.value.length} 个快捷方式`),console.log(`默认引擎ID: ${t.value}`),await u();else{console.error("无法加载数据，使用空数据"),a.value=[],e.value=[],t.value="",s.value="无法加载数据",console.log("尝试最后的备用方案，直接解析 default.json...");try{const p={engines:[{id:"google",name:{zh:"谷歌",en:"Google"},url:"https://www.google.com/search?q="},{id:"bing",name:{zh:"必应",en:"Microsoft Bing"},url:"https://www.bing.com/search?q="}],defaultEngine:"bing",shortcuts:[]};console.log("使用内置默认数据..."),a.value=p.engines,t.value=p.defaultEngine,await u()}catch(p){console.error("备用方案也失败:",p)}}}catch(h){const p=h;console.error("加载数据失败:",p),s.value=p.message}finally{o.value=!1}}async function u(){try{const h={engines:a.value,shortcuts:e.value,defaultEngine:t.value,defaultLanguage:"zh",languages:{}};await N.saveData(h)}catch(h){const p=h;throw console.error("保存数据失败:",p),p}}async function v(h){try{const p={id:se(),...h};return a.value.push(p),a.value.length===1&&(t.value=p.id),await u(),p}catch(p){const S=p;throw console.error("添加搜索引擎失败:",S),S}}async function r(h,p){try{const S=a.value.findIndex(w=>w.id===h);if(S===-1)throw new Error("未找到搜索引擎");a.value[S]={...a.value[S],...p},await u()}catch(S){const w=S;throw console.error("更新搜索引擎失败:",w),w}}async function f(h){try{a.value=a.value.filter(p=>p.id!==h),t.value===h&&a.value.length>0&&(t.value=a.value[0].id),await u()}catch(p){const S=p;throw console.error("删除搜索引擎失败:",S),S}}async function _(h){try{if(!a.value.some(p=>p.id===h))throw new Error("无效的搜索引擎ID");t.value=h,await u()}catch(p){const S=p;throw console.error("设置默认搜索引擎失败:",S),S}}async function i(h){try{const p={id:se(),...h};return e.value.push(p),await u(),p}catch(p){const S=p;throw console.error("添加快捷方式失败:",S),S}}async function g(h,p){try{const S=e.value.findIndex(w=>w.id===h);if(S===-1)throw new Error("未找到快捷方式");e.value[S]={...e.value[S],...p},await u()}catch(S){const w=S;throw console.error("更新快捷方式失败:",w),w}}async function x(h){try{e.value=e.value.filter(p=>p.id!==h),await u()}catch(p){const S=p;throw console.error("删除快捷方式失败:",S),S}}return{engines:a,shortcuts:e,defaultEngine:t,isLoading:o,error:s,getEngineById:c,getShortcutById:l,loadData:d,saveData:u,addEngine:v,updateEngine:r,deleteEngine:f,setDefaultEngine:_,addShortcut:i,updateShortcut:g,deleteShortcut:x}}),O={themeMode:"auto",backgroundSettings:{type:"bing",opacity:.3},language:"zh"},te=Z("settings",()=>{const a=E(O.themeMode),e=E(O.backgroundSettings),t=E(O.language);async function o(){try{const r=N.getSettings();r&&(a.value=r.themeMode||O.themeMode,e.value=r.backgroundSettings||O.backgroundSettings,t.value=r.language||O.language),l()}catch(r){console.error("Failed to load settings:",r)}}async function s(){try{const r={themeMode:a.value,backgroundSettings:e.value,language:t.value};N.saveSettings(r)}catch(r){console.error("Failed to save settings:",r)}}function c(r){a.value=r,l(),s()}function l(){const r=document.documentElement;if(a.value==="auto"){const f=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;r.setAttribute("data-theme",f?"dark":"light")}else r.setAttribute("data-theme",a.value)}function d(r){e.value=r,s()}function u(r){t.value=r,s()}function v(){a.value=O.themeMode,e.value=O.backgroundSettings,t.value=O.language,l(),s()}return{themeMode:a,backgroundSettings:e,language:t,loadSettings:o,saveSettings:s,setThemeMode:c,setBackgroundSettings:d,setLanguage:u,resetSettings:v}}),X=Z("i18n",()=>{const a=E("zh"),e=E({}),t=E(!1),o=E(null),s=L(()=>i=>e.value[a.value]&&e.value[a.value][i]||i),c=L(()=>Object.keys(e.value));async function l(){t.value=!0,o.value=null;try{let i=await N.getData();i||(i=await N.loadDefaultData()),i?(e.value=i.languages||{},i.defaultLanguage&&(a.value=i.defaultLanguage)):o.value="无法加载语言数据"}catch(i){const g=i;console.error("初始化国际化失败:",g),o.value=g.message}finally{t.value=!1}}function d(i){if(!e.value[i]){console.warn(`语言 ${i} 不存在`);return}a.value=i,u(i)}async function u(i){try{const g=await N.getData();g&&(g.defaultLanguage=i,await N.saveData(g))}catch(g){const x=g;throw console.error("更新默认语言失败:",x),x}}async function v(i,g){try{e.value[i]?e.value[i]={...e.value[i],...g}:e.value[i]=g,await _()}catch(x){const h=x;throw console.error("添加语言失败:",h),h}}async function r(i){try{if(Object.keys(e.value).length<=1)throw new Error("不能删除唯一的语言");if(a.value===i)throw new Error("不能删除当前使用的语言");const g={...e.value};delete g[i],e.value=g,await _()}catch(g){const x=g;throw console.error("删除语言失败:",x),x}}async function f(i,g,x){try{if(!e.value[i])throw new Error(`语言 ${i} 不存在`);e.value[i][g]=x,await _()}catch(h){const p=h;throw console.error("更新翻译失败:",p),p}}async function _(){try{const i=await N.getData();i&&(i.languages=e.value,await N.saveData(i))}catch(i){const g=i;throw console.error("保存语言包失败:",g),g}}return{currentLanguage:a,languages:e,isLoading:t,error:o,t:s,availableLanguages:c,initI18n:l,setLanguage:d,addLanguage:v,removeLanguage:r,updateTranslation:f,saveLanguages:_}}),le="pistaink_bing_image",ie="pistaink_bing_image_date";function xe(){const a=te(),e=E(!1),t=E(null);async function o(){e.value=!0,t.value=null;try{const c=localStorage.getItem(le),l=localStorage.getItem(ie),d=new Date().toDateString();if(c&&l===d)return c;const u="https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",v="https://picsum.photos/1920/1080";return localStorage.setItem(le,v),localStorage.setItem(ie,d),v}catch(c){const l=c;return console.error("Failed to fetch Bing daily image:",l),t.value=l.message,"https://picsum.photos/1920/1080"}finally{e.value=!1}}async function s(){try{const{backgroundSettings:c}=a;if(!c){document.body.style.backgroundColor="#f5f5f5",document.body.style.backgroundImage="none";return}const{type:l,color:d,imageUrl:u,opacity:v=.5}=c;if(document.body.style.backgroundImage="none",document.body.style.backgroundColor="transparent",l==="color"&&d)document.body.style.backgroundColor=d;else if(l==="image"&&u)document.body.style.backgroundImage=`url(${u})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat";else if(l==="bing"){const f=await o();document.body.style.backgroundImage=`url(${f})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat"}const r=document.querySelector(".background-overlay");r&&(r.style.opacity=v.toString())}catch(c){console.error("Failed to apply background:",c)}}return{isLoading:e,error:t,getBingDailyImage:o,applyBackground:s}}class Se{constructor(){K(this,"plugins",new Map);K(this,"pluginStates",new Map);K(this,"STORAGE_KEY","pistaink_plugins");this.loadPluginStates()}loadPluginStates(){try{const e=localStorage.getItem(this.STORAGE_KEY);e&&JSON.parse(e).forEach(o=>{this.pluginStates.set(o.id,o)})}catch(e){console.error("加载插件状态失败:",e)}}savePluginStates(){try{const e=Array.from(this.pluginStates.values());localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}catch(e){console.error("保存插件状态失败:",e)}}registerPlugin(e){if(this.plugins.has(e.id)){console.warn(`插件ID ${e.id} 已存在，无法重复注册`);return}this.plugins.set(e.id,e),this.pluginStates.has(e.id)||(this.pluginStates.set(e.id,{id:e.id,enabled:!0,order:this.pluginStates.size}),this.savePluginStates())}installPlugins(e){for(const t of this.plugins.values()){const o=this.pluginStates.get(t.id);o!=null&&o.enabled&&t.install&&t.install(e)}}enablePlugin(e){const t=this.pluginStates.get(e);if(t){t.enabled=!0,this.savePluginStates();const o=this.plugins.get(e);o!=null&&o.onActivate&&o.onActivate()}}disablePlugin(e){const t=this.pluginStates.get(e);if(t){t.enabled=!1,this.savePluginStates();const o=this.plugins.get(e);o!=null&&o.onDeactivate&&o.onDeactivate()}}getAllPlugins(){return Array.from(this.plugins.values())}getEnabledPlugins(){return this.getAllPlugins().filter(e=>{const t=this.pluginStates.get(e.id);return t&&t.enabled}).sort((e,t)=>{const o=this.pluginStates.get(e.id),s=this.pluginStates.get(t.id);return((o==null?void 0:o.order)||0)-((s==null?void 0:s.order)||0)})}getPluginState(e){return this.pluginStates.get(e)}updatePluginOrder(e,t){const o=this.pluginStates.get(e);o&&(o.order=t,this.savePluginStates())}}const z=new Se,Ee={class:"header"},Ce={class:"header-container"},$e={class:"header-plugins"},De={class:"header-actions"},Ie={class:"language-selector"},Me={id:"languageDropdown",class:"language-dropdown-menu",style:{display:"none"}},Pe=["onClick"],Le={key:0},Te={key:1},Be={key:2},Ae=J({__name:"Header",setup(a){const e=X(),t=te(),o=e.t,s=L(()=>e.currentLanguage),c=L(()=>e.availableLanguages),l=L(()=>t.themeMode),d=E(!1);function u(i){i.stopPropagation(),i.preventDefault();const g=document.getElementById("languageDropdown");g&&(g.style.display==="block"?g.style.display="none":(g.style.display="block",g.style.visibility="visible",g.style.opacity="1"))}function v(){const i=["light","dark","auto"],x=(i.indexOf(l.value)+1)%i.length;t.setThemeMode(i[x])}function r(i,g){g.stopPropagation(),console.log("切换语言至:",i),e.setLanguage(i);const x=document.getElementById("languageDropdown");x&&(x.style.display="none")}function f(){d.value=!0;const i=new CustomEvent("openSettings");window.dispatchEvent(i)}function _(i){const g=document.getElementById("languageDropdown"),x=document.getElementById("languageButton");g&&g.style.display==="block"&&i.target instanceof Node&&!g.contains(i.target)&&!(x!=null&&x.contains(i.target))&&(console.log("关闭语言下拉菜单"),g.style.display="none")}return F(()=>{console.log("Header组件已挂载"),document.addEventListener("click",_);const i=document.getElementById("languageDropdown");i&&(i.style.display="none")}),de(()=>{document.removeEventListener("click",_)}),(i,g)=>($(),C("header",Ee,[n("div",Ce,[n("div",$e,[ve(i.$slots,"plugins",{},void 0,!0)]),n("div",De,[n("div",Ie,[n("button",{id:"languageButton",onClick:u,class:"language-button"},y(s.value.toUpperCase()),1),n("div",Me,[($(!0),C(G,null,j(c.value,x=>($(),C("div",{key:x,onClick:h=>r(x,h),class:T(["dropdown-item",{active:x===s.value}])},y(x.toUpperCase()),11,Pe))),128))])]),n("button",{onClick:v,class:"theme-button"},[l.value==="light"?($(),C("span",Le,"🌙")):l.value==="dark"?($(),C("span",Te,"☀️")):($(),C("span",Be,"🔄"))]),n("button",{class:"settings-button",onClick:f}," ⚙️ "+y(b(o)("settings")),1)])])]))}});const V=(a,e)=>{const t=a.__vccOpts||a;for(const[o,s]of e)t[o]=s;return t},Ne=V(Ae,[["__scopeId","data-v-449da58f"]]),ze={class:"search-box"},Oe={class:"search-container"},Ue={class:"engine-selector"},Re=["src","alt"],qe={id:"engineDropdown",style:{display:"none",position:"fixed","z-index":"99999",background:"white",border:"1px solid #ddd",width:"350px",padding:"12px","border-radius":"8px","box-shadow":"0 2px 8px rgba(0,0,0,0.2)","margin-top":"4px"}},Ge={class:"engine-grid"},je=["onClick"],Je=["src","alt"],Ye={class:"engine-name"},He={class:"add-text"},Fe={class:"search-input-container"},Ve=["placeholder"],Ke={key:0,class:"modal"},We={class:"modal-content"},Xe={class:"modal-header"},Qe={class:"modal-body"},Ze={class:"form-group"},et={for:"engineName"},tt={class:"form-group"},nt={for:"engineUrl"},ot={class:"modal-footer"},at=J({__name:"SearchBox",setup(a){const e=ee(),t=X(),o=t.t,s=L(()=>t.currentLanguage),c=L(()=>e.engines),l=L(()=>e.defaultEngine),d=L(()=>c.value.find(k=>k.id===l.value)||c.value[0]),u=L(()=>d.value?x(d.value):""),v=L(()=>d.value?h(d.value):""),r=E(""),f=E(!1),_=E({name:{[s.value]:""},url:""});function i(k){k.stopPropagation();const I=document.getElementById("engineDropdown"),m=document.getElementById("engineButton");if(I&&m){const D=I.style.display==="block";if(D)I.style.display="none";else{const M=m.getBoundingClientRect();I.style.top=M.bottom+4+"px",I.style.left=M.left+"px",I.style.display="block",console.log("显示下拉菜单，位置:",M.left,M.bottom)}console.log("切换引擎下拉菜单:",D?"隐藏":"显示")}}function g(k,I){I.stopPropagation(),console.log("选择搜索引擎:",k),e.setDefaultEngine(k);const m=document.getElementById("engineDropdown");m&&(m.style.display="none")}function x(k){return k.name[s.value]||Object.values(k.name)[0]||""}function h(k){return k.iconImageData?k.iconImageData:k.iconUrl?k.iconUrl:`https://www.google.com/s2/favicons?domain=${new URL(k.url).hostname}&sz=64`}function p(){if(!r.value.trim()||!d.value)return;const k=d.value.url.replace("{query}",encodeURIComponent(r.value));window.open(k,"_blank")}function S(){f.value=!0;const k=document.getElementById("engineDropdown");k&&(k.style.display="none"),_.value={name:{[s.value]:""},url:""}}function w(){f.value=!1}async function B(){if(!_.value.name[s.value]||!_.value.url){alert("Please fill in all fields");return}const k=pe(_.value.url),I=k.includes("{query}")?k:k+(k.includes("?")?"&q={query}":"?q={query}");try{await e.addEngine({name:_.value.name,url:I}),w()}catch(m){console.error("Failed to add search engine:",m),alert("Failed to add search engine")}}function P(k){const I=document.getElementById("engineDropdown"),m=document.getElementById("engineButton");I&&I.style.display==="block"&&k.target instanceof Node&&!I.contains(k.target)&&!(m!=null&&m.contains(k.target))&&(console.log("关闭搜索引擎下拉菜单"),I.style.display="none")}return F(()=>{console.log("SearchBox组件已挂载"),document.addEventListener("click",P);const k=document.getElementById("engineDropdown");k&&(k.style.display="none")}),de(()=>{document.removeEventListener("click",P)}),(k,I)=>($(),C("div",ze,[n("div",Oe,[n("div",Ue,[n("button",{id:"engineButton",class:"engine-button",onClick:i},[n("img",{src:v.value,alt:u.value,class:"engine-icon"},null,8,Re)]),n("div",qe,[n("div",Ge,[($(!0),C(G,null,j(c.value,m=>($(),C("button",{key:m.id,class:T(["engine-item",{active:m.id===l.value}]),onClick:D=>g(m.id,D),style:{display:"flex","flex-direction":"column","align-items":"center",padding:"8px"}},[n("img",{src:h(m),alt:x(m),class:"engine-icon"},null,8,Je),n("span",Ye,y(x(m)),1)],10,je))),128)),n("button",{class:"add-engine-button",onClick:S},[I[3]||(I[3]=n("span",{class:"add-icon"},"+",-1)),n("span",He,y(b(o)("add_engine")),1)])])])]),n("div",Fe,[R(n("input",{"onUpdate:modelValue":I[0]||(I[0]=m=>r.value=m),placeholder:b(o)("search_placeholder"),class:"search-input",onKeydown:be(p,["enter"])},null,40,Ve),[[q,r.value]]),n("button",{class:"search-button",onClick:p},y(b(o)("search_button")),1)])]),f.value?($(),C("div",Ke,[n("div",{class:"modal-backdrop",onClick:w}),n("div",We,[n("div",Xe,[n("h3",null,y(b(o)("add_engine")),1),n("button",{class:"close-button",onClick:w},"×")]),n("div",Qe,[n("div",Ze,[n("label",et,y(b(o)("name")),1),R(n("input",{id:"engineName","onUpdate:modelValue":I[1]||(I[1]=m=>_.value.name[s.value]=m)},null,512),[[q,_.value.name[s.value]]])]),n("div",tt,[n("label",nt,y(b(o)("url")),1),R(n("input",{id:"engineUrl","onUpdate:modelValue":I[2]||(I[2]=m=>_.value.url=m),placeholder:"https://example.com/search?q={query}"},null,512),[[q,_.value.url]]),n("small",null,y(b(o)("use_{query}_placeholder")),1)])]),n("div",ot,[n("button",{class:"cancel-button",onClick:w},y(b(o)("cancel")),1),n("button",{class:"save-button",onClick:B},y(b(o)("save")),1)])])])):A("",!0)]))}});const st=V(at,[["__scopeId","data-v-21e0d7aa"]]),lt={class:"shortcut-grid"},it={class:"grid-title"},rt={class:"shortcuts-container"},ct=["href"],dt={class:"shortcut-icon"},ut=["src","alt"],gt={class:"shortcut-name"},pt=["onClick"],mt={class:"add-text"},ft={key:0,class:"shortcut-modal"},ht={class:"modal-content"},vt={class:"modal-header"},bt={class:"modal-body"},yt={class:"form-group"},_t={for:"shortcutName"},wt={class:"form-group"},kt={for:"shortcutUrl"},xt={class:"modal-footer"},St={class:"action-buttons"},Et={key:1,class:"confirm-modal"},Ct={class:"modal-content confirm-content"},$t={class:"confirm-message"},Dt={class:"confirm-actions"},It=J({__name:"ShortcutGrid",setup(a){const e=ee(),t=X(),o=t.t,s=L(()=>t.currentLanguage),c=L(()=>e.shortcuts),l=E(!1),d=E(!1),u=E(!1),v=E({name:{[s.value]:""},url:""});function r(w){return w.name[s.value]||Object.values(w.name)[0]||""}function f(w){return w.iconImageData?w.iconImageData:w.iconUrl?w.iconUrl:`https://www.google.com/s2/favicons?domain=${new URL(w.url).hostname}&sz=64`}function _(){d.value=!1,v.value={name:{[s.value]:""},url:""},l.value=!0}function i(w){d.value=!0,v.value={id:w.id,name:{...w.name},url:w.url},l.value=!0}function g(){l.value=!1}async function x(){try{if(!v.value.name[s.value]||!v.value.url){alert("Please fill in all fields");return}const w=pe(v.value.url);d.value&&v.value.id?await e.updateShortcut(v.value.id,{name:v.value.name,url:w}):await e.addShortcut({name:v.value.name,url:w}),g()}catch(w){console.error("Failed to save shortcut:",w),alert("Failed to save shortcut")}}function h(){u.value=!0}function p(){u.value=!1}async function S(){try{v.value.id&&(await e.deleteShortcut(v.value.id),u.value=!1,g())}catch(w){console.error("Failed to delete shortcut:",w),alert("Failed to delete shortcut")}}return(w,B)=>($(),C("div",lt,[n("h2",it,y(b(o)("shortcuts")),1),n("div",rt,[($(!0),C(G,null,j(c.value,P=>($(),C("div",{key:P.id,class:"shortcut-item"},[n("a",{href:P.url,target:"_blank",rel:"noopener noreferrer",class:"shortcut-link"},[n("div",dt,[n("img",{src:f(P),alt:r(P)},null,8,ut)]),n("div",gt,y(r(P)),1)],8,ct),n("button",{class:"edit-button",onClick:k=>i(P)},B[2]||(B[2]=[n("span",null,"⋮",-1)]),8,pt)]))),128)),n("div",{class:"shortcut-item add-shortcut",onClick:_},[B[3]||(B[3]=n("div",{class:"add-icon"},"+",-1)),n("div",mt,y(b(o)("add_shortcut")),1)])]),l.value?($(),C("div",ft,[n("div",{class:"modal-backdrop",onClick:g}),n("div",ht,[n("div",vt,[n("h3",null,y(d.value?b(o)("edit"):b(o)("add_shortcut")),1),n("button",{class:"close-button",onClick:g},"×")]),n("div",bt,[n("div",yt,[n("label",_t,y(b(o)("name")),1),R(n("input",{id:"shortcutName","onUpdate:modelValue":B[0]||(B[0]=P=>v.value.name[s.value]=P)},null,512),[[q,v.value.name[s.value]]])]),n("div",wt,[n("label",kt,y(b(o)("url")),1),R(n("input",{id:"shortcutUrl","onUpdate:modelValue":B[1]||(B[1]=P=>v.value.url=P),placeholder:"https://example.com"},null,512),[[q,v.value.url]])])]),n("div",xt,[d.value?($(),C("button",{key:0,class:"delete-button",onClick:h},y(b(o)("delete")),1)):A("",!0),n("div",St,[n("button",{class:"cancel-button",onClick:g},y(b(o)("cancel")),1),n("button",{class:"save-button",onClick:x},y(b(o)("save")),1)])])])])):A("",!0),u.value?($(),C("div",Et,[n("div",{class:"modal-backdrop",onClick:p}),n("div",Ct,[n("div",$t,y(b(o)("confirm_delete")),1),n("div",Dt,[n("button",{class:"cancel-button",onClick:p},y(b(o)("no")),1),n("button",{class:"delete-confirm-button",onClick:S},y(b(o)("yes")),1)])])])):A("",!0)]))}});const Mt=V(It,[["__scopeId","data-v-1f441c5b"]]),Pt={class:"plugin-registry",style:{display:"flex","align-items":"center",gap:"8px"}},Lt={key:0,class:"plugin-empty",style:{color:"#666","font-size":"12px"}},Tt=["onClick","title"],Bt={class:"plugin-icon",style:{"font-size":"20px"}},At=J({__name:"PluginRegistry",setup(a){const e=E([]);F(()=>{console.log("PluginRegistry mounted"),setTimeout(()=>{t(),console.log("Registered plugins:",z.getAllPlugins()),console.log("Enabled plugins:",e.value)},100)});function t(){const s=z.getEnabledPlugins();console.log("Refreshing plugins, found:",s.length),e.value=s}function o(s){console.log("Activating plugin:",s);const c=z.getAllPlugins().find(l=>l.id===s);c&&c.onActivate&&c.onActivate()}return(s,c)=>($(),C("div",Pt,[e.value.length===0?($(),C("div",Lt," 加载插件中... ")):A("",!0),($(!0),C(G,null,j(e.value,l=>($(),C("div",{key:l.id,class:"plugin-item",onClick:d=>o(l.id),title:l.name,style:{display:"flex","align-items":"center","justify-content":"center",width:"36px",height:"36px","border-radius":"50%","background-color":"rgba(255, 255, 255, 0.3)",border:"1px solid rgba(0, 0, 0, 0.1)","backdrop-filter":"blur(4px)",cursor:"pointer",transition:"all 0.2s ease"}},[n("div",Bt,y(l.icon),1)],8,Tt))),128))]))}});const Nt=V(At,[["__scopeId","data-v-ec2cc125"]]),zt={class:"drawing-container"},Ot={class:"drawing-tools"},Ut={class:"tool-group"},Rt={class:"color-picker"},qt=["onClick"],Gt={class:"size-selector"},jt={class:"size-value"},Jt={class:"background-selector"},Yt=["onClick"],Ht={class:"canvas-wrapper"},Ft=J({__name:"DrawingCanvas",setup(a){const e=E(null);let t=null,o=!1,s=0,c=0;const l=E("brush"),d=E("#000000"),u=E(5),v=["#000000","#ffffff","#ff0000","#ff9900","#ffff00","#00ff00","#0099ff","#6633ff"],r=E("#ffffff"),f=["#ffffff","#f0f0f0","#f5f5dc","#e0f7fa","#f9fbe7","#fff3e0","#fbe9e7","#f3e5f5"];ue(r,()=>{i()});function _(m){r.value=m}function i(){if(!t||!e.value)return;const m=t.getImageData(0,0,e.value.width,e.value.height);t.fillStyle=r.value,t.fillRect(0,0,e.value.width,e.value.height),t.putImageData(m,0,0)}F(()=>{e.value&&(g(),t=e.value.getContext("2d"),t&&(t.lineCap="round",t.lineJoin="round",t.strokeStyle=d.value,t.lineWidth=u.value,t.fillStyle=r.value,t.fillRect(0,0,e.value.width,e.value.height)),window.addEventListener("resize",g))});function g(){if(!e.value)return;const m=e.value.parentElement;m&&(e.value.width=m.clientWidth,e.value.height=300,t&&(t.fillStyle=r.value,t.fillRect(0,0,e.value.width,e.value.height)))}function x(m){l.value=m}function h(m){d.value=m,t&&(t.strokeStyle=m)}function p(m){o=!0;const D=e.value.getBoundingClientRect();s=m.clientX-D.left,c=m.clientY-D.top}function S(m){if(!o||!t||!e.value)return;const D=e.value.getBoundingClientRect(),M=m.clientX-D.left,U=m.clientY-D.top;t.strokeStyle=l.value==="eraser"?r.value:d.value,t.lineWidth=u.value,t.beginPath(),t.moveTo(s,c),t.lineTo(M,U),t.stroke(),s=M,c=U}function w(){o=!1}function B(m){if(!e.value)return;m.preventDefault();const D=m.touches[0],M=e.value.getBoundingClientRect();s=D.clientX-M.left,c=D.clientY-M.top,o=!0}function P(m){if(!o||!t||!e.value)return;m.preventDefault();const D=m.touches[0],M=e.value.getBoundingClientRect(),U=D.clientX-M.left,oe=D.clientY-M.top;t.strokeStyle=l.value==="eraser"?r.value:d.value,t.lineWidth=u.value,t.beginPath(),t.moveTo(s,c),t.lineTo(U,oe),t.stroke(),s=U,c=oe}function k(){!t||!e.value||(t.fillStyle=r.value,t.fillRect(0,0,e.value.width,e.value.height))}function I(){if(!e.value)return;const m=e.value.toDataURL("image/png"),D=document.createElement("a");D.download=`pistaink-drawing-${new Date().getTime()}.png`,D.href=m,D.click()}return(m,D)=>($(),C("div",zt,[n("div",Ot,[n("div",Ut,[n("button",{class:T(["tool-btn",{active:l.value==="brush"}]),onClick:D[0]||(D[0]=M=>x("brush")),title:"画笔"}," 🖌️ ",2),n("button",{class:T(["tool-btn",{active:l.value==="eraser"}]),onClick:D[1]||(D[1]=M=>x("eraser")),title:"橡皮擦"}," 🧽 ",2)]),n("div",Rt,[($(),C(G,null,j(v,M=>n("div",{key:M,class:T(["color-option",{active:d.value===M}]),style:ae({background:M}),onClick:U=>h(M)},null,14,qt)),64))]),n("div",Gt,[R(n("input",{type:"range",min:"1",max:"50","onUpdate:modelValue":D[2]||(D[2]=M=>u.value=M),class:"size-slider"},null,512),[[q,u.value,void 0,{number:!0}]]),n("span",jt,y(u.value)+"px",1)]),n("div",Jt,[D[3]||(D[3]=n("span",null,"背景:",-1)),($(),C(G,null,j(f,M=>n("div",{key:M,class:T(["bg-color-option",{active:r.value===M}]),style:ae({background:M}),onClick:U=>_(M)},null,14,Yt)),64))])]),n("div",Ht,[n("canvas",{ref_key:"canvas",ref:e,class:"drawing-canvas",onMousedown:p,onMousemove:S,onMouseup:w,onMouseleave:w,onTouchstart:B,onTouchmove:P,onTouchend:w},null,544)]),n("div",{class:"canvas-actions"},[n("button",{class:"action-btn",onClick:k},"清除"),n("button",{class:"action-btn",onClick:I},"保存")])]))}});const re=V(Ft,[["__scopeId","data-v-e90b735f"]]),Q=E(!1),Vt={id:"drawing",name:"绘画板",description:"简易绘画工具，支持多种画笔和颜色",icon:"✏️",version:"1.0.0",component:re,install(a){console.log("绘画插件已安装")},onActivate(){Q.value=!0;const a=document.createElement("div");a.classList.add("drawing-modal"),a.innerHTML=`
		<div class="drawing-modal-backdrop"></div>
		<div class="drawing-modal-content">
			<div class="drawing-modal-header">
				<h3>绘画板</h3>
				<button class="drawing-modal-close">×</button>
			</div>
			<div id="drawing-container"></div>
		</div>
		`,document.body.appendChild(a);const e=document.getElementById("drawing-container");e&&ge(re).mount(e);const t=a.querySelector(".drawing-modal-close");t&&t.addEventListener("click",()=>{document.body.removeChild(a),Q.value=!1});const o=a.querySelector(".drawing-modal-backdrop");o&&o.addEventListener("click",()=>{document.body.removeChild(a),Q.value=!1});const s=document.createElement("style");s.textContent=`
		.drawing-modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1000;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.drawing-modal-backdrop {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
		}
		
		.drawing-modal-content {
			position: relative;
			width: 80%;
			max-width: 800px;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			z-index: 1001;
			overflow: hidden;
		}
		
		.drawing-modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			border-bottom: 1px solid #eee;
		}
		
		.drawing-modal-header h3 {
			margin: 0;
		}
		
		.drawing-modal-close {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
			color: #666;
		}
		
		@media (max-width: 768px) {
			.drawing-modal-content {
				width: 95%;
			}
		}
		`,document.head.appendChild(s)},onDeactivate(){console.log("绘画插件已禁用")}};E(!1);const Kt={id:"screenshot",name:"网页截图",description:"截取当前网页并保存",icon:"📷",version:"1.0.0",install(a){console.log("截图插件已安装")},onActivate(){const a=document.createElement("div");a.textContent="正在截取屏幕...",a.style.cssText=`
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			padding: 8px 16px;
			border-radius: 4px;
			z-index: 10000;
		`,document.body.appendChild(a),setTimeout(()=>{setTimeout(()=>{document.body.removeChild(a);const e=document.createElement("canvas"),t=e.getContext("2d");if(e.width=window.innerWidth,e.height=window.innerHeight,t){t.fillStyle="white",t.fillRect(0,0,e.width,e.height),t.font="24px Arial",t.fillStyle="black",t.textAlign="center",t.fillText("屏幕截图功能示例",e.width/2,e.height/2),t.font="16px Arial",t.fillText(`时间: ${new Date().toLocaleString()}`,e.width/2,e.height/2+40);const o=e.toDataURL("image/png"),s=document.createElement("a");s.download=`screenshot-${new Date().getTime()}.png`,s.href=o,s.click()}},500)},100)},onDeactivate(){console.log("截图插件已禁用")}},Wt=["#ff5252","#ff4081","#e040fb","#7c4dff","#536dfe","#448aff","#40c4ff","#18ffff","#64ffda","#69f0ae","#b2ff59","#eeff41","#ffff00","#ffd740","#ffab40","#ff6e40"],Xt={id:"color-picker",name:"颜色提取器",description:"从网页中提取主要颜色",icon:"🎨",version:"1.0.0",install(a){console.log("颜色提取器插件已安装")},onActivate(){const a=document.createElement("div");a.className="color-picker-panel";const e=document.createElement("div");e.className="color-picker-header",e.innerHTML=`
			<h3>颜色提取器</h3>
			<button class="color-picker-close">×</button>
		`,a.appendChild(e);const t=document.createElement("div");t.className="color-grid",Wt.forEach(l=>{const d=document.createElement("div");d.className="color-item",d.style.backgroundColor=l,d.setAttribute("data-color",l),d.addEventListener("click",()=>{navigator.clipboard.writeText(l).then(()=>{d.setAttribute("data-copied","true"),d.innerText="已复制",setTimeout(()=>{d.innerText="",d.removeAttribute("data-copied")},1e3)})}),t.appendChild(d)}),a.appendChild(t);const o=document.createElement("p");o.className="color-picker-hint",o.textContent="点击颜色块复制色值",a.appendChild(o),document.body.appendChild(a);const s=a.querySelector(".color-picker-close");s&&s.addEventListener("click",()=>{document.body.removeChild(a)});const c=document.createElement("style");c.textContent=`
		.color-picker-panel {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 320px;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			z-index: 1000;
			overflow: hidden;
		}
		
		.color-picker-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			border-bottom: 1px solid #eee;
		}
		
		.color-picker-header h3 {
			margin: 0;
			font-size: 16px;
		}
		
		.color-picker-close {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
			color: #666;
		}
		
		.color-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 8px;
			padding: 16px;
		}
		
		.color-item {
			position: relative;
			width: 100%;
			height: 60px;
			border-radius: 4px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 12px;
			font-weight: bold;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
			transition: transform 0.2s;
		}
		
		.color-item:hover {
			transform: scale(1.05);
		}
		
		.color-item[data-copied="true"] {
			outline: 2px solid #333;
		}
		
		.color-picker-hint {
			text-align: center;
			color: #666;
			padding: 0 16px 16px;
			margin: 0;
			font-size: 12px;
		}
		`,document.head.appendChild(c)},onDeactivate(){console.log("颜色提取器插件已禁用")}},me="pistaink_memos";function Qt(){try{const a=localStorage.getItem(me);return a?JSON.parse(a):[]}catch(a){return console.error("加载便签失败:",a),[]}}function ce(a){localStorage.setItem(me,JSON.stringify(a))}function Zt(){const a=["#ffcdd2","#f8bbd0","#e1bee7","#d1c4e9","#c5cae9","#bbdefb","#b3e5fc","#b2ebf2","#b2dfdb","#c8e6c9","#dcedc8","#f0f4c3","#fff9c4","#ffecb3","#ffe0b2","#ffccbc"];return a[Math.floor(Math.random()*a.length)]}const en={id:"memo",name:"便签",description:"创建和管理便签",icon:"📝",version:"1.0.0",install(a){console.log("便签插件已安装")},onActivate(){const a=Qt(),e=document.createElement("div");e.className="memo-panel";const t=document.createElement("div");t.className="memo-header",t.innerHTML=`
			<h3>我的便签</h3>
			<button class="memo-close">×</button>
		`,e.appendChild(t);const o=document.createElement("div");o.className="memo-list";function s(){if(o.innerHTML="",a.length===0){const u=document.createElement("p");u.className="memo-empty",u.textContent="没有便签，点击下方按钮添加",o.appendChild(u)}else a.forEach((u,v)=>{const r=document.createElement("div");r.className="memo-item",r.style.backgroundColor=u.color;const f=document.createElement("div");f.className="memo-content",f.textContent=u.content,r.appendChild(f);const _=document.createElement("div");_.className="memo-date",_.textContent=new Date(u.createdAt).toLocaleString(),r.appendChild(_);const i=document.createElement("button");i.className="memo-delete",i.textContent="删除",i.addEventListener("click",g=>{g.stopPropagation(),a.splice(v,1),ce(a),s()}),r.appendChild(i),o.appendChild(r)})}s(),e.appendChild(o);const c=document.createElement("button");c.className="memo-add-btn",c.textContent="添加便签",c.addEventListener("click",()=>{const u=prompt("请输入便签内容:");if(u&&u.trim()){const v={id:Date.now().toString(),content:u.trim(),color:Zt(),createdAt:Date.now()};a.unshift(v),ce(a),s()}}),e.appendChild(c),document.body.appendChild(e);const l=e.querySelector(".memo-close");l&&l.addEventListener("click",()=>{document.body.removeChild(e)});const d=document.createElement("style");d.textContent=`
		.memo-panel {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 320px;
			max-height: 80vh;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			z-index: 1000;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}
		
		.memo-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			border-bottom: 1px solid #eee;
			background-color: #f5f5f5;
		}
		
		.memo-header h3 {
			margin: 0;
			font-size: 16px;
		}
		
		.memo-close {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
			color: #666;
		}
		
		.memo-list {
			flex: 1;
			overflow-y: auto;
			padding: 8px;
			max-height: 400px;
		}
		
		.memo-empty {
			text-align: center;
			color: #999;
			padding: 20px;
		}
		
		.memo-item {
			position: relative;
			padding: 12px;
			margin-bottom: 8px;
			border-radius: 4px;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}
		
		.memo-content {
			margin-bottom: 8px;
			white-space: pre-wrap;
			word-break: break-word;
		}
		
		.memo-date {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.6);
		}
		
		.memo-delete {
			position: absolute;
			top: 8px;
			right: 8px;
			background: rgba(255, 255, 255, 0.5);
			border: none;
			border-radius: 4px;
			padding: 2px 6px;
			font-size: 12px;
			cursor: pointer;
			opacity: 0;
			transition: opacity 0.2s;
		}
		
		.memo-item:hover .memo-delete {
			opacity: 1;
		}
		
		.memo-add-btn {
			margin: 8px;
			padding: 8px;
			background-color: #2196f3;
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			font-weight: bold;
			transition: background-color 0.2s;
		}
		
		.memo-add-btn:hover {
			background-color: #1976d2;
		}
		`,document.head.appendChild(d)},onDeactivate(){console.log("便签插件已禁用")}},tn={class:"app-container"},nn={class:"main-content"},on={key:0,class:"settings-modal",style:{display:"flex"}},an={class:"settings-content"},sn={class:"settings-header"},ln={class:"settings-body"},rn={class:"settings-sidebar"},cn={class:"settings-panel"},dn={key:0,class:"settings-tab-content"},un={class:"form-group"},gn={class:"theme-options"},pn={key:1,class:"settings-tab-content"},mn={key:2,class:"settings-tab-content"},fn={key:3,class:"settings-tab-content"},hn={key:4,class:"settings-tab-content"},vn=J({__name:"App",setup(a){const e=ee(),t=te(),o=X(),s=xe(),c=E(!1),l=E("general");function d(){c.value=!0}function u(){c.value=!1}F(async()=>{if(console.log("App component mounted"),console.log("清除本地存储..."),localStorage.removeItem("pistaink_app_data"),console.log("本地存储已清除"),console.log("正在加载应用数据..."),await e.loadData(),console.log("应用数据加载完成"),console.log("Registering plugins..."),z.registerPlugin(Vt),z.registerPlugin(Kt),z.registerPlugin(Xt),z.registerPlugin(en),console.log("Plugins registered:",z.getAllPlugins().length),await o.initI18n(),await t.loadSettings(),s.applyBackground(),e.engines.length===0||e.shortcuts.length===0){if(console.log("搜索引擎或快捷方式为空，尝试重新加载数据..."),await e.loadData(),e.engines.length===0){console.log("仍然无法加载搜索引擎，使用硬编码数据");const f=[{id:"google",name:{zh:"谷歌",en:"Google"},url:"https://www.google.com/search?q="},{id:"bing",name:{zh:"必应",en:"Microsoft Bing"},url:"https://www.bing.com/search?q="}];for(const _ of f)await e.addEngine(_);await e.setDefaultEngine("bing")}if(e.shortcuts.length===0){console.log("仍然无法加载快捷方式，使用硬编码数据");const f=[{name:{zh:"GitHub",en:"GitHub"},url:"https://github.com"},{name:{zh:"YouTube",en:"YouTube"},url:"https://youtube.com"}];for(const _ of f)await e.addShortcut(_)}}const r=window.matchMedia("(prefers-color-scheme: dark)");v(r),r.addEventListener("change",v),window.addEventListener("openSettings",d),ue(()=>t.themeMode,f=>{document.documentElement.setAttribute("data-theme",f),f==="auto"&&v(window.matchMedia("(prefers-color-scheme: dark)"))},{immediate:!0})}),ye(()=>{window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change",v),window.removeEventListener("openSettings",d)});function v(r){const f=r.matches;t.themeMode==="auto"&&document.documentElement.setAttribute("data-theme",f?"dark":"light")}return(r,f)=>($(),C("div",tn,[W(Ne,null,{plugins:_e(()=>[W(Nt)]),_:1}),n("main",nn,[W(st),W(Mt)]),c.value?($(),C("div",on,[n("div",{class:"modal-backdrop",onClick:u}),n("div",an,[n("div",sn,[n("h2",null,y(b(o).t("settings")),1),n("button",{class:"close-button",onClick:u},"×")]),n("div",ln,[n("div",rn,[n("div",{class:T(["sidebar-item",{active:l.value==="general"}]),onClick:f[0]||(f[0]=_=>l.value="general")},y(b(o).t("general")),3),n("div",{class:T(["sidebar-item",{active:l.value==="search"}]),onClick:f[1]||(f[1]=_=>l.value="search")},y(b(o).t("search")),3),n("div",{class:T(["sidebar-item",{active:l.value==="import"}]),onClick:f[2]||(f[2]=_=>l.value="import")},y(b(o).t("import_export")),3),n("div",{class:T(["sidebar-item",{active:l.value==="language"}]),onClick:f[3]||(f[3]=_=>l.value="language")},y(b(o).t("language")),3),n("div",{class:T(["sidebar-item",{active:l.value==="about"}]),onClick:f[4]||(f[4]=_=>l.value="about")},y(b(o).t("about")),3)]),n("div",cn,[l.value==="general"?($(),C("div",dn,[n("h3",null,y(b(o).t("general_settings")),1),n("div",un,[n("label",null,y(b(o).t("theme")),1),n("div",gn,[n("button",{onClick:f[5]||(f[5]=_=>b(t).setThemeMode("light")),class:T({active:b(t).themeMode==="light"})},y(b(o).t("light")),3),n("button",{onClick:f[6]||(f[6]=_=>b(t).setThemeMode("dark")),class:T({active:b(t).themeMode==="dark"})},y(b(o).t("dark")),3),n("button",{onClick:f[7]||(f[7]=_=>b(t).setThemeMode("auto")),class:T({active:b(t).themeMode==="auto"})},y(b(o).t("auto")),3)])])])):A("",!0),l.value==="search"?($(),C("div",pn,[n("h3",null,y(b(o).t("search_settings")),1)])):A("",!0),l.value==="import"?($(),C("div",mn,[n("h3",null,y(b(o).t("import_export")),1)])):A("",!0),l.value==="language"?($(),C("div",fn,[n("h3",null,y(b(o).t("language_settings")),1)])):A("",!0),l.value==="about"?($(),C("div",hn,[n("h3",null,y(b(o).t("about")),1),f[8]||(f[8]=n("p",null,"pistaink.com - v1.0.0",-1))])):A("",!0)])])])])):A("",!0)]))}});document.documentElement.style.setProperty("--primary-color","#3498db");document.documentElement.style.setProperty("--border-color","#e0e0e0");document.documentElement.style.setProperty("--card-bg","#ffffff");document.documentElement.style.setProperty("--dropdown-bg","#ffffff");document.documentElement.style.setProperty("--text-color","#333333");document.documentElement.style.setProperty("--shadow-color","rgba(0, 0, 0, 0.1)");console.log("应用初始化开始");const ne=ge(vn);ne.use(we());console.log("插件管理器初始化");z.installPlugins(ne);ne.mount("#app");window.addEventListener("load",()=>{console.log("Window loaded, plugins available:",z.getAllPlugins().length)});console.log("应用初始化完成");
