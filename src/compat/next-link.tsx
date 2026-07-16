import { forwardRef, type AnchorHTMLAttributes } from 'react';

type NextLinkCompatProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string;
};

const Link = forwardRef<HTMLAnchorElement, NextLinkCompatProps>(
  ({ href, ...props }, ref) => <a ref={ref} href={href} {...props} />
);

Link.displayName = 'Link';

export default Link;
