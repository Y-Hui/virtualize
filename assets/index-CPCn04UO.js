import{r as f,j as c,p as z}from"./index-CXSDek4R.js";import{c as I,a as O,u as w,h as A,V}from"./index-B76kBUwf.js";import{t as L}from"./table-selection-B1ER4u_C.js";import{t as F,c as $,b as D,d as H,a as K}from"./index-uqUZSGlX.js";import{P as B,F as E,C as j,D as M}from"./Table-Cl_vXdND.js";import{y as U,R as W,E as P}from"./index-DvNgDXOm.js";const G=t=>{const{position:r,className:u,defaultCurrent:o=1,defaultPageSize:a=10,onChange:e,current:n,pageSize:g,...l}=t,p=((r==null?void 0:r[0])??"bottomRight").toLowerCase().replace(/top|bottom/,""),s="current"in t,i="pageSize"in t,[m,S]=f.useState(o),[d,h]=f.useState(a),b=s?n:m,y=i?g:d,N=(k,T)=>{s||S(k),i||h(T),e==null||e(k,T)};return c.jsx(B,{showSizeChanger:!0,...l,current:b,pageSize:y,className:I("virtual-table-pagination",`virtual-table-pagination-${p}`,u),onChange:N})},Y=f.memo(G);function q(t,r){if(r===!1)return t;const{position:u=["bottomRight"],...o}=r??{},a=u[0];return a==="none"?t:{...t,render(e){const n=f.createElement(Y,{...o,key:"__pagination__"});return a.includes("top")?c.jsxs(c.Fragment,{children:[n,e]}):c.jsxs(c.Fragment,{children:[e,n]})}}}const J=O(q),R=[E.SELECTION_ALL,E.SELECTION_INVERT,E.SELECTION_NONE];function Q(t){const{checked:r,onChange:u,indeterminate:o,selections:a,onClear:e,onSelectAll:n,onSelectInvert:g,allKeys:l,disabled:C}=t,{locale:p}=f.useContext(z.ConfigContext),s=p==null?void 0:p.Table,i={[E.SELECTION_ALL]:{key:E.SELECTION_ALL,label:s==null?void 0:s.selectAll,onClick:n},[E.SELECTION_INVERT]:{key:E.SELECTION_INVERT,label:s==null?void 0:s.selectInvert,onClick:g},[E.SELECTION_NONE]:{key:E.SELECTION_NONE,label:s==null?void 0:s.selectNone,onClick:e}},m=a===!0?R:Array.isArray(a)?a:void 0;return c.jsxs("div",{className:I("virtual-table-selection"),children:[c.jsx(j,{checked:r,indeterminate:o,disabled:C,onChange:u}),m&&c.jsx("div",{className:"virtual-table-selection-extra",children:c.jsx(M,{menu:{items:m.reduce((S,d)=>(typeof d=="string"?R.includes(d)&&S.push(i[d]):"key"in d&&S.push({key:d.key,label:d.text,onClick:()=>{var h;(h=d.onSelect)==null||h.call(d,l)}}),S),[])},children:c.jsx(U,{})})})]})}function X(t){if(t==null)return L();const{type:r,selections:u,columnWidth:o,columnTitle:a,...e}=t,n=r==="checkbox";return L({...e,component:Z,multiple:n,columnWidth:o??(u==null||!n?32:48),columnTitle:u!=null?(g,l)=>{if(a!=null){if(f.isValidElement(a))return a;if(typeof a=="function")return a(g,l)}return n?c.jsx(Q,{checked:l.value,indeterminate:l.indeterminate,disabled:l.disabled,onChange:C=>{var p;(p=l.onChange)==null||p.call(l,C.target.checked,C.nativeEvent)},onSelectAll:l.onSelectAll,onSelectInvert:l.onSelectInvert,onClear:l.onClear,allKeys:l.allKeys,selections:u}):null}:void 0})}function Z(t){const{multiple:r,value:u,onChange:o,indeterminate:a,disabled:e}=t;return r?c.jsx(j,{checked:u,indeterminate:a,disabled:e,onChange:n=>o==null?void 0:o(n.target.checked,n.nativeEvent)}):c.jsx(W,{checked:u,disabled:e,onChange:n=>o==null?void 0:o(n.target.checked,n.nativeEvent)})}function ee(t,r){if(typeof r=="number"&&Number.isFinite(r))return r;switch(t){case"small":return 39;case"large":return 65;case"middle":default:return 57}}const ne={disableResize:!0};function te(t,r){const{className:u,size:o="middle",estimatedRowHeight:a,sticky:e,rowSelection:n,loading:g,bordered:l,pipeline:C,expandable:p,summary:s,pagination:i=!1,onChange:m,storageKey:S,scrollBarBottom:d,...h}=t,b=f.useRef({});f.useEffect(()=>{i!=null&&typeof i=="object"&&(b.current={...i,current:b.current.current??i.current,pageSize:b.current.pageSize??i.pageSize})},[i]);const y=f.useCallback(()=>{m==null||m(b.current)},[m]),N=i===!1||i==null?void 0:i.onChange,k=f.useCallback((v,_)=>{N==null||N(v,_),b.current={...b.current,current:v,pageSize:_},y()},[y,N]),T=w({pipeline:C,use:[X(n==null?void 0:{...n,extraColumnProps:ne}),F(p),$(S==null?void 0:{storageKey:S}),J(i===!1?!1:{...i,onChange:k}),{priority:200,hook:D({loading:g})},{priority:200,hook:H({children:c.jsx(P,{image:P.PRESENTED_IMAGE_SIMPLE})})},{priority:200,hook:K(s==null?void 0:{summary:s})},{priority:200,hook:A({bottom:d})}]}),x=ee(o,a);return c.jsx(V,{...h,pipeline:T,className:I(`virtual-table-${o}`,l&&"virtual-table-bordered",u),ref:r,estimatedRowHeight:x,stickyHeader:typeof e=="boolean"?e:e==null?void 0:e.offsetHeader})}const ce=f.forwardRef(te);export{ce as V};
