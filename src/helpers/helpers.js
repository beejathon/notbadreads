  export const cleanData = (data) => {
    const items = data?.filter((item) => {
      return item.volumeInfo.authors !== undefined 
      && item.volumeInfo.description !== undefined
    })
    return items;
  }