interface IconProps {
  name: string;
  className?: string;
  size?: number;
  outlined?: boolean;
}

export function Icon({ name, className = "", size = 24, outlined = false }: IconProps) {
  return (
    <span
      className={`${outlined ? "icon-material-outlined" : "icon-material"} ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}
