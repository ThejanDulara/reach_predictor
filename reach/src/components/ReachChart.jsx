// components/ReachChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from 'recharts';

function makeChartData(curveData) {
  if (!curveData) return [];
  const { grp, reach } = curveData;
  return grp.map((g, i) => ({ grp: Number(g), reach: Number(reach[i]) }));
}

// Build fixed ticks for X (every 1500 up to 10500) and Y (ensure 100 shows)
const XTICK_STEP = 1500;
const X_MAX = 10500;
const xTicks = Array.from({ length: X_MAX / XTICK_STEP + 1 }, (_, k) => k * XTICK_STEP);
const yTicks = [0, 20, 40, 60, 80, 100];

export default function ReachChart({ curveData, point }) {
  const data = makeChartData(curveData);
  const stag = curveData?.stagnation;

  return (
    <div>
      <div className="chart-header">Reach Prediction Curve</div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={390}>
          <LineChart data={data} margin={{ top: 20, right: 24, left: 8, bottom: 10 }}>
            <XAxis
              dataKey="grp"
              type="number"
              domain={[0, X_MAX]}
              ticks={xTicks}
              allowDecimals={false}
              interval={0}
              tickFormatter={(v) => v.toFixed(0)}
              label={{ value: 'GRP', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              dataKey="reach"
              type="number"
              domain={[0, 100]}
              ticks={yTicks}
              tickFormatter={(v) => v.toFixed(0)}
              label={{ value: 'Reach', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
              labelStyle={{ color: '#2d3748' }}     // GRP header color
              itemStyle={{ color: '#2d3748' }}      // items color
              formatter={(value, name) => {
                const num = Number(value);
                if (name === 'reach') return [num.toFixed(2), 'Reach'];
                if (name === 'grp')   return [num.toFixed(2), 'GRP'];
                return [value, name];
              }}
              labelFormatter={(label) => `GRP: ${Number(label).toFixed(2)}`}
            />

            {/* Reach curve */}
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#434190"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />

            {/* Stagnation: vertical + horizontal lines with 2-dec label */}
            {stag && typeof stag.grp === 'number' && typeof stag.reach === 'number' && (
              <>
                <ReferenceLine
                  x={Number(stag.grp)}
                  stroke="#e53e3e"
                  strokeDasharray="6 6"
                  label={{
                    value: `Stagnation  GRP ${Number(stag.grp).toFixed(2)}, Reach ${Number(stag.reach).toFixed(2)}`,
                    position: 'top',
                    fill: '#e53e3e'
                  }}
                />
              </>
            )}

            {/* Predicted point: crosshair + dot */}
            {point && typeof point.grp === 'number' && typeof point.reach === 'number' && (
              <>
                <ReferenceLine
                  x={Number(point.grp)}
                  stroke="#2b6cb0"
                  strokeDasharray="4 4"
                />
                <ReferenceLine
                  y={Number(point.reach)}
                  stroke="#2b6cb0"
                  strokeDasharray="4 4"
                />
                <ReferenceDot
                  x={Number(point.grp)}
                  y={Number(point.reach)}
                  r={5}
                  fill="#2b6cb0"
                  stroke="none"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom stats: only predicted point details */}
      <div className="stats">
        {point ? (
          <>
            <div>GRP: <strong>{Number(point.grp).toFixed(2)}</strong></div>
            <div>Predicted Reach: <strong>{Number(point.reach).toFixed(2)}</strong></div>
          </>
        ) : (
          <div>Predicted point: No Prediction Yet</div>
        )}
      </div>

      <style jsx>{`
        .chart-header {
          text-align: center;
          color: #2d3748;
          font-size: 1rem;
          margin-bottom: 0.8rem;
        }
        .chart-box {
          width: 100%;
          height: 380px;
          position: relative;
        }
        .stats {
          margin-top: 0.5rem;
          display: flex;
          gap: 2rem;
          justify-content: center;
          color: #2d3748;
        }
        :global(.recharts-text) { fill: #2d3748 !important; }
      `}</style>
    </div>
  );
}
