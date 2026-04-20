import React from "react";
import { sanitizeInlineHTML, toDisplayHTML } from "../../../../../utils/richText";

export default function RadioGroup({ options, value, onChange, disabled }) {
  const normalized = (options || []).map((opt, i) =>
    typeof opt === "string"
      ? ({ value: opt, label: opt })
      : ({ value: opt.value ?? opt, label: opt.label ?? String(opt.value ?? i) })
  );
  return (
    <div className="max-h-60 overflow-y-auto w-full">
      <div className="grid gap-2">
        {normalized.map((o, i) => {
          const id = `rg_${i}_${o.value}`;
          return (
            <label key={o.value} htmlFor={id} className="option-row cursor-pointer">
              <input type="radio" id={id} name="radio-group" value={o.value} checked={value === o.value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="accent-[#27235c] scale-125 md:scale-150" />
              <span className="text-[#274c77]" dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o.label) }} />
            </label>
          );
        })}
      </div>
    </div>
  );
}