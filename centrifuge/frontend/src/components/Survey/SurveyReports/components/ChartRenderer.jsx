import React, { useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, LabelList
} from 'recharts';
import { colorForLabel } from '../utils/colors';
import { stripInlineTags } from '../../../../utils/richText.jsx';

const buildSeries = (distribution = {}, { hideZeros = false, hiddenKeys = new Set() }) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  const raw = entries
    .filter(([name, value]) => (!hiddenKeys.has(name)) && (!hideZeros || value > 0))
    .map(([name, value]) => {
      const pct = Number(((value / total) * 100).toFixed(1));
      return { name, value, pct };
    });
  const maxVal = raw.reduce((m, r) => Math.max(m, r.value), 0);
  
 return raw.map((r) => ({
   ...r,
   name: stripInlineTags(r.name), 
   dim: r.pct < 5,
   dominant: r.value === maxVal && maxVal > 0,
 }));
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs">
      <div className="font-medium">{label}</div>
      <div>{p.value} ({p.pct}%)</div>
    </div>
  );
};

export default React.memo(function ChartRenderer({
  questionType,
  report,
  variant,
  hideZeros = false,
  hiddenKeys = new Set(),
  valueMode = 'percent', // 'count' | 'percent'
}) {
  const data = useMemo(
    () => buildSeries(report?.distribution || {}, { hideZeros, hiddenKeys }),
    [report, hideZeros, hiddenKeys]
  );

  const defaults = {
    checkbox: 'donut', radio: 'bar', dropdown: 'bar',
    rating: 'hbar', star: 'hbar', slider: 'hbar',
  };
  const v = variant || defaults[questionType] || 'bar';

  if (!data?.length) return <div className="text-sm text-gray-500">No data</div>;

  const axisLabelWidth = Math.min(120, Math.max(80, Math.floor(800 / (data.length + 1))));
  const labelKey = valueMode === 'count' ? 'value' : 'pct';
  const labelFmt = (v) => valueMode === 'count' ? `${v}` : `${v}%`;

  const fillFor = (e) => {
    const base = colorForLabel(e.name);
    if (e.dominant) return base;
    if (e.dim) return base + '80';
    return base;
    };

  if (v === 'pie' || v === 'donut') {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<Tip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={v === 'donut' ? 60 : 0}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive
              label={(props) => labelFmt(props.payload[labelKey])}
              labelLine={false}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={fillFor(entry)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (v === 'line') {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} height={50} />
            <YAxis />
            <Tooltip content={<Tip />} />
            <Line type="monotone" dataKey="value" stroke="#27235c" strokeWidth={2} dot isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (v === 'hbar') {
    return (
      <div className="w-full h-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ left: 16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={axisLabelWidth} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} isAnimationActive>
              <LabelList dataKey={labelKey} position="right" formatter={labelFmt} />
              {data.map((d, i) => (
                <Cell key={i} fill={fillFor(d)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // default bar
  return (
    <div className="w-full h-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} height={50} />
          <YAxis />
          <Tooltip content={<Tip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive>
            <LabelList dataKey={labelKey} position="top" formatter={labelFmt} />
            {data.map((d, i) => (
              <Cell key={i} fill={fillFor(d)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});