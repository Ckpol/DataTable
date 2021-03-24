
  const popup = document.querySelector('.popup');
  const popupContainer = popup.querySelector('.popup_container');
  const header = document.querySelector('.header');
  const content = document.querySelector('.content');
  const tableContainer = content.querySelector('.data-table');
  const navigation = content.querySelector('.content__navigation');
  // const pageItemElement = navigation.querySelector('.page-item_elem');
  const pageItemNext = navigation.querySelector('.page-item_next');
  // const newPaginationElem = pageItemElement.cloneNode(true);
  const fragment = document.createDocumentFragment();
  let selectedRow;


  const xhrURLSmall = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
  const xhrURLBig = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';

  const elemsPerPage = 10;
  let currentPage = 1;
  let pagesQuantity = 0;

  let myUrl = '';
  let currentData;
  let currentTable;
  // let currentRowsQuantity = 10;



  async function loadData (url) {
    const response = await fetch(url);

    return response.json();
  }

  popupContainer.addEventListener('click', function (evt) {
    const typeOfButton = evt.target.classList;
    // currentPage = 1;

    if (!typeOfButton.contains('btn')) {
      return;
    }

    if (typeOfButton.contains('popup_dataSmall')) {
      myUrl = xhrURLSmall;
      // xhr.open('GET', xhrURLSmall, true);
      // console.log(xhrURLSmall);
    }

    if (typeOfButton.contains('popup_dataBig')) {
      myUrl = xhrURLBig;
      // xhr.open('GET', xhrURLBig, true);
      // console.log('BIG')
    }

    loadData(myUrl)
      .then((response) => {
        currentData = _.chunk(response, elemsPerPage); // сплит array по старницам
        pagesQuantity = currentData.length;

        header.classList.toggle('hidden');
        content.classList.toggle('hidden');
        popup.classList.add('hidden');
        console.log(currentData)
        console.log(response)

        currentTable = createTable(response, tableContainer, elemsPerPage);
        renderTable(response, currentTable, elemsPerPage);
        createPaginationElement(pagesQuantity, pageItemNext, fragment);
      });

  });

  // document.addEventListener('click', function(evt) {
  //   console.log(currentData)
  //   const table = content.querySelector('table');
  //   clearTable(table);
  // })


  function createTable (data, container, rowsQuantity) {
    if (container.querySelector('.table')) {
      return;
    }

    const table = document.createElement('table');// контейнер для thead и tbody
    const thead = document.createElement('thead');// контейнер для trhead
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
          th.setAttribute('scope', 'col');
          th.textContent = tHeadNames[j];
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


                                                    // // data - arr состоящий из элементов - страниц с данными. arr - массив состоящий из элементов - ключей для заполнения шапки таблицы.
                                                // // parentElem - родительский элемент, для вставки таблицы.
                                                // function createTable(data, arr, parentElem, columnsLimit) {

                                                //   if (document.querySelector('.table')) {
                                                //     return;
                                                //   }

                                                //   let table = document.createElement('table');
                                                //   table.classList.add('table');

                                                //   for (let i = 0; i <= data[0].length; i++) {

                                                //     let newRow = table.insertRow(i);

                                                //     for (let j = 0; j < columnsLimit; j++) {
                                                //       newRow.insertCell(j);
                                                //     }

                                                //     if (i > 0) {
                                                //       table.rows[i].classList.add('anotherRows');
                                                //     }
                                                //   }

                                                //   parentElem.appendChild(table);
                                                //   let firstCells = table.rows[0].cells;

                                                //   for (let j = 0; j < firstCells.length; j++) {
                                                //     firstCells[j].innerHTML = arr[j] + '<span class="span_sortDirection"></span>';
                                                //     table.rows[0].classList.add('firstRow');
                                                //     firstCells[j].classList.add('td_firstCells');
                                                //   }
                                                // }
    return table;
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



                                          // function fillTable(data, table, description, rowShadow, rowsLimit) {
                                          //   clearTable(table, description, rowShadow);
                                          //   let cellNumber = 0;
                                          //   let firstRow = table.rows[0].cells;

                                          //   for (let i = 0; i < rowsLimit; i++) {
                                          //     let rowIndex = i + 1;

                                          //     if (cellNumber >= firstRow.length) {
                                          //       cellNumber = 0;
                                          //     }

                                          //     for (let key in data[i]) {

                                          //       if (cellNumber >= firstRow.length) {
                                          //         break;
                                          //       }

                                          //       if (!data[i].hasOwnProperty(key)) {
                                          //         continue;
                                          //       }

                                          //       table.rows[rowIndex].classList.remove('hidden');

                                          //       if (typeof data[i][key] !== 'object') {
                                          //         table.rows[rowIndex].cells[cellNumber].innerText = data[i][key];
                                          //         cellNumber++;

                                          //       } else {
                                          //         let str = '';
                                          //         let objectKeys = data[i][key];

                                          //         for (let key in objectKeys) if (objectKeys.hasOwnProperty(key)) {
                                          //           str += key + ': ' + objectKeys[key] + ': ';
                                          //         }

                                          //         table.rows[rowIndex].cells[cellNumber].innerText = str;
                                          //         cellNumber++;
                                          //       }
                                          //     }
                                          //     if (!data[i]) {
                                          //       table.rows[rowIndex].classList.add('hidden');
                                          //     }
                                          //   }
                                          // }
    tbody.addEventListener('click', showDescription);
  }

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

    clearTable();
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


