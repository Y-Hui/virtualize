import{r as d,j as n}from"./index-CF_IaDcW.js";import{u as g,V as p}from"./table-CWpMdFKl.js";import{c as j}from"./index-BtHO5Fnu.js";import{b as f,S as I,B as u,I as i}from"./mock-DBoiK4Ma.js";import{R as y,a as v,T as c}from"./MinusOutlined-Z8y8C6Sf.js";const b=()=>{const[h,o]=f(),x=g({use:[j({storageKey:"misc"})]}),m=d.useMemo(()=>[{title:"Index",dataIndex:"key",width:56,align:"center",fixed:"left",render(r,l,t){return t}},{title:"",key:"prefix-action",width:80,fixed:"left",render(r,l,t){return n.jsxs(I,{children:[n.jsx(u,{icon:n.jsx(y,{}),size:"small",shape:"circle",color:"primary",variant:"outlined",onClick:()=>{o(s=>{const a=s.slice();return a.splice(t+1,0,{key:`key:${Date.now()}`}),a})}}),n.jsx(u,{icon:n.jsx(v,{}),size:"small",shape:"circle",danger:!0,onClick:()=>{o(s=>{const a=s.slice();return a.splice(t,1),a})}})]})}},{title:"Name",dataIndex:"name",key:"name",width:200,render:(r,l,t)=>n.jsx(i,{value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],name:s.currentTarget.value},e})}})},{title:"Data1",dataIndex:"data1",width:200,render:(r,l,t)=>n.jsx(c,{className:"w-full",value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data1:s},e})}})},{title:"Data2",dataIndex:"data2",width:200,render:(r,l,t)=>n.jsx(c,{className:"w-full",value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data2:s},e})}})},{title:"Data3",dataIndex:"data3",width:200,render:(r,l,t)=>n.jsx(c,{className:"w-full",value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data3:s},e})}})},{title:"Data4",dataIndex:"data4",width:200,render:(r,l,t)=>n.jsx(i,{value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data4:s.currentTarget.value},e})}})},{title:"Data5",dataIndex:"data5",width:200,render:(r,l,t)=>n.jsx(i,{value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data5:s.currentTarget.value},e})}})},{title:"Data6",dataIndex:"data6",width:200,render:(r,l,t)=>n.jsx(i,{value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data6:s.currentTarget.value},e})}})},{title:"Data7",dataIndex:"data7",width:200,render:(r,l,t)=>n.jsx(i,{value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data7:s.currentTarget.value},e})}})},{title:"Data8",dataIndex:"data8",width:200,render:(r,l,t)=>n.jsx(i,{value:r,onChange:s=>{o(a=>{const e=a.slice();return e[t]={...e[t],data8:s.currentTarget.value},e})}})}],[o]),w=d.useMemo(()=>({selections:!0,onChange(r,l,t){console.log({selectedRowKeys:r,selectedRows:l,info:t})}}),[]);return n.jsxs("div",{style:{padding:"0 12px"},children:[n.jsx("h2",{children:"Misc"}),n.jsx("div",{style:{boxSizing:"border-box",height:500,border:"1px solid #f00",overflow:"auto",overscrollBehavior:"contain"},children:n.jsx(p,{rowKey:"key",dataSource:h,columns:m,estimatedRowHeight:57,sticky:!0,rowSelection:w,pipeline:x})})]})};export{b as default};