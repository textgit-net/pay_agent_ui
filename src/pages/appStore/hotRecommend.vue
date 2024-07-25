<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import {
  getHotAppList,
  getHotAppInfo,
  delCategory,
  editHotApp,
  HotList,
  getHotList,
  delHotApp,
  ApplicationPopularTypeEnum,
  getApplicationPopularTypeText,
} from "~/api/appStore.ts";
import { PaginationProps } from "ant-design-vue";
const formRef = ref();
const columns: ColumnsType = [
  {
    title: "应用名称",
    dataIndex: "applyName",
    // width:'200px',
    fixed: "left",
  },
  {
    title: "分类",
    dataIndex: "popularType",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "排序",
    dataIndex: "sort",
  },
  {
    width: "160px",
    title: "操作",
    fixed: "right",
    dataIndex: "action",
  },
];
const HotRecSearch = shallowRef<getHotList>(<getHotList>{
  page: 1,
  limit: 10,
  applyName: null,
});
const dataSource = shallowRef<HotList[]>([]);
const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await getHotAppList({
      ...HotRecSearch.value,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    console.log(data);
    dataSource.value = data?.rows ?? [];
    pagination.total = data?.total ?? 0;
  } catch (e) {
    console.log(e);
  } finally {
    state.tableLoad = false;
  }
};

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
  isSaveLoading: boolean;
  isShowEditModal: boolean;
}>({
  tableLoad: false,
  isSaveLoading: false,
  isShowEditModal: false,
});

const HotappInfo = ref<HotList>({
  applyName: "",
  applyId: null,
  createTime: null,
  id: null,
  sort: null,
  status: false,
  updateTime: null,
  popularType: null,
});

const editAppInfo = (id) => {
  getHotAppInfoa(id);
  state.isShowEditModal = true;
};

const resetFormData = () => {
  console.log("关闭");
  state.isShowEditModal = false;
  HotappInfo.value = {
    applyName: "",
    applyId: null,
    createTime: null,
    id: null,
    sort: null,
    status: false,
    updateTime: null,
    popularType: null,
  };
};

const confirmContent = async () => {
  state.isSaveLoading = true;
  try {
    let res = await editHotApp(HotappInfo.value);
    state.isShowEditModal = false;
    loadData();
  } catch (e) {
    console.log(e);
  } finally {
    state.isSaveLoading = false;
  }
};

//根据id获取详情
const getHotAppInfoa = async (id) => {
  try {
    const { data } = await getHotAppInfo(id);
    HotappInfo.value = data;
    state.isShowEditModal = true;
  } catch (e) {
    useMessage().error(`${e}`, 2);
  }
};

// 最后再测
const deleteCategory = (id: number) => {
  try {
    const res = delHotApp(id);
    useMessage().success("删除成功");
    loadData();
  } catch (e) {
    useMessage().error("删除失败");
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <PageContainer>
    <a-flex vertical :gap="15">
      <a-card :body-style="{ padding: '0px' }">
        <!-- 表头插槽 -->
        <template #title> </template>

        <a-table
          :scroll="{ x: 'max-content' }"
          :columns="columns"
          :loading="state.tableLoad"
          :pagination="pagination"
          :data-source="dataSource"
          size="middle"
          :bordered="false"
        >
          <!-- 每行数据 -->
          <template #bodyCell="{ column, record }">
            <!-- 操作列 下拉菜单 start -->
            <template v-if="column.dataIndex === 'action'">
              <a-flex :gap="5">
                <a-button
                  size="small"
                  type="link"
                  @click="editAppInfo(record.id)"
                  >编辑</a-button
                >
                <!-- <a style="color: red" @click="deleteCategory(record.id)">
                  <DeleteOutlined /> 删除
                </a> -->
              </a-flex>
            </template>

            <template v-if="column.dataIndex === 'categryName'">
              <a-flex :gap="5">
                <!-- <a-avatar shape="square" :src="record.applyLogo" size="large"></a-avatar> -->
                <a-flex :gap="0" vertical>
                  <a-typography-text strong>{{
                    record.categoryName
                  }}</a-typography-text>
                  <a-typography-text type="secondary">{{
                    record.id
                  }}</a-typography-text>
                </a-flex>
              </a-flex>
            </template>
            <template
              v-if="column.dataIndex === 'status'"
              :value="HotappInfo.status"
            >
              <template v-if="record.status"> 正常 </template>
              <template v-else> 停用 </template>
            </template>

            <template
              v-if="column.dataIndex === 'popularType'"
              :value="HotappInfo.popularType"
            >
              {{ getApplicationPopularTypeText(record.popularType) }}
            </template>
          </template>
        </a-table>
      </a-card>
    </a-flex>

    <a-modal
      v-model:open="state.isShowEditModal"
      title="编辑应用详情"
      centered
      :width="500"
      :footer="null"
      @cancel="resetFormData()"
    >
      <a-form
        ref="formRef"
        :model="HotappInfo"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
      >
        <!-- <a-form-item  label="id" name="id">
      <a-input v-model:value="HotappInfo.id" />
    </a-form-item> -->
        <a-form-item label="应用名称" name="applyName">
          {{ HotappInfo.applyName }}
        </a-form-item>
        <a-form-item
          label="排序"
          name="sort"
          :rules="[{ required: true, message: '请输入序号', trigger: 'blur' }]"
        >
          <a-input v-model:value="HotappInfo.sort" />
        </a-form-item>
        <a-form-item
          label="状态"
          name="status"
          :rules="[
            { required: true, message: '请选择应用状态', trigger: 'blur' },
          ]"
        >
          <!-- 开关--- 0显示-1关闭 -->
          <a-radio-group v-model:value="HotappInfo.status">
            <a-radio :value="true">显示</a-radio>
            <a-radio :value="false">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            justify-content: flex-end;
            padding: 0 30px;
          "
        >
          <a-space>
            <a-button @click="resetFormData">取消</a-button>
            <a-button
              :loading="state.isSaveLoading"
              @click="confirmContent"
              type="primary"
              style="margin-right: 15px"
              >确认</a-button
            >
          </a-space>
        </div>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<style scoped lang="less"></style>
