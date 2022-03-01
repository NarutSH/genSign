export const GET_RAW_FILE = "GET_RAW_FILE";
export const GET_RAW_IMAGES = "GET_RAW_IMAGES";
export const GET_PAGE_SELECTED = "GET_PAGE_SELECTED";
export const GET_IS_LOADING = "GET_IS_LOADING";

export const updateRawFile = (data) => {
  return {
    type: GET_RAW_FILE,
    payload: {
      rawFile: data,
    },
  };
};

export const updatePageSelected = (data) => {
  return {
    type: GET_PAGE_SELECTED,
    payload: {
      pageSelected: data,
    },
  };
};

export const updateRawImages = (data) => {
  return {
    type: GET_RAW_IMAGES,
    payload: {
      rawImages: data,
    },
  };
};

export const updateIsLoading = (data) => {
  return {
    type: GET_IS_LOADING,
    payload: {
      isLoading: data,
    },
  };
};
