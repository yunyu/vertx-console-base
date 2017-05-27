<<template>
<div class="utilization-trend-chart-pf" :class="{'data-unavailable-pf': !dataAvailable}">
    <h3 v-if="title">{{ title }}</h3>
    <div class="current-values">
      <h1 class="available-count pull-left">{{ value }}</h1>
      <div class="available-text pull-left">
        <div>
          <span>{{ text }}</span>
        </div>
        <div>
          <span> of {{ total }} {{ units }}</span>
        </div>
      </div>
    </div>
    <div class="donut-chart-pf">
      <div pf-donut-pct-chart v-if="dataAvailable" config="donutConfig" data="chartData" center-label="centerLabel"></div>
      <div pf-empty-chart v-else chart-height="231"></div>
    </div>
    <div v-if="dataAvailable" class="sparkline-chart">
      <div pf-sparkline-chart config="sparklineConfig" chart-data="chartData" chart-height="sparklineChartHeight" show-x-axis="showSparklineXAxis" show-y-axis="showSparklineYAxis"></div>
    </div>
    <span class="pull-left legend-text">{{legendLeftText}}</span>
    <span class="pull-right legend-text">{{legendRightText}}</span>
</div>
</template>

<script>
export default {

}
</script>
 