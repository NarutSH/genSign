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
