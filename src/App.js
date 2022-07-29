// @ts-check
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';

const alphabetFreqs = [
  { letter: 'a', frequency: 0.08167 },
  { letter: 'b', frequency: 0.01492 },
  { letter: 'c', frequency: 0.02782 },
  { letter: 'd', frequency: 0.04253 },
  { letter: 'e', frequency: 0.12702 },
  { letter: 'f', frequency: 0.02228 },
  { letter: 'g', frequency: 0.02015 },
  { letter: 'h', frequency: 0.06094 },
  { letter: 'i', frequency: 0.06966 },
  { letter: 'j', frequency: 0.00153 },
  { letter: 'k', frequency: 0.00772 },
  { letter: 'l', frequency: 0.04025 },
  { letter: 'm', frequency: 0.02406 },
  { letter: 'n', frequency: 0.06749 },
  { letter: 'o', frequency: 0.07507 },
  { letter: 'p', frequency: 0.01929 },
  { letter: 'q', frequency: 0.00095 },
  { letter: 'r', frequency: 0.05987 },
  { letter: 's', frequency: 0.06327 },
  { letter: 't', frequency: 0.09056 },
  { letter: 'u', frequency: 0.02758 },
  { letter: 'v', frequency: 0.00978 },
  { letter: 'w', frequency: 0.0236 },
  { letter: 'x', frequency: 0.0015 },
  { letter: 'y', frequency: 0.01974 },
  { letter: 'z', frequency: 0.00074 },
];

function App() {
  const [data, setData] = useState();
  useEffect(() => {
    d3.csv('/gistemp.csv', d3.autoType).then(setData);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <PlotChart
          plot={[
            data,
            (data) =>
              Plot.plot({
                style: {
                  background: 'transparent',
                },
                y: {
                  grid: true,
                },
                color: {
                  type: 'diverging',
                  scheme: 'burd',
                },
                marks: [Plot.ruleY([0, 1]), Plot.dot(data, { x: 'Date', y: 'Anomaly', stroke: 'Anomaly' })],
              }),
          ]}
        />
        <PlotChart
          // style={{ color: 'blue' }}
          plot={[
            alphabetFreqs,
            (data) =>
              Plot.plot({
                style: {
                  background: 'transparent',
                },
                marks: [
                  Plot.ruleY([1 / 26], { stroke: 'orange', strokeWidth: 3 }),
                  Plot.barY(data, {
                    x: 'letter',
                    y: 'frequency',
                    sort: { x: 'y', reverse: true },
                  }),
                ],
                y: { grid: true },
              }),
          ]}
        />
      </header>
    </div>
  );
}

export default App;

function PlotChart({ as: El = 'div', plot: [data, plotFn], style = {} } = {}) {
  const nodeRef = useRef();
  useEffect(() => {
    if (data == null || nodeRef.current == null) return;
    const chart = plotFn(data);
    nodeRef.current.append(chart);
    return () => chart.remove();
  }, [data, plotFn]);

  return <El className="plot-chart" ref={nodeRef} style={style} />;
}
