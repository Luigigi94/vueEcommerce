<template>
  <BasicLayout>
    <div class="register">
      <h2>Registro</h2>
      <form class="ui form" @submit.prevent="register">
        <div class="field">
          <input
            type="text"
            placeholder="username"
            v-model="formData.username"
            :class="{ error: formError.username }"
          />
        </div>
        <div class="field">
          <input
            type="text"
            placeholder="E-mail"
            v-model="formData.email"
            :class="{ error: formError.email }"
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
          Crear Usuario
        </button>
      </form>
      <router-link to="/login"> Iniciar Sesión </router-link>
    </div>
  </BasicLayout>
</template>

<script>
import { ref, onMounted } from "vue";
import { registerApi } from "../api/user";
import { useRouter } from "vue-router";
import { getTokenApi } from "../api/token";
import BasicLayout from "../Layouts/BasicLayout.vue";
import * as Yup from "yup";

export default {
  name: "RegisterView",
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
      username: Yup.string().required(true),
      email: Yup.string().email().required(true),
      password: Yup.string().required(true),
    });

    const register = async () => {
      loading.value = true;
      formError.value = {};
      try {
        await schemaForm.validate(formData.value, { abortEarly: false });
        try {
          const response = await registerApi(formData.value);
          router.push("/login");
        } catch (err) {
          console.log(err);
        }
      } catch (e) {
        e.inner.forEach((err) => {
          formError.value[err.path] = err.message;
        });
      }
      console.log("registrando", formData.value);
      loading.value = false;
    };

    return {
      formData,
      formError,
      register,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.register {
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
