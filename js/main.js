
  import {xhrURLSmall, resetButton, toolTips, elemsSelect, resetPageButton, progressBar, xhrURLBig, elemsPerPage, header, searchForm, content, popupContainer, tableContainer, pageItemNext, fragment} from './util.js';
  import {loadData} from './load.js';
  import {createTable, renderTable, currentTable} from './table.js';
  import {createPaginationElement} from './pagination.js';
  import {onSearchButtonClick, onSearchFormEnter} from './search.js';
  import {onResetButtonClick, onSelectChacngeHandler, resetPage} from './navbar-actions.js';
  import {showErrorMessage, errorMessage, onErrorMessageButtonClick} from './error-message.js';

  let myUrl = '';

  popupContainer.addEventListener('click', function (evt) {
    const typeOfButton = evt.target.classList;

    if (!typeOfButton.contains('btn')) {
      return;
    }

    if (typeOfButton.contains('popup_dataSmall')) {
      myUrl = xhrURLSmall;
    }

    if (typeOfButton.contains('popup_dataBig')) {
      myUrl = xhrURLBig;
    }

    loadData(myUrl)
      .then((response) => {
        header.classList.toggle('hidden');
        content.classList.toggle('hidden');
        toolTips.setAttribute('tooltip', `${evt.target.textContent}`);
        createTable(response, tableContainer, elemsPerPage);
        renderTable(response, currentTable, elemsPerPage);
        createPaginationElement(response, pageItemNext, fragment);
        searchForm.addEventListener('click', onSearchButtonClick);
        searchForm.addEventListener('keydown', onSearchFormEnter);
      }).catch(function (err) {
        progressBar.classList.add('hidden');
        showErrorMessage(err);
        errorMessage.addEventListener('click', onErrorMessageButtonClick);
      });
  });

  resetButton.addEventListener('click', onResetButtonClick);
  elemsSelect.addEventListener('change', onSelectChacngeHandler);
  resetPageButton.addEventListener('click', resetPage);
