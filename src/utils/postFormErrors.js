const fileTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'image/webp',];

export function formErrorList(fileList, data) {

  function fileTooLarge() {
    const totalSize = fileList.reduce((sum, v) => sum + v.size, 0);
    return totalSize > 1_000_000 ? 'file too large' : null;
  }

  function checkFileType() {
    const notAllowedType = fileList.some(file => !fileTypes.includes(file.type));
    return notAllowedType ? 'not allowed file type' : null;
  }

  function errFromServer() {
    if (data?.errors?.type === 'ban') {
      let banned_until = new Date(Date.now() + data.errors.message * 1000);
      return 'Banned until: ' + banned_until.toLocaleString();
    }
    return data?.errors ? data.errors?.message : null;
  }

  return [fileTooLarge(), checkFileType(), errFromServer()]
    .filter(Boolean);
}
