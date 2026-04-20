import React from "react";
import { sanitizeInlineHTML, toDisplayHTML } from "../../../../../utils/richText";

export default function CheckboxGroup({ options, value, onChange, disabled }) {
  const normalized = (options || []).map((opt, i) =>
    typeof opt === "string"
      ? ({ value: opt, label: opt })
      : ({ value: opt.value ?? opt, label: opt.label ?? String(opt.value ?? i) })
  );
  const setChecked = (val, checked) => {
    const set = new Set(value || []);
    checked ? set.add(val) : set.delete(val);
    onChange(Array.from(set));
  };
  return (
    <div className="max-h-60 overflow-y-auto w-full">
      <div className="grid gap-2">
        {normalized.map((o, i) => {
          const id = `cg_${i}_${o.value}`;
          const checked = (value || []).includes(o.value);
          return (
            <label key={o.value} htmlFor={id} className="option-row cursor-pointer">
              <input type="checkbox" id={id} value={o.value} checked={!!checked} onChange={(e) => setChecked(o.value, e.target.checked)} disabled={disabled} className="accent-[#27235c] scale-125" />
              <span className="" dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o.label) }} />
            </label>
          );
        })}
      </div>
    </div>
  );
}