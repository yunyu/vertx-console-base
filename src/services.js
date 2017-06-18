let url = null;
let callbacks = [];
let lastServices = null;

/*
function repeatArray(arr, count) {
    var ln = arr.length;
    var b = [];
    for (var i = 0; i < count; i++) {
        b.push(arr[i % ln]);
    }
    return b;
}
*/

function updateServices() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let services = JSON.parse(xhr.responseText);
            lastServices = services;
            for (let cb of callbacks) {
                cb(lastServices.slice(), 200);
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