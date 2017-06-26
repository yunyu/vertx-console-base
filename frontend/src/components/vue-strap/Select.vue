<template>
    <div ref="select" :class="classes" v-click-outside="close" @blur="canSearch ? null : close()">
        <button ref="btn" type="button" class="btn btn-default dropdown-toggle" tabindex="1" :disabled="disabled || !hasParent" :readonly="readonly" @click="toggle()" @keydown.esc.stop.prevent="close" @keydown.space.stop.prevent="toggle" @keydown.enter.stop.prevent="toggle">
            <span class="filter-option pull-left" v-html="loading ? text.loading : showPlaceholder || (multiple && showCount ? selectedText : selected)"></span>
            <span v-if="clearButton&&values.length" class="close" @click="clear()">&times;</span>
            &nbsp;
            <span class="bs-caret">
                <span class="caret"></span>
            </span>
        </button>
        <select ref="sel" v-model="val" :name="name" class="secret" :multiple="multiple" :required="required" :readonly="readonly" :disabled="disabled">
            <option v-if="required" value=""></option>
            <option v-for="option in list" :value="option[optionsValue]">{{ option[optionsLabel] }}</option>
        </select>
        <ul class="dropdown-menu">
            <template v-if="list.length">
                <li v-if="canSearch" class="bs-searchbox">
                    <input type="text" :placeholder="searchText||text.search" class="form-control" autocomplete="off" ref="search" v-model="searchValue" @keyup.esc="close" />
                    <span v-show="searchValue" class="close" @click="clearSearch">&times;</span>
                </li>
                <li v-if="required&&!clearButton">
                    <a @mousedown.prevent="clear() && close()">{{ placeholder || text.notSelected }}</a>
                </li>
                <li v-for="option in filteredOptions" :id="option[optionsValue]">
                    <a @mousedown.prevent="select(option[optionsValue])">
                        <span v-html="option[optionsLabel]"></span>
                        <span class="glyphicon glyphicon-ok check-mark" v-show="isSelected(option[optionsValue])"></span>
                    </a>
                </li>
            </template>
            <slot></slot>
            <transition v-if="notify && !closeOnSelect" name="fadein">
                <div class="notify in">{{limitText}}</div>
            </transition>
        </ul>
        <transition v-if="notify && closeOnSelect" name="fadein">
            <div class="notify out">
                <div>{{limitText}}</div>
            </div>
        </transition>
        <!-- <pre>Options: {{list}}</pre> -->
    </div>
</template>

<script>
import { select } from 'vue-strap';

export default {
    extends: select,
    computed: {
        classes() { return [this.isLi ? 'dropdown' : this.inInput ? 'input-group-btn' : 'btn-group', 'bootstrap-select', { open: this.show, disabled: this.disabled }, this.class] },
    },
    watch: {
        show(val) {
            if (val) {
                this.$refs.search ? this.$refs.search.focus() : this.$refs.btn.blur()
            }
        },
        toggle() {
            if (this.disabled && !this.show) return;
            this.show = !this.show
            if (!this.show) this.$refs.btn.blur()
        },

    }
}
</script>
