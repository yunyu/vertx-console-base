let url = null;
let callbacks = [];
let lastLoggers = null;

function updateLoggers() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let loggers = JSON.parse(xhr.responseText);
            lastLoggers = loggers;
            for (let cb of callbacks) {
                cb(lastLoggers.slice());
            }
        }
    }
    xhr.send();
}

export default {
    initialize(endpoint) {
        url = endpoint;
        updateLoggers();
        setInterval(updateLoggers, 1000);
    },
    addCallback(cb) {
        callbacks.push(cb);
        if (lastLoggers !== null) {
            cb(lastLoggers.slice());
        }
    },
    removeCallback(cb) {
        callbacks = callbacks.filter(el => el != cb);
    }
}