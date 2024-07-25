<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import {
  DownOutlined,
  AndroidOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
  CopyOutlined,
  AppleOutlined,
  MoreOutlined,
  SearchOutlined,
  DeleteFilled,
  FireFilled,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { SelectOption } from "~/utils/constant.ts";
import { CascaderProps } from "ant-design-vue";
import useClipboard from "vue-clipboard3";
import { getcoApplyCategoryList } from "~/api/appStore.ts";
import {
  ApplicationFrom,
  ApplicationInfo,
  ApplicationSearch,
  copyApp,
  CopyApplicationRequest,
  searchApplication,
  AddToAppStoreRequest,
  // 上架
  addToAppStore,
} from "~/api/application.ts";
import path from "path";
import { PaginationProps } from "ant-design-vue";
import From from "~/pages/application/from.vue";
import { useUserStore } from "~/stores/user.ts";
import { stat } from "node:fs";
const message = useMessage();
const route = useRoute();
const router = useRouter();
const columns: ColumnsType = [
  {
    title: "应用名称/ID",
    dataIndex: "name",
    width: "200px",
    fixed: "left",
  },
  {
    title: "企业",
    dataIndex: "company",
  },
  {
    title: "行业",
    dataIndex: "category",
  },
  {
    title: "Bundle ID",
    dataIndex: "bundleIdentifier",
  },
  {
    title: "系统",
    dataIndex: "os",
  },
  {
    title: "应用状态",
    dataIndex: "status",
  },

  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    width: "100px",
    title: "操作",
    fixed: "right",
    dataIndex: "action",
  },
];

const userStore = useUserStore();
const applicationSearch = reactive<ApplicationSearch>(<ApplicationSearch>{
  page: 1,
  limit: 10,
  status: null,
  platform: null,
});
const { toClipboard } = useClipboard();
const tableRef = shallowRef();
const tableSize = useElementSize(tableRef);
const dataSource = shallowRef<ApplicationInfo[]>([]);
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
  isShowOnShelfDialog: boolean;
  tableLoad: boolean;
  saveAlipayConfigLoading: boolean;
  isShowAlipayConfigModal: boolean;
  isShowEditModal: boolean;
  isUpdate: boolean;
  isShowCopyModal: boolean;
  selectApp?: ApplicationInfo;
  isSaveLoading: boolean;
}>({
  isShowOnShelfDialog: false,
  saveAlipayConfigLoading: false,
  isShowAlipayConfigModal: false,
  tableLoad: false,
  isShowCopyModal: false,
  isShowEditModal: false,
  isSaveLoading: false,
  selectApp: null,
  isUpdate: false,
});

const applicationShelfForm = ref<Partial<AddToAppStoreRequest>>({
  categoryId: "",
  remark: "",
});

const categoryOptions = shallowRef<CascaderProps["options"]>([]);

//获取分类内容
const loadCategory = async () => {
  const res = await getcoApplyCategoryList();
  categoryOptions.value = res.data ?? [];
};

loadCategory();

const doSearch = () => {
  let params = {};
  Object.assign(params, route.query);
  params["companyName"] = applicationSearch.companyName;
  params["companyId"] = applicationSearch.companyId;
  params["status"] = applicationSearch.status;
  params["keyword"] = applicationSearch.keyword;
  router.push({ path: route.path, query: params, replace: true });
};
const copyAppRequest = reactive<CopyApplicationRequest>({});
const openCopyApplication = (app: ApplicationInfo) => {
  state.selectApp = app;
  Object.assign(copyAppRequest, {
    originalAppId: app.id,
    bundleIdentifier: "",
    name: "",
  });
  state.isShowCopyModal = true;
};
const copyAndroidSha1 = async (app: ApplicationInfo) => {
  await toClipboard(app.androidSha1);
  message.success("复制成功");
};
const doCopy = async () => {
  let formData = JSON.parse(JSON.stringify(unref(copyAppRequest)));
  formData.bundleIdentifier = `${state.selectApp?.bundleIdentifier}.${copyAppRequest.bundleIdentifier}`;
  useMessage().loading("请输中");
  try {
    await copyApp(formData);
    useMessage().destroy();
    useMessage().success("保存成功", 2);
    await loadData();
    state.isShowCopyModal = false;
  } catch (e) {
    useMessage().destroy();
    useMessage().error(`${e}`, 2);
  }
};
const addToStore = async (item: ApplicationInfo) => {
  applicationShelfForm.value.id = item.id;
  state.isShowOnShelfDialog = true;
};

