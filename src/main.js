import * as THREE from 'three';


const words = [
	"MOONMOON",
	"Microsoft Windows",
	"MOON2PREGARIO",
	"GOD SUB",
	"Subscriber only !discord",
	"$24.99",
	"Use ur prime sub on me :D",
	"Poop",
	"NaM",
];
const font_json_url = require('./helvetiker_regular.typeface.jsondumb');

const easeInOutQuart = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;

const loader = new THREE.FontLoader();
loader.load( font_json_url, function ( font ) {
	let camera, scene, renderer;
	console.log(font);
	const tempGeometry = new THREE.TextGeometry( words[Math.floor(Math.random()*words.length)], {
		size: 10,
		height: 3,
		font: font,

		curveSegments: 4,

		bevelThickness: 0.05,
		bevelSize: 0.1,
		bevelEnabled: true,
	} );

	tempGeometry.computeBoundingBox();
	tempGeometry.computeVertexNormals();

	const text_geometry = new THREE.BufferGeometry().fromGeometry( tempGeometry );

	const text_material = new THREE.MeshPhysicalMaterial( { color: new THREE.Color(`hsl(${Math.floor(Math.random()*360)}, ${Math.round(Math.random()*50+20)}%, ${Math.round(Math.random()*50+40)}%)`), clearcoat: 1 } );

	const text_mesh = new THREE.Mesh(text_geometry, text_material);

	text_mesh.castShadow = true;
	text_mesh.receiveShadow = true;

	const box = new THREE.Box3().setFromObject( text_mesh );
	text_mesh.position.x = -box.getSize().x/2;
	text_mesh.position.y = -box.getSize().y/2;

	const group = new THREE.Group();

	const changeVelocity = (velocity) => {
		return (Math.random()/2 + 0.2) * (velocity > 0 ? -1 : 1);
	}
	const boundingBoxSize = 50;
	const position_velocity = [changeVelocity(Math.random()-0.5), changeVelocity(Math.random()-0.5)];

	for (let i = 0; i < 100; i++) console.log(changeVelocity(Math.random()-0.5))

	const rotationspeeds = [
		Math.random()/125+0.001,
		Math.random()/125+0.001,
		Math.random()/125+0.001,
	]
	const rotations = [
		0.5,
		0.5,
		0.5,
	];

	init();
	draw();

	function init() {
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.z = 100;
		camera.position.x = 0;
		camera.lookAt(0,0,0);

		scene = new THREE.Scene();

		const light = new THREE.AmbientLight( 0x555555 ); // soft white light

		const pointLight3 = new THREE.PointLight( 0xffffff );
		pointLight3.position.set( 0, 100, 100 );
		pointLight3.castShadow = true;
		scene.add( pointLight3 );


		scene.add( light );
		group.add(text_mesh);
		scene.add(group);


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

		group.rotation.x = easeInOutQuart(rotations[0])*Math.PI/2-Math.PI/4;
		group.rotation.y = easeInOutQuart(rotations[1])*Math.PI/2-Math.PI/4;
		group.rotation.z = easeInOutQuart(rotations[2])*Math.PI/2-Math.PI/4;

		rotations[0] += rotationspeeds[0]; rotations[0] = Math.min(1, Math.max(0, rotations[0]))
		rotations[1] += rotationspeeds[1]; rotations[1] = Math.min(1, Math.max(0, rotations[1]))
		rotations[2] += rotationspeeds[2]; rotations[2] = Math.min(1, Math.max(0, rotations[2]))

		if (rotations[0] >= 1 || rotations[0] <= 0) rotationspeeds[0]*=-1;
		if (rotations[1] >= 1 || rotations[1] <= 0) rotationspeeds[1]*=-1;
		if (rotations[2] >= 1 || rotations[2] <= 0) rotationspeeds[2]*=-1;

		
		group.position.x += position_velocity[0];
		if (group.position.x > (boundingBoxSize*1.7777) || group.position.x < -(boundingBoxSize*1.7777)) {
			position_velocity[0] = changeVelocity(position_velocity[0]);

			group.position.x = group.position.x > (boundingBoxSize*1.7777) ? (boundingBoxSize*1.7777) : -(boundingBoxSize*1.7777);
		}
		group.position.y += position_velocity[1];
		if (group.position.y > boundingBoxSize || group.position.y < -boundingBoxSize) {
			position_velocity[1] = changeVelocity(position_velocity[1]);

			group.position.y = group.position.y > boundingBoxSize ? boundingBoxSize : -boundingBoxSize;
		}
		renderer.render(scene, camera);
	}
})