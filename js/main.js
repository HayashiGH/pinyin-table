$(function () {

    // ===============================
    // CLICK MỞ BALLOON
    // ===============================
    $('table td > p').on('click', function (e) {

        // bỏ qua balloon & play
        if ($(this).hasClass('balloon') || $(this).hasClass('play')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation(); // ✅ CHỈ chặn khi mở balloon

        // đóng hết balloon khác
        $('.balloon').addClass('hidden');

        var balloon = $(this).next('.balloon');
        var paragraph = $(this);

        if (!balloon.length) return;

        // set vị trí balloon
        if (balloon.offset().left === 0) {
            var position = paragraph.offset();
            var left, top;

            if (position.left > 1026) {
                left = position.left - 100;
            } else {
                left = position.left + 30;
            }

            top = position.top - 43;

            balloon.css({
                left: left + 'px',
                top: top + 'px'
            });
        }

        balloon.removeClass('hidden');
    });

    // ===============================
    // CLICK TRONG BALLOON → KHÔNG ĐÓNG
    // ===============================
    $(document).on('click', '.balloon', function (e) {
        e.stopPropagation();
    });

    // ===============================
    // CLICK NGOÀI → ĐÓNG BALLOON
    // ===============================
    $(document).on('click', function () {
        $('.balloon').addClass('hidden');
    });

    // ===============================
    // PLAY AUDIO
    // ===============================
    $('.play').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var button = $(this);
        var player = $('#player');
        player.html('');

        var sources = [
            { src: button.data('ogg'), type: 'audio/ogg; codecs=vorbis' },
            { src: button.data('wav'), type: 'audio/wav' },
            { src: button.data('mp3'), type: 'audio/mpeg' },
            { src: button.data('aac'), type: 'audio/aac' }
        ];

        $.each(sources, function (_, s) {
            if (s.src) {
                player.append('<source src="' + s.src + '" type="' + s.type + '">');
            }
        });

        var audio = player[0];
        audio.load();
        audio.loop = false;
        audio.play();
    });

    // ===============================
    // EMBED
    // ===============================
    function embed() {
        var showEmbed = $('#show_embed_button').prop('checked')
            ? '?show_embed_button=true'
            : '';

        var url = window.location.protocol + '//' +
                  window.location.host +
                  window.location.pathname;

        $('.share textarea').html(
            '<iframe src="' + url + showEmbed +
            '" width="1126px" height="' +
            window.ifRameHeight + 'px"></iframe>'
        );
    }

    $('.share button').on('click', function (e) {
        e.preventDefault();
        window.ifRameHeight = $('body').height();
        $('.share .hidden').removeClass('hidden');
        embed();
    });

    $('#show_embed_button').on('click', embed);

    if (window !== window.top) {
        if (getUrlParam('show_embed_button') !== 'true') {
            $('.share').addClass('hidden');
        }
    }

    // ===============================
    // HOVER TABLE
    // ===============================
    $('table td > p').mouseenter(function () {
        if ($(this).hasClass('balloon')) return;

        var td = $(this).parent();
        var index = td.index();

        $('table tr').each(function () {
            $(this).children().eq(index).addClass('hovered');
        });

        var tr = td.parent();
        var pIndex = td.children('p:not(.balloon)').index(this);
        var firstRow = tr.index() === 0;

        tr.children().each(function () {
            $(this).children('p:not(.balloon)').eq(pIndex).addClass('hovered');
            if (firstRow) $(this).addClass('hovered');
        });
    });

    $('table td > p').mouseleave(function () {
        $('table td, table th, table p').removeClass('hovered');
    });

    // ===============================
    // SCROLL FIXED COLUMN
    // ===============================
    $(window).on('scroll', function () {
        var left = $(document).scrollLeft();
        $('table tr td:first-child').toggleClass('fixed', left > 0);
    });

});

// ===============================
// GET URL PARAM
// ===============================
function getUrlParam(name) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
        var row = params[i].split('=');
        if (row[0] === name) return row[1];
    }
}
