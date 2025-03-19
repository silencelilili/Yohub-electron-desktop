<template>
  <div class="p-4">
    <ul class="list-ul">
      <!-- <li class="list-li">
        <span class="list-li_label">YoHubID</span>
        <span class="list-li_value">{{ userInfo.id }}</span>
      </li> -->
      <li class="list-li">
        <span class="list-li_label">YoHub密码</span>
        <span class="list-li_value" @click="handleUpdatePassword"
          >更改密码 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
      <li class="list-li">
        <span class="list-li_label">绑定邮箱</span>
        <span class="list-li_value"
          >
          <span v-if="!!userInfo.email" @click="handleUpdateEmail('edit')">{{ userInfo.email }}</span>
          <span v-else @click="handleUpdateEmail('add')">立即绑定</span>
           <el-icon><ArrowRight /></el-icon>
         </span>
      </li>
      <!-- TODO:绑定手机 - 待完善 -->
      <li v-if="false" class="list-li">
        <span class="list-li_label">绑定手机</span>
        <span class="list-li_value" @click="handleUpdatePhone"
          >去绑定 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
    </ul>
    <!-- TODO:绑定第三方账号 - 待完善 -->
    <template v-if="false">
      <div class="my-4 theme-color">绑定第三方账号</div>
      <ul class="list-ul">
        <li class="list-li">
          <span class="list-li_label">Google</span>
          <span class="list-li_value" @click="handleBindIm"
            >去绑定 <el-icon><ArrowRight /></el-icon
          ></span>
        </li>
        <li class="list-li">
          <span class="list-li_label">Apple ID</span>
          <span class="list-li_value"
            >去绑定 <el-icon><ArrowRight /></el-icon
          ></span>
        </li>
        <li class="list-li">
          <span class="list-li_label">微信</span>
          <span class="list-li_value"
            >去绑定 <el-icon><ArrowRight /></el-icon
          ></span>
        </li>
        <li class="list-li">
          <span class="list-li_label">QQ</span>
          <span class="list-li_value"
            >去绑定 <el-icon><ArrowRight /></el-icon
          ></span>
        </li>
      </ul>
    </template>


    <!-- 绑定手机号 dialog -->
    <el-dialog v-model="phoneDialogVisible" title="绑定手机号" width="460" center align-center>
      <el-form :model="phoneForm" class="p-5">
        <el-form-item prop="phone">
          <el-input
            v-model="phoneForm.phone"
            minlength="11"
            maxlength="11"
            autocomplete="off"
            placeholder="请输入手机号"
          >
            <template #prepend>
              <el-select v-model="phonePrepend" placeholder="Select" style="width: 86px">
                <el-option label="+86" value="+86" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <CountdownCode :value="phoneForm.phone" :sceneType="2">
            <template #input="{ countdown }">
              <el-input v-model="phoneForm.code" maxlength="6"  placeholder="请输入验证码"></el-input>
            </template>
          </CountdownCode>
          <!-- <div class="flex w-100%">
            <el-input v-model="phoneForm.code" class="flex-1 mr-2" maxlength="6" autocomplete="off" placeholder="请输入验证码" />
            <el-button>发送验证码</el-button>
          </div> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="phoneDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePhoneConfirm"> 绑定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 绑定邮箱 dialog -->
    <el-dialog v-model="emailDialogVisible" :title="emailDialogTitle" width="460" center align-center>
      <el-form :model="emailForm" class="p-5">
        <el-form-item>
          <el-input v-model="emailForm.email" autocomplete="off" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item>
          <CountdownCode :value="emailForm.email" :sceneType="2">
            <template #input>
              <el-input v-model="emailForm.code" maxlength="6" placeholder="请输入验证码"></el-input>
            </template>
          </CountdownCode>
          <!-- <div class="flex w-100%">
            <el-input v-model="emailForm.code" class="flex-1 mr-2" maxlength="6" autocomplete="off" placeholder="请输入验证码" />
            <el-button>发送验证码</el-button>
          </div> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="emailDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateEmailConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改密码 dialog -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="460" center align-center>
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" class="p-5">
        <el-form-item prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            minlength="8"
            autocomplete="off"
            placeholder="请输入旧密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="new_password">
          <el-input
            v-model="passwordForm.new_password"
            type="password"
            minlength="8"
            autocomplete="off"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirm_new_password">
          <el-input
            v-model="passwordForm.confirm_new_password"
            type="password"
            minlength="8"
            autocomplete="off"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
        <p>
          *<span class="color-#999999">
            密码必须为8-16位，包含大小写字母、数字或特殊字符至少3种类型字符的组合，请勿使用旧密码。</span
          >
        </p>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePasswordConfirm"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 绑定第三方账号 dialog -->
    <el-dialog v-model="bindImDialogVisible" title="绑定第三方账号" width="460" :footer="false" center align-center>
      <div>绑定第三方账号</div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { updatePassword, updateEmail } from "@/api/user";
