/**
 * @authot Jhon Guerrero (Garrux)
 */

/**
 * Convert a hexadecimal to an array of numbers or an array of numbers to a hexadecimal
 * with the objective of doing mathematical operations with hexadecimal colors
 */
class ToggleHex {
	/**
	 * Convert a hex string to an array of numbers
	 * @example
	 * hexToInts("#5544ff") // [5,5,4,4,15,15]
	 * hexToInts("ccddff") // [12,12,13,13,15,15]
	 * @param hexStrin - Hex string
	 */
	hexToInts(hexStrin: string[]): number[] {
		const intHexArray: number[] = [];
		const values = {
			a: 10,
			b: 11,
			c: 12,
			d: 13,
			e: 14,
			f: 15,
		};

		hexStrin.forEach((chart) => {
			chart = chart.toLowerCase();
			if (!parseInt(chart)) {
				const number: number = values[chart];
				intHexArray.push(number);
			} else {
				intHexArray.push(parseInt(chart));
			}
		});

		return intHexArray;
	}

	/**
	 * Convert an array of numbers to a hex string
	 * @example
	 * inToHex([15,15,10,10,9,9,00]) // "#ffaa9900"
	 * inToHex([5,5,4,4,15,15]) // #5544ff
	 * @param numbers - array of numbers from 0 to 15
	 */
	intToHex(numbers: number[]): string {
		const hexValues: string[] = [];
		const numberValues = {
			10: "a",
			11: "b",
			12: "c",
			13: "d",
			14: "e",
			15: "f",
		};

		numbers.forEach((number) => {
			if (number > 9) {
				const strNumber = number.toString();
				const letter = numberValues[strNumber];
				hexValues.push(letter);
			} else {
				const intString = number.toString();
				hexValues.push(intString);
			}
		});
		const strHexValues = hexValues.join("");
		const result = `#${strHexValues}`;
		return result;
	}
}
