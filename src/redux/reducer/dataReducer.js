import {
  GET_RAW_FILE,
  GET_PAGE_SELECTED,
  GET_RAW_IMAGES,
  GET_IS_LOADING,
} from "../action/dataAction";

const initState = {
  rawFile: null,
  pageSelected: "",
  rawImages: [],
  isLoading: false,
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

    default:
      break;
  }

  return state;
};

export default dataReducer;
