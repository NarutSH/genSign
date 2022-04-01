import {
  GET_RAW_FILE,
  GET_PAGE_SELECTED,
  GET_RAW_IMAGES,
  GET_IS_LOADING,
  GET_SIGN_POSITION,
} from "../action/dataAction";

const initState = {
  rawFile: null,
  pageSelected: "",
  rawImages: [],
  isLoading: false,
  signPosition: null,
  
  // signPosition: { x: 0, y: 0 },
};

const dataReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_RAW_FILE:
      return {
        ...state,
        rawFile: action.payload.rawFile,
      };

    case GET_PAGE_SELECTED:
      return {
        ...state,
        pageSelected: action.payload.pageSelected,
      };

    case GET_RAW_IMAGES:
      return {
        ...state,
        rawImages: action.payload.rawImages,
      };

    case GET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case GET_SIGN_POSITION:
      return {
        ...state,
        signPosition: action.payload.signPosition,
      };

    default:
      break;
  }

  return state;
};

export default dataReducer;
