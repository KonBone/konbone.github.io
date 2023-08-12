const drawer = new CanvasDrawer();

let dir = true;
let from = { x: 100, y: 100 };
let radius = 1800;
let phi = 0;

function shot() {
    let to = {};

    phi += (dir? 1: -1) / 16;
    radius += (dir? 1: -1) * -100;

    if (phi > Math.PI / 4) dir = false;
    if (phi <= 0) dir = true;

    console.log(phi);

    to.x = from.x + radius * Math.cos(phi);
    to.y = from.y + radius * Math.sin(phi);

    Shapes.line(drawer, from, to, [0, 0, 0, 255]);
    drawer.draw(true);
}

const fps = 24;
const period = Math.ceil(1000 / fps);

function main() {
    shot();
    setTimeout(main, period);
}
setTimeout(main, 1);