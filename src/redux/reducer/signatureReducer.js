import { GET_SIGNATURES, DELETE_SIGNATURE } from "../action/signatureAction";

const initState = {
  signatures: [],
};

const signatureReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_SIGNATURES:
      return {
        ...state,
        signatures: action.payload.signatures,
      };

    case DELETE_SIGNATURE:
      return {
        ...state,
        signatures: action.payload.signatures,
      };

    default:
      break;
  }

  return state;
};

export default signatureReducer;
