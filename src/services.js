let url = null;
let callbacks = [];

function updateServices() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let services = JSON.parse(xhr.responseText);
            for (let cb of callbacks) {
                cb(services.slice());
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
    },
    removeCallback(cb) {
        callbacks = callbacks.filter(el => el != cb);
    }
}