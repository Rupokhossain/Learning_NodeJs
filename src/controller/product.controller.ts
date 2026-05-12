import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  //   console.log(urlParts);

  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  console.log("This is the actual id: ", id);

  if (url === "/products" && method === "GET") {
    // const products = [
    //     {
    //         id: 1,
    //         name: "Product - 1",
    //     },
    // ];
    const products = readProduct();

    return sendResponse(res, 200, "Products retrived succeefully", products);

  } else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    console.log(product);

    if (product) {
      return sendResponse(res, 200, "Product found", product);
    } else {
      return sendResponse(res, 404, "Product not found");
    }
  } else if (method === "POST" && url === "/products") {
    const rawBody = await parseBody(req);
    const body = JSON.parse(rawBody);
    const products = readProduct();

    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct)
    products.push(newProduct);
    // console.log(products);
    insertProduct(products);

    return sendResponse(res, 200, "Product retrieved successfully");
  } else if (method === "PUT" && id !== null) {
    // 1. data newa
    const rawBody = await parseBody(req);
    const body = JSON.parse(rawBody);

    // 2. bortoman shob data pora
    const products = readProduct();

    // 3. kon position a ase ta khuje ber kora.
    const productIndex = products.findIndex((p: IProduct) => p.id === id);

    if (productIndex !== -1) {
      // 4. update kora (purono data + notun data)
      products[productIndex] = { ...products[productIndex], ...body };

      // 5. file a save kora
      insertProduct(products);

      // 6. resposnse pathano
      return sendResponse(res, 200, "Updated successfully");
    } else {
      return sendResponse(res, 404, "Product not found");
    }
  } else if (method === "DELETE" && id !== null) {
    // 1. read data
    const products = readProduct();

    // 2. cheack kora product ase kina
    const isExist = products.find((p: IProduct) => p.id === id);

    if (isExist) {
      // 3. oi id chara baki shobai ke niye notun list banano
      const remainingProducts = products.filter((p: IProduct) => p.id !== id);

      // 4. fill a notun list save kora
      insertProduct(remainingProducts);

      // 5. success message
      return sendResponse(res, 200, "Product deleted successfully", isExist);
    } else {
     return sendResponse(res, 404, "Product not found to delete");
    }
  }
};
