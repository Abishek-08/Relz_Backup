import { Centrifuge } from "centrifuge";
import { getDecryptToken } from "../services/Services";

let centrifuge = null;
let connected = false;
let subscriptions = {};
let listeners = new Set();
let CENTRIFUGE_URL = import.meta.env.VITE_CENTRIFUGO_WS_URL;

export function getCentrifuge() {
  return centrifuge;
}

export function isConnected() {
  return connected;
}

async function getToken() {
  const res = await getDecryptToken({ token: localStorage.getItem("token") });
  if (!res?.token) throw new Error("Token fetch failed");
  return res.token;
}

// export function connectCentrifuge() {
//   if (centrifuge) return centrifuge;

//   centrifuge = new Centrifuge(import.meta.env.VITE_CENTRIFUGO_WS_URL, {
//     getToken,
//   });

//   centrifuge.on("connecting", () => console.log("🔄 Centrifuge connecting..."));

//   centrifuge.on("connected", () => {
//     console.log("✅ Centrifuge CONNECTED");
//     connected = true;
//     listeners.forEach((fn) => fn(true));
//   });

//   centrifuge.on("disconnected", (ctx) => {
//     console.log("❌ Centrifuge DISCONNECTED:", ctx.reason);
//     connected = false;
//     listeners.forEach((fn) => fn(false));
//   });

//   centrifuge.on("error", (err) => console.error("🔥 Centrifuge error", err));

//   centrifuge.connect();
//   return centrifuge;
// }

export function connectCentrifuge() {
  if (centrifuge) {
    console.log("⚠️ Centrifuge instance exists, reconnecting...");
    centrifuge.disconnect();
    centrifuge = null;
  }

  centrifuge = new Centrifuge(CENTRIFUGE_URL, {
    getToken,
  });

  centrifuge.on("connected", () => {
    console.log("✅ Centrifugo connected");
    connected = true;
  });

  centrifuge.on("disconnected", (ctx) => {
    console.log("❌ Centrifugo disconnected:", ctx.reason);
    connected = false;
  });

  centrifuge.connect();
  return centrifuge;
}

export function disconnectCentrifuge() {
  if (!centrifuge) return;

  Object.values(subscriptions).forEach((s) => s.unsubscribe());
  subscriptions = {};

  centrifuge.disconnect();
  centrifuge = null;
  connected = false;

  console.log("🛑 Centrifuge destroyed");
}

export function subscribe(channel, handlers = {}) {
  if (!centrifuge) throw new Error("Centrifuge not connected");

  if (subscriptions[channel]) return subscriptions[channel];

  const sub = centrifuge.newSubscription(channel, { history: true });

  if (handlers.onPublication) sub.on("publication", handlers.onPublication);

  sub.on("subscribed", () => console.log("📡 Subscribed:", channel));

  const presence = sub.presence();

  sub.on("join", (ctx) => {
    console.log("join-users: ", ctx.info);
  });

  sub.on("leave", (ctx) => {
    console.log("leave-users: ", ctx.info.client);
  });

  sub.on("unsubscribed", () => console.log("🚫 Unsubscribed:", channel));

  sub.subscribe();
  subscriptions[channel] = sub;
  return sub;
}

export function unsubscribe(channel) {
  subscriptions[channel]?.unsubscribe();
  delete subscriptions[channel];
}

export function onConnectionChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
