parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"yKV9":[function(require,module,exports) {
!function(){for(var e,n=function(){},o=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeline","timelineEnd","timeStamp","trace","warn"],i=o.length,r=window.console=window.console||{};i--;)r[e=o[i]]||(r[e]=n)}();
},{}],"IGu4":[function(require,module,exports) {
function e(e){return c(e)||n(e)||l(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function c(e){if(Array.isArray(e))return s(e)}function a(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=l(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var c=0,a=function(){};return{s:a,n:function(){return c>=e.length?{done:!0}:{done:!1,value:e[c++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,o=!0,r=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return o=e.done,e},e:function(e){r=!0,s=e},f:function(){try{o||null==n.return||n.return()}finally{if(r)throw s}}}}function l(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,c=new Array(t);n<t;n++)c[n]=e[n];return c}var o=function(){var e=/^fr\b/.test(navigator.language);document.querySelectorAll("[data-fr]").forEach(function(t){t.textContent=e?t.dataset.fr:t.dataset.en}),document.getElementById("arrayRefSearch").value="",document.getElementById("languesListeRef").value="",document.getElementById("folderPicker").addEventListener("change",function(e){var t=document.querySelector(".warning_info"),n=r(this.files),c=n.chatLog,a=n.combatLog;t.style.display="none",c.length>0&&a.length>0?p(n,"langues",""):c.length>0&&0===a.length?p(c,"process",""):t.style.display="flex"}),d(document.getElementById("listing")),y(),x()},r=function(e){var t,n=[],c=[],l=a(e);try{for(l.s();!(t=l.n()).done;){var s=t.value,o=1!==s.webkitRelativePath.match(/[\/]/g).length,r=s.name.match("Chatlog"),i=s.name.match("Combatlog");o||(r&&n.push(s),i&&c.push(s))}}catch(d){l.e(d)}finally{l.f()}return{chatLog:n,combatLog:c}},i=function(e,t,n){var c=document.getElementById("listing"),l=[],s=0,o=c.querySelector(".selected");o=null!==o?o.querySelector("span:nth-child(2)").textContent:"",c.innerHTML="";var r,i=a(e);try{for(i.s();!(r=i.n()).done;){for(var d=r.value.name.slice(0,-4),m=(s+1).toString();m.length<=e.length.toString().length;)m="0".concat(m);var h="";(o===d||""===o&&0===s)&&(h="selected");var f=t?'<span class="founded">'.concat(n[s],"</span>"):"",v='<li class="'.concat(h,'" data-index="').concat(s,'" ><span>').concat(m,"</span><span>").concat(d,"</span>").concat(f,"</li>");l.push(v),s++}}catch(y){i.e(y)}finally{i.f()}c.innerHTML=l.join("");var g=c.querySelector(".selected");g||(g=c.querySelector("li:first-child")).classList.add("selected"),g.scrollIntoView({behavior:"smooth",block:"start",inline:"start"}),u(c,e)},d=function(e){var t=document.getElementById("statsInfo");t.querySelector(".icon").addEventListener("click",function(e){0===t.offsetWidth?(t.style.width="260px",t.style.minWidth="260px",this.classList.replace("close","open")):(t.style.width="0",t.style.minWidth="0",this.classList.replace("open","close"))}),document.querySelector(".back_to_liste").addEventListener("click",function(e){if(!this.classList.contains("show"))return!1;i(r(document.getElementById("folderPicker").files).chatLog,!1),this.classList.remove("show"),document.querySelector(".table_container").classList.remove("resize");var t=document.getElementById("searchFiles");t.classList.replace("show","close"),t.querySelector("#goSearch").textContent="Lancer la recherche",t.querySelector("#goNewSearch").classList.add("disabled")}),document.querySelector(".collapse").addEventListener("click",function(e){var t=document.querySelector(".container");this.classList.contains("close")?(this.classList.remove("close"),t.classList.remove("close"),this.innerHTML="&lsaquo;"):(this.classList.add("close"),t.classList.add("close"),this.innerHTML="&rsaquo;")});var n,c=document.querySelectorAll(".file_prev, .file_next"),l=a(c);try{for(l.s();!(n=l.n()).done;){n.value.addEventListener("click",function(t){var n=e.querySelector(".selected"),a=e.querySelectorAll("li"),l=n.dataset.index;this.classList.contains("file_prev")&&l>0?(c[1].classList.remove("disabled"),l--):this.classList.contains("file_next")&&l<a.length-1&&(c[0].classList.remove("disabled"),l++),0!=+l&&+l!=a.length-1||this.classList.add("disabled"),+l!=+n.dataset.index&&e.querySelector('li[data-index="'+l+'"]').click()})}}catch(v){l.e(v)}finally{l.f()}document.getElementById("termToSearch").addEventListener("keyup",function(e){var t=this.value,n=t.match(/^\s+/g);t.length>2&&!n?(this.classList.remove("invalid"),"Enter"===e.key&&document.getElementById("goSearch").click()):n&&(this.classList.add("invalid"),this.value="")});var s=document.getElementById("checkByDate");f(s.checked),s.addEventListener("click",function(e){f(s.checked)});var o,d=document.querySelectorAll("#searchFiles input[type=date]"),u=a(d);try{for(u.s();!(o=u.n()).done;){o.value.addEventListener("change",function(e){""!==d[0].value&&""!==d[1].value&&d[0].value>d[1].value?d[0].value="":(d[0].value,d[1].value)})}}catch(v){u.e(v)}finally{u.f()}var m=document.querySelector(".menu_options .open_search span"),h=document.getElementById("searchFiles");m.addEventListener("click",function(e){h.classList.contains("close")||0===h.classList.length?(h.classList.remove("close"),h.classList.add("show"),h.querySelector("#goSearch").focus()):(h.classList.add("close"),h.classList.remove("show"))}),h.querySelector(".close_btn").addEventListener("click",function(e){m.click()}),document.querySelector(".table_container").addEventListener("click",function(e){e.stopImmediatePropagation();var t=e.target;null!==(t=t.closest("#searchFiles"))&&"searchFiles"===t.id||!h.classList.contains("show")||m.click()}),h.querySelector(".search_fail").addEventListener("click",function(){this.classList.remove("show")})},u=function(e,t){var n,c=document.querySelectorAll('.input_group input[type="checkbox"]'),l=document.querySelector("#fileContent tbody"),s=a(c);try{var o=function(){var e=n.value,t=void 0;e.addEventListener("click",function(n){if("fileSort"===e.id&&h(e.checked),"colPseudo"===e.id&&(t=l.querySelectorAll(".pseudo")),"colDialogType"===e.id&&(t=l.querySelectorAll(".msgType")),"colPseudo"===e.id||"colDialogType"===e.id){var c,s=a(t);try{for(s.s();!(c=s.n()).done;){var o=c.value;e.checked?o.classList.add("hide"):o.classList.remove("hide")}}catch(r){s.e(r)}finally{s.f()}}})};for(s.s();!(n=s.n()).done;)o()}catch(u){s.e(u)}finally{s.f()}var r=function(n){var c=n.target,a=e.querySelector("li.selected");a&&a.classList.remove("selected"),c.classList.add("selected"),m(c,i.length,document.querySelectorAll(".file_prev, .file_next, .file_name, .file_num")),p([t[c.dataset.index]],"process")},i=e.querySelectorAll("li");i.forEach(function(e){return e.onclick=r}),document.querySelector(".menu_options .open_search").classList.remove("disabled"),document.querySelector(".menu_options li.navig").classList.remove("disabled");var d=function(e){e.preventDefault();var n,c=document.getElementById("termToSearch"),a=c.value.trim();if(a.length>2){c.value=a;var l={termTosearch:a,msgExcludeParty:document.getElementById("checkMsgExcludeParty").checked,msgExcludeShout:document.getElementById("checkMsgExcludeShout").checked,msgExcludeMp:document.getElementById("checkMsgExcludeMp").checked,wholeWord:document.getElementById("checkWholeWord").checked,checkCasse:document.getElementById("checkCaseSensitive").checked},s=document.getElementById("checkByDate").checked;"goNewSearch"===e.target.id&&(n=document.getElementById("folderPicker").files),s?(n=v(t),p(n,"search",l)):p(t,"search",l),document.querySelector(".back_to_liste").classList.add("show")}else c.classList.add("invalid"),/^fr\b/.test(navigator.language)?alert("Le champ de recherche ne doit pas être vide"):alert("The search field must not be empty")};document.querySelectorAll("#searchFiles .searchContainer button").forEach(function(e){return e.onclick=d})},m=function(e,t,n){var c=n[0],a=n[1],l=n[2],s=n[3];c.textContent=e.querySelector("span:nth-child(2)").textContent,s.innerHTML="<span>".concat(+e.dataset.index+1,"</span>/<span>").concat(t,"</span>"),+e.dataset.index+1==1?(a.classList.add("disabled"),l.classList.remove("disabled")):+e.dataset.index+1===t?(a.classList.remove("disabled"),l.classList.add("disabled")):(a.classList.remove("disabled"),l.classList.remove("disabled"))},h=function(e){var t=document.getElementById("listing"),n=document.querySelector(".file_prev"),c=document.querySelector(".file_next"),a=t.querySelector("li.selected"),l="center";a&&(e?(t.classList.add("reverse"),a||(a=t.querySelector("li:last-child"),l="start"),n.classList.remove("disabled"),c.classList.add("disabled")):(t.classList.remove("reverse"),a||(a=t.querySelector("li:first-child"),l="end"),n.classList.add("disabled"),c.classList.remove("disabled")),a.scrollIntoView({behavior:"smooth",block:l,inline:l}),a.click())},f=function(e){var t=document.querySelector(".chooseDate");e?t.classList.remove("disabled"):t.classList.add("disabled")},v=function(e){for(var t=document.getElementById("dateDeb").value,n=document.getElementById("dateFin").value,c=0;c<e.length;){var a=e[c].name.slice(0,-4),l=a.slice(a.length-10).toString().match(/([0-9]{4})\D([0-9]{2})\D([0-9]{2})$/g).toString();(l<t||l>n)&&(e.splice(c,1),c--),c++}return e},g=function(){var e=function(e){var t=document.getElementById("fileContent"),n=e.target;"index"!==n.className&&(n=n.closest("tr").querySelector("td.index"));var c=n.dataset.index,a=t.querySelector('td[data-index="'+c+'"]');document.querySelectorAll("table td.focus").forEach(function(e){return e.classList.remove("focus")}),n.classList.add("focus"),a.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"}),a.classList.add("focus")};document.querySelectorAll("#resultByLine tr").forEach(function(t){return t.onclick=e});var t=document.querySelectorAll(".pjName.btn"),n=document.getElementById("popupFullName"),c=function(e){var t=e.target;n.classList.add("show"),n.innerText=t.dataset.fullname,n.style.color=t.style.color,n.style.top=t.getBoundingClientRect().top+"px",n.style.left="".concat(t.getBoundingClientRect().left-document.querySelector(".col_left").offsetWidth+t.offsetWidth,"px")},a=function(e){n.classList.remove("show")};t.forEach(function(e){return e.onmouseenter=c}),t.forEach(function(e){return e.onmouseleave=a});var l=document.querySelectorAll("#statsInfo span.plus, #statsInfo span.moins");l.forEach(function(e){var t=0;if(e.classList.contains("plus")){var n=document.querySelectorAll('#fileContent tr[data-numpj="'+e.closest("li").dataset.numpj+'"]');e.previousElementSibling.textContent=n.length.toString(),e.previousElementSibling.dataset.maxSpeech=n.length.toString()}e.onclick=function(e){var n=e.target,c=n.closest("li").dataset.numpj,a=document.querySelectorAll('#fileContent tr[data-numpj="'+c+'"]');document.querySelectorAll("#fileContent td.index").forEach(function(e){return e.classList.remove("focus")}),l.forEach(function(e){return e.classList.remove("end")});var s=n.closest("li").querySelector(".plus"),o=n.closest("li").querySelector(".moins"),r=n.closest("li").querySelector(".num-speech");n.classList.contains("plus")?(t=n.dataset.currentIndex,++t===a.length&&(n.classList.add("end"),t=0),n.dataset.currentIndex=t,o.classList.remove("end")):n.classList.contains("moins")&&(t=s.dataset.currentIndex,--t<0&&(n.classList.add("end"),t=a.length-1),s.dataset.currentIndex=t,s.classList.remove("end")),r.textContent="".concat(t+1,"/").concat(r.dataset.maxSpeech),a[t]&&(a[t].scrollIntoView({behavior:"smooth",block:"start",inline:"start"}),a[t].querySelector("td.index").classList.add("focus"))}}),document.querySelectorAll("#statsInfo li > span:first-child").forEach(function(e){return e.onclick=function(){e.closest("li").querySelector(".plus").click()}})},y=function(){var e=document.querySelector(".search_result"),t=document.querySelector(".file_content"),n=function(n){var a=document.querySelector(".table_container").offsetHeight,l=(n.y-60)/a*100;e.style.height="calc(".concat(l,"% - 7px)"),t.style.height="calc(100% - ".concat(l,"%)"),c.style.top="calc(".concat(l,"% - 7px)")},c=document.querySelector(".handle");c.addEventListener("mousedown",function(e){document.addEventListener("mousemove",n,!1)},!1),document.addEventListener("mouseup",function(){document.removeEventListener("mousemove",n,!1)},!1)},p=function(e,t,n){var c=document.body,l=e,s=1,o=[],r=[],d=[],u=[];"langues"===t&&(l=e.combatLog),c.classList.add("wait");performance.now();var m,f=a(l);try{var v=function(){var a=m.value,f=new Promise(function(e){var t=new FileReader;t.onload=function(){return e(t.result)},t.onprogress=function(e){if(e.lengthComputable){var t=e.loaded/e.total*100;document.querySelector("#blocWait .progress").style.width="".concat(t,"%")}},t.readAsText(a,"ISO-8859-1")});Promise.all([f]).then(function(m){var f,v,y;switch(f=/([\[][0-9]{2}:[0-9]{2}] .*?: \[.*?\] [^\[]+)$/gm,v=m.join("").match(new RegExp(f)),t){case"langues":for(var p in f=/^([\[][0-9]{2}:[0-9]{2}])\s<color=lightgrey>\s?(.*?\s):?(\(.*?\)\s)?(.*?)<\/c.*?>$/gm,v=m.join("").match(new RegExp(f))){var b;b=v[p].replace(/<color=.*?>\s?/g,"").replace(/<\/c.*?>/g,""),v[p]=/^([\[][0-9]{2}:[0-9]{2}])\s(.*?)(\(.*\)|:)\s(.*?)$/gm.exec(b)}null!==v&&o.push({file:a.name,lines:v}),s===l.length&&(document.getElementById("languesListeRef").value=JSON.stringify(o),c.classList.remove("wait"),i(e.chatLog,!1),h(document.getElementById("fileSort").checked),document.querySelector("#statsInfo .icon").classList.add("close"));break;case"search":if((y=L(a.name,v,n)).datas.length>0&&(r.push({fileName:a.name,datas:y.datas,allPos:y.numPos}),d.push(a)),s===l.length)if(r.length>0){r.sort(function(e,t){return e.fileName.localeCompare(t.fileName)}),d.sort(function(e,t){return e.name.localeCompare(t.name)}),r.forEach(function(e){u.push(e.allPos)}),i(d,!0,u),document.getElementById("arrayRefSearch").value=JSON.stringify(r),document.querySelector(".table_container").classList.add("resize");var E=document.querySelector("#listing li.selected");E||(E=document.querySelector("#listing li:first-child")),E.click()}else{var x,q=document.querySelector("#searchFiles .search_fail");x=(x=/^fr\b/.test(navigator.language)?q.dataset.fr:q.dataset.en).replace(/(\[\s%%%\s\])/g,"<strong>[ ".concat(n.termTosearch," ]</strong>")),q.innerHTML="<span>".concat(x,"</span>"),q.classList.add("show"),c.classList.remove("wait")}break;case"process":S(v,a.name,document.querySelector(".table_container").classList.contains("resize")),g(),c.classList.remove("wait")}s++})};for(f.s();!(m=f.n()).done;)v()}catch(y){f.e(y)}finally{f.f()}},L=function(e,t,n){var c,l,s,o,r,i=n.termTosearch,d=0,u=0,m={datas:[],numPos:""},h=JSON.parse(document.getElementById("languesListeRef").value),f=h.find(function(t){return t.file===e.replace("Chatlog","Combatlog")}),v=n.checkCasse?"":"i";if(s=n.wholeWord?new RegExp("(?<=^|[^a-zA-ZÀ-ÖØ-öø-ÿ])("+i+")(?=[^a-zA-ZÀ-ÖØ-öø-ÿ]|$)","g"+v):new RegExp(i,"g"+v),void 0!==f){f.lines.forEach(function(e){var t;for(e[4]=e[4].replace(/(<span class="highlight">.*?<\/span>)/g,"$&");null!==(t=s.exec(e[4]));)t.index===s.lastIndex&&s.lastIndex++,c=!0,u++;c&&(e[4]=e[4].replace(s,'<span class="highlight">$&</span>')),0}),h.splice(h.indexOf(f),1,f),document.getElementById("languesListeRef").value=JSON.stringify(h)}var g,y=a(t);try{for(y.s();!(g=y.n()).done;){var p=g.value,L=/^[\[][0-9]{2}:[0-9]{2}].\[.*?\].*?: (\[.*?\])(.*)$/gm.exec(p);if(c=!1,[],l=[],null!==L){if(r=L[1].slice(1,-1).toLowerCase().trim(),o=L[2].replaceAll(/(\r\n|\n|\r)/gm,"<br>"),10===r.length&&"servertell"===r&&d-1>0&&o.match("<C=#EDBAB2>")){o=o.replaceAll(/<(?!br\s*\/?)[^>]+>/g,"");var S=t[d-1].replaceAll(/<[^>]*>/g,"");r=/^[\[][0-9]{2}:[0-9]{2}] (.*?|\[.*?\].*?:) (\[.*?\])(.*)$/gm.exec(S)[2].slice(1,-1).toLowerCase().trim();var b=/^\[.*?\]\s\((.*?)\)\s:\s(.*?)$/gm.exec(o.trim());null!==b&&(o='<span class="traduc"><strong>'.concat(b[1],"</strong> ").concat(b[2],"</span>"))}else o=o.replaceAll(/<(?!br\s*\/?)[^>]+>/g,"");if("tell"===r&&!n.msgExcludeMp||"shout"===r&&!n.msgExcludeShout||"party"===r&&!n.msgExcludeParty||"talk"===r||"whisper"===r||"dialog"===r){for(var E=void 0;null!==(E=s.exec(o));)E.index===s.lastIndex&&s.lastIndex++,c=!0,u++;c&&l.push(o.replace(s,'<span class="highlight">$&</span>'))}}c&&(m.numPos=u,m.datas.push({newMessage:l,numLigne:d})),d++}}catch(x){y.e(x)}finally{y.f()}return m},S=function(e,t,n){var c=document.querySelector("#fileContent tbody"),l=document.querySelector("#resultByLine tbody"),s=/^(.*)([_]|[ (])(Chatlog)/g.exec(t);s=s[1].trim().replaceAll("_"," ");var o,r,i,d,u,m,h=E(e,s),f=[],v=[],g=0,y=document.getElementById("languesListeRef").value;y.length>0&&(u=JSON.parse(y),m=u.find(function(e){return e.file===t.replace("Chatlog","Combatlog")})),n&&(o=JSON.parse(document.getElementById("arrayRefSearch").value),r=o.find(function(e){return e.fileName===t}));var p,L=a(e);try{for(L.s();!(p=L.n()).done;){var S=p.value;S=S.replaceAll(/(\n\r|\r\n|\n|\r)/gm,"<br>");var b=/^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\]) (.*?)$/gm.exec(S),x=!1,q="",k="";null!==b&&function(){var t=b[1],c=void 0===b[2]?"(pnj ou dm)":b[2].trim(),l=b[3].trim().slice(0,-1),s=b[4];if(k=b[5],"[Server]"===c&&"[ServerTell]"===s&&g-1>0&&k.match("<C=#EDBAB2>")){k=k.replaceAll(/<(?!br\s*\/?)[^>]+>/g,"");var o=e[g-1].replaceAll(/<[^>]*>/g,""),u=/^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\])(.*)$/gm.exec(o);c=void 0===u[2]?"(pnj ou dm)":u[2].trim(),l=u[3].trim().slice(0,-1),s=u[4];var y=/^\[.*?\]\s\((.*?)\)\s:\s(.*?)$/gm.exec(k);null!==y&&(k='<span class="traduc"><strong>'.concat(y[1],"</strong> ").concat(y[2],"</span>"),x=!0)}else k=k.replaceAll(/<(?!br\s*\/?)[^>]+>/g,"");var p,L=s.slice(1,-1).replaceAll(" ","").toLowerCase(),S=document.getElementById("colPseudo").checked?"hide":"",E=document.getElementById("colDialogType").checked?"hide":"",I=h.names.indexOf(l),w=void 0===h.colors[I]?"#b6c0ca":h.colors[I],A="",B=a(k.split(/([*].*?[*])/g));try{for(B.s();!(p=B.n()).done;){var C=p.value;C.includes("*")?A+='<span class="italic">'.concat(C,"</span>"):""!==C&&(A+=C),k=A}}catch(D){B.e(D)}finally{B.f()}var _,T=void 0;_=l,l.length>23&&(l=l.slice(0,23)+"...",T="btn"),q=k;var j=!1,N=!1,M=!1,P=void 0;if(d="",void 0!==m&&(M=(P=m.lines.filter(function(e){return e[1]===t})).length>0),M){var R=P[0];if(R[2].trim()===_&&"[Tell]"!==s&&"[Party]"!==s){d='<span class="traduc"><strong>'.concat(R[3],"</strong> ").concat(R[4],"</span>");/(<span class="highlight">.*?<\/span>)/g.test(R[4])&&(N=!0),void 0!==m&&m.lines.shift()}}n&&void 0!==r&&void 0!==(i=r.datas.find(function(e){return e.numLigne===g}))&&i.numLigne===g&&(j=!0,q=i.newMessage),q+=d;var O="";x&&(L+=" no-svg",O='class = "traduc"');var $="<tr data-numPj = ".concat(I," ").concat(O,'>\n                                 <td class="index" data-index="').concat(g+1,'">').concat(g+1,'</td>\n                                 <td class="heure">').concat(t,'</td>\n                                 <td class="pseudo ').concat(S,'" style="color: ').concat(w,'">').concat(c,'</td>\n                                 <td class="pjName ').concat(T,'" style="color: ').concat(w,'" data-fullName = "').concat(_,'">').concat(l,'</td>\n                                 <td class="msgType ').concat(L," ").concat(E,'" title="').concat(L,'"><span>').concat(s,'</span></td>\n                                 <td class="message ').concat(L,'" style="color: ').concat(w,'"><div>').concat(q,"</div></td>                                 \n                              </tr>");f.push($),(j||N)&&v.push($)}(),g++}}catch(_){L.e(_)}finally{L.f()}if(n){l.innerHTML=v.join(""),l.scrollIntoView({behavior:"smooth",block:"start",inline:"start"});var I=document.getElementById("searchFiles");I.classList.replace("show","close");var w=I.querySelector("#goSearch");/^fr\b/.test(navigator.language)?w.textContent=w.dataset.frNext:w.textContent=w.dataset.enNext,I.querySelector("#goNewSearch").classList.remove("disabled")}var A=document.querySelector("#statsInfo"),B=[];for(var C in A.querySelector(".pj_count > span > span").textContent=h.names.length.toString(),h.names)B.push('<li data-numPj="'.concat(C,'" style="color: ').concat(h.colors[C],'">\n                        <span>').concat(h.names[C],'</span>\n                        <div><span class="num-speech"></span>\n                        <span class="plus" data-current-index="-1"></span>\n                        <span class="moins"></span></div></li>'));A.querySelector(".details").innerHTML="<ul>".concat(B.join(""),"</ul>"),c.innerHTML=f.join(""),c.scrollIntoView({behavior:"smooth",block:"start",inline:"start"})},b=function(){return["hsl(306,51%,52%)","hsl(93, 100%, 30.2%)","hsl(240, 67.5%, 59%)","hsl(50,100%,20%)","hsl(183, 87.6%, 25.3%)","hsl(258,97%,60%)","hsl(116,84%,26%)","hsl(46,55%,30%)","hsl(186, 90%, 33%)","hsl(22, 92.4%, 46.3%)","hsl(225, 94.4%, 37%)","hsl(9,87%,42%)","#0095ff","hsl(280, 90%, 43%)","hsl(23, 88.3%, 45%)","hsl(162,46%,28%)","hsl(14, 100%, 62.5%)"]},E=function(e,t){var n,c=b(),l=1,s={names:[],colors:[]},o=a(e);try{for(o.s();!(n=o.n()).done;){var r=n.value,i=/^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\])/g.exec(r),d=void 0;null!==i&&(d=i[3].trim().slice(0,-1),-1===s.names.indexOf(d)&&""!==d&&(s.names.push(d),d===t?s.colors.push(c[0]):s.colors.push(c[l]),++l>c.length-1&&(l=1)))}}catch(u){o.e(u)}finally{o.f()}return s},x=function(){document.body.addEventListener("copy",function(t){t.preventDefault();var n=document.querySelector("#fileContent"),c=document.getSelection(),a="";if(c.isCollapsed)a=(a=n.outerHTML).split("</tr>");else{var l=(c=c.getRangeAt(0)).commonAncestorContainer.parentNode;if(null!==(l=l.closest("#fileContent"))){var s=e(l.querySelector("tbody").childNodes),o=c.startContainer.parentNode,r=c.endContainer.parentNode,i=[];o=o.closest("tr"),r=r.closest("tr");var d=s.indexOf(o),u=s.indexOf(r);for(var m in s){var h=s[m];m>=d&&m<=u&&i.push(h.innerHTML)}a=i}}if(""!==a){for(var f in a){a[f]=a[f].replaceAll(/(\r\n|\n|\r)/gm,"");var v=a[f].split("</td>").filter(function(e){return!e.match(/<td class=".*?hide"[^>]*>/gm)}).filter(function(e){return!e.match(/<td class="index"[^>]*>.*?[^<]+/gm)});for(var g in v)v[g]=v[g].replaceAll(/<td class="message[^>]*>/gm,": ").replaceAll(/<strong>/gm,"(").replaceAll(/<\/strong>/gm,")").replaceAll(/<[^>]*>/gm,"").trim();a[f]=v.join(" ")+"\r\n"}a=a.join("").trim(),navigator.clipboard.writeText(a).then(function(){console.log("copie ok")}).catch(function(){alert("Erreur à la copie")})}})};"complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?o():document.addEventListener("DOMContentLoaded",o);
},{}],"d6sW":[function(require,module,exports) {
"use strict";require("./plugins"),require("./global"),module.hot&&module.hot.accept(function(){window.location.reload()});
},{"./plugins":"yKV9","./global":"IGu4"}]},{},["d6sW"], null)
//# sourceMappingURL=main.js.map