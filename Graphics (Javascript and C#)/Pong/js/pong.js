var renderer;
var scene;
var camera;
var cube;
var pause = true;
var font;
var start = false;

//Creates the scene and camera and calls all other functions
function init()
{
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.1);
	var loader = new THREE.FontLoader();
	font = loader.parse(fontJSON);

	initRenderer();
	initCamera();
	addSpotLight();
	createBottom();
	createPaddles();
	createBoundingWalls();
	createBall();
	loadSounds();
	createText();
	updateScore();

	document.body.appendChild(renderer.domElement);
	render();
}


//Constantly renders the scene and manages all key inputs
var delay = false;
function render()
{
	
	var timer = 0;

	renderer.render(scene, camera);
	requestAnimationFrame(render);

	if (Key.isDown(Key.ESC))
	{
		pause = true;
		audio.pause();
	}
	else if (Key.isDown(Key.ENTER))
	{
		pause = false;
		audio.play();
	}

	if (Key.isDown(Key._1))
	{
		diffCount = 0;
		toggleDifficulty();
	}
	else if (Key.isDown(Key._2))
	{
		diffCount = 1;
		toggleDifficulty();
	}
	else if (Key.isDown(Key._3))
	{
		diffCount = 2;
		toggleDifficulty();
	}


	if (delay == true)
	{
		var delayMillis = 1000; 

		setTimeout(function() {
			delay = false;
		}, delayMillis);
	}

	if (Key.isDown(Key.T))
	{
		toggleControls();
		delay = true;
	}

	if(Key.isDown(Key.R))
	{
		score1 = score2 = 0;
		start = false;
		ball.position.x = ball.position.y = paddle1.position.x = 0;
		paddle2.position.x = 0;
		speed = 0.25;
		xDir = (Math.random() - 0.5) * 0.18;
		yDir = Math.random() < 0.5 ? (speed - Math.abs(xDir)) : -(speed - Math.abs(xDir));
		pause = true;
		updateScore();
	}

	if (pause == false)
	{
		if (start == false)
		{
			var delayMillis = 300;

			setTimeout(function() {
 		 		start = true;
			}, delayMillis);
		}
		else
		{

			moveBallAndMaintainPaddles();
		}
	}

	//controls.update();

	renderer.render (scene, camera);
}

// Instantiates the renderer
function initRenderer()
{
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
}

// Positions the Camera
function initCamera()
{
	camera.position.x = 0;
	camera.position.y = -22;
	camera.position.z = 11.3;
	camera.rotation.x = 1.12;
}

// Adds light to the scene
function addSpotLight()
{
	spotLight = new THREE.SpotLight( 0xffffff, 1.7);
    spotLight.position.set( 0, -24, 30 );
    spotLight.shadowCameraNear = 20;
    spotLight.shadowCameraFar = 50;
    spotLight.castShadow = true;
    spotLight.rotation.y = 2.3;
    scene.add(spotLight);
}

// Creates the bottom plane of the arena
function createBottom()
{
	var planeGeometry = new THREE.PlaneGeometry(14, 20, 10, 10);
	var planeMaterial = new THREE.MeshLambertMaterial({color: 'green'});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(plane);

	var lineGeometry = new THREE.PlaneGeometry(9, 1, 10, 10);
	var lineMaterial = new THREE.MeshLambertMaterial({color: 'black'});
	var line = new THREE.Mesh(lineGeometry, lineMaterial);
	line.position.z = 0.002;
	scene.add(line);

	var ringGeometry = new THREE.RingGeometry(4.3, 4.9, 40);
	var ringMaterial = new THREE.MeshLambertMaterial({color: 'black'});
	var ring = new THREE.Mesh(ringGeometry, ringMaterial);
	ring.position.z = 0.001;
	scene.add(ring);

	ringGeometry = new THREE.RingGeometry(1.5, 2, 40);
	ringMaterial = new THREE.MeshLambertMaterial({color: 'black'});
	var ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
	ring2.position.z = 0.004;
	scene.add(ring2);

	var circleGeometry = new THREE.CircleGeometry(4.3, 20, 0, Math.PI);
	var circleMaterial = new THREE.MeshLambertMaterial({color: 'red'});
	var	circle1 = new THREE.Mesh(circleGeometry, circleMaterial);
	circle1.position.z = 0.001;
	scene.add(circle1);

	circleGeometry = new THREE.CircleGeometry(4.3, 20, 0, Math.PI);
	circleMaterial = new THREE.MeshLambertMaterial({color: 'white'});
	var	circle2 = new THREE.Mesh(circleGeometry, circleMaterial);
	circle2.position.z = 0.001;
	circle2.rotation.z = Math.PI;
	scene.add(circle2);

	circleGeometry = new THREE.CircleGeometry(1.6, 20);
	circleMaterial = new THREE.MeshLambertMaterial({color: 'white'});
	var	circle3 = new THREE.Mesh(circleGeometry, circleMaterial);
	circle3.position.z = 0.003;
	scene.add(circle3);

	circleGeometry = new THREE.CircleGeometry(0.5, 20);
	circleMaterial = new THREE.MeshLambertMaterial({color: 'black'});
	var	circle4 = new THREE.Mesh(circleGeometry, circleMaterial);
	circle4.position.z = 0.004;
	scene.add(circle4);


}

