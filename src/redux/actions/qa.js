export const SET_TEXT_ANSWER = "SET_TEXT_ANSWER";
export const ANSWER_FOR_SCENE = "ANSWER_FOR_SCENE";

export function setTextAnswers(texts) {
  return {
    type: SET_TEXT_ANSWER,
    texts: texts,
  };
}

export function answerForScene(question, images) {
  return {
    type: ANSWER_FOR_SCENE,
    images: images,
    question: question
  };
}