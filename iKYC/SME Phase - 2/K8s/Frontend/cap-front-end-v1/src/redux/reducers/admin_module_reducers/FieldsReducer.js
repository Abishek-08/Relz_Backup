import { ActionTypes } from "../../constants/ActionTypes";

  const initialState = {
    fields: [],
    visibility: {},
  };

const fieldsReducer = (state = initialState, action) => {
    switch (action.type) {
      case ActionTypes.UPDATE_FIELD_ATTRIBUTE_NAME: {
        const { index, value } = action.payload;
        const newFields = [...state.fields];
        newFields[index] = { ...newFields[index], attributeName: value };
        return { ...state, fields: newFields };
      }
      case ActionTypes.UPDATE_FIELD_OPTION: {
        const { fieldIndex, optionIndex, value, questionType } = action.payload;
        const newFields = [...state.fields];
        newFields[fieldIndex] = { ...newFields[fieldIndex], options: [...newFields[fieldIndex].options] };
        newFields[fieldIndex].options[optionIndex] = value;
        const optionsList = newFields[fieldIndex].options.join(', ');
        newFields[fieldIndex] = { ...newFields[fieldIndex], attributeType: `${questionType}, ${optionsList}` };
        return { ...state, fields: newFields };
      }
      case ActionTypes.ADD_OPTION: {
        const { index } = action.payload;
        const newFields = [...state.fields];
        newFields[index] = { ...newFields[index], options: [...newFields[index].options, ''] };
        return { ...state, fields: newFields };
      }
      case ActionTypes.REMOVE_OPTION: {
        const { fieldIndex, optionIndex } = action.payload;
        const newFields = [...state.fields];
        newFields[fieldIndex] = { ...newFields[fieldIndex], options: newFields[fieldIndex].options.filter((_, i) => i !== optionIndex) };
        return { ...state, fields: newFields };
      }
      case ActionTypes.UPDATE_FIELD_TYPE: {
        const { index, newType } = action.payload;
        const newFields = [...state.fields];
        newFields[index] = { ...newFields[index], attributeType: newType };
        return { ...state, fields: newFields };
      }
      case ActionTypes.UPDATE_VISIBILITY: {
        const { index, isVisible } = action.payload;
        return { ...state, visibility: { ...state.visibility, [index]: isVisible } };
      }
      case 'ADD_FIELD': {
        const { payload } = action;
        return { ...state, fields: [...state.fields, payload] };
      }
      case 'REMOVE_FIELD': {
        const { payload: index } = action;
        const newFields = state.fields.filter((_, i) => i !== index);
        return { ...state, fields: newFields };
      }
      case ActionTypes.RESET_FIELD_REDUCER : {
        return initialState;
      }
      default:
        return state;
    }
  };
  
  
  export default fieldsReducer;
  