// import React, { useState } from "react";
// import { Centrifuge } from "centrifuge";

// const App = () => {
//   const [disp, setDisp] = useState("");
//   const [disp1, setDisp1] = useState("");
//   const [disp2, setDisp2] = useState("");
//   const [disp3, setDisp3] = useState("");

//   async function getToken() {
//     // Fetch your application backend.
//     const res = await fetch("http://localhost:5050/token");
//     if (!res.ok) {
//       if (res.status === 403) {
//         // Return special error to not proceed with token refreshes,
//         // client will be disconnected.
//         throw new Centrifuge.UnauthorizedError();
//       }
//       // Any other error thrown will result into token refresh re-attempts.
//       throw new Error(`Unexpected status code ${res.status}`);
//     }
//     const data = await res.json();
//     return data.token;
//   }

//   const centrifuge = new Centrifuge(
//     "ws://localhost:8070/connection/websocket",
//     {
//       getToken: getToken,
//     },
//   );

//   // Trigger actual connection establishement.
//   centrifuge.connect();

//   centrifuge
//     .on("connecting", function (ctx) {
//       console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
//     })
//     .on("connected", function (ctx) {
//       console.log(`connected over ${ctx.transport}`);
//     })
//     .on("disconnected", function (ctx) {
//       console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
//     })
//     .connect();

//   // Allocate Subscription to a channel.
//   const sub = centrifuge.newSubscription("demo-channel-0");

//   const sub1 = centrifuge.newSubscription("demo-channel-1");

//   const factsSub = centrifuge.newSubscription("facts:fact-channel", {
//     history: true,
//   });

//   const gossipSub = centrifuge.newSubscription("gossips:gossips-channel", {
//     history: true,
//   });

//   sub
//     .on("publication", function (ctx) {
//       console.log("publication: ", ctx.data);
//       setDisp(ctx.data.value);
//     })
//     .on("subscribing", function (ctx) {
//       console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
//     })
//     .on("subscribed", function (ctx) {
//       console.log("subscribed", ctx);
//     })
//     .on("unsubscribed", function (ctx) {
//       console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
//     })
//     .subscribe();

//   sub1
//     .on("publication", function (ctx) {
//       console.log("publication: ", ctx.data);
//       setDisp1(ctx.data.value);
//     })
//     .on("subscribing", function (ctx) {
//       console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
//     })
//     .on("subscribed", function (ctx) {
//       console.log("subscribed", ctx);
//     })
//     .on("unsubscribed", function (ctx) {
//       console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
//     })
//     .subscribe();

//   factsSub
//     .on("publication", function (ctx) {
//       console.log("publication: ", ctx.data);
//       setDisp2(ctx.data.value);
//     })
//     .on("subscribing", function (ctx) {
//       console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
//     })
//     .on("subscribed", function (ctx) {
//       console.log("subscribed", ctx);
//     })
//     .on("unsubscribed", function (ctx) {
//       console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
//     })
//     .subscribe();

//   gossipSub
//     .on("publication", function (ctx) {
//       console.log("publication: ", ctx.data);
//       setDisp3(ctx.data.value);
//     })
//     .on("subscribing", function (ctx) {
//       console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
//     })
//     .on("subscribed", function (ctx) {
//       console.log("subscribed", ctx);
//     })
//     .on("unsubscribed", function (ctx) {
//       console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
//     })
//     .subscribe();

//   return (
//     <div>
//       <h2>channel-1: {disp}</h2> <br />
//       <h2>channel-2: {disp1}</h2>
//       <br />
//       <h2>Fact-channel: {disp2}</h2>
//       <br />
//       <h2>Gossip-channel: {disp3}</h2>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import { Centrifuge } from "centrifuge";

const App = () => {
  const [disp, setDisp] = useState("");
  const [disp1, setDisp1] = useState("");
  const [disp2, setDisp2] = useState("");
  const [disp3, setDisp3] = useState("");

  async function getToken() {
    const res = await fetch("http://localhost:5050/token");
    if (!res.ok) {
      if (res.status === 403) {
        throw new Centrifuge.UnauthorizedError();
      }
      throw new Error(`Unexpected status code ${res.status}`);
    }
    const data = await res.json();
    return data.token;
  }

  useEffect(() => {
    const centrifuge = new Centrifuge(
      "ws://localhost:8070/connection/websocket",
      {
        getToken: getToken,
      },
    );

    centrifuge
      .on("connecting", (ctx) => {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on("connected", (ctx) => {
        console.log(`connected over ${ctx.transport}`);
      })
      .on("disconnected", (ctx) => {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
      });

    centrifuge.connect();

    // Subscriptions
    const sub = centrifuge.newSubscription("demo-channel-0");
    sub.on("publication", (ctx) => setDisp(ctx.data.value)).subscribe();

    const sub1 = centrifuge.newSubscription("demo-channel-1");
    sub1.on("publication", (ctx) => setDisp1(ctx.data.value)).subscribe();

    const factsSub = centrifuge.newSubscription("facts:fact-channel", {
      history: true,
    });
    factsSub.on("publication", (ctx) => setDisp2(ctx.data.value)).subscribe();

    const gossipSub = centrifuge.newSubscription("gossips:gossips-channel", {
      history: true,
    });
    gossipSub.on("publication", (ctx) => setDisp3(ctx.data.value)).subscribe();

    // Cleanup on unmount
    return () => {
      centrifuge.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>channel-1: {disp}</h2>
      <h2>channel-2: {disp1}</h2>
      <h2>Fact-channel: {disp2}</h2>
      <h2>Gossip-channel: {disp3}</h2>
    </div>
  );
};

export default App;
