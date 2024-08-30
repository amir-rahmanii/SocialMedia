import { iosIcon, linuxIcon, windowsIcon } from "../Components/SvgIcon/SvgIcon"

const svgIconOs = (OsName: string) => {
    switch (OsName) {
        case "Windows":
            return windowsIcon
        case "iOS":
            return iosIcon
        case "Linux":
            return linuxIcon
        case "Mac OS":
            return iosIcon
        default:
            return 'Unknown'
    }
}

const svgIconBrowser = (browserName: string) => {
    switch (browserName.toLowerCase()) {
        case 'chrome':
            return '/src/assets/images/browser/chrome.png';
        case 'firefox':
            return '/src/assets/images/browser/firefox.png';
        case 'safari':
            return '/src/assets/images/browser/safari.png';
        case 'edge':
            return '/src/assets/images/browser/edge.png';
        case 'opera':
            return '/src/assets/images/browser/opera.jpg';
        default:
            return '';
    }
};

export { svgIconOs, svgIconBrowser }