import { createServer, IncomingMessage, Server } from "http";
import { routeHandler } from "./routes/route";


const server: Server = createServer((req: IncomingMessage, res) => {

    routeHandler(req, res);


    // //
    // if(url === "/" && method === "GET") {
    //     res.writeHead(200, {"content-type": "text/html"});
    //     res.write("<h1>Welcome to Home Page.</h1>");
    //     res.end();
    // } else if (url === "/api/user" && method === "GET") {
    //     const userData = {
    //         id: 1,
    //         name: "Siam Ahmed",
    //         email: "siam99@gmail.com"
    //     };
    //     res.writeHead(200, {"content-type": "application/json"});
    //     res.end(JSON.stringify(userData));
    // } else {
    //     res.writeHead(404, {"content-type": "text/html"});
    //     res.end("<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>");
    // };

});

const PORT = 5000;
server.listen(PORT, () => {
    console.log("Server is running on the port 5000");
});