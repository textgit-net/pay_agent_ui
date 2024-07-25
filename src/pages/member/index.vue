<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { PaginationProps } from "ant-design-vue";
import {
  getMemberList,
  MemberListItem,
  MemberSearchRequest,
} from "~@/api/member";
const route = useRoute();
const router = useRouter();
const columns: ColumnsType = [
  {
    title: "ID",
    dataIndex: "id",
    width: "200px",
    fixed: "left",
  },
  {
    title: "基本信息",
    dataIndex: "userInfo",
    width: "200px",
  },
  {
    title: "是否为代理",
    dataIndex: "isAgent",
  },
  {
    title: "积分余额",
    dataIndex: "pointsAmount",
  },
  {
    title: "红包余额",
    dataIndex: "cashAmount",
  },
  {
    title: "佣金余额",
    dataIndex: "commissionAmount",
  },
  {
    title: "用户状态",
    dataIndex: "status",
  },
  {
    title: "注册时间",
    dataIndex: "registerTime",
  },
  {
    width: "100px",
    title: "操作",
    fixed: "right",
    dataIndex: "action",
  },
];
const dataSource = shallowRef<MemberListItem[]>([]);
const initSearch = (): Partial<MemberSearchRequest> => {
  return {
    page: 1,
    limit: 10,
    phone: "",
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
const memberSearchInfo = ref<Partial<MemberSearchRequest>>(initSearch());
const { page, limit, phone } = route.query;
if (page) {
  pagination.current = Number(page);
  pagination.pageSize = Number(limit);
  memberSearchInfo.value.phone = `${phone}`;
}

const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    let params: MemberSearchRequest = {
      ...memberSearchInfo.value,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    const { data } = await getMemberList(params);
    dataSource.value = data?.rows ?? [];
    pagination.total = data?.total ?? 0;
    console.log("route.query", route, route.query);
    router.replace({
      path: route.path,
      query: {
        ...params,
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    state.tableLoad = false;
  }
};

const handleToPath = (id) => {
  router.push({
    path: "/member/detail",
    query: {
      id: id,
      // appId:appId
    },
  });
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
                placeholder="请输入会员账户"
                allow-clear
                v-model:value="memberSearchInfo.phone"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
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
              <a-button
                size="small"
                type="link"
                @click="handleToPath(record.id)"
                >查看详情</a-button
              >
              <!-- <a-button size="small" type="link" >关系图谱</a-button> -->
            </a-flex>
          </template>

          <template v-if="column.dataIndex === 'userInfo'">
            <a-flex :gap="5">
              <a-avatar
                shape="square"
                :src="record.avatar"
                size="large"
              ></a-avatar>
              <a-flex :gap="0" vertical>
                <a-typography-text strong>{{
                  record.nickName
                }}</a-typography-text>
                <a-typography-text type="secondary">{{
                  record.phone
                }}</a-typography-text>
              </a-flex>
            </a-flex>
          </template>

          <template v-if="column.dataIndex === 'isAgent'">
            <a-tag v-if="record.isAgent" color="#2db7f5">代理</a-tag>
            <a-typography-text v-else>代非理</a-typography-text>
          </template>
          <template v-if="column.dataIndex === 'pointsAmount'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.pointsAmount }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'cashAmount'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.cashAmount }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'commissionAmount'">
            <span style="color: red; font-weight: bold">
              ￥{{ record.commissionAmount }}
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
