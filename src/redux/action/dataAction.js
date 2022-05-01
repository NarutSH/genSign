export const GET_RAW_FILE = "GET_RAW_FILE";
export const GET_RAW_IMAGES = "GET_RAW_IMAGES";
export const GET_PAGE_SELECTED = "GET_PAGE_SELECTED";
export const GET_IS_LOADING = "GET_IS_LOADING";
export const GET_SIGN_POSITION = "GET_SIGN_POSITION";
export const GET_SIGN_TEMPLATE_ID = "GET_SIGN_TEMPLATE_ID";
export const GET_SIGN_TEMPLATE_ARRAY = "GET_SIGN_TEMPLATE_ARRAY";

export const updateRawFile = (data) => {
  return {
    type: GET_RAW_FILE,
    payload: {
      rawFile: data,
    },
  };
};

export const updatePageSelected = (page) => {
  // const pages = await [...pageArr, page];
  // console.log(pages);

  return {
    type: GET_PAGE_SELECTED,
    payload: {
      pageSelected: page,
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
export const updateSignPosition = (data) => {
  return {
    type: GET_SIGN_POSITION,
    payload: {
      signPosition: data,
    },
  };
};

export const updateSignTemplateId = (data) => {
  return {
    type: GET_SIGN_TEMPLATE_ID,
    payload: {
      signTemplateId: data,
    },
  };
};

export const updateSignTemplateArray = (data) => {
  return {
    type: GET_SIGN_TEMPLATE_ARRAY,
    payload: {
      signTemplateArray: data,
    },
  };
};
