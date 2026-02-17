import{r,j as a}from"./index-DsVDp6gp.js";import{g as o}from"./gsap-core-DDlvirwQ.js";import"./react-vendor-C6WxKkic.js";import"./scroll-vendor-Bu7sAdyK.js";const c=()=>{const t=r.useRef(null);return r.useEffect(()=>{if(!t.current)return;const e=o.timeline({paused:!0}).to(t.current,{opacity:.3,duration:.05,ease:"none"}).to(t.current,{opacity:0,duration:.05,ease:"none"}),n=setInterval(()=>{Math.random()>.95&&!e.isActive()&&e.restart()},100);return()=>{clearInterval(n),e.kill()}},[]),a.jsx("div",{ref:t,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:`
                    repeating-linear-gradient(
                        0deg,
                        rgba(0, 255, 136, 0.1) 0px,
                        transparent 2px,
                        transparent 4px
                    )
                `,opacity:0,pointerEvents:"none",zIndex:5,mixBlendMode:"screen"}})};export{c as default};
