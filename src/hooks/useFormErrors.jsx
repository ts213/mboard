import { useMemo } from 'react';

let { VITE_FILESIZE_UPLOAD_LIMIT: UPLOAD_LIMIT } = import.meta.env;
UPLOAD_LIMIT = Number(UPLOAD_LIMIT);

export function useFormErrors(fileList, data) {
  return useMemo(
    () => formErrorList(fileList, data),
    [fileList, data]
  );
}

const fileTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'image/webp',];

export function formErrorList(fileList, data) {
  function fileTooLarge() {
    const totalSize = fileList.reduce((sum, v) => sum + v.size, 0);
    return totalSize > UPLOAD_LIMIT ? { blockForm: true, detail: 'file too large' } : null;
  }

  function checkFileType() {
    const notAllowedType = fileList.some(file => !fileTypes.includes(file.type));
    return notAllowedType ? { blockForm: true, detail: 'not allowed file type' } : null;
  }

  function errFromServer() {
    if (data?.errors?.type === 'ban') {
      let banned_until = new Date(Date.now() + data.errors.detail * 1000);
      return { blockForm: true, detail: 'Banned until: ' + banned_until.toLocaleString() };
    }
    return data?.errors ? { blockForm: false, detail: Object.values(data.errors) } : null;
  }

  const errorList = [fileTooLarge(), checkFileType(), errFromServer()]
    .filter(Boolean);

  return [
    errorList,
    errorList.some(err => err.blockForm === true),
  ];
}
