<template>
  <BasicLayout>
    <div class="ui grid">
      <div
        class="sixten wide mobile eight wide tablet four wide computer column"
        v-for="product in products"
        :key="product.id"
      >
        <Product :product="product" />
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "../Layouts/BasicLayout";
import Product from "../components/Product";
import { getProductsCategory } from "../api/Products";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "CategoryView",
  components: {
    BasicLayout,
    Product,
  },
  watch: {
    $route(to, from) {
      this.getProducts(to.params.category);
    },
  },
  setup() {
    let products = ref(null);
    const { params } = useRoute();

    onMounted(() => {
      getProducts(params.category);
    });

    const getProducts = async (category) => {
      const response = await getProductsCategory(category);
      products.value = response.data;
    };

    return {
      getProducts,
      products,
    };
  },
};
</script>

<style></style>
