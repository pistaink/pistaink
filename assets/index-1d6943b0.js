var me=Object.defineProperty;var pe=(n,e,t)=>e in n?me(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var V=(n,e,t)=>(pe(n,typeof e!="symbol"?e+"":e,t),t);import{d as Z,r as y,c as M,a as j,o as F,b as ue,e as x,f as s,g as he,t as k,F as q,h as G,i as z,u as $,j as S,n as B,w as U,v as R,k as ve,l as be,m as ae,p as de,q as _e,s as W,x as ye,y as we}from"./vendor-68934546.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();const Y="pistaink_app_data",H="pistaink_settings";class ke{async getData(){try{const e=localStorage.getItem(Y);return e?JSON.parse(e):null}catch(e){return console.error("Error loading app data:",e),null}}async loadDefaultData(){var a,l;const e=["/static/default.json","./static/default.json","static/default.json","../static/default.json",window.location.origin+"/static/default.json"],t=new Date().getTime();for(const c of e){const r=`${c}?_=${t}`;console.log(`尝试从路径加载默认数据: ${r}`);try{const d=await fetch(r);if(!d.ok){console.warn(`路径 ${r} 加载失败: HTTP错误 ${d.status}`);continue}console.log(`成功从 ${r} 获取响应`);const p=await d.text();if(!p||p.trim()===""){console.warn(`路径 ${r} 返回的数据为空`);continue}try{const i=JSON.parse(p);return console.log("成功解析default.json数据:",{engines:((a=i.engines)==null?void 0:a.length)||0,shortcuts:((l=i.shortcuts)==null?void 0:l.length)||0,defaultEngine:i.defaultEngine}),this.saveData(i),console.log("默认数据已保存到本地存储"),i}catch(i){console.error(`解析JSON失败 (${r}):`,i);continue}}catch(d){console.warn(`尝试路径 ${r} 时出错:`,d)}}console.error("所有路径都无法加载默认数据，创建基本的默认数据");const o={engines:[{id:"google",name:{zh:"谷歌",en:"Google"},url:"https://www.google.com/search?q=",iconUrl:"https://www.google.com/favicon.ico"},{id:"bing",name:{zh:"必应",en:"Microsoft Bing"},url:"https://www.bing.com/search?q=",iconUrl:"https://www.bing.com/favicon.ico"},{id:"baidu",name:{zh:"百度",en:"Baidu"},url:"https://www.baidu.com/s?wd=",iconUrl:"https://www.baidu.com/favicon.ico"}],shortcuts:[{id:"github",name:{zh:"GitHub",en:"GitHub"},url:"https://github.com",iconUrl:"https://github.com/favicon.ico"},{id:"youtube",name:{zh:"YouTube",en:"YouTube"},url:"https://youtube.com",iconUrl:"https://www.youtube.com/favicon.ico"}],defaultEngine:"bing",defaultLanguage:"zh",languages:{}};return this.saveData(o),o}async saveData(e){try{localStorage.setItem(Y,JSON.stringify(e))}catch(t){throw console.error("Error saving app data:",t),t}}getSettings(){try{const e=localStorage.getItem(H);return e?JSON.parse(e):null}catch(e){return console.error("Error loading settings:",e),null}}saveSettings(e){try{localStorage.setItem(H,JSON.stringify(e))}catch(t){throw console.error("Error saving settings:",t),t}}getIconCache(){try{const e=localStorage.getItem("pistaink_icons");return e?JSON.parse(e):{}}catch(e){return console.error("Error loading icon cache:",e),{}}}saveIconCache(e){try{localStorage.setItem("pistaink_icons",JSON.stringify(e))}catch(t){throw console.error("Error saving icon cache:",t),t}}exportData(){try{const e=localStorage.getItem(Y)||"{}",t=localStorage.getItem(H)||"{}",o={appData:JSON.parse(e),settings:JSON.parse(t)};return JSON.stringify(o,null,2)}catch(e){throw console.error("Error exporting data:",e),e}}importData(e){try{const t=JSON.parse(e);return t.appData&&localStorage.setItem(Y,JSON.stringify(t.appData)),t.settings&&localStorage.setItem(H,JSON.stringify(t.settings)),!0}catch(t){return console.error("Error importing data:",t),!1}}clearAllData(){localStorage.removeItem(Y),localStorage.removeItem(H),localStorage.removeItem("pistaink_icons")}}const T=new ke;function se(n=8){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let t="";const o=e.length;for(let a=0;a<n;a++)t+=e.charAt(Math.floor(Math.random()*o));return t}function ge(n){return n?n.startsWith("http://")||n.startsWith("https://")?n:`https://${n}`:""}const ee=Z("data",()=>{const n=y([]),e=y([]),t=y(""),o=y(!1),a=y(null),l=M(()=>g=>n.value.find(f=>f.id===g)),c=M(()=>g=>e.value.find(f=>f.id===g));async function r(){o.value=!0,a.value=null;try{console.log("开始加载数据...");let g=await T.getData();if(console.log("本地存储数据检查结果:",g?"找到数据":"未找到数据"),g||(console.log("本地未找到数据，尝试加载默认数据..."),g=await T.loadDefaultData(),console.log("默认数据加载结果:",g?"加载成功":"加载失败")),g)console.log("成功获取数据，更新状态..."),n.value=g.engines||[],e.value=g.shortcuts||[],t.value=g.defaultEngine||"",console.log(`加载了 ${n.value.length} 个搜索引擎`),console.log(`加载了 ${e.value.length} 个快捷方式`),console.log(`默认引擎ID: ${t.value}`),await d();else{console.error("无法加载数据，使用空数据"),n.value=[],e.value=[],t.value="",a.value="无法加载数据",console.log("尝试最后的备用方案，直接解析 default.json...");try{const f={engines:[{id:"google",name:{zh:"谷歌",en:"Google"},url:"https://www.google.com/search?q="},{id:"bing",name:{zh:"必应",en:"Microsoft Bing"},url:"https://www.bing.com/search?q="}],defaultEngine:"bing",shortcuts:[]};console.log("使用内置默认数据..."),n.value=f.engines,t.value=f.defaultEngine,await d()}catch(f){console.error("备用方案也失败:",f)}}}catch(g){const f=g;console.error("加载数据失败:",f),a.value=f.message}finally{o.value=!1}}async function d(){try{const g={engines:n.value,shortcuts:e.value,defaultEngine:t.value,defaultLanguage:"zh",languages:{}};await T.saveData(g)}catch(g){const f=g;throw console.error("保存数据失败:",f),f}}async function p(g){try{const f={id:se(),...g};return n.value.push(f),n.value.length===1&&(t.value=f.id),await d(),f}catch(f){const _=f;throw console.error("添加搜索引擎失败:",_),_}}async function i(g,f){try{const _=n.value.findIndex(b=>b.id===g);if(_===-1)throw new Error("未找到搜索引擎");n.value[_]={...n.value[_],...f},await d()}catch(_){const b=_;throw console.error("更新搜索引擎失败:",b),b}}async function E(g){try{n.value=n.value.filter(f=>f.id!==g),t.value===g&&n.value.length>0&&(t.value=n.value[0].id),await d()}catch(f){const _=f;throw console.error("删除搜索引擎失败:",_),_}}async function I(g){try{if(!n.value.some(f=>f.id===g))throw new Error("无效的搜索引擎ID");t.value=g,await d()}catch(f){const _=f;throw console.error("设置默认搜索引擎失败:",_),_}}async function u(g){try{const f={id:se(),...g};return e.value.push(f),await d(),f}catch(f){const _=f;throw console.error("添加快捷方式失败:",_),_}}async function m(g,f){try{const _=e.value.findIndex(b=>b.id===g);if(_===-1)throw new Error("未找到快捷方式");e.value[_]={...e.value[_],...f},await d()}catch(_){const b=_;throw console.error("更新快捷方式失败:",b),b}}async function D(g){try{e.value=e.value.filter(f=>f.id!==g),await d()}catch(f){const _=f;throw console.error("删除快捷方式失败:",_),_}}return{engines:n,shortcuts:e,defaultEngine:t,isLoading:o,error:a,getEngineById:l,getShortcutById:c,loadData:r,saveData:d,addEngine:p,updateEngine:i,deleteEngine:E,setDefaultEngine:I,addShortcut:u,updateShortcut:m,deleteShortcut:D}}),N={themeMode:"auto",backgroundSettings:{type:"bing",opacity:.3},language:"zh"},te=Z("settings",()=>{const n=y(N.themeMode),e=y(N.backgroundSettings),t=y(N.language);async function o(){try{const i=T.getSettings();i&&(n.value=i.themeMode||N.themeMode,e.value=i.backgroundSettings||N.backgroundSettings,t.value=i.language||N.language),c()}catch(i){console.error("Failed to load settings:",i)}}async function a(){try{const i={themeMode:n.value,backgroundSettings:e.value,language:t.value};T.saveSettings(i)}catch(i){console.error("Failed to save settings:",i)}}function l(i){n.value=i,c(),a()}function c(){const i=document.documentElement;if(n.value==="auto"){const E=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;i.setAttribute("data-theme",E?"dark":"light")}else i.setAttribute("data-theme",n.value)}function r(i){e.value=i,a()}function d(i){t.value=i,a()}function p(){n.value=N.themeMode,e.value=N.backgroundSettings,t.value=N.language,c(),a()}return{themeMode:n,backgroundSettings:e,language:t,loadSettings:o,saveSettings:a,setThemeMode:l,setBackgroundSettings:r,setLanguage:d,resetSettings:p}}),X=Z("i18n",()=>{const n=y("zh"),e=y({}),t=y(!1),o=y(null),a=M(()=>u=>e.value[n.value]&&e.value[n.value][u]||u),l=M(()=>Object.keys(e.value));async function c(){t.value=!0,o.value=null;try{let u=await T.getData();u||(u=await T.loadDefaultData()),u?(e.value=u.languages||{},u.defaultLanguage&&(n.value=u.defaultLanguage)):o.value="无法加载语言数据"}catch(u){const m=u;console.error("初始化国际化失败:",m),o.value=m.message}finally{t.value=!1}}function r(u){if(!e.value[u]){console.warn(`语言 ${u} 不存在`);return}n.value=u,d(u)}async function d(u){try{const m=await T.getData();m&&(m.defaultLanguage=u,await T.saveData(m))}catch(m){const D=m;throw console.error("更新默认语言失败:",D),D}}async function p(u,m){try{e.value[u]?e.value[u]={...e.value[u],...m}:e.value[u]=m,await I()}catch(D){const g=D;throw console.error("添加语言失败:",g),g}}async function i(u){try{if(Object.keys(e.value).length<=1)throw new Error("不能删除唯一的语言");if(n.value===u)throw new Error("不能删除当前使用的语言");const m={...e.value};delete m[u],e.value=m,await I()}catch(m){const D=m;throw console.error("删除语言失败:",D),D}}async function E(u,m,D){try{if(!e.value[u])throw new Error(`语言 ${u} 不存在`);e.value[u][m]=D,await I()}catch(g){const f=g;throw console.error("更新翻译失败:",f),f}}async function I(){try{const u=await T.getData();u&&(u.languages=e.value,await T.saveData(u))}catch(u){const m=u;throw console.error("保存语言包失败:",m),m}}return{currentLanguage:n,languages:e,isLoading:t,error:o,t:a,availableLanguages:l,initI18n:c,setLanguage:r,addLanguage:p,removeLanguage:i,updateTranslation:E,saveLanguages:I}}),re="pistaink_bing_image",le="pistaink_bing_image_date";function xe(){const n=te(),e=y(!1),t=y(null);async function o(){e.value=!0,t.value=null;try{const l=localStorage.getItem(re),c=localStorage.getItem(le),r=new Date().toDateString();if(l&&c===r)return l;const d="https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",p="https://picsum.photos/1920/1080";return localStorage.setItem(re,p),localStorage.setItem(le,r),p}catch(l){const c=l;return console.error("Failed to fetch Bing daily image:",c),t.value=c.message,"https://picsum.photos/1920/1080"}finally{e.value=!1}}async function a(){try{const{backgroundSettings:l}=n;if(!l){document.body.style.backgroundColor="#f5f5f5",document.body.style.backgroundImage="none";return}const{type:c,color:r,imageUrl:d,opacity:p=.5}=l;if(document.body.style.backgroundImage="none",document.body.style.backgroundColor="transparent",c==="color"&&r)document.body.style.backgroundColor=r;else if(c==="image"&&d)document.body.style.backgroundImage=`url(${d})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat";else if(c==="bing"){const E=await o();document.body.style.backgroundImage=`url(${E})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat"}const i=document.querySelector(".background-overlay");i&&(i.style.opacity=p.toString())}catch(l){console.error("Failed to apply background:",l)}}return{isLoading:e,error:t,getBingDailyImage:o,applyBackground:a}}class Se{constructor(){V(this,"plugins",new Map);V(this,"pluginStates",new Map);V(this,"STORAGE_KEY","pistaink_plugins");this.loadPluginStates()}loadPluginStates(){try{const e=localStorage.getItem(this.STORAGE_KEY);e&&JSON.parse(e).forEach(o=>{this.pluginStates.set(o.id,o)})}catch(e){console.error("加载插件状态失败:",e)}}savePluginStates(){try{const e=Array.from(this.pluginStates.values());localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}catch(e){console.error("保存插件状态失败:",e)}}registerPlugin(e){if(this.plugins.has(e.id)){console.warn(`插件ID ${e.id} 已存在，无法重复注册`);return}this.plugins.set(e.id,e),this.pluginStates.has(e.id)||(this.pluginStates.set(e.id,{id:e.id,enabled:!0,order:this.pluginStates.size}),this.savePluginStates())}installPlugins(e){for(const t of this.plugins.values()){const o=this.pluginStates.get(t.id);o!=null&&o.enabled&&t.install&&t.install(e)}}enablePlugin(e){const t=this.pluginStates.get(e);if(t){t.enabled=!0,this.savePluginStates();const o=this.plugins.get(e);o!=null&&o.onActivate&&o.onActivate()}}disablePlugin(e){const t=this.pluginStates.get(e);if(t){t.enabled=!1,this.savePluginStates();const o=this.plugins.get(e);o!=null&&o.onDeactivate&&o.onDeactivate()}}getAllPlugins(){return Array.from(this.plugins.values())}getEnabledPlugins(){return this.getAllPlugins().filter(e=>{const t=this.pluginStates.get(e.id);return t&&t.enabled}).sort((e,t)=>{const o=this.pluginStates.get(e.id),a=this.pluginStates.get(t.id);return((o==null?void 0:o.order)||0)-((a==null?void 0:a.order)||0)})}getPluginState(e){return this.pluginStates.get(e)}updatePluginOrder(e,t){const o=this.pluginStates.get(e);o&&(o.order=t,this.savePluginStates())}}const A=new Se,Ee={class:"header"},Ce={class:"header-container"},De={class:"header-plugins"},$e={class:"header-actions"},Ie={class:"language-selector"},Pe={key:0,class:"dropdown-menu language-dropdown"},Me=["onClick"],Le={key:0},Te={key:1},Ae={key:2},Ne=j({__name:"Header",setup(n){const e=X(),t=te(),o=e.t,a=M(()=>e.currentLanguage),l=M(()=>e.availableLanguages),c=M(()=>t.themeMode),r=y(!1),d=y(!1);function p(m){m.stopPropagation(),console.log("切换语言下拉菜单"),r.value=!r.value}function i(){const m=["light","dark","auto"],g=(m.indexOf(c.value)+1)%m.length;t.setThemeMode(m[g])}function E(m){console.log("切换语言至:",m),e.setLanguage(m),r.value=!1}function I(){d.value=!0;const m=new CustomEvent("openSettings");window.dispatchEvent(m)}function u(m){const D=m.target;r.value&&!D.closest(".language-selector")&&(console.log("关闭语言下拉菜单"),r.value=!1)}return F(()=>{console.log("Header组件已挂载"),document.addEventListener("click",u)}),ue(()=>{document.removeEventListener("click",u)}),(m,D)=>(S(),x("header",Ee,[s("div",Ce,[s("div",De,[he(m.$slots,"plugins",{},void 0,!0)]),s("div",$e,[s("div",Ie,[s("button",{onClick:p,class:"language-button"},k(a.value.toUpperCase()),1),r.value?(S(),x("div",Pe,[(S(!0),x(q,null,G(l.value,g=>(S(),x("button",{key:g,onClick:f=>E(g),class:B([{active:g===a.value},"dropdown-item"])},k(g.toUpperCase()),11,Me))),128))])):z("",!0)]),s("button",{onClick:i,class:"theme-button"},[c.value==="light"?(S(),x("span",Le,"🌙")):c.value==="dark"?(S(),x("span",Te,"☀️")):(S(),x("span",Ae,"🔄"))]),s("button",{class:"settings-button",onClick:I}," ⚙️ "+k($(o)("settings")),1)])])]))}});const K=(n,e)=>{const t=n.__vccOpts||n;for(const[o,a]of e)t[o]=a;return t},Oe=K(Ne,[["__scopeId","data-v-0b1dccba"]]),ze={class:"search-box"},Be={class:"search-container"},Ue={class:"engine-selector"},Re=["src","alt"],qe={key:0,class:"engine-dropdown"},Ge={class:"engine-grid"},je=["onClick"],Je=["src","alt"],Ye={class:"engine-name"},He={class:"add-text"},Fe={class:"search-input-container"},Ke=["placeholder"],Ve={key:0,class:"modal"},We={class:"modal-content"},Xe={class:"modal-header"},Qe={class:"modal-body"},Ze={class:"form-group"},et={for:"engineName"},tt={class:"form-group"},nt={for:"engineUrl"},ot={class:"modal-footer"},at=j({__name:"SearchBox",setup(n){const e=ee(),t=X(),o=t.t,a=M(()=>t.currentLanguage),l=M(()=>e.engines),c=M(()=>e.defaultEngine),r=M(()=>l.value.find(w=>w.id===c.value)||l.value[0]),d=M(()=>r.value?g(r.value):""),p=M(()=>r.value?f(r.value):""),i=y(""),E=y(!1),I=y(!1),u=y({name:{[a.value]:""},url:""});function m(w){console.log("选择搜索引擎:",w),e.setDefaultEngine(w),E.value=!1}function D(w){w.stopPropagation(),console.log("切换搜索引擎下拉菜单"),E.value=!E.value}function g(w){return w.name[a.value]||Object.values(w.name)[0]||""}function f(w){return w.iconImageData?w.iconImageData:w.iconUrl?w.iconUrl:`https://www.google.com/s2/favicons?domain=${new URL(w.url).hostname}&sz=64`}function _(){if(!i.value.trim()||!r.value)return;const w=r.value.url.replace("{query}",encodeURIComponent(i.value));window.open(w,"_blank")}function b(){I.value=!0,E.value=!1,u.value={name:{[a.value]:""},url:""}}function P(){I.value=!1}async function L(){if(!u.value.name[a.value]||!u.value.url){alert("Please fill in all fields");return}const w=ge(u.value.url),h=w.includes("{query}")?w:w+(w.includes("?")?"&q={query}":"?q={query}");try{await e.addEngine({name:u.value.name,url:h}),P()}catch(v){console.error("Failed to add search engine:",v),alert("Failed to add search engine")}}function J(w){const h=w.target;E.value&&!h.closest(".engine-selector")&&(console.log("关闭搜索引擎下拉菜单"),E.value=!1)}return F(()=>{console.log("SearchBox组件已挂载"),document.addEventListener("click",J)}),ue(()=>{document.removeEventListener("click",J)}),(w,h)=>(S(),x("div",ze,[s("div",Be,[s("div",Ue,[s("button",{class:"engine-button",onClick:D},[s("img",{src:p.value,alt:d.value,class:"engine-icon"},null,8,Re)]),E.value?(S(),x("div",qe,[s("div",Ge,[(S(!0),x(q,null,G(l.value,v=>(S(),x("button",{key:v.id,class:B(["engine-item",{active:v.id===c.value}]),onClick:C=>m(v.id)},[s("img",{src:f(v),alt:g(v),class:"engine-icon"},null,8,Je),s("span",Ye,k(g(v)),1)],10,je))),128)),s("button",{class:"add-engine-button",onClick:b},[h[3]||(h[3]=s("span",{class:"add-icon"},"+",-1)),s("span",He,k($(o)("add_engine")),1)])])])):z("",!0)]),s("div",Fe,[U(s("input",{"onUpdate:modelValue":h[0]||(h[0]=v=>i.value=v),placeholder:$(o)("search_placeholder"),class:"search-input",onKeydown:ve(_,["enter"])},null,40,Ke),[[R,i.value]]),s("button",{class:"search-button",onClick:_},k($(o)("search_button")),1)])]),I.value?(S(),x("div",Ve,[s("div",{class:"modal-backdrop",onClick:P}),s("div",We,[s("div",Xe,[s("h3",null,k($(o)("add_engine")),1),s("button",{class:"close-button",onClick:P},"×")]),s("div",Qe,[s("div",Ze,[s("label",et,k($(o)("name")),1),U(s("input",{id:"engineName","onUpdate:modelValue":h[1]||(h[1]=v=>u.value.name[a.value]=v)},null,512),[[R,u.value.name[a.value]]])]),s("div",tt,[s("label",nt,k($(o)("url")),1),U(s("input",{id:"engineUrl","onUpdate:modelValue":h[2]||(h[2]=v=>u.value.url=v),placeholder:"https://example.com/search?q={query}"},null,512),[[R,u.value.url]]),s("small",null,k($(o)("use_{query}_placeholder")),1)])]),s("div",ot,[s("button",{class:"cancel-button",onClick:P},k($(o)("cancel")),1),s("button",{class:"save-button",onClick:L},k($(o)("save")),1)])])])):z("",!0)]))}});const st=K(at,[["__scopeId","data-v-9bba84ef"]]),rt={class:"shortcut-grid"},lt={class:"grid-title"},ct={class:"shortcuts-container"},it=["href"],ut={class:"shortcut-icon"},dt=["src","alt"],gt={class:"shortcut-name"},ft=["onClick"],mt={class:"add-text"},pt={key:0,class:"shortcut-modal"},ht={class:"modal-content"},vt={class:"modal-header"},bt={class:"modal-body"},_t={class:"form-group"},yt={for:"shortcutName"},wt={class:"form-group"},kt={for:"shortcutUrl"},xt={class:"modal-footer"},St={class:"action-buttons"},Et={key:1,class:"confirm-modal"},Ct={class:"modal-content confirm-content"},Dt={class:"confirm-message"},$t={class:"confirm-actions"},It=j({__name:"ShortcutGrid",setup(n){const e=ee(),t=X(),o=t.t,a=M(()=>t.currentLanguage),l=M(()=>e.shortcuts),c=y(!1),r=y(!1),d=y(!1),p=y({name:{[a.value]:""},url:""});function i(b){return b.name[a.value]||Object.values(b.name)[0]||""}function E(b){return b.iconImageData?b.iconImageData:b.iconUrl?b.iconUrl:`https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=64`}function I(){r.value=!1,p.value={name:{[a.value]:""},url:""},c.value=!0}function u(b){r.value=!0,p.value={id:b.id,name:{...b.name},url:b.url},c.value=!0}function m(){c.value=!1}async function D(){try{if(!p.value.name[a.value]||!p.value.url){alert("Please fill in all fields");return}const b=ge(p.value.url);r.value&&p.value.id?await e.updateShortcut(p.value.id,{name:p.value.name,url:b}):await e.addShortcut({name:p.value.name,url:b}),m()}catch(b){console.error("Failed to save shortcut:",b),alert("Failed to save shortcut")}}function g(){d.value=!0}function f(){d.value=!1}async function _(){try{p.value.id&&(await e.deleteShortcut(p.value.id),d.value=!1,m())}catch(b){console.error("Failed to delete shortcut:",b),alert("Failed to delete shortcut")}}return(b,P)=>(S(),x("div",rt,[s("h2",lt,k($(o)("shortcuts")),1),s("div",ct,[(S(!0),x(q,null,G(l.value,L=>(S(),x("div",{key:L.id,class:"shortcut-item"},[s("a",{href:L.url,target:"_blank",rel:"noopener noreferrer",class:"shortcut-link"},[s("div",ut,[s("img",{src:E(L),alt:i(L)},null,8,dt)]),s("div",gt,k(i(L)),1)],8,it),s("button",{class:"edit-button",onClick:J=>u(L)},P[2]||(P[2]=[s("span",null,"⋮",-1)]),8,ft)]))),128)),s("div",{class:"shortcut-item add-shortcut",onClick:I},[P[3]||(P[3]=s("div",{class:"add-icon"},"+",-1)),s("div",mt,k($(o)("add_shortcut")),1)])]),c.value?(S(),x("div",pt,[s("div",{class:"modal-backdrop",onClick:m}),s("div",ht,[s("div",vt,[s("h3",null,k(r.value?$(o)("edit"):$(o)("add_shortcut")),1),s("button",{class:"close-button",onClick:m},"×")]),s("div",bt,[s("div",_t,[s("label",yt,k($(o)("name")),1),U(s("input",{id:"shortcutName","onUpdate:modelValue":P[0]||(P[0]=L=>p.value.name[a.value]=L)},null,512),[[R,p.value.name[a.value]]])]),s("div",wt,[s("label",kt,k($(o)("url")),1),U(s("input",{id:"shortcutUrl","onUpdate:modelValue":P[1]||(P[1]=L=>p.value.url=L),placeholder:"https://example.com"},null,512),[[R,p.value.url]])])]),s("div",xt,[r.value?(S(),x("button",{key:0,class:"delete-button",onClick:g},k($(o)("delete")),1)):z("",!0),s("div",St,[s("button",{class:"cancel-button",onClick:m},k($(o)("cancel")),1),s("button",{class:"save-button",onClick:D},k($(o)("save")),1)])])])])):z("",!0),d.value?(S(),x("div",Et,[s("div",{class:"modal-backdrop",onClick:f}),s("div",Ct,[s("div",Dt,k($(o)("confirm_delete")),1),s("div",$t,[s("button",{class:"cancel-button",onClick:f},k($(o)("no")),1),s("button",{class:"delete-confirm-button",onClick:_},k($(o)("yes")),1)])])])):z("",!0)]))}});const Pt=K(It,[["__scopeId","data-v-19817bd2"]]),Mt={class:"plugin-registry",style:{display:"flex","align-items":"center",gap:"8px"}},Lt={key:0,class:"plugin-empty",style:{color:"#666","font-size":"12px"}},Tt=["onClick","title"],At={class:"plugin-icon",style:{"font-size":"20px"}},Nt=j({__name:"PluginRegistry",setup(n){const e=y([]);F(()=>{console.log("PluginRegistry mounted"),setTimeout(()=>{t(),console.log("Registered plugins:",A.getAllPlugins()),console.log("Enabled plugins:",e.value)},100)});function t(){const a=A.getEnabledPlugins();console.log("Refreshing plugins, found:",a.length),e.value=a}function o(a){console.log("Activating plugin:",a);const l=A.getAllPlugins().find(c=>c.id===a);l&&l.onActivate&&l.onActivate()}return(a,l)=>(S(),x("div",Mt,[e.value.length===0?(S(),x("div",Lt," 加载插件中... ")):z("",!0),(S(!0),x(q,null,G(e.value,c=>(S(),x("div",{key:c.id,class:"plugin-item",onClick:r=>o(c.id),title:c.name,style:{display:"flex","align-items":"center","justify-content":"center",width:"36px",height:"36px","border-radius":"50%","background-color":"rgba(255, 255, 255, 0.3)",border:"1px solid rgba(0, 0, 0, 0.1)","backdrop-filter":"blur(4px)",cursor:"pointer",transition:"all 0.2s ease"}},[s("div",At,k(c.icon),1)],8,Tt))),128))]))}});const Ot=K(Nt,[["__scopeId","data-v-ec2cc125"]]),zt={class:"drawing-container"},Bt={class:"drawing-tools"},Ut={class:"tool-group"},Rt={class:"color-picker"},qt=["onClick"],Gt={class:"size-selector"},jt={class:"size-value"},Jt={class:"background-selector"},Yt=["onClick"],Ht={class:"canvas-wrapper"},Ft=j({__name:"DrawingCanvas",setup(n){const e=y(null);let t=null,o=!1,a=0,l=0;const c=y("brush"),r=y("#000000"),d=y(5),p=["#000000","#ffffff","#ff0000","#ff9900","#ffff00","#00ff00","#0099ff","#6633ff"],i=y("#ffffff"),E=["#ffffff","#f0f0f0","#f5f5dc","#e0f7fa","#f9fbe7","#fff3e0","#fbe9e7","#f3e5f5"];be(i,()=>{u()});function I(h){i.value=h}function u(){if(!t||!e.value)return;const h=t.getImageData(0,0,e.value.width,e.value.height);t.fillStyle=i.value,t.fillRect(0,0,e.value.width,e.value.height),t.putImageData(h,0,0)}F(()=>{e.value&&(m(),t=e.value.getContext("2d"),t&&(t.lineCap="round",t.lineJoin="round",t.strokeStyle=r.value,t.lineWidth=d.value,t.fillStyle=i.value,t.fillRect(0,0,e.value.width,e.value.height)),window.addEventListener("resize",m))});function m(){if(!e.value)return;const h=e.value.parentElement;h&&(e.value.width=h.clientWidth,e.value.height=300,t&&(t.fillStyle=i.value,t.fillRect(0,0,e.value.width,e.value.height)))}function D(h){c.value=h}function g(h){r.value=h,t&&(t.strokeStyle=h)}function f(h){o=!0;const v=e.value.getBoundingClientRect();a=h.clientX-v.left,l=h.clientY-v.top}function _(h){if(!o||!t||!e.value)return;const v=e.value.getBoundingClientRect(),C=h.clientX-v.left,O=h.clientY-v.top;t.strokeStyle=c.value==="eraser"?i.value:r.value,t.lineWidth=d.value,t.beginPath(),t.moveTo(a,l),t.lineTo(C,O),t.stroke(),a=C,l=O}function b(){o=!1}function P(h){if(!e.value)return;h.preventDefault();const v=h.touches[0],C=e.value.getBoundingClientRect();a=v.clientX-C.left,l=v.clientY-C.top,o=!0}function L(h){if(!o||!t||!e.value)return;h.preventDefault();const v=h.touches[0],C=e.value.getBoundingClientRect(),O=v.clientX-C.left,oe=v.clientY-C.top;t.strokeStyle=c.value==="eraser"?i.value:r.value,t.lineWidth=d.value,t.beginPath(),t.moveTo(a,l),t.lineTo(O,oe),t.stroke(),a=O,l=oe}function J(){!t||!e.value||(t.fillStyle=i.value,t.fillRect(0,0,e.value.width,e.value.height))}function w(){if(!e.value)return;const h=e.value.toDataURL("image/png"),v=document.createElement("a");v.download=`pistaink-drawing-${new Date().getTime()}.png`,v.href=h,v.click()}return(h,v)=>(S(),x("div",zt,[s("div",Bt,[s("div",Ut,[s("button",{class:B(["tool-btn",{active:c.value==="brush"}]),onClick:v[0]||(v[0]=C=>D("brush")),title:"画笔"}," 🖌️ ",2),s("button",{class:B(["tool-btn",{active:c.value==="eraser"}]),onClick:v[1]||(v[1]=C=>D("eraser")),title:"橡皮擦"}," 🧽 ",2)]),s("div",Rt,[(S(),x(q,null,G(p,C=>s("div",{key:C,class:B(["color-option",{active:r.value===C}]),style:ae({background:C}),onClick:O=>g(C)},null,14,qt)),64))]),s("div",Gt,[U(s("input",{type:"range",min:"1",max:"50","onUpdate:modelValue":v[2]||(v[2]=C=>d.value=C),class:"size-slider"},null,512),[[R,d.value,void 0,{number:!0}]]),s("span",jt,k(d.value)+"px",1)]),s("div",Jt,[v[3]||(v[3]=s("span",null,"背景:",-1)),(S(),x(q,null,G(E,C=>s("div",{key:C,class:B(["bg-color-option",{active:i.value===C}]),style:ae({background:C}),onClick:O=>I(C)},null,14,Yt)),64))])]),s("div",Ht,[s("canvas",{ref_key:"canvas",ref:e,class:"drawing-canvas",onMousedown:f,onMousemove:_,onMouseup:b,onMouseleave:b,onTouchstart:P,onTouchmove:L,onTouchend:b},null,544)]),s("div",{class:"canvas-actions"},[s("button",{class:"action-btn",onClick:J},"清除"),s("button",{class:"action-btn",onClick:w},"保存")])]))}});const ce=K(Ft,[["__scopeId","data-v-e90b735f"]]),Q=y(!1),Kt={id:"drawing",name:"绘画板",description:"简易绘画工具，支持多种画笔和颜色",icon:"✏️",version:"1.0.0",component:ce,install(n){console.log("绘画插件已安装")},onActivate(){Q.value=!0;const n=document.createElement("div");n.classList.add("drawing-modal"),n.innerHTML=`
		<div class="drawing-modal-backdrop"></div>
		<div class="drawing-modal-content">
			<div class="drawing-modal-header">
				<h3>绘画板</h3>
				<button class="drawing-modal-close">×</button>
			</div>
			<div id="drawing-container"></div>
		</div>
		`,document.body.appendChild(n);const e=document.getElementById("drawing-container");e&&de(ce).mount(e);const t=n.querySelector(".drawing-modal-close");t&&t.addEventListener("click",()=>{document.body.removeChild(n),Q.value=!1});const o=n.querySelector(".drawing-modal-backdrop");o&&o.addEventListener("click",()=>{document.body.removeChild(n),Q.value=!1});const a=document.createElement("style");a.textContent=`
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
		`,document.head.appendChild(a)},onDeactivate(){console.log("绘画插件已禁用")}};y(!1);const Vt={id:"screenshot",name:"网页截图",description:"截取当前网页并保存",icon:"📷",version:"1.0.0",install(n){console.log("截图插件已安装")},onActivate(){const n=document.createElement("div");n.textContent="正在截取屏幕...",n.style.cssText=`
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			padding: 8px 16px;
			border-radius: 4px;
			z-index: 10000;
		`,document.body.appendChild(n),setTimeout(()=>{setTimeout(()=>{document.body.removeChild(n);const e=document.createElement("canvas"),t=e.getContext("2d");if(e.width=window.innerWidth,e.height=window.innerHeight,t){t.fillStyle="white",t.fillRect(0,0,e.width,e.height),t.font="24px Arial",t.fillStyle="black",t.textAlign="center",t.fillText("屏幕截图功能示例",e.width/2,e.height/2),t.font="16px Arial",t.fillText(`时间: ${new Date().toLocaleString()}`,e.width/2,e.height/2+40);const o=e.toDataURL("image/png"),a=document.createElement("a");a.download=`screenshot-${new Date().getTime()}.png`,a.href=o,a.click()}},500)},100)},onDeactivate(){console.log("截图插件已禁用")}},Wt=["#ff5252","#ff4081","#e040fb","#7c4dff","#536dfe","#448aff","#40c4ff","#18ffff","#64ffda","#69f0ae","#b2ff59","#eeff41","#ffff00","#ffd740","#ffab40","#ff6e40"],Xt={id:"color-picker",name:"颜色提取器",description:"从网页中提取主要颜色",icon:"🎨",version:"1.0.0",install(n){console.log("颜色提取器插件已安装")},onActivate(){const n=document.createElement("div");n.className="color-picker-panel";const e=document.createElement("div");e.className="color-picker-header",e.innerHTML=`
			<h3>颜色提取器</h3>
			<button class="color-picker-close">×</button>
		`,n.appendChild(e);const t=document.createElement("div");t.className="color-grid",Wt.forEach(c=>{const r=document.createElement("div");r.className="color-item",r.style.backgroundColor=c,r.setAttribute("data-color",c),r.addEventListener("click",()=>{navigator.clipboard.writeText(c).then(()=>{r.setAttribute("data-copied","true"),r.innerText="已复制",setTimeout(()=>{r.innerText="",r.removeAttribute("data-copied")},1e3)})}),t.appendChild(r)}),n.appendChild(t);const o=document.createElement("p");o.className="color-picker-hint",o.textContent="点击颜色块复制色值",n.appendChild(o),document.body.appendChild(n);const a=n.querySelector(".color-picker-close");a&&a.addEventListener("click",()=>{document.body.removeChild(n)});const l=document.createElement("style");l.textContent=`
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
		`,document.head.appendChild(l)},onDeactivate(){console.log("颜色提取器插件已禁用")}},fe="pistaink_memos";function Qt(){try{const n=localStorage.getItem(fe);return n?JSON.parse(n):[]}catch(n){return console.error("加载便签失败:",n),[]}}function ie(n){localStorage.setItem(fe,JSON.stringify(n))}function Zt(){const n=["#ffcdd2","#f8bbd0","#e1bee7","#d1c4e9","#c5cae9","#bbdefb","#b3e5fc","#b2ebf2","#b2dfdb","#c8e6c9","#dcedc8","#f0f4c3","#fff9c4","#ffecb3","#ffe0b2","#ffccbc"];return n[Math.floor(Math.random()*n.length)]}const en={id:"memo",name:"便签",description:"创建和管理便签",icon:"📝",version:"1.0.0",install(n){console.log("便签插件已安装")},onActivate(){const n=Qt(),e=document.createElement("div");e.className="memo-panel";const t=document.createElement("div");t.className="memo-header",t.innerHTML=`
			<h3>我的便签</h3>
			<button class="memo-close">×</button>
		`,e.appendChild(t);const o=document.createElement("div");o.className="memo-list";function a(){if(o.innerHTML="",n.length===0){const d=document.createElement("p");d.className="memo-empty",d.textContent="没有便签，点击下方按钮添加",o.appendChild(d)}else n.forEach((d,p)=>{const i=document.createElement("div");i.className="memo-item",i.style.backgroundColor=d.color;const E=document.createElement("div");E.className="memo-content",E.textContent=d.content,i.appendChild(E);const I=document.createElement("div");I.className="memo-date",I.textContent=new Date(d.createdAt).toLocaleString(),i.appendChild(I);const u=document.createElement("button");u.className="memo-delete",u.textContent="删除",u.addEventListener("click",m=>{m.stopPropagation(),n.splice(p,1),ie(n),a()}),i.appendChild(u),o.appendChild(i)})}a(),e.appendChild(o);const l=document.createElement("button");l.className="memo-add-btn",l.textContent="添加便签",l.addEventListener("click",()=>{const d=prompt("请输入便签内容:");if(d&&d.trim()){const p={id:Date.now().toString(),content:d.trim(),color:Zt(),createdAt:Date.now()};n.unshift(p),ie(n),a()}}),e.appendChild(l),document.body.appendChild(e);const c=e.querySelector(".memo-close");c&&c.addEventListener("click",()=>{document.body.removeChild(e)});const r=document.createElement("style");r.textContent=`
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
		`,document.head.appendChild(r)},onDeactivate(){console.log("便签插件已禁用")}},tn={class:"app-container"},nn={class:"main-content"},on=j({__name:"App",setup(n){const e=ee(),t=te(),o=X(),a=xe();F(async()=>{if(console.log("App component mounted"),console.log("清除本地存储..."),localStorage.removeItem("pistaink_app_data"),console.log("本地存储已清除"),console.log("正在加载应用数据..."),await e.loadData(),console.log("应用数据加载完成"),console.log("Registering plugins..."),A.registerPlugin(Kt),A.registerPlugin(Vt),A.registerPlugin(Xt),A.registerPlugin(en),console.log("Plugins registered:",A.getAllPlugins().length),await o.initI18n(),await t.loadSettings(),a.applyBackground(),e.engines.length===0||e.shortcuts.length===0){if(console.log("搜索引擎或快捷方式为空，尝试重新加载数据..."),await e.loadData(),e.engines.length===0){console.log("仍然无法加载搜索引擎，使用硬编码数据");const r=[{id:"google",name:{zh:"谷歌",en:"Google"},url:"https://www.google.com/search?q="},{id:"bing",name:{zh:"必应",en:"Microsoft Bing"},url:"https://www.bing.com/search?q="}];for(const d of r)await e.addEngine(d);await e.setDefaultEngine("bing")}if(e.shortcuts.length===0){console.log("仍然无法加载快捷方式，使用硬编码数据");const r=[{name:{zh:"GitHub",en:"GitHub"},url:"https://github.com"},{name:{zh:"YouTube",en:"YouTube"},url:"https://youtube.com"}];for(const d of r)await e.addShortcut(d)}}const c=window.matchMedia("(prefers-color-scheme: dark)");l(c),c.addEventListener("change",l)}),_e(()=>{window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change",l)});function l(c){const r=c.matches;localStorage.getItem("pistaink_settings")||t.setThemeMode(r?"dark":"light")}return(c,r)=>(S(),x("div",tn,[W(Oe,null,{plugins:ye(()=>[W(Ot)]),_:1}),s("main",nn,[W(st),W(Pt)])]))}});document.documentElement.style.setProperty("--primary-color","#3498db");document.documentElement.style.setProperty("--border-color","#e0e0e0");document.documentElement.style.setProperty("--card-bg","#ffffff");document.documentElement.style.setProperty("--dropdown-bg","#ffffff");document.documentElement.style.setProperty("--text-color","#333333");document.documentElement.style.setProperty("--shadow-color","rgba(0, 0, 0, 0.1)");console.log("应用初始化开始");const ne=de(on);ne.use(we());console.log("插件管理器初始化");A.installPlugins(ne);ne.mount("#app");window.addEventListener("load",()=>{console.log("Window loaded, plugins available:",A.getAllPlugins().length)});console.log("应用初始化完成");
