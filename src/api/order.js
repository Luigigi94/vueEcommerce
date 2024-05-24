import { API_URL } from "../utils/constants"

export async function createOrderApi(data, userSend){
    try {
        const url = `${API_URL}/api/orders`;
        const params = {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        };

        // console.log("url: ",url)
        // console.log("JSON.stringify(data): ",JSON.stringify(data))
        const response = await fetch(url, params);
        // console.log('el response: ',response)
        const result = await response.json();

        /*const {data:{id}} = result;

        url = `${API_URL}/api/users/${userSend}`;
        const requestBodyPut = {
            orders: [id]
        }
        params ={
            method: "PUT",
            headers:{
                "Content-Type": "application/json"
            },
            // body: JSON.stringify(requestBodyPut)
            body: JSON.stringify({
                "data":{
                    "orders ": id
                }
            })
        }

        console.log('params: ',params)
        response = await fetch(url, params);
        console.log('el response: ',response)
        result = await response.json();
        console.log('el result: ',result)*/
        return result;
    } catch (error) {
        console.error(error)
    }
}

export async function getOrders(idUser){
    try {
        const response = await fetch(
            `${API_URL}/api/orders?_where[user]=${idUser}&_sort=created_at:desc`
        )
        // console.log(`${API_URL}/orders?_where[user]=${idUser}&_sort=created_at:desc`)
        const result = await response.json()
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}