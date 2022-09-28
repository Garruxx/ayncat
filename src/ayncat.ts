/**
 * Transitions manipulated by JavaScript
 * can use for run animate with others acctions.
 * Example, a transition running to medide the user
 * has scroll
 */

/**
 * Principal class
 */
class Ayncat extends ToggleHex {
	cssSelector: string;
	prevStyles: Partial<CSSStyleDeclaration>;
	newStyles: Partial<CSSStyleDeclaration>;
	styleTag: HTMLElement | null;

	/**
	 *
	 * @param cssSelector - A css selector, you can use .container, .element#e
	 * @param prevStyles  - A JSON object with the initials css styles. Will show in 0%
	 * @param newStyles   - A JSON object with the final css styles. Will show in 100%
	 */
	constructor(
		cssSelector: string,
		prevStyles: Partial<CSSStyleDeclaration>,
		newStyles: Partial<CSSStyleDeclaration>
	) {
		super();
		this.cssSelector = cssSelector;
		this.prevStyles = prevStyles;
		this.newStyles = newStyles;
		if (!HandleErrors) {
			throw new Error(
				"HandleErrors was not found, but it is depended on to work correctly."
			);
		}
		const handleError = new HandleErrors();
		this.styleTag = handleError.styleTag();
		handleError.dataTypes(prevStyles, newStyles);
	}

	/**
	 *
	 *Adds the percentage of the second value
	 *to the first value for each item it logs.
	 *
	 *Float is optional and set the ammount the float in the number
	 *@example
	 *increaseInSets(45, 32, 17): 42.79
	 *increaseInSets(45, 32, 17, 0): 42
	 *@param prevValue - The old value will be added to this X percentage of the newValue
	 *@param newValue  - The new value will be multiplied for (percent) and divided by 100
	 *@param percent   - This value will be multiplied for newValue and the result will be added to prevValue
	 *@param floats    - The amount of numbers decimals in the result.
	 */
	#increaseInSets(
		prevValue: number[],
		newValue: number[],
		percent: number,
		/**
		 * @defaultValue 0
		 */
		floats: number = 0
	): number[] {
		const results: number[] = [];
		prevValue.forEach((value, index) => {
			let valueTwo = newValue[index];
			valueTwo = valueTwo - value;
			let result = valueTwo * percent + value;
			result = parseFloat(result.toFixed(floats));
			results.push(result);
		});

		return results;
	}

	/**
	 * Convert a JavaScript Object (JSON) to CSS Text
	 * @returns {CSSText}
	 * @example
	 * JsonToCssText({margin: "12px", padding: "7px"})// "margin:12px;padding:7px;"
	 * @param json - JSON with css properties
	 */
	#JsonToCssText(json: Partial<CSSStyleDeclaration>): string {
		let cssText = "";
		for (const property in json) {
			const newProperty = property.replace(/[A-Z]/, (letter) => {
				return `-${letter.toLowerCase()}`;
			});

			cssText += `${newProperty}:${json[property]};`;
		}
		return cssText;
	}

	/**
	 *
	 *Extract the numbers to place them in the array
	 *@example
	 *exctractNumber("15px 12px 3vw"): [15,12,3]
	 *@param string String charts with numbers
	 */
	#exctractNumber(string: string): number[] {
		const result: number[] = [];
		string.replace(regEx.number, (numberStr) => {
			const number = parseFloat(numberStr);
			result.push(number);
			return numberStr;
		});
		regEx.number.lastIndex = 0;
		return result;
	}

	/**
	 *
	 * Convert a number array to string with format
	 * The format param is a example of format
	 * @example
	 * formattedValues("0px 0vw 0pt", [12, 23, 17]): "12px 23vw 17pt"
	 * @param format - String with the format
	 * @param values - Array with the values
	 */
	#formattedValues(format: string, values: number[]) {
		return format.replace(/[-]?[0-9.]{1,10}/g, () => {
			const result = values[0];
			values.shift();
			return result.toString();
		});
	}

	/**
	 *
	 * Separed color in int values for add to first color
	 * the percened defined to te second color.
	 * @example
	 * handleColors("rbg(120, 190, 250)", "rgb(130, 100, 120)", 10): rgb(121, 181, 250)
	 *
	 * this looks like this
	 * this applies to every number
	 * substraction = newUnits - prevUnits;
	 * result = (newUnits * percent) + prevUnits;
	 */
	#handleColors(
		prevColor: string,
		newColor: string,
		percent: number
	): string {
		regEx.hexColor.lastIndex = 0;
		if (regEx.hexColor.test(prevColor)) {
			regEx.hexColor.lastIndex = 0;
			//Remove the #
			const prevColorValue = prevColor.split("");
			const newColorValue = newColor.split("");
			newColorValue.shift();
			prevColorValue.shift();

			//Replace letters for numbers
			const firstColorInts = this.hexToInts(prevColorValue);
			const secondColorInts = this.hexToInts(newColorValue);

			//Adds the percentage of the second value to the first
			const intsValues = this.#increaseInSets(
				firstColorInts,
				secondColorInts,
				percent,
				0
			);
			const hexColor = this.intToHex(intsValues);
			return hexColor;
		}

		const firstColorValues = this.#exctractNumber(prevColor);
		const secondColorValues = this.#exctractNumber(newColor);
		const colorResult = this.#increaseInSets(
			firstColorValues,
			secondColorValues,
			percent,
			0
		);
		return this.#formattedValues(prevColor, colorResult);
	}

	/**
	 * Add the percentage sent, from the second number to the first
	 * @example
	 * handleUnit("20px 30px 40px","10px 40px 50px",10): "19px 31px 41px"
	 *
	 * -This looks like this
	 * substraction = newUnits - prevUnits;
	 * result = (newUnits * percent) + prevUnits;
	 */
	#handleUnit(prevInts: string, newUnits: string, percent: number) {
		const prevUnitsValues = this.#exctractNumber(prevInts);
		const newUnitsValues = this.#exctractNumber(newUnits);
		const increasedValue = this.#increaseInSets(
			prevUnitsValues,
			newUnitsValues,
			percent,
			2
		);
		const newIntValue = this.#formattedValues(prevInts, increasedValue);
		return newIntValue;
	}

	exec(percent: number) {
		const resultStyles: Partial<CSSStyleDeclaration> = {};

		for (let property in this.newStyles) {
			const prevValue = this.prevStyles[property] as string;
			const newValue = this.newStyles[property] as string;
			if (regEx.color.test(newValue)) {
				regEx.color.lastIndex = 0;

				resultStyles[property] = this.#handleColors(
					prevValue,
					newValue,
					percent
				);
			} else if (regEx.unitTypes.test(newValue)) {
				regEx.unitTypes.lastIndex = 0;
				resultStyles[property] = this.#handleUnit(
					prevValue,
					newValue,
					percent
				);
			} else {
				resultStyles[property] = newValue;
			}
		}
		const cssStyles = this.#JsonToCssText(resultStyles);
		this.styleTag!.innerHTML = `${this.cssSelector}{${cssStyles}}`;
	}

	set run(percent: number) {
		percent = percent / 100;
		this.exec(percent);
	}
}

export default Ayncat