import parsePrometheusTextFormat from 'parse-prometheus-text-format';

const subscribed = new Set();
let url = null;
let metrics = {};
let callbacks = [];

function updateMetrics() {
    var params = '?' + Array.from(subscribed).map(el => 'name[]=' + el).join('&');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url + params, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            metrics = parsePrometheusTextFormat(xhr.responseText);
            for (let cb of callbacks) {
                cb(metrics.map(el => Object.assign({}, el)));
            }
        }
    };
    xhr.send();
}

export default {
    subscribe(metricName) {
        subscribed.add(metricName);
        updateMetrics();
    },
    unsubscribe(metricName) {
        subscribed.delete(metricName);
    },
    getMetrics() {
        return metrics;
    },
    initialize(endpoint) {
        url = endpoint;
        updateMetrics();
        setInterval(updateMetrics, 1000);
    },
    addCallback(cb) {
        callbacks.push(cb);
    }
}