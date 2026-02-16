import{r as t,j as n}from"./index-BCJwF2-b.js";import{g as a}from"./gsap-Bb1K3xIC.js";import"./react-vendor-C6WxKkic.js";const p=()=>{const e=t.useRef(null);return t.useEffect(()=>{const r=setInterval(()=>{Math.random()>.95&&a.timeline().to(e.current,{opacity:.3,duration:.05,ease:"none"}).to(e.current,{opacity:0,duration:.05,ease:"none"})},100);return()=>clearInterval(r)},[]),n.jsx("div",{ref:e,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:`
          repeating-linear-gradient(
            0deg,
            rgba(0, 255, 136, 0.1) 0px,
            transparent 2px,
            transparent 4px
          )
        `,opacity:0,pointerEvents:"none",zIndex:5,mixBlendMode:"screen"}})};export{p as default};
