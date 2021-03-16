'use strict';
(function () {
  var photoContainer = document.querySelector('.pictures');
  var photoTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var renderPhoto = function (photo) {
    var picture = photoTemplate.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    return picture;
  };

  var renderGallery = function (data) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (el) {
      fragment.appendChild(renderPhoto(el));
    });


    photoContainer.appendChild(fragment);
    photoContainer.querySelector('.pictures__title').classList.remove('visually-hidden');
  };

  window.picture = {
    renderGallery: renderGallery
  };

})();
