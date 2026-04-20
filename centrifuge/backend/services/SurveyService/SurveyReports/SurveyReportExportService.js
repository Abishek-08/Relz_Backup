const surveyReportService = require("./SurveyReportService");
const responseDao = require("../../../dao/SurveyDao/SurveyResponseDao");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const {
  createDoc,
  drawHeader,
  drawMeta,
  drawSectionTitle,
  drawQuestion,
  drawAnswer,
  drawDivider,
  drawFooter,
  renderAggregatedPDFKit,
  renderIndividualPDFKit,
  drawTable,
  horizontalScalePDFKit,
  initPagination,
  finalizeWithFooterAndBuffer,
  drawQuestionType,
} = require("./PdfHelper");

const logger = require("../../../logger");

const leftLogo = fs.readFileSync(
  path.resolve(__dirname, "../../../utils/images/logorounded.png"),
);

const rightLogo = fs.readFileSync(
  path.resolve(__dirname, "../../../utils/images/R2DC_final_right_side.png"),
);

logger.info("PDF logos loaded", {
  leftLogoBytes: leftLogo.length,
  rightLogoBytes: rightLogo.length,
});

exports.exportCSV = async (eventId, filters) => {
  const report = await surveyReportService.generateSurveyReport(eventId, filters);
  const surveyInfo = report.surveyInfo;
  const eventName = surveyInfo.event?.eventName || "survey";

  const rows = [
    { Field: "Event Name", Value: eventName },
    { Field: "Survey Mode", Value: surveyInfo.isAnonymousSurvey ? "Anonymous" : surveyInfo.emailMode },
    { Field: "Generated At", Value: formatIST(new Date()) },
  ];

  report.questions.forEach((q) => {
    const r = q.report;

    if (r?.distribution) {
      const allOptions = Object.keys(r.distribution).join(", ");
      Object.entries(r.distribution).forEach(([opt, count]) => {
        rows.push({
          Question: `${q.displayOrder}. ${stripHtmlToText(q.questionText)}`,
          Option: stripHtmlToText(opt),
          Count: count,
          Options: stripHtmlToText(allOptions),
        });
      });
    }

    if (r?.matrix) {
      Object.entries(r.matrix).forEach(([row, cols]) => {
        Object.entries(cols).forEach(([col, count]) => {
          rows.push({
            Question: `${q.displayOrder}. ${stripHtmlToText(q.questionText)}`,
            Aspect: stripHtmlToText(row),
            Option: stripHtmlToText(col),
            Count: count,
          });
        });
      });
    }

    // in exports.exportCSV (you already pasted the rest)
if (r?.comments) {
  r.comments.forEach((c, idx) => {
    rows.push({
      Question: `${q.displayOrder}. ${stripHtmlToText(q.questionText)}`,
      CommentIndex: idx + 1,
      Comment: stripHtmlToText(c),
    });
  });
}
  });

  return { csv: new Parser().parse(rows), eventName };
};

exports.exportIndividualCSV = async (eventId) => {
  const report = await surveyReportService.generateSurveyReport(eventId, {});
  const eventName = report.surveyInfo.event?.eventName || "survey";

  const responses = await responseDao.findByEventWithFilter(eventId, {});
  const rows = [{ Field: "Generated At", Value: formatIST(new Date()) }];

  responses.forEach((r) => {
    const user = r.surveyUser?.surveyUserEmail || "Anonymous";
    const question = `${r.surveyQuestion.displayOrder}. ${stripHtmlToText(r.surveyQuestion.surveyQuestion)}`;

    const opts = ["radio", "dropdown", "checkbox"].includes(r.surveyQuestion.surveyQuestionType)
      ? (r.surveyQuestion.surveyCheckBoxOptions || []).map(stripHtmlToText).join(", ")
      : "";

    let resp;
    if (Array.isArray(r.surveyResponse)) {
      // list of choices → plain text, separated by "; "
      resp = r.surveyResponse.map(stripHtmlToText).join("; ");
    } else if (r.surveyResponse && typeof r.surveyResponse === "object") {
      // matrix {row: col} → "Row → Col" lines
      resp = Object.entries(r.surveyResponse)
        .map(([row, col]) => `${stripHtmlToText(row)} → ${stripHtmlToText(col)}`)
        .join("; ");
    } else if (typeof r.surveyResponse === "string") {
      resp = stripHtmlToText(r.surveyResponse);
    } else {
      resp = "";
    }

    rows.push({ User: user, Question: question, Response: resp, Options: opts });
  });

  return { csv: new Parser().parse(rows), eventName };
};

