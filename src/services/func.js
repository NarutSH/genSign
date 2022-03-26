import { dsmApi } from "../api/dsmApi";

export const onHandleUpload = async (blobFile) => {
  const file = new File([blobFile], "undefine.pdf", {
    type: "application/pdf",
  });

  const formData = new FormData();

  formData.append("token", "O@OkFXd9obuPxq:-t68s7jxUKMGUw2INW9mxcAzOKpGIEc5Z");
  formData.append("file", file);

  const res = await dsmApi.post("", formData);
  return res.data;
};

export const dataURLtoFile = async (dataurl, filename) => {
  var arr = await dataurl.split(","),
    mime = await arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const convertDate = (value) => {
  const result = new Date(value);

  let date = result.getDate();
  let month = result.getMonth() + 1;
  let year = result.getFullYear() + 543;

  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return `${date}-${month}-${year}`;
};
