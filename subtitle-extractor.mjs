// 从 ASS（Advanced SubStation Alpha）字幕文件中提取纯文本对话行。
// 纯逻辑、无 DOM 依赖，供 subtitle-converter.html 与单元测试共用。

/** 清理单条对话文本中的 ASS 样式标签与转义序列 */
export function cleanDialogueText(text) {
	return String(text)
		.replace(/\{.*?\}/g, "") // 去除 {\pos(...)}、{\i1} 等覆盖标签
		.replace(/\\N/gi, "\n") // \N 硬换行 / \n 软换行 → 换行
		.replace(/\\h/gi, " ") // \h 硬空格 → 普通空格
		.trim();
}

/** 从 ASS 内容中提取 [Events] 段落的对话文本，自动去重并保持顺序 */
export function parseASS(content) {
	const subtitles = [];
	const seen = new Set();
	const normalized = String(content).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	let isEvents = false;

	for (const line of normalized.split("\n")) {
		const trimmed = line.trim();
		if (trimmed.startsWith("[Events]")) {
			isEvents = true;
			continue;
		}
		if (isEvents && trimmed.startsWith("Dialogue:")) {
			const parts = trimmed.split(",");
			if (parts.length >= 10) {
				// Text 字段为第 10 列起（可含逗号），需要重新拼接
				const text = cleanDialogueText(parts.slice(9).join(","));
				if (text && !seen.has(text)) {
					seen.add(text);
					subtitles.push(text);
				}
			}
		}
	}
	return subtitles;
}