import { useUserStore } from "@/stores/index";
import { ArrowRight } from "@element-plus/icons-vue";
import { validatePassword } from '@/utils/validate'
import CountdownCode from "@/components/CountdownCode.vue";

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {
        id: "",
        email: "",
      };
    },
  },
});
const { userInfo } = toRefs(props);
const router = useRouter()
const userStore = useUserStore();

/**
 * TODO:修改手机号
 */
const phoneDialogVisible = ref(false);
const phoneForm = reactive({
  phone: '',
  code: '',
});
const phonePrepend = ref('+86');
const handleUpdatePhone = () => {
  phoneDialogVisible.value = true;
};
const updatePhoneConfirm = async () => {
  phoneDialogVisible.value = false;
};

/**
 * TODO:修改邮箱接口
 */
const emailDialogVisible = ref(false);
const emailDialogTitle = ref('')
const emailForm = reactive({
  email: '',
  code: '',
});
const handleUpdateEmail = (type: string) => {
  emailDialogTitle.value = type === 'add' ? '绑定邮箱' : '修改邮箱';
  emailDialogVisible.value = true;
};
const updateEmailConfirm = async () => {
  try {
    await updateEmail({newemail: emailForm.email, email_code: emailForm.code});
    emailDialogVisible.value = false;
    ElMessage.success('修改邮箱成功，请重新登录');
    // 跳转到登录页面
    userStore
    .logoutApi()
    .then(() => {
      // 跳转登录页
      router.push("/login");
    })
    .catch(() => {
      router.push("/login");
    });
  } catch (error) {
    
  }
  
};

/**
 * TODO:修改密码
 */
const passwordDialogVisible = ref(false);
const passwordFormRef = ref();
const passwordForm = reactive({
  password: '',
  new_password: '',
  confirm_new_password: '',
});

const passwordRules = {
  password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 8, message: '密码长度最少为8个字符', trigger: 'blur' },
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度最少为8个字符', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirm_new_password: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 8, message: '确认密码长度8至16个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.new_password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
};
const handleUpdatePassword = async () => {
  passwordDialogVisible.value = true;
};
const updatePasswordConfirm = async () => {
  if (!passwordFormRef.value) return;
  const valid = await passwordFormRef.value.validate();
  if (valid) {
    try {
      const res = await updatePassword(passwordForm);
      passwordDialogVisible.value = false;
      ElMessage.success('修改成功，请重新登录');
      // 跳转到登录页面
      userStore
      .logoutApi()
      .then(() => {
        // 跳转登录页
        router.push("/login");
      })
      .catch(() => {
        router.push("/login");
      });
    } catch (error) {
    }
  }
};

/**
 * TODO:绑定第三方账号
 */
const bindImDialogVisible = ref(false);
const bindImForm = reactive({
  real_name: '',
  id_card: '',
  id_card_front: '',
  id_card_back: '',
});
const handleBindIm = () => {
  bindImDialogVisible.value = true;
};
const updateBindImConfirm = async () => {
  bindImDialogVisible.value = false;
};

</script>
<style lang="less" scoped></style>
