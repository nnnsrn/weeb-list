import React from 'react';
import { MenuIcon, LogIn, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false);
  const { user, isOwner } = useAuth();
  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

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
          <div className="size-8 overflow-hidden rounded-full shrink-0 flex items-center justify-start border border-primary/20 shadow-glow">
            <img src="/logo-icon.png" alt="NinaList Logo" className="h-[120%] w-auto max-w-none object-left -ml-[5%]" />
          </div>
          <p className="font-semibold text-base hidden sm:block">NinaList</p>
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
          {user ? (
            <Button size="sm" variant="outline" className="rounded-md hidden sm:flex" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" /> {isOwner ? "Owner" : "Sign out"}
            </Button>
          ) : (
            <Link to="/auth" className={buttonVariants({ size: 'sm', variant: 'outline', className: 'rounded-md hidden sm:flex' })}>
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
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
                {user ? (
                  <Button variant="outline" className="w-full" onClick={signOut}>Sign out</Button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className={buttonVariants({ variant: 'outline', className: 'w-full' })}>Sign in</Link>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
