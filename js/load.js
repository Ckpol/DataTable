import {elemsPerPage, progressBar, popup} from './util.js';

let fullData;
let currentData;
let pagesQuantity = 0;

async function loadData (url) {
  popup.classList.add('hidden');
  progressBar.classList.remove('hidden');

  const response = await fetch(url)
  .then((response) => response.json())
  .then((result) => {
    fullData = result;
    currentData = _.chunk(result, elemsPerPage);
    pagesQuantity = currentData.length;
    return result;
  });

  progressBar.classList.add('hidden');
  return response;
}

export {loadData, currentData, pagesQuantity, fullData};
