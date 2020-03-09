import * as THREE from 'three';


const words = [
	"MOONMOON",
	"MICROSOFT WINDOWS",
	"MOON2PREGARIO",
	"NaM",
	"NaM NaM NaM NaM",
];
const font_json_url = require('./Roboto-Regular-msdf.jsondumb');

const loader = new THREE.FontLoader();
loader.load( font_json_url, function ( font ) {
	let camera, scene, renderer;
	console.log(font);
	const tempGeometry = new THREE.TextGeometry( words[Math.floor(Math.random()*words.length)], {
		size: 20,
		height: 1,
		font: font,

		curveSegments: 4,

		bevelThickness: 2,
		bevelSize: 1.5,
		bevelEnabled: false,
	} );

	tempGeometry.computeBoundingBox();
	tempGeometry.computeVertexNormals();

	const text_geometry = new THREE.BufferGeometry().fromGeometry( tempGeometry );

	const text_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

	const text_mesh = new THREE.Mesh(text_geometry, text_material);

	init();
	draw();

	function init() {
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.z = 100;
		camera.position.x = 100;
		camera.lookAt(0,0,0);

		scene = new THREE.Scene();

		const light = new THREE.AmbientLight( 0x555555 ); // soft white light
		scene.add( light );
		scene.add(text_mesh);


		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		
		window.addEventListener('resize', ()=>{
			console.log('resizing', camera.aspect);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		})
	}

	function draw() {
		requestAnimationFrame(draw);

		renderer.render(scene, camera);
	}
})