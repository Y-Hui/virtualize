var Ge=Object.defineProperty;var Je=(e,t,n)=>t in e?Ge(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var ee=(e,t,n)=>Je(e,typeof t!="symbol"?t+"":t,n);import{r as s,j as g}from"./index-Bqz_UHhe.js";function he(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=he(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function B(){for(var e,t,n=0,r="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=he(e))&&(r&&(r+=" "),r+=t);return r}function ae(e,t){if(e===t)return!0;if(!e||!t)return!1;const n=Object.keys(e),r=Object.keys(t),o=n.length;if(r.length!==o)return!1;for(let l=0;l<o;l+=1){const a=n[l];if(e[a]!==t[a]||!Object.prototype.hasOwnProperty.call(t,a))return!1}return!0}function q(e,t){if(e===t)return!0;if(!e||!t)return!1;const n=e.length;if(t.length!==n)return!1;for(let r=0;r<n;r+=1)if(e[r]!==t[r])return!1;return!0}function pe(e,t){return Object.is(e,t)?!0:Array.isArray(e)&&Array.isArray(t)?q(e,t)?!0:e.length===t.length&&e.findIndex(r=>typeof r=="object"&&r!=null)>-1?e.every((r,o)=>Array.isArray(r)?q(r,t[o]):typeof r=="object"&&r!=null?ae(r,t[o]):Object.is(r,t[o])):!1:typeof e=="object"&&e!=null?ae(e,t):!1}function de(e){const t=e(),n=s.useRef(t);return pe(t,n.current)||(n.current=t),n.current}function _(e){return"key"in e?e.key:e.dataIndex}function K(e){return e==="left"}function P(e){return e==="right"}function me(e){return K(e)||P(e)}const ye=s.createContext(null);function ne(){const e=s.useContext(ye);if(e==null)throw new Error("useColumnSizes provider not found");return e}const xe=s.createContext(null);function Ze(e){const{columns:t,children:n}=e,{widthList:r}=ne(),o=s.useMemo(()=>t.map(x=>({key:_(x),fixed:x.fixed})),[t]),l=s.useMemo(()=>{let x=0;const f=o.reduce((m,C,S)=>{const{fixed:h,key:w}=C;return K(h)&&(m[S]=x,x+=r.get(w)??0),m},[]);let p=0;const i=o.reduceRight((m,C,S)=>{const{fixed:h,key:w}=C;return P(h)&&(m[S]=p,p+=r.get(w)??0),m},[]);return o.reduce((m,C,S)=>{const{key:h,fixed:w}=C;return K(w)?(m.set(h,f[S]),m):(P(w)&&m.set(h,i[S]),m)},new Map)},[o,r]),a=de(()=>o),u=de(()=>l),d=s.useMemo(()=>({size:u,fixed:a}),[a,u]);return g.jsx(xe.Provider,{value:d,children:n})}function ge(){const e=s.useContext(xe);if(e==null)throw new Error("useTableSticky provider not found");return e}function D(e,t,n){return typeof t=="function"?t(e,n):e}function et(e,t,n){const{render:r}=n,o=t;if("dataIndex"in n){const l=n.dataIndex;return typeof r!="function"?o[l]:r(o[l],t,e)}return(r==null?void 0:r(t,t,e))??null}function tt(e){const{className:t,style:n,column:r,rowData:o,rowIndex:l,columnIndex:a,renderCell:u,...d}=e,{align:x,fixed:f,onCell:p}=r,i=_(r),{size:m}=ge(),{className:C,style:S,colSpan:h,rowSpan:w,...L}=(p==null?void 0:p(o,l))??{};return h===0||w===0?null:D(g.jsx("td",{...d,...L,colSpan:h,rowSpan:w,className:B("virtual-table-cell",x!=null&&`virtual-table-align-${x}`,me(f)&&"virtual-table-sticky-cell",t,r.className,C),style:{...n,...S,left:K(f)?m.get(i):void 0,right:P(f)?m.get(i):void 0},children:et(l,o,r)}),u,{column:r,columnIndex:a})}const nt=s.memo(tt),we=e=>{const{columns:t,colRef:n}=e;return g.jsx("colgroup",{children:t.map((r,o)=>{const{key:l}=r;if(r.type==="blank")return g.jsx("col",{style:{width:r.width}},l);const{column:a}=r;return g.jsx("col",{ref:typeof n=="function"?u=>{n(u,a,o)}:n,style:{width:a.width,minWidth:a.minWidth}},l)})})},rt=/auto|scroll|overlay|hidden/;function Re(e){return e instanceof Node?e.nodeType===1:!1}function ot(e,t=window){let n=e;for(;n!==t&&Re(n);){if(n===document.body)return t;const{overflow:r,overflowY:o,overflowX:l}=window.getComputedStyle(n);if(rt.test(r+o+l))return n;n=n.parentNode}return e.ownerDocument.defaultView??window}function Z(e){return Object.prototype.toString.call(e)==="[object Window]"}function st(e){return Object.prototype.toString.call(e)==="[object HTMLDocument]"}function be(e){return Object.prototype.toString.call(e)==="[object HTMLHtmlElement]"}function fe(e){return st(e)?e.scrollingElement:Re(e)?e:document.scrollingElement}function lt(e){const{getScroller:t,root:n}=e,[r,o]=s.useState(0),[l,a]=s.useState(0),[u,d]=s.useState(0),[x,f]=s.useState(0),p=s.useRef(null);return s.useLayoutEffect(()=>{const i=t();if(i==null)return;let m;Z(i)?m=document.scrollingElement:m=i,p.current=m;const C=new ResizeObserver(S=>{const{width:h,height:w}=S[0].contentRect;o(h),a(w)});return C.observe(m),()=>{C.disconnect()}},[t]),s.useLayoutEffect(()=>{const i=n.current;if(i==null)return;const m=new ResizeObserver(C=>{const{width:S,height:h}=C[0].contentRect;d(S),f(h)});return m.observe(i),()=>{m.disconnect()}},[n]),{scrollContainerWidth:r,scrollContainerHeight:l,tableWidth:u,tableHeight:x}}const Ce=s.createContext(null);function ct(e){const{getScroller:t,root:n,children:r}=e,{scrollContainerHeight:o,scrollContainerWidth:l,tableHeight:a,tableWidth:u}=lt({getScroller:t,root:n}),d=s.useMemo(()=>({scrollContainerWidth:l,scrollContainerHeight:o,tableWidth:u,tableHeight:a}),[l,o,u,a]);return g.jsx(Ce.Provider,{value:d,children:r})}function zt(){const e=s.useContext(Ce);if(e==null)throw new Error("useContainerSize provider not found");return e}const Se=s.createContext(null);function it(e){const{children:t}=e,n=s.useRef(new Map),r=s.useMemo(()=>({listen(o,l){return n.current.set(o,l),()=>{n.current.delete(o)}},notify(o,l){let a=window.requestAnimationFrame;a==null&&(a=u=>{u()}),a(()=>{n.current.forEach((u,d)=>{d!==o&&u(l)})})}}),[]);return g.jsx(Se.Provider,{value:r,children:t})}function re(){const e=s.useContext(Se);if(e==null)throw new Error("useHorizontalScrollContext provider not found");return e}const ve=s.createContext(null);function ut(){const e=s.useContext(ve);if(e==null)throw new Error("useTableRowManager provider not found");return e}function te(e){const t=s.useRef(null);return s.useLayoutEffect(()=>{t.current=e},[e]),s.useCallback((...r)=>{var o;return(o=t.current)==null?void 0:o.call(t,...r)},[])}function at(e){const t={current:null,options:null};return(...n)=>{const r=o=>e(o,...n);return pe(n,t.options)?t.current??r:(t.options=n,t.current=r,r)}}function dt(e){return Array.isArray(e)?e.filter(t=>t!=null&&(typeof t=="function"||typeof t.hook=="function")).map(t=>typeof t=="function"?{priority:100,hook:t}:t):[]}const J=class J{constructor(){ee(this,"hooks",[]);this.use=this.use.bind(this)}setHooks(t){this.hooks=t}use(t){if(this.hooks.length===0)return t;const n={current:t},r={render:[],renderRoot:[],renderContent:[],renderHeaderWrapper:[],renderHeaderRoot:[],renderHeader:[],renderHeaderRow:[],renderHeaderCell:[],renderBodyWrapper:[],renderBodyRoot:[],renderBody:[],renderRow:[],renderCell:[]},o=[],l=[],a=this.hooks.slice();return a.sort((u,d)=>u.priority-d.priority),a.map(u=>u.hook).forEach(u=>{const d=u(n.current),{render:x,renderRoot:f,renderContent:p,renderHeaderWrapper:i,renderHeaderRoot:m,renderHeader:C,renderHeaderRow:S,renderHeaderCell:h,renderBodyWrapper:w,renderBodyRoot:L,renderBody:M,renderRow:E,renderCell:N,rowClassName:T,onRow:F,...k}=d;Object.entries(r).forEach(([W,H])=>{const v=d[W];typeof v=="function"&&H.push(v)}),typeof T=="function"&&o.push(T),typeof F=="function"&&l.push(F),n.current=k}),Object.entries(r).forEach(([u,d])=>{d.length>0&&(n.current[u]=(x,f)=>d.reduce((p,i)=>i(p,f),x))}),o.length>0&&(n.current.rowClassName=(u,d)=>B(...o.map(x=>x(u,d)))),l.length>0&&(n.current.onRow=(u,d)=>l.reduce((x,f)=>({...x,...f(u,d)}),{})),n.current}};ee(J,"defaultPipeline",new J);let V=J;function Tt(e){const{use:t,pipeline:n}=e,r=s.useMemo(()=>({current:new V}),[]);if(t!=null){const o=dt([...t,...(n==null?void 0:n.hooks)??[]]);if(!q(r.current.hooks,o)){const l=new V;return l.setHooks(o),r.current=l,l}}return r.current}function oe(e,t){let n=-1;for(let r=0;r<e.length;r+=1)t(e[r],r)&&(n=r);return n}function ft(e){const{className:t,rowIndex:n,rowData:r,columns:o,onRow:l,renderRow:a,renderCell:u,...d}=e,{updateRowHeight:x}=ut(),{columns:f,descriptor:p}=o,i=oe(p,h=>h.type==="blank"?!1:K(h.column.fixed)),m=p.findIndex(h=>h.type==="blank"?!1:P(h.column.fixed)),{className:C,...S}=(l==null?void 0:l(r,n))??{};return D(g.jsx("tr",{...d,...S,className:B("virtual-table-row",t,C),ref:h=>{h!=null&&x(n,h.offsetHeight)},children:p.map((h,w)=>{const{key:L}=h;if(h.type==="blank")return g.jsx("td",{},L);const{column:M}=h;return g.jsx(nt,{className:B(i===w&&"virtual-table-cell-fix-left-last",m===w&&"virtual-table-cell-fix-right-first"),column:M,rowIndex:n,rowData:r,columnIndex:w,renderCell:u},L)})}),a,{columns:f,rowIndex:n,rowData:r,columnDescriptor:p})}const ht=s.memo(ft);function pt(e,t){typeof e=="function"?e(t):typeof e=="object"&&e!==null&&"current"in e&&(e.current=t)}function mt(...e){return t=>{e.forEach(n=>pt(n,t))}}function Q(...e){return s.useCallback(mt(...e),e)}function yt(e){const{bodyWrapperRef:t,bodyRootRef:n,bodyRef:r,className:o,style:l,dataSource:a,columns:u,rowKey:d,startIndex:x,rowClassName:f,onRow:p,renderBodyWrapper:i,renderBodyRoot:m,renderBody:C,renderRow:S,renderCell:h}=e,{columns:w,descriptor:L}=u,{listen:M,notify:E}=re(),{widthList:N,setWidthList:T}=ne(),F=s.useRef(new Map);s.useLayoutEffect(()=>{const R=N,c=[...R.keys()],b=[...F.current.keys()],y=[...R.values()],z=[...F.current.values()];(!q(c,b)||!q(y,z))&&T(new Map(F.current))});const k=D(g.jsx("tbody",{ref:r,children:a.map((R,c)=>{const b=R[d];return g.jsx(ht,{className:B(f==null?void 0:f(R,c)),rowIndex:c+x,rowData:R,columns:u,onRow:p,renderRow:S,renderCell:h},b)})}),C,{columns:w,columnDescriptor:L}),W=D(g.jsxs("table",{className:B(o,"virtual-table-body"),style:l,ref:n,children:[g.jsx(we,{columns:L,colRef:(R,c)=>{if(R==null)return;const b=_(c);F.current.set(b,R.offsetWidth)}}),k]}),m,{columns:w,columnDescriptor:L}),H=s.useRef(null);s.useEffect(()=>{const R=H.current;if(R==null)return;const c="virtual-table-body",b=()=>{const z=R.scrollLeft;E(c,z)},y=M(c,z=>{R.scrollLeft=z});return R.addEventListener("scroll",b),()=>{R.removeEventListener("scroll",b),y()}},[M,E]);const v=Q(H,t);return D(g.jsx("div",{ref:v,className:"virtual-table-body-wrapper",children:W}),i,{columns:w,columnDescriptor:L})}const xt=e=>{const{className:t,style:n,wrapperRef:r,columns:o,stickyHeader:l,renderHeaderWrapper:a,renderHeaderRoot:u,renderHeader:d,renderHeaderRow:x,renderHeaderCell:f}=e,{columns:p,descriptor:i}=o,{widthList:m}=ne(),{size:C}=ge(),S=oe(i,k=>k.type==="blank"?!1:K(k.column.fixed)),h=i.findIndex(k=>k.type==="blank"?!1:P(k.column.fixed)),{listen:w,notify:L}=re(),M=s.useRef(null);s.useEffect(()=>{const k=M.current;if(k==null)return;const W="virtual-table-header",H=()=>{const R=k.scrollLeft;L(W,R)},v=w(W,R=>{k.scrollLeft=R});return k.addEventListener("scroll",H),()=>{k.removeEventListener("scroll",H),v()}},[w,L]);const E=D(g.jsx("tr",{children:i.map((k,W)=>{var y;const{key:H}=k;if(k.type==="blank")return g.jsx("th",{},H);const{column:v}=k;if(v.colSpan===0)return null;const{className:R,style:c,...b}=((y=v.onHeaderCell)==null?void 0:y.call(v,v,W))??{};return g.jsx(s.Fragment,{children:D(s.createElement("th",{scope:"col",...b,colSpan:v.colSpan,className:B("virtual-table-header-cell",v.align!=null&&`virtual-table-align-${v.align}`,me(v.fixed)&&"virtual-table-sticky-cell",S===W&&"virtual-table-cell-fix-left-last",h===W&&"virtual-table-cell-fix-right-first",v.className,R),style:{...c,left:K(v.fixed)?C.get(H):void 0,right:P(v.fixed)?C.get(H):void 0}},v.title),f,{column:v,columns:p,columnIndex:W,columnWidths:m,columnDescriptor:i})},H)})}),x,{columns:p,columnDescriptor:i}),N=D(g.jsx("thead",{className:"virtual-table-thead",children:E}),d,{columns:p,columnDescriptor:i}),T=D(g.jsxs("table",{style:n,children:[g.jsx(we,{columns:i}),N]}),u,{columns:p,columnDescriptor:i}),F=Q(r,M);return D(g.jsx("div",{ref:F,className:B("virtual-table-header",t,{"virtual-table-header-sticky":l}),style:{top:Number.isFinite(l)?l:void 0},children:T}),a,{columns:p,columnDescriptor:i})};function se(e,t){if(Z(e)){const n=()=>{t({width:window.innerWidth,height:window.innerHeight})};return n(),window.addEventListener("resize",n),()=>{window.removeEventListener("resize",n)}}else{const n=new ResizeObserver(r=>{const o=r[0].contentRect;t({width:o.width,height:o.height})});return n.observe(e),()=>{n.disconnect()}}}function gt(e,t){let n=0,r=e.length-1,o=-1;for(;n<=r;){const l=Math.floor((n+r)/2);e[l].right>t?(o=l,r=l-1):n=l+1}if(o!==-1)return e[o]}function wt(e){let t=-1;for(let n=e.length-1;n>=0;n--){const r=e[n];if(P(r.fixed))t=n;else break}return t}function Rt(e){return oe(e,t=>K(t.fixed))}function bt(e){const{estimateSize:t,overscan:n,columns:r,getScroller:o,bodyWrapper:l,columnWidths:a,disabled:u=!1}=e,d=Rt(r),x=wt(r),f=d>-1?_(r[d]):null,p=x>-1?_(r[x]):null,[i,m]=s.useState(0),[C,S]=s.useState(0),h=s.useMemo(()=>{if(u)return[];let c=0;return r.map((b,y)=>{const z=_(b),A=a.get(z)??t,Y=c+A,I={index:y,width:A,left:c,right:Y};return c=Y,I})},[r,a,t,u]),w=s.useRef({index:0,width:t,left:0,right:t}),L=te(c=>gt(h,c)),M=te((c,b)=>{const y=L(c);y!=null&&(w.current=y,m(Math.max(0,y.index-n)),S(y.index+b+n))}),E=s.useRef(0);s.useEffect(()=>{if(u)return;const c=l.current;if(c==null)return;const b=c.offsetWidth;let y=Math.ceil(b/t);const z=()=>{const I=c.scrollLeft;I>E.current?I>w.current.right&&M(I,y):I<w.current.left&&M(I,y),E.current=I};c.addEventListener("scroll",z);let A=0;const Y=se(c,({width:I})=>{if(I===A||I===0)return;A=I;const U=c.scrollLeft;y=Math.ceil(I/t),M(U,y)});return()=>{c.removeEventListener("scroll",z),Y()}},[o,l,t,M,n,L,u]);const N=(c,b)=>h.slice(c,b).reduce((y,z)=>y+z.width,0),T=d>-1?N(0,d+1):0,F=x>-1?N(x):0,k=Math.max(0,N(0,i)-T),W=Math.max(0,N(C)-F),H=s.useMemo(()=>{if(u)return r;const c=[...r.slice(0,d+1),...r.slice(i,C),...r.slice(x)],b=new Set;return c.filter(y=>{const z=_(y);return b.has(z)?!1:(b.add(z),!0)})},[u,r,i,C,d,x]),v=s.useMemo(()=>H.reduce((c,b)=>{const y=_(b);return y===f?(c.push({key:y,type:"normal",column:b}),c.push({key:"_blank_left",type:"blank",width:k})):y===p?(c.push({key:"_blank_right",type:"blank",width:W}),c.push({key:y,type:"normal",column:b})):c.push({key:y,type:"normal",column:b}),c},[]),[H,f,p,k,W]);return{columns:s.useMemo(()=>({columns:H,descriptor:v}),[H,v]),columnSlice:H,lastFixedLeftIndex:d,firstFixedRightIndex:x}}function Ct(e){const{itemCount:t,estimateSize:n,onChange:r}=e,o=s.useRef([]);(()=>{for(let f=0;f<t;f+=1)o.current[f]==null&&(o.current[f]=n);o.current=o.current.slice(0,t)})();const a=s.useRef([]),u=()=>{const f=[];let p=0;o.current.forEach((i,m)=>{m!==0&&(p+=i),f.push({index:m,height:i,top:p,bottom:p+i})}),a.current=f},d=te((f,p)=>{o.current[f]=p,u(),r==null||r(f,p,a.current)});return{rowHeightList:o,updateRowHeight:d,sum:(f,p)=>o.current.slice(f,p).reduce((i,m)=>i+m,0),rects:s.useCallback(()=>a.current,[])}}function St(e,t){let n=0,r=e.length-1,o=-1;for(;n<=r;){const l=Math.floor((n+r)/2);e[l].bottom>t?(o=l,r=l-1):n=l+1}if(o!==-1)return e[o]}function vt(e){const{getOffsetTop:t,dataSource:n,getScroller:r,estimateSize:o,overscan:l}=e,[a,u]=s.useState(0),[d,x]=s.useState(0),f=s.useRef({index:0,height:o,top:0,bottom:o}),{rowHeightList:p,rects:i,updateRowHeight:m,sum:C}=Ct({itemCount:n.length,estimateSize:o,onChange(E,N,T){f.current.index===E&&(f.current=T[E])}}),S=s.useRef(0),h=s.useRef(!1);s.useEffect(()=>{const E=r();if(E==null)return;let N=0;const T=()=>{const R=t();let c=0;return Z(E)||be(E)?c=window.scrollY:c=fe(E).scrollTop,Math.max(c-R,0)},F=R=>{const c=N;return N=Math.ceil(R/o),{prevCount:c}},k=R=>{const c=St(i(),R);c!=null&&(f.current=c,u(Math.max(0,c.index-l)),x(c.index+N+l))},W=R=>{const c=t(),b=fe(R.target),y=Math.max(0,b.scrollTop-c);y>S.current?y>f.current.bottom&&k(y):y<f.current.top&&k(y),S.current=y};let H=0;const v=se(E,R=>{if(R.height===H||R.height===0)return;H=R.height,F(R.height);const c=T();if(h.current)k(c);else{h.current=!0;let b=0;c>=o&&(b=Math.max(Math.floor(c/o)-1-l,0));const y=b+N+l;u(b),x(y)}});return E.addEventListener("scroll",W),()=>{v(),E.removeEventListener("scroll",W)}},[o,t,r,l,i]);const w=C(0,a),L=C(d),M=s.useMemo(()=>n.slice(a,d),[n,a,d]);return{startIndex:a,endIndex:d,rowHeightList:p,updateRowHeight:m,topBlank:w,bottomBlank:L,dataSlice:M}}function kt(e,t){const{className:n,style:r,children:o,hasFixedLeftColumn:l,hasFixedRightColumn:a,renderRoot:u,bodyScrollContainer:d}=e,x=s.useRef(null),[f,p]=s.useState(!1),[i,m]=s.useState(!1);s.useEffect(()=>{const S=d.current;if(S==null)return;const h=()=>{const{scrollLeft:w,clientWidth:L,scrollWidth:M}=S;l&&p(w!==0),a&&m(!(w+L>=M))};return h(),S.addEventListener("scroll",h),()=>{S.removeEventListener("scroll",h)}},[d,l,a]);const C=Q(t,x);return D(g.jsx("div",{ref:C,className:B("virtual-table",f&&"virtual-table-has-fix-left",i&&"virtual-table-has-fix-right",n),style:r,children:o}),u,{})}const Ht=s.forwardRef(kt);function Et(e,t){const{bodyRootRef:n,className:r,style:o,tableBodyClassName:l,tableBodyStyle:a,columns:u,dataSource:d,rowKey:x="key",estimatedRowHeight:f=46,estimatedColumnWidth:p,overscanRows:i=5,overscanColumns:m=3,stickyHeader:C,pipeline:S=V.defaultPipeline,rowClassName:h,onRow:w,getOffsetTop:L,virtualHeader:M=!1}=e,E=s.useRef(null),N=s.useRef(null),T=s.useRef(null),F=s.useRef(null),k=Q(F,n),W=s.useRef(null),H=s.useCallback(()=>{const j=E.current;if(j!=null)return ot(j)},[]),v=s.useCallback(()=>{var O,ue;if(typeof L=="function")return L();const j=H();if(j===E.current)return 0;if(Z(j)||be(j)){const Xe=((O=E.current)==null?void 0:O.getBoundingClientRect().top)??0;return window.scrollY+Xe}return((ue=E.current)==null?void 0:ue.offsetTop)??0},[L,H]),{dataSource:R,columns:c,rowKey:b,rowClassName:y,render:z,renderRoot:A,renderContent:Y,renderHeaderWrapper:I,renderHeaderRoot:U,renderHeader:ke,renderHeaderRow:He,renderHeaderCell:Ee,renderBodyWrapper:Le,renderBodyRoot:je,renderBody:Me,renderRow:We,renderCell:Ne,onRow:X}=S.use({dataSource:d,rowKey:x,columns:u,estimatedRowHeight:f,headerWrapperRef:N,bodyWrapperRef:T,bodyRootRef:F,bodyRef:W,rootRef:E,getOffsetTop:v,getScroller:H}),[G,ze]=s.useState(()=>new Map),Te=s.useRef(G),Fe=j=>{Te.current=j,ze(j)},Ie=s.useMemo(()=>({widthList:G,setWidthList:Fe}),[G]),{startIndex:De,dataSlice:Be,updateRowHeight:le,rowHeightList:ce,topBlank:Oe,bottomBlank:_e}=vt({getOffsetTop:v,dataSource:R,getScroller:H,estimateSize:f,overscan:i}),{columns:$}=bt({estimateSize:p??100,overscan:m,columns:c,getScroller:H,bodyWrapper:T,columnWidths:G,disabled:p==null}),Ke=s.useCallback((j,O)=>B(h==null?void 0:h(j,O),y==null?void 0:y(j,O)),[h,y]),Pe=s.useCallback((j,O)=>({...w==null?void 0:w(j,O),...X==null?void 0:X(j,O)}),[X,w]),Ae=c.some(j=>K(j.fixed)),$e=c.some(j=>P(j.fixed)),Ye=s.useMemo(()=>({getRowHeightList(){return ce.current},updateRowHeight:le}),[ce,le]),ie=s.useMemo(()=>({columns:c,descriptor:c.map(j=>({key:_(j),type:"normal",column:j}))}),[c]),qe=s.useMemo(()=>M?$:ie,[M,ie,$]),Ve=D(g.jsxs(g.Fragment,{children:[g.jsx(xt,{wrapperRef:N,columns:qe,stickyHeader:C,renderHeaderWrapper:I,renderHeaderRoot:U,renderHeader:ke,renderHeaderRow:He,renderHeaderCell:Ee}),g.jsx(yt,{bodyWrapperRef:T,bodyRootRef:k,bodyRef:W,className:l,style:{...a,paddingBottom:_e,paddingTop:Oe},columns:$,rowKey:b,dataSource:Be,startIndex:De,rowClassName:Ke,onRow:Pe,renderBodyWrapper:Le,renderBodyRoot:je,renderBody:Me,renderRow:We,renderCell:Ne})]}),Y,{columns:$.columns,columnDescriptor:$.descriptor}),Qe=Q(E,t),Ue=D(g.jsx(Ht,{ref:Qe,className:r,style:o,hasFixedLeftColumn:Ae,hasFixedRightColumn:$e,renderRoot:A,bodyScrollContainer:T,children:Ve}),z,{columns:$.columns,columnDescriptor:$.descriptor});return g.jsx(ve.Provider,{value:Ye,children:g.jsx(ye.Provider,{value:Ie,children:g.jsx(Ze,{columns:c,children:g.jsx(ct,{getScroller:H,root:E,children:g.jsx(it,{children:Ue})})})})})}const Ft=s.memo(s.forwardRef(Et));function Lt(){const e=document.createElement("div");e.style.position="absolute",e.style.width="100px",e.style.height="100px",e.style.overflow="scroll",e.style.top="-9999px",document.body.appendChild(e);const t=e.offsetWidth-e.clientWidth,n=e.offsetHeight-e.clientHeight;return document.body.removeChild(e),{width:t,height:n}}const jt=e=>{const{className:t,style:n,bottom:r,zIndex:o,bodyRef:l}=e,{listen:a,notify:u}=re(),d=s.useRef(null);s.useEffect(()=>{const i=d.current;if(i==null)return;const m="virtual-table-sticky-bottom-scroll",C=()=>{const h=i.scrollLeft;u(m,h)},S=a(m,h=>{i.scrollLeft=h});return i.addEventListener("scroll",C),()=>{i.removeEventListener("scroll",C),S()}},[a,u]);const[x,f]=s.useState(0);s.useEffect(()=>{const i=l.current;if(i!=null)return se(i,({width:m})=>{m!==0&&f(m)})},[l]);const[p]=s.useState(Lt);return g.jsx("div",{className:B("virtual-table-sticky-scroll",t),style:{...n,paddingTop:p.height>0?0:12,marginTop:p.height>0?0:p.height*-1,height:p.height,bottom:r,zIndex:o},ref:d,children:g.jsx("div",{className:"virtual-table-sticky-scroll-bar",style:{width:x}})})};function Mt(e,t){const{bodyRootRef:n}=e;return{...e,renderContent(r){return g.jsxs(g.Fragment,{children:[r,g.jsx(jt,{bodyRef:n,...t})]})}}}const It=at(Mt);export{we as C,Ft as V,at as a,zt as b,B as c,ut as d,de as e,te as f,_ as g,It as h,me as i,re as j,Lt as k,ge as l,K as m,P as n,se as o,Q as p,Tt as u};
