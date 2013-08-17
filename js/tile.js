var TileData = function (imageName) {
	this.imageName = imageName;
	this.objects = new Array();
};

TileData.prototype.addObject = function(tileObject) {
	this.objects.push(tileObject);
};

/* Types:
 1 - City
 2 - Road 
 3 - City with shield
 4 - Cloister
 5 - Nothing / Crossroad */
var TileObject = function(type, coveredSubtiles) {
	this.type = type;
	this.coveredSubtiles = coveredSubtiles;
};


var Tile = function (tileData) {
	var self = this;
	this.tileData = tileData;
	this.element = $('<div style="overflow: hidden; background: url(images/' + 
		tileData.imageName + '.png)"></div>');
	this.rotation = 0;
	this.sides = new Array(4);
	this.subTiles = new Array(9);
	this.follower = null;

	$.each(tileData.objects, function(index, object) {
		$.each(object.coveredSubtiles, function(index, subtileIndex) {
			 self.subTiles[subtileIndex] = object.type;
		});
	});

	for(var i = 0; i < 9; i++) {
		var typeClass = 'TileType ';
		typeClass += ' ' + getTypeClass(this.subTiles[i]);
		var subTile = $('<div class="' + typeClass + '"></div>');
		this.element.append(subTile);
	}

	this.sides[0] = this.subTiles[5];
	this.sides[1] = this.subTiles[7];
	this.sides[2] = this.subTiles[3];
	this.sides[3] = this.subTiles[1];

	for(var i = 0; i < 4; i++) {
		if(this.sides[i] == 3)
			this.sides[i] = 1;
	}
};


var getTypeClass = function (tileType) {
	switch(tileType) {
		case 0:
			return 'Grass';
		case 1:
			return 'City';
		case 3:
			return 'CityShield';
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

	return this.sides[sideToCompare] == otherTile.sides[otherSideToCompare];
	return true;
};

Tile.prototype.placeFollower = function() {
	this.follower = true;

	var follower = $('<img src="images/follower.png" width="30" class="follower" />');
	this.element.append(follower);
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
	tileData = new TileData('city1rwe');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [3, 4, 5]));
	tiles = tiles.concat(createTileFromTileData(4, tileData));

	tileData = new TileData('city1rswe');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [3, 4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city1rsw');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [3, 4, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city1rse');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city1');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tiles = tiles.concat(createTileFromTileData(5, tileData));

	tileData = new TileData('cloister');
	tileData.addObject(new TileObject(4, [4]));
	tiles = tiles.concat(createTileFromTileData(4, tileData));

	tileData = new TileData('cloisterr');
	tileData.addObject(new TileObject(4, [4]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city11we');
	tileData.addObject(new TileObject(1, [0, 3, 6]));
	tileData.addObject(new TileObject(1, [2, 5, 8]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city11ne');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(1, [2, 5, 8]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('road2sw');
	tileData.addObject(new TileObject(2, [3, 4, 7]));
	tiles = tiles.concat(createTileFromTileData(9, tileData));

	tileData = new TileData('city2nwsr');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 6]));
	tileData.addObject(new TileObject(2, [4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city2nwr');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 6]));
	tileData.addObject(new TileObject(2, [4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city2nws');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 6]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city2nw');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 6]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('road2ns');
	tileData.addObject(new TileObject(2, [1, 4, 7]));
	tiles = tiles.concat(createTileFromTileData(8, tileData));

	tileData = new TileData('city2wes');
	tileData.addObject(new TileObject(3, [0, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city2we');
	tileData.addObject(new TileObject(1, [0, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('road3');
	tileData.addObject(new TileObject(2, [3, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(4, tileData));

	tileData = new TileData('city3sr');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 4, 5, 6, 8]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city3r');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 4, 5, 6, 8]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('city3s');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('city3');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('road4');
	tileData.addObject(new TileObject(2, [1, 3, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('city4');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 4, 5, 6, 7, 8]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));
	
	return tiles;
};

var createTileFromTileData = function(tileCount, tileData) {
	var tiles = new Array();
	for(var i = 0; i < tileCount; i++) {
		var tile = new Tile(tileData);
		tiles.push(tile);
	}
	return tiles;
};

