<script setup lang="ts">
import {
  ArrowLeftOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import {
  savecoApply,
  getApplyInfo,
  ApplyFrom,
  getcoApplyCategoryList,
} from "~/api/appStore.ts";
import { CascaderProps } from "ant-design-vue";
const router = useRouter();
const message = useMessage();
const formRef = ref();
const categoryOptions = shallowRef<CascaderProps["options"]>([]);
const applyForm = reactive<ApplyFrom>(<ApplyFrom>{});
const state = reactive({
  isLoad: false,
});

const doSave = async () => {
  await savecoApply(applyForm);
  message.success("操作成功");
  router.back();
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log(applyForm);
      doSave();
    })
    .catch((error: void) => {
      console.log("error", error);
    });
};
const loadInfo = async (id: number) => {
  state.isLoad = true;
  const res = await getApplyInfo(id);
  Object.assign(applyForm, res.data ?? {});
  applyForm.id = res.data.id;
  state.isLoad = false;
};

//获取分类内容
const loadCategory = async () => {
  const res = await getcoApplyCategoryList();
  categoryOptions.value = res.data ?? [];
  console.log("loadCategory", categoryOptions.value);
};
onMounted(() => {
  let id = router.currentRoute?.value?.query["id"]?.toString() ?? "";
  if (id) {
    loadInfo(Number.parseInt(id));
  }
  loadCategory();
});
</script>

<template>
  <a-flex justify="center" align="center">
    <div style="width: 800px">
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
      <a-spin :spinning="state.isLoad">
        <a-form ref="formRef" layout="vertical" :model="applyForm">
          <!--基础信息Start-->
          <a-card>
            <a-typography-text strong>1.基础信息</a-typography-text>

            <a-form-item
              label="应用分类"
              name="categoryId"
              class="mt-5"
              :rules="[
                { required: true, message: '请选择应用分类', trigger: 'blur' },
              ]"
            >
              <a-flex style="flex: 1" vertical>
                <a-select
                  v-model:value="applyForm.categoryId"
                  placeholder="请输入应用分类"
                  :options="categoryOptions"
                  :field-names="{ label: 'categoryName', value: 'id' }"
                ></a-select>
                <!-- <a-cascader
                  v-model:value="applyForm.categoryId"
                  placeholder="请输入应用分类"
                  :options="categoryOptions"
                  :field-names="{ label: 'categoryName', value: 'id' }"
                /> -->
              </a-flex>
            </a-form-item>
            <a-form-item
              label="应用名称"
              name="applyName"
              class="mt-5"
              :rules="[
                { required: true, message: '请输入应用名称', trigger: 'blur' },
              ]"
            >
              <a-flex align="right" :gap="10">
                <a-flex style="flex: 1" vertical>
                  <a-input
                    :disabled="applyForm.id != null"
                    v-model:value="applyForm.applyName"
                    placeholder="请输入应用名称"
                  ></a-input>
                </a-flex>
              </a-flex>
            </a-form-item>
            <a-form-item
              label="应用备注说明"
              name="applyRemark"
              class="mt-5"
              :rules="[
                {
                  required: false,
                  message: '请输入应用备注说明',
                  trigger: 'blur',
                },
              ]"
            >
              <a-flex :gap="10">
                <a-flex style="flex: 1" vertical>
                  <a-input
                    v-model:value="applyForm.applyRemark"
                    placeholder="请输入应用备注说明"
                  ></a-input>
                </a-flex>
              </a-flex>
            </a-form-item>
            <!-- <a-form-item label="应用图标" class="mt-5" name="icon">
              <a-flex style="flex: 1" vertical>
                <SingFileUpload v-model:value="applyForm.applyLogo" :show-upload-list="true">
                  <a-button>
                    <UploadOutlined />
                    upload
                  </a-button>
                </SingFileUpload>
                <a-typography-text type="secondary">应用图标，手动上传最大支持1024*1024、1M以内的1:1的jpg/png格式文件</a-typography-text>
              </a-flex>
            </a-form-item> -->
            <!-- 上传应用 --组件封装？ -->
            <!-- <a-form-item label="上传应用" class="mt-5" :rules="[{ required: true, message: '请上传应用apk' }]">
              <a-upload-dragger name="file"> -->
            <!-- v-model:fileList="fileList"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    @change="handleChange"
                    @drop="handleDrop" -->
            <!-- <p class="ant-upload-drag-icon">
                  <inbox-outlined></inbox-outlined>
                </p>
                <p class="ant-upload-text">点击 或 拖入文件上传的文件</p>
              </a-upload-dragger>
            </a-form-item> -->
          </a-card>
          <!--基础信息End-->
          <a-card class="mt-5">
            <a-flex justify="flex-end">
              <a-space>
                <a-button @click="router.back()" style="width: 100px"
                  >取消</a-button
                >
                <a-button @click="onSubmit" style="width: 100px" type="primary"
                  >保存</a-button
                >
              </a-space>
            </a-flex>
          </a-card>
        </a-form>
      </a-spin>
    </div>
  </a-flex>
</template>

<style scoped lang="less">
.avatar-uploader > .ant-upload {
  width: 80px;
  height: 80px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  color: #666;
}
</style>
