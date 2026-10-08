// iPadOS can identify as a Mac when requesting desktop websites.
export function isAppleMobileDevice(nav = navigator) {
  return /iPhone|iPad|iPod/i.test(nav.userAgent || '')
    || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
}

// Invoke Apple mobile sharing directly from the Save tap to preserve activation.
// Desktop browsers can also support sharing, but should download the file.
export async function savePdf(file, url, nav = navigator, doc = document) {
  if (isAppleMobileDevice(nav) && nav.share && nav.canShare?.({ files: [file] })) {
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
  doc.body.appendChild(link);
  link.click();
  link.remove();
  return 'download';
}
