document.addEventListener('DOMContentLoaded',function(){
    const loadData = document.querySelector('.choiceButtons');
    const tableDiv = document.querySelector('.data-table');
    // const xhrURLSmall = 'http://www.json-generator.com/api/json/get/cqBIiqLzCa?indent=2';
    // const xhrURLBig = 'http://www.json-generator.com/api/json/get/bYLJBeTyEO?indent=2';
    const xhrURLSmall = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
    const xhrURLBig = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
    const content = document.querySelector('.content');
    const searchForm = document.querySelector('.search-form');
    const navigation = document.querySelector('.content__navigation');
    const ulNavigation = document.querySelector('.navigation__ul');
    const liNext = document.querySelector('.navigation__li_next');
    const liPage = document.querySelectorAll('.page-item');
    const searchFormInput = document.querySelector('.search-form__input');
    const searchFormButton = document.querySelector('.search-form__button');
    const additionalInform = document.querySelector('.description');
    const progress = document.querySelector('.progress');
    let jsonObj;
    let obj;
    let parsedObj;
    let newTable;
    let arr;
    let aIsActive;
    let aPageLinksPagination;
    let currentPage;

    let xhr = new XMLHttpRequest(); // Переписать на fetch
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
            progress.style.display = 'flex';
        } else {
            progress.style.display = 'none';
        }
    };
    xhr.onload = function loaded(){
        jsonObj = this.response;
        obj = jsonObj;
        arr = keyValue(obj[0]);
        parsedObj = _.chunk(obj,10);
        content.style.display = 'block';
        searchForm.style.display = 'block';
        pagination (parsedObj);
        createTable(parsedObj,arr);
        fillTable(parsedObj[0], arr); // parsedObj[0] // fillTable(parsedObj[data-index]

    };

    loadData.addEventListener('click', function(event) {
        currentPage = 1;
        let typeOfButton = event.target.className;
        if (typeOfButton.match('choiceButtons__button_dataSmall')){
            xhr.open('GET',xhrURLSmall,true);
        }

        if (typeOfButton.match('choiceButtons__button_dataBig')){
            xhr.open('GET', xhrURLBig, true);
        }

        xhr.send();
    });

    function keyValue (obj) {
        let arrKeys = [];

        for (let key in obj) {
            if(obj.hasOwnProperty(key)){
                arrKeys.push(key);
            }
        }
        return arrKeys;
    }

    function createTable (parsedObj, arr) {

        if (newTable) {
            return;
        }

        newTable = document.createElement('table');
        newTable.classList.add('table');

        for (let i = 0; i < (parsedObj[0].length + 1); i++) {

            let newRow = newTable.insertRow(i);

            for (let j = 0; j < arr.length; j++) {
                newRow.insertCell(j);
            }

        }

        tableDiv.appendChild(newTable); // заменить на innerHTML
        let firstCells = newTable.rows[0].cells;

        for (let j = 0; j < firstCells.length; j++) {
            newTable.rows[0].cells[j].innerHTML =arr[j] + '<span class="span_sortDirection"></span>';
            newTable.rows[0].classList.add('firstRow');
            newTable.rows[0].cells[j].classList.add('td_firstCells');
        }
        hideLastColumns(newTable);
        newTable.addEventListener('click',sortTable);
    }

    let sortedFromSmallToBig = null;
    let rowShadow = null;

    function sortTable (event) {

        let span = document.querySelectorAll('.span_sortDirection');
        let text = event.target.innerText;
        text = _.trim(text);

        if (event.target.className === 'td_firstCells')  {
            currentPage = 1;
            obj = _.sortBy(obj, [`${text}`]);

            if (sortedFromSmallToBig === true) {
                obj = obj.reverse();
                sortedFromSmallToBig = false;

                for (let i = 0; i < span.length; i++) {
                    span[i].classList.add('active');
                    span[i].style.display = 'none';

                    if (event.target.cellIndex === i) {
                        span[i].style.display = 'inline-block';
                    }
                }

            } else {
                sortedFromSmallToBig = true;

                for (let i = 0; i < span.length; i++) {
                    span[i].classList.remove('active');
                    span[i].style.display = 'none';
                    if (event.target.cellIndex === i) {
                        span[i].style.display = 'inline-block';
                    }
                }
            }

            parsedObj = _.chunk(obj,10);
            pagination(parsedObj);
            fillTable(parsedObj[0]);

        } else {

            if (rowShadow) {
                rowShadow.style.backgroundColor = null;
            }

            rowShadow = event.target.parentNode;
            rowShadow.style.backgroundColor = 'rgb(191, 221, 245)';
            let elem = _.find(obj, function (item) {

                for (let key in item) {
                    if (item.hasOwnProperty(key)) {

                        if (_.isNumber(item[key])) {
                            let number = String(item[key]);

                            if (number === text) {
                                return item;
                            }
                        }

                        if (item[key] === text) {
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

    function fillTable(parsedObj) {
        // obj - все данные || parsedObj - массив с массивами по страницам
         // arr - ключи (шапка)
        reloadTable();
        let table = document.querySelector('table');
        let row = 1; // номер строки
        let cell = 0; // номер ячейки

        for (let i = 0; i < parsedObj.length; i++) {

            if ((row <= parsedObj.length) && (cell < (table.rows[0].cells.length))) {

                for (let key in parsedObj[i]) {

                    if (parsedObj[i].hasOwnProperty(key)) {

                        if ((!_.isObject(parsedObj[i][key]))) {

                            table.rows[row].cells[cell].innerText = parsedObj[i][key];
                            cell++;

                        } else {
                            let str = '';
                            let objIsKey = parsedObj[i][key];

                            for (let key1 in objIsKey) {
                                if (objIsKey.hasOwnProperty(key1)) {
                                    str += key1 + ': ' + objIsKey[key1] + '; ';
                                }
                            }

                            table.rows[row].cells[cell].innerText = str;
                            cell++;
                        }
                    }
                }
            } else {
                cell = 0;
                row++;
                i--;
            }
        }
        checkDescription();

        for (let i = 1; i < table.rows.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                let rows = table.rows[i];

                if (rows.cells[j].innerText === '') {
                    table.rows[i].style.display = 'none';
                } else {
                    table.rows[i].style.display = 'table-row';
                }
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

    function pagination (parsedObj) {

        if (parsedObj.length <= 1) {
        navigation.classList.add('hidden');

        } else {
        navigation.classList.remove('hidden');
        checkLiPages();

        for (let i = 2; i <= parsedObj.length; i++) {

            let li = document.createElement('li');
            ulNavigation.insertBefore(li,liNext);
            li.innerHTML = '<a class="page-link" data-position="' + i + '" href="#">'+ i + '</a>';
            li.classList.add('page-item');
            li.classList.add('li');
            li.classList.add('li__item');
            li.classList.add('li__item_added');
        }

        liPage[1].classList.add('active');
        aIsActive = liPage[1];
        aPageLinksPagination = document.querySelectorAll('a[class="page-link"]');//
        }
        ulNavigation.addEventListener('click', changePages);
    }

        function changePages (event) {
        if (aIsActive) {
            aIsActive.classList.remove('active');
        }

        let typeOfA = event.target.className; // data-index (страница)
        let page = event.target.dataset.position;

        if (typeOfA === "page-link") {

            if (event.target.dataset.position) {

                for (let j = 0; j < parsedObj.length; j++) {

                    if (((page) - 1) === j) {
                        fillTable(parsedObj[j], arr);
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
                    fillTable(parsedObj[currentPage - 1], arr);
                    changeColorActiveA();
                }
            }

            if (event.target.innerText === 'Next') {

                if (currentPage === parsedObj.length) {
                    aIsActive.classList.add('active');
                    event.preventDefault();

                } else {
                    currentPage++;
                    fillTable(parsedObj[currentPage - 1], arr);
                    changeColorActiveA();
                }
            }
        }
    }

    function reloadTable() {

        if (newTable) {

            for (let i = 1; i < newTable.rows.length; i++) {

                for (let j = 0; j < newTable.rows[i].cells.length; j++) {
                    newTable.rows[i].cells[j].innerText = '';
                }
            }
        }
    }

    function changeColorActiveA() {

        for (let i = 0; i < aPageLinksPagination.length; i++) {
        let position = aPageLinksPagination[i].getAttribute('data-position');

            if (+position === currentPage) {
            aPageLinksPagination[i].parentNode.classList.add('active');
            aIsActive = aPageLinksPagination[i].parentNode;
            }
        }
    }

    searchFormButton.addEventListener('click', function(event) {

        currentPage = 1;
        if (searchFormInput.value === '') {
            obj = jsonObj;
            parsedObj = _.chunk(jsonObj,10);
            pagination (parsedObj);
            fillTable(parsedObj[0], arr);

        } else {
            obj = _.filter(jsonObj, function takeElem (item) {

            for (let key in item) {

                if (item.hasOwnProperty(key)) {

                    if ((_.isObject(item[key]))) {
                        let objIsKey = item[key];

                        for (let key1 in objIsKey) {

                            if (objIsKey.hasOwnProperty(key1)) {

                                if (objIsKey[key1].indexOf(searchFormInput.value) !== -1) {
                                    return item;
                                }
                            }
                        }

                    } else if (_.isNumber(item[key])) {
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

        parsedObj = _.chunk(obj,10);
        pagination(parsedObj);
        fillTable(parsedObj[0], arr);
        }
    });

    function checkLiPages () {
        let page = document.querySelectorAll('.li__item_added');
        if (page) {
            for (let i = 0; i < page.length; i++) {
                page[i].remove();
            }
        }
    }

    function checkDescription () {

        if (additionalInform.classList.contains('active')) {
            additionalInform.classList.remove('active');
        }

        if (rowShadow) {
            rowShadow.style.backgroundColor = null;
        }
    }
});
