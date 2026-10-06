import { useEffect, useRef } from 'react';
import { mountPlayArt } from './playArt/mountPlayArt.js';
import './playArt/playArt.css';

export default function PlayArtBuilder() {
  const root = useRef(null);
  useEffect(() => {
    const node = root.current;
    node.innerHTML = '<div class="nm-stage"><div class="nm-app" data-layout="field"></div></div>';
    const builder = mountPlayArt(node);
    return () => builder.destroy();
  }, []);
  return <section id="sb-play-art" ref={root} aria-label="Play Art Builder Beta" />;
}
