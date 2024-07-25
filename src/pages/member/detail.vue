<script setup lang="ts">
import { createVNode } from "vue";
import {
  getMemberInfo,
  changeStatus,
  recycleAgent,
  getMemberWalletRecord,
  getMemberDeviceList,
  getMemberDeviceApps,
  upgradeAgent,
  teamCommissionRates,
  UserInfo,
  WalletTypeEnum,
  getWalletTypeEnumText,
  MemberWalletRecordSearchParams,
  MemberWalletItem,
  getBizTypeEnum,
  getAppInfoWalletList,
  AppInfoWalletRequest,
  AppInfoWallet,
  BizTypeEnumOptItem,
} from "~@/api/member";
import { PaginationProps, Modal } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
const route = useRoute();
const router = useRouter();
const userInfo = ref<UserInfo>({});
const tableData = ref([]);
const dataSource = ref<MemberWalletItem[]>([]);
const bizTypeOpts = ref<BizTypeEnumOptItem[]>([]);
const appInfoWalletList = ref<AppInfoWallet[]>([]);

const columns: ColumnsType = [
  {
    title: "所属应用",
    dataIndex: "applicationName",
    // width:'200px',
    fixed: "left",
  },
  {
    title: "用户Id",
    dataIndex: "userId",
  },
  {
    title: "用户昵称",
    dataIndex: "nickName",
  },
  {
    title: "用户手机号  ",
    dataIndex: "phone",
  },
  {
    title: "资金类型  ",
    dataIndex: "walletType",
  },

  {
    title: "奖励说明",
    dataIndex: "remark",
  },
  {
    title: "交易之前金额",
    dataIndex: "beforeAmount",
  },
  {
    title: "资金方向  ",
    dataIndex: "direction",
  },
  {
    title: "交易之后金额",
    dataIndex: "afterAmount",
  },
];

const columnsTableData: ColumnsType = [
  {
    title: "手机系统",
    dataIndex: "clientPlatform",
    fixed: "left",
  },
  {
    title: "设备厂商",
    dataIndex: "deviceManufacturer",
  },
  {
    title: "设备品牌",
    dataIndex: "deviceBrand",
  },
  {
    title: "设备型号",
    dataIndex: "deviceModel",
  },
  {
    title: "设备名",
    dataIndex: "deviceName",
  },
  {
    title: "设备号",
    dataIndex: "deviceCode",
  },
  {
    title: "aaId",
    dataIndex: "aaId",
  },
  {
    title: "oaId",
    dataIndex: "oaId",
  },
  {
    title: "vaId",
    dataIndex: "vaId",
  },
  {
    title: "是否Root权限",
    dataIndex: "adAmount",
  },
  {
    title: "是否虚拟环境",
    dataIndex: "isVirtual",
  },
  {
    title: "是否模拟器",
    dataIndex: "isEmulator",
  },
  {
    title: "当前登录设备",
    dataIndex: "isActivation",
  },
];

const deviceListColumns: ColumnsType = [
  {
    title: "是否为黑名单",
    dataIndex: "isBlacklist",
  },
  {
    title: "APP名称",
    dataIndex: "name",
  },
  {
    title: "APP包名",
    dataIndex: "packageName",
  },
  {
    title: "版本名称",
    dataIndex: "versionName",
  },
  {
    title: "版本号",
    dataIndex: "versionCode",
  },
  {
    title: "首次下载时间",
    dataIndex: "firstInstallTime",
  },
  {
    title: "最新更新时间",
    dataIndex: "lastUpdateTime",
  },
];

const form = ref<{
  visible: boolean;
  isEdit: boolean;
  rates: string | number;
}>({
  visible: false,
  isEdit: false,
  rates: "",
});

const walletRecordstate = reactive<{
  tableLoad: boolean;
}>({
  tableLoad: false,
});
const walletRecordPagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30", "50"],
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `总数据位：${total}`,
  onChange(current, pageSize) {
    walletRecordPagination.pageSize = pageSize;
    walletRecordPagination.current = current;
    fetchMemberWalletRecord();
  },
});

