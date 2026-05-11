import React from 'react';
import { Grid2x2PlusIcon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false);

  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Library',
      href: '/library',
    },
    {
      label: 'Discover',
      href: '/discover',
    },
  ] as const;

  return (
    <header
      className={cn(
        'sticky top-5 z-50',
        'mx-auto w-full max-w-3xl rounded-md border border-border shadow-sm',
        'bg-card text-card-foreground'
      )}
    >
      <nav className="mx-auto flex items-center justify-between p-2 px-4">
        <Link to="/" className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 duration-100">
          <Grid2x2PlusIcon className="size-5 text-primary" />
          <p className="font-semibold text-base">Tracker</p>
        </Link>
        
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: "rounded-md" })}
              activeProps={{
                className: "bg-accent text-accent-foreground"
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="rounded-md hidden sm:flex">Profile</Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden rounded-md"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="bg-card border-l border-border"
              side="left"
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'justify-start rounded-md py-6',
                    })}
                    activeProps={{
                      className: "bg-accent text-accent-foreground"
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <SheetFooter className="mt-auto px-4 pb-8">
                <Button variant="outline" className="w-full">Profile</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
