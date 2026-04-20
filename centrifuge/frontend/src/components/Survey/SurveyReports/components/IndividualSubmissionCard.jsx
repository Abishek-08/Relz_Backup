import React, { useState } from 'react';
import { fmtDateTime } from '../utils/datetime';
import { useToast } from '../../../../utils/useToast';
import {
  User2, CalendarClock, Copy, Check,
  MessageSquare, CheckSquare, CircleDot, ListFilter,
  GitCommit, SlidersHorizontal, Star, Table as TableIcon, ListChecks
} from 'lucide-react';
import QuestionRenderer from './QuestionRenderer.jsx';
import { stripInlineTags, sanitizeInlineHTML } from '../../../../utils/richText.jsx';

const TYPE_ICONS = {
  comment: MessageSquare,
  checkbox: CheckSquare,
  radio: CircleDot,
  dropdown: ListFilter,
  slider: GitCommit,
  rating: SlidersHorizontal,
  star: Star,
  matrix: TableIcon,
};

export default React.memo(function IndividualSubmissionCard({ submission }) {
  const { success, error } = useToast();
  const email = submission?.user?.email || (submission?.anonymous ? 'Anonymous' : 'Anonymous');
  const dt = submission?.createdAt ? fmtDateTime(submission.createdAt) : '—';
  const answers = submission?.answers || [];
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {   
const lines = answers.map((a) => {
       const q = `${a.displayOrder ? `Q${a.displayOrder}. ` : ""}${stripInlineTags(a.questionText)}`;
       let resp = "";
       if (Array.isArray(a.value)) {
         resp = a.value.map(stripInlineTags).join("; ");
       } else if (a.value && typeof a.value === "object") {
         resp = Object.entries(a.value)
           .map(([row, col]) => `${stripInlineTags(row)} → ${stripInlineTags(col)}`)
           .join("; ");
       } else {
         resp = stripInlineTags(String(a.value ?? ""));
       }
       return `${q}: ${resp}`;
     });
      const text = `User: ${email}\nDate: ${dt}\n\n${lines.join('\n')}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      success('Responses copied');
      setTimeout(() => setCopied(false), 1200);
    } catch {
      error('Copy failed');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
            <User2 size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{email}</div>
            
          </div>
        </div>

        {/* Answers count + Copy */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
            <ListChecks size={14} /> {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
          </span>
          <button
            onClick={onCopy}
            className="text-xs px-2 py-1 border rounded-md bg-white text-gray-700 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
            title="Copy all responses"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-200 my-3" />

      {/* Answers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {answers.map((a, i) => {
          const Icon = TYPE_ICONS[a.questionType] || CircleDot;
          return (
            <div key={a.questionId || i} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} className="text-gray-600" />
                
<div className="text-sm font-semibold text-gray-900">
  {a.displayOrder ? `Q${a.displayOrder}. ` : ''}
  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(a.questionText || '') }} />
</div>

              </div>
              <QuestionRenderer answer={a} />
            </div>
          );
        })}
      </div>
    </div>
  );
});