const memberWalletRecordSearchParams = ref<MemberWalletRecordSearchParams>({
  userId: `${route.query.id}`,
  walletType: WalletTypeEnum.cash,
  page: 1,
  limit: 10,
  date: [],
});

const getDetail = async () => {
  try {
    const res = await getMemberInfo(route.query.id);
    userInfo.value = res.data;
    userInfo.value.isEnable = res.data.status == 1;
  } catch (error) {
    console.log(error);
  }
};

// 获取用户设备信息
const fetchMemberDeviceList = async () => {
  try {
    const res = await getMemberDeviceList({ userId: route.query.id });
    tableData.value = res.data;
  } catch (error) {
    console.log(error);
  }
};

// 更改禁用状态
const changeDisabledStatus = async () => {
  changeMemberStatus({
    type: 1,
  });
};

// 是否提现额度自由
const changeUnlimitedWithdrawAmount = async () => {
  changeMemberStatus({
    type: 5,
  });
};
// 是否允许提现
const changeIsAllowWithdraw = async () => {
  changeMemberStatus({
    type: 4,
  });
};
// 读取状态 发送请求
const changeMemberStatus = async (params) => {
  params = Object.assign(params, { userId: route.query.id });
  try {
    const res = await changeStatus(params);
    console.log(res);

    useMessage().success("操作成功");
    getDetail();
  } catch {}
};

// 回收代理权限
const handleResetAgent = async () => {
  try {
    const res = await recycleAgent({ userId: `${route.query.id}` });
    useMessage().success("操作成功");
    getDetail();
  } catch {}
};

const handleSetRate = async () => {
  form.value.isEdit = true;
  form.value.rates = userInfo.value.teamCommissionRates * 100;
  form.value.visible = true;
};

const changeMemberWalletType = async () => {
  memberWalletRecordSearchParams.value.page = 1;
  fetchAppInfoWalletList();
  fetchMemberWalletRecord();
};

const handleWalletSearch = async () => {
  memberWalletRecordSearchParams.value.page = 1;
  fetchMemberWalletRecord();
};

const fetchMemberWalletRecord = async () => {
  try {
    walletRecordstate.tableLoad = true;
    const params = JSON.parse(
      JSON.stringify(memberWalletRecordSearchParams.value)
    );
    if (params.date) {
      params["dateRange.startTime"] = params.date[0];
      params["dateRange.endTime"] = params.date[1];
    }
    params.page = walletRecordPagination.current;
    params.limit = walletRecordPagination.pageSize;
    const res = await getMemberWalletRecord(params);
    dataSource.value = res.data.rows;
    walletRecordPagination.total = res.data.total;
  } catch (error) {
    console.log(error);
  } finally {
    walletRecordstate.tableLoad = false;
  }
};

const deviceAppDialog = ref<{
  show: boolean;
  data: any;
}>({
  show: false,
  data: [],
});
// 获取手机应用列表
const handleShowDeviceApp = async (deviceCode) => {
  try {
    deviceAppDialog.value.show = true;
    const res = await getMemberDeviceApps({
      deviceCode,
      userId: route.query.id,
    });

    deviceAppDialog.value.data = res.data;
    console.log("deviceAppDialog", deviceAppDialog.value);
  } catch (error) {
    console.log(error);
  }
};
// 获取类型枚举
const getBizTypeEnumList = async () => {
  let res = await getBizTypeEnum();
  bizTypeOpts.value = res.data;
};

const fetchAppInfoWalletList = async () => {
  let params: AppInfoWalletRequest = {
    userId: `${route.query.id}`,
    type: memberWalletRecordSearchParams.value.walletType,
  };
  let res = await getAppInfoWalletList(params);
  appInfoWalletList.value = res.data;
};

const handleSetAgent = () => {
  form.value.isEdit = false;
  form.value.visible = true;
};

const handleDelAgemtRole = () => {
  Modal.confirm({
    title: "温馨提示",
    content: createVNode(
      "div",
      { style: "color:red;font-size: 16px;" },
      "确认回收当前代理权限吗？"
    ),
    onOk() {
      handleResetAgent();
    },
    onCancel() {},
    class: "test",
  });
};

