var Ye=Object.defineProperty;var Qe=(e,t,n)=>t in e?Ye(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var he=(e,t,n)=>Qe(e,typeof t!="symbol"?t+"":t,n);import{r as s,j as w}from"./index-BHEw3_3_.js";function ke(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=ke(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function A(){for(var e,t,n=0,r="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=ke(e))&&(r&&(r+=" "),r+=t);return r}function Re(e,t){if(e===t)return!0;if(!e||!t)return!1;const n=Object.keys(e),r=Object.keys(t),o=n.length;if(r.length!==o)return!1;for(let l=0;l<o;l+=1){const a=n[l];if(e[a]!==t[a]||!Object.prototype.hasOwnProperty.call(t,a))return!1}return!0}function pe(e,t){if(e===t)return!0;if(!e||!t)return!1;const n=e.length;if(t.length!==n)return!1;for(let r=0;r<n;r+=1)if(e[r]!==t[r])return!1;return!0}function te(e,t){if(Object.is(e,t))return!0;if(Array.isArray(e)&&Array.isArray(t))return pe(e,t)?!0:e.length===t.length&&e.findIndex(r=>typeof r=="object"&&r!=null)>-1?e.every((r,o)=>Array.isArray(r)?pe(r,t[o]):typeof r=="object"&&r!=null?Re(r,t[o]):Object.is(r,t[o])):!1;if(e instanceof Map&&t instanceof Map){const n=Array.from(e.keys()),r=Array.from(t.keys());if(te(n,r)){const o=Array.from(e.values()),l=Array.from(t.values());if(te(o,l))return!0}return!1}return typeof e=="object"&&e!=null?Re(e,t):!1}function Ce(e){const t=e(),n=s.useRef(t);return te(t,n.current)||(n.current=t),n.current}function q(e){return"key"in e?e.key:e.dataIndex}function Ue(e,t){return typeof t=="function"?t(e):e[t]}function Y(e){return e==="left"}function Q(e){return e==="right"}function He(e){return Y(e)||Q(e)}const Ee=s.createContext(null);function me(){const e=s.useContext(Ee);if(e==null)throw new Error("useColumnSizes provider not found");return e}const Le=s.createContext(null);function Xe(e){const{columns:t,children:n}=e,{widthList:r}=me(),o=s.useMemo(()=>t.map(d=>({key:q(d),fixed:d.fixed})),[t]),l=s.useMemo(()=>{let d=0;const b=o.reduce((h,C,v)=>{const{fixed:p,key:S}=C;return Y(p)&&(h[v]=d,d+=r.get(S)??0),h},[]);let u=0;const f=o.reduceRight((h,C,v)=>{const{fixed:p,key:S}=C;return Q(p)&&(h[v]=u,u+=r.get(S)??0),h},[]);return o.reduce((h,C,v)=>{const{key:p,fixed:S}=C;return Y(S)?(h.set(p,b[v]),h):(Q(S)&&h.set(p,f[v]),h)},new Map)},[o,r]),a=Ce(()=>o),i=Ce(()=>l),c=s.useMemo(()=>({size:i,fixed:a}),[a,i]);return w.jsx(Le.Provider,{value:c,children:n})}function Me(){const e=s.useContext(Le);if(e==null)throw new Error("useTableSticky provider not found");return e}function _(e,t,n){return typeof t=="function"?t(e,n):e}function Ge(e,t,n){const{render:r}=n,o=t;if("dataIndex"in n){const l=n.dataIndex;return typeof r!="function"?o[l]:r(o[l],t,e)}return(r==null?void 0:r(t,t,e))??null}function Je(e){const{className:t,style:n,column:r,rowData:o,rowIndex:l,renderCell:a,...i}=e,{align:c,fixed:d,onCell:b}=r,u=q(r),{size:f}=Me(),{className:h,style:C,colSpan:v,rowSpan:p,...S}=(b==null?void 0:b(o,l))??{};return v===0||p===0?null:_(w.jsx("td",{...i,...S,colSpan:v,rowSpan:p,className:A("virtual-table-cell",c!=null&&`virtual-table-align-${c}`,He(d)&&"virtual-table-sticky-cell",t,r.className,h),style:{...n,...C,left:Y(d)?f.get(u):void 0,right:Q(d)?f.get(u):void 0},children:Ge(l,o,r)}),a,{column:r})}const Ve=s.memo(Je),Ze=e=>{const{columns:t,onColumnSizesMeasure:n}=e,r=n!=null,o=new Map,l=s.useRef(new Map);return w.jsx("colgroup",{ref:()=>{r&&(te(o,l.current)||(n(o),l.current=o))},children:t.map(a=>{const{key:i}=a;if(a.type==="blank")return w.jsx("col",{className:"blank",style:{width:a.width}},i);const{column:c}=a;return w.jsx("col",{ref:d=>{d==null||!r||o.set(i,d.offsetWidth)},style:{width:c.width,minWidth:c.minWidth}},i)})})},je=s.memo(Ze),et=/auto|scroll|overlay|hidden/;function We(e){return e instanceof Node?e.nodeType===1:!1}function tt(e,t=window){let n=e;for(;n!==t&&We(n);){if(n===document.body)return t;const{overflow:r,overflowY:o,overflowX:l}=window.getComputedStyle(n);if(et.test(r+o+l))return n;n=n.parentNode}return e.ownerDocument.defaultView??window}function ce(e){return Object.prototype.toString.call(e)==="[object Window]"}function nt(e){return Object.prototype.toString.call(e)==="[object HTMLDocument]"}function Ne(e){return Object.prototype.toString.call(e)==="[object HTMLHtmlElement]"}function Se(e){return nt(e)?e.scrollingElement:We(e)?e:document.scrollingElement}function rt(e,t){const n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),o=Number.parseFloat(window.getComputedStyle(t).borderTopWidth)||0,l=t.scrollTop;return n.top-r.top-o+l}function ot(e){const{getScroller:t,root:n}=e,[r,o]=s.useState(0),[l,a]=s.useState(0),[i,c]=s.useState(0),[d,b]=s.useState(0),u=s.useRef(null);return s.useLayoutEffect(()=>{const f=t();if(f==null)return;let h;ce(f)?h=document.scrollingElement:h=f,u.current=h;const C=new ResizeObserver(v=>{const{width:p,height:S}=v[0].contentRect;o(p),a(S)});return C.observe(h),()=>{C.disconnect()}},[t]),s.useLayoutEffect(()=>{const f=n.current;if(f==null)return;const h=new ResizeObserver(C=>{const{width:v,height:p}=C[0].contentRect;c(v),b(p)});return h.observe(f),()=>{h.disconnect()}},[n]),{scrollContainerWidth:r,scrollContainerHeight:l,tableWidth:i,tableHeight:d}}const Te=s.createContext(null);function st(e){const{getScroller:t,root:n,children:r}=e,{scrollContainerHeight:o,scrollContainerWidth:l,tableHeight:a,tableWidth:i}=ot({getScroller:t,root:n}),c=s.useMemo(()=>({scrollContainerWidth:l,scrollContainerHeight:o,tableWidth:i,tableHeight:a}),[l,o,i,a]);return w.jsx(Te.Provider,{value:c,children:r})}function Wt(){const e=s.useContext(Te);if(e==null)throw new Error("useContainerSize provider not found");return e}const ze=s.createContext(null);function lt(e){const{children:t}=e,n=s.useRef(new Map),r=s.useMemo(()=>{const o=new Set;return{listen(l,a){return n.current.set(l,(i,c)=>{a(i,c)}),()=>{n.current.delete(l)}},notify(l,a){if(o.has(l)){o.delete(l);return}const{scrollLeft:i,node:c}=a;let d=window.requestAnimationFrame;d==null&&(d=b=>{b()}),n.current.forEach((b,u)=>{l!==u&&(o.add(u),d(()=>{b(i(),c)}))})}}},[]);return w.jsx(ze.Provider,{value:r,children:t})}function ie(){const e=s.useContext(ze);if(e==null)throw new Error("useHorizontalScrollContext provider not found");return e}const Fe=s.createContext(null);function ct(){const e=s.useContext(Fe);if(e==null)throw new Error("useTableRowManager provider not found");return e}function ve(e){const t=s.useRef(null);return s.useLayoutEffect(()=>{t.current=e}),s.useCallback((...r)=>{var o;return(o=t.current)==null?void 0:o.call(t,...r)},[])}function it(e){const t={current:null,options:null};return(...n)=>{const r=o=>e(o,...n);return te(n,t.options)?t.current??r:(t.options=n,t.current=r,r)}}function ut(e){return Array.isArray(e)?e.filter(t=>t!=null&&(typeof t=="function"||typeof t.hook=="function")).map(t=>typeof t=="function"?{priority:100,hook:t}:t):[]}const le=class le{constructor(){he(this,"hooks",[]);this.use=this.use.bind(this)}setHooks(t){this.hooks=t}use(t){if(this.hooks.length===0)return t;const n={current:t},r={render:[],renderRoot:[],renderContent:[],renderHeaderWrapper:[],renderHeaderRoot:[],renderHeader:[],renderHeaderRow:[],renderHeaderCell:[],renderBodyWrapper:[],renderBodyRoot:[],renderBody:[],renderBodyContent:[],renderRow:[],renderCell:[]},o=[],l=[],a=this.hooks.slice();return a.sort((i,c)=>i.priority-c.priority),a.map(i=>i.hook).forEach(i=>{const c=i(n.current),{render:d,renderRoot:b,renderContent:u,renderHeaderWrapper:f,renderHeaderRoot:h,renderHeader:C,renderHeaderRow:v,renderHeaderCell:p,renderBodyWrapper:S,renderBodyRoot:F,renderBody:W,renderBodyContent:D,renderRow:T,renderCell:M,rowClassName:E,onRow:N,...R}=c;Object.entries(r).forEach(([j,L])=>{const k=c[j];typeof k=="function"&&L.push(k)}),typeof E=="function"&&o.push(E),typeof N=="function"&&l.push(N),n.current=R}),Object.entries(r).forEach(([i,c])=>{c.length>0&&(n.current[i]=(d,b)=>c.reduce((u,f)=>f(u,b),d))}),o.length>0&&(n.current.rowClassName=(i,c)=>A(...o.map(d=>d(i,c)))),l.length>0&&(n.current.onRow=(i,c)=>l.reduce((d,b)=>({...d,...b(i,c)}),{})),n.current}};he(le,"defaultPipeline",new le);let ne=le;function Nt(e){const{use:t,pipeline:n}=e,r=s.useMemo(()=>({current:new ne}),[]);if(t!=null){const o=ut([...t,...(n==null?void 0:n.hooks)??[]]);if(!pe(r.current.hooks,o)){const l=new ne;return l.setHooks(o),r.current=l,l}}return r.current}function ye(e,t){let n=-1;for(let r=0;r<e.length;r+=1)t(e[r],r)&&(n=r);return n}function at(e){const{className:t,rowIndex:n,rowData:r,columns:o,onRow:l,renderRow:a,renderCell:i,...c}=e,{updateRowHeight:d}=ct(),{columns:b,descriptor:u}=o,f=ye(u,p=>p.type==="blank"?!1:Y(p.column.fixed)),h=u.findIndex(p=>p.type==="blank"?!1:Q(p.column.fixed)),{className:C,...v}=(l==null?void 0:l(r,n))??{};return _(w.jsx("tr",{...c,...v,className:A("virtual-table-row",t,C),ref:p=>{p!=null&&d(n,n,p.offsetHeight)},children:u.map((p,S)=>{const{key:F}=p;if(p.type==="blank")return w.jsx("td",{},F);const{column:W}=p;return w.jsx(Ve,{className:A(f===S&&"virtual-table-cell-fix-left-last",h===S&&"virtual-table-cell-fix-right-first"),column:W,rowIndex:n,rowData:r,renderCell:i},F)})}),a,{columns:b,rowIndex:n,rowData:r,columnDescriptor:u})}const dt=s.memo(at);function ft(e,t){typeof e=="function"?e(t):typeof e=="object"&&e!==null&&"current"in e&&(e.current=t)}function ht(...e){return t=>{e.forEach(n=>ft(n,t))}}function Z(...e){return s.useCallback(ht(...e),e)}function ge(e,t){if(ce(e)){const n=()=>{t({width:window.innerWidth,height:window.innerHeight})};return n(),window.addEventListener("resize",n),()=>{window.removeEventListener("resize",n)}}else{const n=new ResizeObserver(r=>{const o=r[0].contentRect;t({width:o.width,height:o.height})});return n.observe(e),()=>{n.disconnect()}}}function pt(e,t){let n=0,r=e.length-1,o=-1;for(;n<=r;){const l=Math.floor((n+r)/2);e[l].bottom>t?(o=l,r=l-1):n=l+1}if(o!==-1)return e[o]}function mt(e){const{getOffsetTop:t,dataSource:n,getScroller:r,estimateSize:o,overscan:l}=e,[a,i]=s.useState(0),[c,d]=s.useState(0),b=s.useMemo(()=>n.slice(a,c),[n,a,c]),u=s.useRef([]);(()=>{const M=n.length;for(let E=0;E<M;E++)u.current[E]==null&&(u.current[E]=o);u.current=u.current.slice(0,M)})();const h=s.useRef([]),C=(M=!1)=>{if(M&&h.current.length>0)return;const{rects:E}=u.current.reduce((N,R,j)=>{const L=N.top+R;return N.rects.push({index:j,top:N.top,height:R,bottom:L}),N.top=L,N},{top:0,rects:[]});h.current=E},v=(M,E)=>{u.current[M]=E},p=s.useRef({index:0,height:o,top:0,bottom:o}),S=s.useRef(0),F=s.useRef(!1);s.useEffect(()=>{const M=r();if(M==null)return;let E=0;const N=()=>{const g=t();let m=0;return ce(M)||Ne(M)?m=window.scrollY:m=Se(M).scrollTop,Math.max(m-g,0)},R=g=>{const m=E;return E=Math.ceil(g/o),{prevCount:m}},j=g=>{const m=pt(h.current,g);m!=null&&(p.current=m,i(Math.max(0,m.index-l)),d(m.index+E+l))},L=g=>{const m=t(),x=Se(g.target),H=Math.max(0,x.scrollTop-m);H>S.current?H>p.current.bottom&&j(H):H<p.current.top&&j(H),S.current=H};let k=0;const y=ge(M,g=>{if(g.height===k||g.height===0)return;k=g.height,R(g.height);const m=N();if(F.current)j(m);else{F.current=!0;let x=0;m>=o&&(x=Math.max(Math.floor(m/o)-1-l,0));const H=x+E+l;i(x),d(H)}});return M.addEventListener("scroll",L),()=>{y(),M.removeEventListener("scroll",L)}},[o,t,r,l]);const W=(M,E)=>u.current.slice(M,E).reduce((N,R)=>N+R,0),D=W(0,a),T=W(c);return{startIndex:a,endIndex:c,rowHeightList:u,updateRowRectList:C,setRowHeight:v,topBlank:D,bottomBlank:T,dataSlice:b}}function yt(e){const{bodyWrapperRef:t,bodyRootRef:n,bodyRef:r,className:o,style:l,dataSource:a,columns:i,rowKey:c,overscan:d,estimateSize:b,getScroller:u,getOffsetTop:f,rowClassName:h,onRow:C,renderBodyWrapper:v,renderBodyRoot:p,renderBody:S,renderBodyContent:F,renderRow:W,renderCell:D}=e,{startIndex:T,dataSlice:M,setRowHeight:E,updateRowRectList:N,rowHeightList:R,topBlank:j,bottomBlank:L}=mt({getOffsetTop:f,dataSource:a,getScroller:u,estimateSize:b,overscan:d}),k=s.useRef(new Map),y=s.useCallback((I,P,$)=>{const U=k.current.get(I)??new Map;U.set(P,$),k.current.set(I,U)},[]),g=s.useMemo(()=>({updateRowHeight:y,getRowHeightList:()=>R.current}),[R,y]),{columns:m,descriptor:x}=i,H=Z(r,I=>{if(I==null||I.offsetHeight===0)return;k.current.forEach((U,ee)=>{const J=Array.from(U.values()).reduce((V,de)=>V+de,0);E(ee,J)}),N(),k.current.clear()}),K=_(M.map((I,P)=>{const $=Ue(I,c);return w.jsx(dt,{className:A(h==null?void 0:h(I,P)),rowIndex:P+T,rowData:I,columns:i,onRow:C,renderRow:W,renderCell:D},$)}),F,{columns:m,columnDescriptor:x,startRowIndex:T}),B=_(w.jsx("tbody",{ref:H,children:K}),S,{columns:m,columnDescriptor:x,startRowIndex:T}),{setWidthList:G}=me(),ue=_(w.jsxs("table",{className:A(o,"virtual-table-body"),style:{...l,paddingBottom:L,paddingTop:j},ref:n,children:[w.jsx(je,{columns:x,onColumnSizesMeasure:G}),B]}),p,{columns:m,columnDescriptor:x,startRowIndex:T}),{listen:re,notify:oe}=ie(),se=s.useRef(null);s.useEffect(()=>{const I=se.current;if(I==null)return;const P="virtual-table-body",$=()=>{oe(P,{scrollLeft:()=>I.scrollLeft,node:I})},U=re(P,ee=>{I.scrollLeft=ee});return I.addEventListener("scroll",$),()=>{I.removeEventListener("scroll",$),U()}},[re,oe]);const ae=Z(se,t);return w.jsx(Fe.Provider,{value:g,children:_(w.jsx("div",{ref:ae,className:"virtual-table-body-wrapper",children:ue}),v,{columns:m,columnDescriptor:x,startRowIndex:T})})}const gt=e=>{const{className:t,style:n,wrapperRef:r,columns:o,stickyHeader:l,renderHeaderWrapper:a,renderHeaderRoot:i,renderHeader:c,renderHeaderRow:d,renderHeaderCell:b}=e,{columns:u,descriptor:f}=o,h=u[u.length-1],{widthList:C}=me(),{size:v}=Me(),p=ye(f,R=>R.type==="blank"?!1:Y(R.column.fixed)),S=f.findIndex(R=>R.type==="blank"?!1:Q(R.column.fixed)),{listen:F,notify:W}=ie(),D=s.useRef(null);s.useEffect(()=>{const R=D.current;if(R==null)return;const j="virtual-table-header",L=()=>{W(j,{scrollLeft:()=>R.scrollLeft,node:R})},k=F(j,y=>{R.scrollLeft=y});return R.addEventListener("scroll",L),()=>{R.removeEventListener("scroll",L),k()}},[F,W]);const T=_(w.jsx("tr",{children:f.map((R,j)=>{var H;const{key:L}=R;if(R.type==="blank")return w.jsx("th",{"data-blank":!0},L);const{column:k}=R;if(k.colSpan===0)return null;const y=q(h)===L,{className:g,style:m,...x}=((H=k.onHeaderCell)==null?void 0:H.call(k,k,j))??{};return w.jsx(s.Fragment,{children:_(s.createElement("th",{scope:"col",...x,colSpan:k.colSpan,className:A("virtual-table-header-cell",y&&"no-split",k.align!=null&&`virtual-table-align-${k.align}`,He(k.fixed)&&"virtual-table-sticky-cell",p===j&&"virtual-table-cell-fix-left-last",S===j&&"virtual-table-cell-fix-right-first",k.className,g),style:{...m,left:Y(k.fixed)?v.get(L):void 0,right:Q(k.fixed)?v.get(L):void 0}},k.title),b,{column:k,columns:u,columnWidths:C,columnDescriptor:f})},L)})}),d,{columns:u,columnDescriptor:f}),M=_(w.jsx("thead",{className:"virtual-table-thead",children:T}),c,{columns:u,columnDescriptor:f}),E=_(w.jsxs("table",{style:n,children:[w.jsx(je,{columns:f}),M]}),i,{columns:u,columnDescriptor:f}),N=Z(r,D);return _(w.jsx("div",{ref:N,className:A("virtual-table-header",t,{"virtual-table-header-sticky":l}),style:{top:Number.isFinite(l)?l:void 0},children:E}),a,{columns:u,columnDescriptor:f})},wt=s.memo(gt);function xt(e,t){let n=0,r=e.length-1,o=-1;for(;n<=r;){const l=Math.floor((n+r)/2);e[l].right>t?(o=l,r=l-1):n=l+1}if(o!==-1)return e[o]}function bt(e){let t=-1;for(let n=e.length-1;n>=0;n--){const r=e[n];if(Q(r.fixed))t=n;else break}return t}function Rt(e){return ye(e,t=>Y(t.fixed))}function Ct(e){const{estimateSize:t,defaultColumnWidth:n,overscan:r,columns:o,bodyWrapper:l,columnWidths:a,disabled:i=!1}=e,c=Rt(o),d=bt(o),b=c>-1?q(o[c]):null,u=d>-1?q(o[d]):null,[f,h]=s.useState(0),[C,v]=s.useState(0),p=s.useMemo(()=>{if(i)return[];let y=0;return o.map((g,m)=>{const x=q(g),H=a.get(x)??t,K=y+H,B={index:m,width:H,left:y,right:K};return y=K,B})},[o,a,t,i]),S=s.useRef({index:0,width:t,left:0,right:t}),F=ve(y=>xt(p,y)),W=ve((y,g)=>{const m=F(y);m!=null&&(S.current=m,h(Math.max(0,m.index-r)),v(m.index+g+r))}),D=s.useRef(0);s.useEffect(()=>{if(i)return;const y=l.current;if(y==null)return;const g=y.offsetWidth;let m=Math.ceil(g/t);const x=()=>{const B=y.scrollLeft;B>D.current?B>S.current.right&&W(B,m):B<S.current.left&&W(B,m),D.current=B};y.addEventListener("scroll",x);let H=0;const K=ge(y,({width:B})=>{if(B===H||B===0)return;H=B;const G=y.scrollLeft;m=Math.ceil(B/t),W(G,m)});return()=>{y.removeEventListener("scroll",x),K()}},[l,t,W,r,F,i]);const T=(y,g)=>p.slice(y,g).reduce((m,x)=>m+x.width,0),M=c>-1?T(0,c+1):0,E=d>-1?T(d):0,N=Math.max(0,T(0,f)-M),R=Math.max(0,T(C)-E),j=s.useMemo(()=>{if(i)return o;const y=[...o.slice(0,c+1),...o.slice(f,C),...o.slice(d)],g=new Set;return y.filter(m=>{const x=q(m);return g.has(x)?!1:(g.add(x),!0)})},[i,o,f,C,c,d]),L=s.useMemo(()=>j.reduce((y,g,m)=>{const x=q(g);let H=g;return H.width==null&&H.minWidth==null&&(H={...H,width:n}),x===b?(y.push({type:"normal",key:x,column:H}),y.push({type:"blank",key:"_blank_left",width:N})):b==null&&m===0?(y.push({type:"blank",key:"_blank_left",width:N}),y.push({type:"normal",key:x,column:H})):x===u?(y.push({type:"blank",key:"_blank_right",width:R}),y.push({type:"normal",key:x,column:H})):u==null&&m===j.length-1?(y.push({type:"normal",key:x,column:H}),y.push({type:"blank",key:"_blank_right",width:R})):y.push({type:"normal",key:x,column:H}),y},[]),[j,b,u,N,R,n]);return{columns:s.useMemo(()=>({columns:j,descriptor:L}),[j,L]),columnSlice:j,lastFixedLeftIndex:c,firstFixedRightIndex:d}}function St(e,t){const{className:n,style:r,children:o,hasFixedLeftColumn:l,hasFixedRightColumn:a,renderRoot:i,bodyScrollContainer:c}=e,d=s.useRef(null),[b,u]=s.useState(!1),[f,h]=s.useState(!1),{listen:C}=ie();s.useEffect(()=>{if(!l&&!a)return;const p=F=>{const{scrollLeft:W,clientWidth:D,scrollWidth:T}=F;l&&u(W!==0),a&&h(!(W+D>=T))},S=c.current;return S!=null&&p(S),C("__root",(F,W)=>{p(W)})},[c,l,a,C]);const v=Z(t,d);return _(w.jsx("div",{ref:v,className:A("virtual-table",b&&"virtual-table-has-fix-left",f&&"virtual-table-has-fix-right",n),style:r,children:o}),i,{})}const vt=s.forwardRef(St);function kt(e,t){const{bodyRootRef:n,className:r,style:o,tableBodyClassName:l,tableBodyStyle:a,columns:i,dataSource:c,rowKey:d="key",estimatedRowHeight:b=46,estimatedColumnWidth:u,overscanRows:f=5,overscanColumns:h=3,stickyHeader:C,defaultColumnWidth:v=100,pipeline:p=ne.defaultPipeline,rowClassName:S,onRow:F,getOffsetTop:W,virtualHeader:D=!0}=e,T=s.useRef(null),M=s.useRef(null),E=s.useRef(null),N=s.useRef(null),R=Z(N,n),j=s.useRef(null),L=s.useCallback(()=>{const z=T.current;if(z!=null)return tt(z)},[]),k=s.useCallback(()=>{if(typeof W=="function")return W();const z=L(),O=T.current;if(O==null||z==null||z===O)return 0;if(ce(z)||Ne(z)){const fe=O.getBoundingClientRect().top;return window.scrollY+fe}return rt(O,z)},[W,L]),{dataSource:y,columns:g,rowKey:m,rowClassName:x,render:H,renderRoot:K,renderContent:B,renderHeaderWrapper:G,renderHeaderRoot:ue,renderHeader:re,renderHeaderRow:oe,renderHeaderCell:se,renderBodyWrapper:ae,renderBodyRoot:I,renderBody:P,renderBodyContent:$,renderRow:U,renderCell:ee,onRow:J}=p.use({dataSource:c,rowKey:d,columns:i,estimatedRowHeight:b,headerWrapperRef:M,bodyWrapperRef:E,bodyRootRef:N,bodyRef:j,rootRef:T,getOffsetTop:k,getScroller:L}),[V,de]=s.useState(()=>new Map),we=s.useRef(V),xe=s.useCallback(z=>{const O=new Map(we.current);z.forEach((fe,qe)=>{O.set(qe,fe)}),we.current=O,de(O)},[]),Ie=s.useMemo(()=>({widthList:V,setWidthList:xe}),[V,xe]),{columns:X}=Ct({estimateSize:u??v,defaultColumnWidth:v,overscan:h,columns:g,bodyWrapper:E,columnWidths:V,disabled:u==null}),Be=s.useCallback((z,O)=>A(S==null?void 0:S(z,O),x==null?void 0:x(z,O)),[S,x]),De=s.useCallback((z,O)=>({...F==null?void 0:F(z,O),...J==null?void 0:J(z,O)}),[J,F]),Oe=g.some(z=>Y(z.fixed)),_e=g.some(z=>Q(z.fixed)),be=s.useMemo(()=>({columns:g,descriptor:g.map(z=>({key:q(z),type:"normal",column:z}))}),[g]),Ae=s.useMemo(()=>D?X:be,[D,be,X]),Pe=_(w.jsxs(w.Fragment,{children:[w.jsx(wt,{wrapperRef:M,columns:Ae,stickyHeader:C,renderHeaderWrapper:G,renderHeaderRoot:ue,renderHeader:re,renderHeaderRow:oe,renderHeaderCell:se}),w.jsx(yt,{bodyWrapperRef:E,bodyRootRef:R,bodyRef:j,className:l,style:a,columns:X,rowKey:m,dataSource:y,overscan:f,estimateSize:b,getScroller:L,getOffsetTop:k,rowClassName:Be,onRow:De,renderBodyWrapper:ae,renderBodyRoot:I,renderBody:P,renderBodyContent:$,renderRow:U,renderCell:ee})]}),B,{columns:X.columns,columnDescriptor:X.descriptor}),Ke=Z(T,t),$e=_(w.jsx(vt,{ref:Ke,className:r,style:o,hasFixedLeftColumn:Oe,hasFixedRightColumn:_e,renderRoot:K,bodyScrollContainer:E,children:Pe}),H,{columns:X.columns,columnDescriptor:X.descriptor});return w.jsx(Ee.Provider,{value:Ie,children:w.jsx(Xe,{columns:g,children:w.jsx(st,{getScroller:L,root:T,children:w.jsx(lt,{children:$e})})})})}const Tt=s.memo(s.forwardRef(kt));function Ht(){const e=document.createElement("div");e.style.position="absolute",e.style.width="100px",e.style.height="100px",e.style.overflow="scroll",e.style.top="-9999px",document.body.appendChild(e);const t=e.offsetWidth-e.clientWidth,n=e.offsetHeight-e.clientHeight;return document.body.removeChild(e),{width:t,height:n}}const Et=e=>{const{className:t,style:n,bottom:r,zIndex:o,bodyRef:l}=e,{listen:a,notify:i}=ie(),c=s.useRef(null);s.useEffect(()=>{const f=c.current;if(f==null)return;const h="virtual-table-sticky-bottom-scroll",C=()=>{i(h,{scrollLeft:()=>f.scrollLeft,node:f})},v=a(h,p=>{f.scrollLeft=p});return f.addEventListener("scroll",C),()=>{f.removeEventListener("scroll",C),v()}},[a,i]);const[d,b]=s.useState(0);s.useEffect(()=>{const f=l.current;if(f!=null)return ge(f,({width:h})=>{h!==0&&b(h)})},[l]);const[u]=s.useState(Ht);return w.jsx("div",{className:A("virtual-table-sticky-scroll",t),style:{...n,"--virtual-table-sticky-scroll-bottom":Number.isFinite(r)?`${r}px`:r,paddingTop:u.height>0?0:15,marginTop:u.height>0?0:u.height*-1,height:u.height+1,zIndex:o},ref:c,children:w.jsx("div",{className:"virtual-table-sticky-scroll-bar",style:{width:d}})})};function Lt(e,t){const{bodyRootRef:n}=e;return{...e,renderContent(r){return w.jsxs(w.Fragment,{children:[r,w.jsx(Et,{bodyRef:n,...t})]})}}}const zt=it(Lt);export{je as C,Tt as V,it as a,Wt as b,A as c,ct as d,Ce as e,ve as f,q as g,zt as h,Ue as i,He as j,Me as k,Y as l,Q as m,ye as n,ge as o,ie as p,Ht as q,Z as r,Nt as u};
