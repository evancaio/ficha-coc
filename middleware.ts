// MIDDLEWARE TEMPORARIAMENTE DESABILITADO PARA TESTES
// Para reativar: descomente o código abaixo

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };

export default function middleware() {
    // Middleware desabilitado para testes
    return;
}

export const config = {
    matcher: [],
};
