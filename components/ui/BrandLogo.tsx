import Image from "next/image";

const LOCKUP = { width: 527, height: 148 } as const;

const SRC = {
  light: "/assets/logo/ml-logo-light.webp",
  dark: "/assets/logo/ml-logo-dark.webp",
} as const;

type Props = {
  variant: "light" | "dark";
  className?: string;
  priority?: boolean;
};

/** Full ML Photography lockup — light for dark surfaces, dark for light paper. */
export function BrandLogo({ variant, className = "", priority = false }: Props) {
  return (
    <Image
      src={SRC[variant]}
      alt="Malek Larif Photography"
      width={LOCKUP.width}
      height={LOCKUP.height}
      className={className}
      priority={priority}
      sizes="(max-width: 600px) 160px, 200px"
    />
  );
}
