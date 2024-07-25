<script setup lang="ts">
import { SearchOutlined } from "@ant-design/icons-vue";
import { NetworkInfo } from "~/api/network.ts";
import { ColumnsType } from "ant-design-vue/es/table";
import { PaginationProps } from "ant-design-vue";
import {
  getWithdrawList,
  WidthdrawStatus,
  WithdrawSearch,
  getStatusText,
  WithDrawAuditRequest,
  saveWithdrawAudit,
  getWithdrawListCount,
  WithdrawCountItem,
} from "~/api/asset/withdraw.ts";
import { message } from "ant-design-vue";

const columns: ColumnsType = [
  {
    title: "ID",
    dataIndex: "id",
    fixed: "left",
    width: "140px",
  },
  {
    title: "所属公司",
    dataIndex: "companyName",
    fixed: "left",
    width: "140px",
  },
  {
    title: "所属应用",
    dataIndex: "yyxx",
    width: "140px",
  },
  {
    title: "提现发起人",
    dataIndex: "nickName",
    width: "140px",
  },
  {
    title: "提现的用户手机号",
    dataIndex: "phone",
    width: "140px",
  },
  {
    title: "提现信息",
    dataIndex: "txsx",
  },
  {
    title: "提现金额信息",
    dataIndex: "txjexx",
  },
  //   {
  //     title: '提现钱包类型',
  //     dataIndex: 'walletTypeText',
  //   },
  {
    title: "提现状态",
    dataIndex: "statusText",
  },
  {
    title: "转账失败原因",
    dataIndex: "transferError",
    width: "140px",
  },
  {
    title: "创建日期",
    dataIndex: "createTime",
  },
  {
    title: "更新日期",
    dataIndex: "updateTime",
  },

  {
    title: "操作",
    fixed: "right",
    width: "120px",
    dataIndex: "action",
  },
];
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
const dataSource = shallowRef<NetworkInfo[]>([]);

const search = reactive<WithdrawSearch>({
  appId: null,
  companyId: null,
  phone: null,
  status: WidthdrawStatus.audit,
  page: pagination.current,
  limit: pagination.pageSize,
});
const form = ref<WithDrawAuditRequest>({
  id: null,
  remark: "",
  isPass: false,
});
const router = useRouter();

const state = reactive<{
  tableLoad: boolean;
  isShowEditModal: boolean;
  isUpdate: boolean;
  isSaveLoading: boolean;
}>({
  tableLoad: false,
  isShowEditModal: false,
  isSaveLoading: false,
  isUpdate: false,
});

const withdrawCounts = ref<WithdrawCountItem>({
  audit: 0,
  auditRejected: 0,
  transferFail: 0,
  transferIng: 0,
  transferSuccess: 0,
});

const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await getWithdrawList(search);
    dataSource.value = data?.rows ?? [];
    pagination.total = data?.total ?? 0;
    getCounts();
  } catch (e) {
    console.log(e);
  } finally {
    state.tableLoad = false;
  }
};

const getCounts = async () => {
  try {
    let res = await getWithdrawListCount();
    withdrawCounts.value = res.data;
  } catch (error) {}
};

const handleSearch = async (row) => {
  pagination.current = 1;
  loadData();
};

const handleResetSearch = async (row) => {
  pagination.current = 1;
  search.appId = null;
  search.phone = null;
  search.companyId = null;
  loadData();
};

const openAuditModal = async (row) => {
  state.isShowEditModal = true;
  form.value.id = row.id;
};

const doAudit = async () => {
  try {
    let res = await saveWithdrawAudit(form.value);
    message.success("操作成功");
    loadData();
  } catch (error) {}
  state.isShowEditModal = false;
};

watch(
  () => search.status,
  (newValue, oldValue) => {
    if (newValue) {
      pagination.current = 1;
      loadData();
    }
  }
);

