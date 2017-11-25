$(document).ready(function() {
    $('select').each(function() {
        var $this = $(this),
            numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select" style="display:table-cell"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function(e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function() {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
            $list.hide();
            var num = $('.rangeslider__handle__value')[0].textContent;
            switch ($this.val()) {
                case "food":
                    $('#impact-stmt').text("FOOD by you in 1 year by doing almost nothing!");
                    $('#impact-val').text(Math.round(num * 12.36));
                    break;

                case "tree":
                    $('#impact-stmt').text("TREE by you in 1 year by doing almost nothing!");
                    $('#impact-val').text(Math.round(num * 3.12));
                    break;

                case "child":
                    $('#impact-stmt').text("CHILD by you in 1 year by doing almost nothing!");
                    $('#impact-val').text(Math.round(num * 7.02));
                    break;
            }
        });

        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });
    });
});