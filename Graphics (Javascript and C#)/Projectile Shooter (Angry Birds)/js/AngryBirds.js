	var renderer;
	var scene;
	var camera;
	var spotLight;
	var smsh;
	
	<!-- add objects in the scope so all methods can access -->
	var groundPlane;
	var ball;
	var columns;
	var secondFloor;

	<!-- 3. Add the following two lines. -->
	Physijs.scripts.worker = 'libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
	
	function init()
	{
		<!-- 4. Edit the scene creation -->
		scene = new Physijs.Scene();
		scene.setGravity(new THREE.Vector3( 0, 0, -30 ));
		
		setupCamera();
		setupRenderer();
		loadSounds();
		updateScore();
		createControls();
		
		<!-- 5. Ground plane -->
		createGroundPlane();
		
		<!-- 7. Create and add cannon -->
		createCannon();
		
		<!-- 11. Create ball -->
		createBall();
		
		<!-- 14. Create target -->
		createTarget(5, 180, 37, 0);
		createTarget(45, 180, 37, 1);
		createTarget(-40, 180, 37, 2);
		createTarget(5, 180, 7, 3);
		createTarget(45, 180, 7, 4);
		createTarget(-40, 180, 7, 5);
		createTarget(25, 220, 7, 6);
		createTarget(-20, 220, 7, 7);
		//addTargetListener();

	
		// Output to the stream
		document.body.appendChild( renderer.domElement );

		addSpotLight();
		
		// Call render
		render();
	}
	
	function render()
	{
		<!-- 6. Physics simulation -->
		scene.simulate();
		
		<!-- 9. Maintain cannon elevation controls -->
		maintainCannonElevationControls();
		
		<!-- 10. Maintain cannon right/left -->
		maintainCannonRightLeft();

		<!-- 12. Look for ball keypresses -->
		maintainBallKeypresses();
		
		<!-- 15. Check for ball off the plane -->
		checkBallPosition();

		// Request animation frame
		requestAnimationFrame( render );
		
		// Call render()
		renderer.render( scene, camera );
	}
	
	<!-- 5. Ground plane -->
	function createGroundPlane()
	{
		var texture = THREE.ImageUtils.loadTexture('images/futureGround.jpg');
	
		var planeMaterial = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, 0.2 );
		var planeGeometry = new THREE.PlaneGeometry( 150, 400, 6 );
		groundPlane = new Physijs.BoxMesh( planeGeometry, planeMaterial, 0 );
		groundPlane.name = "GroundPlane";
		groundPlane.position.y = 100;


		columns = []
		for (var i = 0; i < 4; i++)
		{
			var columnGeometry = new THREE.BoxGeometry(5, 5, 30);
			var column = new Physijs.BoxMesh(columnGeometry, planeMaterial)
			
			switch(i)
			{
				case 0: column.position.x = -70; column.position.y = 100; break;
				case 1: column.position.x = 70; column.position.y = 100; break;
				case 2: column.position.x = -70; column.position.y = 50; break;
				case 3: column.position.x = 70; column.position.y = 50; break;
			}

			column.position.z = 15;
			columns.push(column);

			groundPlane.add(column);
		}

		var floorGeometry = new THREE.BoxGeometry(145, 100, 3);
		secondFloor = new Physijs.BoxMesh(floorGeometry, planeMaterial);
		secondFloor.position.z = 30;
		secondFloor.position.y = 97;

		groundPlane.add(secondFloor);
		
		
		scene.add( groundPlane );
	}

	
	<!-- 7. Create cannon -->
	function createCannon()
	{
		var wood = THREE.ImageUtils.loadTexture('images/futureBase.jpg');
		var metal = THREE.ImageUtils.loadTexture('images/futureCannon.jpg');

		var cylinderGeometry = new THREE.CylinderGeometry( 2, 2, 10, 20 );
		var cylinderMaterial = new THREE.MeshLambertMaterial({map: metal});
		var can = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
		can.position.y = -5;

		var sphereGeometry = new THREE.SphereGeometry(2, 30);
		var sphereMaterial = new THREE.MeshLambertMaterial({map: metal});
		var back = new THREE.Mesh(sphereGeometry, sphereMaterial);
		back.position.y = -0.01;

		var wheelGeometry = new THREE.CylinderGeometry(3, 3, 0.8, 25, 5);
		var wheelMaterial = new THREE.MeshLambertMaterial({map: metal});
		var wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
		wheel.position.x = -3.1;
		wheel.position.y = -1.6;
		wheel.position.z = -2;
		wheel.rotation.z = Math.PI / 2;

		var wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
		wheel2.position.x = 3.1;
		wheel2.position.y = -1.6;
		wheel2.position.z = -2;
		wheel2.rotation.z = Math.PI / 2;


		var bodyGeometry = new THREE.BoxGeometry(5.5, 2, 9);
		var bodyMaterial = new THREE.MeshLambertMaterial({map: wood});
		var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
		body.rotation.x = Math.PI / 2;
		body.position.y = -3.5;
		body.position.z = -1.5;


		<!-- 8. Create Object3D wrapper that will allow use to correctly rotate -->
		cannon = new THREE.Object3D();
		cannon.add( can );
		cannon.add(back);
		cannon.add(body);
		
		wheels = new THREE.Object3D();
		wheels.add(wheel);
		wheels.add(wheel2);

		wheels.rotation.z = Math.PI;
		wheels.rotation.x = Math.PI / 12 ;
		wheels.position.y -= 84;
		wheels.position.z += 4.6;
		wheels.name = "CannonWheels";
		scene.add( wheels );
		
		cannon.rotation.z = Math.PI;
		cannon.rotation.x = Math.PI / 8;
		cannon.position.y -= 84;
		cannon.position.z += 4.6;
		cannon.name = "CannonBall";
		scene.add( cannon );
	}
	
	<!-- 9. Maintain cannon elevation controls -->
	function maintainCannonElevationControls()
	{
		if( Key.isDown(Key.W))
		{
			cannon.rotation.x -= 0.01;
			if( cannon.rotation.x < 0 )
			{
				cannon.rotation.x = 0;
			}
			else 
			{
				camera.rotation.x -= 0.005;
				camera.position.z += 0.08;
			}
		}

		if( Key.isDown(Key.S))
		{
			cannon.rotation.x += 0.01;
			if( cannon.rotation.x > ( Math.PI / 5 ) )
			{
				cannon.rotation.x = Math.PI / 5;
			}
			else
			{
				camera.rotation.x += 0.005;
				camera.position.z -= 0.08;
			}
		}
	}

	<!-- 10. Maintain cannon right/left -->
	function maintainCannonRightLeft()
	{
		if( Key.isDown(Key.A))
		{	
			cannon.rotation.z += 0.01;
			wheels.rotation.z += 0.01;
			if (cannon.rotation.z > 7 * Math.PI / 6)
			{
				cannon.rotation.z = 7 * Math.PI / 6;
				wheels.rotation.z = 7 * Math.PI / 6;
			}
			else
			{
				camera.rotation.y += 0.005;
				camera.position.x += 0.1;
			}
		}
		if( Key.isDown(Key.D))
		{
			cannon.rotation.z -= 0.01;
			wheels.rotation.z -= 0.01;

			if (cannon.rotation.z < 5 * Math.PI / 6)
			{
				cannon.rotation.z = 5 * Math.PI / 6;
				wheels.rotation.z = 5 * Math.PI / 6;
			}
			else
			{
				camera.rotation.y -= 0.005;
				camera.position.x -= 0.1;
			}
		}
	}
	
	<!-- 12. Look for ball keypresses -->
	var ballLaunched = false;
	function maintainBallKeypresses()
	{
		if( !ballLaunched && Key.isDown(Key.F) )
		{
			createBall();
			ballLaunched = true;
			scene.add( ball );
			ball.applyCentralImpulse( new THREE.Vector3( (Math.PI - cannon.rotation.z) * 17500, 18500, cannon.rotation.x * 19500 ) );
			fire.play();
		}
		if( ballLaunched && Key.isDown(Key.R) )
		{
			ballLaunched = false;
			scene.remove( ball );
			reload.play();
		}
	}
	
	<!-- 11. Create ball -->
	function createBall()
	{
		var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');

		var ballGeometry = new THREE.SphereGeometry( 2, 15 );
		var ballMaterial = Physijs.createMaterial( new THREE.MeshLambertMaterial({map: texture}), .95, 0.8 );
		ball = new Physijs.SphereMesh( ballGeometry, ballMaterial, 140 );
		
		ball.position.x = cannon.position.x + Math.cos((Math.PI/2)-cannon.rotation.z) * 13;
		ball.position.y = cannon.position.y - Math.cos(cannon.rotation.z) * 10;
		ball.position.z = cannon.position.z + Math.sin(cannon.rotation.x) * 10;
		
		ball.name = 'CannonBall';
		
		ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
		{
			if( other_object.name != "GroundPlane" )
			{
				hit.play();
				scoreValue++;
				updateScore();

				var delayMillis = 500;

 				setTimeout(function() {
 		 			scene.remove(ball);
				}, delayMillis);
			
				
			}
		});
	}


	<!-- 14. Create target -->
	var targetlist;
	var scoreFlag = [0, 0, 0, 0, 0, 0, 0, 0];
	function createTarget(x, y, z, i)
	{
		targetlist = [];

		var metal = THREE.ImageUtils.loadTexture('images/metal.jpg');
		
		for( var i=0; i<4; i++ )
		{
			var geo = new THREE.BoxGeometry( 4, 4, 12 );
			var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({map: metal}), .95, .95 );
			var msh = new Physijs.BoxMesh( geo, mat, );
			switch( i )
			{

				case 0: msh.position.y = y; msh.position.x = x - 5; break;
				case 1: msh.position.y = y + 5; msh.position.x = x; break;
				case 2: msh.position.y = y + 10; msh.position.x = x - 5; break;
				case 3: msh.position.y = y + 5; msh.position.x = x - 10; break;
			}
			msh.position.z = z;
			msh.name = "TargetStand";
			msh.setCcdMotionThreshold(1);
			msh.setCcdSweptSphereRadius(0.2);
			scene.add( msh );

			msh.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
			{
				if( other_object.name != "GroundPlane" )
				{
				}
			});
		}
		
		var sg = new THREE.SphereGeometry( 5);
		var sm = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'darkorange'}), .95, .95 );
		smsh = new Physijs.SphereMesh( sg, sm );
		smsh.position.x = x - 5;
		smsh.position.y = y + 5;
		smsh.position.z = z + 10;
		smsh.name = "TargetBall";
		smsh.setCcdMotionThreshold(1);
		smsh.setCcdSweptSphereRadius(0.2);

		smsh.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
		{
			if( other_object.name != "GroundPlane" )
			{
			}
		});
		
		targetlist.push( smsh );
		scene.add( smsh );
	}


	var fire, hit, reload, audio;
	function loadSounds()
	{

		fire = new Audio("sounds/fire.wav");
		hit = new Audio("sounds/hit.wav");
		reload = new Audio("sounds/reload.wav");
		
		audio = document.createElement('audio');
		audio.src = 'sounds/song.mp3'
		audio.play();
		audio.loop = true;
	}
	
	<!-- 15. Check for ball off the plane -->
	function checkBallPosition()
	{

		if (ball.position.z < -5)
			scene.remove(ball);
	}
	
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );

		camera.position.x = 0;
		camera.position.y = -110;
		camera.position.z = 10;

		camera.lookAt( scene.position );

		camera.rotation.x = 1.6;

	}
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer();
		//						color     alpha
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
	}

	function addSpotLight()
	{
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, -100, 300 );
        spotLight.shadowCameraNear = 10;
        spotLight.shadowCameraFar = 100;
        spotLight.castShadow = true;
		spotLight.intensity = 2.8;
        scene.add(spotLight);
	}

	var scoreObject = null;
	var scoreValue = 0;
	function updateScore()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject );
		}
		
		var scoreString = "Destruction Score: " + scoreValue;
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 4,
			height: 0.4,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = -25;
		scoreObject.position.y = 100;
		scoreObject.position.z = 50;
		scoreObject.rotation.x = Math.PI / 3;
		scene.add( scoreObject );
	}

	var controlObject
	function createControls()
	{
		var string = "W/A/S/D - Movement";

		var param = 
		{
			size: 0.5,
			height: 0.4,
			curveSegments: 10,
			bevelEnabled: false
		};

		var geo = new THREE.TextGeometry( string, param );

		var mat = new THREE.MeshLambertMaterial({color:0xFFFFFF});

		controlObject = new THREE.Mesh(geo, mat);
		controlObject.position.z = 2;
		controlObject.position.x = -12.2;
		controlObject.position.y = -80;
		controlObject.rotation.x = Math.PI / 4;

		scene.add(controlObject);

		string = "F - Fire";

		geo = new THREE.TextGeometry( string, param );

		controlObject = new THREE.Mesh(geo, mat);
		controlObject.position.z = 2;
		controlObject.position.x = -8.9;
		controlObject.position.y = -84;
		controlObject.rotation.x = Math.PI / 4;

		scene.add(controlObject);

		string = "R - Reload";

		geo = new THREE.TextGeometry( string, param );

		controlObject = new THREE.Mesh(geo, mat);
		controlObject.position.z = 2;
		controlObject.position.x = -8.9;
		controlObject.position.y = -87;
		controlObject.rotation.x = Math.PI / 4;

		scene.add(controlObject);
	}
	
	window.onload = init;