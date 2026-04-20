import { getCentrifuge } from "./centrifugeClient";

const subs = {};

export function subscribe(channel, handlers = {}) {
  const centrifuge = getCentrifuge();

  if (!subs[channel]) {
    const sub = centrifuge.newSubscription(channel, { history: true });

    if (handlers.onPublication) sub.on("publication", handlers.onPublication);

    sub.on("subscribed", () => console.log("Subscribed:", channel));

    sub.subscribe();
    subs[channel] = sub;
  }

  return subs[channel];
}

export function unsubscribe(channel) {
  if (subs[channel]) {
    subs[channel].unsubscribe();
    delete subs[channel];
  }
}
