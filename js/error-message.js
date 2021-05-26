import {errorMessageTemplateItem, main, urlMoki, header, content, toolTips, tableContainer, elemsPerPage, pageItemNext, fragment, searchForm} from './util.js';
import {loadData} from './load.js';
import {resetPage} from './navbar-actions.js';
import {createTable, renderTable, currentTable} from './table.js';
import {createPaginationElement} from './pagination.js';
import {onSearchButtonClick, onSearchFormEnter} from './search.js';

let errorMessage;

function showErrorMessage(err) {
  const message = errorMessageTemplateItem.cloneNode(true);
  const errorText = message.querySelector('.errorDesc');
  errorText.textContent = `${err}`;
  main.append(message);
  errorMessage = message;
}

function onErrorMessageButtonClick(evt) {
  errorMessage.remove();

  if (evt.target.classList.contains('data_reloaded')) {
    resetPage();
  }

  if (evt.target.classList.contains('data_default_load')) {
    loadData(urlMoki)
    .then((response) => {
      header.classList.toggle('hidden');
      content.classList.toggle('hidden');
      toolTips.setAttribute('tooltip', 'MOKI');
      createTable(response, tableContainer, elemsPerPage);
      renderTable(response, currentTable, elemsPerPage);
      createPaginationElement(response, pageItemNext, fragment);
      searchForm.addEventListener('click', onSearchButtonClick);
      searchForm.addEventListener('keydown', onSearchFormEnter);
    });
  }
}

export {showErrorMessage, errorMessage, onErrorMessageButtonClick};
