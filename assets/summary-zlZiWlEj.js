import{r as c,j as r}from"./index-CvZAtKUh.js";import{V as f}from"./index-0TO60dHr.js";import{a as C}from"./mock-BlB4b7c1.js";import{S as d}from"./index-kmEkiVYx.js";import{S as v,B as j,R as m}from"./index-ZSlcUkeT.js";import{R as D,I as i}from"./index-qCrvmO7P.js";import{R as I,T as h}from"./MinusOutlined-CnSPNUvl.js";import"./index-8fy0hKwC.js";import"./table-selection-Dg5aK3mN.js";import"./Table-YBOfWCLA.js";const z=()=>{const[u,g]=c.useState("bottom"),[x,o]=C(),y=c.useCallback(s=>r.jsxs(d,{fixed:u,children:[r.jsx(d.Outlet,{dataSource:s}),r.jsx(d.Row,{children:l=>r.jsx(d.Cell,{children:"内容"})})]},"summary"),[u]),p=x.length===1,w=c.useMemo(()=>[{title:"",key:"prefix-action",width:80,fixed:"left",render(s,l,e){return r.jsxs(v,{children:[r.jsx(j,{icon:r.jsx(D,{}),size:"small",shape:"circle",color:"primary",variant:"outlined",onClick:()=>{o(n=>{const a=n.slice();return a.splice(e+1,0,{key:`key:${Date.now()}`}),a})}}),r.jsx(j,{icon:r.jsx(I,{}),size:"small",shape:"circle",danger:!0,disabled:p,onClick:()=>{o(n=>{const a=n.slice();return a.splice(e,1),a})}})]})}},{title:"Name",dataIndex:"name",key:"name",width:200,summary:{render(){return"This's name column"}},render:(s,l,e)=>r.jsx(i,{value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],name:n.currentTarget.value},t})}})},{title:"Data1",dataIndex:"data1",width:200,summary:{render(){return"This's Data1 column"}},render:(s,l,e)=>r.jsx(h,{className:"w-full",value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data1:n},t})}})},{title:"Data2",dataIndex:"data2",width:200,render:(s,l,e)=>r.jsx(h,{className:"w-full",value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data2:n},t})}})},{title:"Data3",dataIndex:"data3",width:200,render:(s,l,e)=>r.jsx(h,{className:"w-full",value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data3:n},t})}})},{title:"Data4",dataIndex:"data4",width:200,render:(s,l,e)=>r.jsx(i,{value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data4:n.currentTarget.value},t})}})},{title:"Data5",dataIndex:"data5",width:200,render:(s,l,e)=>r.jsx(i,{value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data5:n.currentTarget.value},t})}})},{title:"Data6",dataIndex:"data6",width:200,fixed:"right",render:(s,l,e)=>r.jsx(i,{value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data6:n.currentTarget.value},t})}})},{title:"Data7",dataIndex:"data7",width:200,fixed:"right",render:(s,l,e)=>r.jsx(i,{value:s,onChange:n=>{o(a=>{const t=a.slice();return t[e]={...t[e],data7:n.currentTarget.value},t})}})}],[p,o]);return r.jsxs("div",{style:{padding:16},children:[r.jsx("div",{style:{marginBottom:30,display:"grid",gridTemplateColumns:"repeat(5, minmax(0, 1fr))"},children:r.jsxs("div",{children:[r.jsx("label",{style:{marginRight:8},htmlFor:"summaryPosition",children:"总结栏位置"}),r.jsxs(m.Group,{id:"summaryPosition",value:u,onChange:s=>g(s.target.value),children:[r.jsx(m,{value:"top",children:"Top"}),r.jsx(m,{value:"bottom",children:"Bottom"})]})]})}),r.jsx(f,{rowKey:"key",dataSource:x,columns:w,estimatedRowHeight:57,estimatedColumnWidth:200,summary:y,sticky:!0})]})};export{z as default};
