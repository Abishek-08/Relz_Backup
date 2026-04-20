// useCentrifuge.js
import { useEffect, useState } from "react";
import { connectCentrifuge, disconnectCentrifuge } from "./centrifugeManager";

export function useCentrifuge(isAuth) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      disconnectCentrifuge();
      setConnected(false);
      return;
    }

    const c = connectCentrifuge();

    const onConnected = () => setConnected(true);
    const onDisconnected = () => setConnected(false);

    c.on("connected", onConnected);
    c.on("disconnected", onDisconnected);

    return () => {
      c.off("connected", onConnected);
      c.off("disconnected", onDisconnected);
    };
  }, [isAuth]);

  return connected;
}
