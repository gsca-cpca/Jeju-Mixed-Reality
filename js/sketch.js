mapboxgl.accessToken = 'pk.eyJ1IjoidmluaG50IiwiYSI6ImNqb2VqdXZvaDE4cnkzcG80dXkxZzlhNWcifQ.G6sZ1ukp_DhiSmCvgKblVQ';
const config = {
    markerVisibility: true,
    modelVisibility: true,
    buildingVisibility: true,
    mapmarked: true
}
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [126.53, 33.37],
    zoom: 10,
    antialias: true
});

/**
 *
 * @returns label id of the last layer
 */
function getLastLayer() {
    const layers = map.getStyle().layers;
    let layer;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            layer = layers[i].id;
            break;
        }
    }
    return layer;
}

/**
 * Show / Hide a layer given layer Id
 * @param layerId
 */
function showHideLayer(layerId, mark) {
    let visibility = mark === false ? "none" : "visible";
    map.setLayoutProperty(layerId, 'visibility', visibility);
}

function add3dbuildings() {
    const labelId = getLastLayer();
    let buildings = map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'layout': {
            'visibility': 'visible'
        },
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelId);
    return buildings;
}

function create3dmodel(modelUrl) {
    const modelOrigin = [126.521449, 33.513360];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
    var modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    var THREE = window.THREE;
    var customLayer = {
        id: '3d-model',
        type: 'custom',
        layout: {
            'visibility': 'visible'
        },
        renderingMode: '3d',
        onAdd: function (map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();

            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(100, 100, 100);
            this.scene.add(directionalLight);

            var directionalLight2 = new THREE.DirectionalLight(0xffffff);
            directionalLight2.position.set(0, 70, 100).normalize();
            this.scene.add(directionalLight2);

            var loader = new THREE.GLTFLoader();
            loader.load('assets/model/templar.glb', (function (gltf) {
                gltf.scene.scale.set(0.025, 0.025, 0.025) // scale here
                gltf.scene.rotateY(-0.15)
                this.scene.add(gltf.scene);
            }).bind(this));
            this.map = map;

            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });

            this.renderer.autoClear = false;
        },
        render: function (gl, matrix) {
            var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
            var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
            var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);

            var m = new THREE.Matrix4().fromArray(matrix);
            var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
                .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
                .multiply(rotationX)
                .multiply(rotationY)
                .multiply(rotationZ);

            this.camera.projectionMatrix.elements = matrix;
            this.camera.projectionMatrix = m.multiply(l);
            this.renderer.state.reset();
            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
        }
    };
    map.addLayer(customLayer, 'waterway-label');
    return customLayer;
}

