
import {renderTable} from './table.js';
import {clearTable} from './table.js';
import {currentData} from './load.js';
import {elemsPerPage} from './util.js';
import {currentTable} from './table.js';

const content = document.querySelector('.content');
const navigation = content.querySelector('.content__navigation');
let currentPage = 1;

function createPaginationElement(pagesQuantity, referenceElem, fragment) {

  for (let i = 2; i <= pagesQuantity; i++) {
    const liElem = document.createElement('li');
    const aElem = document.createElement('a');
    liElem.classList.add('page-item', 'page-item_elem', 'li_item__added');
    aElem.classList.add('page-link');
    aElem.setAttribute('data-position', i);
    aElem.setAttribute('href', '#');
    aElem.innerText = i;
    liElem.append(aElem);
    fragment.append(liElem);

  }

  referenceElem.before(fragment);

  navigation.addEventListener('click', selectPage);
}

function selectPage(evt) {
  if (!evt.target.classList.contains('page-link')) {
    return;
  }
  const pageElems = navigation.querySelector('.pagination').children;
  const pageLinkElems = navigation.querySelectorAll('.page-link');
  const prevElem = pageElems[0];
  const nextElem = pageElems[pageElems.length - 1];

  for (let elem of pageElems) {
      elem.classList.remove('active');
  }

  clearTable(currentTable);
  if (evt.target.hasAttribute('data-position')) {
    currentPage = +evt.target.dataset.position;
  }

  if (evt.target.classList.contains('page-link_previous')) {
    currentPage--;
  }

  if (evt.target.classList.contains('page-link_next')) {
    currentPage++;
  }

  renderTable(currentData[currentPage - 1], currentTable, elemsPerPage);
  for (let elem of pageLinkElems) {
    if (elem.dataset.position === String(currentPage)) {
      elem.parentNode.classList.add('active');
    }
  }

  currentPage !== 1 ?
  prevElem.classList.remove('disabled') :
  prevElem.classList.add('disabled');

  currentPage === currentData.length ?
  nextElem.classList.add('disabled') :
  nextElem.classList.remove('disabled');

}

export {createPaginationElement};
