import { useEffect, useRef, useState } from 'react';
import { mountPlayArt } from './playArt/mountPlayArt.js';
import './playArt/playArt.css';
import AdjustmentResponsibilities from './AdjustmentResponsibilities.jsx';

export default function PlayArtBuilder({ initialFormation }) {
  const root = useRef(null);
  const [responsibilities,setResponsibilities] = useState(null);
  useEffect(() => {
    const node = root.current;
    node.innerHTML = '<div class="nm-stage"><div class="nm-app" data-layout="field"></div></div>';
    const builder = mountPlayArt(node, { initialFormation, onResponsibilities: setResponsibilities });
    return () => builder.destroy();
  }, [initialFormation]);
  return <><section id="sb-play-art" ref={root} hidden={responsibilities!==null} aria-label="Design Your Play Macro Builder - Beta" />{responsibilities!==null&&<AdjustmentResponsibilities initialFormation={responsibilities} onBack={()=>{setResponsibilities(null);requestAnimationFrame(()=>root.current?.querySelector('[data-action="responsibilities"]')?.focus());}}/>}</>;
}
