const Keys = {
    image: "--image",
    descriptionBackgroundColor: "--desc-bg-color",
    descriptionContent: "--desc-content",
};

export default Keys;

const defaultValue = {};

defaultValue[Keys.image] = '';
defaultValue[Keys.descriptionBackgroundColor] = 'transparent';
defaultValue[Keys.descriptionContent] = '';

/**
 *
 * @param {string} key
 * @return {string}
 */
export function getDefault(key)
{
    return defaultValue[key];
}