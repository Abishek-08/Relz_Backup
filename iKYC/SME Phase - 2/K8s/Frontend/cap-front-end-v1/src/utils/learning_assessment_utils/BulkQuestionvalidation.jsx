import { toast } from "react-toastify";
import { utils, read } from "xlsx";

/**
 * @author karpagam.boothanathan
 * @since 04-09-2024
 * @version 9.0
 */

const expectedHeaders = [
    "Questions",
    "Complexity",
    "Question Type",
    "Topic",
    "Subtopic",
    "Mark",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Option E",
    "Option F",
    "Option G",
    "Option H",
    "Correct Answer",
];

export const validateFile = async (file, setSelectedFile, setPreviewDisabled) => {
    if (file.name.endsWith(".xlsx")) {
        try {
            const data = await file.arrayBuffer();
            const workbook = read(data, { type: "array" });
            const sheetNames = workbook.SheetNames;
            if (sheetNames.length > 0) {
                const sheet = workbook.Sheets[sheetNames[0]];
                const headers = utils.sheet_to_json(sheet, { header: 1 })[0];

                //  Print headers to console
                console.log("Uploaded Headers:", headers);

                // Trim and normalize headers for comparison
                const normalizedHeaders = headers.map(header => header?.toString().trim().toLowerCase());
                const isValid = validateHeaders(normalizedHeaders);

                if (isValid) {
                    setSelectedFile(file);
                    setPreviewDisabled(false);
                } else {
                    toast.error(
                        "File is not in the correct format.Please use the Excel template that has been provided.",
                        { position: "top-right" }
                    );
                    setSelectedFile(null);
                    setPreviewDisabled(true);
                }
            }
        } catch (error) {
            console.error("Error reading file:", error);
            toast.error("Failed to process file. Please try again.", {
                position: "top-right",
            });
            setSelectedFile(null);
            setPreviewDisabled(true);
        }
    } else {
        toast.error("Only .xlsx files are allowed!", { position: "top-right" });
        setSelectedFile(null);
        setPreviewDisabled(true);
    }
};

const validateHeaders = (headers) => {
    const trimmedHeaders = expectedHeaders.map(header => header.toLowerCase().trim());
    return JSON.stringify(headers) === JSON.stringify(trimmedHeaders);
};
