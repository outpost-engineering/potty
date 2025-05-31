import { SVGProps } from "react";

interface Props {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  children: React.ReactNode;
}

export function LoginButton(props: Props) {
  const { icon: Icon, href, children } = props;

  return (
    <a
      href={href}
      className="bg-accent-2 hover:bg-accent-2/70 flex w-full cursor-pointer items-center justify-between rounded-2xl px-12 py-5 transition-all duration-150 ease-in select-none hover:scale-[99%]"
    >
      <div className="size-7">
        <Icon className="h-full w-full" />
      </div>
      <p className="text-xl font-normal text-white">{children}</p>
      <div className="size-7"></div>
    </a>
  );
}
