import React from 'react';
import { sanitizeInlineHTML } from '../../../../utils/richText';

export default React.memo(function MatrixGrid({ matrix = {} }) {
  const rows = Object.keys(matrix || {});
  const cols = rows.length ? Object.keys(matrix[rows[0]] || {}) : [];
  const isSmall = rows.length <= 3;

  return (
    <div className={`${isSmall ? 'max-h-none' : 'max-h-[300px]'} overflow-auto border rounded-md bg-white`}>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 border-b text-left"> </th>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 border-b text-left">
  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(String(c || '')) }} />
</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r} className="odd:bg-white even:bg-gray-50">
              <td className="px-3 py-2 border-b font-medium sticky left-0 bg-inherit">
  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(String(r || '')) }} />
</td>
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 border-b">{matrix[r]?.[c] ?? 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});