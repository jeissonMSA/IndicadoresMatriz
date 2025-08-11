import React from "react";
import { INestedItem } from "./types";

const NestedList = ({ items }: { items: INestedItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <code>{item.label}</code>
          {item.children && <NestedList items={item.children} />}
        </li>
      ))}
    </ul>
  );
};

export default NestedList;