// function clearLiPages() {
//   let page = document.querySelectorAll('.li__item_added');

//   if (!page) {
//     return;
//   }

//   for (let i = 0; i < page.length; i++) {
//     page[i].remove();
//   }
// }

function clearTable() {
  if (!document.querySelector('table')) {
    return;
  }

  const table = document.querySelector('table');


  // if (!table) {
  //   return;
  // }

  const tbody = table.querySelector('tbody');

  for (let row of tbody.rows) {
    // console.log(row)
    row.classList.remove('hidden');
  }

  const cells = tbody.querySelectorAll('td');
  cells.forEach((item) => {
    item.textContent = '';
  })

}

function showDescription(evt) {
console.log(evt.target)
if (selectedRow) {
  selectedRow.classList.remove('table-active');
}

selectedRow = evt.target.parentNode;
selectedRow.classList.add('table-active');
}
// function clearTable(table, description, rowShadow) {

//   if (!table) {
//     return;
//   }

//   for (let i = 1; i < table.rows.length; i++) {

//     for (let j = 0; j < table.rows[i].cells.length; j++) {
//       table.rows[i].cells[j].innerText = '';
//     }
//   }

//   description.classList.remove('active');

//   if (rowShadow) {
//     rowShadow.classList.remove('newColor');
//   }
// }



                                                    // // data - arr состоящий из элементов - страниц с данными.
                                                    // function createPaginationElement(data, parentElem, referenceElem, divForPagination, liPage) {

                                                    //   if (data.length <= 1) {
                                                    //     divForPagination.classList.add('hidden');
                                                    //     return;
                                                    //   }

                                                    //   divForPagination.classList.remove('hidden');
                                                    //   clearLiPages();

                                                    //   for (let i = 2; i <= data.length; i++) {
                                                    //     let li = document.createElement('li');
                                                    //     parentElem.insertBefore(li, referenceElem);
                                                    //     li.innerHTML = '<a class="page-link" data-position="' + i + '" href="#">' + i + '</a>';
                                                    //     li.classList.add('page-item', 'li', 'li__item', 'li__item_added');
                                                    //   }
                                                    //   liPage.classList.add('active');
                                                    // }



// document.addEventListener('DOMContentLoaded', function () {
//   const loadData = document.querySelector('.choiceButtons');
//   // const xhrURLSmall = 'http://www.json-generator.com/api/json/get/cqBIiqLzCa?indent=2';
//   // const xhrURLBig = 'http://www.json-generator.com/api/json/get/bYLJBeTyEO?indent=2';
//   const xhrURLSmall = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
//   const xhrURLBig = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
//   const content = document.querySelector('.content');
//   const searchForm = document.querySelector('.search-form');
//   const navigation = document.querySelector('.content__navigation');
//   const ulNavigation = document.querySelector('.navigation__ul');
//   const liNext = document.querySelector('.navigation__li_next');
//   const searchFormInput = document.querySelector('.search-form__input');
//   const searchFormButton = document.querySelector('.search-form__button');
//   const additionalInform = document.querySelector('.description');
//   const progress = document.querySelector('.progress');
//   const liPage = document.querySelector('.navigation__li_1');
//   let firstRow;
//   let jsonData;
//   let wordsForFirstRow;
//   let DataPerPages;
//   let sortedJsonData;
//   let clone;
//   let filterJsonData;
//   let newTable;
//   let aIsActive;
//   let aPageLinksPagination;
//   let currentPage;
//   let sortedFromSmallToBig = null;
//   let rowShadow = null;
//   let parentElem = content.children[0];
//   let columnsLimit = 5;
//   let rowsLimit = 10;

