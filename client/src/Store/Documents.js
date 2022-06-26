export const SET_DOCUMENTS = 'SET_DOCUMENTS';

export const setDocuments = (documents) => {
  return {
    type: SET_DOCUMENTS,
    documents,
  };
};

export default function documents(state = [], action) {
  switch (action.type) {
    case SET_DOCUMENTS: {
      return action.documents;
    }
    default:
      return state;
  }
}
