const feedbackResponseService = require('../services/FeedbackResponseService');

// exports.createFeedbackResponse = async (req, res) => {
//     try {
//         const feedbackResponse = await feedbackResponseService.createFeedbackResponse(req.body);
//         res.status(201).json(feedbackResponse);
//     }
//     catch (err) {
//         res.status(400).json({
//             message: err.message
//         })
//     }
// };

exports.createFeedbackResponses = async (req, res) => {
  try {
    const { feedbackUserId, eventId, responses, isAnonymous } = req.body;
    const savedResponses = await feedbackResponseService.createMultipleFeedbackResponses(feedbackUserId, eventId, responses, isAnonymous);
    res.status(201).json({
      message: 'Feedback submitted successfully',
      savedResponses
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserResponseByEventId = async (req, res) => {
  const { eventId } = req.query;
  try {
    const feedbackResponse = await feedbackResponseService.getUserResponseByEventId(eventId);
    res.status(200).json(feedbackResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFeedbackResponseCount = async (req, res) => {
  const { eventId } = req.query;
  try {
    const count = await feedbackResponseService.getFeedbackResponseCount(eventId);
    res.status(200).json(count);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



  exports.getUserResponseByEventId = async(req,res) => {
    const {eventId} = req.query;
    try{
      const feedbackResponse = await feedbackResponseService.getUserResponseByEventId(eventId);
      res.status(200).json(feedbackResponse);      
    }catch(err){
      res.status(400).json({message:err.message});
    }
  };

  exports.getFeedbackResponseCount = async(req, res) => {
    const {eventId} = req.query;
    try{
      const count = await feedbackResponseService.getFeedbackResponseCount(eventId);
      res.status(200).json(count);
    }catch(err){
      res.status(400).json({message: err.message});
    }
  };


  


  
  

