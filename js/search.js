import {fullData} from './load.js';
import {currentTable, clearTable, renderTable, hideSortImages, currentTrHead} from './table.js';
import {elemsPerPage, searchInput, pageItemNext, fragment} from './util.js';
import {clearPagination, createPaginationElement} from './pagination.js';
import {changeResetStatus, newElemsPerPage} from './navbar-actions.js';

let filteredData;
let isFiltered = false;
let number;
let keyIsObj;

function changeFilterStatus(){
  isFiltered = false;
}

function searchFormAction() {
  changeResetStatus();

  if (searchInput.value !== '') {
    isFiltered = true;
    filteredData = _.filter(fullData, (item) => {

      for (let key in item) {

        switch(typeof item[key]) {

          case 'number':
           number = item[key];

           if (String(number).indexOf(searchInput.value) !== -1) {
            return item;
           }

          break;

          case 'string':
            if (item[key].indexOf(searchInput.value) !== -1) {
            return item;
        }

          break;

          case 'object':
            keyIsObj = item[key];

            for (let innerKey in keyIsObj) {
              if (keyIsObj[innerKey].indexOf(searchInput.value) !== -1) {
                return item;
              }
            }

          break;
        }
      }
    })
  } else {
    filteredData = fullData;
    isFiltered = false;
  }

  if (filteredData.length !== 0) {
    searchInput.setCustomValidity('');

    if (currentTrHead) {
      hideSortImages();
    }

    clearPagination();
    createPaginationElement(filteredData, pageItemNext, fragment);
    clearTable(currentTable);
    renderTable(filteredData, currentTable, newElemsPerPage ? newElemsPerPage : elemsPerPage);
  } else {
    searchInput.setCustomValidity('Совпадений не найдено');
    searchInput.reportValidity();
  }
}

function onSearchButtonClick(evt) {
  if (!evt.target.classList.contains('search_button')) {
    return;
  }

  searchFormAction();
}

function onSearchFormEnter(evt) {
  if (evt.key === 'Enter') {
    searchFormAction();
  }
}

export {onSearchButtonClick, onSearchFormEnter, isFiltered, filteredData, changeFilterStatus};
