let url = null;
let callbacks = [];
let lastServices = null;

function updateServices() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let services = JSON.parse(xhr.responseText);
            lastServices = services;
            for (let cb of callbacks) {
                cb(lastServices.slice());
            }
        }
    }
    xhr.send();
}

export default {
    initialize(endpoint) {
        url = endpoint;
        updateServices();
        setInterval(updateServices, 1000);
    },
    addCallback(cb) {
        callbacks.push(cb);
        if (lastServices !== null) {
            cb(lastServices.slice());
        }
    },
    removeCallback(cb) {
        callbacks = callbacks.filter(el => el != cb);
    }
}