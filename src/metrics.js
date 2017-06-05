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
            let mappedMetrics = {};
            for (let el of metrics) {
                if (el.metrics.length === 1) {
                    el.metrics = el.metrics[0];
                } else if (el.metrics.length > 1) {
                    let sharedLblKey = null;
                    for (let metric of el.metrics) {
                        if (!metric.labels) {
                            sharedLblKey = null;
                            break;
                        }
                        let lblKeys = Object.keys(metric.labels);
                        if (lblKeys.length !== 1) {
                            sharedLblKey = null;
                            break;
                        } else if (sharedLblKey === null) {
                            sharedLblKey = lblKeys[0];
                        } else if (sharedLblKey != lblKeys[0]) {
                            sharedLblKey = null;
                            break;
                        }
                    }
                    if (sharedLblKey !== null) {
                        let mappedSubMetrics = {};
                        for (let metric of el.metrics) {
                            let subMetricKey = metric.labels[sharedLblKey];
                            mappedSubMetrics[subMetricKey] = metric;
                            delete mappedSubMetrics[subMetricKey].labels;
                        }
                        el.metrics = {};
                        el.metrics[sharedLblKey] = mappedSubMetrics;
                    }
                }
                let elName = el.name;
                mappedMetrics[elName] = el;
                delete mappedMetrics[elName].name;
            }
            for (let cb of callbacks) {
                cb(mappedMetrics.map(el => Object.assign({}, el))); // Clone object
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