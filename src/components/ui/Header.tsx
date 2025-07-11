import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function Header() {
    return (
        <header className="w-full bg-zinc-900 border-b border-zinc-700 shadow-md shadow-zinc-800/30 backdrop-blur-md  relative z-[100]">
            <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">📚 Ink Trace</h1>
                <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-white hover:bg-zinc-800">menu</NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[999]">
                        <ul className="grid gap-2 w-64">
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                            <a
                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                href="/"
                            >
                                <div className="mt-4 mb-2 text-lg font-medium">
                                books
                                </div>
                            </a>
                            </NavigationMenuLink>
                        </li>
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                            <a
                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                href="/auth"
                            >
                                <div className="mt-4 mb-2 text-lg font-medium">
                                admin
                                </div>
                            </a>
                            </NavigationMenuLink>
                        </li>
                        {/* <li className="row-span-3">
                            <NavigationMenuLink asChild>
                            <a
                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                href="/other"
                            >
                                <div className="mt-4 mb-2 text-lg font-medium">
                                other
                                </div>
                            </a>
                            </NavigationMenuLink>
                        </li> */}
                        </ul>
                    </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    )
}
