<template>
	<div>
	
		<div v-if="filterable" class="row toolbar-pf table-view-pf-toolbar">
			<div class="col-sm-12">
				<div class="toolbar-pf-actions">
					<div class="form-group toolbar-pf-filter">
						<label for="filter" class="sr-only">Filter</label>
						<input type="text" id="filter" class="form-control" v-model="store.filter" placeholder="Filter">
					</div>
				</div>
			</div>
		</div>
	
		<table class="table table-hover table-striped table-bordered dataTable">
			<thead>
				<tr>
					<th v-for="head_column in column_props" :class="getHeaderColumnClass(head_column)" @click="store.sortBy(head_column.id)">{{ head_column.label }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in store.visible_rows">
					<td v-for="row_column in column_props" :style="{'text-align': row_column.align}">
						<span v-if="row_column.field">{{ getRowFromField(row, row_column.field) }}</span>
						<span v-if="row_column.callback">{{ row_column.callback(row) }}</span>
						<component v-if="row_column.component" :is="row_column.component" :row="row"></component>
					</td>
				</tr>
			</tbody>
		</table>
	
		<div v-if="paginate" class="content-view-pf-pagination table-view-pf-pagination clearfix">
			<div v-if="has_size_options" class="form-group">
				<div class="pagination-pf-pagesize">
					<select v-model="store.page_size" class="btn btn-default" @change.stop="">
						<option v-for="size in sizeOptions" :value="size">{{ size }}</option>
					</select>
					<span>per page</span>
				</div>
			</div>
			<div class="form-group">
				<ul class="pagination">
					<li :class="{ disabled: store.page == 1 }" @click="store.page > 1 && store.setPage(store.page - 1, $event)">
						<a>
							<span class="i fa fa-angle-left"></span>
						</a>
					</li>
	
					<li v-if="store.page - 3 >= 1" @click="store.setPage(1, $event)">
						<a>1</a>
					</li>
					<li class="disabled" v-if="store.page - 4 >= 1">
						<a>...</a>
					</li>
	
					<li v-if="store.page - 2 >= 1" @click="store.setPage(store.page - 2, $event)">
						<a>{{ store.page - 2 }}</a>
					</li>
					<li v-if="store.page - 1 >= 1" @click="store.setPage(store.page - 1, $event)">
						<a>{{ store.page - 1 }}</a>
					</li>
	
					<li class="active">
						<a>{{ store.page }}</a>
					</li>
	
					<li v-if="store.page + 1 <= store.last_page" @click="store.setPage(store.page + 1, $event)">
						<a>{{ store.page + 1 }}</a>
					</li>
					<li v-if="store.page + 2 <= store.last_page" @click="store.setPage(store.page + 2, $event)">
						<a>{{ store.page + 2 }}</a>
					</li>
	
					<li class="disabled" v-if="store.page + 4 <= store.last_page">
						<a>...</a>
					</li>
					<li v-if="store.page + 3 <= store.last_page" @click="store.setPage(store.last_page, $event)">
						<a>{{ store.last_page }}</a>
					</li>
	
					<li :class="{ disabled: store.page == store.last_page }" @click="store.page < store.last_page && store.setPage(store.page + 1, $event)">
						<a>
							<span class="i fa fa-angle-right"></span>
						</a>
					</li>
	
				</ul>
			</div>
		</div>
	
	</div>
</template>

<style lang="scss">
.dataTable {
	background: #fff;

	tr th {
		height: 29px;
	}
}
</style>

<script>
import Vue from 'vue';
import objectPath from 'object-path';
import json_store from './json-store.js';

export default {
	props: {
		columns: [Object, Array],
		data: [Object, Array, String],
		filterable: {
			type: Boolean,
			default: false
		},
		paginate: {
			type: Boolean,
			default: false
		},
		sizeOptions: {
			type: [Object, Array],
			default: function () { return [25, 50, 100]; }
		},
		dataStore: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			store: null
		}
	},
	computed: {
		column_props: function () {
			var i = 0;
			return this.columns.map(function (column) {
				var sortable = typeof column.sortable === 'undefined' ? true : column.sortable;
				var filterable = typeof column.filterable === 'undefined' ? true : column.filterable;

				if (column.component) {
					var component_definition = this.$root.$options.components[column.component];
					var plain_text_function = component_definition.options.asPlainText;

					if (plain_text_function) {
						sortable = true;
						filterable = true;
					} else {
						sortable = false;
						filterable = false;
					}
				}

				return {
					id: i++,
					label: column.label || '',
					align: column.align || 'left',
					sortable: sortable,
					filterable: filterable,
					field: column.field || null,
					callback: column.callback || null,
					component: column.component || null
				};
			}.bind(this));
		},
		has_size_options: function () {
			const is_array = (this.sizeOptions instanceof Array);
			const can_resize = this.store.can_resize;
			return is_array && can_resize;
		}
	},
	beforeMount() {
		if (this.dataStore) {
			this.store = new Vue(this.dataStore);
		} else {
			this.store = new Vue(json_store);
		}
		this.updateStore(this.data);
	},
	beforeDestroy() {
		this.store.$destroy(); // Necessary because store is not a component
	},
	methods: {
		getHeaderColumnClass(head_column) {
			const can_sort = this.store.sortable;

			const sort_none =
				head_column.id !== this.store.sort_by || !this.store.sort_dir;

			const sort_asc =
				head_column.id === this.store.sort_by && this.store.sort_dir === 'asc';

			const sort_dsc =
				head_column.id === this.store.sort_by && this.store.sort_dir === 'dsc';

			return {
				'sorting': can_sort && sort_none,
				'sorting_asc': can_sort && sort_asc,
				'sorting_desc': can_sort && sort_dsc,
			}
		},
		updateStore(data) {
			this.store.setTable(this);
			this.store.setData(data);
			this.store.setFilterable(this.filterable);
			this.store.setPaginate(this.paginate);
			this.store.setSortable(true);
		},
		getRowFromField(row, field) {
			return objectPath.get(row, field)
		}
	},
	watch: {
		data() {
			this.updateStore(this.data);
		}
	}
}
</script>