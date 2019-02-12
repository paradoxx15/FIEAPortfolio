	var renderer;
	var scene;
	var camera;
	var board;
	var light;
	var table = null;
	var tableLoaded = false;

	var die = [];
	var clickableDie = [];
	var stopRoll = false;
	var rolled = [0, 0, 0, 0, 0, 0];
	var scored = [0, 0, 0, 0, 0, 0];
	var scoredDie = [];
	var scoreObj;
	var phase = 0;
	var turn = 1;
	var tempScore = 0;
	var score1 = 0;
	var score2 = 0;
	var farkle = false;
	var loader = new THREE.FontLoader();
	var scoreObject = [];
	var color = "blue";
	var rollable = true;
	var bankable = false;
	var player1Win;
	var player2Win;
	var win = false;

	var mouse = new THREE.Vector2();
	var raycaster = new THREE.Raycaster();
	var projector = new THREE.Projector();

	// Sounds
	var bankSound;
	var rollSound;



	Physijs.scripts.worker = 'libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
	
	function init()
	{
		scene = new Physijs.Scene();
		scene.setGravity(new THREE.Vector3( 0, 0, -15 ));

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

		setupRenderer();
		setupCamera();
		loadTable();
		createLight();
		createDice();
		setupButtons();
		createText();
		updateText();
		loadSounds();

		renderer.domElement.addEventListener('mousedown', onDocumentMouseClick, false);

		
		// Output to the stream
		var container = document.getElementById("MainView");
		container.appendChild( renderer.domElement );

		
		// Call render
		render();
	}

	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer();
		//						color     alpha
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
	}
	
	function setupCamera()
	{
		camera.position.x = 0;
		camera.position.y = -7.5;
		camera.position.z = 19;

		camera.lookAt( scene.position );
		camera.rotation.x = (Math.PI / 6.5);
	}

	function setupButtons()
	{
		var rollButton = document.getElementById("RollButton");
		var collectButton = document.getElementById("CollectButton");

		rollButton.onclick = roll;
		collectButton.onclick = bank;
	}
	
	function render()
	{

		scene.simulate();

		// Request animation frame
		requestAnimationFrame( render );
		
		// Call render()
		renderer.render( scene, camera );

	}

	function createDice()
	{
		
		for (var i = 0; i < 6; i++)
		{
			var dice = 	{
							mesh: null,
							scored: false,
							rollable: true,
							value: 0
						}
			var loader = new THREE.TextureLoader();

			var geometry = new THREE.CubeGeometry(0.38, 0.38, 0.38);
			var materials = [
				new Physijs.createMaterial(new THREE.MeshLambertMaterial({
					map: loader.load('textures/dice_face1.png')
				})),
				new Physijs.createMaterial(new THREE.MeshLambertMaterial({
					map: loader.load('textures/dice_face2.png')
				})),
				new Physijs.createMaterial(new THREE.MeshLambertMaterial({
					map: loader.load('textures/dice_face3.png')
				})),
				new Physijs.createMaterial(new THREE.MeshLambertMaterial({
					map: loader.load('textures/dice_face4.png')
				})),
				new Physijs.createMaterial(new THREE.MeshLambertMaterial({
					map: loader.load('textures/dice_face5.png')
				})),
				new Physijs.createMaterial(new THREE.MeshLambertMaterial({
					map: loader.load('textures/dice_face6.png')
				})),
			];
			dice.mesh = new Physijs.BoxMesh(geometry, materials);
			dice.mesh.name = "dice";
			die.push(dice);
		}
	}

	function score()
	{
		var temp = 0;
		var num = 0;

		for (var i = 0; i < scored.length; i++)
		{
			if (scored[i] > 0)
				num++;

			if (i == 0 && scored[i] < 3)
				temp += 100 * scored[i];

			if (i == 4 && scored[i] < 3)
				temp += 50 * scored[i];

			if (scored[i] == 3)
			{
				if (i == 0)
				{
					temp += 1000;
				}
				else
				{
					temp += (i + 1) * 100;
				}
			}

			if (scored[i] == 4)
				temp += 1000;

			if (scored[i] == 5)
				temp += 2000;

			if (scored[i] == 6)
				temp += 3000;
		}

		if (scoreObj.pairs != null)
		{
			if (scoreObj.pairs.length == 3)
			{
				temp = 1500;
			}
		}

		if (scoreObj.triplets != null)
		{
			if (scoreObj.triplets.length == 2)
			{
				temp = 2500;
			}
		}

		if (num == 6)
			temp = 1500;

		tempScore += temp;
		scored = [0, 0, 0, 0, 0, 0];
	}

	function ScoreObj()
    {
    	straight = false;
    	three = 0;
		four = 0;
		five = 0;
		six = 0;
		pairs = null;
		triplets = null;
    }


    var scoreSlot = [0, 0, 0, 0, 0, 0];
	function onDocumentMouseClick(event)
	{
		event.preventDefault();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		var vector = new THREE.Vector3(mouse.x, mouse.y, 1);

		vector.unproject(camera);

		raycaster.set(camera.position, vector.sub(camera.position).normalize());

		var intersects = raycaster.intersectObjects(clickableDie);


		for (var i = 0; i < intersects.length; i++)
		{
			var value;
			var obj = intersects[i].object
			vector = new THREE.Vector3(0, 0, 100);

			raycaster.set(vector, obj.position.sub(vector).normalize());
			var faceIntersect = raycaster.intersectObject(obj);

			//console.log(intersects[i].faceIndex);
			//var faceIndex = intersects[i].faceIndex;


			for (var i = 0; i < die.length; i++)
			{
				if (die[i].scored == false)
				{
					if (die[i].mesh === obj)
					{
						rollable = true;
						scored[die[i].value - 1]++;
						scoredDie.push(die[i]);

						die[i].mesh.setLinearFactor(new THREE.Vector3(0,0,0));
						die[i].mesh.setAngularFactor(new THREE.Vector3(0,0,0));
						
						die[i].mesh.__dirtyPosition = true;
						die[i].mesh.position.z = 7.3;

						scoreSlot[phase - 1]++;
						switch(phase)
						{
							case 1:
								die[i].mesh.position.x = -4.5 + (((scoreSlot[phase - 1] - 1) % 6 / 1.5));
								die[i].mesh.position.y = -3.84;
								break;
							case 2:
								die[i].mesh.position.x = -4.5 + (((scoreSlot[phase - 1] - 1) % 6 / 1.5));
								die[i].mesh.position.y = -4.5;
								break;
							case 3:
								die[i].mesh.position.x = -1 + (((scoreSlot[phase - 1]  - 1) % 6 / 1.5));
								die[i].mesh.position.y = -3.84;
								break;
							case 4:
								die[i].mesh.position.x = -1 + (((scoreSlot[phase - 1]  - 1) % 6 / 1.5));
								die[i].mesh.position.y = -4.5;
								break;
							case 5:
								die[i].mesh.position.x = 2.34 + (((scoreSlot[phase - 1] - 1) % 6 / 1.5));
								die[i].mesh.position.y = -3.84;
								break;
							case 6:
								die[i].mesh.position.x = 2.34 + (((scoreSlot[phase - 1]  - 1) % 6 / 1.5));
								die[i].mesh.position.y = -4.5;
								break;
						}

						die[i].scored = true;
					}
				}
			}
		}
	}
	
	function roll()
	{
		
		if (rollable == true)
		{	
			bankable = true;
			rolled = [0, 0, 0, 0, 0, 0];
			clickableDie = [];
			phase++;

			if (phase != 1 && farkle == false)
			{
				score();
				updateText();
			}

			if (scoredDie.length == 6)
			{
				for (var i = 0; i < scoredDie.length; i++)
					scoredDie[i].scored = false;
				scoredDie = [];

			}

			if (farkle == false)
			{
				for (var i = 0; i < 6; i++)
				{
					if (die[i].scored == false)
					{
						die[i].mesh.position.y = -8;
						die[i].mesh.rotation.x = Math.random() * Math.PI * 2;
						die[i].mesh.rotation.y = Math.random() * Math.PI * 2;

						switch(i)
						{
							case 0:
								die[i].mesh.position.z = 15;
								die[i].mesh.position.x = -1;
								break;
							case 1:
								die[i].mesh.position.z = 15;
								die[i].mesh.position.x = 0;
								break;
							case 2:
								die[i].mesh.position.z = 15;
								die[i].mesh.position.x = 1;
								break;
							case 3:
								die[i].mesh.position.z = 17;
								die[i].mesh.position.x = -1;
								break;
							case 4:
								die[i].mesh.position.z = 17;
								die[i].mesh.position.x = 0;
								break;
							case 5:
								die[i].mesh.position.z = 17;
								die[i].mesh.position.x = 1;
								break;
						}

						scene.add(die[i].mesh);

						die[i].mesh.setLinearVelocity(new THREE.Vector3(0, 6, 0));
						die[i].mesh.setAngularVelocity(new THREE.Vector3(1, 2, 0));
						die[i].value = 0;
					}
				}
				setTimeout(checkValues, 500);
				setTimeout(playRollSound, 1000);
				rollable = false;
			}
		}
		
	}

	function playRollSound()
	{
		rollSound.play();
	}

	function checkValues()
	{
		var zeroV = new THREE.Vector3(0, 0, 0);
		for (var i = 0; i < die.length; i++)
		{
			if (die[i].scored == false)
			{
				if (die[i].mesh.getLinearVelocity().equals(zeroV))
				{
					stopRoll = true;
				}
				else
				{
					stopRoll = false;
				}
			}
		}

		if (stopRoll == false)
		{
			setTimeout(checkValues, 100);
		}
		else
		{
			for (var i = 0; i < die.length; i++)
			{
				if (die[i].scored == false)
				{
					var vector = new THREE.Vector3(0, 0, 100);

					vector.unproject(camera);

					raycaster.set(vector, die[i].mesh.position.sub(vector).normalize());
					var faceIntersect = raycaster.intersectObject(die[i].mesh);

					//console.log(intersects[i].faceIndex);
					//var faceIndex = intersects[i].faceIndex;
					var faceIndex
					if (faceIntersect.length > 0)
						faceIndex = faceIntersect[0].faceIndex;

					// dice face 1
					if (faceIndex == 0 || faceIndex == 1)
					{
						rolled[0] += 1;
						die[i].value = 1;
					}

					// dice face 2
					if (faceIndex == 2 || faceIndex == 3)
					{
						rolled[1] += 1;
						die[i].value = 2;
					}

					// dice face 3
					if (faceIndex == 4 || faceIndex == 5)
					{
						rolled[2] += 1;
						die[i].value = 3;
					}

					// dice face 4
					if (faceIndex == 6 || faceIndex == 7)
					{
						rolled[3] += 1;
						die[i].value = 4;
					}

					// dice face 5
					if (faceIndex == 8 || faceIndex == 9)
					{
						rolled[4] += 1;
						die[i].value = 5;
					}

					// dice face 6
					if (faceIndex == 10 || faceIndex == 11)
					{
						rolled[5] += 1;
						die[i].value = 6;
					}
				}
				
			}
			setScoring();
		}
	}

	function setScoring()
	{
		scoreObj = new ScoreObj();

		// Sets the available types of scoring
		var num = 0;
		var pairs = []
		var triplets = []
		for (var i = 0; i < rolled.length; i++)
		{
			if (rolled[i] > 0)
				num++;

			if (rolled[i] == 2)
				pairs.push(i + 1);

			if (rolled[i] == 3)
			{
				scoreObj.three = i + 1;
				triplets.push(i + 1);
			}

			if (rolled[i] == 4)
				scoreObj.four = i + 1;

			if (rolled[i] == 5)
				scoreObj.five = i + 1;

			if (rolled[i] == 6)
				scoreObj.six = i + 1;
		}

		if (pairs.length == 3)
			scoreObj.pairs = pairs;

		if (triplets.length == 2)
			scoreObj.triplets = triplets;

		if (num == 6)
			scoreObj.straight = true;

		setClickable();
	}

	function setClickable()
	{
		clickableDie = [];
		for (var i = 0; i < die.length; i++)
		{
			if (die[i].scored == false)
			{
				if (die[i].value == 1 || die[i].value == 5)
				{
					clickableDie.push(die[i].mesh);
					continue;
				}

				if (scoreObj.straight == true)
				{
					clickableDie.push(die[i].mesh);
					continue;
				}

				if (scoreObj.three == die[i].value)
				{
					clickableDie.push(die[i].mesh);					
					continue;
				}

				if (scoreObj.four == die[i].value)
				{
					clickableDie.push(die[i].mesh);
					continue;
				}

				if (scoreObj.five == die[i].value)
				{
					clickableDie.push(die[i].mesh);
					continue;
				}

				if (scoreObj.six == die[i].value)
				{
					clickableDie.push(die[i].mesh);
					continue;
				}

				if (scoreObj.pairs != null)
				{
					if (scoreObj.pairs[0] == die[i].value || scoreObj.pairs[1] == die[i].value 
						|| scoreObj.pairs[2] == die[i].value)
					{
						clickableDie.push(die[i].mesh);
						continue;
					}
				}
				
				if (scoreObj.triplets != null)
				{
					if (scoreObj.triplets[0] == die[i].value || scoreObj.triplets[0] == die[i].value)
					{
						clickableDie.push(die[i].mesh);
						continue;
					}
				}
				
			}
		}

		if (clickableDie.length == 0)
		{
			farkle = true;
			tempScore = "Farkle";
			updateText();
		}
	}

	var playerTurn = 1;
	function bank()
	{
		if (bankable == true)
		{
			rolled = [0, 0, 0, 0, 0, 0];
			scoreSlot = [0, 0, 0, 0, 0, 0];
			clickableDie = [];
			phase = 0;
			farkle = false;
			rollable = true;
			bankSound.play();

			for (var i = 0; i < scoredDie.length; i++)
				scoredDie[i].scored = false;
			scoredDie = [];


			if (tempScore == "Farkle")
				tempScore = 0;

			score();

			

			for (var i = 0; i < die.length; i++)
			{
				scene.remove(die[i].mesh);
			}

			if (playerTurn == 1)
			{
				score1 += tempScore;
				playerTurn = 2;
				color = "red";

				if (score1 >= 10000 || score2 >= 10000)
				{
					if (win == false)
					{
						win = true;
					}
					if (win == true && score1 < score2)
					{
						rollable = false;
						scene.add(player2Win);
					}
				}
			}
			else if (playerTurn == 2)
			{
				score2 += tempScore;
				playerTurn = 1;
				turn++;
				color = "blue";

				if (score2 >= 10000 || score1 >= 10000)
				{
					if (win == false)
					{
						win = true;
					}
					if (win == true && score2 < score1)
					{
						rollable = false;
						scene.add(player1Win);
					}
				}
			}
			updateText();
			tempScore = 0;
			bankable = false;
		}
		
		
	}


	
	function loadTable()
	{
		// instantiate a loader
		var mtlLoader = new THREE.MTLLoader();
		setTimeout(waitForTableToLoad, 500);
		
		// load an obj / mtl resource pair
		mtlLoader.load( 'models/table.mtl', function (materials)
		{
			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.load('models/table.obj', function(object)
			{
				// Added to fix raycasting
				object.castShadow = true;
				object.receiveShadow = true;
				object.scale.set( 15, 15, 15 );
				
				var obj = new THREE.Object3D();
				obj.name = 'Table';
				object.parent = obj;
				obj.add( object );
				table = obj;

				obj.rotation.x = (Math.PI/2);
			});
		});		
	}

	function waitForTableToLoad()
	{
		var allloaded = true;
		if( table == null )
		{
			allloaded = false;
		}
		
		if( !allloaded )
		{
			setTimeout(waitForTableToLoad, 500);
		}
		else
		{
			tableLoaded = true;
			placeTable();
		}
	}

	function placeTable()
	{
		

		var geometry = new THREE.CubeGeometry(10, 10, 0.1);
		var material = new Physijs.createMaterial(new THREE.MeshLambertMaterial({visible: false}), .45, 2);
		var plane = new Physijs.BoxMesh(geometry, material, 0);
		plane.name = "plane";
		plane.position.z = 7.1;
		scene.add(plane);

		for (var i = 0; i < 4; i++)
		{
			var geometry
			switch(i % 2)
			{
				case 0:
					geometry = new THREE.CubeGeometry(6, 1, 3);
					break;
				case 1:
					geometry = new THREE.CubeGeometry(1, 6, 3);
					break;
			}
			var material = new Physijs.createMaterial(new THREE.MeshLambertMaterial({visible: false}), .45, 6);
			var wall = new Physijs.BoxMesh(geometry, material, 0);
			wall.name = "wall";

			switch(i)
			{
				case 0:
					wall.position.y = -3.65;
					break;
				case 1:
					wall.position.x = -3.65;
					break;
				case 2:
					wall.position.y = 3.65;
					break;
				case 3:
					wall.position.x = 3.65;
					break;				
			}
			wall.position.z = 7.1;
			scene.add(wall);

		}
		 
		scene.add(table);
	}

	// creates text you can update
	var playerScoreObj = [];
	function updateText()
	{	
		if (scoreObject != null)
		{
			for (var i = 0; i < scoreObject.length; i++)
			{
				scene.remove(scoreObject[i]);
			}	
		}

		if (playerScoreObj != null)
		{
			for (var i = 0; i < playerScoreObj.length; i++)
			{
				scene.remove(playerScoreObj[i]);
			}	
		}
		

		loader.load("fonts/helvetiker_regular.typeface.json", function(font)
		{
			var textGeometry = new THREE.TextGeometry("Turn " + turn, {
				font: font,
				size: 0.4,
				height: .06,
			});

			var textMaterial = new THREE.MeshStandardMaterial({color: color});
			var text = new THREE.Mesh(textGeometry, textMaterial);
			text.position.y = 0;
			text.position.x = -4.73;
			text.position.z = 7.2;
			scene.add(text);
			scoreObject.push(text);

			textGeometry = new THREE.TextGeometry(tempScore, {
				font: font,
				size: 0.4,
				height: .06,
			});

			textMaterial = new THREE.MeshStandardMaterial({color: color});
			text = new THREE.Mesh(textGeometry, textMaterial);
			text.position.y = -.8;
			text.position.x = -4.15;
			text.position.z = 7.2;

			textGeometry = new THREE.TextGeometry(score1, {
				font: font,
				size: 0.4,
				height: .06,
			});

			textMaterial = new THREE.MeshStandardMaterial({color: "blue"});
			var text2 = new THREE.Mesh(textGeometry, textMaterial);
			text2.position.y = 3.3;
			text2.position.x = -2;
			text2.position.z = 7.2;

			textGeometry = new THREE.TextGeometry(score2, {
				font: font,
				size: 0.4,
				height: .06,
			});

			textMaterial = new THREE.MeshStandardMaterial({color: "red"});
			var text3 = new THREE.Mesh(textGeometry, textMaterial);
			text3.position.y = 3.3;
			text3.position.x = 1.4;
			text3.position.z = 7.2;

			adjustText(text, tempScore);
			adjustText(text2, score1);
			adjustText(text3, score2);

			scene.add(text);
			scoreObject.push(text);
			scene.add(text2);
			playerScoreObj.push(text2);
			scene.add(text3);
			playerScoreObj.push(text3);
		});
	}


	function adjustText(text, score)
	{
		if (score >= 10000)
			text.position.x -= 0.19 * 4;
		else if (score >= 1000)
			text.position.x -= 0.19 * 3;
		else if (score >= 100)
			text.position.x -= 0.19 * 2;
		else if (score >= 10)
			text.position.x -= 0.19;
		else if (score >= 0)
			;
		else
			text.position.x -= 0.5;
	}

	// creates stationary text
	function createText()
	{
		loader.load("fonts/helvetiker_regular.typeface.json", function(font)
		{
			var textGeometry = new THREE.TextGeometry("Player 1", {
				font: font,
				size: 0.4,
				height: .06,
			});

			var textMaterial = new THREE.MeshStandardMaterial({color: "blue"});
			var text = new THREE.Mesh(textGeometry, textMaterial);
			text.position.y = 4;
			text.position.x = -2.7;
			text.position.z = 7.2;
			scene.add(text);

			textGeometry = new THREE.TextGeometry("Player 2", {
				font: font,
				size: 0.4,
				height: .06,
			});

			textMaterial = new THREE.MeshStandardMaterial({color: "red"});
			text = new THREE.Mesh(textGeometry, textMaterial);
			text.position.y = 4;
			text.position.x = 0.7;
			text.position.z = 7.2;
			scene.add(text);

			textGeometry = new THREE.TextGeometry("Player 1 Wins", {
				font: font,
				size: 1,
				height: .2,
				visible: false
			});

			textMaterial = new THREE.MeshStandardMaterial({color: "blue"});
			text = new THREE.Mesh(textGeometry, textMaterial);
			text.position.y = 0;
			text.position.x = -4;
			text.position.z = 7.8;
			player1Win = text;

			textGeometry = new THREE.TextGeometry("Player 2 Wins", {
				font: font,
				size: 1,
				height: .2,
				visible: false
			});

			textMaterial = new THREE.MeshStandardMaterial({color: "red"});
			text = new THREE.Mesh(textGeometry, textMaterial);
			text.position.y = 0;
			text.position.x = -4;
			text.position.z = 7.8;
			player2Win = text;
		});
	}


	function createLight()
	{
		light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
		light.position.y = 1;
		light.position.x = 1;
		//light.position.z = 10;
  		scene.add(light);

	}

	function loadSounds()
	{

		rollSound = new Audio("sounds/dice.wav");
		bankSound = new Audio("sounds/bank.wav");
	}
	
	window.onload = init;
