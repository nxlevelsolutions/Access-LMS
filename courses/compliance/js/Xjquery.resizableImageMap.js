(function ($) {
    $.fn.resizableImageMap = function (mapName) {
        if (this.length == 0) return this;
        var img = $(this[0]), 
            mapUsed = this.attr("usemap"),
            areas = $("map[name='" + (mapUsed==undefined?"" : mapUsed.substring(1)) + "'] area"),
            natW = getNaturalWidth(img[0]),
            natH = getNaturalHeight(img[0]);
        img.attr("border", "0");
        //console.log("orig" + natW + "," + natH);

        //attach map to image if needed
        if (mapUsed == "" || mapUsed == undefined) {
            if (mapName != undefined && mapName.length > 0) {
                this.attr("usemap", "#" + mapName);
                areas = $("map[name='" + mapName + "'] area");
            }
        }

        function getNaturalWidth(graphic) {
            if (graphic.naturalWidth == undefined) {
                var img = new Image();
                img.src = graphic.src;
                return img.width;
            }
            else {
                return graphic.naturalWidth;
            }
        }
        function getNaturalHeight(graphic) {
            if (graphic.naturalHeight == undefined) {
                var img = new Image();
                img.src = graphic.src;
                return img.height;
            }
            else {
                return graphic.naturalHeight;
            }
        }
        function resizeImageMap() {
            var curW = img.width(),
                curH = img.height(),
                coords,
                values;
            if (!img.is(':visible')) {
                img.parent().show(); //TODO: hardcoded to parent only.. needs to be dynamic
                curW = img.width();
                curH = img.height();
                img.parent().hide();
            }

            areas.each(function (i, area) {
                area = $(area);
                if (area.data("coords") == undefined) {
                    area.data("coords", area.attr("coords"));
                }
                coords = area.data("coords");
                values = coords.split(","); 
                if (values.length == 3) {//do circle
                    var rX = curW / natW,
                        rY = curH / natH;
                    values[0] = Math.round(Number(values[0]) * rX);
                    values[1] = Math.round(Number(values[1]) * rY);
                    values[2] = Math.round(Number(values[2]) * Math.min(rX, rY));
                }
                else { //do squares+polygons
                    for (var i = 0; i < values.length; i += 2) {
                        values[i] = Math.round(Number(values[i]) * curW / natW);
                        values[i+1] = Math.round(Number(values[i+1]) * curH / natH);
                    }
                }
                area.attr("coords", values.toString());
            });
        }

        $(window).resize(function () {
            resizeImageMap();
        });

        resizeImageMap()

        return this;
    };
}(jQuery));