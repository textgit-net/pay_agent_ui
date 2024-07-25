<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";

import {
  // 应用详情-删除-查询（）
  getCategoryList,
  categoryList,
  saveCategory,
  getcategory,
  getCategoryInfo,
  delCategory,
} from "~/api/appStore.ts";
import { PaginationProps } from "ant-design-vue";
const formRef = ref();

const columns: ColumnsType = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "分类名称",
    dataIndex: "categoryName",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "排序",
    dataIndex: "sortNo",
  },
  {
    width: "160px",
    title: "操作",
    fixed: "right",
    dataIndex: "action",
  },
];

const initForm = (): Partial<categoryList> => {
  return {
    categoryName: "",
    status: null,
    sortNo: null,
  };
};

const CategoryForm = ref<Partial<categoryList>>(initForm());
const dataSource = shallowRef<categoryList[]>([]);
const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await getCategoryList({
      ...CategoryForm.value,
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
}>({
  tableLoad: false,
  isShowEditModal: false,
});
const getcategoryInfo = async (id) => {
  try {
    const { data } = await getCategoryInfo(id);
    CategoryForm.value = data;
    state.isShowEditModal = true;
    // loadData()
  } catch (e) {
    useMessage().error(`${e}`, 2);
  }
};
const addCategory = async () => {
  state.isShowEditModal = true;
};
const submitForm = async () => {
  try {
    let result = await saveCategory(CategoryForm.value);
    useMessage().success("操作成功");
    loadData();
  } catch {}
};
const doedit = async () => {
  formRef.value.validate().then(() => {
    submitForm();
    resetFormdata();
  });
  loadData().catch((error: void) => {
    console.log("error", error);
  });
};
const resetFormdata = () => {
  state.isShowEditModal = false;
  CategoryForm.value = initForm();
};
const deleteCategory = (id: number) => {
  try {
    const res = delCategory(id);
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
        <template #title>
          <a-button @click="addCategory">创建分类</a-button>
        </template>
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
                  @click="getcategoryInfo(record.id)"
                  >编辑</a-button
                >
                <a-popconfirm
                  title="确认删除当前分类吗？"
                  @confirm="(_:Event) => deleteCategory(record.id)"
                >
                  <template #icon
                    ><question-circle-outlined style="color: red"
                  /></template>
                  <!-- <a href="#" style="color: red"><DeleteOutlined /> 删除</a> -->
                </a-popconfirm>
              </a-flex>
            </template>
            <template v-if="column.dataIndex === 'categryName'">
              <a-flex :gap="5">
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
              :value="applyForm.status"
            >
              <template v-if="record.status == 0"> 正常 </template>
              <template v-else> 停用 </template>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-flex>

    <a-modal
      v-model:open="state.isShowEditModal"
      centered
      :width="500"
      :footer="null"
    >
      <a-form
        ref="formRef"
        :model="CategoryForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          label="分类名称"
          name="categoryName"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]"
        >
          <a-input v-model:value="CategoryForm.categoryName" />
        </a-form-item>
        <a-form-item
          label="排序"
          name="sortNo"
          :rules="[
            { required: true, message: '请输入排序号', trigger: 'blur' },
          ]"
        >
          <a-input v-model:value="CategoryForm.sortNo" />
        </a-form-item>
        <a-form-item
          label="状态"
          name="status"
          :rules="[
            { required: true, message: '请选择分类状态', trigger: 'blur' },
          ]"
        >
          <a-radio-group v-model:value="CategoryForm.status">
            <a-radio :value="0">正常</a-radio>
            <a-radio :value="1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-flex justify="end">
          <a-space>
            <a-button @click="resetFormdata">取消</a-button>
            <a-button @click="doedit" type="primary">确认</a-button>
          </a-space>
        </a-flex>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<style scoped lang="less"></style>
