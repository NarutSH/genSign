import {
  GET_SIGNATURES,
  DELETE_SIGNATURE,
  GET_NAME_SIGNATURES,
  GET_DATE_SIGNATURES,
} from "../action/signatureAction";

const initState = {
  signatures: [],
  nameSign: "",
  dateSign: "",
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

    case GET_NAME_SIGNATURES:
      return {
        ...state,
        nameSign: action.payload.nameSign,
      };
    case GET_DATE_SIGNATURES:
      return {
        ...state,
        dateSign: action.payload.dateSign,
      };

    default:
      break;
  }

  return state;
};

export default signatureReducer;
