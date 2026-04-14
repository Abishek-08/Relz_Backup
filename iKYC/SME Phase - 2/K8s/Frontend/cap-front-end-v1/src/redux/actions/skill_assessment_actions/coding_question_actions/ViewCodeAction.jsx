import { getQuestionRequest } from "../../../constants/skill_assessment_constants/coding_question_ constants/ViewCodeActionType"

const Question=(question)=>{
    return{
      type:getQuestionRequest.GET_QUESTION,
      payload:question,
    }
  }

  const FilterByCategoryQuestion = (question)=>{
    return{
      type:getQuestionRequest.FILTER_BY_CATEGORY,
      payload:question,
    }
  }

  const FilterByLevelQuestion = (question)=>{
    return{
      type:getQuestionRequest.FILTER_BY_LEVEL,
      payload:question,
    }
  }

export { FilterByCategoryQuestion, FilterByLevelQuestion, Question }