exports.exportAggregatedExcel = async (eventId, filters) => {
  const report = await surveyReportService.generateSurveyReport(eventId, filters);
  const surveyInfo = report.surveyInfo;
  const eventName = surveyInfo.event?.eventName || "survey";

  const workbook = new ExcelJS.Workbook();
  const meta = workbook.addWorksheet("Survey Info");

  meta.addRow(["Event", eventName]);
  meta.addRow(["Survey Mode", surveyInfo.isAnonymousSurvey ? "Anonymous" : surveyInfo.emailMode]);
  meta.addRow(["Generated At", formatIST(new Date())]);

  (report.questions || []).forEach((q) => {
    const safeSheetName = sanitize(stripHtmlToText(q.questionText));
    const sheet = workbook.addWorksheet(safeSheetName || "Question");
    const r = q.report || {};

    if (r.comments) {
  const hdr = sheet.addRow(["#", "Comment"]);
  hdr.font = { bold: true };
  r.comments.forEach((c, i) => {
    const row = sheet.addRow([i + 1, ""]);
    row.getCell(2).value = { richText: htmlToExcelRichText(c) };
  });
  sheet.addRow([]);
}

    if (r.distribution) {
      const hdr = sheet.addRow(["Option", "Count"]);
      hdr.font = { bold: true };

      Object.entries(r.distribution).forEach(([o, c]) => {
        const row = sheet.addRow(["", c]);
        const cell = row.getCell(1);
        cell.value = { richText: htmlToExcelRichText(o) };
      });
    }

    if (r.matrix) {
      const cols = Object.keys(Object.values(r.matrix)[0] || {});
      const header = sheet.addRow(["Question / Values", ...cols.map(stripHtmlToText)]);
      header.font = { bold: true };

      Object.entries(r.matrix).forEach(([row, colVals]) => {
        const excelRow = sheet.addRow(["", ...cols.map((c) => colVals[c] || 0)]);
        const cell = excelRow.getCell(1);
        cell.value = { richText: htmlToExcelRichText(row) };
      });
    }
  });

  return { workbook, eventName };
};

exports.exportIndividualExcel = async (eventId) => {
  const report = await surveyReportService.generateSurveyReport(eventId, {});
  const eventName = report.surveyInfo.event?.eventName || "survey";

  const responses = await responseDao.findByEventWithFilter(eventId, {});
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Responses");

  sheet.addRow(["User", "Question", "Response", "Options"]).font = { bold: true };

  responses.forEach((r) => {
    const opts = ["radio", "dropdown", "checkbox"].includes(r.surveyQuestion.surveyQuestionType)
      ? (r.surveyQuestion.surveyCheckBoxOptions || []).map(stripHtmlToText).join(", ")
      : "";

    const row = sheet.addRow(["", "", "", ""]);
    row.getCell(1).value = r.surveyUser?.surveyUserEmail || "Anonymous";
    row.getCell(2).value = { richText: htmlToExcelRichText(`${r.surveyQuestion.displayOrder}. ${r.surveyQuestion.surveyQuestion}`) };
    
if (Array.isArray(r.surveyResponse)) {
  const rt = [];
  r.surveyResponse.forEach((item, idx) => {
    rt.push(...htmlToExcelRichText(String(item || "")));
    if (idx < r.surveyResponse.length - 1) rt.push({ text: "\n" });
  });
  row.getCell(3).value = { richText: rt.length ? rt : [{ text: "" }] };
} else if (r.surveyResponse && typeof r.surveyResponse === "object") {
  // matrix-like: row -> selected col
  const rt = [];
  const entries = Object.entries(r.surveyResponse || {});
  entries.forEach(([rowLbl, colLbl], i) => {
    rt.push(...htmlToExcelRichText(`${rowLbl} → ${colLbl}`));
    if (i < entries.length - 1) rt.push({ text: "\n" });
  });
  row.getCell(3).value = { richText: rt.length ? rt : [{ text: "" }] };
} else if (typeof r.surveyResponse === "string") {
  row.getCell(3).value = { richText: htmlToExcelRichText(r.surveyResponse) };
} else {
  row.getCell(3).value = String(r.surveyResponse ?? "");
}
    row.getCell(4).value = opts;
  });

  return { workbook, eventName };
};

