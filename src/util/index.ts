export * from "./cn";
export * from "./api";

export const nameToFallbackText = (name: string | null) => {
  return (
    name
      ?.split(" ")
      .slice(0, 3)
      .map((s) => s.charAt(0))
      .join("") || ""
  );
};
