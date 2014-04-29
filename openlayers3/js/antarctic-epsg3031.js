/**
 * GIBS Web Examples
 *
 * Copyright 2013 - 2014 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.onload = function() {

    Proj4js.defs["EPSG:3031"] =
        "+title=WGS 84 / Antarctic Polar Stereographic " +
        "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 " +
        "+datum=WGS84 +units=m +no_defs";

    var map = new ol.Map({
        view: new ol.View2D({
            maxResolution: 8192.0,
            projection: ol.proj.get("EPSG:3031"),
            extent: [-4194304, -4194304, 4194304, 4194304],
            center: [0, 0],
            zoom: 1,
            maxZoom: 5,
        }),
        target: "map",
        renderer: ["canvas", "dom"],
    });

    var source = new ol.source.WMTS({
        urls: [
            "https://map1a.vis.earthdata.nasa.gov/wmts-antarctic/wmts.cgi",
            "https://map1b.vis.earthdata.nasa.gov/wmts-antarctic/wmts.cgi",
            "https://map1c.vis.earthdata.nasa.gov/wmts-antarctic/wmts.cgi",
        ],
        layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
        extent: [-4194304, -4194304, 4194304, 4194304],
        format: "image/jpeg",
        matrixSet: "EPSG3031_250m",

        tileGrid: new ol.tilegrid.WMTS({
            origin: [-4194304, 4194304],
            resolutions: [
                8192.0,
                4096.0,
                2048.0,
                1024.0,
                512.0,
                256.0
            ],
            matrixIds: [0, 1, 2, 3, 4, 5],
            tileSize: 512
        }),
        attributions: [
            new ol.Attribution({html:
                "<a href='http://ol3js.org'>OpenLayers</a>" +
                "<a href='https://earthdata.nasa.gov/gibs'>" +
                "NASA EOSDIS GIBS</a>" +
                "<a href='https://github.com/nasa-gibs/web-examples/blob/release/openlayers3/js/antarctic-epsg3031.js'>" +
                "View Source" +
                "</a>"
            })
        ]
    });

    // There is no way to add additional parameters into the WMTS call as
    // was possible in OpenLayers 2. Override the tileUrlFunction and add
    // the time parameter to the end.
    var superTileUrlFunction = source.tileUrlFunction;
    source.tileUrlFunction = function() {
        var url = superTileUrlFunction.apply(source, arguments);
        if ( url ) { return url + "&TIME=2013-12-01"; }
    };

    var layer = new ol.layer.Tile({source: source});

    map.addLayer(layer);

 };
