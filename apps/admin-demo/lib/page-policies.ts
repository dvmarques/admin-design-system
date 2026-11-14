/**
 * Políticas declaradas via `<meta>` no HTML estático (#269). O GitHub Pages não permite
 * headers de resposta; `frame-ancestors`, `script-src` e afins não valem em meta.
 */
export const pageContentSecurityPolicy = "object-src 'none'; base-uri 'self'; form-action 'self'";
export const pageReferrerPolicy = 'strict-origin-when-cross-origin';