// Creates bounding walls (bleachers)
function createBoundingWalls()
{
	var wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8;

	// Left bleachers
	var leftWall = new THREE.BoxGeometry(0.7, 20, 0.5);
	var wallMaterial = new THREE.MeshStandardMaterial({color:'grey'});
	wall1 = new THREE.Mesh(leftWall, wallMaterial);
	wall1.position.x = -7;
	wall1.position.z = 0.25;
	scene.add(wall1);

	leftWall = new THREE.BoxGeometry(0.7, 20, 1);
	wall2 = new THREE.Mesh(leftWall, wallMaterial);
	wall2.position.x = -7.7;
	wall2.position.z = 0.5;
	scene.add(wall2);

	leftWall = new THREE.BoxGeometry(0.7, 20, 1.5);
	wall3 = new THREE.Mesh(leftWall, wallMaterial);
	wall3.position.x = -8.4;
	wall3.position.z = 0.75;
	scene.add(wall3);


	leftWall = new THREE.BoxGeometry(0.7, 20, 2);
	wall4 = new THREE.Mesh(leftWall, wallMaterial);
	wall4.position.x = -9.1;
	wall4.position.z = 1;
	scene.add(wall4);

	// Right bleachers
	var rightWall = new THREE.BoxGeometry(0.7, 20, 0.5);
	wall5 = new THREE.Mesh(rightWall, wallMaterial);
	wall5.position.x = 7;
	wall5.position.z = 0.25;
	scene.add(wall5);

	rightWall = new THREE.BoxGeometry(0.7, 20, 1);
	wall6 = new THREE.Mesh(rightWall, wallMaterial);
	wall6.position.x = 7.7;
	wall6.position.z = 0.5;
	scene.add(wall6);

	rightWall = new THREE.BoxGeometry(0.7, 20, 1.5);
	wall7 = new THREE.Mesh(rightWall, wallMaterial);
	wall7.position.x = 8.4;
	wall7.position.z = 0.75;
	scene.add(wall7);


	rightWall = new THREE.BoxGeometry(0.7, 20, 2);
	wall8 = new THREE.Mesh(rightWall, wallMaterial);
	wall8.position.x = 9.1;
	wall8.position.z = 1;
	scene.add(wall8);
}

// Creates the player and AI paddle
var paddle1, paddle2
function createPaddles()
{
	var opponentPaddle = new THREE.BoxGeometry(2, .5, 1);
	var paddleMaterial = new THREE.MeshStandardMaterial({color:'blue'});
	paddle1 = new THREE.Mesh(opponentPaddle, paddleMaterial);
	paddle1.position.y = 9;
	paddle1.position.z = .2;
	scene.add(paddle1);

	var playerPaddle = new THREE.BoxGeometry(2, .5, 3);
	paddleMaterial2 = new THREE.MeshStandardMaterial({color:'red'});
	paddle2 = new THREE.Mesh(opponentPaddle, paddleMaterial2);
	paddle2.position.y = -9;
	paddle2.position.z = .2;
	scene.add(paddle2);
}

// Creates the ball
var ball;
function createBall()
{
	var ballSphere = new THREE.SphereGeometry(.35);
	var ballMaterial = new THREE.MeshStandardMaterial({color:'white'});
	ball = new THREE.Mesh(ballSphere, ballMaterial);
	ball.position.z = 0.35;
	scene.add(ball);
}

