/**
 *Handles possible errors when using Ayncat.
 */
class HandleErrors {
	/**
	 *Check for the existence of the style tag with id "ayncatstyles"
	 *as this is where the css styles will be injected.
	 *@example
	 *styleTag(): HTMLStyleElement
	 */
	styleTag(): HTMLStyleElement {
		let styleTag = document.getElementById(
			"ayncatstyles"
		) as HTMLStyleElement;

		if (!styleTag) {
			const tag = document.createElement("STYLE") as HTMLStyleElement;
			tag.id = "ayncatstyles";

			document.querySelector("HEAD")!.appendChild(tag);
			return tag;
		} else if (styleTag.tagName != "STYLE") {
			throw new Error(`
				You should not declare any html tags with the id ayncatstyles, as this is the id used by ayncat
			`);
		}
		return styleTag;
	}

	/**
	 *
	 * Make sure css values are of the same type, to avoid a malfunction when incrementing them.
	 * @example
	 * intDataTypesEqual("12px", "12pt", "margin"): throw Error
	 * intDataTypesEqual("12px", "12px", "margin"): void
	 * 
	 */
	intDataTypesEqual(prevValue: string, newValue: string, property: string) {
		prevValue = prevValue.trim();
		newValue = newValue.trim();

		/**
		 * Check if the color types match
		 */
		if (regEx.color.test(prevValue) && regEx.color.test(newValue)) {
			const firstType = regEx.hexColor.test(prevValue)
				? "HEX"
				: prevValue.split("(")[0];

			const secondType = regEx.hexColor.test(prevValue)
				? "HEX"
				: prevValue.split("(")[0];

			if (firstType != secondType) {
				throw new Error(`
                    The first color type in ${property} uses ${firstType.toUpperCase()} 
                    and the second uses ${secondType.toUpperCase()}.
                    Make sure they are both the same type.
                `);
			}
		} else {
			if (regEx.color.test(newValue)) {
				throw Error(` 
                    The first data in ${property} is of type color,
                    but the second does not correspond to the type color
                `);
			}
			if (regEx.color.test(prevValue)) {
				throw Error(`
                    The second data in ${property} is of type color,
                    but the first does not correspond to the type color 
                `);
			}
		}

		if (regEx.color.test(prevValue)) {
			if (!regEx.color.test(newValue)) {
				regEx.color.lastIndex = 0;
			}
		}

		/**
		 * Check if the units of measure match
		 */
		if (
			regEx.unitTypes.test(prevValue) ||
			regEx.unitTypes.test(newValue)
		) {
			const unitTypeError = (word: string) => {
				throw Error(`
                    The ${word} data in ${property} is of type unit, 
                    but the second does not correspond
                `);
			};

			if (!regEx.unitTypes.test(prevValue)) unitTypeError("second");
			if (!regEx.unitTypes.test(newValue)) unitTypeError("first");

			const firstsValues = prevValue.split(" ");
			const secondsValues = newValue.split(" ");
			const defFor = (
				data: string,
				index: number,
				othersData: string[],
				word: string,
				word2: string
			) => {
				if (!othersData[index]) {
					throw Error(`
                        CSS ${property}
                        ${
							index + 1
						} values were found in ${word} styles but only ${index} were found in the ${word2} styles
                    `);
				}

				const firstSymbol = data.split(regEx.unitTypesSybol)[1];
				regEx.unitTypesSybol.lastIndex = 0;

				const secondSymbol = othersData[index].split(
					regEx.unitTypesSybol
				)[1];

				regEx.unitTypesSybol.lastIndex = 0;

				if (firstSymbol != secondSymbol) {
					throw Error(`
                            CSS ${property}
                            ${word} styles use the unit ${firstSymbol}
                            but the ${word2} styles uses ${secondSymbol}
                            Make sure you enter the same unit type
                    `);
				}
			};

			firstsValues.forEach((data, index) =>
				defFor(data, index, secondsValues, "prev", "new")
			);
			secondsValues.forEach((data, index) =>
				defFor(data, index, firstsValues, "new", "prev")
			);
		}

		return;
	}

	/**
	 *
	 *Verifies that the two style objects have the same properties and their values are of the same type.
	 *@example
	 *dataTypes({margin: "3px", padding:"7px"}, {margin:"5px"}): throw Error
	 *
	 *@example
	 *dataTypes({margin: "3px"}, {margin:"5px"}): void
	 */
	dataTypes(
		prevStyle: Partial<CSSStyleDeclaration>,
		newStyle: Partial<CSSStyleDeclaration>
	) {
		const handleError = (
			property: string,
			otherPropertys: Partial<CSSStyleDeclaration>,
			groupNames: string[]
		) => {
			if (!(property in otherPropertys)) {
				throw new Error(`
                    Property ${property} found in ${groupNames[0]}
                    but not found in ${groupNames[1]}
                `);
			}

			const firstValue: string = prevStyle[property];
			const secondValue: string = newStyle[property];
			this.intDataTypesEqual(firstValue, secondValue, property);
		};

		for (let property in prevStyle) {
			handleError(property, newStyle, ["default style", "new style"]);
		}
		for (let property in newStyle) {
			handleError(property, prevStyle, ["new style", "default style"]);
		}
	}
}
