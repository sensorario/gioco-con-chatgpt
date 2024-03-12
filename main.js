import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import mapSrc from './src/textures/mappa-terra-di-mezzo.jpg?url'
import isengardSrc from '/isengard/scene.gltf?url'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()

gltfLoader.load(isengardSrc, (gltf) => {
	const scene = gltf.scene
	console.log(scene)
	scene.scale.setScalar(0.08)

	myObject.buildings[2].model = scene

	init()
})

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * BOX
 */
/**
 * mappa
 */
const texture = loader.load(mapSrc)
const mapMat = new THREE.MeshBasicMaterial({
	map: texture,
})
const planeGeom = new THREE.PlaneGeometry(70, 50)
planeGeom.rotateX(-Math.PI * 0.5)
const map = new THREE.Mesh(planeGeom, mapMat)
map.position.y = -0.1

const material = new THREE.MeshNormalMaterial()
const geometry = new THREE.PlaneGeometry(10, 10)
geometry.rotateX(-Math.PI * 0.5)

const tabellone = new THREE.Mesh(geometry, material)

const tabellonePlayer1 = tabellone.clone()
const tabellonePlayer2 = tabellone.clone()
tabellonePlayer1.position.x = 7
tabellonePlayer2.position.x = -7

scene.add(tabellonePlayer1, tabellonePlayer2, map)

// const plane =

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0, 12, 18)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

const dirLight = new THREE.DirectionalLight(0xffffff, 4.5)
const ambLight = new THREE.AmbientLight(0xffffff, 1.5)

scene.add(ambLight, dirLight)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

// gioco LOTR
const myObject = {
	counter: 0,
	incrementCounter: function () {
		if (this.isGameFinished) return // Esci se il gioco è finito
		this.counter++
	},
	interval: 100, // Imposta l'intervallo a 100 millisecondi
	players: [
		{
			nome: 'Frodo',
			energia: 0,
			building: [],
			waitUntil: 0,
			position: new THREE.Vector3(-7, 0, 0),
		},
		{
			nome: 'Aragorn',
			energia: 0,
			building: [],
			waitUntil: 0,
			position: new THREE.Vector3(7, 0, 0),
		},
	],
	threshold: 3,
	isGameFinished: false,
	checkCounter: function () {
		if (this.isGameFinished) return // Esci se il gioco è finito
		if (this.counter % this.threshold === 0) {
			this.players.forEach(function (player) {
				if (myObject.isGameFinished) return // Esci se il gioco è finito
				player.energia += 1
				console.log(
					`${player.nome}: Nuovo valore dell'energia: ${player.energia}`
				)
			})
		}
	},
	buildings: [
		{
			nome: 'Casa',
			energia: 1,
			color: 'red',
		},
		{
			nome: 'Corte',
			energia: 3,
			color: 'green',
		},
		{
			nome: 'Torre Isengard',
			energia: 7,
			color: 'blue',
			model: null,
		},
		{
			nome: 'Ponte',
			energia: 3,
			color: 'yellow',
		},
	],
	funzioneVuota: function () {
		if (this.isGameFinished) return // Esci se il gioco è finito
		this.players.forEach(function (player) {
			if (myObject.isGameFinished) return // Esci se il gioco è finito
			if (player.waitUntil < myObject.counter) {
				const edificiNonOttenuti = myObject.buildings.filter(function (
					edificio
				) {
					return !player.building.some(function (building) {
						return building.nome === edificio.nome
					})
				})

				if (edificiNonOttenuti.length > 0) {
					// Scegli un edificio tra quelli non ancora ottenuti
					const edificioCasuale =
						edificiNonOttenuti[
							Math.floor(Math.random() * edificiNonOttenuti.length)
						]
					console.log(
						`${player.nome}: Risultato: testa (poiché waitUntil è inferiore a counter)`
					)

					// Scegli un edificio tra quelli non ancora ottenuti
					console.log(
						`${player.nome}: Ha ottenuto "${edificioCasuale.nome}" con energia ${edificioCasuale.energia}`
					)

					if (player.energia > edificioCasuale.energia) {
						// Aggiungi l'edificio all'array del giocatore solo se ha più energia
						player.building.push(edificioCasuale)

						let buildingMesh
						if (edificioCasuale.model) {
							buildingMesh = edificioCasuale.model.clone(true)
						} else {
							buildingMesh = new THREE.Mesh(
								new THREE.BoxGeometry(1, 1, 1),
								new THREE.MeshStandardMaterial({ color: edificioCasuale.color })
							)
						}

						scene.add(buildingMesh)
						buildingMesh.position.copy(player.position)
						console.log(player.nome, player.position)
						buildingMesh.position.x += (player.building.length - 1) * 2.5 - 4
						buildingMesh.position.y += 0.5

						console.log(
							`${player.nome}: Ha ottenuto l'edificio "${edificioCasuale.nome}"`
						)

						// Sottrai l'energia del giocatore con il valore dell'edificio
						player.energia -= edificioCasuale.energia
						console.log(`${player.nome}: Energia rimanente: ${player.energia}`)

						// Imposta waitUntil con il valore del contatore più l'energia dell'edificio
						player.waitUntil = myObject.counter + edificioCasuale.energia
						console.log(
							`${player.nome}: waitUntil impostato a ${player.waitUntil}`
						)
					} else {
						console.log(
							`${player.nome}: Non ha abbastanza energia per ottenere l'edificio "${edificioCasuale.nome}"`
						)
					}
				} else {
					console.log(
						`${player.nome}: Ha ottenuto tutti gli edifici disponibili.`
					)
				}
			}
		})
	},

	verificaVittoria: function () {
		if (this.isGameFinished) return // Esci se il gioco è finito
		this.players.forEach(function (player) {
			if (myObject.isGameFinished) return // Esci se il gioco è finito
			if (
				player.building.length === myObject.buildings.length &&
				player.waitUntil < myObject.counter
			) {
				console.log(
					`${player.nome} ha vinto! Ha ottenuto tutti gli edifici disponibili.`
				)
				myObject.isGameFinished = true
			}
		})
	},
}

function init() {
	const interval = setInterval(function () {
		myObject.incrementCounter()
		myObject.checkCounter()
		myObject.funzioneVuota()
		myObject.verificaVittoria()

		if (myObject.isGameFinished) {
			clearInterval(interval)
			console.log('Il gioco è finito!')
		}
	}, myObject.interval)
}