onMounted(() => {
  loadData();
});
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%; height: 100%">
    <a-modal
      @cancel="state.isShowEditModal = false"
      @ok="doAudit"
      centered
      v-model:open="state.isShowEditModal"
      :width="540"
      :title="`审核`"
      destroy-on-close
    >
      <a-form ref="formRef" layout="vertical" :model="form" class="mt-2">
        <a-form-item :label="`是否通过审核`" name="appId">
          <a-radio-group v-model:value="form.isPass" name="radioGroup">
            <a-radio :value="true">通过</a-radio>
            <a-radio :value="false">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="`审核备注`" name="appId">
          <a-input v-model:value="form.remark" :placeholder="`请输入`" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!--头部-->
    <a-card :body-style="{ padding: '15px' }">
      <a-flex justify="space-between">
        <a-typography-text>商品管理</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{ padding: '15px' }">
      <a-row :gutter="[16, 16]">
        <a-col :span="8">
          <a-input v-model:value="search.phone" placeholder="请输入手机号">
            <template #prefix>
              <SearchOutlined style="color: #bfc1c5" />
            </template>
          </a-input>
        </a-col>
        <a-col :span="8">
          <a-input v-model:value="search.companyId" placeholder="请输入企业ID">
            <template #prefix>
              <SearchOutlined style="color: #bfc1c5" />
            </template>
          </a-input>
        </a-col>
        <a-col :span="8">
          <a-input v-model:value="search.appId" placeholder="请输入应用ID">
            <template #prefix>
              <SearchOutlined style="color: #bfc1c5" />
            </template>
          </a-input>
        </a-col>
      </a-row>
      <a-flex justify="flex-end" class="mt-4">
        <a-button @click="handleResetSearch" type="link" size="middle">
          重置筛选</a-button
        >
        <a-button
          @click="handleSearch"
          type="primary"
          size="middle"
          style="width: 80px"
        >
          筛选</a-button
        >
      </a-flex>
    </a-card>
    <a-card :body-style="{ padding: '0px' }">
      <template #title>
        <a-radio-group v-model:value="search.status" style="margin: 16px 0">
          <a-radio-button :value="WidthdrawStatus.audit">
            {{ getStatusText(WidthdrawStatus.audit) }}
            ({{ withdrawCounts.audit }})
          </a-radio-button>
          <a-radio-button :value="WidthdrawStatus.transfer">
            {{ getStatusText(WidthdrawStatus.transfer) }}
            ({{ withdrawCounts.transferIng }})
          </a-radio-button>
          <a-radio-button :value="WidthdrawStatus.success">
            {{ getStatusText(WidthdrawStatus.success) }}
            ({{ withdrawCounts.transferSuccess }})
          </a-radio-button>
          <a-radio-button :value="WidthdrawStatus.fail">
            {{ getStatusText(WidthdrawStatus.fail) }}

            ({{ withdrawCounts.transferFail }})
          </a-radio-button>
          <a-radio-button :value="WidthdrawStatus.reject">
            {{ getStatusText(WidthdrawStatus.reject) }}
            ({{ withdrawCounts.auditRejected }})
          </a-radio-button>
        </a-radio-group>
      </template>
      <a-table
        :scroll="{ x: 'max-content' }"
        ref="tableRef"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="state.tableLoad"
        :columns="columns"
        size="middle"
        :bordered="false"
      >
        <template #emptyText>
          <a-empty></a-empty>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'companyName'">
            <a-flex vertical>
              <a-typography-text
                >{{ record.companyName }} -
                {{ record.companyId }}</a-typography-text
              >
            </a-flex>
          </template>
          <template v-if="column.dataIndex === 'yyxx'">
            <a-flex vertical>
              <a-image
                :width="50"
                :height="50"
                :src="record.applicationIcon"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
              />
              <a-typography-text type="secondary"
                >{{ record.applicationName }}-{{
                  record.appId
                }}</a-typography-text
              >
            </a-flex>
          </template>

          <template v-if="column.dataIndex == 'transferError'">
            <div>
              <a-flex
                v-if="
                  record.status == WidthdrawStatus.fail ||
                  record.status == WidthdrawStatus.reject
                "
                vertical
              >
                <a-typography-text type="secondary">{{
                  record.transferError
                }}</a-typography-text>
              </a-flex>
              <div v-else>--</div>
            </div>
          </template>
          <template v-if="column.dataIndex === 'txsx'">
            <a-flex vertical>
              <a-typography-text type="secondary"
                >提现的账户类型：{{ record.accountTypeText }}</a-typography-text
              >
              <a-typography-text type="secondary"
                >提现账户名：{{ record.accountHolder }}</a-typography-text
              >
              <a-typography-text type="secondary"
                >提现账户：{{ record.accountNo }}</a-typography-text
              >
            </a-flex>
          </template>
          <template v-if="column.dataIndex === 'txjexx'">
            <a-flex vertical>
              <a-typography-text type="secondary"
                >提现金额：{{ record.amount }}</a-typography-text
              >
              <a-typography-text type="secondary"
                >提现费率：{{ record.withdrawRates }}</a-typography-text
              >
              <a-typography-text type="secondary"
                >提现手续费：{{ record.withdrawFee }}</a-typography-text
              >
              <a-typography-text type="secondary" style="color: red"
                >实际到账：{{
                  record.amount - record.withdrawFee
                }}</a-typography-text
              >
            </a-flex>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-flex :gap="5">
              <a
                v-if="record.status == WidthdrawStatus.audit"
                @click="openAuditModal(record)"
                >审核</a
              >
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less"></style>
