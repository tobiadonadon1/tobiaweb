import { Fragment, createElement, isValidElement, type ReactNode } from "react";
import { specimenComposition } from "./specimens";

/**
 * A MARK AS A FLAT SVG STRING, for places that cannot render the component:
 * the share cards (Satori takes no filters, so no grain). Same shapes, same
 * placement, read from the same compositions as the page, so the card and the
 * page cannot disagree.
 *
 * WHY A WALKER AND NOT react-dom/server. Next refuses react-dom/server in a
 * route, and the marks do not need it: a composition is a pure function of no
 * props that returns fragments of <Cut>, which is a pure function returning a
 * <g> and a <path>. Calling the functions and printing the SVG elements that
 * come out is the whole job. Anything else (a hook, a context) would throw
 * here, which is the right place to find out.
 */

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function print(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return esc(String(node));
  if (Array.isArray(node)) return node.map(print).join("");
  if (!isValidElement(node)) return "";

  const { type } = node;
  const props = node.props as Record<string, unknown> & { children?: ReactNode };
  if (type === Fragment) return print(props.children);
  if (typeof type === "function") return print((type as (p: object) => ReactNode)(props));
  if (typeof type !== "string") return "";

  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== "children" && v !== undefined && v !== null && typeof v !== "function")
    .map(([k, v]) => ` ${k === "className" ? "class" : k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${esc(String(v))}"`)
    .join("");
  const inner = print(props.children);
  return inner ? `<${type}${attrs}>${inner}</${type}>` : `<${type}${attrs}/>`;
}

export function flatSpecimenSvg(id: string): string | null {
  const Composition = specimenComposition(id);
  if (!Composition) return null;
  return print(
    createElement(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 400 330", width: 400, height: 330 },
      createElement(Composition),
    ),
  );
}
