import {
  offlineFeedbackSubmissionService,
  offlineSurveySubmissionService,
} from "../../services/Services";
import axiosInstance from "../../utils/axiosInstance";
import {
  addToQueue,
  clearQueue,
  getQueue,
  removeFromQueue,
} from "../db/indexedDB";

const MAX_RETRIES = 5;

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function sendDataToOfflineQueue(data) {
  if (!navigator.onLine) {
    console.log("📴 Offline → saving to IndexedDB");
    await addToQueue(data);
    return;
  }

  try {
    // await fetch(FEEDBACK_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "pwa-mode": "online",
    //     "Idempotency-Key": null,
    //   },
    //   body: JSON.stringify(data),
    // });
    return await axiosInstance.post(FEEDBACK_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        "pwa-mode": "online",
        "Idempotency-Key": null,
      },
    });
  } catch (err) {
    console.log("❌ Network error → saving to IndexedDB");
    await addToQueue(data);
  }
}

// export async function flushQueue(updateUI) {
//   if (!navigator.onLine) return;

//   const items = await getQueue();

//   // for (const item of items) {
//   //   try {
//   //     if (updateUI) {
//   //       updateUI({ status: "syncing" });
//   //     }

//   //     // await fetch(FEEDBACK_API_URL, {
//   //     //   method: "POST",
//   //     //   headers: {
//   //     //     "Content-Type": "application/json",
//   //     //     "pwa-mode": "offline",
//   //     //     "Idempotency-Key": item.idempotencyKey,
//   //     //   },
//   //     //   body: JSON.stringify(item.data),
//   //     // });

//   //     saveOfflineFeedbackUser(item);

//   //     await removeFromQueue(item.id);

//   //     if (updateUI) {
//   //       updateUI({ status: "synced" });
//   //     }
//   //   } catch (err) {
//   //     item.retries++;

//   //     if (item.retries >= MAX_RETRIES) {
//   //       if (updateUI) {
//   //         updateUI({ status: "failed" });
//   //       }
//   //       console.error("❌ Max retries reached", item.id);
//   //       return;
//   //     }

//   //     const backoff = Math.pow(2, item.retries) * 1000;
//   //     console.log(`⏳ Retry in ${backoff}ms`);
//   //     await delay(backoff);

//   //     return; // wait until next online event
//   //   }
//   // }

//   console.log("back-online-syncing");

//   await axiosInstance
//     .post(FEEDBACK_API_URL, items)
//     .then(async () => {
//       await clearQueue();
//     })
//     .catch((err) => console.log("PWA-ERROR: ", err));
// }

export async function flushQueue() {
  if (!navigator.onLine) return;

  const items = await getQueue();
  if (!items.length) return;

  const feedbackItems = items.filter((item) => item.data.module === "feedback");
  const surveyItems = items.filter((item) => item.data.module === "survey");

  console.log("feedbackItem: ", feedbackItems);
  console.log("surveyItem: ", surveyItems);

  console.log("back-online-syncing");

  try {
    if (feedbackItems.length > 0) {
      offlineFeedbackSubmissionService(feedbackItems);
    }
    if (surveyItems.length > 0) {
      offlineSurveySubmissionService(surveyItems);
    }

    await clearQueue(); // clear after successful sync
  } catch (err) {
    console.error("Sync failed", err);
  }
}
