import { useEffect } from "react";

interface DocumentMetadata {
  title: string;
  description: string;
  path: string;
  image?: string;
}

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  const created = !element;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  const previousContent = element.content;
  element.content = content;

  return () => {
    if (created) {
      element?.remove();
    } else if (element) {
      element.content = previousContent;
    }
  };
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  const created = !element;

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  const previousHref = element.href;
  element.href = url;

  return () => {
    if (created) {
      element?.remove();
    } else if (element) {
      element.href = previousHref;
    }
  };
}

export function useDocumentMetadata({
  title,
  description,
  path,
  image,
}: DocumentMetadata) {
  useEffect(() => {
    const previousTitle = document.title;
    const canonicalUrl = new URL(path, window.location.origin).toString();
    const cleanTitle = `${title} | Vinicius Silva`;

    document.title = cleanTitle;

    const restore = [
      upsertMeta("name", "description", description),
      upsertMeta("property", "og:title", cleanTitle),
      upsertMeta("property", "og:description", description),
      upsertMeta("property", "og:type", "article"),
      upsertMeta("property", "og:url", canonicalUrl),
      upsertCanonical(canonicalUrl),
    ];

    if (image) {
      restore.push(
        upsertMeta(
          "property",
          "og:image",
          new URL(image, window.location.origin).toString(),
        ),
      );
    }

    return () => {
      document.title = previousTitle;
      restore.reverse().forEach((restoreValue) => restoreValue());
    };
  }, [description, image, path, title]);
}
