<script lang="ts" context="module">
export interface TideImage {
    [key: string]: unknown;
    src: string;
    alt: string;
    thumbnail?: string;
}
export interface TideImageOptions {
    appendToNode?: HTMLElement;
    isShowCaption?: boolean;
    canEscKeyClose?: boolean;
    canArrowKeyChange?: boolean;
    canSwipeDownClose?: boolean;
    canSwipeChange?: boolean;
    canScrollNone?: boolean;
    scrollNoneToNode?: HTMLElement;
}
</script>

<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { portal } from 'svelte-portal';

$: defaultOptions = {
    appendToNode: null as unknown as HTMLElement,
    isShowCaption: false,
    canEscKeyClose: true,
    canArrowKeyChange: true,
    canSwipeDownClose: true,
    canSwipeChange: true,
    canScrollNone: true,
    scrollNoneToNode: null as unknown as HTMLElement,
} as TideImageOptions;

let className = '';
export let images: TideImage[];
export let options: TideImageOptions = defaultOptions;
export { className as class };

const firstIndex = 0;
$: lastIndex = images.length - 1;
$: op = { ...defaultOptions, ...options };

$: if (typeof document !== 'undefined') {
    // イベントリスナー追加
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('touchstart', onSwipeStart);
    document.addEventListener('touchmove', onSwipeMove);
    document.addEventListener('touchend', onSwipeEnd);
}

const dispatch = createEventDispatcher();
let isMounted = false;
let currentImage: TideImage = null as unknown as TideImage;
$: currentIndex = images.findIndex((i) => i === currentImage);

const onClick = (e: MouseEvent, image: TideImage) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
        // metaKey使用時はdefault動作
        return;
    }
    e.preventDefault();

    if (op.canScrollNone) {
        const scrollNoneTargetNode = op.scrollNoneToNode ?? document.body;
        scrollNoneTargetNode.style.overflow = 'hidden';
    }

    // 画像表示
    currentImage = image;

    // 通知
    dispatch('open', currentImage);
};
export const onClose = () => {
    // イベントリスナー削除
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('touchstart', onSwipeStart);
    document.removeEventListener('touchmove', onSwipeMove);
    document.removeEventListener('touchend', onSwipeEnd);

    // 画像格納
    currentImage = null as unknown as TideImage;

    if (op.canScrollNone) {
        const scrollNoneTargetNode = op.scrollNoneToNode ?? document.body;
        scrollNoneTargetNode.style.overflow = null as unknown as string;
    }
    dispatch('close');
};
const onPrev = (image: TideImage) => {
    // 前の画像に変更
    const currentImageIndex = images.findIndex((img) => img.src === image.src);
    const prevIndex =
        currentImageIndex === firstIndex ? lastIndex : currentImageIndex - 1;
    currentImage = images[prevIndex];
    dispatch('change', currentImage);
};
const onNext = (image: TideImage) => {
    // 次の画像に変更
    const currentImageIndex = images.findIndex((img) => img.src === image.src);
    const nextIndex =
        currentImageIndex === lastIndex ? firstIndex : currentImageIndex + 1;
    currentImage = images[nextIndex];
    dispatch('change', currentImage);
};

const onKeyDown = (e: KeyboardEvent) => {
    if (!currentImage) return;

    if (op.canEscKeyClose && e.code === 'Escape') {
        // ESCで閉じる
        onClose();
    }

    if (op.canArrowKeyChange && e.code === 'ArrowLeft') {
        // 左矢印で戻る
        onPrev(currentImage);
    }

    if (op.canArrowKeyChange && e.code === 'ArrowRight') {
        // 右矢印で戻る
        onNext(currentImage);
    }
};

const swipe = {
    flg: false,
    threshold: 100,
    start: {
        x: 0,
        y: 0,
    },
    move: {
        x: 0,
        y: 0,
    },
};
const onSwipeStart = (e: TouchEvent) => {
    swipe.flg = true;
    swipe.start.x = e.touches[0].screenX;
    swipe.start.y = e.touches[0].screenY;
};
const onSwipeMove = (e: TouchEvent) => {
    swipe.move.x = e.touches[0].screenX - swipe.start.x;
    swipe.move.y = e.touches[0].screenY - swipe.start.y;
};
const onSwipeEnd = () => {
    swipe.flg = false;
    if (op.canSwipeChange && swipe.move.x < -10) {
        onPrev(currentImage);
    } else if (op.canSwipeChange && swipe.move.x > 10) {
        onNext(currentImage);
    } else if (op.canSwipeDownClose && swipe.move.y > 10) {
        onClose();
    }
};
onMount(() => {
    isMounted = true;
});
</script>

