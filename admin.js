var XOBackgroundMediaUploader, XOSetBackgroundHTML, XORemoveBackground, XOSetAsBackground;

(function($) {

  XOBackgroundMediaUploader = function(options) {
    var self = this, frame = wp.media.frames.file_frame;

    this.settings = {
      uploader_title: '',
      uploader_button_text: '',
      id: '',
      selector: false,
      cb: function(attachment) {}
    };

    this.attachEvents = function attachEvents() {
      $(this.settings.selector).on('click', this.openFrame);
    };

    this.openFrame = function openFrame(e) {
      e.preventDefault();

      frame = wp.media.frames.file_frame = wp.media({
        title: self.settings.uploader_title,
        button: { text: self.settings.uploader_button_text },
        multiple: false,
        library: { type: 'image' }
      });

      frame.on('toolbar:create:select', function() {
        frame.state().set('filterable', 'uploaded');
      });

      frame.on('select', function () {
        var attachment = frame.state().get('selection').first().toJSON();
        self.settings.cb(attachment);
      });

      frame.on('open activate', function() {
        var $target  = $(self.settings.selector);
        if (self.settings.id !== '') {
          var Attachment = wp.media.model.Attachment;
          var selection = frame.state().get('selection');
          selection.add(Attachment.get(self.settings.id));
        }
      });

      frame.open();
    };

    this.init = function init() {
      this.settings = $.extend(this.settings, options);
      this.attachEvents();
    };

    this.init();

    return this;
  };
  
  XOSetBackgroundHTML = function(html) {
    $('.inside', '#postbackgrounddiv').html(html);
  };

  XORemoveBackground = function(id, nonce) {
    $.post(ajaxurl, {
      action: 'set-post-background',
      post_id: id,
      background_id: -1,
      _ajax_nonce: nonce,
      cookie: encodeURIComponent(document.cookie)
    }, function(str) {
      if (str == '0') {
        alert(setPostThumbnailL10n.error);
      } else {
        XOSetBackgroundHTML(str);
      }
    }
    );
  };

  XOSetAsBackground = function(background_id, id, nonce) {
    var $link = $('a#set-post-background');
    $link.text(setPostThumbnailL10n.saving);
    $.post(ajaxurl, {
      action: 'set-post-background',
      post_id: id,
      background_id: background_id,
      _ajax_nonce: nonce,
      cookie: encodeURIComponent(document.cookie)
    }, function(str){
      var win = window.dialogArguments || opener || parent || top;
      $link.text(setPostThumbnailL10n.setThumbnail);
      if (str == '0') {
        alert(setPostThumbnailL10n.error);
      } else {
        $link.show();
        $link.text(setPostThumbnailL10n.done);
        $link.fadeOut(2000);
        win.XOSetBackgroundHTML(str);
      }
    }
    );
  };

}(jQuery));
