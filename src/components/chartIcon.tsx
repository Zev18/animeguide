import React from "react";
import { SvgProps } from "@/types/svgProps";
import Access from "../assets/vector/radar-chart/access";
import Book from "../assets/vector/radar-chart/book";
import Film from "../assets/vector/radar-chart/film";
import Heart from "../assets/vector/radar-chart/heart";
import Palette from "../assets/vector/radar-chart/palette";
import People from "../assets/vector/radar-chart/people";

interface DynamicIconProps extends SvgProps {
  name: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const iconComponents: Record<string, React.FC<SvgProps>> = {
    access: Access,
    book: Book,
    film: Film,
    heart: Heart,
    palette: Palette,
    people: People,
  };

  const SelectedIcon = iconComponents[name];

  if (!SelectedIcon) {
    return null;
  }

  return <SelectedIcon {...props} />;
};

export default DynamicIcon;
