import {elemsPerPage, navigation, navigationContainer, pageItemNext, pageItemPrev, pagesLimitedLow} from './util.js';
import {renderTable, currentTable, clearTable} from './table.js';
import {newElemsPerPage} from './navbar-actions.js';

let newCurrentPage;
let pageLinkElems;
let currentPaginationData;
let pagesQuantity;
let firtsDots;
let lastDots;

function createPaginationElement(data, referenceElem, fragment) {
  currentPaginationData = _.chunk(data, newElemsPerPage ? newElemsPerPage : elemsPerPage);
  pagesQuantity = currentPaginationData.length;

  if (navigation.classList.contains('hidden')) {
    navigation.classList.remove('hidden');
  }

  for (let i = 1; i <= pagesQuantity; i++) {
    const liElem = document.createElement('li');
    const aElem = document.createElement('a');
    liElem.classList.add('page-item', 'page-item_elem', 'li_item__added');
    aElem.classList.add('page-link');
    aElem.setAttribute('data-position', i);
    aElem.setAttribute('href', '#');
    aElem.innerText = i;
    liElem.append(aElem);

    if (i === 1) {
      liElem.classList.add('active');
    }

    if (pagesQuantity > pagesLimitedLow) {

      if (i > pagesLimitedLow && i !== pagesQuantity) {
        liElem.classList.add('hidden');
      }

      if (i === 2 || i === pagesQuantity) {
        const liElemDots = document.createElement('li');
        const dotsElem = document.createElement('span');
        liElemDots.classList.add('page-item', 'page-item_dots');

        if (i === 2) {
          liElemDots.classList.add('dots-first', 'hidden');
        }

        if (i === pagesQuantity) {
          liElemDots.classList.add('dots-last');
        }

        dotsElem.classList.add('page-link');
        dotsElem.innerText = '...';
        liElemDots.append(dotsElem);
        fragment.append(liElemDots);
      }
    }

    fragment.append(liElem);
  }

  referenceElem.before(fragment);
  newCurrentPage = 1;
  pageLinkElems = navigationContainer.querySelectorAll('.page-item_elem');

  if (pagesQuantity <= 1) {
    navigation.classList.add('hidden');
  }

  if (pagesQuantity > pagesLimitedLow) {
    firtsDots = navigationContainer.querySelector('.dots-first');
    lastDots = navigationContainer.querySelector('.dots-last');
  }

  navigation.addEventListener('click', onPageSelectClick);
}

function onPageSelectClick(evt) {
  selectPage(evt, currentPaginationData);
  changePaginationsStatus(evt, pageLinkElems, pagesLimitedLow);
}

function selectPage(evt) {
  if (!evt.target.classList.contains('page-link')) {
    return;
  }

  clearTable(currentTable);
  if (evt.target.hasAttribute('data-position')) {
    newCurrentPage = +evt.target.dataset.position;
  }

  if (evt.target.classList.contains('page-link_previous')) {
    newCurrentPage--;
  }

  if (evt.target.classList.contains('page-link_next')) {
    newCurrentPage++;
  }

  renderTable(currentPaginationData[newCurrentPage - 1], currentTable, newElemsPerPage ? newElemsPerPage : elemsPerPage);
  pageLinkElems = Array.from(pageLinkElems);

  for (let i = 0; i < pageLinkElems.length; i++) {
    pageLinkElems[i].classList.remove('active');

    if (pageLinkElems[i].children[0].dataset.position === String(newCurrentPage)) {
      pageLinkElems[i].classList.add('active');
    }
  }

  newCurrentPage !== 1 ?
  pageItemPrev.classList.remove('disabled') :
  pageItemPrev.classList.add('disabled');

  newCurrentPage === currentPaginationData.length ?
  pageItemNext.classList.add('disabled') :
  pageItemNext.classList.remove('disabled');
}

function changePaginationsStatus(evt, liElemsList, limit) {
  if (liElemsList.length <= limit) {
    return;
  }

  let pagesLimitedHige = liElemsList.length - limit;
  let beforePages = newCurrentPage - 2;
  let afterPages = newCurrentPage + 2;

  if (newCurrentPage < limit) {
    firtsDots.classList.add('hidden');
    lastDots.classList.remove('hidden');

    for (let i = 0; i < liElemsList.length; i++) {

      if (i === liElemsList.length - 1) {
        continue;
      }

      liElemsList[i].classList.add('hidden');

      if (i < limit) {
        liElemsList[i].classList.remove('hidden');
      }
    }
  }

  if (newCurrentPage >= limit && newCurrentPage <= pagesLimitedHige + 1) {
    firtsDots.classList.remove('hidden');
    lastDots.classList.remove('hidden');

    for (let i = 0; i < liElemsList.length; i++) {
      if ((i === liElemsList.length - 1) || (i === 0)) {
        continue;
      }

      liElemsList[i].classList.add('hidden');

      if (i >= beforePages - 1 && i <= afterPages - 1) {
        liElemsList[i].classList.remove('hidden');
      }
    }
  }

  if (newCurrentPage > pagesLimitedHige + 1) {
    firtsDots.classList.remove('hidden');
    lastDots.classList.add('hidden');

    for (let i = 0; i < liElemsList.length; i++) {
      if (i === 0) {
        continue;
      }

      liElemsList[i].classList.add('hidden');

      if (i >= pagesLimitedHige) {
        liElemsList[i].classList.remove('hidden');
      }
    }
  }
}

function clearPagination() {
  const addedElems = navigationContainer.querySelectorAll('.li_item__added');

  if (addedElems) {
    for (let i = 0; i < addedElems.length; i++) {
      addedElems[i].remove();
    }
  }

  newCurrentPage = 1;

  if (currentPaginationData.length > pagesLimitedLow) {
    firtsDots.remove();
    lastDots.remove();
  }

  pageItemPrev.classList.add('disabled');
  pageItemNext.classList.remove('disabled');
  navigation.removeEventListener('click', onPageSelectClick);
}

export {createPaginationElement, clearPagination};
