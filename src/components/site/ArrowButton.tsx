import { cn } from "@/lib/utils";

type ArrowButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "light" | "dark" | "paper";
  size?: "sm" | "lg";
  className?: string;
  onClick?: () => void;
};

export function ArrowButton({
  children,
  href,
  variant = "light",
  size = "sm",
  className,
  onClick,
}: ArrowButtonProps) {
  const styles = {
    light: "bg-[var(--paper)] text-[var(--brand)]",
    dark: "bg-[var(--ink)] text-[var(--paper)]",
    paper: "bg-[var(--brand)] text-[var(--paper)]",
  }[variant];

  const iconStyles = {
    light: "bg-[var(--accent)]",
    dark: "bg-[var(--accent)]",
    paper: "bg-[var(--paper)]",
  }[variant];

  const arrowColor = {
    light: "bg-[var(--paper)]",
    dark: "bg-[var(--paper)]",
    paper: "bg-[var(--accent)]",
  }[variant];

  const sizeStyles =
    size === "lg"
      ? "h-[45px] rounded-[2.565px] text-[13.68px] tracking-[-0.27px] pl-[13.68px] pr-[3.42px] py-[3.42px] gap-[15px]"
      : "h-[33px] rounded-[2.214px] text-[11.808px] tracking-[-0.236px] pl-[8.856px] pr-[2.952px] py-[2.952px] gap-[13.28px]";

  const iconSize = size === "lg" ? "size-[38px] rounded-[3px]" : "size-[27px] rounded-[2.7px]";
  const arrowSize = size === "lg" ? "size-[15px]" : "size-[14px]";

  const buttonClassName = cn(
    "group inline-flex items-center font-medium leading-none transition-[opacity,transform] duration-300 hover:-translate-y-px hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
    styles,
    sizeStyles,
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:translate-x-px",
          iconStyles,
          iconSize,
        )}
        aria-hidden
      >
        <span
          className={cn(
            "block transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]",
            arrowSize,
            arrowColor,
          )}
          style={{
            maskImage: "url(/brand/arrow.png)",
            WebkitMaskImage: "url(/brand/arrow.png)",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={buttonClassName}>
        {content}
      </a>
    );
  }

  return (
    <button type="submit" onClick={onClick} className={buttonClassName}>
      {content}
    </button>
  );
}
