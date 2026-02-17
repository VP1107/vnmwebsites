import{r as e,j as o}from"./index-DsVDp6gp.js";import{g as n}from"./gsap-core-DDlvirwQ.js";import"./react-vendor-C6WxKkic.js";import"./scroll-vendor-Bu7sAdyK.js";const d=()=>{const t=e.useRef(null);return e.useEffect(()=>{if(!t.current)return;const r=n.to(t.current,{backgroundPosition:"400% 400%",duration:20,ease:"none",repeat:-1,yoyo:!0});return()=>r.kill()},[]),o.jsx("div",{ref:t,className:"animated-bg",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:`
                    linear-gradient(
                        135deg,
                        #000000 0%,
                        #38bdf8 25%,
                        #00d4ff 50%,
                        #007bff 75%,
                        #000000 100%
                    )
                `,backgroundSize:"400% 400%",opacity:.15,filter:"blur(100px)",zIndex:1,willChange:"background-position"}})};export{d as default};
