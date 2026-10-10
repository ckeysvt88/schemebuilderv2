import { useEffect, useId, useRef, useState } from 'react';
import './CompareSchoolList.css';

const PAGE_SIZE = 10;

export default function CompareSchoolList({ book, schools, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [page, setPage] = useState(0);
  const pageSchools = schools.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    const dialog = dialogRef.current;
    const invoker = document.activeElement;
    const scrollRoot = document.getElementById('root');
    const previousOverflow = scrollRoot?.style.overflowY;
    dialog.showModal();
    if (scrollRoot) scrollRoot.style.overflowY = 'hidden';
    return () => {
      if (scrollRoot) scrollRoot.style.overflowY = previousOverflow;
      if (invoker?.isConnected) invoker.focus({ preventScroll: true });
    };
  }, []);

  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }

  return (
    <dialog ref={dialogRef} className="compare-school-dialog" aria-labelledby={titleId} onClose={onClose} onClick={closeOnBackdrop}>
      <header className="compare-school-header">
        <div>
          <h2 id={titleId}>{book === 'All' ? 'All playbooks' : book}</h2>
          <div className="compare-school-subtitle">{schools.length} {schools.length === 1 ? 'school' : 'schools'} listed{book === 'All' ? '' : ' with this playbook'}</div>
        </div>
        <button type="button" className="compare-school-close" onClick={onClose} autoFocus>Close</button>
      </header>
      <div className="compare-school-body">
        {schools.length > 0 ? (
          <ul className="compare-school-list">
            {pageSchools.map(school => <li key={school.id} style={{ borderLeftColor: school.color }}><span>{school.name}</span></li>)}
          </ul>
        ) : <p className="compare-school-empty">No schools are listed with this exact playbook in the current scouting data.</p>}
        {schools.length > PAGE_SIZE && (
          <div className="compare-school-pagination">
            <button type="button" onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
            <span role="status">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, schools.length)} of {schools.length}</span>
            <button type="button" onClick={() => setPage(page + 1)} disabled={(page + 1) * PAGE_SIZE >= schools.length}>Next</button>
          </div>
        )}
      </div>
    </dialog>
  );
}
