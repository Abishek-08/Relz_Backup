import React from "react";
import { sanitizeInlineHTML } from "../../../../../utils/richText";

export default function MatrixQuestion({
  rows = [], columns = [], value = [], onChange, disabled, primaryColor = "#274c77"
}) {
  const setCell = (ri, ci) => {
    const next = Array.isArray(value) ? [...value] : [];
    next[ri] = ci;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Desktop/Tablet grid */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="text-sm text-[#274c77]">
            <tr>
              <th className="py-3 pr-3"></th>
              {columns.map((c, ci) => (
                <th key={ci} className="py-3 px-3 text-center">
                  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(String(c)) }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t" style={{ borderColor: `${primaryColor}22` }}>
                <th className="py-3 pr-3 text-[#274c77] font-medium">
                  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(String(r)) }} />
                </th>
                {columns.map((_, ci) => {
                  const checked = value?.[ri] === ci;
                  const id = `mx_${ri}_${ci}`;
                  return (
                    <td key={ci} className="py-2 px-3 text-center">
                      <label htmlFor={id} className="inline-flex items-center justify-center cursor-pointer">
                        <input
                          id={id}
                          type="radio"
                          name={`mx_row_${ri}`}
                          checked={!!checked}
                          onChange={() => setCell(ri, ci)}
                          disabled={disabled}
                          className="accent-[#274c77] scale-125 md:scale-150 cursor-pointer"
                        />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: row-by-row card with full-row click */}
      <div className="sm:hidden space-y-3">
        {rows.map((r, ri) => (
          <fieldset key={ri} className="p-4 rounded-xl bg-white border" style={{ borderColor: `${primaryColor}22` }}>
            <legend className="mb-3 text-[#274c77] text-base font-semibold">
              <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(String(r)) }} />
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {columns.map((c, ci) => {
                const checked = value?.[ri] === ci;
                const id = `mxm_${ri}_${ci}`;
                return (
                  <label
                    key={ci}
                    htmlFor={id}
                    className={`flex items-center justify-start gap-2 px-3 py-3 rounded-lg border cursor-pointer ${
                      checked ? "bg-[#274c77]/10 border-[#274c77]/40" : "border-gray-200"
                    }`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`mxm_row_${ri}`}
                      checked={!!checked}
                      onChange={() => setCell(ri, ci)}
                      disabled={disabled}
                      className="accent-[#274c77] scale-125"
                    />
                    <span className="text-[#274c77]" dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(String(c)) }} />
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
