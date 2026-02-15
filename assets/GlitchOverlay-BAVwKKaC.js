import{r as t,g as r,j as a}from"./index-C1LezDZd.js";const s=()=>{const e=t.useRef(null);return t.useEffect(()=>{const n=setInterval(()=>{Math.random()>.95&&r.timeline().to(e.current,{opacity:.3,duration:.05,ease:"none"}).to(e.current,{opacity:0,duration:.05,ease:"none"})},100);return()=>clearInterval(n)},[]),a.jsx("div",{ref:e,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:`
          repeating-linear-gradient(
            0deg,
            rgba(0, 255, 136, 0.1) 0px,
            transparent 2px,
            transparent 4px
          )
        `,opacity:0,pointerEvents:"none",zIndex:5,mixBlendMode:"screen"}})};export{s as default};
