<template>
  <BasicLayout>
    <h1>Hotest Products</h1>
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
import { ref, onMounted } from "vue";
import { getProducts } from "../api/Products";
import BasicLayout from "../Layouts/BasicLayout.vue";
import Product from "../components/Product.vue";

export default {
  name: "HomeView",
  components: {
    BasicLayout,
    Product,
  },
  setup() {
    let products = ref(null);

    onMounted(async () => {
      const response = await getProducts(3);

      products.value = response.data;
    });

    return {
      products,
    };
  },
};
</script>
