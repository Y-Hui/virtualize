import{j as t}from"./index-BAwjQ-7c.js";import{V as r}from"./index-CCdsiyfJ.js";import{u as a}from"./mock-CYLcPt9H.js";import"./table-Byzm5jmz.js";import"./index-B80Lt_BM.js";import"./table-selection-BsyX7H5W.js";import"./Table-Bt0F8nuB.js";import"./index-7WOJeq5z.js";const n=[{title:"Key",dataIndex:"key",width:100,align:"center"},{title:"Text",dataIndex:"text",width:200,align:"center"},...Array.from({length:6},(e,i)=>({title:`Text${2+i}`,dataIndex:`text${2+i}`,width:200,align:"center"}))],p=()=>{const[e]=a();return t.jsxs("div",{style:{padding:"0 12px"},children:[t.jsx("h2",{children:"纯文本"}),t.jsx("h3",{children:"性能够好，但是对于实际场景没很大意义 😅"}),t.jsx("p",{children:"此处没有滚动容器，滚动容器为 window"}),t.jsx("p",{style:{marginBottom:12},children:"VirtualTable 动态计算行高，你只需要传入一个预估高度（estimatedRowHeight）"}),t.jsx(r,{rowKey:"key",dataSource:e,columns:n,estimatedRowHeight:100,estimatedColumnWidth:200})]})};export{p as default};
