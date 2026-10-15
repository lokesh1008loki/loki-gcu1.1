declare module "next/navigation" {
  export function useRouter(): {
    push(href: string, options?: any): void;
    replace(href: string, options?: any): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T = Record<string, string | string[]>>(): T;
  export function redirect(url: string, type?: any): never;
  export function notFound(): never;
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, ForwardRefExoticComponent } from "react";
  export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: any;
    as?: any;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  const Link: ForwardRefExoticComponent<LinkProps>;
  export default Link;
}

declare module "next/image" {
  import type { FC, ImgHTMLAttributes } from "react";
  export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: any;
    alt: string;
    width?: number | string;
    height?: number | string;
    fill?: boolean;
    quality?: number | string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    unoptimized?: boolean;
  }
  const Image: FC<ImageProps>;
  export default Image;
}

declare module "next/headers" {
  export function cookies(): any;
  export function headers(): any;
}

declare module "next/font/google" {
  export function Inter(options?: any): any;
  export function Roboto(options?: any): any;
  export function Outfit(options?: any): any;
  export function Plus_Jakarta_Sans(options?: any): any;
}

declare module "next" {
  export type Metadata = any;
  export type NextPage<P = {}, IP = P> = import("react").ComponentType<P>;
}
