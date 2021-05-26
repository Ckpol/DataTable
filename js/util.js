const content = document.querySelector('.content');
const progressBar = document.querySelector('.progress');
const popup = document.querySelector('.popup');
const popupContainer = popup.querySelector('.popup_container');
const tableContainer = content.querySelector('.data-table');
const navigation = content.querySelector('.content__navigation');
const navigationContainer = navigation.querySelector('.pagination');
const pageItemNext = navigation.querySelector('.page-item_next');
const pageItemPrev = navigation.querySelector('.page-item_previous');
const xhrURLSmall = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
const xhrURLBig = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
const urlMoki = 'http://www.json-generator.com/api/json/get/cfufpdbLyq?indent=2';
const header = document.querySelector('.header');
const searchForm = header.querySelector('form');
const searchInput = searchForm.querySelector('.search_input');
const resetButton = header.querySelector('.search_reset');
const toolTips = header.querySelector('.data_named');
const elemsSelect = header.querySelector('#rows-quantity');
const resetPageButton = header.querySelector('.data_reloaded');
const errorMessageTemplate = document.querySelector('#message_error');
const errorMessageTemplateItem = errorMessageTemplate.content.querySelector('.message_error');
const main = document.querySelector('main');
const fragment = document.createDocumentFragment();
const descriptionTemplateList = document.querySelector('#description');
const descriptionTemplateItem = descriptionTemplateList
.content
.querySelector('.description');
const elemsPerPage = 10;
const pagesLimitedLow = 7;

export {xhrURLSmall, xhrURLBig, elemsPerPage, content, header, searchForm, popup, popupContainer, tableContainer, navigation, pageItemNext, fragment, navigationContainer, descriptionTemplateItem, searchInput, resetButton, toolTips, elemsSelect, pageItemPrev, pagesLimitedLow, resetPageButton, progressBar, errorMessageTemplateItem, main, urlMoki};
