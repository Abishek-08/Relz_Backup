// import { Centrifuge } from "centrifuge";
// import { getDecryptToken } from "../services/Services";

// let CENTRIFUGE_URL = import.meta.env.VITE_CENTRIFUGO_WS_URL;
// let centrifuge = null;

// // 🔑 Token fetch (adjust URL)
// async function getToken() {
//   const res = await getDecryptToken({ token: localStorage.getItem("token") });

//   if (!res.ok) {
//     throw new Error("Token fetch failed");
//   }

//   const data = await res.json();
//   return data.token;
// }

// export function getCentrifuge() {
//   if (!centrifuge) {
//     centrifuge = new Centrifuge(CENTRIFUGE_URL, {
//       getToken,
//     });
//   }
//   return centrifuge;
// }

// export function disconnectCentrifuge() {
//   if (centrifuge) {
//     centrifuge.disconnect();
//     centrifuge = null; // 🔥 MUST reset
//   }
// }