<div class="tide-images  {className}" class:is-not-mounted={!isMounted}>
    {#if $$slots.default}
        <slot tideImages={images} {onClick} />
    {:else}
        {#each images as image, i (i)}
            <a
                class="tide-link"
                href={image.src}
                on:click={(e) => onClick(e, image)}
            >
                <img
                    src={image.thumbnail ?? image.src}
                    alt={image.alt}
                    class="tide-img"
                />
            </a>
        {/each}
    {/if}
    {#if currentImage}
        <div
            class="tide-show-image"
            use:portal={op.appendToNode ?? document.body}
            hidden
            transition:fade
        >
            <button
                type="button"
                class="tide-overlay"
                on:click|preventDefault={() => onClose()}
            />
            <div class="box">
                <img
                    src={currentImage.src}
                    alt={currentImage.alt ?? ''}
                    class="tide-current-image"
                    transition:fade
                />
                <div class="meta">
                    {#if op.isShowCaption && currentImage.alt}
                        <div class="caption">{currentImage.alt}</div>
                    {/if}
                    <div class="meta-text">
                        image {currentIndex + 1} of {images.length}
                    </div>
                </div>
            </div>
            {#if images.length > 1}
                <button
                    type="button"
                    class="prev-button"
                    on:click|preventDefault={() => onPrev(currentImage)}
                />
                <button
                    type="button"
                    class="next-button"
                    on:click|preventDefault={() => onNext(currentImage)}
                />
            {/if}
            <button
                type="button"
                class="close-button"
                on:click|preventDefault={() => onClose()}
            />
        </div>
    {/if}
</div>

<style lang="scss">
button {
    cursor: pointer;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
}
.tide-images {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    &.is-not-mounted {
        pointer-events: none;
    }
    .tide-img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        max-height: 300px;
        aspect-ratio: 1/1;
    }
}

.tide-show-image {
    position: fixed;
    inset: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    .tide-overlay {
        position: absolute;
        inset: 0;
        margin: auto;
        padding: 0;
        width: 100%;
        height: 100%;
        background-color: #2d2d2dcc;
        transition: background-color 0.2s;
    }
    .box {
        position: absolute;
        inset: 0;
        margin: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        .tide-current-image {
            pointer-events: initial;
            object-fit: contain;
            max-width: 100%;
            max-height: 100%;
        }
        .meta {
            display: flex;
            flex-direction: column;
            width: 100%;
            .caption {
                font-weight: bold;
            }
            .meta-text {
                font-size: 12px;
                color: #b4c1c8;
                transition: color 0.2s;
            }
        }
    }
    .prev-button {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 24px;
        margin: auto;
        padding: 0;
        padding-left: 7px;
        background-color: transparent;
        @media (hover: hover) {
            &:hover {
                &::before,
                &::after {
                    background-color: #fff;
                }
            }
        }
        @media (hover: none) {
            &:active {
                &::before,
                &::after {
                    background-color: #fff;
                }
            }
        }
        &::before,
        &::after {
            content: '';
            position: absolute;
            display: block;
            width: 12px;
            height: 1px;
            background-color: #cad0ce;
            transition: background-color 0.2s;
        }
        &::before {
            transform: rotateZ(-45deg);
            transform-origin: left;
        }
        &::after {
            transform: rotateZ(45deg);
            transform-origin: left;
        }
    }
    .next-button {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 24px;
        margin: auto;
        padding: 0;
        padding-left: 5px;
        background-color: transparent;
        transition: background-color 0.2s;
        @media (hover: hover) {
            &:hover {
                &::before,
                &::after {
                    background-color: #fff;
                }
            }
        }
        @media (hover: none) {
            &:active {
                &::before,
                &::after {
                    background-color: #fff;
                }
            }
        }
        &::before,
        &::after {
            content: '';
            position: absolute;
            display: block;
            width: 12px;
            height: 1px;
            background-color: #cad0ce;
            transition: background-color 0.2s;
        }
        &::before {
            transform: rotateZ(-45deg);
            transform-origin: right;
        }
        &::after {
            transform: rotateZ(45deg);
            transform-origin: right;
        }
    }
    .close-button {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        margin: 0;
        padding: 0;
        background-color: transparent;
        transition: background-color 0.2s;
        @media (hover: hover) {
            &:hover {
                &::before,
                &::after {
                    background-color: #fff;
                }
            }
        }
        @media (hover: none) {
            &:active {
                &::before,
                &::after {
                    background-color: #fff;
                }
            }
        }
        &::before,
        &::after {
            content: '';
            position: absolute;
            display: block;
            width: 24px;
            height: 1px;
            background-color: #cad0ce;
            transition: background-color 0.2s;
        }
        &::before {
            transform: rotateZ(-45deg);
        }
        &::after {
            transform: rotateZ(45deg);
        }
    }
}
</style>
