  export const cleanData = (data) => {
    const items = data?.filter((item) => {
      return item.volumeInfo.authors !== undefined 
      && item.volumeInfo.description !== undefined
    })
    return items;
  }

  export function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
      return url + '?sz=150';
    }
    return url;
  }