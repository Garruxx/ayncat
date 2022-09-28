interface regEx {
	unitTypes: RegExp;
	unitTypesSybol: RegExp;
	color: RegExp;
	hexColor: RegExp;
	number: RegExp;
}

/**
 * Object with all regular expresions
 */
const regEx: regEx = {
	unitTypes:
		/\d{1,5}\d*(px|vh|vw|lh|rem|cm|mm|Q|in|pc|pt|em|ex|ch|vmin|deg|vmax|%){1}/,
	unitTypesSybol:
		/(px|vh|vw|lh|rem|cm|mm|Q|in|pc|pt|em|ex|ch|vmin|vmax|\%){1}/g,
	color: /(?:#|0x)(?:[a-f0-9]{3,6}|[a-f0-9]{8})\b|(?:rgb|hsl|hwb)a?\([^\)]*\)/,
	hexColor:
		/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/,
	number: /[-]?[0-9.]{1,10}/g,
};
