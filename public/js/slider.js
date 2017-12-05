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
            var drawValue = '<div class="rangeslider__handle__draw"><img src="/image/yellow_point.png" style="width:50px"/></div>';
            $handle.append(drawValue);
            var slideVal = '<div class="rangeslider__handle__slide" class="white">' + "Slide me!" + '</div>';
            $handle.append(slideVal);

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

            var valSelected = document.getElementById("year").options[document.getElementById("year").selectedIndex].value;
            var val;
            switch (valSelected) {
                case "food":
                    val = this.value * 4.12;
                    break;

                case "tree":
                    val = this.value * 3.12;
                    break;

                case "book":
                    val = this.value * 7.02;
                    break;
            }

            val = val > 10 ? val.toFixed(1) : val.toFixed(2);
            $('#impact-val').text(val);
            $('#small-impact-val').text(val);

            var $handle = this.$range.find('.rangeslider__handle__value');
            $handle.text(this.value);
            changeImpactGrid();
        },

        // Callback function
        onSlideEnd: function(position, value) {}
    });
});