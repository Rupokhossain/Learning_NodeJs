import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

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

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrived succeefully",
        data: products,
      }),
    );
  } else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    console.log(product);

    if (product) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product retrieved successfully",
          data: product,
        }),
      );
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Product not found with this ID" }));
    }
  } else if (method === "POST" && url === "/products") {
    const rawBody = await parseBody(req);
    const body = JSON.parse(rawBody)
    const products = readProduct();

    const newProduct = {
        id: Date.now(),
        ...body,
    };
    // console.log(newProduct)
    products.push(newProduct);
    // console.log(products);
    insertProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product retrieved successfully",
          data: products,
      }),
    );
  }
};
