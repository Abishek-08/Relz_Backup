const logger = require("../logger");
const transporter = require("../config/mailer");
const { encryptToken } = require("./encryptDecryptToken");
const { generateFeedbackToken } = require("../middleware/tokenGenerator");

/**
 * Send a simple thank-you email after survey submission
 */
exports.sendSurveyThankYouEmail = async (surveyUser, event) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    h2 { color: #333; }
    .footer { font-size: 12px; color: #999; margin-top: 40px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>🙏 Thank You for Your Survey Response!</h2>
    <p>Dear ${surveyUser.surveyUserEmail},</p>
    <p>We appreciate your time and effort in completing the survey for <strong>${event.eventName}</strong>.</p>
    <p>Your feedback helps us improve and deliver better experiences.</p>
    <div class="footer">
      © 2025 LIVEEAZ • Need help? <a href="mailto:support@liveeaz.com">support@liveeaz.com</a>
    </div>
  </div>
</body>
</html>
`;

  const mailOptions = {
    from: `"LIVEEAZ Notifications" <support@liveeaz.com>`,
    to: surveyUser.surveyUserEmail,
    subject: "Thank You for Your Survey Submission",
    html: htmlContent,
  };

  try {
    if (String(surveyUser.surveyUserEmail).toLowerCase() === "anonymous") {
      logger.info("Survey thank-you email aborted: anonymous user");
      return;
    }
    await transporter.sendMail(mailOptions);
    logger.info("Survey thank-you email sent successfully", {
      to: surveyUser.surveyUserEmail,
    });
  } catch (error) {
    logger.error("Survey thank-you email delivery failed", {
      error: error.message,
    });
    throw new Error(
      "Survey thank-you email delivery failed. Please try again.",
    );
  }
};

/**
 * Send a detailed survey response summary email
 */
// exports.sendSurveySummaryEmail = async (surveyUser, event, responses) => {
//   const responseRows = responses.map(r => `
//     <tr>
//       <td>${r.surveyQuestionId.surveyQuestion}</td>
//       <td>${r.surveyResponse}</td>
//     </tr>
//   `).join('');

//   const htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <style>
//     body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
//     .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
//     h2 { color: #333; }
//     table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//     th { background-color: #007BFF; color: white; padding: 10px; text-align: left; }
//     td { padding: 10px; border-bottom: 1px solid #ddd; }
//     .footer { font-size: 12px; color: #999; margin-top: 40px; text-align: center; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <h2>📊 Survey Summary for Event: ${event.eventName}</h2>
//     <p><strong>Email:</strong> ${surveyUser.surveyUserEmail}</p>

//     <table>
//       <tr><th>Question</th><th>Response</th></tr>
//       ${responseRows}
//     </table>

//     <div class="footer">
//       © 2025 LIVEEAZ • Need help? <a href="mailto:support@liveeaz.com">support@liveeaz.com</a>
//     </div>
//   </div>
// </body>
// </html>
// `;

//   const mailOptions = {
//     from: `"LIVEEAZ Notifications" <support@liveeaz.com>`,
//     to: surveyUser.surveyUserEmail,
//     subject: 'Your Survey Response Summary',
//     html: htmlContent
//   };

//   try {
//     if (String(surveyUser.surveyUserEmail).toLowerCase() === "anonymous") {
//       logger.info("Survey summary email aborted: anonymous user");
//       return;
//     }
//     await transporter.sendMail(mailOptions);
//     logger.info("Survey summary email sent successfully", { to: surveyUser.surveyUserEmail });
//   } catch (error) {
//     logger.error("Survey summary email delivery failed", { error: error.message });
//     throw new Error('Survey summary email delivery failed. Please try again.');
//   }
// };

// working one
// exports.sendSurveySummaryEmail = async (surveyUser, event, responses) => {
//   const token = generateFeedbackToken(surveyUser.surveyUserEmail, event.eventId);
//   const encryptedToken = encryptToken(token);
//   const confirmLink = `${process.env.FRONTEND_URL}/confirmSurveyStatus?token=${encryptedToken}`;

//   // Render each response into HTML
//   const renderResponse = (r) => {
//     const question = r.surveyQuestionId?.surveyQuestion || "Untitled Question";
//     const type = r.surveyQuestionId?.surveyQuestionType;
//     const resp = r.surveyResponse;

//     switch (type) {
//       case "rating":
//       case "star":
//         return `
//           <div class="question">
//             <p>${question}</p>
//             ${[1,2,3,4,5].map(val => `
//               <label>
//                 <input type="radio" disabled ${String(resp)===String(val)?"checked":""}>
//                 ${val}
//               </label>
//             `).join("")}
//           </div>
//         `;
//       case "comment":
//       case "text":
//         return `
//           <div class="question">
//             <p>${question}</p>
//             <div class="underline-field">${resp}</div>
//           </div>
//         `;
//       case "checkbox":
//         return `
//           <div class="question">
//             <p>${question}</p>
//             ${(Array.isArray(resp)?resp:[resp]).map(val => `
//               <label>
//                 <input type="checkbox" disabled checked> ${val}
//               </label>
//             `).join("")}
//           </div>
//         `;
//       case "radio":
//         return `
//           <div class="question">
//             <p>${question}</p>
//             <label>
//               <input type="radio" disabled checked> ${resp}
//             </label>
//           </div>
//         `;
//       case "matrix":
//         return `
//           <div class="question">
//             <p>${question}</p>
//             <table class="matrix">
//               <tr><th>Aspect</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
//               ${Object.entries(resp||{}).map(([label,val])=>`
//                 <tr>
//                   <td>${label}</td>
//                   ${[1,2,3,4,5].map(num=>`
//                     <td><input type="radio" disabled ${String(val)===String(num)?"checked":""}></td>
//                   `).join("")}
//                 </tr>
//               `).join("")}
//             </table>
//           </div>
//         `;
//       default:
//         return `
//           <div class="question">
//             <p>${question}</p>
//             <div class="underline-field">${resp}</div>
//           </div>
//         `;
//     }
//   };

//   const responseBlocks = responses.map(renderResponse).join("");

//   const htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <style>
//     body { font-family: 'Segoe UI', sans-serif; background:#f4f6f9; margin:0; padding:0; }
//     .main { max-width:700px; margin:auto; background:#fff; border-radius:8px; overflow:hidden; padding:0 30px; }
//     .header { background:#27235c; color:#fff; padding:20px; }
//     .header h1 { margin:0; font-size:24px; }
//     .thankyou { padding:20px; font-size:16px; color:#333; }
//     .event-name { text-align:center; font-size:22px; font-weight:bold; margin:20px 0; }
//     .responses { margin:20px 0; }
//     .question { background:#f9f9ff; margin:10px 0; padding:15px 20px; border-radius:6px; }
//     .question p { margin:0 0 10px; font-weight:bold; }
//     .underline-field { border-bottom:1px solid #ccc; padding:5px 0; color:#333; }
//     label { display:flex; align-items:center; margin:5px 0; }
//     input[type=radio], input[type=checkbox] { margin-right:8px; accent-color:#27235c; }
//     table.matrix { width:100%; border-collapse:collapse; margin-top:10px; }
//     table.matrix th { background:#27235c; color:#fff; }
//     table.matrix th, table.matrix td { text-align:center; padding:5px; border:1px solid #ddd; }
//     table.matrix input[type=radio] { accent-color:#000; }
//     .confirm-container { padding:20px; text-align:left; }
//     .confirm-btn { background:#27235c; color:#fff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:16px; display:inline-block; }
//     .footer { background:#27235c; color:#fff; font-size:12px; padding:20px; text-align:center; }
//     @media (max-width:600px) {
//       .main { width:100%; border-radius:0; }
//       .event-name { font-size:18px; }
//     }
//   </style>
// </head>
// <body>
//   <div class="main">
//     <div class="header">
//       <h1>LivEAAZ360</h1>
//     </div>

//     <div class="thankyou">
//       Thanks for filling in <strong>${event.eventName}</strong> form.<br/>
//       Here’s what was received.
//     </div>

//     <div class="event-name">${event.eventName}</div>

//     <!-- Email question -->
//     <div class="question">
//       <p>Email <span style="color:red">*</span></p>
//       <div class="underline-field">${surveyUser.surveyUserEmail}</div>
//     </div>

//     <!-- Dynamic survey responses -->
//     <div class="responses">
//       ${responseBlocks}
//     </div>

//     <div class="confirm-container">
//       <a href="${confirmLink}" class="confirm-btn">✅ Confirm</a>
//     </div>

//     <div class="footer">
//       © 2026 LIVEEAZ • Need help? <a href="mailto:support@liveeaz.com" style="color:#fff;">support@liveeaz.com</a>
//     </div>
//   </div>
// </body>
// </html>
// `;

//   const mailOptions = {
//     from: `"LIVEEAZ Notifications" <support@liveeaz.com>`,
//     to: surveyUser.surveyUserEmail,
//     subject: "Confirm Your Survey Submission",
//     html: htmlContent,
//   };

//   try {
//     if (String(surveyUser.surveyUserEmail).toLowerCase() === "anonymous") {
//       logger.info("Survey summary email aborted: anonymous user");
//       return;
//     }
//     await transporter.sendMail(mailOptions);
//     logger.info("Survey summary email sent successfully", { to: surveyUser.surveyUserEmail });
//   } catch (error) {
//     logger.error("Survey summary email delivery failed", { error: error.message });
//     console.error(error);
//     throw new Error("Survey summary email delivery failed. Please try again.");
//   }
// };

exports.sendSurveySummaryEmail = async (
  surveyUser,
  event,
  enrichedResponses,
) => {
  const token = generateFeedbackToken(
    surveyUser.surveyUserEmail,
    event.eventId,
  );
  const encryptedToken = encryptToken(token);
  const confirmLink = `${process.env.FRONTEND_URL}/verifySurvey?token=${encryptedToken}`;

  const renderResponse = (r, idx) => {
    const question = r.surveyQuestion?.surveyQuestion || "Untitled Question";
    const type = r.surveyQuestion?.surveyQuestionType;
    const resp = r.surveyResponse;

    switch (type) {
      case "rating":
        const min = r.surveyQuestion?.scaleMin || 1;
        const max = r.surveyQuestion?.scaleMax || 5;
        return `
          <div class="question">
            <p>${idx + 1}. ${question}</p>
            <div class="rating-scale">
              ${Array.from({ length: max - min + 1 }, (_, i) => {
                const val = i + min;
                const isSelected = String(resp) === String(val);
                return `<span style="
                  display:inline-block;
                  padding:6px 10px;
                  margin-right:6px;
                  border-radius:4px;
                  background:${isSelected ? "#27235c" : "#eee"};
                  color:${isSelected ? "#fff" : "#333"};
                  font-weight:${isSelected ? "bold" : "normal"};
                ">${val}</span>`;
              }).join("")}
            </div>
            <div class="rating-value">Selected: ${resp}</div>
          </div>
        `;

      case "star":
        const maxStars = r.surveyQuestion?.scaleMax || 5;
        const selectedStars = Number(resp) || 0;
        return `
          <div class="question">
            <p>${idx + 1}. ${question}</p>
            <div class="star-scale">
              ${Array.from({ length: maxStars }, (_, i) => {
                const val = i + 1;
                const filled = val <= selectedStars;
                return `<span style="
                  font-size:24px;
                  color:${filled ? "#FFD700" : "#ccc"};
                ">&#9733;</span>`;
              }).join("")}
            </div>
            <div class="star-value">Selected: ${selectedStars}/${maxStars}</div>
          </div>
        `;

      case "comment":
        return `
          <div class="question">
            <p>${idx + 1}. ${question}</p>
            <div class="underline-field">${resp}</div>
          </div>
        `;

      case "checkbox":
        return `
          <div class="question">
            <p>${idx + 1}. ${question}</p>
            ${r.surveyQuestion.surveyCheckBoxOptions
              .map(
                (opt) => `
              <label>
                <input type="checkbox" disabled ${Array.isArray(resp) && resp.includes(opt) ? "checked" : ""}>
                ${opt}
              </label>
            `,
              )
              .join("")}
          </div>
        `;

      case "radio":
        return `
          <div class="question">
            <p>${idx + 1}. ${question}</p>
            ${r.surveyQuestion.surveyCheckBoxOptions
              .map(
                (opt) => `
              <label>
                <input type="radio" disabled ${resp === opt ? "checked" : ""}>
                ${opt}
              </label>
            `,
              )
              .join("")}
          </div>
        `;

      case "matrix": {
  const q = r.surveyQuestion || {};
  const scaleMin = Number(q.scaleMin ?? 1);
  const scaleMax = Number(q.scaleMax ?? 5);

  // Labels: use provided labels, else numeric strings
  const labels = Array.isArray(q.scaleLabels) && q.scaleLabels.length > 0
    ? q.scaleLabels.map(String)
    : Array.from({ length: (scaleMax - scaleMin + 1) }, (_, i) => String(scaleMin + i));

  const rows = Array.isArray(q.matrixQnLabels) ? q.matrixQnLabels : [];

  const selectedIndexFor = (valStr) => {
    if (valStr == null) return -1;
    // If custom labels exist and response is numeric ("4"), map to label index (4 - min)
    if (Array.isArray(q.scaleLabels) && q.scaleLabels.length > 0) {
      const n = Number(valStr);
      if (Number.isFinite(n)) {
        const idx = n - scaleMin;
        return Math.max(0, Math.min(labels.length - 1, idx));
      }
      // Fallback to label text match (rare)
      return labels.findIndex((l) => l === String(valStr));
    }
    // No custom labels: match numeric string directly
    return labels.findIndex((l) => l === String(valStr));
  };

  const dot = (selected) => (
    `<span style="
      display:inline-block;
      width:14px;height:14px;
      border-radius:50%;
      border:2px solid ${selected ? '#27235c' : '#999'};
      background:${selected ? '#27235c' : '#fff'};
    "></span>`
  );

  return `
    <div class="question">
      <p>${idx + 1}. ${q.surveyQuestion || "Untitled Question"}</p>
      <div style="width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;">
        <table class="matrix" role="table" aria-label="${(q.surveyQuestion || "Matrix").replace(/"/g, '&quot;')}" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;table-layout:fixed;">
          <tr>
            <th style="text-align:left;padding:6px;border:1px solid #ddd;min-width:120px;background:#27235c;color:#fff;">Aspect</th>
            ${labels.map((label) =>
              `<th style="text-align:center;padding:6px;border:1px solid #ddd;background:#27235c;color:#fff;">${String(label)}</th>`
            ).join("")}
          </tr>
          ${
            rows.map((rowLabel) => {
              const raw = r.surveyResponse?.[rowLabel]; // e.g., "4" or "Good"
              const valStr = raw != null ? String(raw) : null;
              const selIdx = selectedIndexFor(valStr);

              return `
                <tr>
                  <td style="text-align:left;padding:6px;border:1px solid #ddd;">${String(rowLabel)}</td>
                  ${labels.map((_, i) =>
                    `<td style="text-align:center;padding:6px;border:1px solid #ddd;">${dot(i === selIdx)}</td>`
                  ).join("")}
                </tr>
              `;
            }).join("")
          }
        </table>
      </div>
    </div>
  `;
}

      case "slider":
        const minSlider = r.surveyQuestion?.scaleMin || 0;
        const maxSlider = r.surveyQuestion?.scaleMax || 10;
        const sliderValue = Number(r.surveyResponse) || minSlider;
        const percentage =
          ((sliderValue - minSlider) / (maxSlider - minSlider)) * 100;

        return `
    <div class="question">
      <p>${idx + 1}. ${question}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percentage}%;background:#27235c;"></div>
      </div>
      <div class="slider-value">Selected: ${sliderValue}/${maxSlider}</div>
    </div>
  `;

      default:
        return `
          <div class="question">
            <p>${idx + 1}. ${question}</p>
            <div class="underline-field">${resp}</div>
          </div>
        `;
    }
  };

  const emailBlock = `
  <div class="question">
    <p>Email <span style="color:red">*</span></p>
    <div class="underline-field">
      ${surveyUser.surveyUserEmail}
    </div>
  </div>
  `;

  
