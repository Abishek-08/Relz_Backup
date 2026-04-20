// src/components/ReportMetaInfo.jsx
import React from 'react';
import { CalendarDays, ClipboardList } from 'lucide-react';
import { fmtDate } from '../utils/datetime';

export default React.memo(function ReportMetaInfo({
  surveyInfo,
  surveyName = 'Survey',
  eventName = '—',
  dateRange = {},
  showResponses = false,
  showSurveyChip = false,
  overrideEventDate,
  overrideSurveyDate,
}) {
  const eventDate = overrideEventDate || (surveyInfo?.event?.eventDate ? fmtDate(surveyInfo.event.eventDate) : '—');
  const surveyDate = overrideSurveyDate || (surveyInfo?.createdAt ? fmtDate(surveyInfo.createdAt) : '—');

  const Chip = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-sm border border-gray-200">
      <Icon size={16} className="text-gray-700" />
      <span className="text-gray-700">{label}:</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {/* Survey chip intentionally hidden per request */}
      {/* {showSurveyChip && <Chip icon={ClipboardList} label="Survey" value={surveyName} />} */}
      <Chip icon={ClipboardList} label="Event" value={eventName} />
      <Chip icon={CalendarDays} label="Event Date" value={eventDate} />
      <Chip icon={CalendarDays} label="Survey Date" value={surveyDate} />
    </div>
  );
});