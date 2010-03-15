/* vim:set et ts=4 sw=4 */

window.rapidsms = window.rapidsms || {};
rapidsms.maps = rapidsms.maps || {};

(function(namespace) {
    namespace.Label = function(options) {
        this.wrapper_ = null;
        this.content_ = null;
        this.arrow_   = null;

        this.paneName  = "overlayLayer";
        this.className = "label";
        this.html      = null;
        this.minZoom   = 8;
        this.maxZoom   = 99;
        this.direction = "above";
        this.setValues(options);

        this.is_visible = function() {
            var z = this.map.getZoom();

            return (
                (this.minZoom <= z) &&
                (this.maxZoom >= z));
        };

        this.get_left = function(position) {
            if ((this.direction == "above") || (this.direction == "below"))
                return (position.x - parseInt(this.wrapper_.offsetWidth / 2));

            else if (this.direction == "left")
                return position.x - parseInt(this.wrapper_.offsetWidth);

            else if (this.direction == "right")
                return position.x;
        };

        this.get_top = function(position) {
            if ((this.direction == "left") || (this.direction == "right"))
                return (position.y - parseInt(this.wrapper_.offsetHeight / 2));

            else if (this.direction == "above")
                return position.y - parseInt(this.wrapper_.offsetHeight);

            else if (this.direction == "below")
                return position.y;
        };
    };

    namespace.Label.prototype =
        new google.maps.OverlayView();

    namespace.Label.prototype.onAdd = function() {
        this.wrapper_ = document.createElement("div");
        this.wrapper_.className = "label-wrapper " + this.direction;

        this.arrow_ = document.createElement("div");
        this.arrow_.className = "arrow";
        this.wrapper_.appendChild(this.arrow_);

        this.content_ = document.createElement("div");
        this.content_.className = "label " + this.className;
        this.content_.innerHTML = this.html;
        this.wrapper_.appendChild(this.content_);

        var pane = this.getPanes()[this.paneName];
        pane.appendChild(this.wrapper_);
    };

    namespace.Label.prototype.onRemove = function() {
        this.wrapper_.parentNode.removeChild(this.wrapper_);
        this.wrapper_ = null;
        this.content_ = null;
        this.arrow_   = null;
    };

    namespace.Label.prototype.draw = function() {
        if(!this.is_visible()) {
            this.wrapper_.style.display = "none";
            return false;
        }

        this.wrapper_.style.display = "block";
        var position = this.getProjection().fromLatLngToDivPixel(this.position);
        this.wrapper_.style.left = this.get_left(position) + "px";
        this.wrapper_.style.top = this.get_top(position) + "px";
    };
})(rapidsms.maps);
