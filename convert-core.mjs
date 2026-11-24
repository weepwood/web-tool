export function transformText(input, mode) {
  switch (mode) {
    case "encode": return encodeURIComponent(input);
    case "decode": return decodeURIComponent(input);
    case "form-decode": return decodeURIComponent(input.replace(/\+/g, " "));
    case "seconds":
    case "milliseconds": {
      if (!/^[+-]?\d+$/.test(input.trim())) throw new Error("请输入整数时间戳");
      const n = Number(input.trim());
      const ms = mode === "seconds" ? n * 1000 : n;
      if (!Number.isSafeInteger(ms) || Math.abs(ms) > 8640000000000000) throw new Error("时间戳超出有效范围");
      return new Date(ms).toISOString();
    }
    case "iso": {
      const value = input.trim();
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) throw new Error("请输入 UTC ISO 时间，例如 2026-01-01T00:00:00Z");
      const d = new Date(value);
      if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,19) !== value.slice(0,19)) throw new Error("无效日期");
      return "秒: " + d.getTime()/1000 + "\n毫秒: " + d.getTime();
    }
    default: throw new Error("未知转换模式");
  }
}
