<template>
  <div class="h-100%">
    <ul v-if="pageType === 'view'" class="nav-ul p-4">
      <li class="nav-li li-item">
        <span>头像</span>
        <!--  @click="handleEdit('user_avatar')" -->
        <span class="flex-center">
          <el-avatar :size="36" :src="UserAvatar" class="mr-3" />
          <!-- <el-icon><ArrowRight /></el-icon> -->
        </span>
      </li>
      <li class="nav-li li-item">
        <span>昵称</span>
        <span class="flex-center" @click="handleEdit('user_name')"
          >{{ userInfo.user_name }} <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
    </ul>

    <!-- 修改昵称 -->
    <div
      v-if="pageType === 'user_name'"
      class="h-100% flex flex-col justify-evenly px-8"
    >
      <h3 class="text-center">设置昵称</h3>
      <div>
        <el-input
          v-model="newUserName"
          placeholder="请输入您的昵称"
          maxlength="30"
        ></el-input>
        <p>
          <el-text type="info">
            昵称可包含：大小写字母、中文字符、数字、特殊符号（如下划线 _、连字符
            -、点 . 等），最多30个字符。</el-text
          >
        </p>
      </div>

      <el-space class="w-full" fill :size="16">
        <el-button
          type="primary"
          size="large"
          :disabled="!newUserName"
          @click="handleSaveUserName"
          >保存</el-button
        >
        <el-button size="large" @click="handleCancelEdit">取消</el-button>
      </el-space>
    </div>


    <!-- 修改头像 -->
     <div
      v-if="pageType === 'user_avatar'"
      class="h-100% flex flex-col justify-evenly px-8"
    >
      <h3 class="text-center">修改头像</h3>
      <div>
        
        <el-upload
          class="avatar-uploader"
          action="/"
          :show-file-list="false"
          :auto-upload="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        
        <p class="mt-4">
          <el-text type="info">
            选择本地照片，上传编辑自己的头像，支持jpg、jpeg、gif、png格式的图片，文件最大不超过2MB</el-text
          >
        </p>
      </div>

      <el-space class="w-full" fill :size="16">
        <el-button
          type="primary"
          size="large"
          :disabled="!newUserName"
          @click="handleSaveUserName"
          >保存</el-button
        >
        <el-button size="large" @click="handleCancelEdit">取消</el-button>
      </el-space>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight, Plus } from "@element-plus/icons-vue";
import UserAvatar from "@/assets/images/user-avatar.png";
import { updateUserName } from "@/api/user";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/index";
import { toRefs, ref, defineProps } from "vue";

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {
        user_name: "",
      };
    },
  },
});
const { userInfo } = toRefs(props);

const userStore = useUserStore();
const pageType = ref("view");
// 昵称格式校验
const validateUserName = (input: string): boolean => {
  const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\.\-]{1,30}$/;
  return reg.test(input);
};
// 编辑
const newUserName = ref("");
const handleEdit = (key: string) => {
  newUserName.value = "";
  pageType.value = key;
};
// 确定编辑昵称->保存
const handleSaveUserName = () => {
  if (!validateUserName(newUserName.value)) {
    ElMessage.error("昵称格式不正确");
    return;
  }
  updateUserName({
    newusername: newUserName.value,
  })
    .then(async (res: any) => {
      pageType.value = "view";
      ElMessage.success("修改成功");
      // 重新获取用户信息
      await userStore.getUserInfoApi();
    })
    .catch((err: any) => {
      console.error(err);
    });
};
// 取消编辑
const handleCancelEdit = () => {
  pageType.value = "view";
};


/**
 * 修改头像
 */
const imageUrl = ref(UserAvatar);
const handleAvatarSuccess = (response, file, fileList) => {
  // 假设后端返回的图片URL在response.url中
  imageUrl.value = response.url;
  ElMessage.success('上传成功');
};
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
    return false;
  }
  return true;
};
</script>
<style lang="less" scoped>
.avatar-uploader{
  width: 86px;
  height: 86px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    .avatar-uploader-icon{
      display: block;
      background: #0000007a;
      border-radius: 50%;
    }
  }
}
.avatar-uploader-icon {
  display: none;
  font-size: 20px;
  color: #ffffff;
  width: 86px;
  height: 86px;
  line-height: 86px;
  text-align: center;
  position: absolute;
}
.avatar {
  width: 86px;
  height: 86px;
  display: block;
}
</style>