const saveAddToStore = async () => {
  state.isSaveLoading = true;
  try {
    const res = await addToAppStore(applicationShelfForm.value);
    useMessage().success("上架成功");
    state.isSaveLoading = false;
  } catch (e) {
    // useMessage().error()
    console.log(e);
  } finally {
    state.isSaveLoading = false;
  }
};

/**
 * 打开支付宝配制弹窗
 * @param record
 */
const openAliPayConfig = async (record: any) => {
  Object.assign(state.selectApp, record);
  state.isShowAlipayConfigModal = true;
};
/**
 * 保存支付宝配制
 */
const saveAlipayConfig = async () => {};
const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await searchApplication({
      ...applicationSearch,
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

onMounted(() => {
  if (toRaw(route).query.status) {
    applicationSearch.status = Number.parseInt(`${toRaw(route).query.status}`);
  }
  if (toRaw(route).query.companyId) {
    applicationSearch.companyId = Number.parseInt(
      `${toRaw(route).query.companyId}`
    );
  }
  if (toRaw(route).query.keyword) {
    applicationSearch.keyword = `${toRaw(route).query.keyword}`;
  }
  loadData();
});
</script>

<template>
  <PageContainer>
    <a-flex vertical :gap="15">
      <a-card>
        <a-flex vertical :gap="15">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
              <a-input
                v-model:value="applicationSearch.keyword"
                placeholder="请输入应用名称/ID搜索"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <RemoteSelect
                v-model:value="applicationSearch.companyId"
                :is-show-placeholder-item="true"
                placeholder="全部企业"
                data-source-url="/company/selectOption"
              ></RemoteSelect>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-select
                v-model:value="applicationSearch.status"
                style="width: 100%"
              >
                <a-select-option :value="null">所有状态</a-select-option>
                <a-select-option :value="1">审核中</a-select-option>
                <a-select-option :value="2">运行中</a-select-option>
                <a-select-option :value="2">停止</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-flex justify="flex-end" :gap="0">
            <a-button type="link">重置筛选</a-button>
            <a-button
              size="middle"
              @click="doSearch"
              type="primary"
              style="width: 80px"
              >筛选</a-button
            >
          </a-flex>
        </a-flex>
      </a-card>
      <a-card :body-style="{ padding: '0px' }">
        <template #title>
          <!--        <RouterLink :to="{path:'/application/add'}"><PlusOutlined/>创建应用</RouterLink>-->
          <a-button
            @click="router.push({ path: '/application/manage/add' })"
            type="primary"
            ><PlusOutlined />创建应用</a-button
          >
        </template>
        <template #extra>
          <a-space>
            <a-checkbox>显示已停止应用</a-checkbox>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0">
                    <FireFilled />
                    打包应用
                  </a-menu-item>
                  <a-menu-item key="1">
                    <DeleteFilled />
                    删除应用
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                批量操作
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-space>
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
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <a-flex :gap="5">
                <a-button
                  size="small"
                  type="link"
                  @click="
                    router.push({
                      path: '/application/manage/edit',
                      query: { id: record.id },
                    })
                  "
                  >编辑</a-button
                >
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <MoreOutlined />
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a style="color: red"><DeleteOutlined /> 删除</a>
                      </a-menu-item>
                      <a-menu-item
                        @click="openAliPayConfig(record as ApplicationInfo)"
                      >
                        <a><AndroidOutlined /> 支付宝配制</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a><AndroidOutlined /> Android 打包</a>
                      </a-menu-item>
                      <a-menu-item
                        @click="addToStore(record as ApplicationInfo)"
                      >
                        <a><AppstoreAddOutlined /> 上架应用商店</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a><AppleOutlined /> IOS 打包</a>
                      </a-menu-item>
                      <a-menu-item @click="openCopyApplication(record)">
                        <a><CopyOutlined /> 复制应用</a>
                      </a-menu-item>
                      <a-menu-item
                        @click="copyAndroidSha1(record as ApplicationInfo)"
                      >
                        <a><AndroidOutlined /> 复制Android Sha1</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-flex>
            </template>
            <template v-if="column.dataIndex === 'name'">
              <a-flex :gap="5">
                <a-avatar
                  shape="square"
                  :src="record.icon"
                  size="large"
                ></a-avatar>
                <a-flex :gap="0" vertical>
                  <a-typography-text strong>{{
                    record.name
                  }}</a-typography-text>
                  <a-typography-text type="secondary">{{
                    record.id
                  }}</a-typography-text>
                </a-flex>
              </a-flex>
            </template>
            <template v-if="column.dataIndex === 'os'">
              <a-space>
                <AndroidOutlined />
                <AppleOutlined />
              </a-space>
            </template>
            <template v-if="column.dataIndex === 'company'">
              <span>{{ record.company.name }}</span>
            </template>
            <template v-if="column.dataIndex === 'category'">
              <span>---/---</span>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-flex>

    <a-modal
      :width="400"
      v-model:open="state.isShowOnShelfDialog"
      centered
      :closable="false"
      destroy-on-close
      :footer="null"
      :title="null"
    >
      <a-flex vertical :gap="15">
        <a-typography-text strong>上架到超级APP</a-typography-text>
        <div style="height: 300px; overflow-y: auto">
          <a-form layout="vertical">
            <a-flex :gap="10">
              <a-form-item name="name" label="所属类目">
                <a-select
                  v-model:value="applicationShelfForm.categoryId"
                  style="width: 200px"
                  placeholder="请选择所属类目"
                  :options="categoryOptions"
                  :field-names="{ label: 'categoryName', value: 'id' }"
                ></a-select>
              </a-form-item>
            </a-flex>
            <a-flex :gap="10">
              <a-form-item name="name" label="应用备注">
                <a-input
                  v-model:value="applicationShelfForm.remark"
                  type="text"
                  style="width: 100%"
                  clearable
                  autocomplete="off"
                  placeholder="请输入应用备注"
                />
              </a-form-item>
            </a-flex>
          </a-form>
        </div>
        <a-flex justify="flex-end" :gap="10">
          <a-button
            @click="state.isShowOnShelfDialog = false"
            style="width: 120px"
            >取消</a-button
          >
          <a-button
            :loading="state.isSaveLoading"
            :disabled="!applicationShelfForm.categoryId"
            style="width: 120px"
            @click="saveAddToStore"
            type="primary"
            >保存</a-button
          >
        </a-flex>
      </a-flex>
    </a-modal>

    <a-modal
      v-model:open="state.isShowCopyModal"
      :title="`复制${state.selectApp?.name}`"
      centered
      :width="450"
      @ok="doCopy"
    >
      <a-form :model="copyAppRequest" layout="vertical">
        <a-form-item
          label="应用名称"
          name="name"
          :rules="[
            { required: true, message: '应用名称不能为空', trigger: 'blur' },
          ]"
        >
          <a-input
            v-model:value="copyAppRequest.name"
            :placeholder="state.selectApp?.name"
          />
        </a-form-item>
        <a-form-item
          label="应用包名"
          name="name"
          :rules="[
            { required: true, message: '应用包名不能为空', trigger: 'blur' },
          ]"
        >
          <a-input
            v-model:value="copyAppRequest.bundleIdentifier"
            placeholder="请输入新的后缀"
          >
            <template #prefix>
              <span>{{ state.selectApp?.bundleIdentifier }}.</span>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="所属企业" class="mt-5" name="companyId">
          <RemoteSelect
            placeholder="请选择企业"
            v-model:value="copyAppRequest.companyId"
            data-source-url="/company/selectOption"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:open="state.isShowAlipayConfigModal"
      :title="`支付宝配制(${state.selectApp?.name ?? ''})`"
    >
    </a-modal>
  </PageContainer>
</template>

<style scoped lang="less"></style>
