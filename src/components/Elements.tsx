import React from "react";
import { BoundComponent, BoundComponentProps } from "./BoundComponent";

type WrappedBoundComponentProps = Omit<BoundComponentProps, "elementName">;

interface ExtendedInputProps extends WrappedBoundComponentProps {
  type: "text" | "url" | "number" | "checkbox" | "date" | "time" | "radio";
}

export function Input(props: ExtendedInputProps) {
  return <BoundComponent elementName="input" {...props} />;
}

export function Select(props: WrappedBoundComponentProps) {
  return <BoundComponent elementName="select" {...props} />;
}

export function TextArea(props: WrappedBoundComponentProps) {
  return <BoundComponent elementName="textarea" {...props} />;
}
