export default function transformTimeFunc(params) {
	const options = { day: "2-digit", month: "2-digit", year: "numeric" };
	const res = new Intl.DateTimeFormat("ru-Ru", options).format(params);
	const resString = res.replace(/,/gi, "");
	return resString;
}
