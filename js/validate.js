import {MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH} from './constants.js';
import {sendData} from './api.js';
import { isEscapeKey } from './until.js';

const form = document.querySelector('.img-upload__form');
const submitButton = form.querySelector('.img-upload__submit');
const elementDescription = form.querySelector('.text__description');
const body = document.querySelector('body');

const messageSuccessTemplateElement = document.querySelector('#success').content.querySelector('.success');
const successButton = document.querySelector('#success').content.querySelector('.success__button');
const errorButton = document.querySelector('#error').content.querySelector('.error__button');
const messageErrorTemplateElement = document.querySelector('#error').content.querySelector('.error');

const pristine = new Pristine(form, {
  classTo: 'text',
  errorTextParent: 'text',
  errorTextTag: 'div',
  errorClass: 'text__description--invalid',
  successClass: 'text__description--valid',
  errorTextClass: 'text__description--error'
});

const validateDescriptionTextLimit = (value) => value.length < MAX_COMMENT_LENGTH;

pristine.addValidator(form.querySelector('.text__description'), validateDescriptionTextLimit, 'Максиммальная длина 140 символов.');

const validateDescription = (value) => value.length >= MIN_COMMENT_LENGTH && value.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(form.querySelector('.text__description'), validateDescription, 'От 20 до 140 символов.');

// form.addEventListener('submit', (evt) => {
//   const isValid = pristine.validate();
//   if (!isValid) {
//     evt.preventDefault();
//   }
// });

//Функция блокировки кнопки отправки формы
const blockSubmitButton = () => {
  submitButton.disabled = true;
  elementDescription.readOnly = true;
  submitButton.textContent = 'Сохраняю...';
};

//функция разблокировки кнопки отправки формы
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  elementDescription.readOnly = false;
  submitButton.textContent = 'Сохранить';
};

//Функция закрытия окна с сообщением об успешной или ошибочной отправке формы
const onMessageEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideMessage();
  }
};

//Функция скрытия сообщения по клику на свободную область
const onRandomArea = () => {
  hideMessage();
};

//Функция закрытия сообщения об успешнолй отправке формы по нажатию кнопки
const onSuccessButtonClick = () => {
  hideMessage();
};

//Функция закрытия сообщения об ошибке отправки формы по нажатию кнопки
const onErrorButtonClick = () => {
  hideMessage();
};

function hideMessage () {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  messageElement.remove();
  document.removeEventListener('keydown', onMessageEscKeydown);
  document.removeEventListener('click', onRandomArea);
  successButton.removeEventListener('click', onSuccessButtonClick);
  errorButton.removeEventListener('click', onErrorButtonClick);
  body.style.overflow = 'auto';
}

//Функция генерации сообщения об успешной отправке формы
const getSuccessMessage = () => {
  const elementSuccessMessage = messageSuccessTemplateElement.cloneNode(true);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onRandomArea);
  successButton.addEventListener('click', onSuccessButtonClick);
  body.append(elementSuccessMessage);
  body.style.overflow = 'hidden';
};

const getErrorMessage = () => {
  const elementErrorMessage = messageErrorTemplateElement.cloneNode(true);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onRandomArea);
  errorButton.addEventListener('click', onErrorButtonClick);
  body.append(elementErrorMessage);
  body.style.overflow = 'hidden';
};

//Функция отправки формы
const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', onSubmitButton);
  function onSubmitButton (evt) {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(
        () => {
          onSuccess();
          unblockSubmitButton();
          getSuccessMessage();
        },
        () => {
          getErrorMessage();
          unblockSubmitButton();
        },
        new FormData(evt.target),
      );
    }
  }
};

export { form, setUserFormSubmit, elementDescription };
