import { useMemo } from 'react';

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
    return totalSize > 1_000_000 ? { blockForm: true, message: 'file too large' } : null;
  }

  function checkFileType() {
    const notAllowedType = fileList.some(file => !fileTypes.includes(file.type));
    return notAllowedType ? { blockForm: true, message: 'not allowed file type' } : null;
  }

  function errFromServer() {
    if (data?.errors?.type === 'ban') {
      let banned_until = new Date(Date.now() + data.errors.message * 1000);
      return { blockForm: true, message: 'Banned until: ' + banned_until.toLocaleString() };
    }
    return data?.errors ? { blockForm: false, message: data.errors?.message } : null;
  }

  const errorList = [fileTooLarge(), checkFileType(), errFromServer()]
    .filter(Boolean);

  return [
    errorList,
    errorList.some(err => err.blockForm === true),
  ];
}
