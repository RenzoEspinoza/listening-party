(this["webpackJsonplistening-party"]=this["webpackJsonplistening-party"]||[]).push([[0],{126:function(e,t){},129:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(18),s=n.n(r),c=(n(54),n(2)),i=n(9),l=n.n(i);function u(e){var t=Object(a.useState)(""),n=Object(c.a)(t,2),r=n[0],s=n[1];return o.a.createElement("div",{class:" max-w-sm  pl-4 pr-2 shadow rounded-lg bg-white"},o.a.createElement("div",{class:"flex items-center relative justify-center py-2"},o.a.createElement("form",{onSubmit:function(t){t.preventDefault(),r.length>0&&e.search(r)}},o.a.createElement("input",{type:"text",placeholder:"Search for a song",class:"rounded-lg focus:outline-none",onChange:function(e){s(e.target.value)}}),o.a.createElement("button",{type:"submit",class:"focus:outline-none "},o.a.createElement("svg",{class:"h-4 w-4 fill-current text-gray-600",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},o.a.createElement("path",{d:"M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"}))))),o.a.createElement("div",{style:{height:"26rem"}},o.a.createElement(l.a,{autoHide:!0},e.componentList)))}function d(e){return o.a.createElement("div",{class:"max-w-sm shadow rounded-lg bg-white p-4 pt-6",style:{height:"28.5rem"}},o.a.createElement(l.a,{autoHide:!0},function(e){if(0===e.length)return o.a.createElement("p",{class:"text-center antialiased text-gray-900 text-3xl font-semibold"},"The song pool is currently empty, search for a song and add it to the pool to get started")}(e.componentList),e.componentList))}function m(e){return o.a.createElement("div",{class:"flex py-2 items-center border-t"},o.a.createElement("img",{src:e.cover,alt:"album cover",class:" w-20 mr-4"}),o.a.createElement("div",{class:"antialised mr-8 text-sm",style:{overflow:"hidden",whiteSpace:"nowrap"}},o.a.createElement("p",{class:"text-gray-900 font-semibold pb-1"},e.title," "),o.a.createElement("p",{class:"text-gray-600 pb-1"},e.artist),o.a.createElement("p",{class:"text-gray-400 pb-1"},function(e){var t=Math.floor(e/6e4),n=(e%6e4/1e3).toFixed(0);return 60===n?t+1+":00":t+":"+(n<10?"0":"")+n}(e.duration))),e.button)}function p(e){var t=Object(a.useState)((function(){return JSON.parse(sessionStorage.getItem(e.id))||!1})),n=Object(c.a)(t,2),r=n[0],s=n[1];o.a.useEffect((function(){sessionStorage.setItem(e.id,JSON.stringify(r))}),[r]);return o.a.createElement(m,{title:e.title,artist:e.artist,duration:e.duration,cover:e.cover,button:o.a.createElement("div",{class:"flex ml-auto mr-3 items-center"},o.a.createElement("button",{onClick:function(t){r?(e.voteUpdate(e.id,-1),s(!1)):(e.voteUpdate(e.id,1),s(!0))},class:"mr-1 focus:outline-none"},o.a.createElement("svg",{class:r?"h-5 w-5 fill-current text-blue-400":"h-5 w-5 fill-current text-gray-500",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},o.a.createElement("path",{d:"M7 10v8h6v-8h5l-8-8-8 8h5z"}))),o.a.createElement("p",{class:"font-semibold text-gray-600"},e.voteCount))})}function g(e){return o.a.createElement(m,{title:e.title,artist:e.artist,duration:e.duration,cover:e.cover,button:o.a.createElement("button",{onClick:function(t){var n={id:e.id,title:e.title,artist:e.artist,duration:e.duration,cover:e.cover};e.addSong(n)},class:" ml-auto mr-3 focus:outline-none"},o.a.createElement("svg",{class:"h-4 w-4 fill-current text-blue-400",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},o.a.createElement("path",{d:"M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"})))})}function f(e){var t=e.currentSong;function n(){return t?o.a.createElement("div",{class:"grid grid-flow-col gap-0",style:{gridTemplateColumns:"25% auto 10%"}},o.a.createElement("img",{src:t.cover,alt:"album cover",class:"row-span-3 w-40"}),o.a.createElement("div",{class:"antialised mr-8 text-4xl row-span-2",style:{overflow:"hidden",whiteSpace:"nowrap"}},o.a.createElement("p",{class:"text-gray-900 font-semibold pb-1"},t.title," "),o.a.createElement("p",{class:"text-gray-600 pb-1"},t.artist)),e.connect):o.a.createElement("div",{style:{height:"10rem"}})}return o.a.createElement("div",{class:"bg-white p-6 ",style:{width:"48rem"}},o.a.createElement(n,null))}var h=n(19),v=n.n(h),b={content:{top:"50%",left:"50%",right:"auto",bottom:"auto",marginRight:"-50%",transform:"translate(-50%, -50%)"},overlay:{backgroundColor:"rgba(26, 32, 44, 0.5)"}};function w(e){function t(){e.setIsOpen(!1)}return o.a.createElement("div",null,o.a.createElement("button",{onClick:function(){e.getDevices()},class:" focus:outline-none outline-none bg-transparent text-green-600 border border-green-600 font-bold py-2 px-4 rounded inline-flex items-center justify-center hover:bg-green-600 hover:border-transparent hover:text-white"},o.a.createElement("span",null,"Start listening with Spotify Connect")),o.a.createElement(v.a,{isOpen:e.modalIsOpen,onRequestClose:t,style:b},o.a.createElement("div",null,o.a.createElement("div",{class:"px-6 border-gray-600 border-b"},o.a.createElement("p",{class:"text-gray-700 font-bold text-xl"},"Choose a device to listen on")),o.a.createElement("ul",{class:" my-2 border"},e.deviceList.map((function(n){return o.a.createElement(E,{closeModal:t,startListening:e.startListening,id:n.id,name:n.name,type:n.type})}))))))}function E(e){return o.a.createElement("li",{key:e.id,onClick:function(){e.closeModal(),e.startListening(e.id)}},"Name: ",e.name," Type: ",e.type)}v.a.setAppElement("body");var y,x=n(4),S=n.n(x),O=n(48),j=n.n(O),k=function(){var e=Object(a.useState)([]),t=Object(c.a)(e,2),n=t[0],r=t[1],s=Object(a.useState)([]),i=Object(c.a)(s,2),l=i[0],m=i[1],h=Object(a.useState)(null),v=Object(c.a)(h,2),b=v[0],E=v[1],x=Object(a.useState)([]),O=Object(c.a)(x,2),k=O[0],L=O[1],C=Object(a.useState)(!1),z=Object(c.a)(C,2),T=z[0],R=z[1],B=Object(a.useRef)(null),I=Object(a.useRef)(null),M=Object(a.useRef)(!1),U=Object(a.useState)(null),_=Object(c.a)(U,2),q=_[0],P=_[1];function A(e){m((function(t){return t.filter((function(t){return t.id!==e.id}))})),y.emit("song add",e,(function(e){e&&alert(e)}))}function H(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2?arguments[2]:void 0;t=a?{device_id:a}:{},S()({url:"https://api.spotify.com/v1/me/player/play",method:"PUT",data:{uris:["spotify:track:".concat(e)],position_ms:n},headers:{Authorization:"Bearer ".concat(I.current)},params:t}).then((function(e){console.log(e)})).catch((function(e){e.response?(console.log(e.response.data),"The access token expired"===e.response.data.error.message&&(console.log("expired token"),D(),H()),console.log(e.response.status),console.log(e.response.headers)):e.request?console.log(e.request):console.log("Error",e.message)}))}function J(e,t){y.emit("vote change",e,t)}function D(){S.a.get("/api/"+"refreshToken/".concat(q)).then((function(e){I.current=e.data})).catch((function(e){console.log(e.response.data),console.log(e.response.status),console.log(e.response.headers)}))}Object(a.useEffect)((function(){S.a.get("/api/pool").then((function(e){r(e.data)})),S.a.get("/api/currentSong").then((function(e){e.data&&(console.log(e.data),E(e.data))})),(y=j()().connect()).on("pool update",(function(e){r(e)}));var e=new URLSearchParams(window.location.search);return console.log("params",e),I.current=e.get("access_token"),console.log("access token",I.current),I.current&&(M.current=!0,console.log("refresh token",new URLSearchParams(window.location.search).get("refresh_token")),P(new URLSearchParams(window.location.search).get("refresh_token"))),y.on("play song",(function(e){B.current&&(console.log("attempting to play"),H(e.id)),E(e),sessionStorage.removeItem(e.id)})),function(){return y.disconnect()}}),[]);var N=n.map((function(e){return o.a.createElement(p,{id:e.id,title:e.title,artist:e.artist,duration:e.duration,voteCount:e.voteCount,voteUpdate:J,cover:e.cover,key:e.id})})),V=l.map((function(e){return o.a.createElement(g,{id:e.id,title:e.title,artist:e.artist,duration:e.duration,key:e.id,addSong:A,cover:e.cover})}));return o.a.createElement("div",{class:"flex justify-center"},o.a.createElement("div",{class:" grid grid-rows-2 grid-cols-2",style:{gridTemplateRows:"36% auto"}},o.a.createElement("div",{class:"col-span-2 p-2 pt-6"},o.a.createElement(f,{connect:M.current?o.a.createElement(w,{modalIsOpen:T,setIsOpen:R,deviceList:k,getDevices:function e(){S()({url:"https://api.spotify.com/v1/me/player/devices",method:"GET",headers:{Authorization:"Bearer ".concat(I.current)}}).then((function(e){console.log("list of devices",e.data.devices),L(e.data.devices),R(!0)})).catch((function(t){t.response?(console.log(t.response.data),"The access token expired"===t.response.data.error.message&&(console.log("expired token"),D(),e()),console.log(t.response.status),console.log(t.response.headers)):t.request?console.log(t.request):console.log("Error",t.message)}))},startListening:function(e){B.current=e,S.a.get("/api/elapsedTime").then((function(e){H(b.id,e.data,B.current)}))}}):o.a.createElement("button",{onClick:function(){window.location.href="/auth/spotify"},class:"focus:outline-none outline-none bg-transparent text-green-600 border border-green-600 font-bold py-2 px-4 rounded inline-flex justify-center items-center hover:bg-green-600 hover:border-transparent hover:text-white"},o.a.createElement("svg",{class:"fill-current w-6 h-6 mr-2 ",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},o.a.createElement("path",{d:"M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"})),o.a.createElement("span",null,"Login with Spotify Premium to start listening")),currentSong:b})),o.a.createElement("div",{class:"p-2 row-start-2"},o.a.createElement(u,{search:function(e){S.a.get("/api/"+"search/".concat(e)).then((function(e){console.log(e.data);var t=e.data.map((function(e){return{id:e.id,title:e.name,artist:e.artists[0].name,duration:e.duration_ms,cover:e.album.images[0].url}}));console.log("search result",t),m(t)}))},componentList:V})),o.a.createElement("div",{class:"p-2 row-start-2"},o.a.createElement(d,{componentList:N}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},49:function(e,t,n){e.exports=n(129)},54:function(e,t,n){}},[[49,1,2]]]);
//# sourceMappingURL=main.25ad128f.chunk.js.map