import { assessmentConstants } from "../../../constants/skill_assessment_constants/assessment_view_constants/CodingAssessmentActionType"

/**
 * @author sanjay.subramani
 * @since 11-07-2024
 * @version 1.0
*/

const questionsState = {
    questions: [],
}

export const skillQuestionReducer = (state = questionsState, action) => {
    switch (action.type) {
        case assessmentConstants.GET_ASSESSMENT_QUESTIONS:
            return { ...state, questions: action.payload }
        default:
            return state
    }
}

