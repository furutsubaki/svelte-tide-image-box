export interface TideImage {
    [key: string]: unknown;
    src: string;
    alt: string;
    thumbnail?: string;
}
export interface TideImageOptions {
    appendToNode: HTMLElement;
}
