<<template>                
    <div>
        <pf-utilization-bar-chart v-for="item in items" :key="item.title" :title="item.title" :units="item.units" :value="item.value" :total="item.total"></pf-utilization-bar-chart>
    </div>
</template>

<script>
import UtilizationBarChart from 'vue-patternfly';

export default {
    props: ['items']
}
</script>