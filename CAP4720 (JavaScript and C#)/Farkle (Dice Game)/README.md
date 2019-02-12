# Farkle in JavaScript with THREE.js
### by Gaelen Dignan

This was an assignment in CAP4720 to create a 3D board game. I chose Farkle because it is one of my favorite dice games, and I thought it would be fun to render dice and a table.

Major Features:
- Table .obj and .mtl loaded and rendered in the scene.
- Dice made from textures that use face normals to decide what number is currently rolled.
- Scoring algorithm that only makes dice able to be clicked if they actually have value.
- Win/Lose state of a player reaching 10,000 points.