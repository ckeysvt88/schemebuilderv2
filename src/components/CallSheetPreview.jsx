import { useEffect, useRef, useState } from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';


// Render the actual generated PDF in-app; mobile PDF plugins can leave a PWA
// or show only its first page. This viewer does not navigate or open a tab.
export default function CallSheetPreview({ file }) {
  const pages = useRef(null);
  const [message, setMessage] = useState('Loading preview…');
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    let cancelled = false;
    let task;
    const host = pages.current;
    const render = async () => {
      try {
        const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
        GlobalWorkerOptions.workerSrc = workerUrl;
        const data = new Uint8Array(await file.arrayBuffer());
        if (cancelled) return;
        task = getDocument({ data, isEvalSupported: false, useSystemFonts: true });
        const doc = await task.promise;
        for (let number = 1; number <= doc.numPages; number++) {
          if (cancelled) return;
          const page = await doc.getPage(number);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          canvas.style.cssText = 'display:block;width:100%;height:auto;margin-bottom:12px;background:white';
          canvas.setAttribute('role', 'img');
          canvas.setAttribute('aria-label', `Call sheet page ${number} of ${doc.numPages}`);
          host.appendChild(canvas);
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        }
        if (!cancelled) setMessage('Scroll to see each page. Use Zoom in for larger text.');
      } catch {
        if (!cancelled) setMessage('Preview could not load. You can still use Save PDF.');
      }
    };
    render();
    return () => {
      cancelled = true;
      if (task) void task.destroy().catch(() => {});
      host.replaceChildren();
    };
  }, [file]);
  return <>
    <p role="status" style={{ fontSize: 12, color: 'var(--color-text-2)' }}>{message}</p>
    <button type="button" onClick={() => setZoom(value => value === 1 ? 2 : 1)} style={{ marginBottom: 10, minHeight: 36, background: 'var(--color-surface-1)', color: 'var(--color-text-1)', border: '1px solid var(--color-border)', borderRadius: 6 }}>{zoom === 1 ? 'Zoom in' : 'Fit width'}</button>
    <div style={{ overflowX: 'auto' }}><div ref={pages} style={{ width: `${zoom * 100}%` }} /></div>
  </>;
}
