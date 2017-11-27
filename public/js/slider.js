$(document).ready(function() {
    $('input[type="range"]').rangeslider({
        polyfill: false,

        // Default CSS classes
        rangeClass: 'rangeslider',
        disabledClass: 'rangeslider--disabled',
        horizontalClass: 'rangeslider--horizontal',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        // Callback function
        onInit: function() {
            $rangeEl = this.$range;
            // add value label to handle
            var $handle = $rangeEl.find('.rangeslider__handle');
            var handleValue = '<div class="rangeslider__handle__value">' + this.value + '</div>';
            $handle.append(handleValue);

            // get range index labels 
            var rangeLabels = this.$element.attr('labels');
            rangeLabels = rangeLabels.split(', ');

            // add labels
            $rangeEl.append('<div class="rangeslider__labels"></div>');
            $(rangeLabels).each(function(index, value) {
                $rangeEl.find('.rangeslider__labels').append('<span class="rangeslider__labels__label">' + value + '</span>');
            })
        },

        // Callback function
        onSlide: function(position, value) {

            $('#impact-val').text(this.value);

            var valSelected = document.getElementById("year").options[document.getElementById("year").selectedIndex].value;

            switch (valSelected) {
                case "food":
                    $('#impact-val').text((this.value * 4.12).toFixed(1));
                    break;

                case "tree":
                    $('#impact-val').text((this.value * 3.12).toFixed(1));
                    break;

                case "book":
                    $('#impact-val').text((this.value * 7.02).toFixed(1));
                    break;
            }

            var $handle = this.$range.find('.rangeslider__handle__value');
            $handle.text(this.value);
            changeImpactGrid();
        },

        // Callback function
        onSlideEnd: function(position, value) {

        }
    });
});