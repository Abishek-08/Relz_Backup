const toNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

exports.aggregateByType = (question, responses) => {
  const type = question.surveyQuestionType;
 
  switch (type) {
    case "radio":
    case "dropdown":
      return aggregateSingleChoice(question, responses);
 
    case "checkbox":
      return aggregateMultiChoice(question, responses);
 
    case "rating":
    case "slider":
    case "star":
      return aggregateScale(question, responses);
 
    case "comment":
      return aggregateComments(responses);
 
    case "matrix":
      return aggregateMatrix(question, responses);
 
    default:
      return {};
  }
};
 
function aggregateSingleChoice(question, responses) {
  const result = {};
  question.surveyCheckBoxOptions.forEach(opt => (result[opt] = 0));
 
  responses.forEach(r => {
    if (result[r.surveyResponse] !== undefined) {
      result[r.surveyResponse]++;
    }
  });
 
  return {
    totalResponses: responses.length,
    distribution: result
  };
}
 
function aggregateMultiChoice(question, responses) {
  const result = {};
  question.surveyCheckBoxOptions.forEach(opt => (result[opt] = 0));
 
  responses.forEach(r => {
    if (Array.isArray(r.surveyResponse)) {
      r.surveyResponse.forEach(opt => {
        if (result[opt] !== undefined) result[opt]++;
      });
    }
  });
 
  return {
    totalResponses: responses.length,
    distribution: result
  };
}
 
function aggregateScale(question, responses) {
  const values = responses
    .map(r => toNumber(r.surveyResponse))
    .filter(v => v !== null);
 
  if (!values.length) {
    return { totalResponses: 0 };
  }
 
  const sum = values.reduce((a, b) => a + b, 0);
  const dist = {};
 
  for (let i = question.scaleMin; i <= question.scaleMax; i++) {
    dist[i] = 0;
  }
 
  values.forEach(v => {
    if (dist[v] !== undefined) dist[v]++;
  });
 
  return {
    totalResponses: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    average: Number((sum / values.length).toFixed(2)),
    distribution: dist
  };
}
 
function aggregateComments(responses) {
  return {
    totalResponses: responses.length,
    comments: responses.map(r => r.surveyResponse)
  };
}
 
function aggregateMatrix(question, responses) {
  const matrix = {};
 
  question.matrixQnLabels.forEach(row => {
    matrix[row] = {};
    question.scaleLabels.forEach(col => {
      matrix[row][col] = 0;
    });
  });
 
  responses.forEach(r => {
    const resp = r.surveyResponse || {};
    Object.keys(resp).forEach(row => {
      const col = resp[row];
      if (matrix[row] && matrix[row][col] !== undefined) {
        matrix[row][col]++;
      }
    });
  });
 
  return {
    totalResponses: responses.length,
    matrix
  };
}
 