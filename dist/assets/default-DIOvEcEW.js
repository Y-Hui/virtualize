import{j as t}from"./index-CF_IaDcW.js";import{V as r}from"./table-CWpMdFKl.js";import{u as i}from"./mock-DBoiK4Ma.js";const n=[{title:"Key",dataIndex:"key",width:100,align:"center"},{title:"Text",dataIndex:"text",width:200,align:"center"},...Array.from({length:6},(e,a)=>({title:`Text${2+a}`,dataIndex:`text${2+a}`,width:200,align:"center"}))],o=()=>{const[e]=i();return t.jsxs("div",{style:{padding:"0 12px"},children:[t.jsx("h2",{children:"纯文本"}),t.jsx("h3",{children:"性能够好，但是对于实际场景没很大意义 😅"}),t.jsx("p",{children:"此处没有滚动容器，滚动容器为 window"}),t.jsx("p",{style:{marginBottom:12},children:"VirtualTable 动态计算行高，你只需要传入一个预估高度（estimatedRowHeight）"}),t.jsx(r,{rowKey:"key",dataSource:e,columns:n,estimatedRowHeight:100})]})};export{o as default};