class Scene{
    constructor(canvasData) {
        this.canvasData = canvasData;
        this.listeners = [];
    }

    start() {

    }

    end() {
        //удаляем всех слушателей
        for (var i=0; i<this.listeners.length; i++) {
            var d = this.listeners[i];
            this.canvasData.canvas.removeEventListener(d.name, d.callback);
        }
        this.listeners = [];
        
    }

    changeScene(next) {
        this.end();
        next.start();
    }

    addEventListener(name, callback) {
        this.listeners.push({name: name, callback: callback});

        this.canvasData.canvas.addEventListener(name, callback);
    }
}