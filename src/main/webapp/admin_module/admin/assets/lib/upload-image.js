var imageIdsListToBeRemoved = [];
var imageIdsListToBeSaved = [];
var MAX_PHOTOS_PER_DIR = 2500;

/**
 * Function to init ajaxupload for specified DOM element.
 * @param node      Given DOM element
 */
function ajaxupload(node){
    $(node).ajaxupload({
        //OPTIONS A-Z
        allowExt:       ['jpg', 'png', 'bmp', 'gif'],                                           // Array of allowed upload extesion, can be set also in php script.
        autoStart:      true,                                                                   // If true upload will start immediately after drop of files or select of files.

        dropArea:       $(node),                                                                // Set the id or element of area where to drop files. default self.

        hideUploadButton:   true,                                                               // Hide upload button on form integration, upload starts on form submit.

        maxFiles:       9999,                                                                   // Max number of files can be selected.
        maxFileSize:    '5M',                                                                  // Max file size of single file.

        url:            'temp/upload-product-photo.htm',                                        // Url to upload image.

        removeOnError:  true,                                                                   // If true remove the file from the list if it has errors during upload.

        chunkSize: 0,

        //CALLBACKS
        onInit:         function(AU){                                                           // Function that trigger on uploader initialization. Usefull if need to hide any button before uploader set up, without using css.
            $(".ax-main-title, .ax-upload-all, .ax-clear").remove();
            $(".ax-browse-c").addClass("upload-photo-button");
        },
        onSelect:       function(files){                                                        // Function that trigger after a file select has been made, paramter total files in the queue.
            if (files && files.length > 0) {//error is called in prior to onSelect, when it happens client side
                setBlockingLoader($("#uploader_container"));
            }

            $(".ax-details, .ax-progress, .ax-toolbar").remove();
        },

        success:        function(imageId) {                                     // Function that triggers every time a file is uploaded.
            if(this.status == 1) { //success status sent from server
                var scope = angular.element($("body")).scope();

                scope.$applyAsync(function(){
                    scope.productBean.imageIdsList.push(imageId);
                    //$(node).remove();
                });

                setImage(imageId, $(node));
                //removeBlockingLoader($("#uploader_container"));
            } else if(this.status == -1){ //failure status sent from server
                alert(this.info);
            } else { //all other cases, should not be happen...
                alert("Internal error, please try again.")
            }
        },
        error:          function(err, fn){                                                      // Function that triggers if an error occuors during upload.
            alert(err);
            //removeBlockingLoader($("#uploader_container"));
            //TODO: Error message should be presented to user here.. check all possible errors..
            //console.log("error during image upload");
        }
    });
}

function addProductImageIdToProductForm(imageId) {
    imageIdsListToBeSaved.push(imageId);
}


/** Set product image */
function setImage(imageId, $imageWrapperElement, callback){
    var image = $imageWrapperElement.find("img").addClass("new-added");
    $imageWrapperElement.addClass("new-uploaded-image-container");
    //centralizeProductImage(image);
    image.parent().prepend('<span id="remove_img_button" ng-click="removeProductImageFirstStep(' + imageId + ');" class="remove-image-button glyphicon-remove"></span>');
    //$imageWrapperElement.remove();
    //callback($imageWrapperElement);
}


/**
 *  Finally removes images, after SAVE button clicked.
 */
//TODO @Davit refactor method names...
function removeProductImageFinishStep(imageIdsListToBeRemoved) {
    $.ajax( {
        type: "POST",
        //contentType: "application/json",
        dataType: 'json',
        url: "/remove-product-images.json",
        data: {imageIdsList : imageIdsListToBeRemoved},
        success: function (data, textStatus, jqXHR) {
            //alert("success");
        },
        error: function(x, errorMessage, exception) {
            console.warn(errorMessage);
        }
    });
    imageIdsListToBeRemoved = [];
}

/**
 * Adds absolute positioning blocking element over given one.
 * The method takes into consideration only top margin of the given element for right positioning.
 * @param element element to block over
 */
