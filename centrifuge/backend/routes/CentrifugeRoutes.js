const express = require("express");
const router = express.Router();
const centrifugeController = require("../controllers/CentrifugeController");

router.post("/decrypt", centrifugeController.decryptToken);
router.post("/publish", centrifugeController.publish);
router.post("/registerFeedback", centrifugeController.registerFeedback);
router.post("/launchFeedback", centrifugeController.launchFeedback);
router.post("/registerSurvey", centrifugeController.registerSurvey);
router.post("/launchSurvey", centrifugeController.launchSurvey);
router.post(
  "/disconnect/user",
  centrifugeController.disconnectSubscrptionByUser,
);
router.post("/presence", centrifugeController.fetchPresenceInChannel);

module.exports = router;
