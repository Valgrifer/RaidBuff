const styleId = "pseudoStyles";

let pseudoElementStyles = {};

/**
 * Adds pseudo styles to an HTMLElement.
 * @param {string} pseudoElement - The pseudo element name (e.g., "before", "after").
 * @param {string} attribute - The CSS attribute to apply.
 * @param {string} value - The value of the CSS attribute.
 * @returns {HTMLElement} - The HTMLElement with the applied pseudo styles.
 */
HTMLElement.prototype.pseudoStyle = function(pseudoElement, attribute, value)
{
    const headElement = document.head || document.getElementsByTagName("head")[0],
        styleElement = document.getElementById(styleId) || document.createElement("style");
    styleElement.id = styleId;

    let elementStyles = pseudoElementStyles[pseudoElement] || {};
    let style = elementStyles[this.id] || {};

    style[attribute] = value;
    elementStyles[this.id] = style;
    pseudoElementStyles[pseudoElement] = elementStyles;

    let cssRules = "";
    for (const pseudoElement of Object.keys(pseudoElementStyles))
    {
        const elementStyles = pseudoElementStyles[pseudoElement];
        for (const elementId of Object.keys(elementStyles))
        {
            const styles = elementStyles[elementId];
            cssRules += ` #${elementId}:${pseudoElement} {`;

            for (const attribut of Object.keys(styles)) {
                cssRules += `${attribut}:${styles[attribut]};`;
            }

            cssRules += "}";
        }
    }

    styleElement.innerHTML = cssRules;
    headElement.appendChild(styleElement);

    return this;
};

/**
 * Resets all pseudo styles.
 */
export function styleReset()
{
    const styleId = "pseudoStyles";
    let styleElement = document.getElementById(styleId) || document.createElement("style");
    styleElement.id = styleId;
    styleElement.innerHTML = "";
    pseudoElementStyles = {};
}

export const Before = "before";
// noinspection JSUnusedGlobalSymbols
export const After = "after";