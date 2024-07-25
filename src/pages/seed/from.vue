<script setup lang="ts">
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons-vue";
const message = useMessage();

// 添加使用 seed的数据接口
import {
  getSeedInfo,
  ContentTypeEnum,
  PostTypeEnum,
  ZhongCaoStatusEnum,
  seedInfo,
  saveSeedArticle,
} from "~/api/seed/seed.ts";

const router = useRouter();
const route = useRoute();

const initFrom = (): Partial<seedInfo> => {
  return {
    title: "",
    picture: "",
    content: "",
    videoUrl: "",
    h5Url: "",
    // contentType: ContentTypeEnum.video,
    // postType: PostTypeEnum.zczq,
    // status: ZhongCaoStatusEnum.open,
  };
};

const form = ref<Partial<seedInfo>>(initFrom());

const ruleFormRef = ref();
const editorRef = ref();
const valueHtml = ref("<p></p>");

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };
const mode = "single";

const getDetail = async () => {
  try {
    const res = await getSeedInfo(form.value.id);
    form.value = res.data;
    valueHtml.value = form.value.content;
  } catch {}
};

if (route.query.id) {
  form.value.id = Number(route.query.id);
  getDetail();
}
const state = reactive({
  isLoad: false,
});
const handleCreated = (editor) => {
  debugger;
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  form.value.content = editor.getHtml();
  console.log("form.value.content", form.value.content);
  // console.log('change:', editor.getHtml());
};

const onSubmit = () => {
  ruleFormRef.value
    ?.validate()
    .then(() => {
      submitForm();
    })
    .catch((error) => {
      message.warning("请完善信息再提交");
    });
};

const submitForm = () => {
  try {
    let result = saveSeedArticle(form.value);
    message.success("操作成功");
    router.back();
    // form.value = initFrom();
  } catch (error) {}
};

onMounted(() => {});
</script>

<template>
  <a-flex justify="center">
    <div style="width: 800px">
      <a-card class="mb-4">
        <a-flex>
          <a
            @click="router.back()"
            style="font-size: 16px; font-weight: 600; color: #333"
            ><ArrowLeftOutlined class="mr-1" /> 返回</a
          >
        </a-flex>
      </a-card>
      <a-spin :spinning="state.isLoad">
        <a-form ref="ruleFormRef" layout="vertical" :model="form">
          <!--基础信息Start-->
          <a-card>
            <a-typography-text strong>创建新文章</a-typography-text>
            <a-form-item
              label="标题"
              name="title"
              class="mt-5"
              :rules="[{ required: true, message: '请输入文章标题!' }]"
            >
              <a-flex style="flex: 1" vertical>
                <a-input
                  v-model:value="form.title"
                  type="text"
                  :maxlength="24"
                  style="width: 380px"
                  clearable
                />
              </a-flex>
            </a-form-item>
            <a-form-item
              label="状态"
              name="status"
              class="mt-5"
              :rules="[{ required: true, message: '请选择状态' }]"
            >
              <a-radio-group v-model:value="form.status">
                >
                <a-radio :value="ZhongCaoStatusEnum.open">显示</a-radio>
                <a-radio :value="ZhongCaoStatusEnum.close">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="文章类型"
              name="postType"
              class="mt-5"
              :rules="[{ required: true, message: '请选择文章类型' }]"
            >
              <a-radio-group v-model:value="form.postType">
                <a-radio :value="PostTypeEnum.xrbk">新人必看</a-radio>
                <a-radio :value="PostTypeEnum.zczq">种草赚钱</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="文章主图"
              class="mt-5"
              name="picture"
              :rules="[
                {
                  required: true,
                  message: '请上传文章列表主图',
                  trigger: 'change',
                },
              ]"
            >
              <a-flex style="flex: 1" vertical>
                <ImageUpload
                  v-model:value="form.picture"
                  :show-upload-list="true"
                >
                  <a-button>
                    <UploadOutlined />
                    upload
                  </a-button>
                </ImageUpload>
                <a-typography-text type="secondary"
                  >文章主图，手动上传最大支持1024*1024、1M以内的1:1的jpg/png格式文件</a-typography-text
                >
              </a-flex>
            </a-form-item>
            <a-form-item
              label="内容类型"
              name="contentType"
              :rules="[{ required: true, message: '请选择内容类型' }]"
            >
              <a-flex>
                <a-radio-group v-model:value="form.contentType">
                  <a-radio :value="ContentTypeEnum.textarea">富文本</a-radio>
                  <a-radio :value="ContentTypeEnum.video">视频</a-radio>
                  <a-radio :value="ContentTypeEnum.H5">H5链接</a-radio>
                </a-radio-group>
              </a-flex>
            </a-form-item>
            <a-form-item
              v-if="form.contentType == ContentTypeEnum.H5"
              label="H5链接："
              name="h5Url"
              :rules="[
                {
                  required: true,
                  message: '请输入文章H5详情链接',
                  trigger: 'change',
                },
              ]"
            >
              <a-flex>
                <a-input
                  v-model:value="form.h5Url"
                  type="text"
                  style="width: 880px"
                  clearable
                  autocomplete="off"
                />
              </a-flex>
            </a-form-item>
            <a-form-item
              v-if="form.contentType == ContentTypeEnum.video"
              label="视频链接："
              name="videoUrl"
              :rules="[
                {
                  required: true,
                  message: '请输入视频链接',
                  trigger: 'change',
                },
              ]"
            >
              <a-flex>
                <a-input
                  v-model:value="form.videoUrl"
                  type="text"
                  :max="50"
                  style="width: 880px"
                  show-word-limit
                  clearable
                  autocomplete="off"
                />
              </a-flex>
            </a-form-item>
          </a-card>
          <div
            v-if="form.contentType == ContentTypeEnum.textarea"
            class="llsd-t1"
            style="margin-top: 20px"
          >
            编辑文章详情
          </div>
          <a-card
            v-if="form.contentType == ContentTypeEnum.textarea"
            class="detail"
            shadow="never"
          >
            <Toolbar
              :editor="editorRef"
              :default-config="toolbarConfig"
              :mode="mode"
              style="border-bottom: 1px solid #ccc"
            />
            <Editor
              v-model:value="valueHtml"
              :default-config="editorConfig"
              :mode="mode"
              style="height: 400px; overflow-y: hidden"
              @onCreated="handleCreated"
              @onChange="handleChange"
            />
          </a-card>
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
