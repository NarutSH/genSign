export const GET_SIGNATURES = "GET_SIGNATURES";
export const DELETE_SIGNATURE = "DELETE_SIGNATURE";

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