function addMarkers() {
    const locations = {
        main: {
            title: "<h5 class='title'>Hello! My name is Dol hareubang</h5>" +
                "I am also called tol harubang, or harubang. I am a large rock statue found on Jeju Island off the southern tip of South Korea. <\p>" +
                "<p>" +
                "I am usually considered to be a god offering both protection and fertility, and placed outside of gates for protection against demons travelling between realities.</p>" +
                "<p>" +
                "I have become the symbol of Jeju Island, and replicas of various sizes are sold as tourist souvenirs. </p>" +
                "<p>" +
                "Now, let me take you to a great tourist spots of Jeju Island.</p>",
            thumbnailUrl: "assets/images/jeju.png",
            center: [126.53, 33.37],
            thumbnailW: "160px",
            thumbnailH: "200px",
            togglePopUp: false,
            zoom: 10,
            vr_link: "/kwandukjung.html",
            icons: [
                {
                    action: 'street-view',
                    icon: 'fas fa-search-plus fa-border fa-2x',
                    title: 'Go to island'
                },
                {
                    action: 'film-view',
                    icon: 'fas fa-film fa-border fa-2x',
                    title: 'Watch Videos'
                },
                {
                    action: 'vr-view',
                    icon: 'fas fa-vr-cardboard fa-border fa-2x',
                    url: '/harubang.html',
                    title: 'Virtual Reality Tour'
                },
                {
                    action: 'ar-view',
                    icon: 'fas fa-mobile-alt fa-border fa-2x',
                    title: 'Augmented Reality View'
                }
            ]
        },
        kwandukjung: {
            title: "Here is one of the oldest standing architectures on Jeju Island." +
                "<p>" +
                "Gwandeokjeong Pavilion was built by Pastor Sin Suk-Cheong in the thirtieth year of King Sejong's reign (1448) as a training ground. For its historic contribution to strengthening the mind and soul of soldiers, <p> Gwangdeokjeong was designated as National Treasure in 1963. Today, the pavilion serves as a model of excellence in soldier training",
            thumbnailUrl: "https://raw.githubusercontent.com/Alex-Nguyen/jeju/master/assets/images/Kwandukjung.jpg",
            center: [126.521502, 33.51344],
            thumbnailW: "200px",
            thumbnailH: "160px",
            togglePopUp: false,
            zoom: 10,
            vr_link: "/kwandukjung.html",
            icons: [
                {
                    action: 'avatar-speech',
                    icon: 'fas fa-volume-up fa-border fa-2x',
                    title: 'Introduction'
                },
                {
                    action: 'street-view',
                    icon: 'fas fa-search-plus fa-border fa-2x',
                    title: 'Go to island'
                },
                {
                    action: 'film-view',
                    icon: 'fas fa-film fa-border fa-2x',
                    title: 'Watch Videos'
                },
                {
                    action: 'vr-view',
                    icon: 'fas fa-vr-cardboard fa-border fa-2x',
                    url: '/harubang.html',
                    title: 'Virtual Reality Tour'
                },
                {
                    action: 'ar-view',
                    icon: 'fas fa-mobile-alt fa-border fa-2x',
                    title: 'Augmented Reality View'
                }
            ]
        },
        bijarim: {
            title: "Bijarim Forest is an ideal spot for a relaxing forest retreat. The dense forest is home to hundreds of bija (nutmeg yew) trees, and is the largest forest in the world to be made up of one plant species.<p> Most of the trees in the forest have lived for 500 to 700 years, earning the forest the nickname “Forest of a Thousand Years.” A must-see sight while at Bijarim Forest is none other than the 800-year old, conjoined nutmeg yews.",
            thumbnailUrl: "https://raw.githubusercontent.com/Alex-Nguyen/jeju/master/assets/images/Bijarim.jpg",
            center: [126.808487, 33.485726],
            thumbnailW: "200px",
            thumbnailH: "160px",
            togglePopUp: false,
            zoom: 10,
            icons: [
                {
                    action: 'street-view',
                    icon: 'fas fa-street-view fa-border fa-2x',
                    title: 'Go to island'
                },
                {
                    action: 'film-view',
                    icon: 'fas fa-film fa-border fa-2x',
                    title: 'Watch Videos'
                },
                {
                    action: 'vr-view',
                    icon: 'fas fa-vr-cardboard fa-border fa-2x',
                    url: '/harubang.html',
                    title: 'Virtual Reality Tour'
                },
                {
                    action: 'film-view',
                    icon: 'fas fa-mobile-alt fa-border fa-2x',
                    title: 'Augmented Reality View'
                }
            ]
        },
        folk: {
            title: "The Jeju Folk Village is the island’s main tourist attraction where customs of the old days can be explored. At Jeju Folk Village the unique lifestyle and traditional culture of Jeju Island are presented as they appeared during the 19th century. A mountain village, fishing village, botanical garden, market place, an old government building and authentic shamanistic rites one recreated on this 4500-hectare site in Pyoseon-ri",
            thumbnailUrl: "https://raw.githubusercontent.com/Alex-Nguyen/jeju/master/assets/images/Village.jpg",
            center: [126.842149, 33.322579],
            thumbnailW: "200px",
            thumbnailH: "160px",
            togglePopUp: false,
            zoom: 10,
            icons: [
                {
                    action: 'street-view',
                    icon: 'fas fa-street-view fa-border fa-2x',
                    title: 'Go to island'
                },
                {
                    action: 'film-view',
                    icon: 'fas fa-film fa-border fa-2x',
                    title: 'Watch Videos'
                },
                {
                    action: 'vr-view',
                    icon: 'fas fa-vr-cardboard fa-border fa-2x',
                    url: '/harubang.html',
                    title: 'Virtual Reality Tour'
                },
                {
                    action: 'film-view',
                    icon: 'fas fa-mobile-alt fa-border fa-2x',
                    title: 'Augmented Reality View'
                }
            ]
        }
    };
    Object.keys(locations).forEach(loc => {
        let footer = document.createElement('nav');
        footer.className = 'nav justify-content-center icon-bar';
        if (locations[loc].hasOwnProperty('icons') === true) {
            locations[loc]["icons"].forEach((icon, ii) => {
                let li = document.createElement('li');
                li.id = `btn-${loc}-${icon.action}`;
                li.className = 'nav-item px-2';
                li.title = icon.title;
                let i = document.createElement('i');
                i.style.border = "#390 1px solid";
                i.className = icon.icon;
                li.appendChild(i);
                footer.appendChild(li);
            })
        }
        let popUp = new mapboxgl.Popup({offset: 100})
        // .setHTML(`${locations[loc].title}`)
            .setHTML(`${locations[loc].title} ${footer.outerHTML}`)
        let el = document.createElement('div');
        el.id = loc;
        el.className = 'img-thumbnail marker';
        el.style.backgroundImage = `url(${locations[loc].thumbnailUrl})`;
        el.style.width = locations[loc].thumbnailW;
        el.style.height = locations[loc].thumbnailH;


        let marker = new mapboxgl.Marker(el)
            .setLngLat(locations[loc].center)
            .setPopup(popUp) // sets a popup on this marker
            .addTo(map);

    });

}

