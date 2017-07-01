<script>
export default {
    name: 'number-spinner',
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 999
        },
        step: {
            type: Number,
            default: 1
        },
        value: Number
    },
    data() {
        return {
            internalValue: this.value
        }
    },
    methods: {
        onInput(e) {
            const value = e.target.value
            const parsed = parseInt(value)
            const origInternalValue = this.internalValue
            this.internalValue = null // Force DOM update 

            // See https://jsperf.com/numbers-and-integers for weak equals
            if (isNaN(parsed)) {
                this.internalValue = ''
            } else if (value == parsed && this.restrictValue(parsed) === parsed) { // jshint ignore:line
                this.internalValue = parsed
                this.emitValue()
            } else {
                this.internalValue = origInternalValue
            }
        },
        plus() {
            this.internalValue = this.restrictValue(this.sanitizeValue(this.internalValue) + this.step)
            this.emitValue()
        },
        minus() {
            this.internalValue = this.restrictValue(this.sanitizeValue(this.internalValue) - this.step)
            this.emitValue()
        },
        onWheel(e) {
            e.deltaY < 0 ? this.plus() : this.minus()
        },
        sanitizeValue(v) {
            return v === '' ? 0 : v
        },
        restrictValue(v) {
            return Math.min(Math.max(v, this.min), this.max)
        },
        emitValue() {
            this.$emit('input', this.internalValue)
        }
    }
}
</script>

<template>
    <div class="input-group number-spinner">
        <span class="input-group-btn">
            <button class="btn btn-default btn-minus" @click="minus()">
                <span>-</span>
            </button>
        </span>
        <input class="form-control" :value="internalValue" @input="onInput" @keydown.up="plus" @keydown.down="minus" @wheel="onWheel">
        <div class="input-group-btn">
            <button class="btn btn-default btn-plus" @click="plus()">
                <span>+</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.number-spinner {
    width: 88px;
}
</style>