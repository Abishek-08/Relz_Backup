import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "../../utils/useToast";
import relevantzLogo from "/assets/RelevantZLogo.png";
import r2dcLogo from "/assets/R2DClogo.png";
import liveaazLogo from "/assets/logorounded.png";

export const generateFeedbackPDF = async (
  feedbackData,
  overviewData,
  allUsers,
  uniqueQuestionsForDropdown,
  eventData,
) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const eventImagesURL = `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/images`;

    const ratingMap = {
      5: { label: "Excellent" },
      4: { label: "Good" },
      3: { label: "Average" },
      2: { label: "Poor" },
      1: { label: "Very Poor" },
    };

    const addHeaderForFirstPage = () => {
      doc.setFillColor(39, 76, 119);
      doc.rect(0, 0, pageWidth, 42, "F");

      const liveaazSize = 15;
      const liveaazX = margin - 9;
      const liveaazY = 4;

      doc.setDrawColor(255, 255, 255);
      doc.circle(
        liveaazX + liveaazSize / 2,
        liveaazY + liveaazSize / 2,
        liveaazSize / 2,
        "S",
      );

      doc.addImage(
        liveaazLogo,
        "JPEG",
        liveaazX,
        liveaazY,
        liveaazSize,
        liveaazSize,
      );

      const relevantzX = liveaazX + liveaazSize + 1;
      doc.addImage(relevantzLogo, "PNG", relevantzX, 6, 55, 15);

      doc.addImage(r2dcLogo, "JPEG", pageWidth - margin - 30, 0, 41, 41);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont(undefined, "bold");
      doc.text("EVENT FEEDBACK REPORT", pageWidth / 2, 40, { align: "center" });
      // doc.text('Event Feedback Report', 90, 22);
      doc.setDrawColor(39, 76, 119);
      doc.setLineWidth(0.5);
      doc.line(0, 42, pageWidth, 42);
    };

    // HEADER
    const addHeader = (pageNumber) => {
      doc.setFillColor(39, 76, 119);
      doc.rect(0, 0, pageWidth, 25, "F");

      const liveaazSize = 15;
      const liveaazX = margin - 8;
      const liveaazY = 5;

      doc.setDrawColor(255, 255, 255);
      doc.circle(
        liveaazX + liveaazSize / 2,
        liveaazY + liveaazSize / 2,
        liveaazSize / 2,
        "S",
      );

      doc.addImage(
        liveaazLogo,
        "JPEG",
        liveaazX,
        liveaazY,
        liveaazSize,
        liveaazSize,
      );

      const relevantzX = liveaazX + liveaazSize + 1;
      doc.addImage(relevantzLogo, "PNG", relevantzX, 7, 55, 15);

      doc.addImage(r2dcLogo, "JPEG", pageWidth - margin - 25, 0, 26, 25);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      // doc.text('Event Feedback Report', pageWidth / 2, 15, { align: 'center' });
      doc.text("Event Feedback Report", 90, 15);
      doc.setDrawColor(39, 76, 119);
      doc.setLineWidth(0.5);
      doc.line(0, 25, pageWidth, 25);
    };

    // FOOTER
    const addFooter = (pageNumber) => {
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(9);
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      doc.text(
        `Generated on ${date} at ${time} | Page ${pageNumber}`,
        margin,
        pageHeight - 8,
      );
    };

    // PAGE 1
    addHeaderForFirstPage(1);
    let yPosition = 46;
    const infoBoxHeight = 40;
    doc.setFillColor(219, 231, 243);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, infoBoxHeight, "F");

    const posterUrl = `${eventImagesURL}/${eventData.eventPoster}`;
    const posterSize = 35;
    const posterX = pageWidth - margin - posterSize - 3;
    const posterY = yPosition + 2.5;

    const loadImageAsBase64 = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };

    const posterBase64 = await loadImageAsBase64(posterUrl);
    doc.saveGraphicsState();
    doc.addImage(
      posterBase64,
      "JPEG",
      posterX,
      posterY,
      posterSize,
      posterSize,
    );
    doc.restoreGraphicsState();

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("Event Information", margin + 5, yPosition + 7);

    const labelX = margin + 5;
    const valueX = margin + 40;
    const lineHeight = 7;

    doc.setTextColor(39, 76, 119);
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Event Name", labelX, yPosition + 14);
    doc.setFont(undefined, "normal");
    doc.text(`: ${eventData.eventName}`, valueX, yPosition + 14);

    doc.setFont(undefined, "bold");
    doc.text("Event Organizer", labelX, yPosition + 14 + lineHeight);
    doc.setFont(undefined, "normal");
    doc.text(
      `: ${eventData.eventOrganizer}`,
      valueX,
      yPosition + 14 + lineHeight,
    );

    const rawDate = new Date(eventData.eventDate);
    const formattedDate = `: ${rawDate.getDate().toString().padStart(2, "0")} / ${(
      rawDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")} / ${rawDate.getFullYear()}`;

    doc.setFont(undefined, "bold");
    doc.text("Event Date", labelX, yPosition + 14 + lineHeight * 2);
    doc.setFont(undefined, "normal");
    doc.text(formattedDate, valueX, yPosition + 14 + lineHeight * 2);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Total Users : ${allUsers.length} | Total Questions : ${uniqueQuestionsForDropdown.length}`,
      labelX,
      yPosition + 14 + lineHeight * 3,
    );

    yPosition += infoBoxHeight + 10;

    yPosition += -4;

    doc.setTextColor(39, 76, 119);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Feedback Response Overview", margin, yPosition);
    yPosition += 4;

    const overviewTableData = overviewData.map((item) => {
      const percentage = Math.round(
        (item.count / (allUsers.length * uniqueQuestionsForDropdown.length)) *
          100,
      );
      return [item.label, item.count.toString(), `${percentage}%`];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [["Feedback Rating", "Total Count", "Percentage"]],
      body: overviewTableData,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [39, 76, 119],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        textColor: 0,
        fontSize: 9,
        cellPadding: 5,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "left" },
      },
      didDrawPage: (data) => {
        const pageNumber = doc.internal.getNumberOfPages(); // ✅ UPDATED
        addFooter(pageNumber); // ✅ UPDATED
      },
    });

    const emojiLabels = {
      5: {
        label: "Excellent",
        emoji: "🤩",
        color: "#0f766e",
        gradient: "linear-gradient(135deg, #0f766e, #2dd4bf)",
      },
      4: {
        label: "Good",
        emoji: "😊",
        color: "#22c55e",
        gradient: "linear-gradient(135deg, #15803d, #86efac)",
      },
      3: {
        label: "Average",
        emoji: "😐",
        color: "#fbbf24",
        gradient: "linear-gradient(135deg, #f59e0b, #fde68a)",
      },
      2: {
        label: "Poor",
        emoji: "😕",
        color: "#f97316",
        gradient: "linear-gradient(135deg, #ea580c, #fdba74)",
      },
      1: {
        label: "Very Poor",
        emoji: "😢",
        color: "#dc2626",
        gradient: "linear-gradient(135deg, #991b1b, #fca5a5)",
      },
    };

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    yPosition = doc.lastAutoTable.finalY + 10;

    doc.setTextColor(39, 76, 119);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Feedback Response Overview Chart", margin, yPosition);
    yPosition += 5;

    const chartWidth = pageWidth - 2 * margin;
    const chartHeight = 80;
    const chartX = margin;
    const chartY = yPosition;

    doc.setFillColor(255, 255, 255);
    doc.rect(chartX, chartY, chartWidth, chartHeight, "F");
    doc.setDrawColor(200, 200, 200);
    doc.rect(chartX, chartY, chartWidth, chartHeight, "S");

    const padding = 10;
    const leftPadding = 20;
    const bottomPadding = 15;
    const plotX = chartX + leftPadding;
    const plotY = chartY + padding;
    const plotWidth = chartWidth - leftPadding - padding;
    const plotHeight = chartHeight - padding - bottomPadding;

    const maxCount = Math.max(...overviewData.map((item) => item.count));
    const yAxisMax = Math.ceil(maxCount / 10) * 10;

    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(plotX, plotY, plotX, plotY + plotHeight);

    doc.line(plotX, plotY + plotHeight, plotX + plotWidth, plotY + plotHeight);

    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = Math.round((yAxisMax / ySteps) * i);
      const y = plotY + plotHeight - (plotHeight / ySteps) * i;
      doc.text(value.toString(), plotX - 3, y + 1, { align: "right" });

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(plotX, y, plotX + plotWidth, y);
    }

    const barCount = overviewData.length;
    const barSpacing = 5;
    const totalSpacing = barSpacing * (barCount + 1);
    const barWidth = (plotWidth - totalSpacing) / barCount;
    overviewData.forEach((item, index) => {
      const barHeight = (item.count / yAxisMax) * plotHeight;
      const barX = plotX + barSpacing + index * (barWidth + barSpacing);
      const barY = plotY + plotHeight - barHeight;
      const rating = item.rating || 5;
      const colorConfig = emojiLabels[rating];
      if (!colorConfig) {
        console.warn(`Missing color config for rating: ${rating}`);
        return;
      }

      const rgb = hexToRgb(colorConfig.color);
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(barX, barY, barWidth, barHeight, "F");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(item.count.toString(), barX + barWidth / 2, barY - 2, {
        align: "center",
      });

      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      const labelLines = doc.splitTextToSize(item.label, barWidth + 5);
      labelLines.forEach((line, lineIndex) => {
        doc.text(
          line,
          barX + barWidth / 2,
          plotY + plotHeight + 5 + lineIndex * 3,
          { align: "center" },
        );
      });
    });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Total Count", chartX + 3, chartY + chartHeight / 2, {
      align: "center",
      angle: 90,
    });

    doc.text(
      "Feedback Rating",
      chartX + chartWidth / 2,
      chartY + chartHeight - 2,
      {
        align: "center",
      },
    );
    yPosition = chartY + chartHeight + 5;

    // addFooter(1);

    // PAGE 2
    doc.addPage();
    // addHeader(2);
    addHeader();
    yPosition = 35;

    doc.setTextColor(39, 76, 119);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("User Response Details", margin, yPosition);
    yPosition += 8;

    // Rating Guide
    const guideBoxHeight = 12;
    const guideBoxY = yPosition;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, guideBoxY, pageWidth - 2 * margin, guideBoxHeight, "F");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, guideBoxY, pageWidth - 2 * margin, guideBoxHeight, "S");

    const ratingItems = [
      { color: [15, 118, 110], text: "5 - Excellent" },
      { color: [34, 197, 94], text: "4 - Very Good" },
      { color: [251, 191, 36], text: "3 - Good" },
      { color: [249, 115, 22], text: "2 - Poor" },
      { color: [220, 38, 38], text: "1 - Very Poor" },
    ];

    const availableWidth = pageWidth - 2 * margin - 10;
    const itemSpacing = availableWidth / ratingItems.length;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont(undefined, "bold");
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);

    ratingItems.forEach((item, index) => {
      const xPos = margin + 5 + index * itemSpacing;
      const yPos = guideBoxY + 7.5;
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.circle(xPos + 1, yPos - 1.5, 1.5, "F");
      doc.setTextColor(60, 60, 60);
      doc.text(item.text, xPos + 4, yPos);
    });
    yPosition = guideBoxY + guideBoxHeight + 8;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    uniqueQuestionsForDropdown.forEach((q, i) => {
      const questionText = `Q${i + 1}: ${q.question}`;
      const split = doc.splitTextToSize(questionText, pageWidth - 2 * margin);
      doc.text(split, margin, yPosition);
      yPosition += split.length * 6;
    });
    yPosition += 5;

    const userResponseTableHeaders = [
      "S.No",
      "Username",
      "Email",
      "Verified",
      ...uniqueQuestionsForDropdown.map((_, idx) => `Q${idx + 1}`),
    ];

    const userResponseTableData = allUsers.map((user, index) => {
      const userResponses = feedbackData.filter(
        (item) => item.feedbackUser.feedbackUserId === user.id,
      );
      const row = [
        index + 1,
        user.name?.toLowerCase() === "anonymous"
          ? "Anonymous"
          : user.name || "Unknown",
        user.email?.toLowerCase() === "anonymous"
          ? "Anonymous"
          : user.email || "-",
        user.isVerified ? "Yes" : "No",
      ];
      uniqueQuestionsForDropdown.forEach((question) => {
        const response = userResponses.find(
          (r) => r.feedbackQuestion.feedbackQuestion === question.question,
        );
        row.push(response ? response.feedbackResponse.toString() : "-");
      });
      return row;
    });

    autoTable(doc, {
      startY: yPosition,
      head: [userResponseTableHeaders],
      body: userResponseTableData,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [39, 76, 119],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        textColor: 0,
        fontSize: 8,
        cellPadding: 4,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { halign: "left", cellWidth: 25 },
        2: { halign: "left", cellWidth: 30 },
        3: { halign: "center", cellWidth: 15 },
      },

      // didDrawPage: () => {
      //   addFooter(2);
      // },
      didDrawPage: (data) => {
        const pageNumber = doc.internal.getNumberOfPages();
        addFooter(pageNumber);
      },
    });

    // PAGE 3
    doc.addPage();
    // addHeader(3);
    addHeader();
    let yPos = 35;

    doc.setTextColor(39, 76, 119);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Detailed Question-wise Feedback", margin, yPos);
    yPos += 10;

    uniqueQuestionsForDropdown.forEach((question, qIndex) => {
      doc.setTextColor(39, 76, 119);
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      const questionText = `Question ${qIndex + 1}: ${question.question}`;
      const splitQuestion = doc.splitTextToSize(
        questionText,
        pageWidth - 2 * margin,
      );
      doc.text(splitQuestion, margin, yPos);
      yPos += splitQuestion.length * 6 + 3;

      const questionData = feedbackData.filter(
        (item) => item.feedbackQuestion.feedbackQuestion === question.question,
      );

      const questionTableData = Object.keys(ratingMap)
        .reverse()
        .map((key) => {
          const { label } = ratingMap[key];
          const count = questionData.filter(
            (item) => item.feedbackResponse === +key,
          ).length;
          const percentage = Math.round((count / allUsers.length) * 100);
          return [label, count.toString(), `${percentage}%`];
        });

      autoTable(doc, {
        startY: yPos,
        head: [["Feedback Rating", "Total Count", "Percentage"]],
        body: questionTableData,
        margin: { left: margin, right: margin },
        headStyles: {
          fillColor: [39, 76, 119],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
        },
        bodyStyles: {
          textColor: 0,
          fontSize: 9,
          cellPadding: 5,
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "left" },
          2: { halign: "left" },
        },
        didDrawPage: (data) => {
          const pageNumber = doc.internal.getNumberOfPages(); // ✅ UPDATED
          addFooter(pageNumber); // ✅ UPDATED
        },
      });

      yPos = doc.lastAutoTable.finalY + 10;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        addHeader(3);
        yPos = 35;
      }
    });

    // addFooter(3);

    doc.save(`${eventData.eventName}_Feedback_Report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    useToast.error("Failed to generate PDF. Please try again.");
  }
};
