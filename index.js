
function checkLiPages () {
    let page = document.querySelectorAll('.li__item_added');
    if (page) {
        for (let i = 0; i < page.length; i++) {
            page[i].remove();
        }
    }
}

function hideLastColumns (table) {

    for (let i = 0; i < (table.rows.length); i++) {

        for (let j = 5; j < table.rows[0].cells.length; j++) {
            table.rows[i].cells[j].classList.add('hidden');
        }
    }
}

function reloadTable(table, description, rowShadow) {

    if (table) {

        for (let i = 1; i < table.rows.length; i++) {

            for (let j = 0; j < table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].innerText = '';
            }
        }

        if (description.classList.contains('active')) {
            description.classList.remove('active')
        }

        if (rowShadow) {
            rowShadow.classList.remove('newColor');
        }
    }
}

function keyValue (obj) {
    let arrKeys = [];

    for (let key in obj) {
        if(obj.hasOwnProperty(key)){
            arrKeys.push(key);
        }
    }
    return arrKeys;
}
// data - arr состоящий из элементов - страниц с данными. arr - массив состоящий из элементов - ключей для заполнения шапки таблицы.
// parentElem - родительский элемент, для вставки таблицы.
function createTable(data, arr, parentElem) {
    if (document.querySelector('table')) {
        return;
    }
    let table = document.createElement('table');
    table.classList.add('table');


    for (let i = 0; i <= (data[0].length); i++) {

        let newRow = table.insertRow(i);

        for (let j = 0; j < arr.length; j++) {
            newRow.insertCell(j);
        }
    }
    parentElem.appendChild(table);
    let firstCells = table.rows[0].cells;

        for (let j = 0; j < firstCells.length; j++) {
            table.rows[0].cells[j].innerHTML = arr[j] + '<span class="span_sortDirection"></span>';
            table.rows[0].classList.add('firstRow');
            table.rows[0].cells[j].classList.add('td_firstCells');
        }
        hideLastColumns(table);

        for (let i = 1; i < table.rows.length; i++) {
           table.rows[i].classList.add('anotherRows');
        }

}

// data - arr состоящий из элементов - страниц с данными.
function pagination (data, parentElem, referenceElem, divForPagination) {

    if (data.length <= 1) {
        divForPagination.classList.add('hidden');

    } else {
        divForPagination.classList.remove('hidden');
        checkLiPages();

        for (let i = 2; i <= data.length; i++) {

            let li = document.createElement('li');
            parentElem.insertBefore(li, referenceElem);
            li.innerHTML = '<a class="page-link" data-position="' + i + '" href="#">' + i + '</a>';
            li.classList.add('page-item');
            li.classList.add('li');
            li.classList.add('li__item');
            li.classList.add('li__item_added');
        }
        let liPage = document.querySelectorAll('.page-item');
        liPage[1].classList.add('active');
    }
}

