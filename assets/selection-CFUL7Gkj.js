import{r as h,j as s}from"./index-BAwjQ-7c.js";import{V as g}from"./index-CCdsiyfJ.js";import{a as f}from"./mock-CYLcPt9H.js";import{S as j,B as p,I as i}from"./index-7WOJeq5z.js";import{R as y}from"./PlusOutlined-Dsh35uUn.js";import{R as I,T as c}from"./MinusOutlined-CR-s38kB.js";import{S as C}from"./index-Dl3Wuo_D.js";import"./table-Byzm5jmz.js";import"./index-B80Lt_BM.js";import"./table-selection-BsyX7H5W.js";import"./Table-Bt0F8nuB.js";const E=()=>{const[d,o]=f(),[u,x]=h.useState(!1),m=d.length===1,w=h.useMemo(()=>[{title:"Index",dataIndex:"key",width:56,align:"center",fixed:"left",render(a,l,e){return e}},{title:"",key:"prefix-action",width:80,fixed:"left",render(a,l,e){return s.jsxs(j,{children:[s.jsx(p,{icon:s.jsx(y,{}),size:"small",shape:"circle",color:"primary",variant:"outlined",onClick:()=>{o(n=>{const r=n.slice();return r.splice(e+1,0,{key:`key:${Date.now()}`}),r})}}),s.jsx(p,{icon:s.jsx(I,{}),size:"small",shape:"circle",danger:!0,disabled:m,onClick:()=>{o(n=>{const r=n.slice();return r.splice(e,1),r})}})]})}},{title:"Name",dataIndex:"name",key:"name",width:200,render:(a,l,e)=>s.jsx(i,{value:a,onChange:n=>{o(r=>{const t=r.slice();return t[e]={...t[e],name:n.currentTarget.value},t})}})},{title:"Data1",dataIndex:"data1",width:200,render:(a,l,e)=>s.jsx(c,{className:"w-full",value:a,onChange:n=>{o(r=>{const t=r.slice();return t[e]={...t[e],data1:n},t})}})},{title:"Data2",dataIndex:"data2",width:200,render:(a,l,e)=>s.jsx(c,{className:"w-full",value:a,onChange:n=>{o(r=>{const t=r.slice();return t[e]={...t[e],data2:n},t})}})},{title:"Data3",dataIndex:"data3",width:200,render:(a,l,e)=>s.jsx(c,{className:"w-full",value:a,onChange:n=>{o(r=>{const t=r.slice();return t[e]={...t[e],data3:n},t})}})},{title:"Data4",dataIndex:"data4",width:200,render:(a,l,e)=>s.jsx(i,{value:a,onChange:n=>{o(r=>{const t=r.slice();return t[e]={...t[e],data4:n.currentTarget.value},t})}})},{title:"Data5",dataIndex:"data5",width:200,render:(a,l,e)=>s.jsx(i,{value:a,onChange:n=>{o(r=>{const t=r.slice();return t[e]={...t[e],data5:n.currentTarget.value},t})}})}],[m,o]);return s.jsxs("div",{style:{padding:"0 12px"},children:[s.jsx("h2",{children:"选择"}),s.jsxs("div",{style:{display:"inline-flex",alignItems:"center",margin:"0 0 8px 0"},children:[s.jsx(C,{value:u,onChange:x})," 单选模式"]}),s.jsx(g,{rowKey:"key",dataSource:d,columns:w,estimatedRowHeight:49,estimatedColumnWidth:200,sticky:!0,rowSelection:{selections:!0,type:u?"radio":"checkbox",onChange(a,l,e){console.log({selectedRowKeys:a,selectedRows:l,info:e})}},onChange:a=>{console.log(a)}})]})};export{E as default};
