class Animation {
    constructor(props = {}) {
        this.spf = Math.ceil(1000 / (props.fps || 60));
        this.drawer = props.drawer;
        this.main = props.main || ((d, s) => {});
        this.state = props.state || {};
        this.timeoutId = null;
    }

    start() {
        if (this.timeoutId) return;
        this.timeoutId = setTimeout(() => this._shot(), 10);
    }

    stop() {
        if (!this.timeoutId) return;
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }

    _shot() {
        this.main(this.drawer, this.state);
        this.drawer.draw(true);
        this.timeoutId = setTimeout(() => this._shot(), this.spf);
    }
}