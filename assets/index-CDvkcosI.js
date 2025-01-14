import{r as p,j as c,C as O}from"./index-D02jlKD5.js";import{c as T,a as w,t as L,u as x,b as z,d as A,e as V,f as F,g as D,h as H,V as $}from"./table-selection-BCHMmNaL.js";import{P as K,F as b,C as P,D as M}from"./Table-CnF49Uy6.js";import{b as U,R as W,E as j}from"./mock-igQNYeIl.js";const B=n=>{const{position:t,className:u,defaultCurrent:l=1,defaultPageSize:r=10,onChange:e,current:a,pageSize:m,...o}=n,E=((t==null?void 0:t[0])??"bottomRight").toLowerCase().replace(/top|bottom/,""),i="current"in n,s="pageSize"in n,[S,g]=p.useState(l),[d,f]=p.useState(r),N=i?a:S,h=i?m:d,k=(v,y)=>{i||g(v),s||f(y),e==null||e(v,y)};return c.jsx(K,{showSizeChanger:!0,...o,current:N,pageSize:h,className:T("virtual-table-pagination",`virtual-table-pagination-${E}`,u),onChange:k})};function G(n,t){if(t===!1)return n;const{position:u=["bottomRight"],...l}=t??{},r=u[0];return r==="none"?n:{...n,render(e){const a=p.createElement(B,{...l,key:"__pagination__"});return r.includes("top")?c.jsxs(c.Fragment,{children:[a,e]}):c.jsxs(c.Fragment,{children:[e,a]})}}}const Y=w(G),R=[b.SELECTION_ALL,b.SELECTION_INVERT,b.SELECTION_NONE];function q(n){const{checked:t,onChange:u,indeterminate:l,selections:r,onClear:e,onSelectAll:a,onSelectInvert:m,allKeys:o,disabled:C}=n,{locale:E}=p.useContext(O.ConfigContext),i=E==null?void 0:E.Table,s={[b.SELECTION_ALL]:{key:b.SELECTION_ALL,label:i==null?void 0:i.selectAll,onClick:a},[b.SELECTION_INVERT]:{key:b.SELECTION_INVERT,label:i==null?void 0:i.selectInvert,onClick:m},[b.SELECTION_NONE]:{key:b.SELECTION_NONE,label:i==null?void 0:i.selectNone,onClick:e}},S=r===!0?R:Array.isArray(r)?r:void 0;return c.jsxs("div",{className:T("virtual-table-selection"),children:[c.jsx(P,{checked:t,indeterminate:l,disabled:C,onChange:u}),S&&c.jsx("div",{className:"virtual-table-selection-extra",children:c.jsx(M,{menu:{items:S.reduce((g,d)=>(typeof d=="string"?R.includes(d)&&g.push(s[d]):"key"in d&&g.push({key:d.key,label:d.text,onClick:()=>{var f;(f=d.onSelect)==null||f.call(d,o)}}),g),[])},children:c.jsx(U,{})})})]})}function J(n){if(n==null)return L();const{type:t,selections:u,columnWidth:l,columnTitle:r,...e}=n,a=t==="checkbox";return L({...e,component:Q,multiple:a,columnWidth:l??(u==null||!a?32:48),columnTitle:u!=null?(m,o)=>{if(r!=null){if(p.isValidElement(r))return r;if(typeof r=="function")return r(m,o)}return a?c.jsx(q,{checked:o.value,indeterminate:o.indeterminate,disabled:o.disabled,onChange:C=>{var E;(E=o.onChange)==null||E.call(o,C.target.checked,C.nativeEvent)},onSelectAll:o.onSelectAll,onSelectInvert:o.onSelectInvert,onClear:o.onClear,allKeys:o.allKeys,selections:u}):null}:void 0})}function Q(n){const{multiple:t,value:u,onChange:l,indeterminate:r,disabled:e}=n;return t?c.jsx(P,{checked:u,indeterminate:r,disabled:e,onChange:a=>l==null?void 0:l(a.target.checked,a.nativeEvent)}):c.jsx(W,{checked:u,disabled:e,onChange:a=>l==null?void 0:l(a.target.checked,a.nativeEvent)})}function X(n,t){if(typeof t=="number"&&Number.isFinite(t))return t;switch(n){case"small":return 39;case"large":return 65;case"middle":default:return 57}}function Z(n,t){const{className:u,size:l="middle",estimatedRowHeight:r,sticky:e,rowSelection:a,loading:m,bordered:o,pipeline:C,expandable:E,summary:i,pagination:s,onChange:S,storageKey:g,...d}=n,f=p.useRef({});p.useEffect(()=>{s!=null&&typeof s=="object"&&(f.current={...s,current:f.current.current??s.current,pageSize:f.current.pageSize??s.pageSize})},[s]);const N=p.useCallback(()=>{S==null||S(f.current)},[S]),h=s===!1||s==null?void 0:s.onChange,k=p.useCallback((I,_)=>{h==null||h(I,_),f.current={...f.current,current:I,pageSize:_},N()},[N,h]),v=x({pipeline:C,use:[J(a),z(E),A(g==null?void 0:{storageKey:g}),Y(s===!1?!1:{...s,onChange:k}),{priority:200,hook:V({loading:m})},{priority:200,hook:F({children:c.jsx(j,{image:j.PRESENTED_IMAGE_SIMPLE})})},{priority:200,hook:D(i==null?void 0:{summary:i})},{priority:200,hook:H()}]}),y=X(l,r);return c.jsx($,{...d,pipeline:v,className:T(`virtual-table-${l}`,o&&"virtual-table-bordered",u),ref:t,estimatedRowHeight:y,stickyHeader:typeof e=="boolean"?e:e==null?void 0:e.offsetHeader})}const ae=p.forwardRef(Z);export{ae as V};
