$(document).ready(function() {
    initRangeSlider();
});

function initRangeSlider() {
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
            var $handle = this.$range.find('.rangeslider__handle__value');
            $handle.text(this.value);
            changeImpactGrid();
        },

        // Callback function
        onSlideEnd: function(position, value) {}
    });
}