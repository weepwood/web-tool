// Local-only JSON formatting; JavaScript number precision applies.
export function formatJson(input, mode = "pretty") {
  if (mode !== "pretty" && mode !== "compact") throw new RangeError("未知格式");
  const value = JSON.parse(input);
  return JSON.stringify(value, null, mode === "pretty" ? 2 : 0);
}
