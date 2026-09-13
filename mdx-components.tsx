import type { MDXComponents } from "mdx/types";

import { Termo } from "@/src/components/content/Termo";

/**
 * Componentes disponíveis dentro de todo `.mdx` do projeto.
 *
 * O App Router exige este arquivo na raiz. Além de estilizar os elementos
 * padrão do markdown para a estética do site, ele expõe `<Termo>` globalmente,
 * para que os artigos possam marcar jargão sem importar nada.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-serif text-2xl font-bold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-serif text-xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-5 text-[15px] leading-loose text-foreground/80">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/80">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/80">
        {children}
      </ol>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-primary/40 pl-5 text-[15px] text-muted-foreground italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary underline-offset-4 hover:underline"
        {...(href?.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-10 border-white/10" />,
    Termo,
    ...components,
  };
}
