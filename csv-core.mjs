// Notion CSV 浏览器的纯逻辑核心：列猜测、搜索/筛选、筛选选项提取。
// 无 DOM 依赖，供 notion-csv-parser.html 与单元测试共用。

/** 根据列名关键词猜测标题/日期/标签/链接列 */
export function guessMapping(columns) {
	const cols = Array.isArray(columns) ? columns : [];
	const lower = cols.map((c) => String(c).toLowerCase());
	const find = (keywords) => {
		for (const kw of keywords) {
			const idx = lower.findIndex((c) => c.includes(kw));
			if (idx !== -1) return cols[idx];
		}
		return "";
	};

	let titleCol = find(["name", "名称", "标题", "title"]);
	if (!titleCol && cols.length > 0) titleCol = cols[0];

	const dateCol = find(["created", "创建", "date", "日期", "时间", "time", "updated", "修改"]);
	const tagCol = find(["tag", "标签", "领域", "category", "分类", "type", "类型", "domain", "用途"]);
	const linkCol = find(["url", "link", "链接", "网址", "href"]);

	return { title: titleCol, date: dateCol, tag: tagCol, link: linkCol, filter: tagCol };
}

/**
 * 按搜索词与筛选值过滤行；dateColumn 存在时按日期排序（sort: 'asc' | 'desc'）。
 * 搜索匹配全部字段；筛选值支持 Notion 多选（逗号分隔）。
 */
export function filterRows(
	data,
	{ search = "", filterValue = "", filterColumn = "", dateColumn = "", sort = "asc" } = {}
) {
	const query = String(search).toLowerCase();
	const filtered = data.filter((row) => {
		const allText = Object.values(row).join(" ").toLowerCase();
		if (query && !allText.includes(query)) return false;

		if (filterValue && filterColumn) {
			const cellParts = String(row[filterColumn] || "").split(",").map((v) => v.trim());
			if (!cellParts.includes(filterValue)) return false;
		}
		return true;
	});

	if (dateColumn) {
		filtered.sort((a, b) => {
			const tA = new Date(a[dateColumn] || 0);
			const tB = new Date(b[dateColumn] || 0);
			return sort === "desc" ? tB - tA : tA - tB;
		});
	}
	return filtered;
}

/** 提取某一列的去重排序后的筛选选项（支持 Notion 多选逗号分隔） */
export function getFilterValues(data, column) {
	if (!column) return [];
	return [...new Set(data.flatMap((row) => {
		const val = row[column];
		if (!val) return [];
		return String(val).split(",").map((v) => v.trim()).filter(Boolean);
	}))].sort();
}
