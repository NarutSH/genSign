import { dsmApi } from "../api/dsmApi";

export const onSignTemplateUpload = async (imagesArr, signTemplateArr) => {
  const formData = new FormData();
  formData.append("token", "O@OkFXd9obuPxq:-t68s7jxUKMGUw2INW9mxcAzOKpGIEc5Z");

  await imagesArr.forEach((img) => {
    formData.append("page[]", img.status);
  });

  await signTemplateArr.forEach((img) => {
    formData.append("file[]", img.signTempFile);
  });

  const res = await dsmApi.post("", formData);
  return res.data;
};

export const onHandleImgUpload = async (imagesArr, dirName) => {
  const formData = new FormData();
  formData.append("token", "O@OkFXd9obuPxq:-t68s7jxUKMGUw2INW9mxcAzOKpGIEc5Z");
  formData.append("dir_name", dirName);

  await imagesArr.forEach((img) => {
    formData.append("file[]", img.imgFile);
  });

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

export const getImageDimensions = async (base64) => {
  const img = new Image();
  img.src = base64;

  img.onload = function () {
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
  };
};

export const convertToDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export const fetchToFile = (url, name) =>
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      var file = new File([blob], name);

      return file;
    });

export const random_rgba = () => {
  var o = Math.round,
    r = Math.random,
    s = 250;
  return (
    "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + 1 + ")"
  );
};

export const readFileData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};
