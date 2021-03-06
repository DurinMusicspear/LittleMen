var Board = function () {
	this.width = 3;
	this.height = 3;
	this.positions = new Array(this.height);
	this.legalPositions = new Array();
	this.tilePool = new Array();
	this.nextTile = null;
	this.placeFollower = false;
	this.followers = ko.observableArray([0, 0, 0, 0, 0, 0, 0]);

	// Create board positions
	for(var y = 0; y < this.height; y++) {
		this.positions[y] = new Array(this.width);

		for(var x = 0; x < this.width; x++) {
			var tileContainer = $('<div class="TileContainer"></div>');
			this.positions[y][x] = tileContainer;
			tileContainer.data('tile', null);
			tileContainer.attr('id', (y * 1000 + x));
			$('#board').append(tileContainer);
		}
	}

	// Create tile pool
	this.tilePool = createTiles();
	var startTile = this.getNextTile(0);
	this.placeTile(startTile, Math.floor(this.width / 2.0),
		Math.floor(this.height / 2.0), 0);

	$('#board').css('width', this.width * 90);

	$('#placeFollower').click(function () {
		this.placeFollower = true;
	});

	// $('body').on('mouseenter', '.TileType', function () {
	// 	$(this).css('background', 'black');

	// });

	// $('body').on('mouseleave', '.TileType', function () {
	// 	$(this).css('background', '');
	// });

	ko.applyBindings(this);
}

Board.prototype.getNextTile = function (specificIndex) {
	var tileIndex = specificIndex;
	if(specificIndex === undefined)
		tileIndex = Math.floor(Math.random() * (this.tilePool.length - 1));

	var tile = this.tilePool.splice(tileIndex, 1);
	return tile[0];
};

Board.prototype.placeTile = function(tile, coordX, coordY, rotation) {
	var board = this;

	$.each(this.legalPositions, function(index, position) {
		position.css('background', '');
		position.unbind('click');
		position.html('');
	});

	var position = this.positions[coordY][coordX];	
	position.append(tile.element);
	position.data('tile', tile);
	tile.x = coordX;
	tile.y = coordY;

	tile.element.click(function () {
		// if(this.placeFollower) {
			// 
			board.placeFollowerOnTile(tile);
		// }
	});

	if(rotation != 0) {
		tile.element.css('-webkit-transform', 'rotate(' + -(rotation * 90) + 'deg)');
		//$(tile.element.find('.subtiles')[0]).css('-webkit-transform', 'rotate(' + (rotation * 90) + 'deg)');
		tile.rotation = rotation;
	}

	$.each(tile.subTiles, function(index, subtile) {
		subtile.element.mouseenter(function () {
			var object = tile.findObjectOnSubtile(subtile.position);
			if(object != null) {
				board.expandObject(tile, object);
				board.resetTileExpansion();
			}
		});

		subtile.element.mouseleave(function () {
			// var object = tile.lastHoverObject;
			// if(object != null) {
			// 	$.each(object.coveredSubtiles, function(index, subtileIndex) {
			// 		 tile.subTiles[subtileIndex].element.css('background', '');
			// 	});
			// 	tile.lastHoverObject = null;
			// }
		});	
	});

	if(coordX == this.width - 1)
		this.expand(0);

	if(coordY == this.height - 1)
		this.expand(1);

	if(coordX == 0)
		this.expand(2);

	if(coordY == 0)
		this.expand(3);

	var nextTile = this.getNextTile();
	this.showNextTile(nextTile);
};