// Adds all text. Including: controls, title, difficulty
var control, pauseC, startC, replayC, difficultyC, movementC, toggleC;
var diffControl, easy, medium, hard;
var easyMark = null, mediumMark = null, hardMark = null;
function createText()
{
	var title1, title2;

	var geometry = new THREE.TextGeometry("Po", {font: font, size: 3, height: 0.5, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	var material = new THREE.MeshStandardMaterial({color: 'blue'});
	title1 = new THREE.Mesh(geometry, material);
	title1.position.z = 8.3;
	title1.position.y = 16;
	title1.position.x = -4.3;
	title1.rotation.x = Math.PI / 2;
	scene.add(title1);

	geometry = new THREE.TextGeometry("ng", {font: font, size: 3, height: 0.8, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'red'});
	title2 = new THREE.Mesh(geometry, material);
	title2.position.z = 8.3;
	title2.position.y = 16;
	title2.position.x = 0.9;
	title2.rotation.x = Math.PI / 2;
	scene.add(title2);

	geometry = new THREE.TextGeometry("Controls", {font: font, size: 1, height: 0.5, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	control = new THREE.Mesh(geometry, material);
	control.position.z = -1;
	control.position.y = -11;
	control.position.x = -3;
	control.rotation.x = Math.PI / 3;
	scene.add(control);

	geometry = new THREE.TextGeometry("ENTER = Start", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	startC = new THREE.Mesh(geometry, material);
	startC.position.z = -4.3;
	startC.position.y = -11;
	startC.position.x = -10.5;
	startC.rotation.x = Math.PI / 4;
	scene.add(startC);

	geometry = new THREE.TextGeometry("ESC = Pause", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	pauseC = new THREE.Mesh(geometry, material);
	pauseC.position.z = -4.3;
	pauseC.position.y = -11;
	pauseC.position.x = -3.6;
	pauseC.rotation.x = Math.PI / 4;
	scene.add(pauseC);

	geometry = new THREE.TextGeometry("A/D = Movement", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	movementC = new THREE.Mesh(geometry, material);
	movementC.position.z = -3;
	movementC.position.y = -11;
	movementC.position.x = -10;
	movementC.rotation.x = Math.PI / 4;
	scene.add(movementC);

	geometry = new THREE.TextGeometry("R = Reset", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	replayC = new THREE.Mesh(geometry, material);
	replayC.position.z = -3;
	replayC.position.y = -11;
	replayC.position.x = 3.8;
	replayC.rotation.x = Math.PI / 4;
	scene.add(replayC);

	geometry = new THREE.TextGeometry("1/2/3 = Dificulty", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	difficultyC = new THREE.Mesh(geometry, material);
	difficultyC.position.z = -4.3;
	difficultyC.position.y = -11;
	difficultyC.position.x = 3.9;
	difficultyC.rotation.x = Math.PI / 4;
	scene.add(difficultyC);

	geometry = new THREE.TextGeometry("T = Toggle Controls", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	toggleC = new THREE.Mesh(geometry, material);
	toggleC.position.z = -3;
	toggleC.position.y = -11;
	toggleC.position.x = -3.5;
	toggleC.rotation.x = Math.PI / 4;
	scene.add(toggleC);

	geometry = new THREE.TextGeometry("Difficulty", {font: font, size: 0.8, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	diffControl = new THREE.Mesh(geometry, material);
	diffControl.position.z = 10;
	diffControl.position.y = 11;
	diffControl.position.x = 11.5;
	diffControl.rotation.x = Math.PI / 2;
	scene.add(diffControl);

	geometry = new THREE.TextGeometry("Easy", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	easy = new THREE.Mesh(geometry, material);
	easy.position.z = 9;
	easy.position.y = 11;
	easy.position.x = 12.5;
	easy.rotation.x = Math.PI / 2;
	scene.add(easy);

	geometry = new THREE.TextGeometry("Medium", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	medium = new THREE.Mesh(geometry, material);
	medium.position.z = 8;
	medium.position.y = 11;
	medium.position.x = 12.6;
	medium.rotation.x = Math.PI / 2;
	scene.add(medium);
	
	geometry = new THREE.TextGeometry("Hard", {font: font, size: 0.5, height: 0.3, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	material = new THREE.MeshStandardMaterial({color: 'white'});
	hard = new THREE.Mesh(geometry, material);
	hard.position.z = 7;
	hard.position.y = 11;
	hard.position.x = 12.7;
	hard.rotation.x = Math.PI / 2;
	scene.add(hard);

	geometry = new THREE.SphereGeometry(0.3);
	material = new THREE.MeshStandardMaterial({color: 'green'});
	easyMark = new THREE.Mesh(geometry, material);
	easyMark.position.z = 9.2;
	easyMark.position.y = 11;
	easyMark.position.x = 12;

	geometry = new THREE.SphereGeometry(0.3);
	material = new THREE.MeshStandardMaterial({color: 'blue'});
	mediumMark = new THREE.Mesh(geometry, material);
	mediumMark.position.z = 8.2;
	mediumMark.position.y = 11;
	mediumMark.position.x = 12.05;
	scene.add(mediumMark);

	geometry = new THREE.SphereGeometry(0.3);
	material = new THREE.MeshStandardMaterial({color: 'red'});
	hardMark = new THREE.Mesh(geometry, material);
	hardMark.position.z = 7.2;
	hardMark.position.y = 11;
	hardMark.position.x = 12.15;
}

// Toggles the controls on screen
var toggle = false;
function toggleControls()
{

	control, pauseC, replayC, difficultyC, movementC
	if (toggle == false && delay == false)
	{
		scene.remove(control);
		scene.remove(pauseC);
		scene.remove(replayC);
		scene.remove(difficultyC);
		scene.remove(movementC);
		scene.remove(toggleC);
		scene.remove(startC);
		
		toggle = true;
	}
	else if (toggle == true && delay == false)
	{
		scene.add(control);
		scene.add(pauseC);
		scene.add(replayC);
		scene.add(difficultyC);
		scene.add(movementC);
		scene.add(toggleC);
		scene.add(startC);

		toggle = false;
	}
}

// Changes the difficutly based on input
var diffCount
function toggleDifficulty()
{
	switch(diffCount)
	{
		case 0:
			difficulty = 0.55;
			scene.remove(hardMark);
			scene.remove(mediumMark);
			scene.add(easyMark);
			break;
		case 1:
			difficulty = 0.3;
			scene.remove(hardMark);
			scene.remove(easyMark);
			scene.add(mediumMark);
			break;
		case 2:
			difficulty = 0.23;
			scene.remove(mediumMark);
			scene.remove(easyMark);
			scene.add(hardMark);
			break;

	}

	// Resets board
	score1 = score2 = 0;
	start = false;
	ball.position.x = ball.position.y = paddle1.position.x = 0;
	paddle2.position.x = 0;
	speed = 0.25;
	xDir = (Math.random() - 0.5) * 0.18;
	yDir = Math.random() < 0.5 ? (speed - Math.abs(xDir)) : -(speed - Math.abs(xDir));
	pause = true;
	updateScore();
}

// Loads all sounds
var point1, point2, one, two, three, four, five, audio, win, loose;
function loadSounds()
{
	point1 = new Audio("sounds/Explosion2.mp3");
	point2 = new Audio("sounds/point.WAV");
	one = new Audio("sounds/1.mp3");
	two = new Audio("sounds/2.mp3");
	three = new Audio("sounds/3.mp3");
	four = new Audio("sounds/4.mp3");
	five = new Audio("sounds/5.mp3");
	win = new Audio("sounds/win.mp3");
	loose = new Audio("sounds/loose.mp3");

	audio = document.createElement('audio');
	audio.src = 'sounds/song.mp3'
	audio.play();
	audio.loop = true;
	audio.volume = 0.35;
}

// Updates the score if it changes
var score1 = 0;
var score2 = 0;
var scoreObject1 = null;
var scoreObject2 = null;
function updateScore()
{
	if (scoreObject1 != null)
		scene.remove(scoreObject1);
	if (scoreObject2 != null)
		scene.remove(scoreObject2);

	var geometry = new THREE.TextGeometry(score1, {font: font, size: 2, height: 0.5, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	var material = new THREE.MeshStandardMaterial({color: 'blue'});
	scoreObject1 = new THREE.Mesh(geometry, material);
	scoreObject1.position.z = 4.3;
	scoreObject1.position.x = 3.5;
	scoreObject1.position.y = 9;
	scoreObject1.rotation.x = Math.PI / 2;

	if (score1 > 9)
		scoreObject1.position.x -=1.5;

	var geometry2 = new THREE.TextGeometry(score2, {font: font, size: 2, height: 0.5, material: 0, bevelThickness: 1, extrudeMaterial: 1});
	var material2 = new THREE.MeshStandardMaterial({color: 'red'});
	scoreObject2 = new THREE.Mesh(geometry2, material2);
	scoreObject2.position.z = 4.3;
	scoreObject2.position.x = -4.5;
	scoreObject2.position.y = 9;
	scoreObject2.rotation.x = Math.PI / 2;

	if (score2 > 9)
		scoreObject2.position.x -= 1.5;

	scene.add(scoreObject1);
	scene.add(scoreObject2);

	// AI wins
	if (score1 == 11)
	{
		if (pause != true)
			loose.play();

		pause = true;
		audio.pause();

	}

	// Player wins
	if (score2 == 11)
	{
		if (pause != true)
			win.play();

		pause = true;
		audio.pause();

		var delayMillis = 8000;

		setTimeout(function() {
		 		win.pause();
		}, delayMillis);

	}
}

// Maintains ball speed and direction, AI Paddle, movement, and collisions
var speed = 0.25;
var xDir = (Math.random() - 0.5) * 0.3;
var yDir = Math.random() < 0.5 ? (speed - Math.abs(xDir)) : -(speed - Math.abs(xDir));
var difficulty = 0.3;
function moveBallAndMaintainPaddles()
{
	ball.position.x += xDir;
	ball.position.y += yDir;

	// Movement
	if(Key.isDown(Key.A))
	{
		if (paddle2.position.x - 2 > -7.5)
		{
			paddle2.position.x -= 0.2;
		}
	}
	else if(Key.isDown(Key.D))
	{
		if (paddle2.position.x + 2 < 7.5)
		{
			paddle2.position.x += 0.2;
		}
	}

	// Wall colisions
	if (ball.position.x < -6)
	{
		three.play();
		xDir = -xDir;
		ball.position.x = -5.9;
	}
	else if (ball.position.x > 6)
	{
		four.play();
		xDir = -xDir;
		ball.position.x = 5.9;
	}

	// Collision resolution on walls
	if (paddle1.position.x + 2 >= 7.5 )
		paddle1.position.x = 5.4;
	else if (paddle1.position.x - 2 <= -7.5)
		paddle1.position.x = -5.4;

	// Resets ball after it has been scored
	if (ball.position.y < -9 || ball.position.y > 9)
	{
		if (ball.position.y < -9)
		{
			score1++;

			if (score1 != 11 && score2 != 11)
				point1.play();
		}
		else
		{
			score2++;

			if (score1 != 11 && score2 != 11)
				point2.play();
		}

		start = false;
		ball.position.x = ball.position.y = paddle1.position.x = 0;
		paddle2.position.x = 0;
		speed = 0.25;
		xDir = (Math.random() - 0.5) * 0.18;
		yDir = Math.random() < 0.5 ? (speed - Math.abs(xDir)) : -(speed - Math.abs(xDir));
		updateScore();
	}

	// Maintains player paddle collision
	if (ball.position.y < -8.4 && yDir < 0)
	{		
		var diff = ball.position.x - paddle2.position.x;

		if(Math.abs(diff) <= 1.4)
		{
			if (diff < 0)
				xDir = Math.max((diff / 5.5), (-speed / 2));
			else
				xDir = Math.min((diff / 5.5), (speed / 2));


			if (xDir < 0)
				yDir = (speed) + xDir;
			else
				yDir = (speed) - xDir;


			if (Math.abs(speed) < 0.4)
				speed += 0.02;

			one.play();
		}
	}
	// Maintains AI paddle collision
	else if (ball.position.y > 8.5 && yDir > 0)
	{
		var diff = ball.position.x - paddle1.position.x;

		if(Math.abs(diff) <= 1.4)
		{
			if (diff < 0)
				xDir = Math.max((diff / 5.5), (-speed / 2));
			else
				xDir = Math.min((diff / 5.5), (speed / 2));

			if (xDir < 0)
				yDir = -(speed) - xDir;
			else
				yDir = -(speed) + xDir;

			if (Math.abs(speed) < 0.4)
				speed += 0.02;

			two.play();
		}
	}

	// AI movement
	if (Math.random() < difficulty)
		paddle1.position.x += xDir * 0.55;
	else if(Math.random() < difficulty + 0.2)
		paddle1.position.x += xDir * 0.85;
	else if(Math.random() < difficulty + 0.4)
		paddle1.position.x += xDir * 0.9;
	else
		paddle1.position.x += xDir;
}

window.onload = init;