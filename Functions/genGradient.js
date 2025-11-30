module.exports = {
    genGradient: (color1, color2, steps) => {
        // strip the leading # if it's there
        color1 = color1.replace(/^\s*#|\s*$/g, '');
        color2 = color2.replace(/^\s*#|\s*$/g, '');

        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if (color1.length === 3) {
            color1 = color1.replace(/(.)/g, '$1$1');
        }

        if (color2.length === 3) {
            color2 = color2.replace(/(.)/g, '$1$1');
        }

        // get colors
        const start_red = parseInt(color1.substr(0, 2), 16);
        const start_green = parseInt(color1.substr(2, 2), 16);
        const start_blue = parseInt(color1.substr(4, 2), 16);

        const end_red = parseInt(color2.substr(0, 2), 16);
        const end_green = parseInt(color2.substr(2, 2), 16);
        const end_blue = parseInt(color2.substr(4, 2), 16);

        // calculate new color
        let diff_red = end_red - start_red;
        let diff_green = end_green - start_green;
        let diff_blue = end_blue - start_blue;

        diff_red = (diff_red * steps + start_red).toString(16).split('.')[0];
        diff_green = (diff_green * steps + start_green).toString(16).split('.')[0];
        diff_blue = (diff_blue * steps + start_blue).toString(16).split('.')[0];

        // ensure 2 digits by color
        if (diff_red.length === 1) diff_red = '0' + diff_red;
        if (diff_green.length === 1) diff_green = '0' + diff_green;
        if (diff_blue.length === 1) diff_blue = '0' + diff_blue;

        return '#' + diff_red + diff_green + diff_blue;
    },
};
