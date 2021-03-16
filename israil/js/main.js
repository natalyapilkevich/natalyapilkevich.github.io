'use strict';

(function () {
  var MIN_TEL_LENGTH = 11;

  // открытие и закрытие Pop-Up
  var body = document.querySelector('body');
  var background = document.querySelector('.overlay');
  var requestCallButton = document.querySelector('.header__link--phone');
  var requestCallModal = document.querySelector('.pop-up--request');
  var messageModal = document.querySelector('.pop-up--message');
  var closeButtons = document.querySelectorAll('.pop-up__close-button');
  var messageButton = document.querySelector('.pop-up--message .pop-up__button');

  var popUpForm = document.querySelector('.pop-up__form');
  var popUpfieldset = popUpForm.querySelector('fieldset');
  var popUpName = popUpfieldset.querySelector('[name=name]');
  var popUpTel = popUpfieldset.querySelector('[name=tel]');
  var popUpAgreement = popUpForm.querySelector('[name=agreement]');

  localStorage.name = '';
  localStorage.tel = '';

  var isStorageSupport = true;
  var storage = '';

  try {
    storage = localStorage.getItem('popUpName');
  } catch (err) {
    isStorageSupport = false;
  }

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closePopup();
    }
  };

  var closePopup = function () {
    var openModal = document.querySelector('.pop-up--show');
    openModal.classList.remove('pop-up--show');
    background.classList.remove('overlay--show');
    body.classList.remove('overflow');
    document.removeEventListener('keydown', onPopupEscPress);
    messageButton.removeEventListener('click', closePopup);
  };

  var openPopup = function (modal) {
    modal.classList.add('pop-up--show');
    background.classList.add('overlay--show');
    body.classList.add('overflow');
    document.addEventListener('keydown', onPopupEscPress);
    messageButton.addEventListener('click', closePopup);
  };

  requestCallButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    openPopup(requestCallModal);

    if (storage) {
      popUpName.value = localStorage.name;
      popUpTel.value = localStorage.tel;
    }
    popUpName.focus();
  });

  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function (evt) {
      evt.preventDefault();
      closePopup();
    });
  }

  background.addEventListener('click', function () {
    closePopup();
  });

  // Маска для проверки формы

  window.addEventListener('DOMContentLoaded', function () {
    function setCursorPosition(pos, elem) {
      elem.focus();
      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }

    function mask(input) {
      var matrix = '+7 (___) ___ ____';
      i = 0;
      var def = matrix.replace(/\D/g, '');
      var val = input.value.replace(/\D/g, '');
      if (def.length >= val.length) {
        val = def;
      }
      input.value = matrix.replace(/./g, function (a) {
        if (/[_\d]/.test(a) && i < val.length) {
          return val.charAt(i++);
        } else if (i >= val.length) {
          return '';
        } else {
          return a;
        }
      });
      if (event.type === 'blur') {
        if (input.value.length === 2) {
          input.value = '';
        }
      } else {
        setCursorPosition(input.value.length, input);
      }
    }

    var telInputs = document.querySelectorAll('[type=tel]');

    for (i = 0; i < telInputs.length; i++) {

      (function () {
        var input = telInputs[i];
        input.addEventListener('input', function () {
          mask(input);
        });
        input.addEventListener('focus', function () {
          mask(input);
        });
        input.addEventListener('blur', function () {
          mask(input);
        });
      })();
    }
  });

  // валидация введенных данных

  var checkValidityName = function (block) {
    var nameInputs = block.querySelectorAll('[name=name]');
    var nameSpans = block.querySelectorAll('[name=name] + span');

    for (i = 0; i < nameInputs.length; i++) {
      if (nameInputs[i].validity.valueMissing) {
        nameInputs[i].classList.add('invalid');
        nameSpans[i].classList.add('error');
      } else {
        nameInputs[i].classList.remove('invalid');
        nameInputs[i].classList.add('valid');
        nameSpans[i].classList.remove('error');
      }
    }
  };

  var checkValidityTel = function (block) {
    var telInputs = block.querySelectorAll('[name=tel]');
    var telSpans = block.querySelectorAll('[name=tel] + span');

    for (i = 0; i < telInputs.length; i++) {
      if (telInputs[i].value.replace(/\D+/g, '').length < MIN_TEL_LENGTH) {
        telInputs[i].classList.add('invalid');
        telSpans[i].classList.add('error');
      } else {
        telInputs[i].classList.remove('invalid');
        telInputs[i].classList.add('valid');
        telSpans[i].classList.remove('error');
      }
    }
  };

  popUpForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    checkValidityName(popUpfieldset);
    checkValidityTel(popUpfieldset);

    if (!popUpName.validity.valueMissing && !popUpTel.validity.valueMissing && !(popUpTel.value.replace(/\D+/g, '').length < MIN_TEL_LENGTH) && popUpAgreement.checked) {
      closePopup();
      openPopup(messageModal);
      if (isStorageSupport) {
        localStorage.setItem('name', popUpName.value);
        localStorage.setItem('tel', popUpTel.value);
      }
    }
  });

  var wantGoForm = document.querySelector('.want-go');
  var wantGoTel = wantGoForm.querySelector('[name=tel]');

  wantGoForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    checkValidityName(wantGoForm);
    checkValidityTel(wantGoForm);

    if (!wantGoTel.validity.valueMissing && !(wantGoTel.value.replace(/\D+/g, '').length < MIN_TEL_LENGTH)) {
      openPopup(messageModal);
    }
  });

  var contactsForm = document.querySelector('.contacts__form');
  var contactsName = contactsForm.querySelector('[name=name]');
  var contactsTel = contactsForm.querySelector('[name=tel]');

  contactsForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    checkValidityName(contactsForm);
    checkValidityTel(contactsForm);

    if (!contactsName.validity.valueMissing && !contactsTel.validity.valueMissing && !(contactsTel.value.replace(/\D+/g, '').length < MIN_TEL_LENGTH)) {
      openPopup(messageModal);
    }
  });

  // табы раздела программы

  var programs = document.querySelector('.programs');
  var navLinks = programs.querySelectorAll('.programs__nav button');
  var descriptions = programs.querySelectorAll('.programs__item');

  programs.classList.remove('programs--nojs');

  var addTabsClickHandler = function (activeLink, activeText, link, text) {
    link.addEventListener('click', function () {

      var activeNavLink = document.querySelector('.' + activeLink);
      var activeDescription = document.querySelector('.' + activeText);

      activeNavLink.classList.remove(activeLink);
      activeDescription.classList.remove(activeText);

      link.classList.add(activeLink);
      text.classList.add(activeText);
    });
  };

  var createProgramTabs = function () {
    if (window.innerWidth > 767) {
      for (i = 0; i < navLinks.length; i++) {
        addTabsClickHandler('programs__nav-link--active', 'programs__item--active', navLinks[i], descriptions[i]);
      }
    }
  };

  createProgramTabs();


  // Слайдер мобильной версии раздела программы

  var mySwiper;
  var slideNav;
  var slideContent;

  var navSlider = document.querySelector('.programs__nav');
  var contentSlider = document.querySelector('.programs__content');

  var createProgramSlider = function () {
    if (window.innerWidth < 768 && navSlider.dataset.mobile === 'false') {
      slideNav = new Swiper(navSlider, { // eslint-disable-line
        spaceBetween: 0,
        slidesPerView: 'auto',
        centeredSlides: true,
        centeredSlidesBounds: true,
        initialSlide: 1
      });
      slideContent = new Swiper(contentSlider, { // eslint-disable-line
        spaceBetween: 10,
        initialSlide: 1,
        thumbs: {
          swiper: slideNav
        }
      });

      navSlider.dataset.mobile = 'true';
      contentSlider.dataset.mobile = 'true';
    }

    if (window.innerWidth >= 768) {
      navSlider.dataset.mobile = 'false';
      if (navSlider.classList.contains('swiper-container-initialized')) {
        slideNav.destroy();
      }
      contentSlider.dataset.mobile = 'false';
      if (contentSlider.classList.contains('swiper-container-initialized')) {
        slideContent.destroy();
      }
    }
  };

  createProgramSlider();

  // Слайдер мобильной версии раздела Жизнь в Израиле

  var life = document.querySelector('.life');
  life.classList.remove('life--nojs');

  var lifeSlider = document.querySelector('.life__container');

  var createLifeSlider = function () {
    if (window.innerWidth < 768 && lifeSlider.dataset.mobile === 'false') {
      var lifePagination = document.createElement('div');
      lifePagination.className = 'swiper-pagination life__pagination';
      var lifeContainer = document.querySelector('.life__container');
      lifeContainer.append(lifePagination);

      mySwiper = new Swiper(lifeSlider, { // eslint-disable-line
        pagination: {
          el: '.life__pagination',
        },
      });

      lifeSlider.dataset.mobile = 'true';
    }

    if (window.innerWidth >= 768) {
      lifeSlider.dataset.mobile = 'false';
      if (lifeSlider.classList.contains('swiper-container-initialized')) {
        mySwiper.destroy();
      }
    }
  };

  createLifeSlider();

  window.addEventListener('resize', function () {
    createLifeSlider();
    createProgramSlider();
    createProgramTabs();
  });

  // Табы вопрос/ответ

  var faq = document.querySelector('.faq');
  var faqLinks = faq.querySelectorAll('.faq__link');
  var faqItems = faq.querySelectorAll('.faq__main p');

  faq.classList.remove('faq--nojs');

  var addTabsClickToggle = function (link, text) {
    link.addEventListener('click', function () {

      link.classList.toggle('faq__link--active');
      text.classList.toggle('item-active');
    });
  };

  for (i = 0; i < faqLinks.length; i++) {
    addTabsClickToggle(faqLinks[i], faqItems[i]);
  }

  // Слайдер отзывов

  var review = document.querySelector('.review');

  review.classList.remove('review--nojs');

  var reviewSwiper = new Swiper('.review__container', { // eslint-disable-line
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: true,
    centeredSlidesBounds: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // Запрет на табуляцию по неактивным слайдам отзывов

  var swiperButtonNext = review.querySelector('.swiper-button-next');
  var swiperButtonPreview = review.querySelector('.swiper-button-prev');

  var changeTabOrder = function () {
    var activeElements = review.querySelectorAll('a');
    for (i = 0; i < activeElements.length; i++) {
      activeElements[i].tabIndex = '-1';
    }

    var activeSlide = review.querySelector('.swiper-slide-active');
    var tabActiveElements = activeSlide.querySelectorAll('a');
    for (i = 0; i < tabActiveElements.length; i++) {
      tabActiveElements[i].tabIndex = '0';
    }
  };

  swiperButtonNext.addEventListener('click', changeTabOrder);
  swiperButtonPreview.addEventListener('click', changeTabOrder);

  swiperButtonNext.addEventListener('keydown', changeTabOrder);
  swiperButtonPreview.addEventListener('keydown', changeTabOrder);

})();
