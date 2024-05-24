import { API_URL, PRODUCTS } from "../utils/constants";
import { uniqBy, countBy, uniq, iteratee } from "lodash";
import { ref } from "vue";

export function addProductCartApi(idProduct) {
  const products = getCartApi();
  products.push(idProduct);

  localStorage.setItem(PRODUCTS, JSON.stringify(products));
}

export function getCartApi() {
  const products = localStorage.getItem(PRODUCTS);

  if (!products) return [];

  return JSON.parse(products);
}

export async function getProductsCartApi() {
  const idProducts = getCartApi();
  
  if (idProducts.lenght === 0) return null;

  try{
    const qs = require("qs");
    const query = qs.stringify({
      populate: "*"
    },{
      encodeValuesOnly: true,
    });
    const productsLog = [];
    const dataValues = ref(null);
    for await(const idProduct of idProducts){
      const responseLog = await fetch(`${API_URL}/api/productos/${idProduct}/?${query}`);
      // console.log('logsiño: ',`${API_URL}/api/productos/${idProduct}/?${query}`)
      const resultLog = await (responseLog).json();
      productsLog.push(resultLog)
    }

    //console.log('productsLog: ',productsLog)

    const productsCount = countBy(productsLog, (product) =>{
      return product.data.attributes.Name
    })

    const combined = uniqBy(productsLog, (product) =>{
      const productTemp = product;
      productTemp.quantity = productsCount[product.data.attributes.Name];
      return productTemp.data.attributes.Name;
    })

    
    //console.log("productTemp: ",combined);
    return combined
  }catch (error) {
    console.log(error);
    return null;
  }
}

export function deleteProductCartApi(idProduct){
  const products = getCartApi();

  const index = products.indexOf(idProduct);

  if( index > -1 ) products.splice(index,1);

  localStorage.setItem(PRODUCTS, JSON.stringify(products))
}

export function deleteAllProductCartApi(idProduct){
  const products = getCartApi();

  const index = products.indexOf(idProduct);
  // if( index > -1 ) products.splice(index,1);

  // localStorage.setItem(PRODUCTS, JSON.stringify(products))
  if(index > -1) {
    products.splice(index,1);
    localStorage.setItem(PRODUCTS, JSON.stringify(products))
    deleteAllProductCartApi(idProduct);
  }
}

export function deleteCartApi(){
  localStorage.removeItem(PRODUCTS)
}