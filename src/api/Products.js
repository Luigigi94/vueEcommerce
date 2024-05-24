import { API_URL } from "@/utils/constants";

export async function getProducts(limite = 1000) {
  try {
    const qs = require("qs");
    const query = qs.stringify(
      {
        populate: "*",
        sort: ["createdAt:desc"],
        pagination: {
          limit: limite,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const response = await fetch(`${API_URL}/api/productos?${query}`);
   
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getProductsCategory(category) {
  try {
    const qs = require("qs");
    const query = qs.stringify(
      {
        populate: "image",
        filters: {
          category: {
            slug: {
              $eq: category,
            },
          },
        },
        sort: ["createdAt:desc"],
      },
      {
        encodeValuesOnly: true,
      }
    );
    const response = await fetch(`${API_URL}/api/productos?${query}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
