import './matchCheckAdvice.css';

export default function MatchCheckAdvice({ plan }) {
  const check = plan?.tools?.find(item => item.setting === 'Formation Check');
  if (!check) return null;
  return <details className="match-check-advice">
    <summary>Optional match check · {check.value}</summary>
    <div><p>{check.why}</p><p><strong>Check before applying:</strong> {check.tradeoff}</p></div>
  </details>;
}
