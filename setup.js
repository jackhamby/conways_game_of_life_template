// Represents tiles on the board
const tiles = []

// Game constants
const INTERVAL = 60;
const WIDTH = 750;
const HEIGHT = 750;
const CELL_WIDTH = 25;
const CELL_HEIGHT = 25;
const WORLD_WIDTH = 2500;
const WORLD_HEIGHT = 2500;

// Board setup, dont worry about this unless you're curious
const app = new PIXI.Application({
    height: HEIGHT,
    width: WIDTH,
});
const viewport = new Viewport.Viewport({
    screenWidth: WIDTH,
    screenHeight: HEIGHT,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    interaction: app.renderer.plugins.interaction
});
document.getElementById("container").appendChild(app.view);
app.stage.addChild(viewport);
viewport
    .drag()
    .pinch();
viewport.position.x = -WORLD_WIDTH / 2 + WIDTH;
viewport.position.y = -WORLD_HEIGHT / 2 + HEIGHT;
const grid = new PIXI.Graphics();
grid.lineStyle(1, 0xFFFFFF);

for(let y = 0; y <= WORLD_HEIGHT; y += CELL_HEIGHT){
    grid.moveTo(0, y)
        .lineTo(WORLD_WIDTH, y);
}

for (let x = 0; x <= WORLD_WIDTH; x += CELL_WIDTH){
    grid.moveTo(x, 0)
        .lineTo(x, WORLD_HEIGHT);
}

for (let y = 0; y < WORLD_HEIGHT; y += CELL_HEIGHT){
    const row = [];
    for(let x = 0; x < WORLD_WIDTH; x += CELL_WIDTH){
        const graphics = new PIXI.Graphics();
        row.push({
            y,
            x,
            graphics,
            isAlive: false,
        });
        viewport.addChild(graphics);
    }
    tiles.push(row);
}

viewport.addChild(grid);

app.ticker.add(() => {
    tiles.forEach((row) => {
        row.forEach((tile) => {
            tile.graphics.clear();
            if(tile.isAlive){
                tile.graphics.beginFill(0xFFFF00);
                tile.graphics.drawRect(tile.x, tile.y, CELL_WIDTH, CELL_HEIGHT);
            }
        });
    });
});

// User events, game click and start/stop click
viewport.on("clicked", (event) => {
    const xIndex = Math.floor(event.world.x / CELL_WIDTH);
    const yIndex = Math.floor(event.world.y / CELL_HEIGHT);            
    const tile = tiles[yIndex][xIndex];
    tile.isAlive = !tile.isAlive;
});

document.getElementById("toggle").addEventListener("click", (event) => {
    if (event.target.innerText === "start"){
        event.target.innerText = "stop";
        app.ticker.add(runGame);
    }
    else {
        event.target.innerText = "start";
        app.ticker.remove(runGame);
        ticks = 0;
    }
});
