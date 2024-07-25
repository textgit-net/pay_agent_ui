<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { VueToggles } from "vue-toggles";
import {
  DeleteOutlined,
  ArrowUpOutlined,
  MoreOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";

import {
  // 应用详情-删除-查询（）
  ApplyListSearch,
  ApplyInfo,
  getApplyInfo,
  getcoApplyList,
  appStatus,
  getappStatus,
  removecoApply,
  addHotApp,
  PopularRecommendationRequest,
  ApplicationPopularTypeEnum,
  getApplicationPopularTypeText,
  savecoApply,
  ApplyInfoStatus,
  // getcoApplyLista
} from "~/api/appStore.ts";

import { PaginationProps } from "ant-design-vue";
const router = useRouter();
const columns: ColumnsType = [
  {
    title: "应用名称/ID",
    dataIndex: "applyName",
    width: "160px",
    fixed: "left",
  },
  {
    title: "所属分类",
    dataIndex: "categoryName",
    width: "120px",
  },
  {
    title: "应用备注",
    dataIndex: "applyRemark",
  },
  {
    title: "APP包名",
    dataIndex: "packetName",
  },
  {
    title: "应用状态",
    dataIndex: "status",
  },
  {
    title: "下载链接",
    dataIndex: "applyDownloadLink",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    width: "160px",
    title: "操作",
    fixed: "right",
    dataIndex: "action",
  },
];
const applySearch = reactive<ApplyListSearch>(<ApplyListSearch>{
  page: 1,
  limit: 10,
  status: null,
  name: null,
});
const dataSource = shallowRef<ApplyInfo[]>([]);
const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await getcoApplyList({
      ...applySearch,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    console.log(data);
    let arr = data?.rows ?? [];
    dataSource.value = arr.map((i) => {
      return {
        ...i,
        isEnable: i.status == ApplyInfoStatus.onLine,
      };
    });
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
  isShowPopularRecommendation: boolean;
  isShowInfoModal: boolean;
  isSaveLoading: boolean;
}>({
  tableLoad: false,
  isShowPopularRecommendation: false,
  isShowInfoModal: false,
  isSaveLoading: false,
});

const popularRecommendationFrom = ref<PopularRecommendationRequest>({
  applyId: "",
  applyName: "",
  popularType: ApplicationPopularTypeEnum.newHot,
  status: true,
  sort: 0,
});

const doSearch = async () => {
  pagination.current = 1;
  loadData();
};
const appInfo = ref<ApplyInfo>({});
const getAppInfoa = async (id: number) => {
  try {
    const { data } = await getApplyInfo(id);
    appInfo.value = data;
    state.isShowInfoModal = true;
  } catch (e) {
    useMessage().error(`${e}`);
  }
};
const resetSearch = () => {
  pagination.current = 1;
  applySearch.name = null;
  applySearch.status = null;
  loadData();
};
const deleteApp = async (id: number) => {
  try {
    const res = await removecoApply(id);
    useMessage().success("删除成功");
    loadData();
  } catch (e) {
    useMessage().error("删除失败");
  }
};

const addHotRec = async (item: ApplyInfo) => {
  popularRecommendationFrom.value.applyId = item.id;
  popularRecommendationFrom.value.applyName = item.applyName;
  state.isShowPopularRecommendation = true;
};

const changeStatus = async (item: ApplyInfo) => {
  console.log(item);

  try {
    await savecoApply({
      id: item.id,
      status: item.isEnable ? ApplyInfoStatus.offLine : ApplyInfoStatus.onLine,
    });
  } catch (error) {}
};

const savePopularRecommendationForm = async () => {
  state.isSaveLoading = true;
  try {
    const res = await addHotApp(popularRecommendationFrom.value);
    useMessage().success("添加成功");

    state.isShowPopularRecommendation = false;
    // pagination.current = 1;
    // loadData();
  } catch (error) {
    console.log(error);
  } finally {
    state.isSaveLoading = false;
  }
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
            <a-col class="gutter-row" :span="8">
              <a-input
                v-model:value="applySearch.name"
                placeholder="请输入应用名称"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-select v-model:value="applySearch.status" style="width: 100%">
                <a-select-option :value="null">所有状态</a-select-option>
                <a-select-option :value="0">正常</a-select-option>
                <a-select-option :value="1">停用</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-flex justify="flex-end" :gap="0">
            <a-button type="link" @click="resetSearch">重置筛选</a-button>
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
          <a-button
            @click="router.push({ path: '/appstore/manage/add' })"
            type="primary"
          >
            <PlusOutlined />创建应用
          </a-button>
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
            <template v-if="column.dataIndex === 'action'">
              <a-flex :gap="5">
                <a-button
                  size="small"
                  type="link"
                  @click="
                    router.push({
                      path: '/appStore/manage/edit',
                      query: { id: record.id },
                    })
                  "
                  >编辑</a-button
                >
                <a-button
                  size="small"
                  type="link"
                  @click="getAppInfoa(record.id)"
                  >应用详情</a-button
                >
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <MoreOutlined />
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a style="color: green" @click="addHotRec(record)">
                          <ArrowUpOutlined /> 添加至热门推荐
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a-popconfirm
                          title="确认删除当前应用吗？"
                          disabled
                          @confirm="(_:Event) => deleteApp(record.id)"
                        >
                          <template #icon
                            ><question-circle-outlined style="color: red"
                          /></template>
                          <a href="#" style="color: red"
                            ><DeleteOutlined /> 删除</a
                          >
                        </a-popconfirm>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-flex>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <VueToggles
                :value="record.isEnable"
                :height="20"
                :width="60"
                :checkedText="getappStatus(ApplyInfoStatus.onLine)"
                :uncheckedText="getappStatus(ApplyInfoStatus.offLine)"
                checkedBg="#b4d455"
                uncheckedBg="lightgrey"
                @click="changeStatus(record)"
              />
              <!-- <a-switch
                v-model:checked="record.status"
                @change="(_) => changeStatus(record)"
                checked-children="正常"
                un-checked-children="禁用"
                :checked-value="ApplyInfoStatus.onLine"
                :un-checked-value="ApplyInfoStatus.offLine"
              /> -->
            </template>

            <template v-if="column.dataIndex === 'applyName'">
              <a-flex :gap="5">
                <a-avatar
                  shape="square"
                  :src="record.applyLogo"
                  size="large"
                ></a-avatar>
                <a-flex :gap="0" vertical>
                  <a-typography-text strong>{{
                    record.applyName
                  }}</a-typography-text>
                  <a-typography-text type="secondary">{{
                    record.id
                  }}</a-typography-text>
                </a-flex>
              </a-flex>
            </template>
            <template v-if="column.dataIndex === 'company'">
              <span>{{ record.company.name }}</span>
            </template>
            <!-- <template
              v-if="column.dataIndex === 'status'"
              :value="applySearch.status"
            >
              <template v-if="record.status == 0">
                {{ getappStatus(appStatus.ONLINE) }}
              </template>
              <template v-else>
                {{ getappStatus(appStatus.CLOSE) }}
              </template>
            </template> -->
            <template v-if="column.dataIndex === 'category'">
              <span>---/---</span>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-flex>
    <a-modal
      v-model:open="state.isShowInfoModal"
      title="应用详情"
      centered
      :width="1000"
      :footer="null"
    >
      <a-descriptions :title="appInfo.applyName" bordered>
        <a-descriptions-item label="应用名称">{{
          appInfo.applyName
        }}</a-descriptions-item>
        <a-descriptions-item label="包名">{{
          appInfo.packetName
        }}</a-descriptions-item>
        <a-descriptions-item label="分类">{{
          appInfo.categoryId
        }}</a-descriptions-item>
        <a-descriptions-item label="文件名">{{
          appInfo.appFileName
        }}</a-descriptions-item>
        <a-descriptions-item label="应用大小">{{
          appInfo.applySizi
        }}</a-descriptions-item>
        <a-descriptions-item label="应用LGGO">
          <a-image :src="appInfo.applyLogo" width="45px"></a-image>
        </a-descriptions-item>
        <a-descriptions-item label="应用下载二维码" :span="3">
          <qrcode-vue :value="appInfo.applyDownloadLink" :size="60" level="H" />
        </a-descriptions-item>
        <a-descriptions-item label="下载链接" :span="3">
          {{ appInfo.applyDownloadLink }}
        </a-descriptions-item>
        <a-descriptions-item label="应用广告语" :span="3">
          {{ appInfo.applyRemark }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{
          appInfo.createTime
        }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{
          appInfo.updateTime
        }}</a-descriptions-item>
        <a-descriptions-item label="上传人员">{{
          appInfo.createBy
        }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <a-modal
      :width="400"
      v-model:open="state.isShowPopularRecommendation"
      centered
      :closable="false"
      destroy-on-close
      :footer="null"
      :title="null"
    >
      <a-flex vertical :gap="15">
        <a-typography-text strong>上推荐热门</a-typography-text>
        <div style="height: 300px; overflow-y: auto">
          <a-form layout="vertical">
            <a-flex :gap="10">
              <a-form-item name="name" label="排序">
                <a-radio-group
                  v-model:value="popularRecommendationFrom.popularType"
                  name="radioGroup"
                >
                  <a-radio :value="ApplicationPopularTypeEnum.newHot">{{
                    getApplicationPopularTypeText(
                      ApplicationPopularTypeEnum.newHot
                    )
                  }}</a-radio>
                  <a-radio :value="ApplicationPopularTypeEnum.todayRecommend">{{
                    getApplicationPopularTypeText(
                      ApplicationPopularTypeEnum.todayRecommend
                    )
                  }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-flex>
            <a-flex :gap="10">
              <a-form-item name="name" label="排序">
                <a-input
                  v-model:value="popularRecommendationFrom.sort"
                  placeholder="请输入排序号"
                  size="middle"
                  style="width: 320px"
                ></a-input>
              </a-form-item>
            </a-flex>
            <a-flex :gap="10">
              <a-form-item name="name" label="是否启用">
                <a-switch
                  v-model:checked="popularRecommendationFrom.status"
                  checked-children="开"
                  un-checked-children="关"
                />
              </a-form-item>
            </a-flex>
          </a-form>
        </div>
        <a-flex justify="flex-end" :gap="10">
          <a-button
            @click="state.isShowPopularRecommendation = false"
            style="width: 120px"
            >取消</a-button
          >
          <a-button
            :loading="state.isSaveLoading"
            style="width: 120px"
            @click="savePopularRecommendationForm"
            type="primary"
            >保存</a-button
          >
        </a-flex>
      </a-flex>
    </a-modal>
  </PageContainer>
</template>

<style scoped lang="less"></style>
