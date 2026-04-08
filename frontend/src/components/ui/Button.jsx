export const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
