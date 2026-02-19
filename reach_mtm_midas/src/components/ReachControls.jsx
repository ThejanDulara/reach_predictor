import React from 'react';

export default function ReachControls({
  threshold,
  onThresholdChange,
  grpInput,
  setGrpInput,
  onPredict,
  singlePoint,
  stagnation
}) {
  return (
    <div className="controls">
      <h2 className="title">Reach Predictor Controls</h2>

      <div className="grid">
        {/* Threshold slider */}
        <div className="row">
          <label className="label">Stagnation Threshold</label>
          <input
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            className="slider"
          />
          <div className="value">{threshold.toFixed(3)}</div>
        </div>

        {/* Show current stagnation point */}
        <div className="row">
          <label className="label">Detected Stagnation Point</label>
          <div className="value">
            {stagnation
              ? <>GRP <strong>{stagnation.grp.toFixed(2)}</strong>, Reach <strong>{stagnation.reach.toFixed(2)}</strong></>
              : '—'}
          </div>
        </div>

        {/* Single GRP input */}
        <div className="row">
          <label className="label">GRP Value for Prediction</label>
          <input
            type="number"
            className="input"
            value={grpInput}
            onChange={(e) => setGrpInput(e.target.value)}
            placeholder="Enter GRP"
            min="0"
          />
          <button className="button" onClick={onPredict}>Predict</button>
        </div>

        {/* Show predicted value */}
        <div className="row">
          <label className="label">Predicted Reach</label>
          <div className="value">
            {singlePoint ? <strong>{singlePoint.reach.toFixed(2)}</strong> : 'No Prediction Yet'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .title {
          text-align: center;
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        .grid {
          display: grid;
          gap: 0.75rem;
        }
        .row {
          display: grid;
          grid-template-columns: 260px 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        .label {
          font-weight: 600;
          color: #1a202c;
        }
        .slider {
          width: 100%;
        }
        .input {
          padding: 0.55rem 0.9rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.975rem;
          background: #fff;
          color: #111;
          width: 200px;
        }
        .button {
          padding: 0.65rem 1.15rem;
          background: linear-gradient(90deg, #5a67d8, #434190);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(67, 65, 144, 0.28);
          opacity: 0.95;
        }
        .value {
          color: #2d3748;
        }

        @media (max-width: 768px) {
          .row {
            grid-template-columns: 1fr;
          }
          .input { width: 100%; }
        }
      `}</style>
    </div>
  );
}