function fillTable(data, table, description, rowShadow) {
    reloadTable(table, description, rowShadow);
    let rowNumber = 1;
    let cellNumber = 0;
    let firstRow = table.rows[0].cells;

    for (let i = 0; i < data.length; i++) {

        if ((rowNumber <= data.length) && (cellNumber < (firstRow.length))) {

            for (let key in data[i]) {

                if (data[i].hasOwnProperty(key)) {

                    if (!(typeof data[i][key] === 'object')) {

                        table.rows[rowNumber].cells[cellNumber].innerText = data[i][key];
                        cellNumber++;

                    } else {
                        let str = '';
                        let objIsKey = data[i][key];

                        for (let key1 in objIsKey) {
                            if (objIsKey.hasOwnProperty(key1)) {
                                str += key1 + ': ' + objIsKey[key1] + '; ';
                            }
                        }

                        table.rows[rowNumber].cells[cellNumber].innerText = str;
                        cellNumber++;
                    }
                }
            }
        } else {
            cellNumber = 0;
            rowNumber++;
            i--;
        }
    }

    for (let i = 1; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[0].cells.length; j++) {
            let rows = table.rows[i];

            if (rows.cells[j].innerText === '') {
                table.rows[i].classList.add('hidden');
            } else {
                table.rows[i].classList.remove('hidden');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded',function(){
    const loadData = document.querySelector('.choiceButtons');
    // const xhrURLSmall = 'http://www.json-generator.com/api/json/get/cqBIiqLzCa?indent=2';
    // const xhrURLBig = 'http://www.json-generator.com/api/json/get/bYLJBeTyEO?indent=2';
    const xhrURLSmall = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
    const xhrURLBig = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
    const content = document.querySelector('.content');
    const searchForm = document.querySelector('.search-form');
    const navigation = document.querySelector('.content__navigation');
    const ulNavigation = document.querySelector('.navigation__ul');
    const liNext = document.querySelector('.navigation__li_next');
    const searchFormInput = document.querySelector('.search-form__input');
    const searchFormButton = document.querySelector('.search-form__button');
    const additionalInform = document.querySelector('.description');
    const progress = document.querySelector('.progress');
    let firstRow;
    let jsonData;
    let wordsForFirstRow;
    let DataPerPages;
    let sortedJsonData;
    let clone;
    let filterJsonData;
    let newTable;
    let aIsActive;
    let aPageLinksPagination;
    let currentPage;
    let sortedFromSmallToBig = null;
    let rowShadow = null;
    let parentElem = content.children[0];

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
            progress.classList.add('flex');
        } else {
            progress.classList.remove('flex');
        }
    };
    xhr.onload = function loaded(){ // меняет DataPerPages
        jsonData = this.response;
        wordsForFirstRow = keyValue(jsonData[0]);
        DataPerPages = _.chunk(jsonData,10);
        clone = _.cloneDeep(DataPerPages); // нужен ли?
        content.classList.remove('hidden');
        searchForm.classList.remove('hidden');

        pagination (DataPerPages, ulNavigation, liNext, navigation);
        aIsActive = document.querySelectorAll('.page-item')[1];
        aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');//

        createTable(DataPerPages, wordsForFirstRow, parentElem);
        newTable = document.querySelector('table');
        firstRow = document.querySelector('.firstRow');
        firstRow.addEventListener('mousedown',sortData);
        newTable.addEventListener('click',showDescriptionData);

        fillTable(DataPerPages[0], newTable, additionalInform, rowShadow);
    };

    loadData.addEventListener('click', function(event) {
        currentPage = 1;
        let typeOfButton = event.target.classList;
        if (typeOfButton.contains('choiceButtons__button_dataSmall')){
            xhr.open('GET',xhrURLSmall,true);
        }

        if (typeOfButton.contains('choiceButtons__button_dataBig')){
            xhr.open('GET', xhrURLBig, true);
        }

        xhr.send();
    });

    ulNavigation.addEventListener('click', changePages);

    function changePages (event) { // в зависимости от существующего DataPerPages проходит по его содержимому
        if (aIsActive) {
            aIsActive.classList.remove('active');
        }

        let typeOfA = event.target.classList;
        let page = event.target.dataset.position;

        if (typeOfA.contains("page-link")) {

            if (event.target.dataset.position) {

                for (let j = 0; j < DataPerPages.length; j++) {

                    if (((page) - 1) === j) {
                        fillTable(DataPerPages[j], newTable, additionalInform, rowShadow);
                        event.target.parentNode.classList.add('active');
                        aIsActive = event.target.parentNode;
                        currentPage = j + 1;
                    }
                }
            }

            if (event.target.innerText === 'Previous') {

                if (currentPage === 1) {
                    aIsActive.classList.add('active');
                    event.preventDefault();

                } else {
                    currentPage--;
                    fillTable(DataPerPages[currentPage - 1], newTable, additionalInform, rowShadow);
                    aPageLinksPagination[currentPage].parentNode.classList.add('active');
                    aIsActive = aPageLinksPagination[currentPage].parentNode;
                }
            }

            if (event.target.innerText === 'Next') {

                if (currentPage === DataPerPages.length) {
                    aIsActive.classList.add('active');
                    event.preventDefault();

                } else {
                    currentPage++;
                    fillTable(DataPerPages[currentPage - 1], newTable, additionalInform, rowShadow);
                    aPageLinksPagination[currentPage].parentNode.classList.add('active');
                    aIsActive = aPageLinksPagination[currentPage].parentNode;
                }
            }
        }
    }

    function sortData (event) { // меняет DataPerPages

        firstRow.addEventListener('mousemove', mouseMove);

        function mouseMove(event) {
            event.preventDefault();
        }

        let span = document.querySelectorAll('.span_sortDirection');
        let text = event.target.innerText;
        text.trim();

        if (!(event.target.parentNode.classList.contains('anotherRows'))) {
            currentPage = 1;
            if (filterJsonData) {
                sortedJsonData = _.sortBy(filterJsonData, [`${text}`]);
            } else {
                sortedJsonData = _.sortBy(jsonData, [`${text}`]);
            }

            if (sortedFromSmallToBig === true) {
                sortedJsonData = sortedJsonData.reverse();
                sortedFromSmallToBig = false;

                for (let i = 0; i < span.length; i++) {
                    span[i].classList.add('active');
                    span[i].classList.add('hidden');

                    if (event.target.cellIndex === i) {
                        span[i].classList.remove('hidden');
                    }
                }

            } else {
                sortedFromSmallToBig = true;

                for (let i = 0; i < span.length; i++) {
                    span[i].classList.remove('active');
                    span[i].classList.add('hidden');
                    if (event.target.cellIndex === i) {
                        span[i].classList.remove('hidden');
                    }
                }
            }

            DataPerPages = _.chunk(sortedJsonData, 10);
            clone = _.cloneDeep(DataPerPages);
            pagination(DataPerPages, ulNavigation, liNext, navigation);
            aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');
            aIsActive = document.querySelectorAll('.page-item')[1];

            fillTable(DataPerPages[0], newTable, additionalInform, rowShadow);
        }

        firstRow.addEventListener('mouseup', mouseUp);
        function mouseUp(){
            firstRow.removeEventListener('mousemove', mouseMove);
            event.preventDefault();
        }
    }

    function showDescriptionData (event) {

        if (event.target.parentNode.classList.contains('anotherRows')) {

            if (rowShadow) {
                rowShadow.classList.remove('newColor');
            }

            rowShadow = event.target.parentNode;
            rowShadow.classList.add('newColor');

            for (let i = 0; i < clone[currentPage - 1].length; i++) {
                for (let key in clone[currentPage - 1][i]) {
                    if (clone[currentPage - 1][i].hasOwnProperty(key)) {
                        clone[currentPage - 1][i].index = i;
                    }
                }
            }

            let elem = clone[currentPage - 1].find(function (item) {
                for (let key in item) {
                    if (item.hasOwnProperty(key)) {
                        if ((key === 'index') && (item.index === (event.target.parentNode.rowIndex - 1))) {
                            return item;
                        }
                    }
                }
            });

            additionalInform.classList.add('active');
            let fullName = elem.firstName + ' ' + elem.lastName;
            let user = document.querySelector('.description__span_user');
            user.innerHTML = '<b>' + `${fullName}` + '</b>';

            let description = elem.description;
            let desc = document.querySelector('.description__span_description');
            desc.innerHTML = '<textarea rows="4" readonly>' + `${description}` + '</textarea>';

            let adress = document.querySelector('.description__span_streetAdress');
            adress.innerHTML = '<b>' + `${elem.adress.streetAddress}` + '</b>';
            let city = document.querySelector('.description__span_city');
            city.innerHTML = '<b>' + `${elem.adress.city}` + '</b>';

            let state = document.querySelector('.description__span_state');
            state.innerHTML = '<b>' + `${elem.adress.state}` + '</b>';

            let zip = document.querySelector('.description__span_zip');
            zip.innerHTML = '<b>' + `${elem.adress.zip}` + '</b>';

        }
    }

    searchFormButton.addEventListener('click', searchButton);// меняет DataPerPages

    function searchButton() {
        currentPage = 1;
        if (searchFormInput.value === '') {
            DataPerPages = _.chunk(jsonData, 10);
            filterJsonData = null;

        } else {
            filterJsonData = jsonData.filter(function takeElem(item) {

                for (let key in item) {

                    if (item.hasOwnProperty(key)) {

                        if (typeof item[key] === 'object') {
                            let objIsKey = item[key];

                            for (let key1 in objIsKey) {

                                if (objIsKey.hasOwnProperty(key1)) {

                                    if (objIsKey[key1].indexOf(searchFormInput.value) !== -1) {
                                        return item;
                                    }
                                }
                            }

                        } else if (typeof item[key] === 'number') {
                            let number = item[key];

                            if (String(number).indexOf(searchFormInput.value) !== -1) {
                                return item;
                            }

                        } else if (item[key].indexOf(searchFormInput.value) !== -1) {
                            return item;
                        }
                    }
                }
            });

            DataPerPages = _.chunk(filterJsonData, 10);
        }

        clone = _.cloneDeep(DataPerPages);//
        pagination(DataPerPages, ulNavigation, liNext, navigation);//
        aIsActive = document.querySelectorAll('.page-item')[1];//
        aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');//

        fillTable(DataPerPages[0], newTable, additionalInform, rowShadow);//
    }

    searchFormInput.addEventListener('keydown',function (event) {

        if (event.key === 'Enter') {
            searchButton(event);
        }
    });
});
