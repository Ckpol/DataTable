
  let selectedRow;
  let currentTable;

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

    currentTable = table;
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

    tbody.addEventListener('click', showDescription);
  }

  function showDescription(evt) {
    console.log(evt.target)
    if (selectedRow) {
      selectedRow.classList.remove('table-active');
    }

    selectedRow = evt.target.parentNode;
    selectedRow.classList.add('table-active');
    }

    function clearTable(myTable) {
      if (!myTable) { // document.querySelector('table')
        return;
      }

      // const table = document.querySelector('table');


      // if (!table) {
      //   return;
      // }

      const tbody = myTable.querySelector('tbody');

      for (let row of tbody.rows) {
        // console.log(row)
        row.classList.remove('hidden');
      }

      const cells = tbody.querySelectorAll('td');
      cells.forEach((item) => {
        item.textContent = '';
      })

    }

  export {createTable, renderTable, clearTable, currentTable};
