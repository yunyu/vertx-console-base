import parsePrometheusTextFormat from 'parse-prometheus-text-format';

const subscribed = new Set();
let url = null;
let metrics = {};

function updateMetrics() {
    var params = '?' + Array.from(subscribed).map(el => 'name[]=' + el).join('&');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url + params, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            metrics = parsePrometheusTextFormat(xhr.responseText);
            // console.log(JSON.stringify(metrics, null, 4));
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
    }
}