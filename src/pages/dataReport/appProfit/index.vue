<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { PaginationProps } from "ant-design-vue";
import dayjs from "dayjs";

import {
  getAppProfit,
  AppProfitListItem,
  AppProfitSearchRequest,
} from "~@/api/dataReport";

const route = useRoute();
const router = useRouter();
const columns: ColumnsType = [
  {
    title: "appId",
    dataIndex: "appId",
    width: "200px",
    fixed: "left",
  },
  {
    title: "应用logo",
    dataIndex: "appIcon",
    width: "200px",
  },
  {
    title: "应用名称",
    dataIndex: "appName",
  },
  {
    title: "总产生金额",
    dataIndex: "totalAmount",
  },
  {
    title: "总收益",
    dataIndex: "profit",
  },

  {
    title: "支出总现金（红包）",
    dataIndex: "totalCashAmount",
  },
  {
    title: "支出总佣金",
    dataIndex: "totalTeamCommission",
  },
  {
    title: "支出总积分",
    dataIndex: "totalPointsAmount",
  },

  // {
  //   width: "100px",
  //   title: "操作",
  //   fixed: "right",
  //   dataIndex: "action",
  // },
];
const dataSource = shallowRef<AppProfitListItem[]>([]);
const initSearch = (): Partial<AppProfitSearchRequest> => {
  return {
    page: 1,
    limit: 10,
    appId: "",
    date: [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")],
  };
};

const state = reactive<{
  tableLoad: boolean;
}>({
  tableLoad: false,
});
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30", "40"],
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize;
    pagination.current = current;
    loadData();
  },
});
const searchInfo = ref<Partial<AppProfitSearchRequest>>(initSearch());
const { page, limit, appId } = route.query;
// if (page) {
//   pagination.current = Number(page);
//   pagination.pageSize = Number(limit);
//   // searchInfo.value.appId = `${appId}`;
// }

const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    let params: AppProfitSearchRequest = {
      ...searchInfo.value,
      page: pagination.current - 1, // 后端要求从0开始查
      limit: pagination.pageSize,
    };

    if (params.date) {
      params["dateRange.startTime"] = params.date[0] + " 00:00:00";
      params["dateRange.endTime"] = params.date[1] + " 23:59:59";
    }
    delete params.date;
    if (!params.appId) {
      delete params.appId;
    }

    const { data } = await getAppProfit(params);
    dataSource.value = data?.rows ?? [];
    pagination.total = data?.total ?? 0;
    // router.replace({
    //   path: route.path,
    //   query: {
    //     ...params,
    //   },
    // });
  } catch (e) {
    console.log(e);
  } finally {
    state.tableLoad = false;
  }
};

const doSearch = async () => {
  pagination.current = 1;
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <PageContainer>
    <a-flex vertical :gap="15">
      <a-card>
        <a-flex vertical :gap="15">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="5">
              <a-input
                placeholder="请输入应用id"
                allow-clear
                v-model:value="searchInfo.appId"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-col>

            <a-col class="gutter-row" :span="5">
              <a-range-picker
                v-model:value="searchInfo.date"
                valueFormat="YYYY-MM-DD"
              />
            </a-col>

            <a-button
              size="middle"
              type="primary"
              style="width: 80px"
              @click="doSearch"
              >查询</a-button
            >
          </a-row>
        </a-flex>
      </a-card>

      <a-table
        :scroll="{ x: 'max-content' }"
        :columns="columns"
        :loading="state.tableLoad"
        :pagination="pagination"
        :data-source="dataSource"
        size="middle"
        :bordered="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-flex :gap="5">
              <!-- <a-button size="small" type="link" >关系图谱</a-button> -->
            </a-flex>
          </template>

          <template v-if="column.dataIndex === 'appIcon'">
            <a-flex :gap="5">
              <a-avatar
                shape="square"
                :src="record.appIcon"
                size="large"
              ></a-avatar>
            </a-flex>
          </template>

          <template v-if="column.dataIndex === 'profit'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.profit }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'totalAmount'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.totalAmount }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'totalCashAmount'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.totalCashAmount }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'totalPointsAmount'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.totalPointsAmount }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'totalTeamCommission'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.totalTeamCommission }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <div>
              <a-tag v-if="record.status == 1" color="success">启用</a-tag>
              <a-tag v-else color="error">禁用</a-tag>
            </div>
          </template>
        </template>
      </a-table>
    </a-flex>
  </PageContainer>
</template>
