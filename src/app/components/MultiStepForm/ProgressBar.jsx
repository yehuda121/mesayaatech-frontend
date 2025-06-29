import './MultiStepForm.css';

export default function ProgressBar({ step, totalSteps }) {
  const percentage = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="progress-wrapper">
      <div className="progress-labels">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className={`progress-step ${i + 1 <= step ? 'active' : ''}`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