function sanitize(name) {
  return name.replace(/[\\/*?:[\]]/g, "").substring(0, 31);
}

function formatIST(d) {
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

exports.exportPDF = async (eventId, filters = {}) => {
  logger.info("PDF Export: Aggregated requested", { eventId });
  const report = await surveyReportService.generateSurveyReport(
    eventId,
    filters,
  );
  const { surveyInfo, questions, totalResponses } = report;
  const eventName = surveyInfo.event?.eventName || "Survey";

  const doc = createDoc();
  initPagination(doc);

  drawHeader(doc, {
    title: `${eventName} – Survey Report`,
    leftLogo,
    rightLogo,
  });

  drawMeta(doc, {
    Event: eventName,
    "Survey Mode": surveyInfo.isAnonymousSurvey
      ? "Anonymous"
      : surveyInfo.emailMode,
    "Survey Date": formatIST(new Date(surveyInfo.createdAt)),
    "Total Responses": totalResponses,
  });

  questions.forEach((q, idx) => {
    drawSectionTitle(doc, `${q.displayOrder}. ${q.questionText}`);
    drawQuestionType(doc, q.surveyQuestionType || q.questionType || q.type);
    renderAggregatedPDFKit(doc, q.report);
    if (idx < questions.length - 1) doc.moveDown(1);
  });

  const buffer = await finalizeWithFooterAndBuffer(doc);
  logger.info("PDF Export completed", { bytes: buffer.length });
  return { buffer, eventName };
};

exports.exportIndividualPDF = async (eventId) => {
  logger.info("PDF Export: Individual requested", { eventId });

  try {
    const responses = await responseDao.findByEventWithFilter(eventId, {});
    const report = await surveyReportService.generateSurveyReport(eventId, {});
    const surveyInfo = report.surveyInfo;
    const eventName = surveyInfo.event?.eventName || "Survey";

    const submissions = new Map();
    const makeKey = (r) => {
      if (r.submissionId) return `sub:${r.submissionId}`;
      const user = r.surveyUser?.surveyUserEmail || "Anonymous";
      const ts = new Date(r.createdAt);
      const rounded = new Date(
        ts.getFullYear(),
        ts.getMonth(),
        ts.getDate(),
        ts.getHours(),
        ts.getMinutes(),
      );
      return `usr:${user}|t:${rounded.toISOString()}`;
    };

    responses.forEach((r) => {
  const key = makeKey(r);
  if (!submissions.has(key)) {
    submissions.set(key, {
      user: r.surveyUser?.surveyUserEmail || 'Anonymous',
      submittedAt: r.createdAt, 
      answers: [],
    });
  }
  const sub = submissions.get(key);

  if (new Date(r.createdAt) > new Date(sub.submittedAt)) {
    sub.submittedAt = r.createdAt;
  }

  sub.answers.push({
    order: r.surveyQuestion.displayOrder,
    type: r.surveyQuestion.surveyQuestionType,
    text: r.surveyQuestion.surveyQuestion,
    options: r.surveyQuestion.surveyCheckBoxOptions || [],
    scaleMin: r.surveyQuestion.scaleMin,
    scaleMax: r.surveyQuestion.scaleMax,
    scaleLabels: r.surveyQuestion.scaleLabels || [],
    matrixLabels: r.surveyQuestion.matrixQnLabels || [],
    answer: r.surveyResponse,
  });
});

    const doc = createDoc();
    initPagination(doc);

    drawHeader(doc, {
      title: `${eventName} – Individual Responses`,
      leftLogo,
      rightLogo,
    });

    drawMeta(doc, {
      Event: eventName,
      "Survey Mode": surveyInfo.isAnonymousSurvey
        ? "Anonymous"
        : surveyInfo.emailMode,
      "Survey Date": formatIST(new Date(surveyInfo.createdAt)),
      "Total Responses": submissions.size,
    });

    const subArr = Array.from(submissions.values());

    subArr.forEach((sub, idx) => {
      drawSectionTitle(
        doc,
        `${sub.user} (${new Date(sub.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })})`,
      );

      sub.answers
        .sort((a, b) => a.order - b.order)
        .forEach((a) => {
          drawQuestion(doc, a.order, a.text);
          drawQuestionType(doc, a.type);
          renderIndividualPDFKit(doc, a);
        });

      if (idx < subArr.length - 1) {
        doc
          .moveDown(1)
          .strokeColor("#27235c")
          .lineWidth(1)
          .moveTo(40, doc.y)
          .lineTo(doc.page.width - 40, doc.y)
          .stroke()
          .moveDown(1);
      }
    });

    const buffer = await finalizeWithFooterAndBuffer(doc);
    logger.info("PDF individual Export completed", { bytes: buffer.length });

    return { buffer, eventName };
  } catch (err) {
    logger.error("PDF Export: Individual FAILED", err);
    console.error("PDF Export error:", err);
    throw err;
  }
};

function stripHtmlToText(s) {
  let t = String(s || "");
  t = t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  t = t.replace(/<\/\s*(div|p)\s*>/gi, "\n").replace(/<\s*(div|p)[^>]*>/gi, "");
  t = t.replace(/<br\s*\/?>/gi, "\n");
  t = t.replace(/<[^>]*>/g, "");
  return t.replace(/\u00a0|&nbsp;/g, " ").replace(/[ \t]+\n/g, "\n").trim();
}

function htmlToExcelRichText(html) {
  if (!html) return [{ text: "" }];
  let s = String(html || "");
  s = s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  s = s.replace(/<\/\s*(div|p)\s*>/gi, "<br>").replace(/<\s*(div|p)[^>]*>/gi, "");
  s = s.replace(/<\s*br\s*\/?>/gi, "<br>");

  const out = [];
  const lines = s.split(/<br\s*\/?>/i);
  lines.forEach((line, li) => {
    const segs = [];
    let stack = [];
    let last = 0;
    const re = /<\/?(b|i|u)\s*>/ig;
    let m;
    const push = (t) => {
      if (!t) return;
      const run = { text: t.replace(/\u00a0|&nbsp;/g, " ") };
      if (stack.includes("b")) run.bold = true;
      if (stack.includes("i")) run.italic = true;
      if (stack.includes("u")) run.underline = true;
      segs.push(run);
    };
    while ((m = re.exec(line)) !== null) {
      push(line.slice(last, m.index));
      const tag = m[1].toLowerCase();
      const closing = line[m.index + 1] === "/";
      if (closing) {
        const idx = stack.lastIndexOf(tag);
        if (idx >= 0) stack.splice(idx, 1);
      } else stack.push(tag);
      last = re.lastIndex;
    }
    push(line.slice(last));
    segs.forEach((s) => out.push(s));
    if (li < lines.length - 1) out.push({ text: "\n" });
  });
  return out.length ? out : [{ text: "" }];
}
