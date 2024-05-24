<template>
    <BasicLayout>
        <h1>Carrito</h1>
        <table class="ui celled table" v-if="products">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.data.attributes.Name }}</td>
                    <td>{{ product.quantity }}</td>
                    <td>${{ product.data.attributes.Price }}</td>
                    <td style="text-align: center;">
                        <i class="close icon" @click="deleteAllProductCart(product.data.id)"></i>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>Total:</td>
                    <td colspan="2">{{ getTotal() }}</td>
                </tr>
            </tbody>
        </table>
        <button class="ui button primary fluid" v-if="products" @click="createOrder()">
            Generar Pedido
        </button>

        <h3 v-if="!products">No tienes productos en el carrito</h3>
    </BasicLayout>
</template>

<script>
    import { ref, watchEffect } from "vue";
    import { useRouter } from "vue-router";
    import jwtDecode from "jwt-decode";
    import BasicLayout from "@/Layouts/BasicLayout";
    import { getProductsCartApi, deleteAllProductCartApi, deleteCartApi } from "@/api/cart";
    import { createOrderApi } from "@/api/order";
    import { getTokenApi } from "@/api/token";

    export default {
        name: "CartView",
        components:{
            BasicLayout
        },
        setup(){
            let products = ref(null);
            //*let productoSend = ref([]);
            let productoSend = ref({});
            let reloadCart = ref(false)
            const router = useRouter();

            watchEffect(async () =>{
                reloadCart.value
                const response = await getProductsCartApi();
                productoSend = response;
                products.value = response;
            });

            const getTotal = () =>{
                let totalTemp = 0;

                products.value.forEach((product) => {
                    totalTemp += product.data.attributes.Price * product.quantity;
                });
                return totalTemp.toFixed(2);
            }

            const deleteAllProductCart = (idProduct) =>{
                deleteAllProductCartApi(idProduct)
                reloadCart.value = !reloadCart.value;
            };

            const createOrder = async () =>{
                const token = getTokenApi();
                const { id } = jwtDecode(token)
                let valueTotal = getTotal()
                
                const dataSend = {
                    data: {
                        totalPayment: parseFloat(valueTotal),
                        data: {
                            arrayDatos: products.value
                        },
                        user: id,
                    }
                }
                
                try {
                    // console.log('dataSend', dataSend)
                    const response = await createOrderApi(dataSend, id)
                    // console.log('creado', response)
                    deleteCartApi()
                    router.push("/orders")
                } catch (error) {
                    console.error(error)
                }

            }

            return{
                products,
                getTotal,
                deleteAllProductCart,
                createOrder
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>