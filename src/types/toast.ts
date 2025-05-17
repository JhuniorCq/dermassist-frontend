export type ToastType = {
  position:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  timer?: number;
  icon: "success" | "error" | "warning" | "info" | "question";
  title: string;
};
