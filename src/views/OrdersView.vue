<template>
    <BasicLayout>
        <h2>Ordenes jefe</h2>
        <h3 v-if="!orders">No tienes pedids</h3>
        <template v-if="orders">
            <!-- {{ orders }} -->
            <div class="order" v-for="order in orders.data" :key="order.id">
                <div class="header">
                    <span class="date">
                        {{  formatDate(order.attributes.createdAt) }}
                    </span>
                    <p>ID: {{ order.id }}</p>
                    <p>Total: ${{ order.attributes.totalPayment }}</p>
                </div>
                <div class="products">
                    <div class="product" v-for="product in order.attributes.data.arrayDatos" :key="product.id">
                        <div>
                            <img 
                            :src="API_URL+product.data.attributes.image.data.attributes.url" 
                            :alt="product.data.attributes.Name"
                            class="ui image">
                            <p>{{ product.data.attributes.Name}}</p>
                        </div>
                        <div>
                            {{ product.quantity }} x ${{ product.data.attributes.Price }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </BasicLayout>
</template>

<script>
    import { ref, onMounted } from "vue"
    import jwtDecode from "jwt-decode";
    import moment from "moment";
    import BasicLayout from "@/Layouts/BasicLayout";
    import { getOrders } from "@/api/order.js"
    import { getTokenApi } from "@/api/token";
    import { API_URL } from "@/utils/constants";

    export default {
        name: "Orders",
        components:{
            BasicLayout
        },
        setup(){
            let orders = ref(null)
            onMounted(async () =>{
                const token = getTokenApi();

                const {id} = jwtDecode(token)
                
                const response = await getOrders(id);
                orders.value = response
            })

            const formatDate = (date) =>{
                return moment(date).format("L [a las] LT")
            }

            return{
                orders,
                formatDate,
                API_URL
            }
            
        }
    }
</script>

<style lang="scss" scoped>
.order{
    border: 1px solid #000;
    margin-bottom: 20px;
    margin-top: 40px;

    .header{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        
        p{
            margin: 0;
        }

        span{
            position: absolute;
            top: -20px;
            left: 0;
            font-size: 12px;
        }
    }

    .products{
        border-top: 1px solid #000;

        .product{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 30px;

            >div{
                display: flex;
                align-items: center;
                justify-content: space-between
            }
        }

        .ui.image{
            width: 50px;
        }
    }
}
</style>