Board.prototype.getLegalPlacementsForTile = function(tile) {
	var self = this;
	this.legalPositions = new Array();

	for(var y = 0; y < this.height; y++) {
		for(var x = 0; x < this.width; x++) {
			var tileAtPosition = this.positions[y][x].data('tile');

			if(tileAtPosition != null) // Only check unoccupied positions
				continue;

			var legalRotations = this.getLegalRotaionsForPosition(tile, x, y);
			if(legalRotations.length > 0) {
				this.positions[y][x].css('background', 'rgba(0, 128, 0, 0.3)');
				this.positions[y][x].html(legalRotations.length);
				(function (board, tile, x, y, rotation) {
					board.positions[y][x].click(function () {
						board.placeTile(tile, x, y, rotation);
					});	
				})(this, tile, x, y, legalRotations[0]);
				this.legalPositions.push(this.positions[y][x]);
			}
		}
	}
};

Board.prototype.getLegalRotaionsForPosition = function(tile, coordX, coordY) {
	var legalRotations = new Array();

	for(var rot = 0; rot < 4; rot++) {
		var atLeatOneLegal = false;
		var atLeatOneIllegal = false;

		for(var y = coordY - 1; y <= coordY + 1; y++) {
			for(var x = coordX - 1; x <= coordX + 1; x++) {
				if(x < 0 || y < 0 || x >= this.width || y >= this.height)
					continue;

				if(x == coordX && y == coordY)
					continue;

				if(x != coordX && y != coordY)
					continue;

				var currentTile = this.positions[y][x].data('tile');
				if(currentTile == null)
					continue;

				var position = '';
				if(coordX == x) {
					if(coordY < y) position = 'above';
					if(coordY > y) position = 'below';
				}

				if(coordY == y) {
					if(coordX < x) position = 'left';
					if(coordX > x) position = 'right';
				}

				if(tile.haveMatchingSides(currentTile, position, rot))
					atLeatOneLegal = true;
				else
					atLeatOneIllegal = true;
			}
		}

		if(atLeatOneLegal && !atLeatOneIllegal)
			legalRotations.push(rot);
	}

	return legalRotations;
};

Board.prototype.resetTileExpansion = function() {
	for(var y = 0; y < this.height; y++) {
		for(var x = 0; x < this.width; x++) {
			var tileAtPosition = this.positions[y][x].data('tile');
			if(tileAtPosition != null)
				tileAtPosition.isExpanded = false;
		}
	}
};

Board.prototype.expandObject = function(tile, object) {
	var self = this;
	tile.lastHoverObject = object;

	for (var i = object.coveredSubtiles.length - 1; i >= 0; i--) {
		tile.subTiles[object.coveredSubtiles[i]].element.css('background', 'black');
	};

	if(object.coversSubtile(tile.rotateSubtilePosition(1))) {
		var adjacentTile = this.findAdjacentTile(tile, 'above');
		if(adjacentTile != null && !adjacentTile.isExpanded) {
			adjacentTile.isExpanded = true;
			var adjacentObject = adjacentTile.findObjectOnSubtile(adjacentTile.rotateSubtilePosition(7));
			if(adjacentObject != null && object.type == adjacentObject.type) {
				return self.expandObject(adjacentTile, adjacentObject);
			}
		}
	}

	if(object.coversSubtile(tile.rotateSubtilePosition(7))) {
		var adjacentTile = this.findAdjacentTile(tile, 'below');
		if(adjacentTile != null && !adjacentTile.isExpanded) {
			adjacentTile.isExpanded = true;
			var adjacentObject = adjacentTile.findObjectOnSubtile(adjacentTile.rotateSubtilePosition(1));
			if(adjacentObject != null && object.type == adjacentObject.type) {
				return self.expandObject(adjacentTile, adjacentObject);
			}
		}
	}

	if(object.coversSubtile(tile.rotateSubtilePosition(5))) {
		var adjacentTile = this.findAdjacentTile(tile, 'right');
		if(adjacentTile != null && !adjacentTile.isExpanded) {
			adjacentTile.isExpanded = true;
			var adjacentObject = adjacentTile.findObjectOnSubtile(adjacentTile.rotateSubtilePosition(3));
			if(adjacentObject != null && object.type == adjacentObject.type) {
				return self.expandObject(adjacentTile, adjacentObject);
			}
		}
	}

	if(object.coversSubtile(tile.rotateSubtilePosition(3))) {
		var adjacentTile = this.findAdjacentTile(tile, 'left');
		if(adjacentTile != null && !adjacentTile.isExpanded) {
			adjacentTile.isExpanded = true;
			var adjacentObject = adjacentTile.findObjectOnSubtile(adjacentTile.rotateSubtilePosition(5));
			if(adjacentObject != null && object.type == adjacentObject.type) {
				return self.expandObject(adjacentTile, adjacentObject);
			}
		}
	}
};

