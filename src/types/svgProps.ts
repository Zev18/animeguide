import { SVGProps } from "react";

export interface SvgProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}
