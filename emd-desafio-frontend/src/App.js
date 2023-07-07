import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import scrollama from 'scrollama';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//Aqui defini um objeto layerTypes 
//que mapeia os tipos de camadas do Mapbox GL JS 
//para as propriedades de opacidade correspondentes.
const layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity']
}

//Esse objeto alignments mapeia as opções de alinhamento
// para classes CSS correspondentes.
const alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty'
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentChapter: props.chapters[0]
        };
    }

    componentDidMount() {
        const config = this.props;
        const mapStart = config.chapters[0].location;

        mapboxgl.accessToken = config.accessToken;

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: config.style,
            center: mapStart.center,
            zoom: mapStart.zoom,
            pitch: mapStart.pitch,
            bearing: mapStart.bearing,

        });

        //parâmetros para garantir que o modelo seja georreferenciado corretamente no mapa
        const modelOrigin = [-43.21048, -22.95181];
        const modelAltitude = 0;
        const modelRotate = [Math.PI / 2, 0, 0];

        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
            modelOrigin,
            modelAltitude
        );

        //parâmetros de transformação para posicionar, girar e dimensionar o modelo 3D no mapa
        const modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
            /* Since the 3D model is in real world meters, a scale transform needs to be
             * applied since the CustomLayerInterface expects units in MercatorCoordinates.
             */
        };


        // configuration of the custom layer for a 3D model per the CustomLayerInterface
        const customLayer = {
            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();

                // create two three.js lights to illuminate the model
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
                directionalLight.position.set(-100, -70, 100).normalize();
                this.scene.add(directionalLight);

                const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
                directionalLight2.position.set(100, 70, 100).normalize();
                this.scene.add(directionalLight2);

                // use the three.js GLTF loader to add the 3D model to the three.js scene
                const loader = new GLTFLoader();
                loader.load(
                    'cristo.gltf',
                    (gltf) => {
                        this.scene.add(gltf.scene);
                    }
                );
                this.map = map;

                // use the Mapbox GL JS map canvas for three.js
                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                this.renderer.autoClear = false;
            },
            render: function (gl, matrix) {
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                );

                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        modelTransform.translateX,
                        modelTransform.translateY,
                        modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            modelTransform.scale,
                            -modelTransform.scale,
                            modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);

                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            }
        };
        map.on('style.load', () => {
            map.addLayer(customLayer, 'waterway-label');
        });

        const marker = new mapboxgl.Marker();
        if (config.showMarkers) {
            marker.setLngLat(mapStart.center).addTo(map);
        }

        function getLayerPaintType(layer) {
            var layerType = map.getLayer(layer).type;
            return layerTypes[layerType];
        }

        function setLayerOpacity(layer) {
            var paintProps = getLayerPaintType(layer.layer);
            paintProps.forEach(function (prop) {
                map.setPaintProperty(layer.layer, prop, layer.opacity);
            });
        }

        const setState = this.setState.bind(this);

        // instancia do scrollama
        const scroller = scrollama();

        map.on('load', function () {

            // setup the instance, pass callback functions
            scroller
                .setup({
                    step: '.step',
                    offset: 0,
                    progress: true
                })
                .onStepEnter(response => {
                    const chapter = config.chapters.find(chap => chap.id === response.element.id);
                    setState({ currentChapter: chapter });

                    // Define as opções de animação
                    const flyOptions = {
                        center: chapter.location.center,
                        zoom: chapter.location.zoom,
                        bearing: chapter.location.bearing,
                        pitch: chapter.location.pitch,
                        duration: 2000, // Duração da animação em milissegundos (aqui definimos 2 segundos)
                        easing: t => t, // Curva de aceleração linear (pode ser alterada para outras curvas)
                    };
                    // Executa a animação com as opções definidas
                    map.flyTo(flyOptions);

                })
                .onStepExit(response => {
                    var chapter = config.chapters.find(chap => chap.id === response.element.id);
                    if (chapter.onChapterExit.length > 0) {
                        chapter.onChapterExit.forEach(setLayerOpacity);
                    }
                });
        });

        window.addEventListener('resize', scroller.resize);

        // Adiciona o event listener para o scroll
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        // Remove o event listener quando o componente é desmontado para evitar memory leaks
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        // Verifica se o usuário chegou ao final da página
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            // Se sim, rola a página para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    }

    render() {
        const config = this.props;
        const theme = config.theme;
        const currentChapterID = this.state.currentChapter.id;
        return (
            <div>
                <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
                <div id="story">
                    {config.title &&
                        <div id="header" >
                            <h1>
                                <div className="logo-container">
                                    {config.image && <img src={config.image} alt="Imagem do título" className="logo" />} {/* Adicionando a imagem */}
                                    {config.title}
                                </div>
                            </h1>
                            {config.subtitle &&
                                <h2>{config.subtitle}</h2>
                            }
                            {config.byline &&
                                <p>{config.byline}</p>
                            }
                        </div>
                    }
                    <div id="features" className={alignments[config.alignment]}>
                        {
                            config.chapters.map(chapter =>
                                <Chapter key={chapter.id} theme={theme} {...chapter} currentChapterID={currentChapterID} />
                            )
                        }
                    </div>
                 
                </div>
            </div>
        );
    }

}

function Chapter({ id, theme, title, image, description, currentChapterID }) {
    const classList = id === currentChapterID ? "step active" : "step";

    return (
        <div id={id} className={`${classList}`}>
            <div className={id === "corcovado" ? "" : theme}>
                {title && <h3 className="title">{title}</h3>}
                {image && <img src={image} alt={title} />}
                {description && <p>{description}</p>}
            </div>
        </div>
    );
}


export default App;