function setBlockingLoader(element, additionalClass) {
    //TODO @Davit - commented temporary, until adding new loader
    //var blocker = $('<div class="dialog-blocker"><div class="blocking-layer"></div><div class="loader-image"></div></div>');
    //if (additionalClass) {
    //    blocker.addClass(additionalClass);
    //}
    //blocker.insertAfter(element);
    //
    ////get the position of the placeholder element
    //if (!element.jquery) {
    //    element = $(element);
    //}
    //var pos    = element.position();
    //var height = element.outerHeight();
    //var width  = element.outerWidth();
    //var topMargin = element.css("marginTop");
    //var leftMargin = element.css("marginLeft");
    //
    ////show the menu directly over the placeholder
    //blocker.css({ "left":pos.left + "px", "top":pos.top + "px", "height":height + "px", "width":width + "px", "marginTop":topMargin, "marginLeft":leftMargin  });
    //
    ////adjust blocking loader zIndex
    //var elementZIndex = element.css("z-index");
    //if (isFinite(elementZIndex)) {
    //    blocker.css("z-index", elementZIndex + 10);
    //}
}

/**
 * Remove block loader.
 * @param element element to block over
 */
//function removeBlockingLoader(element) {
//    if (!element.jquery) {
//        element = $(element);
//    }
//    element.next(".dialog-blocker").remove();
//}


/** Centralize student image */
function centralizeProductImage(image) {
    var imageWrapper = image.parent();
    var imageBoxSizeLen = imageWrapper.height();
    var newImg = new Image();
    newImg.src = image.attr("src");
    newImg.onload = function () {
        renderImage.apply(this, [image, imageBoxSizeLen]);
    }
}


function setImageToBigContainer(newSrc) {
    $('.big-image').find("img").attr('src', newSrc);
}

/**
* Scales image to provided square size and update specified img tag src.
*/
function renderImage($imgTag, imgBoxSideLen) {
    $imgTag.removeAttr("width").
        removeAttr("height").
        css('margin-left', '').
        css('margin-top', '');

    var height = this.height;
    var width = this.width;
    var ratio = height / width;
    var imgUrl = this.src;
    if (width > imgBoxSideLen || height > imgBoxSideLen) {
        if (width < height) {
            $imgTag.attr('width', imgBoxSideLen).
                attr('height', Math.ceil(imgBoxSideLen * ratio)).
                css('margin-top', Math.ceil(imgBoxSideLen * (1 - ratio) / 2));
        } else {
            $imgTag.attr('height', imgBoxSideLen).
                attr('width', Math.ceil(imgBoxSideLen / ratio)).
                css('margin-left', Math.ceil((imgBoxSideLen * (1 - 1 / ratio) / 2)));
        }
    } else {
        if (width < imgBoxSideLen) {
            $imgTag.css('margin-left', Math.ceil((imgBoxSideLen - width) / 2));
        }
        if (height < imgBoxSideLen) {
            $imgTag.css('margin-top', Math.ceil((imgBoxSideLen - height) / 2));
        }
    }
    $imgTag.attr('src', imgUrl);
}

// Scroll small images block down.
function down() {
    //e.preventDefault();

    var scrollDownButton = $(".scroll-arrow.up");
    if(scrollDownButton.css('visibility') == "hidden"){
        scrollDownButton.css('visibility', "visible");
    }

    scrollSmallImagesBlock($("#small_images_wrapper"), this, 67); // 67 is a height of one 'li' (37) plus padding-bottom (5).
}

// Scroll small images block up.
function up() {
    //e.preventDefault();

    var scrollDown = $(".scroll-arrow.down");
    if(scrollDown.css('visibility') == "hidden"){
        scrollDown.css('visibility', "visible");
    }

    scrollSmallImagesBlock($("#small_images_wrapper"), this, -67); // 62 is a height of one 'li' (37) plus padding-bottom (5).
}

var CM_ANIMATION_INPROCESS = false;
/**
 * Scroll given wrapper element.
 * @param classmatesWrapper     DOM element which is scrolls (up / down).
 * @param scrollerButton        Up / down indicator button.
 * @param offset                Offset to animate (height of one 'li' (37) plus padding-bottom (5).).
 */
function scrollSmallImagesBlock(classmatesWrapper, scrollerButton, offset){

    if (CM_ANIMATION_INPROCESS) {
        return;
    }

    CM_ANIMATION_INPROCESS = true;
    var classmatesWrapperScrollTop = classmatesWrapper.scrollTop();

    classmatesWrapper.animate({
        scrollTop: classmatesWrapperScrollTop + offset
    }, 200, function () {

        // Hide up scroller button in top and hide down scroller button in bottom.
        if (classmatesWrapperScrollTop + offset <= 0 ||
            classmatesWrapper[0].scrollHeight - classmatesWrapper.scrollTop() == classmatesWrapper.outerHeight()) {

            $(scrollerButton).css('visibility', "hidden");
        }

        CM_ANIMATION_INPROCESS = false;
    });
}