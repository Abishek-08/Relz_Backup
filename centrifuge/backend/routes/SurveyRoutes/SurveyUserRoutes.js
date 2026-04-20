const express = require('express');
const surveyUserController = require('../../controllers/SurveyController/SurveyUserController');
const { verifyToken } = require('../../middleware/authMiddleware');
const router = express.Router();

router.post(
  '/confirmSurveyStatus',
  surveyUserController.confirmSurveyStatus
);

router.use(verifyToken);

/**
 * Routes for Survey Users
 */
router.post(
  '/createSurveyUser',
  surveyUserController.createSurveyUser
);

router.get(
  '/getSurveyUserById/:surveyUserId',
  surveyUserController.getSurveyUserById
);

router.get(
  '/getAllSurveyUsers',
  surveyUserController.getAllSurveyUsers
);

router.put(
  '/updateSurveyUserById/:surveyUserId',
  surveyUserController.updateSurveyUserById
);

router.delete(
  '/deleteSurveyUserById/:surveyUserId',
  surveyUserController.deleteSurveyUserById
);

router.get(
  '/getSurveyUsersByEventId',
  surveyUserController.getSurveyUsersByEventId
);


router.get(
  '/getSurveyUserCount',
  surveyUserController.getSurveyUserCount
);

router.get(
  '/getSurveyAnonymousCount',
  surveyUserController.getSurveyAnonymousCount
);

router.get(
  '/getEmailVerification',
  surveyUserController.getEmailVerification
);

module.exports = router;