const toTime = (dt) => {
  const t = dt ? new Date(dt).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
};

const sortedResponses = enrichedResponses.sort((a, b) => {
  const orderA = a?.surveyQuestion?.displayOrder ?? 0;
  const orderB = b?.surveyQuestion?.displayOrder ?? 0;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  const tA = toTime(a?.createdAt);
  const tB = toTime(b?.createdAt);
  if (tA !== tB) {
    return tA - tB;
  }

  const idA = Number(a?.surveyQuestion?.surveyQuestionId) || 0;
  const idB = Number(b?.surveyQuestion?.surveyQuestionId) || 0;
  if (idA !== idB) {
    return idA - idB;
  }

  const keyA = String(a?._id || a?.surveyResponseId || '');
  const keyB = String(b?._id || b?.surveyResponseId || '');
  return keyA.localeCompare(keyB);
});


  const responseBlocks = sortedResponses
    .map((r, idx) => renderResponse(r, idx))
    .join("");

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', sans-serif; background:#f4f6f9; margin:0; padding:0; }
    .main { max-width:700px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; }
    .header { background:#27235c; color:#fff; padding:20px; border-top-left-radius:12px; border-top-right-radius:12px; }
    .header h1 { margin:0; font-size:24px; }
    .thankyou { padding:20px; font-size:16px; color:#333; }
    .event-name { text-align:center; font-size:22px; font-weight:bold; margin:20px 0; }
    .responses { margin:20px; } /* tighter margins */
    .question { background:#f9f9ff; margin:10px 0; padding:15px; border-radius:6px; }
    .question p { margin:0 0 10px; font-weight:bold; }
    .underline-field { border-bottom:1px solid #ccc; padding:5px 0; color:#333; }
    label { display:flex; align-items:center; margin:5px 0; }
    input[type=radio], input[type=checkbox] { margin-right:8px; accent-color:#000; width:18px; height:18px; }
    table.matrix { width:100%; border-collapse:collapse; margin-top:10px; }
    table.matrix th { background:#27235c; color:#fff; }
    table.matrix th, table.matrix td { text-align:center; padding:5px; border:1px solid #ddd; }
    table.matrix input[type=radio] {
  accent-color: #000000; /* black dot for checked radios */
  width: 16px;
  height: 16px;
}
  .rating-value {
  margin-top: 4px;
  color: #666;
}
    .confirm-container { padding:20px; text-align:left; }
    .confirm-btn { background:#27235c; color:#fff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:16px; display:inline-block; }
    .footer { background:#27235c; color:#fff; font-size:12px; padding:20px; text-align:center; border-bottom-left-radius:12px; border-bottom-right-radius:12px; }
    @media (max-width:600px) {
      .main { width:100%; border-radius:0; }
      .event-name { font-size:18px; }
    }

    .slider-container {
  margin: 10px 0;
}

input[type=range] {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 4px;
  outline: none;
}
.slider-value {
  margin-top: 6px;
  color: #666;
  font-size: 14px;
}
  .progress-bar {
  width: 100%;
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #27235c;
}
.matrix-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table.matrix {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; 
}

table.matrix th, table.matrix td {
  text-align: center;
  padding: 6px;        
  border: 1px solid #ddd;
  font-size: 14px;
  word-break: break-word; 
}

table.matrix th:first-child,
table.matrix td:first-child {
  text-align: left;
  min-width: 120px;
}

.mx-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #999;
  background: #fff;
}

.mx-dot.selected {
  background: #FFD700; 
  border-color: #FFD700;
}

/* Mobile tweaks (supported by Gmail, Apple Mail; Outlook desktop may ignore) */
@media only screen and (max-width: 600px) {
  table.matrix th, table.matrix td {
    padding: 4px;
    font-size: 12px;
  }
  .mx-dot {
    width: 12px;
    height: 12px;
  }
}
  </style>
</head>
<body>
  <div class="main">
    <div class="header">
      <h1>LivEAAZ360</h1>
    </div>

    <div class="thankyou">
      Thanks for filling in <strong>${event.eventName}</strong> form.<br/>
      Here’s your response.
    </div>

    <div class="event-name">${event.eventName}</div>

    <!-- Dynamic survey responses -->
<div class="responses">
  ${emailBlock}
  ${responseBlocks}
</div>


    <div class="confirm-container">
      <a href="${confirmLink}" class="confirm-btn">✅ Confirm</a>
    </div>

    <div class="footer">
      © 2026 LIVEEAZ • Need help? <a href="mailto:support@liveeaz.com" style="color:#fff;">support@liveeaz.com</a>
    </div>
  </div>
</body>
</html>
`;

  const mailOptions = {
    from: `"LIVEEAZ Notifications" <support@liveeaz.com>`,
    to: surveyUser.surveyUserEmail,
    subject: "Confirm Your Survey Submission",
    html: htmlContent,
  };

  try {
    if (String(surveyUser.surveyUserEmail).toLowerCase() === "anonymous") {
      logger.info("Survey summary email aborted: anonymous user");
      return;
    }
    await transporter.sendMail(mailOptions);
    logger.info("Survey summary email sent successfully", {
      to: surveyUser.surveyUserEmail,
    });
  } catch (error) {
    logger.error("Survey summary email delivery failed", {
      error: error.message,
    });
    console.error(error);
    throw new Error("Survey summary email delivery failed. Please try again.");
  }
};
