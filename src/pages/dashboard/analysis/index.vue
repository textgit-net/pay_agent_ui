<script setup lang="ts">
import IntroduceRow from '~/pages/dashboard/analysis/introduce-row.vue'
import TransactionData from "~/pages/dashboard/analysis/transaction-data.vue";
import TransactionDataCard from "~/pages/dashboard/analysis/transaction-data-card.vue";
import TransactionDataAgentCard from "~/pages/dashboard/analysis/transaction-data-agent-card.vue";
import TransactionDataMchCard from "~/pages/dashboard/analysis/transaction-data-mch-card.vue";
import TransactionStatistics from "~/pages/dashboard/analysis/transaction-statistics.vue";


import SalesCard from '~/pages/dashboard/analysis/sales-card.vue'
import TopSearch from '~/pages/dashboard/analysis/components/top-search.vue'
import ProportionSales from '~/pages/dashboard/analysis/proportion-sales.vue'
import OfflineData from '~/pages/dashboard/analysis/offline-data.vue'

defineOptions({
  name: 'Analysis',
})

const userStore = useUserStore()
const isHasPermission = computed(()=> {
  return userStore.userInfo.isAllowInviteUser
})

const loading = ref(false)

const visitData = ref([])
</script>

<template>
  <page-container>
    <!-- <Suspense :fallback="null">
      <IntroduceRow :loading="loading" :visit-data="visitData" />
      
    </Suspense> -->
    <TransactionDataCard style="margin-bottom: 20px" />
    <TransactionDataAgentCard v-if="isHasPermission" style="margin-bottom: 20px" />
    <TransactionDataMchCard style="margin-bottom: 20px" />
    <!-- <TransactionData style="margin-bottom: 20px" />
   

    <TransactionStatistics style="margin-bottom: 20px" /> -->
   
    <!-- <Suspense :fallback="null">
      <SalesCard />
    </Suspense>

    <a-row
      :gutter="24"
      :style="{ marginTop: '24px' }"
    >
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <TopSearch />
        </Suspense>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <ProportionSales />
        </Suspense>
      </a-col>
    </a-row>

    <Suspense :fallback="null">
      <OfflineData />
    </Suspense> -->
  </page-container>
</template>
