import { androidIcon, iosIcon, linuxIcon, windowsIcon } from "../Components/SvgIcon/SvgIcon"

const svgIconOs = (OsName: string) => {
    switch (OsName) {
        case "Windows":
            return windowsIcon
        case "iOS":
            return iosIcon
        case "Linux":
            return linuxIcon
        case "Android":
            return androidIcon
        default:
            return 'Unknown'
    }
}

const svgIconBrowser = (browserName: string) => {
    switch (browserName.toLowerCase()) {
        case 'chrome':
            return '/images/browser/chrome.png';
        case 'chrome mobile':
            return '/images/browser/chrome.png';
        case 'firefox':
            return '/images/browser/firefox.png';
        case 'firefox mobile':
            return '/images/browser/firefox.png';
        case 'safari':
            return '/images/browser/safari.png';
        case 'mobile safari':
            return '/images/browser/safari.png';
        case 'edge':
            return '/images/browser/edge.png';
        case 'mobile edge':
            return '/images/browser/edge.png';
        case 'opera':
            return '/images/browser/opera.jpg';
        case 'mobile opera':
            return '/images/browser/opera.jpg';
        default:
            return '';
    }
};

export { svgIconOs, svgIconBrowser }