import React from 'react';
import ReachControls from '../components/ReachControls';
import ReachChart from '../components/ReachChart';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://reachpredictor-production.up.railway.app';

export default function ReachPredictor() {
  const [curveData, setCurveData] = React.useState(null);
  const [threshold, setThreshold] = React.useState(0.01);
  const [grpInput, setGrpInput] = React.useState();
  const [singlePoint, setSinglePoint] = React.useState(null); // { grp, reach }

  // load curve initially
  React.useEffect(() => {
    fetchCurve(threshold);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurve = async (t) => {
    const res = await fetch(`${BACKEND_URL}/api/curve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grp_min: 25,
        grp_max: 10000,
        points: 100,
        threshold: Number(t),
        smooth_sigma: 0
      })
    });
    if (!res.ok) throw new Error('Failed to fetch curve');
    const data = await res.json();
    setCurveData(data);
  };

  const handleThresholdChange = async (t) => {
    setThreshold(t);
    await fetchCurve(t);
  };

  const handlePredict = async () => {
    const res = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grp: Number(grpInput) })
    });
    if (!res.ok) {
      alert('Prediction failed');
      return;
    }
    const data = await res.json();
    setSinglePoint(data); // { grp, reach }
  };

  return (
    <div className="reach-wrapper">
      <div className="card" style={{ marginBottom: '1rem' }}>
        <ReachControls
          threshold={threshold}
          onThresholdChange={handleThresholdChange}
          grpInput={grpInput}
          setGrpInput={setGrpInput}
          onPredict={handlePredict}
          singlePoint={singlePoint}
          stagnation={curveData?.stagnation}
        />
      </div>

      <div className="card">
        <ReachChart
          curveData={curveData}
          point={singlePoint}
        />
      </div>

      <style jsx>{`
        .reach-wrapper {
          background: #ffffff;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: #ffffff;
          padding: 1.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}