function showHideMarker(mark) {

    let markers = document.getElementsByClassName("marker");
    for (let i = 0; i < markers.length; i++) {
        markers[i].style.visibility = mark === true ? 'visible' : 'hidden';
    }
}

map.on('load', function () {
    addMarkers();
    let buildings = add3dbuildings();
    let model3d = create3dmodel('assets/model/templar.glb');

});

$(document).on('click', '#btn-intro-street-view', function () {
    $('.mapboxgl-popup').hidden();
    map.flyTo({
        center: [126.53, 33.37],
        zoom: 16,
        speed: 0.5
    });
});
$(document).on('click', '#map-marked', function (e) {
    e.preventDefault();
    e.stopPropagation();
    config.mapmarked = !config.mapmarked;
    let mark = config.mapmarked;
    if (mark) {
        $(this).addClass("active")
    } else {
        $(this).removeClass('active')
    }
    showHideMarker(mark);
});
$(document).on('click', '#land-marked', function (e) {
    e.preventDefault();
    e.stopPropagation();
    config.buildingVisibility = !config.buildingVisibility;
    let mark = config.buildingVisibility;
    if (mark) {
        $(this).addClass("active")
    } else {
        $(this).removeClass('active')
    }
    showHideLayer('3d-buildings', mark);
});

$(document).on('click', '#model3d', function (e) {
    e.preventDefault();
    e.stopPropagation();
    config.modelVisibility = !config.modelVisibility;
    let mark = config.modelVisibility;
    if (mark) {
        $(this).addClass("active")
    } else {
        $(this).removeClass('active')
    }
    showHideLayer('3d-model', mark);
});

$(document).on('click', '#btn-kwandukjung-street-view', function () {
    $('.mapboxgl-popup').hide();
    map.flyTo({
        center: [126.521449, 33.513360],
        zoom: 20.5,
        speed: 0.5,
        pitch: 70
    });
    map.once('moveend', function () {
        config.mapmarked = !config.mapmarked;
        let mark = config.mapmarked;
        if (mark) {
            $("#map-marked").addClass("active");
            $("#land-marked").addClass("active");
        } else {
            $("#map-marked").removeClass('active');
            $("#land-marked").removeClass('active');
        }
        showHideMarker(mark);
        showHideLayer('3d-buildings', mark);
    })
});

$(document).on('click', '#btn-kwandukjung-film-view', function () {
    let embedded = $('.mapboxgl-popup-content').find('#kwandukjung-film-view-video');
    if (embedded.length > 0) {
        let el = $('#kwandukjung-film-view-video');
        if (el.is(":visible")) {
            el.hide();
        } else {
            el.show();
        }
    } else {
        $('.mapboxgl-popup-content').append("<iframe id='kwandukjung-film-view-video' width=\"320\"  src=\"https://www.youtube.com/embed/BCkhSmAdg2A\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>");

    }
});


