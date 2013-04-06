/* Types:
 0 - Grass
 1 - City
 2 - Road 
 3 - City with shield
 4 - Cloister
 5 - Nothing / Crossroad */
var TileData = function () {
	this.tileCount = 1;
	this.imageName = '';
	this.sides = new Array();
	this.sides[0] = 0; // Top
	this.sides[1] = 0; // Right
	this.sides[2] = 0; // Bottom
	this.sides[3] = 0; // Left
	this.sides[4] = 0; // Center
	//this.haveCloister = false;

	this.connectedSides = new Array();
	this.connectedSides[0] = false; // Top - Right
	this.connectedSides[1] = false; // Right - Bottom
	this.connectedSides[2] = false; // Bottom - Left
	this.connectedSides[3] = false; // Left - Top

	this.connectedSides[4] = false; // Top - Bottom
	this.connectedSides[5] = false; // Left - Right

	this.follower = null;
};

var Tile = function (tileData) {
	this.tileData = tileData;
	//this.element = $('<img src="' + tileData.imageName + '.png" />');
	this.element = $('<div style="overflow: hidden; background: url(' + tileData.imageName + '.png)"></div>');
	this.rotation = 0;
	this.subTiles = new Array(9);

	for(var i = 0; i < 9; i++) {
		var typeClass = 'TileType ';
		this.subTiles[i] = -1;
		switch(i) {
			case 1:
				this.subTiles[i] = this.tileData.sides[3];
				break;
			case 3:
				this.subTiles[i] = this.tileData.sides[2];
				break;
			case 4:
				this.subTiles[i] = this.tileData.sides[4];
				break;
			case 5:
				this.subTiles[i] = this.tileData.sides[0];
				break;
			case 7:
				this.subTiles[i] = this.tileData.sides[1];
				break;
		}
	}

	for(var i = 0; i < 9; i++) {
		var typeClass = 'TileType ';
		switch(i) {
			case 0:
				if(	(this.subTiles[1] == 2 || this.subTiles[1] == 0) && 
						(this.subTiles[3] == 2 || this.subTiles[3] == 0))
				this.subTiles[i] = 0;
				break;
			case 2:
				if(	(this.subTiles[1] == 2 || this.subTiles[1] == 0) && 
						(this.subTiles[5] == 2 || this.subTiles[5] == 0))
				this.subTiles[i] = 0;
				break;
			case 6:
				if(	(this.subTiles[3] == 2 || this.subTiles[3] == 0) && 
						(this.subTiles[7] == 2 || this.subTiles[7] == 0))
				this.subTiles[i] = 0;
				break;
			case 8:
				if(	(this.subTiles[5] == 2 || this.subTiles[5] == 0) && 
						(this.subTiles[7] == 2 || this.subTiles[7] == 0))
				this.subTiles[i] = 0;
				break;
		}

		typeClass += ' ' + getTypeClass(this.subTiles[i]);
		var subTile = $('<div class="' + typeClass + '"></div>');
		this.element.append(subTile);
	}
};

var getTypeClass = function (tileType) {
	switch(tileType) {
		case 0:
			return 'Grass';
		case 1:
		case 3:
			return 'City';
		case 2:
			return 'Road';
			break;
		case 4:
			return 'Cloister';
	}
	return '';
};

Tile.prototype.haveMatchingSides = function (otherTile, relativePosition, rotation) {
	var sideToCompare = 0;
	var otherSideToCompare = 0;

	switch(relativePosition) {
		case 'above':
			sideToCompare = 1;
			otherSideToCompare = 3;
			break;

		case 'below':
			sideToCompare = 3;
			otherSideToCompare = 1;
			break;

		case 'left':
			sideToCompare = 0;
			otherSideToCompare = 2;
			break;

		case 'right':
			sideToCompare = 2;
			otherSideToCompare = 0;
			break;
	}
		
	sideToCompare += rotation;
	if(sideToCompare > 3)
		sideToCompare = sideToCompare - 4;

	otherSideToCompare += otherTile.rotation;
	if(otherSideToCompare > 3)
		otherSideToCompare = otherSideToCompare - 4;

	return this.tileData.sides[sideToCompare] == otherTile.tileData.sides[otherSideToCompare];
};

var createTiles = function () {
	var tiles = new Array();

	/* Types:
	 0 - Grass
	 1 - City
	 2 - Road 
	 3 - City with shield
	 4 - Cloister
	 5 - Nothing / Crossroad */

	// Start tile
	//var connectedSides = new Array();
	tiles = tiles.concat(createTile(4, 'city1rwe', 2, 0, 2, 1, 2));
	tiles = tiles.concat(createTile(3, 'city1rswe', 2, 2, 2, 1, 5));
	tiles = tiles.concat(createTile(3, 'city1rsw', 0, 2, 2, 1, 2));
	tiles = tiles.concat(createTile(3, 'city1rse', 2, 2, 0, 1, 2));
	tiles = tiles.concat(createTile(5, 'city1', 0, 0, 0, 1, 0));

	tiles = tiles.concat(createTile(4, 'cloister', 0, 0, 0, 0, 4));
	tiles = tiles.concat(createTile(2, 'cloisterr', 0, 2, 0, 0, 4));

	tiles = tiles.concat(createTile(3, 'city11we', 1, 0, 1, 0, 0));
	tiles = tiles.concat(createTile(2, 'city11ne', 1, 0, 0, 1, 0));

	tiles = tiles.concat(createTile(9, 'road2sw', 0, 2, 2, 0, 2));

	tiles = tiles.concat(createTile(2, 'city2nwsr', 2, 2, 1, 1, 0));
	tiles = tiles.concat(createTile(3, 'city2nwr', 2, 2, 1, 1, 0));

	tiles = tiles.concat(createTile(2, 'city2nws', 0, 0, 1, 1, 0));
	tiles = tiles.concat(createTile(3, 'city2nw', 0, 0, 1, 1, 0));

	tiles = tiles.concat(createTile(8, 'road2ns', 0, 2, 0, 2, 2));

	tiles = tiles.concat(createTile(2, 'city2wes', 1, 0, 1, 0, 1));
	tiles = tiles.concat(createTile(1, 'city2we', 1, 0, 1, 0, 1));

	tiles = tiles.concat(createTile(4, 'road3', 2, 2, 2, 0, 5));

	tiles = tiles.concat(createTile(2, 'city3sr', 1, 2, 1, 1, 1));
	tiles = tiles.concat(createTile(1, 'city3r', 1, 2, 1, 1, 1));

	tiles = tiles.concat(createTile(1, 'city3s', 1, 0, 1, 1, 1));
	tiles = tiles.concat(createTile(3, 'city3', 1, 0, 1, 1, 1));

	tiles = tiles.concat(createTile(1, 'road4', 2, 2, 2, 2, 5));

	tiles = tiles.concat(createTile(1, 'city4', 1, 1, 1, 1, 1));
	
	return tiles;
};

var createTile = function(tileCount, imageName, typeEast, 
													typeSouth, typeWest, typeNorth,
													typeCenter) {
	var tiles = new Array();
	for(var i = 0; i < tileCount; i++) {
		var tile = new TileData();
		tile.imageName = imageName;
		tile.sides[0] = typeEast;
		tile.sides[1] = typeSouth;
		tile.sides[2] = typeWest;
		tile.sides[3] = typeNorth;
		tile.sides[4] = typeCenter;
		var tileElement = new Tile(tile);
		tiles.push(tileElement);
	}
	
	return tiles;
};
