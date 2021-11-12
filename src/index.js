import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce'

import { Notify } from 'notiflix/build/notiflix-notify-aio';
//import 'notiflix/dist/notiflix-3.1.0.min.css';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;


const refs = {
    inputRefs: document.querySelector('input#search-box'),
    countryListRefs: document.querySelector('.country-list'),
    countryInfoRefs: document.querySelector('.country-info'),
};


refs.inputRefs.addEventListener('input',
    debounce (onInputHandler, DEBOUNCE_DELAY)
);

function onInputHandler() {
    clearMarkup();
    if (refs.inputRefs.value.trim() === '') {
        return clearMarkup()
    };

    fetchCountries(refs.inputRefs.value.trim())
        .then((countries) => {
             if (countries.length > 10) {
                
               return Notify.info("Too many matches found. Please enter a more specific name.")
            }
            if (countries.length >= 2 && countries.length <= 10) {
                renderCountriesList(countries);
            }
             else {
                renderCountriesInfo(countries);
             }
                   
        })
        .catch(error => { Notify.failure("Oops, there is no country with that name") })
 }


//Рендер розмітки списку країн 

function renderCountriesList(countries) {
        //console.log(countries)
    const markup = countries.map(
        ({ flags, name }) => 
          
      `<li class="country-list__item">
             <img class="country-list__img" src="${flags.svg}" alt="" width="50" >
              <p class="country-list__name">${name.official}</p>
      </li>`
                      
        ).join('');
        
         refs.countryListRefs.insertAdjacentHTML('beforeend', markup);
      
}

//Рендер розмітки однієї країн 
function renderCountriesInfo(countries) {
       // console.log(countries)
    const markup = countries.map(
        ({ flags, name, capital, population, languages }) => 
          
            `<div class="country-info__container">
              <img class="country-info__img" src="${flags.svg}" alt="" width="40" height="40" >
              <p class="country-info__name">${name.official}</p>
            </div>
              <p class="country-info__item"><span class="country-info__text">Capital:</span>${capital[0]}</p>
              <p class="country-info__item"><span class="country-info__text">Population:</span>${population}</p>
              <p class="country-info__item"><span class="country-info__text">Languages:</span>${Object.values(languages)}</p>`
                      
        ).join('');
        
         refs.countryInfoRefs.insertAdjacentHTML('beforeend', markup);
      
}

//Очистка розмітки 
function clearMarkup() {
    refs.countryListRefs.innerHTML = '';
    refs.countryInfoRefs.innerHTML = '';
}