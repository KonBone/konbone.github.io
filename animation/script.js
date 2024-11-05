const drawer = new CanvasDrawer();

const state = {
    dir: true,
    from: { x: 100, y: 100 },
    radius: 1000,
    phi: 0
};

function shot(drawer, state) {
    let to = {};
    
    state.phi += (state.dir? 1: -1) / 64;
    // state.radius += (state.dir? 1: -1) * -100;
    
    if (state.phi > Math.PI / 4) state.dir = false;
    if (state.phi <= 0) state.dir = true;
    
    // console.log(state.phi);
    
    to.x = state.from.x + state.radius * Math.cos(state.phi);
    to.y = state.from.y + state.radius * Math.sin(state.phi);
    
    Shapes.line(drawer, state.from, to, [0, 0, 0, 255]);
}

const animation = new Animation({fps: 144, drawer: drawer, main: shot, state: state});
animation.start();