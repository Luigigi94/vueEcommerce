<template>
  <div class="cart-dimmer" :class="{ open: showCart }" @click="closeCart" />
  <div class="cart" :class="{ open: showCart }">
    <div>
      <CartHeader :closeCart="closeCart" />
      <CartBody :products="products" :reloadCartFn="reloadCartFn"/>
    </div>

    <CartFooter :closeCart="closeCart" :products="products" v-if="products"/>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import CartHeader from "./CartHeader";
import { getProductsCartApi } from "../../api/cart";
import CartBody from "./CartBody";
import CartFooter from "./CartFooter"


export default {
  components: { CartHeader, CartBody, CartFooter },
  name: "Cart",
  setup() {
    const store = useStore();
    const showCart = computed(() => store.state.showCart);
    let products = ref(null);
    let reloadCart = ref(false)

    const closeCart = () => {
      store.commit("setShowCart", false);
    };

    const getProductsCart = async () => {
      const response = await getProductsCartApi();
      //console.log("response", response);
      products.value = response;
      //console.log("productos en cart", products.value);
    };

    watchEffect(() => {
      showCart.value;
      reloadCart.value;
      getProductsCart();
    });

    const reloadCartFn = () =>{
      reloadCart.value = !reloadCart.value;
    }
    return {
      showCart,
      closeCart,
      products,
      reloadCartFn
    };
  },
};
</script>

<style lang="scss" scoped>
.cart-dimmer {
  opacity: 0;
  transition: opacity 0.5s ease;

  &.open {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.7;
  }
}
.cart {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: 0 0 26px 5px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: transform 0.9s ease;
  transform: translateX(150%);

  &.open {
    transform: translateX(0);
  }
}
</style>
