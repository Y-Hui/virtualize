import{r as n,a as L,R as Ot,k as et,K as Z,m as At,l as De,b as F,c as U,d as de,L as Dt,M as tt,P as kt,_ as Te,Q as Wt,u as h,e as vt,S as Ht,g as bt,C as Gt}from"./index-CXSDek4R.js";import{E as jt,M as Kt,a as Xt,g as Vt,i as at,R as Ft,b as Ut}from"./Table-Cl_vXdND.js";import{R as Yt}from"./PlusOutlined-Dr5h-Jjp.js";import{K as te,A as Ae,i as qt,u as nt,D as Qt,g as Zt,m as Jt,s as ea,a as ta}from"./index-DvNgDXOm.js";const Re=n.createContext(null);var aa=function(t){var a=t.activeTabOffset,r=t.horizontal,i=t.rtl,l=t.indicator,c=l===void 0?{}:l,o=c.size,d=c.align,s=d===void 0?"center":d,f=n.useState(),v=L(f,2),S=v[0],R=v[1],N=n.useRef(),E=Ot.useCallback(function(b){return typeof o=="function"?o(b):typeof o=="number"?o:b},[o]);function M(){et.cancel(N.current)}return n.useEffect(function(){var b={};if(a)if(r){b.width=E(a.width);var u=i?"right":"left";s==="start"&&(b[u]=a[u]),s==="center"&&(b[u]=a[u]+a.width/2,b.transform=i?"translateX(50%)":"translateX(-50%)"),s==="end"&&(b[u]=a[u]+a.width,b.transform="translateX(-100%)")}else b.height=E(a.height),s==="start"&&(b.top=a.top),s==="center"&&(b.top=a.top+a.height/2,b.transform="translateY(-50%)"),s==="end"&&(b.top=a.top+a.height,b.transform="translateY(-100%)");return M(),N.current=et(function(){R(b)}),M},[a,r,i,s,E]),{style:S}},rt={width:0,height:0,left:0,top:0};function na(e,t,a){return n.useMemo(function(){for(var r,i=new Map,l=t.get((r=e[0])===null||r===void 0?void 0:r.key)||rt,c=l.left+l.width,o=0;o<e.length;o+=1){var d=e[o].key,s=t.get(d);if(!s){var f;s=t.get((f=e[o-1])===null||f===void 0?void 0:f.key)||rt}var v=i.get(d)||Z({},s);v.right=c-v.left-v.width,i.set(d,v)}return i},[e.map(function(r){return r.key}).join("_"),t,a])}function it(e,t){var a=n.useRef(e),r=n.useState({}),i=L(r,2),l=i[1];function c(o){var d=typeof o=="function"?o(a.current):o;d!==a.current&&t(d,a.current),a.current=d,l({})}return[a.current,c]}var ra=.1,ot=.01,Ee=20,lt=Math.pow(.995,Ee);function ia(e,t){var a=n.useState(),r=L(a,2),i=r[0],l=r[1],c=n.useState(0),o=L(c,2),d=o[0],s=o[1],f=n.useState(0),v=L(f,2),S=v[0],R=v[1],N=n.useState(),E=L(N,2),M=E[0],b=E[1],u=n.useRef();function T(y){var P=y.touches[0],p=P.screenX,x=P.screenY;l({x:p,y:x}),window.clearInterval(u.current)}function z(y){if(i){var P=y.touches[0],p=P.screenX,x=P.screenY;l({x:p,y:x});var m=p-i.x,C=x-i.y;t(m,C);var Y=Date.now();s(Y),R(Y-d),b({x:m,y:C})}}function A(){if(i&&(l(null),b(null),M)){var y=M.x/S,P=M.y/S,p=Math.abs(y),x=Math.abs(P);if(Math.max(p,x)<ra)return;var m=y,C=P;u.current=window.setInterval(function(){if(Math.abs(m)<ot&&Math.abs(C)<ot){window.clearInterval(u.current);return}m*=lt,C*=lt,t(m*Ee,C*Ee)},Ee)}}var W=n.useRef();function D(y){var P=y.deltaX,p=y.deltaY,x=0,m=Math.abs(P),C=Math.abs(p);m===C?x=W.current==="x"?P:p:m>C?(x=P,W.current="x"):(x=p,W.current="y"),t(-x,-x)&&y.preventDefault()}var _=n.useRef(null);_.current={onTouchStart:T,onTouchMove:z,onTouchEnd:A,onWheel:D},n.useEffect(function(){function y(m){_.current.onTouchStart(m)}function P(m){_.current.onTouchMove(m)}function p(m){_.current.onTouchEnd(m)}function x(m){_.current.onWheel(m)}return document.addEventListener("touchmove",P,{passive:!1}),document.addEventListener("touchend",p,{passive:!0}),e.current.addEventListener("touchstart",y,{passive:!0}),e.current.addEventListener("wheel",x,{passive:!1}),function(){document.removeEventListener("touchmove",P),document.removeEventListener("touchend",p)}},[])}function mt(e){var t=n.useState(0),a=L(t,2),r=a[0],i=a[1],l=n.useRef(0),c=n.useRef();return c.current=e,At(function(){var o;(o=c.current)===null||o===void 0||o.call(c)},[r]),function(){l.current===r&&(l.current+=1,i(l.current))}}function oa(e){var t=n.useRef([]),a=n.useState({}),r=L(a,2),i=r[1],l=n.useRef(typeof e=="function"?e():e),c=mt(function(){var d=l.current;t.current.forEach(function(s){d=s(d)}),t.current=[],l.current=d,i({})});function o(d){t.current.push(d),c()}return[l.current,o]}var ct={width:0,height:0,left:0,top:0,right:0};function la(e,t,a,r,i,l,c){var o=c.tabs,d=c.tabPosition,s=c.rtl,f,v,S;return["top","bottom"].includes(d)?(f="width",v=s?"right":"left",S=Math.abs(a)):(f="height",v="top",S=-a),n.useMemo(function(){if(!o.length)return[0,0];for(var R=o.length,N=R,E=0;E<R;E+=1){var M=e.get(o[E].key)||ct;if(Math.floor(M[v]+M[f])>Math.floor(S+t)){N=E-1;break}}for(var b=0,u=R-1;u>=0;u-=1){var T=e.get(o[u].key)||ct;if(T[v]<S){b=u+1;break}}return b>=N?[0,0]:[b,N]},[e,t,r,i,l,S,d,o.map(function(R){return R.key}).join("_"),s])}function dt(e){var t;return e instanceof Map?(t={},e.forEach(function(a,r){t[r]=a})):t=e,JSON.stringify(t)}var ca="TABS_DQ";function gt(e){return String(e).replace(/"/g,ca)}function ht(e,t,a,r){return!(!a||r||e===!1||e===void 0&&(t===!1||t===null))}var pt=n.forwardRef(function(e,t){var a=e.prefixCls,r=e.editable,i=e.locale,l=e.style;return!r||r.showAdd===!1?null:n.createElement("button",{ref:t,type:"button",className:"".concat(a,"-nav-add"),style:l,"aria-label":(i==null?void 0:i.addAriaLabel)||"Add tab",onClick:function(o){r.onEdit("add",{event:o})}},r.addIcon||"+")}),st=n.forwardRef(function(e,t){var a=e.position,r=e.prefixCls,i=e.extra;if(!i)return null;var l,c={};return De(i)==="object"&&!n.isValidElement(i)?c=i:c.right=i,a==="right"&&(l=c.right),a==="left"&&(l=c.left),l?n.createElement("div",{className:"".concat(r,"-extra-content"),ref:t},l):null}),da=n.forwardRef(function(e,t){var a=e.prefixCls,r=e.id,i=e.tabs,l=e.locale,c=e.mobile,o=e.more,d=o===void 0?{}:o,s=e.style,f=e.className,v=e.editable,S=e.tabBarGutter,R=e.rtl,N=e.removeAriaLabel,E=e.onTabClick,M=e.getPopupContainer,b=e.popupClassName,u=n.useState(!1),T=L(u,2),z=T[0],A=T[1],W=n.useState(null),D=L(W,2),_=D[0],y=D[1],P=d.icon,p=P===void 0?"More":P,x="".concat(r,"-more-popup"),m="".concat(a,"-dropdown"),C=_!==null?"".concat(x,"-").concat(_):null,Y=l==null?void 0:l.dropdownAriaLabel;function re(w,O){w.preventDefault(),w.stopPropagation(),v.onEdit("remove",{key:O,event:w})}var g=n.createElement(jt,{onClick:function(O){var G=O.key,K=O.domEvent;E(G,K),A(!1)},prefixCls:"".concat(m,"-menu"),id:x,tabIndex:-1,role:"listbox","aria-activedescendant":C,selectedKeys:[_],"aria-label":Y!==void 0?Y:"expanded dropdown"},i.map(function(w){var O=w.closable,G=w.disabled,K=w.closeIcon,V=w.key,J=w.label,Q=ht(O,K,v,G);return n.createElement(Kt,{key:V,id:"".concat(x,"-").concat(V),role:"option","aria-controls":r&&"".concat(r,"-panel-").concat(V),disabled:G},n.createElement("span",null,J),Q&&n.createElement("button",{type:"button","aria-label":N||"remove",tabIndex:0,className:"".concat(m,"-menu-item-remove"),onClick:function(oe){oe.stopPropagation(),re(oe,V)}},K||v.removeIcon||"×"))}));function j(w){for(var O=i.filter(function(Q){return!Q.disabled}),G=O.findIndex(function(Q){return Q.key===_})||0,K=O.length,V=0;V<K;V+=1){G=(G+w+K)%K;var J=O[G];if(!J.disabled){y(J.key);return}}}function ae(w){var O=w.which;if(!z){[te.DOWN,te.SPACE,te.ENTER].includes(O)&&(A(!0),w.preventDefault());return}switch(O){case te.UP:j(-1),w.preventDefault();break;case te.DOWN:j(1),w.preventDefault();break;case te.ESC:A(!1);break;case te.SPACE:case te.ENTER:_!==null&&E(_,w);break}}n.useEffect(function(){var w=document.getElementById(C);w&&w.scrollIntoView&&w.scrollIntoView(!1)},[_]),n.useEffect(function(){z||y(null)},[z]);var H=F({},R?"marginRight":"marginLeft",S);i.length||(H.visibility="hidden",H.order=1);var X=U(F({},"".concat(m,"-rtl"),R)),ie=c?null:n.createElement(Xt,de({prefixCls:m,overlay:g,visible:i.length?z:!1,onVisibleChange:A,overlayClassName:U(X,b),mouseEnterDelay:.1,mouseLeaveDelay:.1,getPopupContainer:M},d),n.createElement("button",{type:"button",className:"".concat(a,"-nav-more"),style:H,tabIndex:-1,"aria-hidden":"true","aria-haspopup":"listbox","aria-controls":x,id:"".concat(r,"-more"),"aria-expanded":z,onKeyDown:ae},p));return n.createElement("div",{className:U("".concat(a,"-nav-operations"),f),style:s,ref:t},ie,n.createElement(pt,{prefixCls:a,locale:l,editable:v}))});const sa=n.memo(da,function(e,t){return t.tabMoving});var ua=function(t){var a=t.prefixCls,r=t.id,i=t.active,l=t.tab,c=l.key,o=l.label,d=l.disabled,s=l.closeIcon,f=l.icon,v=t.closable,S=t.renderWrapper,R=t.removeAriaLabel,N=t.editable,E=t.onClick,M=t.onFocus,b=t.style,u="".concat(a,"-tab"),T=ht(v,s,N,d);function z(_){d||E(_)}function A(_){_.preventDefault(),_.stopPropagation(),N.onEdit("remove",{key:c,event:_})}var W=n.useMemo(function(){return f&&typeof o=="string"?n.createElement("span",null,o):o},[o,f]),D=n.createElement("div",{key:c,"data-node-key":gt(c),className:U(u,F(F(F({},"".concat(u,"-with-remove"),T),"".concat(u,"-active"),i),"".concat(u,"-disabled"),d)),style:b,onClick:z},n.createElement("div",{role:"tab","aria-selected":i,id:r&&"".concat(r,"-tab-").concat(c),className:"".concat(u,"-btn"),"aria-controls":r&&"".concat(r,"-panel-").concat(c),"aria-disabled":d,tabIndex:d?null:0,onClick:function(y){y.stopPropagation(),z(y)},onKeyDown:function(y){[te.SPACE,te.ENTER].includes(y.which)&&(y.preventDefault(),z(y))},onFocus:M},f&&n.createElement("span",{className:"".concat(u,"-icon")},f),o&&W),T&&n.createElement("button",{type:"button","aria-label":R||"remove",tabIndex:0,className:"".concat(u,"-remove"),onClick:function(y){y.stopPropagation(),A(y)}},s||N.removeIcon||"×"));return S?S(D):D},fa=function(t,a){var r=t.offsetWidth,i=t.offsetHeight,l=t.offsetTop,c=t.offsetLeft,o=t.getBoundingClientRect(),d=o.width,s=o.height,f=o.left,v=o.top;return Math.abs(d-r)<1?[d,s,f-a.left,v-a.top]:[r,i,c,l]},me=function(t){var a=t.current||{},r=a.offsetWidth,i=r===void 0?0:r,l=a.offsetHeight,c=l===void 0?0:l;if(t.current){var o=t.current.getBoundingClientRect(),d=o.width,s=o.height;if(Math.abs(d-i)<1)return[d,s]}return[i,c]},we=function(t,a){return t[a?0:1]},ut=n.forwardRef(function(e,t){var a=e.className,r=e.style,i=e.id,l=e.animated,c=e.activeKey,o=e.rtl,d=e.extra,s=e.editable,f=e.locale,v=e.tabPosition,S=e.tabBarGutter,R=e.children,N=e.onTabClick,E=e.onTabScroll,M=e.indicator,b=n.useContext(Re),u=b.prefixCls,T=b.tabs,z=n.useRef(null),A=n.useRef(null),W=n.useRef(null),D=n.useRef(null),_=n.useRef(null),y=n.useRef(null),P=n.useRef(null),p=v==="top"||v==="bottom",x=it(0,function(B,$){p&&E&&E({direction:B>$?"left":"right"})}),m=L(x,2),C=m[0],Y=m[1],re=it(0,function(B,$){!p&&E&&E({direction:B>$?"top":"bottom"})}),g=L(re,2),j=g[0],ae=g[1],H=n.useState([0,0]),X=L(H,2),ie=X[0],w=X[1],O=n.useState([0,0]),G=L(O,2),K=G[0],V=G[1],J=n.useState([0,0]),Q=L(J,2),ve=Q[0],oe=Q[1],se=n.useState([0,0]),be=L(se,2),I=be[0],ne=be[1],ge=oa(new Map),ke=L(ge,2),St=ke[0],yt=ke[1],$e=na(T,St,K[0]),Pe=we(ie,p),he=we(K,p),Ie=we(ve,p),We=we(I,p),He=Math.floor(Pe)<Math.floor(he+Ie),ee=He?Pe-We:Pe-Ie,_t="".concat(u,"-nav-operations-hidden"),le=0,ue=0;p&&o?(le=0,ue=Math.max(0,he-ee)):(le=Math.min(0,ee-he),ue=0);function Le(B){return B<le?le:B>ue?ue:B}var Me=n.useRef(null),xt=n.useState(),Ge=L(xt,2),Se=Ge[0],je=Ge[1];function ze(){je(Date.now())}function Ne(){Me.current&&clearTimeout(Me.current)}ia(D,function(B,$){function k(q,fe){q(function(ce){var xe=Le(ce+fe);return xe})}return He?(p?k(Y,B):k(ae,$),Ne(),ze(),!0):!1}),n.useEffect(function(){return Ne(),Se&&(Me.current=setTimeout(function(){je(0)},100)),Ne},[Se]);var Ct=la($e,ee,p?C:j,he,Ie,We,Z(Z({},e),{},{tabs:T})),Ke=L(Ct,2),wt=Ke[0],Et=Ke[1],Xe=Dt(function(){var B=arguments.length>0&&arguments[0]!==void 0?arguments[0]:c,$=$e.get(B)||{width:0,height:0,left:0,right:0,top:0};if(p){var k=C;o?$.right<C?k=$.right:$.right+$.width>C+ee&&(k=$.right+$.width-ee):$.left<-C?k=-$.left:$.left+$.width>-C+ee&&(k=-($.left+$.width-ee)),ae(0),Y(Le(k))}else{var q=j;$.top<-j?q=-$.top:$.top+$.height>-j+ee&&(q=-($.top+$.height-ee)),Y(0),ae(Le(q))}}),ye={};v==="top"||v==="bottom"?ye[o?"marginRight":"marginLeft"]=S:ye.marginTop=S;var Ve=T.map(function(B,$){var k=B.key;return n.createElement(ua,{id:i,prefixCls:u,key:k,tab:B,style:$===0?void 0:ye,closable:B.closable,editable:s,active:k===c,renderWrapper:R,removeAriaLabel:f==null?void 0:f.removeAriaLabel,onClick:function(fe){N(k,fe)},onFocus:function(){Xe(k),ze(),D.current&&(o||(D.current.scrollLeft=0),D.current.scrollTop=0)}})}),Fe=function(){return yt(function(){var $,k=new Map,q=($=_.current)===null||$===void 0?void 0:$.getBoundingClientRect();return T.forEach(function(fe){var ce,xe=fe.key,Je=(ce=_.current)===null||ce===void 0?void 0:ce.querySelector('[data-node-key="'.concat(gt(xe),'"]'));if(Je){var Lt=fa(Je,q),Ce=L(Lt,4),Mt=Ce[0],zt=Ce[1],Nt=Ce[2],Bt=Ce[3];k.set(xe,{width:Mt,height:zt,left:Nt,top:Bt})}}),k})};n.useEffect(function(){Fe()},[T.map(function(B){return B.key}).join("_")]);var _e=mt(function(){var B=me(z),$=me(A),k=me(W);w([B[0]-$[0]-k[0],B[1]-$[1]-k[1]]);var q=me(P);oe(q);var fe=me(y);ne(fe);var ce=me(_);V([ce[0]-q[0],ce[1]-q[1]]),Fe()}),Tt=T.slice(0,wt),Rt=T.slice(Et+1),Ue=[].concat(tt(Tt),tt(Rt)),Ye=$e.get(c),Pt=aa({activeTabOffset:Ye,horizontal:p,indicator:M,rtl:o}),It=Pt.style;n.useEffect(function(){Xe()},[c,le,ue,dt(Ye),dt($e),p]),n.useEffect(function(){_e()},[o]);var qe=!!Ue.length,pe="".concat(u,"-nav-wrap"),Be,Oe,Qe,Ze;return p?o?(Oe=C>0,Be=C!==ue):(Be=C<0,Oe=C!==le):(Qe=j<0,Ze=j!==le),n.createElement(Ae,{onResize:_e},n.createElement("div",{ref:kt(t,z),role:"tablist",className:U("".concat(u,"-nav"),a),style:r,onKeyDown:function(){ze()}},n.createElement(st,{ref:A,position:"left",extra:d,prefixCls:u}),n.createElement(Ae,{onResize:_e},n.createElement("div",{className:U(pe,F(F(F(F({},"".concat(pe,"-ping-left"),Be),"".concat(pe,"-ping-right"),Oe),"".concat(pe,"-ping-top"),Qe),"".concat(pe,"-ping-bottom"),Ze)),ref:D},n.createElement(Ae,{onResize:_e},n.createElement("div",{ref:_,className:"".concat(u,"-nav-list"),style:{transform:"translate(".concat(C,"px, ").concat(j,"px)"),transition:Se?"none":void 0}},Ve,n.createElement(pt,{ref:P,prefixCls:u,locale:f,editable:s,style:Z(Z({},Ve.length===0?void 0:ye),{},{visibility:qe?"hidden":null})}),n.createElement("div",{className:U("".concat(u,"-ink-bar"),F({},"".concat(u,"-ink-bar-animated"),l.inkBar)),style:It}))))),n.createElement(sa,de({},e,{removeAriaLabel:f==null?void 0:f.removeAriaLabel,ref:y,prefixCls:u,tabs:Ue,className:!qe&&_t,tabMoving:!!Se})),n.createElement(st,{ref:W,position:"right",extra:d,prefixCls:u})))}),$t=n.forwardRef(function(e,t){var a=e.prefixCls,r=e.className,i=e.style,l=e.id,c=e.active,o=e.tabKey,d=e.children;return n.createElement("div",{id:l&&"".concat(l,"-panel-").concat(o),role:"tabpanel",tabIndex:c?0:-1,"aria-labelledby":l&&"".concat(l,"-tab-").concat(o),"aria-hidden":!c,style:i,className:U(a,c&&"".concat(a,"-active"),r),ref:t},d)}),va=["renderTabBar"],ba=["label","key"],ma=function(t){var a=t.renderTabBar,r=Te(t,va),i=n.useContext(Re),l=i.tabs;if(a){var c=Z(Z({},r),{},{panes:l.map(function(o){var d=o.label,s=o.key,f=Te(o,ba);return n.createElement($t,de({tab:d,key:s,tabKey:s},f))})});return a(c,ut)}return n.createElement(ut,r)},ga=["key","forceRender","style","className","destroyInactiveTabPane"],ha=function(t){var a=t.id,r=t.activeKey,i=t.animated,l=t.tabPosition,c=t.destroyInactiveTabPane,o=n.useContext(Re),d=o.prefixCls,s=o.tabs,f=i.tabPane,v="".concat(d,"-tabpane");return n.createElement("div",{className:U("".concat(d,"-content-holder"))},n.createElement("div",{className:U("".concat(d,"-content"),"".concat(d,"-content-").concat(l),F({},"".concat(d,"-content-animated"),f))},s.map(function(S){var R=S.key,N=S.forceRender,E=S.style,M=S.className,b=S.destroyInactiveTabPane,u=Te(S,ga),T=R===r;return n.createElement(Wt,de({key:R,visible:T,forceRender:N,removeOnLeave:!!(c||b),leavedClassName:"".concat(v,"-hidden")},i.tabPaneMotion),function(z,A){var W=z.style,D=z.className;return n.createElement($t,de({},u,{prefixCls:v,id:a,tabKey:R,animated:f,active:T,style:Z(Z({},E),W),className:U(M,D),ref:A}))})})))};function pa(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{inkBar:!0,tabPane:!1},t;return e===!1?t={inkBar:!1,tabPane:!1}:e===!0?t={inkBar:!0,tabPane:!1}:t=Z({inkBar:!0},De(e)==="object"?e:{}),t.tabPaneMotion&&t.tabPane===void 0&&(t.tabPane=!0),!t.tabPaneMotion&&t.tabPane&&(t.tabPane=!1),t}var $a=["id","prefixCls","className","items","direction","activeKey","defaultActiveKey","editable","animated","tabPosition","tabBarGutter","tabBarStyle","tabBarExtraContent","locale","more","destroyInactiveTabPane","renderTabBar","onChange","onTabClick","onTabScroll","getPopupContainer","popupClassName","indicator"],ft=0,Sa=n.forwardRef(function(e,t){var a=e.id,r=e.prefixCls,i=r===void 0?"rc-tabs":r,l=e.className,c=e.items,o=e.direction,d=e.activeKey,s=e.defaultActiveKey,f=e.editable,v=e.animated,S=e.tabPosition,R=S===void 0?"top":S,N=e.tabBarGutter,E=e.tabBarStyle,M=e.tabBarExtraContent,b=e.locale,u=e.more,T=e.destroyInactiveTabPane,z=e.renderTabBar,A=e.onChange,W=e.onTabClick,D=e.onTabScroll,_=e.getPopupContainer,y=e.popupClassName,P=e.indicator,p=Te(e,$a),x=n.useMemo(function(){return(c||[]).filter(function(I){return I&&De(I)==="object"&&"key"in I})},[c]),m=o==="rtl",C=pa(v),Y=n.useState(!1),re=L(Y,2),g=re[0],j=re[1];n.useEffect(function(){j(qt())},[]);var ae=nt(function(){var I;return(I=x[0])===null||I===void 0?void 0:I.key},{value:d,defaultValue:s}),H=L(ae,2),X=H[0],ie=H[1],w=n.useState(function(){return x.findIndex(function(I){return I.key===X})}),O=L(w,2),G=O[0],K=O[1];n.useEffect(function(){var I=x.findIndex(function(ge){return ge.key===X});if(I===-1){var ne;I=Math.max(0,Math.min(G,x.length-1)),ie((ne=x[I])===null||ne===void 0?void 0:ne.key)}K(I)},[x.map(function(I){return I.key}).join("_"),X,G]);var V=nt(null,{value:a}),J=L(V,2),Q=J[0],ve=J[1];n.useEffect(function(){a||(ve("rc-tabs-".concat(ft)),ft+=1)},[]);function oe(I,ne){W==null||W(I,ne);var ge=I!==X;ie(I),ge&&(A==null||A(I))}var se={id:Q,activeKey:X,animated:C,tabPosition:R,rtl:m,mobile:g},be=Z(Z({},se),{},{editable:f,locale:b,more:u,tabBarGutter:N,onTabClick:oe,onTabScroll:D,extra:M,style:E,panes:null,getPopupContainer:_,popupClassName:y,indicator:P});return n.createElement(Re.Provider,{value:{tabs:x,prefixCls:i}},n.createElement("div",de({ref:t,id:a,className:U(i,"".concat(i,"-").concat(R),F(F(F({},"".concat(i,"-mobile"),g),"".concat(i,"-editable"),f),"".concat(i,"-rtl"),m),l)},p),n.createElement(ma,de({},be,{renderTabBar:z})),n.createElement(ha,de({destroyInactiveTabPane:T},se,{animated:C}))))});const ya={motionAppear:!1,motionEnter:!0,motionLeave:!0};function _a(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{inkBar:!0,tabPane:!1},a;return t===!1?a={inkBar:!1,tabPane:!1}:t===!0?a={inkBar:!0,tabPane:!0}:a=Object.assign({inkBar:!0},typeof t=="object"?t:{}),a.tabPane&&(a.tabPaneMotion=Object.assign(Object.assign({},ya),{motionName:Vt(e,"switch")})),a}var xa=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(a[r[i]]=e[r[i]]);return a};function Ca(e){return e.filter(t=>t)}function wa(e,t){if(e)return e;const a=Qt(t).map(r=>{if(n.isValidElement(r)){const{key:i,props:l}=r,c=l||{},{tab:o}=c,d=xa(c,["tab"]);return Object.assign(Object.assign({key:String(i)},d),{label:o})}return null});return Ca(a)}const Ea=e=>{const{componentCls:t,motionDurationSlow:a}=e;return[{[t]:{[`${t}-switch`]:{"&-appear, &-enter":{transition:"none","&-start":{opacity:0},"&-active":{opacity:1,transition:`opacity ${a}`}},"&-leave":{position:"absolute",transition:"none",inset:0,"&-start":{opacity:1},"&-active":{opacity:0,transition:`opacity ${a}`}}}}},[at(e,"slide-up"),at(e,"slide-down")]]},Ta=e=>{const{componentCls:t,tabsCardPadding:a,cardBg:r,cardGutter:i,colorBorderSecondary:l,itemSelectedColor:c}=e;return{[`${t}-card`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab`]:{margin:0,padding:a,background:r,border:`${h(e.lineWidth)} ${e.lineType} ${l}`,transition:`all ${e.motionDurationSlow} ${e.motionEaseInOut}`},[`${t}-tab-active`]:{color:c,background:e.colorBgContainer},[`${t}-ink-bar`]:{visibility:"hidden"}},[`&${t}-top, &${t}-bottom`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab + ${t}-tab`]:{marginLeft:{_skip_check_:!0,value:h(i)}}}},[`&${t}-top`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab`]:{borderRadius:`${h(e.borderRadiusLG)} ${h(e.borderRadiusLG)} 0 0`},[`${t}-tab-active`]:{borderBottomColor:e.colorBgContainer}}},[`&${t}-bottom`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab`]:{borderRadius:`0 0 ${h(e.borderRadiusLG)} ${h(e.borderRadiusLG)}`},[`${t}-tab-active`]:{borderTopColor:e.colorBgContainer}}},[`&${t}-left, &${t}-right`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab + ${t}-tab`]:{marginTop:h(i)}}},[`&${t}-left`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab`]:{borderRadius:{_skip_check_:!0,value:`${h(e.borderRadiusLG)} 0 0 ${h(e.borderRadiusLG)}`}},[`${t}-tab-active`]:{borderRightColor:{_skip_check_:!0,value:e.colorBgContainer}}}},[`&${t}-right`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab`]:{borderRadius:{_skip_check_:!0,value:`0 ${h(e.borderRadiusLG)} ${h(e.borderRadiusLG)} 0`}},[`${t}-tab-active`]:{borderLeftColor:{_skip_check_:!0,value:e.colorBgContainer}}}}}}},Ra=e=>{const{componentCls:t,itemHoverColor:a,dropdownEdgeChildVerticalPadding:r}=e;return{[`${t}-dropdown`]:Object.assign(Object.assign({},vt(e)),{position:"absolute",top:-9999,left:{_skip_check_:!0,value:-9999},zIndex:e.zIndexPopup,display:"block","&-hidden":{display:"none"},[`${t}-dropdown-menu`]:{maxHeight:e.tabsDropdownHeight,margin:0,padding:`${h(r)} 0`,overflowX:"hidden",overflowY:"auto",textAlign:{_skip_check_:!0,value:"left"},listStyleType:"none",backgroundColor:e.colorBgContainer,backgroundClip:"padding-box",borderRadius:e.borderRadiusLG,outline:"none",boxShadow:e.boxShadowSecondary,"&-item":Object.assign(Object.assign({},Ht),{display:"flex",alignItems:"center",minWidth:e.tabsDropdownWidth,margin:0,padding:`${h(e.paddingXXS)} ${h(e.paddingSM)}`,color:e.colorText,fontWeight:"normal",fontSize:e.fontSize,lineHeight:e.lineHeight,cursor:"pointer",transition:`all ${e.motionDurationSlow}`,"> span":{flex:1,whiteSpace:"nowrap"},"&-remove":{flex:"none",marginLeft:{_skip_check_:!0,value:e.marginSM},color:e.colorTextDescription,fontSize:e.fontSizeSM,background:"transparent",border:0,cursor:"pointer","&:hover":{color:a}},"&:hover":{background:e.controlItemBgHover},"&-disabled":{"&, &:hover":{color:e.colorTextDisabled,background:"transparent",cursor:"not-allowed"}}})}})}},Pa=e=>{const{componentCls:t,margin:a,colorBorderSecondary:r,horizontalMargin:i,verticalItemPadding:l,verticalItemMargin:c,calc:o}=e;return{[`${t}-top, ${t}-bottom`]:{flexDirection:"column",[`> ${t}-nav, > div > ${t}-nav`]:{margin:i,"&::before":{position:"absolute",right:{_skip_check_:!0,value:0},left:{_skip_check_:!0,value:0},borderBottom:`${h(e.lineWidth)} ${e.lineType} ${r}`,content:"''"},[`${t}-ink-bar`]:{height:e.lineWidthBold,"&-animated":{transition:`width ${e.motionDurationSlow}, left ${e.motionDurationSlow},
            right ${e.motionDurationSlow}`}},[`${t}-nav-wrap`]:{"&::before, &::after":{top:0,bottom:0,width:e.controlHeight},"&::before":{left:{_skip_check_:!0,value:0},boxShadow:e.boxShadowTabsOverflowLeft},"&::after":{right:{_skip_check_:!0,value:0},boxShadow:e.boxShadowTabsOverflowRight},[`&${t}-nav-wrap-ping-left::before`]:{opacity:1},[`&${t}-nav-wrap-ping-right::after`]:{opacity:1}}}},[`${t}-top`]:{[`> ${t}-nav,
        > div > ${t}-nav`]:{"&::before":{bottom:0},[`${t}-ink-bar`]:{bottom:0}}},[`${t}-bottom`]:{[`> ${t}-nav, > div > ${t}-nav`]:{order:1,marginTop:a,marginBottom:0,"&::before":{top:0},[`${t}-ink-bar`]:{top:0}},[`> ${t}-content-holder, > div > ${t}-content-holder`]:{order:0}},[`${t}-left, ${t}-right`]:{[`> ${t}-nav, > div > ${t}-nav`]:{flexDirection:"column",minWidth:o(e.controlHeight).mul(1.25).equal(),[`${t}-tab`]:{padding:l,textAlign:"center"},[`${t}-tab + ${t}-tab`]:{margin:c},[`${t}-nav-wrap`]:{flexDirection:"column","&::before, &::after":{right:{_skip_check_:!0,value:0},left:{_skip_check_:!0,value:0},height:e.controlHeight},"&::before":{top:0,boxShadow:e.boxShadowTabsOverflowTop},"&::after":{bottom:0,boxShadow:e.boxShadowTabsOverflowBottom},[`&${t}-nav-wrap-ping-top::before`]:{opacity:1},[`&${t}-nav-wrap-ping-bottom::after`]:{opacity:1}},[`${t}-ink-bar`]:{width:e.lineWidthBold,"&-animated":{transition:`height ${e.motionDurationSlow}, top ${e.motionDurationSlow}`}},[`${t}-nav-list, ${t}-nav-operations`]:{flex:"1 0 auto",flexDirection:"column"}}},[`${t}-left`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-ink-bar`]:{right:{_skip_check_:!0,value:0}}},[`> ${t}-content-holder, > div > ${t}-content-holder`]:{marginLeft:{_skip_check_:!0,value:h(o(e.lineWidth).mul(-1).equal())},borderLeft:{_skip_check_:!0,value:`${h(e.lineWidth)} ${e.lineType} ${e.colorBorder}`},[`> ${t}-content > ${t}-tabpane`]:{paddingLeft:{_skip_check_:!0,value:e.paddingLG}}}},[`${t}-right`]:{[`> ${t}-nav, > div > ${t}-nav`]:{order:1,[`${t}-ink-bar`]:{left:{_skip_check_:!0,value:0}}},[`> ${t}-content-holder, > div > ${t}-content-holder`]:{order:0,marginRight:{_skip_check_:!0,value:o(e.lineWidth).mul(-1).equal()},borderRight:{_skip_check_:!0,value:`${h(e.lineWidth)} ${e.lineType} ${e.colorBorder}`},[`> ${t}-content > ${t}-tabpane`]:{paddingRight:{_skip_check_:!0,value:e.paddingLG}}}}}},Ia=e=>{const{componentCls:t,cardPaddingSM:a,cardPaddingLG:r,horizontalItemPaddingSM:i,horizontalItemPaddingLG:l}=e;return{[t]:{"&-small":{[`> ${t}-nav`]:{[`${t}-tab`]:{padding:i,fontSize:e.titleFontSizeSM}}},"&-large":{[`> ${t}-nav`]:{[`${t}-tab`]:{padding:l,fontSize:e.titleFontSizeLG}}}},[`${t}-card`]:{[`&${t}-small`]:{[`> ${t}-nav`]:{[`${t}-tab`]:{padding:a}},[`&${t}-bottom`]:{[`> ${t}-nav ${t}-tab`]:{borderRadius:`0 0 ${h(e.borderRadius)} ${h(e.borderRadius)}`}},[`&${t}-top`]:{[`> ${t}-nav ${t}-tab`]:{borderRadius:`${h(e.borderRadius)} ${h(e.borderRadius)} 0 0`}},[`&${t}-right`]:{[`> ${t}-nav ${t}-tab`]:{borderRadius:{_skip_check_:!0,value:`0 ${h(e.borderRadius)} ${h(e.borderRadius)} 0`}}},[`&${t}-left`]:{[`> ${t}-nav ${t}-tab`]:{borderRadius:{_skip_check_:!0,value:`${h(e.borderRadius)} 0 0 ${h(e.borderRadius)}`}}}},[`&${t}-large`]:{[`> ${t}-nav`]:{[`${t}-tab`]:{padding:r}}}}}},La=e=>{const{componentCls:t,itemActiveColor:a,itemHoverColor:r,iconCls:i,tabsHorizontalItemMargin:l,horizontalItemPadding:c,itemSelectedColor:o,itemColor:d}=e,s=`${t}-tab`;return{[s]:{position:"relative",WebkitTouchCallout:"none",WebkitTapHighlightColor:"transparent",display:"inline-flex",alignItems:"center",padding:c,fontSize:e.titleFontSize,background:"transparent",border:0,outline:"none",cursor:"pointer",color:d,"&-btn, &-remove":Object.assign({"&:focus:not(:focus-visible), &:active":{color:a}},bt(e)),"&-btn":{outline:"none",transition:`all ${e.motionDurationSlow}`,[`${s}-icon:not(:last-child)`]:{marginInlineEnd:e.marginSM}},"&-remove":{flex:"none",marginRight:{_skip_check_:!0,value:e.calc(e.marginXXS).mul(-1).equal()},marginLeft:{_skip_check_:!0,value:e.marginXS},color:e.colorTextDescription,fontSize:e.fontSizeSM,background:"transparent",border:"none",outline:"none",cursor:"pointer",transition:`all ${e.motionDurationSlow}`,"&:hover":{color:e.colorTextHeading}},"&:hover":{color:r},[`&${s}-active ${s}-btn`]:{color:o,textShadow:e.tabsActiveTextShadow},[`&${s}-disabled`]:{color:e.colorTextDisabled,cursor:"not-allowed"},[`&${s}-disabled ${s}-btn, &${s}-disabled ${t}-remove`]:{"&:focus, &:active":{color:e.colorTextDisabled}},[`& ${s}-remove ${i}`]:{margin:0},[`${i}:not(:last-child)`]:{marginRight:{_skip_check_:!0,value:e.marginSM}}},[`${s} + ${s}`]:{margin:{_skip_check_:!0,value:l}}}},Ma=e=>{const{componentCls:t,tabsHorizontalItemMarginRTL:a,iconCls:r,cardGutter:i,calc:l}=e;return{[`${t}-rtl`]:{direction:"rtl",[`${t}-nav`]:{[`${t}-tab`]:{margin:{_skip_check_:!0,value:a},[`${t}-tab:last-of-type`]:{marginLeft:{_skip_check_:!0,value:0}},[r]:{marginRight:{_skip_check_:!0,value:0},marginLeft:{_skip_check_:!0,value:h(e.marginSM)}},[`${t}-tab-remove`]:{marginRight:{_skip_check_:!0,value:h(e.marginXS)},marginLeft:{_skip_check_:!0,value:h(l(e.marginXXS).mul(-1).equal())},[r]:{margin:0}}}},[`&${t}-left`]:{[`> ${t}-nav`]:{order:1},[`> ${t}-content-holder`]:{order:0}},[`&${t}-right`]:{[`> ${t}-nav`]:{order:0},[`> ${t}-content-holder`]:{order:1}},[`&${t}-card${t}-top, &${t}-card${t}-bottom`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-tab + ${t}-tab`]:{marginRight:{_skip_check_:!0,value:i},marginLeft:{_skip_check_:!0,value:0}}}}},[`${t}-dropdown-rtl`]:{direction:"rtl"},[`${t}-menu-item`]:{[`${t}-dropdown-rtl`]:{textAlign:{_skip_check_:!0,value:"right"}}}}},za=e=>{const{componentCls:t,tabsCardPadding:a,cardHeight:r,cardGutter:i,itemHoverColor:l,itemActiveColor:c,colorBorderSecondary:o}=e;return{[t]:Object.assign(Object.assign(Object.assign(Object.assign({},vt(e)),{display:"flex",[`> ${t}-nav, > div > ${t}-nav`]:{position:"relative",display:"flex",flex:"none",alignItems:"center",[`${t}-nav-wrap`]:{position:"relative",display:"flex",flex:"auto",alignSelf:"stretch",overflow:"hidden",whiteSpace:"nowrap",transform:"translate(0)","&::before, &::after":{position:"absolute",zIndex:1,opacity:0,transition:`opacity ${e.motionDurationSlow}`,content:"''",pointerEvents:"none"}},[`${t}-nav-list`]:{position:"relative",display:"flex",transition:`opacity ${e.motionDurationSlow}`},[`${t}-nav-operations`]:{display:"flex",alignSelf:"stretch"},[`${t}-nav-operations-hidden`]:{position:"absolute",visibility:"hidden",pointerEvents:"none"},[`${t}-nav-more`]:{position:"relative",padding:a,background:"transparent",border:0,color:e.colorText,"&::after":{position:"absolute",right:{_skip_check_:!0,value:0},bottom:0,left:{_skip_check_:!0,value:0},height:e.calc(e.controlHeightLG).div(8).equal(),transform:"translateY(100%)",content:"''"}},[`${t}-nav-add`]:Object.assign({minWidth:r,minHeight:r,marginLeft:{_skip_check_:!0,value:i},padding:`0 ${h(e.paddingXS)}`,background:"transparent",border:`${h(e.lineWidth)} ${e.lineType} ${o}`,borderRadius:`${h(e.borderRadiusLG)} ${h(e.borderRadiusLG)} 0 0`,outline:"none",cursor:"pointer",color:e.colorText,transition:`all ${e.motionDurationSlow} ${e.motionEaseInOut}`,"&:hover":{color:l},"&:active, &:focus:not(:focus-visible)":{color:c}},bt(e))},[`${t}-extra-content`]:{flex:"none"},[`${t}-ink-bar`]:{position:"absolute",background:e.inkBarColor,pointerEvents:"none"}}),La(e)),{[`${t}-content`]:{position:"relative",width:"100%"},[`${t}-content-holder`]:{flex:"auto",minWidth:0,minHeight:0},[`${t}-tabpane`]:{outline:"none","&-hidden":{display:"none"}}}),[`${t}-centered`]:{[`> ${t}-nav, > div > ${t}-nav`]:{[`${t}-nav-wrap`]:{[`&:not([class*='${t}-nav-wrap-ping']) > ${t}-nav-list`]:{margin:"auto"}}}}}},Na=e=>{const t=e.controlHeightLG;return{zIndexPopup:e.zIndexPopupBase+50,cardBg:e.colorFillAlter,cardHeight:t,cardPadding:`${(t-Math.round(e.fontSize*e.lineHeight))/2-e.lineWidth}px ${e.padding}px`,cardPaddingSM:`${e.paddingXXS*1.5}px ${e.padding}px`,cardPaddingLG:`${e.paddingXS}px ${e.padding}px ${e.paddingXXS*1.5}px`,titleFontSize:e.fontSize,titleFontSizeLG:e.fontSizeLG,titleFontSizeSM:e.fontSize,inkBarColor:e.colorPrimary,horizontalMargin:`0 0 ${e.margin}px 0`,horizontalItemGutter:32,horizontalItemMargin:"",horizontalItemMarginRTL:"",horizontalItemPadding:`${e.paddingSM}px 0`,horizontalItemPaddingSM:`${e.paddingXS}px 0`,horizontalItemPaddingLG:`${e.padding}px 0`,verticalItemPadding:`${e.paddingXS}px ${e.paddingLG}px`,verticalItemMargin:`${e.margin}px 0 0 0`,itemColor:e.colorText,itemSelectedColor:e.colorPrimary,itemHoverColor:e.colorPrimaryHover,itemActiveColor:e.colorPrimaryActive,cardGutter:e.marginXXS/2}},Ba=Zt("Tabs",e=>{const t=Jt(e,{tabsCardPadding:e.cardPadding,dropdownEdgeChildVerticalPadding:e.paddingXXS,tabsActiveTextShadow:"0 0 0.25px currentcolor",tabsDropdownHeight:200,tabsDropdownWidth:120,tabsHorizontalItemMargin:`0 0 0 ${h(e.horizontalItemGutter)}`,tabsHorizontalItemMarginRTL:`0 0 0 ${h(e.horizontalItemGutter)}`});return[Ia(t),Ma(t),Pa(t),Ra(t),Ta(t),za(t),Ea(t)]},Na),Oa=()=>null;var Aa=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(a[r[i]]=e[r[i]]);return a};const Da=e=>{var t,a,r,i,l,c,o,d,s,f,v;const{type:S,className:R,rootClassName:N,size:E,onEdit:M,hideAdd:b,centered:u,addIcon:T,removeIcon:z,moreIcon:A,more:W,popupClassName:D,children:_,items:y,animated:P,style:p,indicatorSize:x,indicator:m}=e,C=Aa(e,["type","className","rootClassName","size","onEdit","hideAdd","centered","addIcon","removeIcon","moreIcon","more","popupClassName","children","items","animated","style","indicatorSize","indicator"]),{prefixCls:Y}=C,{direction:re,tabs:g,getPrefixCls:j,getPopupContainer:ae}=n.useContext(Gt),H=j("tabs",Y),X=ea(H),[ie,w,O]=Ba(H,X);let G;S==="editable-card"&&(G={onEdit:(se,be)=>{let{key:I,event:ne}=be;M==null||M(se==="add"?ne:I,se)},removeIcon:(t=z??(g==null?void 0:g.removeIcon))!==null&&t!==void 0?t:n.createElement(Ft,null),addIcon:(T??(g==null?void 0:g.addIcon))||n.createElement(Yt,null),showAdd:b!==!0});const K=j(),V=ta(E),J=wa(y,_),Q=_a(H,P),ve=Object.assign(Object.assign({},g==null?void 0:g.style),p),oe={align:(a=m==null?void 0:m.align)!==null&&a!==void 0?a:(r=g==null?void 0:g.indicator)===null||r===void 0?void 0:r.align,size:(o=(l=(i=m==null?void 0:m.size)!==null&&i!==void 0?i:x)!==null&&l!==void 0?l:(c=g==null?void 0:g.indicator)===null||c===void 0?void 0:c.size)!==null&&o!==void 0?o:g==null?void 0:g.indicatorSize};return ie(n.createElement(Sa,Object.assign({direction:re,getPopupContainer:ae},C,{items:J,className:U({[`${H}-${V}`]:V,[`${H}-card`]:["card","editable-card"].includes(S),[`${H}-editable-card`]:S==="editable-card",[`${H}-centered`]:u},g==null?void 0:g.className,R,N,w,O,X),popupClassName:U(D,w,O,X),style:ve,editable:G,more:Object.assign({icon:(v=(f=(s=(d=g==null?void 0:g.more)===null||d===void 0?void 0:d.icon)!==null&&s!==void 0?s:g==null?void 0:g.moreIcon)!==null&&f!==void 0?f:A)!==null&&v!==void 0?v:n.createElement(Ut,null),transitionName:`${K}-slide-up`},W),prefixCls:H,animated:Q,indicator:oe})))};Da.TabPane=Oa;export{Da as T};
