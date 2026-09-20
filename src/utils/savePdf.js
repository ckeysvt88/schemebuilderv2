// Invoke sharing directly from the Save tap to preserve browser activation.
// The native sheet offers Save to Files on supported Apple devices.
export async function savePdf(file, url, nav = navigator, doc = document) {
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: 'Defensive Call Sheet' });
      return 'shared';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelled';
      // Do not open another window after an asynchronous share failure.
      throw error;
    }
  }
  const link = doc.createElement('a');
  link.href = url;
  link.download = file.name;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  doc.body.appendChild(link);
  link.click();
  link.remove();
  return 'download';
}
