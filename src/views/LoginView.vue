<template>
  <BasicLayout>
    <div class="login">
      <h2>Login</h2>
      <form class="ui form" @submit.prevent="login">
        <div class="field">
          <input
            type="text"
            placeholder="Username"
            v-model="formData.identifier"
            :class="{ error: formError.identifier }"
          />
        </div>
        <div class="field">
          <input
            type="password"
            placeholder="Password"
            v-model="formData.password"
            :class="{ error: formError.password }"
          />
        </div>
        <button
          type="submit"
          class="ui button fluid primary"
          :class="{ loading }"
        >
          Entrar
        </button>
      </form>
      <router-link to="/register"> Crear Cuenta </router-link>
    </div>
  </BasicLayout>
</template>

<script>
import { ref, onMounted } from "vue";
import { loginApi } from "../api/user";
import { useRouter } from "vue-router";
import { setTokenApi, getTokenApi } from "../api/token";
import * as Yup from "yup";
import BasicLayout from "@/Layouts/BasicLayout";

export default {
  name: "LoginView",
  components: {
    BasicLayout,
  },
  setup() {
    let formData = ref({});
    let formError = ref({});
    let loading = ref(false);
    const router = useRouter();
    const token = getTokenApi();
    onMounted(() => {
      if (token) router.push("/");
    });

    const schemaForm = Yup.object().shape({
      identifier: Yup.string().required(true),
      password: Yup.string().required(true),
    });

    const login = async () => {
      loading.value = true;
      formError.value = {};
      try {
        await schemaForm.validate(formData.value, { abortEarly: false });
        console.log("formData", formData);

        try {
          const response = await loginApi(formData.value);
          if (!response?.jwt) throw "Usuario o Contraseña no Validos";
          setTokenApi(response.jwt);
          router.push("/");
          console.log(response);
        } catch (error) {
          console.log(error);
        }

        console.log("ok");
      } catch (e) {
        e.inner.forEach((err) => {
          formError.value[err.path] = err.message;
        });
      }
      loading.value = false;
    };

    return {
      formData,
      formError,
      loading,
      login,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  text-align: center;
  > h2 {
    margin: 50px 0 30px 0;
  }

  .ui.form {
    max-width: 300px !important;
    margin: 0 auto;
    margin-bottom: 10px;
    input.error {
      border-color: #faa;
      background-color: #ffeded;
    }
  }
}
</style>
