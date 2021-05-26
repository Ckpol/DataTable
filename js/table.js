import {content, elemsPerPage, pageItemNext, fragment} from './util.js';
import {fullData} from './load.js';
import {clearPagination, createPaginationElement} from './pagination.js';
import {creatDescription} from './description.js';
import {isFiltered, filteredData, changeFilterStatus} from './search.js';
import {isReseted, changeResetStatus, newElemsPerPage} from './navbar-actions.js';

let selectedRow;
let currentTable;
let sortedData;
let currentImg;
let currentTrHead;
let currentDescData;
let isDescOpen = false;
let isSorted = false;
let toHuge = false;

function createTable (data, container, rowsQuantity) {
  if (container.querySelector('.table')) {
    return;
  }

  const table = document.createElement('table'); // контейнер для thead и tbody
  const thead = document.createElement('thead'); // контейнер для trhead
  const trHead = document.createElement('tr'); // контейнер для th
  const tbody = document.createElement('tbody');
  const tHeadNames = Object.keys(data[0]);

  table.classList.add('table', 'table-hover');
  thead.classList.add('table-light');

  for (let i = 0; i < rowsQuantity; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < tHeadNames.length; j++) {
      if (tHeadNames[j] === 'description' || tHeadNames[j] === 'adress') {
        continue;
      }

      if (i === 0) {
        const th = document.createElement('th');
        const img = document.createElement('img');
        th.setAttribute('scope', 'col');
        img.setAttribute('src', './img/arrow-down-circle-fill.svg');
        img.classList.add('arrow', 'hidden');
        th.textContent = tHeadNames[j];
        th.append(img);
        trHead.append(th);
      }

      const td = document.createElement('td');
      tr.append(td);
    }

    tbody.append(tr);
  }

  thead.append(trHead);
  table.append(thead);
  table.append(tbody);
  container.append(table);
  currentTable = table;
  currentTrHead = trHead;
  trHead.addEventListener('click', sortData);
}

function renderTable (data, table, rowsQuantity) {
  const tbody = table.querySelector('tbody');
  let cellNumber = 0;

  if (!table) {
    return;
  }

  data.forEach(function (item, index) {
    if (index >= rowsQuantity) {
      return;
    }

    for (let key in item) {
      if (typeof item[key] === 'object' ||
      key === 'description') {
        continue;
      }

      let currentCell = tbody.rows[index].cells[cellNumber];
      currentCell.textContent = item[key];
      cellNumber++;
    }

    if (index === (data.length - 1)) {
      for (let i = index + 1; i < rowsQuantity; i++) {
        tbody.rows[i].classList.add('hidden');
      }
    }

    cellNumber = 0;
  })

  currentDescData = data;
  tbody.addEventListener('click', showDescription);
}

function showDescription(evt) {
  if (selectedRow) {
    selectedRow.classList.remove('table-active');
  }

  selectedRow = evt.target.parentNode;
  selectedRow.classList.add('table-active');
  creatDescription(evt.target, isDescOpen, currentDescData);
  isDescOpen = true;
  }

function clearTable(myTable) {
  if (!myTable) {
    return;
  }

  const tbody = myTable.querySelector('tbody');
  closeDesc();

  for (let row of tbody.rows) {
    row.classList.remove('hidden');
  }

  const cells = tbody.querySelectorAll('td');
  cells.forEach((item) => {
    item.textContent = '';
  })
  tbody.removeEventListener('click', showDescription);
}

function closeDesc() {
  const desc = content.querySelector('.description');

  if (desc) {
    desc.remove();
    isDescOpen = false;
  }
}

function sortData(evt) {
  if (isReseted) {
    toHuge = false;
    changeFilterStatus();
    makeSort(evt, fullData);
  } else {
    makeSort(evt, isFiltered ? filteredData : fullData);
  }
  changeResetStatus();
}

function makeSort(evt, data) {
  if (currentTrHead) {
    hideSortImages();
  }

  let text = evt.target.innerText.trim();
  currentImg = evt.target.querySelector('img');
  sortedData = _.sortBy(data.length === 0 ? fullData : data, [`${text}`]);

  if (toHuge) {
    sortedData = sortedData.reverse();
    currentImg.style.transform = 'rotate(180deg)';
  } else {
    currentImg.style.transform = 'rotate(0)'
  }

  clearPagination();
  createPaginationElement(sortedData, pageItemNext, fragment);
  clearTable(currentTable);
  renderTable(sortedData, currentTable, newElemsPerPage ? newElemsPerPage : elemsPerPage);
  isSorted = true;
  toHuge = !toHuge;
  currentImg.classList.remove('hidden');
}

function hideSortImages() {
  const arrows = currentTrHead.querySelectorAll('.arrow');
  Array.from(arrows).forEach((item) => {
    item.classList.add('hidden');
  })
}

export {createTable, renderTable, clearTable, hideSortImages, currentDescData, currentTrHead, currentTable, isSorted, closeDesc};
