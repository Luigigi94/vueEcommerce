<template>
  <div class="ui secondary menu">
    <div class="ui container">
      <div class="left menu">
        <router-link class="item" to="/">
          <img src="@/assets/logo.png" alt="Ecommerce" class="ui small image" />
          <template v-for="category in categorias" :key="category.id">
            <router-link class="item" :to="category.attributes.slug">
              {{ category.attributes.title }}
            </router-link>
          </template>
        </router-link>
      </div>

      <div class="right menu">
        <router-link class="item" to="/login" v-if="!token">
          Login
        </router-link>
        <template v-if="token">
          <router-link to="/orders" class="item">Pedidos</router-link>
          <span class="ui item cart" @click="openCart"
            ><i class="shopping cart icon"></i
          ></span>
          <span class="ui item logout" @click="logout">
            <i class="power off icon"></i>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { getTokenApi, deleteTokenApi } from "../api/token";
import { getCategoriesApi } from "../api/category";
export default {
  name: "Menu",
  setup() {
    let categorias = ref(null);
    const token = getTokenApi();
    const store = useStore();

    onMounted(async () => {
      const response = await getCategoriesApi();
      categorias.value = response.data;
    });

    const logout = () => {
      deleteTokenApi();
      location.replace("/");
    };

    const openCart = () => {
      store.commit("setShowCart", true);
    };
    return {
      token,
      logout,
      categorias,
      openCart,
    };
  },
};
</script>

<style lang="scss" scoped>
.ui.menu.secondary {
  background-color: #16202b;
  .item {
    color: #fff;
    &:hover {
      color: #1fa1f1;
    }
  }
  .menu.left {
    width: 50%;
    .ui.image {
      width: 40px;
    }
  }

  .menu.right {
    width: 50%;
    justify-content: flex-end;

    .logout,
    .cart {
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
