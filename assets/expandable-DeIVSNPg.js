import{r as x,j as s}from"./index-Co7I6O8j.js";import{a as p,S as g,B as h,I as d,V as j}from"./mock-BoNcC9KC.js";import{R as f,a as y,T as i}from"./MinusOutlined-m1I0nwu9.js";const v=()=>{const[c,l]=p(),w=x.useMemo(()=>({fixed:"left",rowExpandable:()=>!0,expandedRowRender(n){return n.name}}),[]),u=c.length===1,m=x.useMemo(()=>[{title:"",key:"prefix-action",width:80,fixed:"left",render(n,o,t){return s.jsxs(g,{children:[s.jsx(h,{icon:s.jsx(f,{}),size:"small",shape:"circle",color:"primary",variant:"outlined",onClick:()=>{l(r=>{const a=r.slice();return a.splice(t+1,0,{key:`key:${Date.now()}`}),a})}}),s.jsx(h,{icon:s.jsx(y,{}),size:"small",shape:"circle",danger:!0,disabled:u,onClick:()=>{l(r=>{const a=r.slice();return a.splice(t,1),a})}})]})}},{title:"Name",dataIndex:"name",key:"name",width:200,render:(n,o,t)=>s.jsx(d,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],name:r.currentTarget.value},e})}})},{title:"Data1",dataIndex:"data1",width:200,render:(n,o,t)=>s.jsx(i,{className:"w-full",value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data1:r},e})}})},{title:"Data2",dataIndex:"data2",width:200,render:(n,o,t)=>s.jsx(i,{className:"w-full",value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data2:r},e})}})},{title:"Data3",dataIndex:"data3",width:200,render:(n,o,t)=>s.jsx(i,{className:"w-full",value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data3:r},e})}})},{title:"Data4",dataIndex:"data4",width:200,render:(n,o,t)=>s.jsx(d,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data4:r.currentTarget.value},e})}})},{title:"Data5",dataIndex:"data5",width:200,render:(n,o,t)=>s.jsx(d,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data5:r.currentTarget.value},e})}})},{title:"Data6",dataIndex:"data6",width:200,fixed:"right",render:(n,o,t)=>s.jsx(d,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data6:r.currentTarget.value},e})}})},{title:"Data7",dataIndex:"data7",width:200,fixed:"right",render:(n,o,t)=>s.jsx(d,{value:n,onChange:r=>{l(a=>{const e=a.slice();return e[t]={...e[t],data7:r.currentTarget.value},e})}})}],[u,l]);return s.jsxs("div",{style:{padding:16},children:[s.jsx("h2",{children:"Expandable"}),s.jsx("div",{style:{boxSizing:"border-box",height:500,border:"1px solid #f00",overflow:"auto",overscrollBehavior:"contain"},children:s.jsx(j,{rowKey:"key",dataSource:c,columns:m,estimatedRowHeight:57,expandable:w,sticky:!0})})]})};export{v as default};