Board.prototype.findAdjacentTile = function(tile, direction) {
	var x = tile.x;
	var y = tile.y;

	switch(direction) {
		case 'above':
			y--;
			break;
		case 'below':
			y++;
			break;
		case 'left':
			x--;
			break;
		case 'right':
			x++;
			break;
	}

	if(x > this.width - 1 || y > this.height - 1 || x < 0 || y < 0) {
		return null;
	}

	return this.positions[y][x].data('tile');
};

Board.prototype.showNextTile = function (tile) {
	var hand = $('#hand');
	hand.data('nextTile', tile);
	hand.find('.nextTile').append(tile.element);
	hand.find('.remainingTiles').text(this.tilePool.length + 1);
	this.getLegalPlacementsForTile(tile);
};

Board.prototype.expand = function (direction) {
	switch(direction) {
		case 0: // Right
			this.width += 1;
			var x = this.width - 1;
			for(var y = 0; y < this.height; y++) {
				var tileContainer = $('<div class="TileContainer"></div>');
				tileContainer.data('tile', null);
				tileContainer.attr('id', (y * 1000 + x));
				this.positions[y].push(tileContainer);
				tileContainer.insertAfter($('#' + (y * 1000 + (x - 1))));
			}
			break;

		case 1: // Bottom
			this.height += 1;
			var y = this.height - 1;
			this.positions.push(new Array());
			for(var x = 0; x < this.width; x++) {
				var tileContainer = $('<div class="TileContainer"></div>');
				tileContainer.data('tile', null);
				tileContainer.attr('id', (y * 1000 + x));
				this.positions[y].push(tileContainer);
				$('#board').append(tileContainer);
			}
			break;

		case 2: // Left
			this.width += 1;
			var x = 0;
			for(var y = 0; y < this.height; y++) {
				var tileContainer = $('<div class="TileContainer"></div>');
				tileContainer.data('tile', null);
				tileContainer.attr('id', (y * 1000 + x));
				this.positions[y].splice(0, 0, tileContainer);
				tileContainer.insertBefore($('#' + (y * 1000)));
			}
			for(var y = 0; y < this.height; y++) {
				for(var x = 0; x < this.width; x++) {
					this.positions[y][x].attr('id', (y * 1000 + x));
				}
			}
			break;

		case 3: // Top
			this.height += 1;
			var y = 0;
			this.positions.splice(0, 0, new Array());
			for(var x = this.width - 1; x >= 0; x--) {
				var tileContainer = $('<div class="TileContainer"></div>');
				tileContainer.data('tile', null);
				tileContainer.attr('id', (y * 1000 + x));
				this.positions[y].splice(0, 0, tileContainer);
				$('#board').prepend(tileContainer);
			}
			for(var y = 0; y < this.height; y++) {
				for(var x = 0; x < this.width; x++) {
					this.positions[y][x].attr('id', (y * 1000 + x));
				}
			}
			break;
	}

	for(var y = 0; y < this.height; y++) {
		for(var x = 0; x < this.width; x++) {
			var tileAtPosition = this.positions[y][x].data('tile');
			if(tileAtPosition != null) {
				tileAtPosition.x = x;
				tileAtPosition.y = y;
			}
		}
	}

	$('#board').css('width', this.width * 90);
};


Board.prototype.placeFollowerOnTile = function(tile) {
	this.followers.pop();
	tile.placeFollower();
};