$(document).on('click', '#btn-kwandukjung-ar-view', function () {
    let embedded = $('.mapboxgl-popup-content').find('#kwandukjung-ar-view');
    if (embedded.length > 0) {
        let el = $('#kwandukjung-ar-view');
        if (el.is(":visible")) {
            el.hide();
        } else {
            el.show();
        }
    } else {
        $('.mapboxgl-popup-content').append("" +
            "<div id='kwandukjung-ar-view'>" +
            "<a href='assets/images/pattern-templar_marker.png' download><img download title='Print this map'  style='border:1px solid gray; cursor: pointer' src='assets/images/pattern-templar_marker.png' width='100px' height='100px'></a>" +
            "" +
            "<img title='Point your camera to this marker to url' style='border:1px solid gray; margin-left:10px; cursor: pointer' src='assets/images/pattern-templar_marker_qr.png' width='100px' height='100px'></div>");

    }
});

$(document).on('click', '#btn-main-ar-view', function () {
    let embedded = $('.mapboxgl-popup-content').find('#main-ar-view');
    if (embedded.length > 0) {
        let el = $('#main-ar-view');
        if (el.is(":visible")) {
            el.hide();
        } else {
            el.show();
        }
    } else {
        $('.mapboxgl-popup-content').append("" +
            "<div id='main-ar-view'>" +
            "<a href='assets/images/pattern-harubang-marker.png' download><img download title='Print this map'  style='border:1px solid gray; cursor: pointer' src='assets/images/pattern-harubang-marker.png' width='100px' height='100px'></a>" +
            "" +
            "<img title='Point your camera to this marker to url' style='border:1px solid gray; margin-left:10px; cursor: pointer' src='assets/images/pattern-templar_marker_qr.png' width='100px' height='100px'></div>");

    }
});

$(document).on('click', '#btn-kwandukjung-vr-view', function () {
    window.open('/jeju/Gwandeokjeong.html')
});

$(document).on('click', '#btnHome', function () {
    map.flyTo({
        center: [126.53, 33.37],
        zoom: 10,
        antialias: true,
        speed: 2,
        pitch: 0,
        bearing: 0
    });
});
var sup1 = new SuperGif({gif: document.getElementById('exampleimg')});
sup1.load(function () {
    $(document).on('click', '#btn-kwandukjung-avatar-speech', function () {

        var text = "Here is one of the oldest standing architectures on Jeju Island. Gwandeokjeong Pavilion was built by Pastor Sin Suk-Cheong in the thirtieth year of King Sejong's reign as a training ground. For its historic contribution to strengthening the mind and soul of soldiers. Gwangdeokjeong was designated as National Treasure in nineteen sixty three. Today, the pavilion serves as a model of excellence in soldier training"
        var substrings = text.match(/[^.?,!]+[.?,!]?/g);
        for (var i = 0, l = substrings.length; i < l; ++i) {
            var str = substrings[i].trim();

            // Make sure there is something to say other than the deliminator
            var numpunc = (str.match(/[.?,!]/g) || []).length;
            if (str.length - numpunc > 0) {

                // suprisingly decent approximation for multiple languages.

                // if you change the rate, you would have to adjust
                var speakingDurationEstimate = str.length * 50;
                // Chinese needs a different calculation.  Haven't tried other Asian languages.
                if (str.match(/[\u3400-\u9FBF]/)) {
                    speakingDurationEstimate = str.length * 200;
                }

                var msg = new SpeechSynthesisUtterance();

                (function (dur) {
                    msg.addEventListener('start', function () {
                        sup1.play_for_duration(dur);
                    })
                })(speakingDurationEstimate);

                // The end event is too inacurate to use for animation,
                // but perhaps it could be used elsewhere.  You might need to push
                // the msg to an array or aggressive garbage collection fill prevent the callback
                // from firing.
                //msg.addEventListener('end', function (){console.log("too late")}

                msg.text = str;
                //change voice here
                //msg.voice = voice;

                window.speechSynthesis.speak(msg);
            }
        }
    });
});
$( "#iconfig" ).on( "click", function() {
    $( "#dialog-message" ).dialog( "open" );
});
$( "#dialog-message" ).dialog({
    autoOpen: false,
    maxWidth:1280,
    maxHeight: 800,
    width: 900,
    height: 650,
    buttons: {
        Save: function() {
            $( this ).dialog( "close" );
        },
        Cancel: function() {
            $( this ).dialog( "close" );
        }
    },
    show: {
        effect: "blind",
        duration: 1000
    },
    hide: {
        effect: "explode",
        duration: 1000
    }
});