const formConfirm = async () => {
  if (form.value.rates == "") {
    return useMessage().warning("佣金比例不能为空");
  }
  const formData = JSON.parse(
    JSON.stringify(Object.assign(form.value, { userId: route.query.id }))
  );
  try {
    formData.rates = formData.rates / 100;
    const res = !form.value.isEdit
      ? await upgradeAgent(formData)
      : await teamCommissionRates(formData);
    useMessage().success("操作成功");
    form.value.visible = false;
    getDetail();
  } catch {}
};
const toDetail = () => {
  router.push({
    path: "/member/detail",
    query: {
      id: userInfo.value.shareBy.id,
    },
  });
};

onMounted(() => {
  getDetail();
  fetchMemberDeviceList();
  fetchMemberWalletRecord();
  getBizTypeEnumList();
  fetchAppInfoWalletList();
});
</script>
<template>
  <PageContainer>
    <a-card class="mb-4">
      <a-flex>
        <a
          @click="router.back()"
          style="font-size: 16px; font-weight: 600; color: #333"
        >
          <ArrowLeftOutlined class="mr-1" /> 返回
        </a>
      </a-flex>
    </a-card>
    <div
      class="llsd-t1"
      style="margin-top: 20px; font-size: 16px; font-weight: 600; color: #333"
    >
      基本信息
    </div>
    <a-card>
      <a-row justify="space-around" class="header">
        <a-col v-if="userInfo.shareBy" :span="3">
          <view class="col">
            <view class="title">邀请人信息</view>
            <view
              class="val"
              style="
                display: flex;
                justify-content: space-around;
                align-items: center;
              "
            >
              <img
                v-if="userInfo.shareBy.avatar"
                :src="userInfo.shareBy.avatar"
                style="width: 34px; height: 34px; margin-right: 5px"
              />
              <div class="right">
                <div style="line-height: 1">
                  <a-button
                    type="link"
                    @click="toDetail"
                    style="padding: 0; height: auto"
                  >
                    {{ userInfo.shareBy.id }}
                  </a-button>
                </div>
                <div style="line-height: 1; margin-top: -3px">
                  {{ userInfo.shareBy.nickName }}
                </div>
                <div style="line-height: 1; padding-top: 3px">
                  {{ userInfo.shareBy.phone }}
                </div>
              </div>
            </view>
          </view>
        </a-col>
        <a-col :span="3">
          <view class="col">
            <view class="title">用户头像</view>
            <view class="val">
              <img
                v-if="userInfo.avatar"
                :src="userInfo.avatar"
                style="width: 34px; height: 34px; margin-right: 5px"
              />
            </view>
          </view>
        </a-col>
        <a-col :span="6">
          <view class="col">
            <view class="title">积分余额</view>
            <view class="val">
              <span class="red"
                >￥{{ userInfo.pointsAmount }} （{{
                  userInfo.pointsExchangeAmount
                }}）</span
              >
            </view>
          </view>
        </a-col>
        <a-col :span="6">
          <view class="col">
            <view class="title">红包余额</view>
            <view class="val">
              <span class="red"
                >￥{{ userInfo.cashAmount }} （{{
                  userInfo.cashExchangeAmount
                }}）</span
              >
            </view>
          </view>
        </a-col>
        <a-col :span="6">
          <view class="col">
            <view class="title">佣金余额</view>
            <view class="val">
              <span class="red"
                >￥{{ userInfo.commissionAmount }} （{{
                  userInfo.commissionExchangeAmount
                }}）</span
              >
              <!-- <a-button type="primary" text @click="handleSetAmount(2)"
                >调整</a-button
              > -->
            </view>
          </view>
        </a-col>
      </a-row>
      <a-row class="content" style="padding-top: 30px">
        <a-form status-icon label-width="auto">
          <a-row>
            <a-col class="items" :span="6">
              <a-form-item label="用户编号: ">
                {{ userInfo.id }}
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="用户昵称: ">
                {{ userInfo.nickName }}
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="用户账号: ">
                {{ userInfo.phone }}
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="注册时间: ">
                {{ userInfo.registerTime }}
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="用户状态: ">
                <a-switch
                  v-model:checked="userInfo.isEnable"
                  inline-prompt
                  active-text="启用"
                  inactive-text="禁用"
                  @change="changeDisabledStatus"
                />
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="是否允许提现: ">
                <a-switch
                  v-model:checked="userInfo.isAllowWithdraw"
                  inline-prompt
                  active-text="启用"
                  inactive-text="禁用"
                  @change="changeIsAllowWithdraw"
                />
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="是否提现额度自由: ">
                <a-switch
                  v-model:checked="userInfo.isUnlimitedWithdrawAmount"
                  inline-prompt
                  active-text="启用"
                  inactive-text="禁用"
                  @change="changeUnlimitedWithdrawAmount"
                />
              </a-form-item>
            </a-col>
            <a-col class="items" :span="6">
              <a-form-item label="是否为代理: ">
                <a-tag v-if="userInfo.isAgent" color="#2db7f5">代理</a-tag>
                <a-typography-text v-else>代非理</a-typography-text>
                <a-button
                  v-if="!userInfo.isAgent"
                  type="primary"
                  text
                  bg
                  @click="handleSetAgent"
                >
                  升级为代理
                </a-button>
                <a-button v-else type="link" @click="handleDelAgemtRole">
                  回收代理权限
                </a-button>
              </a-form-item>
            </a-col>

            <a-col v-if="userInfo.isAgent" class="items" :span="6">
              <a-form-item label="代理团队佣金比率: ">
                <span style="margin-right: 20px"
                  >{{ userInfo.teamCommissionRates * 100 }}%</span
                >
                <a-button type="link" text bg @click="handleSetRate"
                  >修改代理团队佣金比率</a-button
                >
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-row>
    </a-card>
    <!-- 用户钱包流水 start -->
    <div
      class="llsd-t1"
      style="margin-top: 20px; font-size: 16px; font-weight: 600; color: #333"
    >
      用户钱包流水
    </div>
    <a-card shadow="never">
      <div class="content">
        <div style="margin-bottom: 20px"></div>
        <div style="margin-bottom: 20px">
          <a-radio-group
            v-model:value="memberWalletRecordSearchParams.walletType"
            button-style="solid"
            @change="changeMemberWalletType"
          >
            <a-radio-button :value="WalletTypeEnum.integral">{{
              getWalletTypeEnumText(WalletTypeEnum.integral)
            }}</a-radio-button>
            <a-radio-button :value="WalletTypeEnum.cash">{{
              getWalletTypeEnumText(WalletTypeEnum.cash)
            }}</a-radio-button>
            <a-radio-button :value="WalletTypeEnum.commission">{{
              getWalletTypeEnumText(WalletTypeEnum.commission)
            }}</a-radio-button>
          </a-radio-group>

          <a-select
            v-model:value="memberWalletRecordSearchParams.appId"
            placeholder="查看指定钱包"
            style="width: 240px"
            allowClear
          >
            <a-select-option
              v-for="(i, index) in appInfoWalletList"
              :key="i.id"
              :value="i.id"
              >{{ i.name }}({{ i.amount }})</a-select-option
            >
          </a-select>

          <a-select
            v-model:value="memberWalletRecordSearchParams.bizType"
            placeholder="请选择业务类型"
            :options="bizTypeOpts"
            style="width: 160px"
            allowClear
            :field-names="{ label: 'label', value: 'value' }"
          ></a-select>
          <a-range-picker
            v-model:value="memberWalletRecordSearchParams.date"
            valueFormat="YYYY-MM-DD"
            style="margin-left: 20px"
            allowClear
          />
          <a-button
            style="margin-left: 10px"
            type="primary"
            @click="handleWalletSearch"
            >搜索</a-button
          >
        </div>
        <a-table
          :data-source="dataSource"
          :columns="columns"
          :loading="walletRecordstate.tableLoad"
          :pagination="walletRecordPagination"
          style="width: 100%"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'beforeAmount'">
              <div style="font-weight: bold; color: red">
                {{ record.beforeAmount }}({{ record.exchangeBeforeAmount }})
              </div>
            </template>
            <template v-if="column.dataIndex === 'afterAmount'">
              <div style="font-weight: bold; color: red">
                {{ record.afterAmount }}({{ record.exchangeAfterAmount }})
              </div>
            </template>
            <template v-if="column.dataIndex === 'walletType'">
              <div style="font-weight: bold">
                {{ getWalletTypeEnumText(record.walletType) }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'direction'">
              {{ record.direction }} {{ record.amount }} ({{
                record.exchangeAmount
              }})
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
    <!-- 用户钱吧流水 end -->

    <!-- 登录的设备 start -->
    <div
      class="llsd-t1"
      style="margin-top: 20px; font-size: 16px; font-weight: 600; color: #333"
    >
      用户登录设备记录
    </div>
    <a-card>
      <div class="content">
        <a-table
          :scroll="{ x: 'max-content' }"
          :columns="columnsTableData"
          :data-source="tableData"
          size="middle"
          :pagination="false"
          :bordered="false"
        >
          <template #bodyCell="{ column, record }">
            <template
              v-if="column.dataIndex === 'deviceCode'"
              :value="tableData.deviceCode"
            >
              {{ record.deviceCode }}
              <a-button
                type="link"
                @click="handleShowDeviceApp(record.deviceCode)"
                >查看设备APP</a-button
              >
            </template>
            <template
              v-if="column.dataIndex === 'adAmount'"
              :value="tableData.isRoot"
            >
              {{ record.isRoot ? "是" : "否" }}
            </template>
            <template
              v-if="column.dataIndex === 'isVirtual'"
              :value="tableData.isVirtual"
            >
              {{ record.isVirtual ? "是" : "否" }}
            </template>
            <template
              v-if="column.dataIndex === 'isEmulator'"
              :value="tableData.isEmulator"
            >
              {{ record.isEmulator ? "是" : "否" }}
            </template>
            <template
              v-if="column.dataIndex === 'isActivation'"
              :value="tableData.isActivation"
            >
              {{ record.isActivation ? "是" : "否" }}
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
    <!-- 登录的设备 end -->

    <a-modal
      :width="400"
      v-model:open="form.visible"
      centered
      :closable="false"
      destroy-on-close
      :footer="null"
      :title="!form.isEdit ? '升级为代理' : '修改比例'"
    >
      <a-flex vertical :gap="15">
        <div style="overflow-y: auto">
          <a-form label-position="right" label-width="180px">
            <a-form-item label="佣金比例">
              <a-input v-model:value="form.rates" style="width: 120px" />
              %
            </a-form-item>
          </a-form>
        </div>
        <a-flex justify="flex-end" :gap="10">
          <a-button @click="form.visible = false">取 消</a-button>
          <a-button
            :disabled="String(form.rates).trim() == ''"
            type="primary"
            @click="formConfirm"
            >确认</a-button
          >
        </a-flex>
      </a-flex>
    </a-modal>

    <!-- 查看设备中的app -->
    <a-modal
      v-model:open="deviceAppDialog.show"
      :title="`安装的APP，共${deviceAppDialog.data.length}个`"
      :width="1000"
      :footer="null"
      style="height: 600px"
      @ok="
        () => {
          deviceAppDialog.show = false;
        }
      "
    >
      <a-table
        :data-source="deviceAppDialog.data"
        :columns="deviceListColumns"
        :pagination="false"
        :scroll="{ y: 500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'isBlacklist'">
            <a-tag v-if="record.isBlacklist" color="red">黑名单</a-tag>
            <a-typography-text v-else>-</a-typography-text>
          </template>
        </template>
      </a-table>
    </a-modal>
  </PageContainer>
</template>

<style lang="less" scoped>
.header {
  width: 100%;
  padding: 20px 60px;
  display: flex;
  justify-content: space-around;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 15px;

  .col {
    display: flex;
    flex-direction: column;
    align-items: center;

    .red {
      font-weight: bold;
      color: red;
    }

    .val {
      padding-top: 10px;
    }
  }
}
.items {
  height: 50px;
}

.list-wrap {
  .table {
    width: 100%;
  }
}
</style>
