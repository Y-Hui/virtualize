import{r as x,j as s}from"./index-D02jlKD5.js";import{V as w}from"./index-CDvkcosI.js";import{a as g,S as j,B as m,I as o}from"./mock-igQNYeIl.js";import{R as f,a as I,T as i}from"./MinusOutlined-CtqfeUBz.js";import"./table-selection-BCHMmNaL.js";import"./Table-CnF49Uy6.js";const b=()=>{const[c,l]=g(),h=x.useMemo(()=>({fixed:"left",rowExpandable:()=>!0,expandedRowRender(n){return n.name}}),[]),u=c.length===1,p=x.useMemo(()=>[{title:"",key:"prefix-action",width:80,fixed:"left",render(n,d,t){return s.jsxs(j,{children:[s.jsx(m,{icon:s.jsx(f,{}),size:"small",shape:"circle",color:"primary",variant:"outlined",onClick:()=>{l(r=>{const a=r.slice();return a.splice(t+1,0,{key:`key:${Date.now()}`}),a})}}),s.jsx(m,{icon:s.jsx(I,{}),size:"small",shape:"circle",danger:!0,disabled:u,onClick:()=>{l(r=>{const a=r.slice();return a.splice(t,1),a})}})]})}},{title:"Name",dataIndex:"name",key:"name",width:200,render:(n,d,t)=>s.jsx(o,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],name:r.currentTarget.value},e})}})},{title:"Data1",dataIndex:"data1",width:200,render:(n,d,t)=>s.jsx(i,{className:"w-full",value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data1:r},e})}})},{title:"Data2",dataIndex:"data2",width:200,render:(n,d,t)=>s.jsx(i,{className:"w-full",value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data2:r},e})}})},{title:"Data3",dataIndex:"data3",width:200,render:(n,d,t)=>s.jsx(i,{className:"w-full",value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data3:r},e})}})},{title:"Data4",dataIndex:"data4",width:200,render:(n,d,t)=>s.jsx(o,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data4:r.currentTarget.value},e})}})},{title:"Data5",dataIndex:"data5",width:200,render:(n,d,t)=>s.jsx(o,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data5:r.currentTarget.value},e})}})},{title:"Data6",dataIndex:"data6",width:200,fixed:"right",render:(n,d,t)=>s.jsx(o,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data6:r.currentTarget.value},e})}})},{title:"Data7",dataIndex:"data7",width:200,fixed:"right",render:(n,d,t)=>s.jsx(o,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data7:r.currentTarget.value},e})}})}],[u,l]);return s.jsxs("div",{style:{padding:16},children:[s.jsx("h2",{children:"Expandable"}),s.jsx(w,{rowKey:"key",dataSource:c,columns:p,estimatedRowHeight:57,expandable:h,sticky:!0})]})};export{b as default};