//   let xhr = new XMLHttpRequest();
//   xhr.responseType = 'json';
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState < 4) {
//       progress.classList.add('flex');
//     } else {
//       progress.classList.remove('flex');
//     }
//   };
//   xhr.onload = function loaded() { // меняет DataPerPages
//     jsonData = this.response;
//     wordsForFirstRow = Object.keys(jsonData[0]);
//     DataPerPages = _.chunk(jsonData, 10);
//     clone = _.cloneDeep(DataPerPages); // нужен ли?
//     content.classList.remove('hidden');
//     searchForm.classList.remove('hidden');

//     createPaginationElement(DataPerPages, ulNavigation, liNext, navigation, liPage);
//     aIsActive = document.querySelectorAll('.page-item')[1];
//     aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');//

//     createTable(DataPerPages, wordsForFirstRow, parentElem, columnsLimit);
//     newTable = document.querySelector('.table');
//     firstRow = document.querySelector('.firstRow');
//     firstRow.addEventListener('mousedown', sortData);
                                                                //     newTable.addEventListener('click', showDescriptionData);

//     fillTable(DataPerPages[0], newTable, additionalInform, rowShadow, rowsLimit);
//   };

//   loadData.addEventListener('click', function (event) {
//     currentPage = 1;
//     let typeOfButton = event.target.classList;
//     if (typeOfButton.contains('choiceButtons__button_dataSmall')) {
//       xhr.open('GET', xhrURLSmall, true);
//     }

//     if (typeOfButton.contains('choiceButtons__button_dataBig')) {
//       xhr.open('GET', xhrURLBig, true);
//     }

//     xhr.send();
//   });

//   ulNavigation.addEventListener('click', changePages);

//   function changePages(event) { // в зависимости от существующего DataPerPages проходит по его содержимому
//     if (aIsActive) {
//       aIsActive.classList.remove('active');
//     }

//     let typeOfA = event.target.classList;
//     let page = event.target.dataset.position;

//     if (typeOfA.contains("page-link")) {

//       if (event.target.dataset.position) {

//         for (let j = 0; j < DataPerPages.length; j++) {

//           if (((page) - 1) === j) {
//             fillTable(DataPerPages[j], newTable, additionalInform, rowShadow, rowsLimit);
//             event.target.parentNode.classList.add('active');
//             aIsActive = event.target.parentNode;
//             currentPage = j + 1;
//           }
//         }
//       }

//       if (event.target.innerText === 'Previous') {

//         if (currentPage === 1) {
//           aIsActive.classList.add('active');
//           event.preventDefault();

//         } else {
//           currentPage--;
//           fillTable(DataPerPages[currentPage - 1], newTable, additionalInform, rowShadow, rowsLimit);
//           aPageLinksPagination[currentPage].parentNode.classList.add('active');
//           aIsActive = aPageLinksPagination[currentPage].parentNode;
//         }
//       }

//       if (event.target.innerText === 'Next') {

//         if (currentPage === DataPerPages.length) {
//           aIsActive.classList.add('active');
//           event.preventDefault();

//         } else {
//           currentPage++;
//           fillTable(DataPerPages[currentPage - 1], newTable, additionalInform, rowShadow, rowsLimit);
//           aPageLinksPagination[currentPage].parentNode.classList.add('active');
//           aIsActive = aPageLinksPagination[currentPage].parentNode;
//         }
//       }
//     }
//   }

//   function sortData(event) { // меняет DataPerPages

//     firstRow.addEventListener('mousemove', mouseMove);

//     function mouseMove(event) {
//       event.preventDefault();
//     }

//     let span = document.querySelectorAll('.span_sortDirection');
//     let text = event.target.innerText;
//     text.trim();

//     if (!(event.target.parentNode.classList.contains('anotherRows'))) {
//       currentPage = 1;
//       if (filterJsonData) {
//         sortedJsonData = _.sortBy(filterJsonData, [`${text}`]);
//       } else {
//         sortedJsonData = _.sortBy(jsonData, [`${text}`]);
//       }

//       if (sortedFromSmallToBig === true) {
//         sortedJsonData = sortedJsonData.reverse();
//         sortedFromSmallToBig = false;

//         for (let i = 0; i < span.length; i++) {
//           span[i].classList.add('active', 'hidden');

//           if (event.target.cellIndex === i) {
//             span[i].classList.remove('hidden');
//           }
//         }

//       } else {
//         sortedFromSmallToBig = true;

//         for (let i = 0; i < span.length; i++) {
//           span[i].classList.remove('active');
//           span[i].classList.add('hidden');
//           if (event.target.cellIndex === i) {
//             span[i].classList.remove('hidden');
//           }
//         }
//       }

//       DataPerPages = _.chunk(sortedJsonData, 10);
//       clone = _.cloneDeep(DataPerPages);
//       createPaginationElement(DataPerPages, ulNavigation, liNext, navigation, liPage);
//       aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');
//       aIsActive = document.querySelectorAll('.page-item')[1];

//       fillTable(DataPerPages[0], newTable, additionalInform, rowShadow, rowsLimit);
//     }

//     firstRow.addEventListener('mouseup', mouseUp);
//     function mouseUp() {
//       firstRow.removeEventListener('mousemove', mouseMove);
//       event.preventDefault();
//     }
//   }

                                                  //   function showDescriptionData(event) {

                                                  //     if (event.target.parentNode.classList.contains('anotherRows')) {

                                                  //       if (rowShadow) {
                                                  //         rowShadow.classList.remove('newColor');
                                                  //       }

                                                  //       rowShadow = event.target.parentNode;
                                                  //       rowShadow.classList.add('newColor');

                                                  //       for (let i = 0; i < clone[currentPage - 1].length; i++) {
                                                  //         for (let key in clone[currentPage - 1][i]) {
                                                  //           if (clone[currentPage - 1][i].hasOwnProperty(key)) {
                                                  //             clone[currentPage - 1][i].index = i;
                                                  //           }
                                                  //         }
                                                  //       }

                                                  //       let elem = clone[currentPage - 1].find(function (item) {
                                                  //         for (let key in item) {
                                                  //           if (item.hasOwnProperty(key)) {
                                                  //             if ((key === 'index') && (item.index === (event.target.parentNode.rowIndex - 1))) {
                                                  //               return item;
                                                  //             }
                                                  //           }
                                                  //         }
                                                  //       });

                                                  //       additionalInform.classList.add('active');
                                                  //       let fullName = elem.firstName + ' ' + elem.lastName;
                                                  //       let user = document.querySelector('.description__span_user');
                                                  //       user.innerHTML = '<b>' + `${fullName}` + '</b>';

                                                  //       let description = elem.description;
                                                  //       let desc = document.querySelector('.description__span_description');
                                                  //       desc.innerHTML = '<textarea rows="4" readonly>' + `${description}` + '</textarea>';

                                                  //       let adress = document.querySelector('.description__span_streetAdress');
                                                  //       adress.innerHTML = '<b>' + `${elem.adress.streetAddress}` + '</b>';
                                                  //       let city = document.querySelector('.description__span_city');
                                                  //       city.innerHTML = '<b>' + `${elem.adress.city}` + '</b>';

                                                  //       let state = document.querySelector('.description__span_state');
                                                  //       state.innerHTML = '<b>' + `${elem.adress.state}` + '</b>';

                                                  //       let zip = document.querySelector('.description__span_zip');
                                                  //       zip.innerHTML = '<b>' + `${elem.adress.zip}` + '</b>';

                                                  //     }
                                                  //   }

//   searchFormButton.addEventListener('click', searchButton);// меняет DataPerPages

//   function searchButton() {
//     currentPage = 1;
//     if (searchFormInput.value === '') {
//       DataPerPages = _.chunk(jsonData, 10);
//       filterJsonData = null;

//     } else {
//       filterJsonData = jsonData.filter(function takeElem(item) {

//         for (let key in item) {

//           if (item.hasOwnProperty(key)) {

//             if (typeof item[key] === 'object') {
//               let objIsKey = item[key];

//               for (let key1 in objIsKey) {

//                 if (objIsKey.hasOwnProperty(key1)) {

//                   if (objIsKey[key1].indexOf(searchFormInput.value) !== -1) {
//                     return item;
//                   }
//                 }
//               }

//             } else if (typeof item[key] === 'number') {
//               let number = item[key];

//               if (String(number).indexOf(searchFormInput.value) !== -1) {
//                 return item;
//               }

//             } else if (item[key].indexOf(searchFormInput.value) !== -1) {
//               return item;
//             }
//           }
//         }
//       });

//       DataPerPages = _.chunk(filterJsonData, 10);
//     }

//     clone = _.cloneDeep(DataPerPages);//
//     createPaginationElement(DataPerPages, ulNavigation, liNext, navigation, liPage);//
//     aIsActive = document.querySelectorAll('.page-item')[1];//
//     aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');//

//     fillTable(DataPerPages[0], newTable, additionalInform, rowShadow, rowsLimit);//
//   }

//   searchFormInput.addEventListener('keydown', function (event) {

//     if (event.key === 'Enter') {
//       searchButton(event);
//     }
//   });
// });

