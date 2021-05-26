import {content, descriptionTemplateItem} from './util.js';
import {closeDesc} from './table.js';

function creatDescription(elem, descStatus, data) {
  if (descStatus) {
    const currentDesc = content.querySelector('.description');
    currentDesc.remove();
  }

  const descElement = descriptionTemplateItem.cloneNode(true);
  const userName = descElement.querySelector('.description__userName');
  const textArea = descElement.querySelector('.description__text');
  const streetAddress = descElement.querySelector('.description__streetAddress');
  const city = descElement.querySelector('.description__city');
  const state = descElement.querySelector('.description__state');
  const zip = descElement.querySelector('.description__zip');
  let result = data.find(function(item) {

    for (let key in item) {
      if (String(item[key]) === elem.textContent) {
        return true;
      }
    }
  });

  userName.textContent = `${' ' + result.firstName + ' ' + result.lastName}`;
  textArea.textContent = result.description;

  for (let key in result) {
    if (typeof result[key] !== 'object' && key !== 'adress') {
      continue;
    }

    streetAddress.textContent = `${' ' + result[key].streetAddress}`;
    city.textContent = `${' ' + result[key].city}`;
    state.textContent = `${' ' + result[key].state}`;
    zip.textContent = `${' ' + result[key].zip}`;
  }

  content.append(descElement);
  descElement.addEventListener('click', onCloseButtonDescClick);
}

function onCloseButtonDescClick(evt) {
  if (!evt.target.classList.contains('btn-close')) {
    return;
  }

  closeDesc();
}

export {creatDescription};
