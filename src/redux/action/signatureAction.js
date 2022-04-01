export const GET_SIGNATURES = "GET_SIGNATURES";
export const DELETE_SIGNATURE = "DELETE_SIGNATURE";
export const GET_NAME_SIGNATURES = "GET_NAME_SIGNATURES";
export const GET_DATE_SIGNATURES = "GET_DATE_SIGNATURES";

export const updateSignature = (data) => {
  return {
    type: GET_SIGNATURES,
    payload: {
      signatures: data,
    },
  };
};

export const deleteSignature = (sign, signList) => {
  const res = signList.filter((item) => {
    return item.sId !== sign.sId;
  });

  return {
    type: DELETE_SIGNATURE,
    payload: {
      signatures: res,
    },
  };
};

export const updateNameSign = (data) => {
  return {
    type: GET_NAME_SIGNATURES,
    payload: {
      nameSign: data,
    },
  };
};
export const updateDateSign = (data) => {
  return {
    type: GET_DATE_SIGNATURES,
    payload: {
      dateSign: data,
    },
  };
};
