<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { PaginationProps } from "ant-design-vue";
import {
  fetchAccountRechargeRecord,
  AccountRechargeRecord,
  getRechargeRecord,
  AuditAccountRecharge,
  AuditAccount,
} from "~/api/company.ts";
import { message } from 'ant-design-vue';

// import { defineProps } from "vue";
const columns: ColumnsType = [
  {
    title: "ID",
    dataIndex: "companyId",
    fixed: "left",
  },
  {
    title: "企业名称",
    dataIndex: "companyName",
    fixed: "left",
  },
  {
    title: "账户类型",
    dataIndex: "accountTypeText",
    fixed: "left",
  },
  {
    title: "充值金额",
    dataIndex: "amount",
    fixed: "left",
  },

  {
    title: "状态",
    dataIndex: "statusText",
  },
  {
    title: "充值方式",
    dataIndex: "rechargeModeText",
  },

  {
    title: "创建时间",
    dataIndex: "createTime",
  },

  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "操作",
    fixed: "right",
    width: "180px",
    dataIndex: "action",
  },
];

const form = ref<AuditAccount>({
    id: null,
    remark: '',
    isPass: false,
})

const props = defineProps({
  status: {
    type: Number,
    required: true,
    default:():Number | undefined => undefined
  },
});

const tableRef = shallowRef();
const tableSize = useElementSize(tableRef);
const dataSource = shallowRef<getRechargeRecord[]>([]);
const searchParams = reactive<AccountRechargeRecord>(<AccountRechargeRecord>{
  page: 1,
  limit: 10,
  status: props.status
});

watch(()=>props.status,(val)=>{
  if(val) {
    searchParams.page = 1;
    searchParams.limit =10;
    searchParams.status = val;
    dataSource.value =[];
    loadData()  
  }
  
})
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

const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await fetchAccountRechargeRecord({
      ...searchParams,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    dataSource.value = data?.rows ?? [];
    pagination.total = data?.total ?? 0;
  } catch (e) {
    console.log(e);
  } finally {
    state.tableLoad = false;
  }
};

const openAuditModal = async(row) =>{
  state.isShowEditModal = true
  form.value.id= row.id
}

const doAudit = async() =>{
  try {
    let res = await AuditAccountRecharge(form.value);
    message.success('操作成功');
    loadData()
  } catch (error) {
  }
  state.isShowEditModal = false
}


onMounted(() => {
  loadData();
});
</script>

<template>
  <a-card :body-style="{ padding: '10px' }">

    <a-modal @cancel="state.isShowEditModal = false"  @ok="doAudit" centered v-model:open="state.isShowEditModal" :width="540" :title="`审核`" destroy-on-close>
      <a-form ref="formRef" layout="vertical" :model="form" class="mt-2">
        <a-form-item :label="`是否通过审核`" name="appId">
          <a-radio-group v-model:value="form.isPass" name="radioGroup">
            <a-radio :value="true">通过</a-radio>
            <a-radio :value="false">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="`审核备注`" name="appId">
          <a-input v-model:value="form.remark" :placeholder="`请输入`"/>
        </a-form-item>
      </a-form>
    </a-modal>


    <a-table
      :scroll="{ x: tableSize.width.value }"
      :pagination="pagination"
      :data-source="dataSource"
      :columns="columns"
      size="middle"
      :bordered="false"
      :loading="state.tableLoad"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
                <a v-if="record.status == 4" @click="openAuditModal(record)">审核</a>
            </a-flex>
        </template>
      
      </template>
    </a-table>
  </a-card>
</template>

<style scoped lang="less">
</style>