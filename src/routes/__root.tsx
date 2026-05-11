import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { OceanBackground } from "@/components/OceanBackground";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NinaList — Track every story" },
      {
        name: "description",
        content:
          "NinaList is a personal anime, manga, manhwa and manhua tracker — an ocean of stories.",
      },
      { property: "og:title", content: "NinaList — Track every story" },
      {
        property: "og:description",
        content:
          "Track every anime, manga, manhwa, and manhua journey in one personal ocean of stories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NinaList — Track every story" },
      { name: "description", content: "Track anime, manga, manhwa, and manhua with this personal media tracker." },
      { property: "og:description", content: "Track anime, manga, manhwa, and manhua with this personal media tracker." },
      { name: "twitter:description", content: "Track anime, manga, manhwa, and manhua with this personal media tracker." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02978d95-6b33-41fa-96da-12e06dc6e0f6/id-preview-76ee54b3--bd5e5006-5753-48ab-b7b9-384cfded7e5d.lovable.app-1778506061850.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02978d95-6b33-41fa-96da-12e06dc6e0f6/id-preview-76ee54b3--bd5e5006-5753-48ab-b7b9-384cfded7e5d.lovable.app-1778506061850.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/logo-icon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/logo-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <h1 className="text-7xl gradient-text font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Lost at sea.</p>
        <Link to="/" className="mt-6 inline-block underline">
          Surface back home
        </Link>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { FloatingHeader } from "@/components/ui/floating-header";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <OceanBackground density={isLanding ? 22 : 12} />
      {!isLanding && <div className="pt-4"><FloatingHeader /></div>}
      <main className={isLanding ? "" : "pb-24 md:pb-10"}>
        <Outlet />
      </main>
      <Toaster richColors theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}
