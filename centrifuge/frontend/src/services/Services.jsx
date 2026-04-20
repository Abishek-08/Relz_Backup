import axiosInstance from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const login = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/login`,
      FormData,
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addEventCategory = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/eventCategory/addEventCategory`,
      FormData,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEventCategoryById = async (eventCategoryId) => {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/eventCategory/deleteEventCategoryById`,
      {
        params: { eventCategoryId },
      },
    );
    return response;
  } catch (error) {
    console.error(
      "Delete Event Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getEventCategoryByEventCategoryId = async (eventCategoryId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/eventCategory/getEventCategoryById`,
      {
        params: { eventCategoryId: eventCategoryId },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllEventCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/eventCategory/getAllEventCategories`,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addEvent = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/event/addEvent`,
      FormData,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/event/getEventById`, {
      params: { eventId: eventId },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const updateEvent = async (eventId, updatedData) => {
//     try {
//       const response = await axiosInstance.put(`${BASE_URL}/event/updateEvent`, {
//         params: { eventId: eventId },
//         ...updatedData,
//       });
//       return response;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

export const updateEvent = async (eventId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/event/updateEvent`,
      updatedData,
      {
        params: { eventId },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/event/deleteEventById`,
      {
        params: { eventId: eventId },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEventsByEventCategoryId = async (eventCategoryId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/event/getEventsByEventCategoryId`,
      {
        params: {
          eventCategoryId: eventCategoryId,
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addResource = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/resource/addResource`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateResource = async (resouceId, FormData) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/resource/updateResource`,
      FormData,
      {
        params: {
          resourceId: resouceId,
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const submitEventCategory = async (
  formData,
  eventCategoryId,
  isEditing,
) => {
  try {
    const backend = import.meta.env.VITE_BACKEND_BASE_URL;

    const url = `${backend}/EventCategory/updateEventCategory?eventCategoryId=${eventCategoryId}`;

    const response = await axiosInstance.put(url, formData);

    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Submit Category Error:", error);
    throw error;
  }
};

export const getResourcesByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/resource/getResourceByEventId`,
      {
        params: {
          eventId: eventId,
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addGenderCount = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/genderCount/saveGenderCount`,
      FormData,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getGenderAnalytics = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/genderCount/getGenderCountByEventId`,
      {
        params: {
          eventId: eventId,
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addFeedbackQuestion = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/feedback/createFeedback`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFeedbackQuestionsByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/feedback/getFeedbackQuestionsByEventId`,
      {
        params: {
          eventId: eventId,
        },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const doAuthenticationForClosingFeedback = async (
  userEmail,
  userPassword,
) => {
  try {
    const payloadData = {
      email: userEmail,
      password: userPassword,
    };

    const response = await axiosInstance.post(
      `${BASE_URL}/auth/feedbackLogin`,
      payloadData,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addFeedbackUserDetails = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/feedbackUser/saveFeedbackUser`,
      FormData,
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addFeedbackResponseDetails = async (FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/feedbackResponse/saveFeedbackResponse`,
      FormData,
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFeedbackResponsesByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/feedbackResponse/getUserResponseByEventId`,
      {
        params: {
          eventId: eventId,
        },
      },
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFeedbackResponseCountByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/feedbackResponse/getFeedbackResponseCountByEventId`,
      {
        params: {
          eventId: eventId,
        },
      },
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchEmployeesByEmail = async (email) => {
  try {
    const response = await axiosInstance.get("/emp/searchEmployees", {
      params: { keyword: email },
    });
    return response;
  } catch (error) {
    console.error("Error searching employees:", error);
    throw error;
  }
};

export const getAllFeedbackQuestions = async () => {
  try {
    const response = await axiosInstance.get(
      "/feedback/getAllFeedbackQuestions",
    );
    return response;
  } catch (error) {
    console.error("Error fetching feedback questions:", error);
    throw error;
  }
};

export const updateFeedbackInformation = async (eventId, payload) => {
  try {
    const response = await axiosInstance.put(
      `/feedbackInformation/updateFeedbackInfoById?eventId=${eventId}`,
      payload,
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllSocketsByOrganizerEmail = async (email) => {
  try {
    const response = await axiosInstance.get(
      "/socket/findAllSocketsByOrganizerEmail",
      {
        params: { email },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all sockets:", error);
    throw error;
  }
};

export const getAllSocketCountByOrganizerEmail = async (email) => {
  try {
    const response = await axiosInstance.get(
      "/socket/getAllSocketCountsByOrganizerEmail",
      {
        params: { email },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching total socket count:", error);
    throw error;
  }
};

export const getActiveSocketCountByOrganizerEmail = async (email) => {
  try {
    const response = await axiosInstance.get(
      "/socket/getActiveUserCountsByOrganizerEmail",
      {
        params: { email },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active socket count:", error);
    throw error;
  }
};

export const getInactiveSocketCountByOrganizerEmail = async (email) => {
  try {
    const response = await axiosInstance.get(
      "/socket/getInActiveUserCountsByOrganizerEmail",
      {
        params: { email },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inactive socket count:", error);
    throw error;
  }
};

export const getFeedbackAnonymousCountByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      "/feedbackUser/getFeedbackAnonymousCountByEventId",
      {
        params: { eventId },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching anonymous count:", error);
    throw error;
  }
};

export const getFeedbackUsersCountByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      "/feedbackUser/getFeedbackTotalUserCountByEventId",
      {
        params: { eventId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

export const terminateSockets = async (socketIds) => {
  try {
    const response = await axiosInstance.post("/socket/socketTermination", {
      socket: socketIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error terminating sockets:", error);
    throw error;
  }
};

export const getFeedbackInformationByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(
      "/feedbackInformation/getFeedbackInformationByEventId",
      {
        params: { eventId },
      },
    );
    return response;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

export const getQuestionsByEventCategoryAndEventId = async (
  eventCategoryId,
  eventId,
) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/feedback/getQuestionByEventCategoryAndEventId`,
      {
        params: {
          eventCategoryId,
          eventId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const getQuestionsByEventCategory = async (eventCategoryId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/feedback/getQuestionByEventCategoryId`,
      {
        params: { eventCategoryId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error in getQuestionsByEventCategory:", error);
    throw error;
  }
};

export const getEmailVerification = async (email, eventId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/feedbackUser/getEmailVerification`,
      {
        params: { email, eventId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error in getEmailVerification:", error);
    throw error;
  }
};

export const updateFeedbackReOpen = async (eventId, payload) => {
  try {
    const response = await axiosInstance.put(
      "/feedbackInformation/reOpenFeedbackByEventId",
      payload,
      {
        params: {
          eventId: eventId,
        },
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const checkEventManagerByEmail = async (email) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/eventManager/checkEventManagerByEmail`,
      { params: { email } },
    );
    return response;
  } catch (error) {
    console.error("Check Event Manager By Email Error:", error);
    throw error;
  }
};

// ✅ Create Event Manager
export const createEventManager = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/eventManager/createEventManager`,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Create Event Manager Error:", error);
    throw error;
  }
};

// ✅ Get All Event Managers
export const getAllEventManagers = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/eventManager/getAllEventManager`,
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Get All Event Managers Error:", error);
    throw error;
  }
};

// ✅ Get Event Manager By Id
export const getEventManagerById = async (eventManagerId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/eventManager/getEventManagerById`,
      {
        params: { eventManagerId },
      },
    );
    return response;
  } catch (error) {
    console.error("Get Event Manager By Id Error:", error);
    throw error;
  }
};

// ✅ Update Event Manager
export const updateEventManager = async (eventManagerId, formData) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/eventManager/updateEventManager`,
      formData,
      {
        params: { eventManagerId },
      },
    );
    return response;
  } catch (error) {
    console.error("Update Event Manager Error:", error);
    throw error;
  }
};

// ✅ Update Account Status (Activate/Deactivate)
export const updateAccountStatus = async (eventManagerId, accountStatus) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/eventManager/updateAccountStatus`,
      null,
      {
        params: { eventManagerId, accountStatus },
      },
    );
    return response;
  } catch (error) {
    console.error("Update Account Status Error:", error);
    throw error;
  }
};

export const updateEventStatusById = async (eventId, updatedData) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL}/event/updateEventStatusByEventId`,
      updatedData,
      {
        params: { eventId },
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateGenderCountByEventId = async (
  eventId,
  resourceType,
  updatedData,
) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/genderCount/updateGenderCountByEventId`,
      updatedData,
      {
        params: {
          eventId,
          resourceType,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error updating gender count:", error);
    throw error;
  }
};

export const saveGenderCount = async (eventId, resourceType, data) => {
  try {
    const response = await updateGenderCountByEventId(
      eventId,
      resourceType,
      data,
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const response = await addGenderCount(data);
      return response;
    } else {
      throw error;
    }
  }
};

//survey
export const confirmSurvey = async (token) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/surveyUser/confirmSurveyStatus?token=${token}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSurveyQuestionsByEventCategoryId = async (eventCategoryId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/surveyQuestion/getSurveyQuestionsByEventCategoryId/${eventCategoryId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error in getSurveyQuestionsByEventCategoryId:", error);
    throw error;
  }
};

export const getSurveyQuestionsByEventAndEventCategoryId = async (
  eventCategoryId,
  eventId,
) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/surveyQuestion/getSurveyQuestionsByEventCategoryAndEventId/${eventCategoryId}/${eventId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in getSurveyQuestionsByEventAndEventCategoryId:",
      error,
    );
    throw error;
  }
};

/**
 * Add survey questions for an event and launch feedback
 * @param {Object} payload - full survey payload
 * Example:
 * {
 *   eventId: 23,
 *   questions: [...],
 *   surveyOwnerEmail: "nagarjun.suresh@relevantz.com",
 *   masterSocket: "23jkn",
 *   isAnonymousSurvey: false,
 *   thankyouTimeout: 3,
 *   idleTimeoutValue: 2,
 *   idleTimeoutUnit: "minutes",
 *   backgroundTheme: "theme.png" // optional
 * }
 */
export const addSurveyQuestionsAndLaunchFeedback = async (
  questionAndSurveyInformationData,
) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/surveyQuestion/addSurveyQuestionForEvent`,
      questionAndSurveyInformationData,
    );
    return response.data;
  } catch (error) {
    console.error("Error in addSurveyQuestionForEvent:", error);
    throw error;
  }
};

export const getAllEventCategoriesMinimal = async () => {
  try {
    const res = await axiosInstance.get(
      `${BASE_URL}/eventCategory/getAllEventCategoriesMinimal`,
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching event categories:", err);
    throw err;
  }
};

export const getEventsByCategoryMinimal = async (eventCategoryId) => {
  try {
    const res = await axiosInstance.get(
      `${BASE_URL}/event/getEventsByCategoryMinimal/${eventCategoryId}`,
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching events by category:", err);
    throw err;
  }
};

export async function verifySurveyUser(email, eventId) {
  try {
    const res = await axiosInstance.get("/surveyUser/getEmailVerification", {
      params: { email, eventId },
    });
    const msg = (
      res?.data?.message ||
      res?.data?.data?.message ||
      ""
    ).toLowerCase();
    if (msg.includes("already")) return { status: "already-submitted" };
    if (msg.includes("not authorized")) return { status: "not-authorized" };
    if (res?.data?.data) return { status: "already-submitted" };
    return { status: "eligible" };
  } catch (e) {
    if (e?.response?.status === 404) return { status: "eligible" };
    return { status: "eligible" };
  }
}

// ----- HELPERS -----

const downloadBlob = (blob, filenameFallback = "download") => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filenameFallback;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const extractFilename = (headers, fallback) => {
  const cd = headers["content-disposition"];
  if (!cd) return fallback;
  const match = /filename="?([^"]+)"?/i.exec(cd);
  return (match && match[1]) || fallback;
};

/**
 * Get aggregated survey report (with optional date range)
 * GET /:tenant/surveyReport/:eventId?from&to
 */
export const getAggregatedReport = async (eventId, { from, to } = {}) => {
  const { data } = await axiosInstance.get(`/surveyReport/${eventId}`, {
    params: { from, to },
  });
  return data;
};

/**
 * Get individual responses (paginated)
 * GET /:tenant/surveyReport/:eventId/userResponses?page&limit
 */
export const getIndividualResponses = async (
  eventId,
  { page = 1, limit = 20 } = {},
) => {
  const { data } = await axiosInstance.get(
    `/surveyReport/${eventId}/userResponses`,
    { params: { page, limit } },
  );
  return data;
};

// ----- EXPORTS (respect view & date filters where supported) -----

/**
 * Aggregated CSV
 * GET /:tenant/surveyReport/:eventId/export/csv?from&to
 */
export const exportAggregatedCSV = async (eventId, { from, to } = {}) => {
  const res = await axiosInstance.get(`/surveyReport/${eventId}/export/csv`, {
    params: { from, to },
    responseType: "blob",
  });
  const filename = extractFilename(res.headers, "survey-aggregated.csv");
  downloadBlob(res.data, filename);
  return filename;
};

/**
 * Aggregated Excel
 * GET /:tenant/surveyReport/:eventId/export/excel?from&to
 */
export const exportAggregatedExcel = async (eventId, { from, to } = {}) => {
  const res = await axiosInstance.get(`/surveyReport/${eventId}/export/excel`, {
    params: { from, to },
    responseType: "blob",
  });
  const filename = extractFilename(res.headers, "survey-aggregated.xlsx");
  downloadBlob(res.data, filename);
  return filename;
};

/**
 * Aggregated PDF
 * GET /:tenant/surveyReport/:eventId/export/pdf?from&to
 */
export const exportAggregatedPDF = async (eventId, { from, to } = {}) => {
  const res = await axiosInstance.get(`/surveyReport/${eventId}/export/pdf`, {
    params: { from, to },
    responseType: "blob",
  });
  const filename = extractFilename(res.headers, "survey-aggregated.pdf");
  console.log("Pdf header res:", res.headers);
  downloadBlob(res.data, filename);
  return filename;
};

/**
 * Individual CSV
 * GET /:tenant/surveyReport/:eventId/export/individual/csv
 */
export const exportIndividualCSV = async (eventId) => {
  const res = await axiosInstance.get(
    `/surveyReport/${eventId}/export/individual/csv`,
    { responseType: "blob" },
  );
  const filename = extractFilename(res.headers, "survey-individual.csv");
  downloadBlob(res.data, filename);
  return filename;
};

/**
 * Individual Excel
 * GET /:tenant/surveyReport/:eventId/export/individual/excel
 */
export const exportIndividualExcel = async (eventId) => {
  const res = await axiosInstance.get(
    `/surveyReport/${eventId}/export/individual/excel`,
    { responseType: "blob" },
  );
  const filename = extractFilename(res.headers, "survey-individual.xlsx");
  downloadBlob(res.data, filename);
  return filename;
};

/**
 * Individual PDF
 * GET /:tenant/surveyReport/:eventId/export/individual/pdf
 */
export const exportIndividualPDF = async (eventId) => {
  const res = await axiosInstance.get(
    `/surveyReport/${eventId}/export/individual/pdf`,
    { responseType: "blob" },
  );
  const filename = extractFilename(res.headers, "survey-individual.pdf");
  downloadBlob(res.data, filename);
  return filename;
};

// --- SURVEY COUNTS ---
export async function getSurveyUserCount(eventId) {
  try {
    const res = await axiosInstance.get(`/surveyUser/getSurveyUserCount`, {
      params: { eventId },
    });
    return res.data?.count ?? 0;
  } catch (err) {
    throw new Error(
      `getSurveyUserCount failed: ${err.response?.status || err.message}`,
    );
  }
}

export async function getSurveyAnonymousCount(eventId) {
  try {
    const res = await axiosInstance.get(`/surveyUser/getSurveyAnonymousCount`, {
      params: { eventId },
    });
    return res.data?.count ?? 0;
  } catch (err) {
    throw new Error(
      `getSurveyAnonymousCount failed: ${err.response?.status || err.message}`,
    );
  }
}

// --- Survey Responses List ---
export async function getSurveyResponsesByEventId(eventId) {
  try {
    const res = await axiosInstance.get(
      `/surveyResponse/getUserSurveyResponsesByEventId`,
      { params: { eventId } },
    );
    return res.data;
  } catch (err) {
    throw new Error(
      `getSurveyResponsesByEventId failed: ${err.response?.status || err.message}`,
    );
  }
}

/** * Update survey information for a given eventId * @param {string|number} eventId - The event ID (e.g. 28) * @param {object} payload - The data to update * @returns {Promise<object>} - Updated survey information */
export async function updateSurveyInformation(eventId, payload) {
  try {
    const res = await axiosInstance.put(
      `/surveyInformation/updateSurveyInformation/${eventId}`,
      payload,
    );
    return res.data;
  } catch (err) {
    throw new Error(
      `update SurveyInformation failed: ${err.response?.status || err.message}`,
    );
  }
}

// PWA Implementation sevices
export async function offlineFeedbackSubmissionService(queueData) {
  try {
    await axiosInstance.post(`${BASE_URL}/offline/feedbackSubmit`, queueData);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function offlineSurveySubmissionService(queueData) {
  try {
    await axiosInstance.post(`${BASE_URL}/offline/surveySubmit`, queueData);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getDecryptToken(token) {
  try {
    const res = await axiosInstance.post(
      `${BASE_URL}/centrifuge/decrypt`,
      token,
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function registerFeedback(email) {
  try {
    const res = await axiosInstance.post(
      `${BASE_URL}/centrifuge/registerFeedback`,
      { email },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function registerSurvey(email) {
  try {
    const res = await axiosInstance.post(
      `${BASE_URL}/centrifuge/registerSurvey`,
      { email },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function launchSurveyService(email) {
  try {
    const res = await axiosInstance.post(
      `${BASE_URL}/centrifuge/launchSurvey`,
      { email },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function launchFeedbackService(email) {
  try {
    const res = await axiosInstance.post(
      `${BASE_URL}/centrifuge/launchFeedback`,
      { email },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllPresenceConnections() {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/centrifuge/presence`, {
      channel: "SurveyNS:launchSurvey",
    });
    console.log("sr: ", res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function disconnectCentrifugeConnections(disconnectEmailList) {
  console.log("dis: ", disconnectEmailList);
  try {
    const res = await axiosInstance.post(
      `${BASE_URL}/centrifuge/disconnect/user`,
      { disconnectEmailList },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
