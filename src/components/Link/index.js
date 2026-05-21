import { Link as RouterLink } from "react-router-dom";

/**
 * A component that renders a link. If the link is an internal link (i.e. starts with "./" or "/"),
 * it will use RouterLink from react-router-dom. Otherwise, it will render
 * a standard HTML anchor tag with the target attribute set to "_blank" and the rel attribute set
 * to "noopener noreferrer".
 * @param {object} props - The props object.
 * @param {string | object} props.to - The URL or location object to link to.
 * @param {ReactNode} props.children - The content to render inside the link.
 * @param {string} [props.className] - The CSS class name to apply to the link.
 * @param
 */
const Link = ({
  to,
  children,
  className,
  style,
  target,
  ariaLabel,
  ...rest
}) => {
  const href = (to || {}).pathname || (typeof to === "string" ? to : "/");
  const props = { className, style, children, target, ...rest };
  if (/^[./]/.test(href))
    return <RouterLink {...props} to={to} aria-label={ariaLabel} />;
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    />
  );
};

export default Link;
