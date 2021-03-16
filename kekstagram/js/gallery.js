'use strict';
(function () {
  var MAX_COMMENTS_NUMBER = 5;

  var commentsLoaderButton = document.querySelector('.comments-loader');

  var onSuccess = function (data) {
    var thumbnails = document.querySelectorAll('.picture');
    var displayedComments = [];
    var counter = MAX_COMMENTS_NUMBER;
    var photoComments = [];

    var onCommentsLoaderButtonClick = function () {
      window.fullSizePicture.createCommentsPool(displayedComments);

      if (displayedComments.length > MAX_COMMENTS_NUMBER) {
        counter += MAX_COMMENTS_NUMBER;
        window.fullSizePicture.commentCount.textContent = counter + ' из ' + photoComments.length + ' комментариев';
      } else {
        window.fullSizePicture.commentCount.textContent = photoComments.length + ' из ' + photoComments.length + ' комментариев';
      }
      displayedComments.splice(0, MAX_COMMENTS_NUMBER);
    };

    var onThumbnail = function (thumbnail, photo) {
      thumbnail.addEventListener('click', function () {
        photoComments = photo.comments;
        displayedComments = photo.comments.slice();

        window.fullSizePicture.createBigPicture(photo);
        window.fullSizePicture.createCommentsPool(displayedComments);
        displayedComments.splice(0, MAX_COMMENTS_NUMBER);

        openBigPhoto();

        commentsLoaderButton.addEventListener('click', onCommentsLoaderButtonClick);
      });
    };

    for (var i = 0; i < thumbnails.length; i++) {
      onThumbnail(thumbnails[i], data[i]);
    }

    var bigPhotoCancel = document.querySelector('#picture-cancel');

    var onBigPhotoEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeBigPhoto();
      }
    };

    var openBigPhoto = function () {
      window.fullSizePicture.bigPicture.classList.remove('hidden');
      document.querySelector('body').classList.add('modal-open');

      document.addEventListener('keydown', onBigPhotoEscPress);
    };

    var closeBigPhoto = function () {
      window.fullSizePicture.bigPicture.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
      window.fullSizePicture.bigCommentsList.innerHTML = ' ';

      document.removeEventListener('keydown', onBigPhotoEscPress);
      commentsLoaderButton.removeEventListener('click', onCommentsLoaderButtonClick);
      counter = MAX_COMMENTS_NUMBER;
    };

    bigPhotoCancel.addEventListener('click', function () {
      closeBigPhoto();
    });
  };

  window.backend.load(onSuccess);

  window.gallery = {
    onSuccess: onSuccess
  };
})();
