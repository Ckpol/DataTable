import {searchInput, pageItemNext, fragment, elemsPerPage, tableContainer, header, content, popup, toolTips, searchForm} from './util.js';
import {fullData} from './load.js';
import {createPaginationElement, clearPagination} from './pagination.js';
import {renderTable, clearTable, currentTable, hideSortImages, createTable, closeDesc} from './table.js';
import {changeFilterStatus, onSearchButtonClick, onSearchFormEnter} from './search.js';

let isReseted = false;
let newElemsPerPage;

function onResetButtonClick() {
  searchInput.value = '';
  isReseted = true;
  hideSortImages();
  clearPagination();
  createPaginationElement(fullData, pageItemNext, fragment);
  clearTable(currentTable);
  renderTable(fullData, currentTable, newElemsPerPage ? newElemsPerPage : elemsPerPage);
}

function changeResetStatus() {
  isReseted = false;
}

function onSelectChacngeHandler(evt) {
 newElemsPerPage = Number(evt.target.value);
 changeQuantityPerPages(newElemsPerPage, currentTable);
}

function changeQuantityPerPages(rowsQuantity, table) {
  searchInput.value = '';
  changeFilterStatus();
  table.remove();
  clearPagination();
  createTable(fullData, tableContainer, rowsQuantity);
  createPaginationElement(fullData, pageItemNext, fragment);
  renderTable(fullData, currentTable, rowsQuantity);
}

function resetPage() {
  header.classList.add('hidden');
  content.classList.add('hidden');
  popup.classList.remove('hidden');
  toolTips.setAttribute('tooltip', '');
  searchInput.value = '';
  closeDesc();

  if (currentTable) {
    currentTable.remove();
    clearPagination();
  }

  searchForm.removeEventListener('click', onSearchButtonClick);
  searchForm.removeEventListener('keydown', onSearchFormEnter);
}

export {onResetButtonClick, changeResetStatus, isReseted, onSelectChacngeHandler, resetPage, newElemsPerPage};
