var greyBackgroundClass = 'cards-pf';

export default {
    addGreyBackground(className) {
        document.body.classList.add(greyBackgroundClass);
    },
    removeGreyBackground(className) {
        document.body.classList.remove(greyBackgroundClass);
    }
};