let currentData;
let pagesQuantity = 0;

async function loadData (url) {
  const response = await fetch(url)
  .then((response) => response.json())
  .then((result) => {
    currentData = _.chunk(result, 10);
    pagesQuantity = currentData.length;
    return result;
  });

  return response;
}


export {loadData, currentData, pagesQuantity};
