"use client";

import type { ComponentProps, PropsWithChildren } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

type ReactLenisProps = ComponentProps<typeof ReactLenis>;

export default function LenisProvider({ children }: PropsWithChildren) {
  return <ReactLenis root>{children as ReactLenisProps["children"]}</ReactLenis>;
}

