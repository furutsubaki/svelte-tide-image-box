<script lang="ts">
    import { portal } from 'svelte-portal';
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    interface TideImage {
        [key: string]: unknown;
        src: string;
        alt: string;
        thumbnail?: string;
    }
    interface TideOptions {
        appendToNode: HTMLElement;
    }
    $: defaultOptions = {
        appendToNode: null as unknown as HTMLElement,
    } as TideOptions;

    export let images: TideImage[];
    export let options: TideOptions = defaultOptions;

    const firstIndex = 0;
    $: lastIndex = images.length - 1;
    $: createOptions = { ...defaultOptions, ...options };

    const dispatch = createEventDispatcher();
    let isMounted = false;
    let currentImage: TideImage = null as unknown as TideImage;

    const onClick = (e: MouseEvent, image: TideImage) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) {
            // metaKey使用時はdefault動作
            return;
        }

        // 画像展開
        e.preventDefault();
        currentImage = image;
        dispatch('open', currentImage);
    };
    const onClose = () => {
        // 画像格納
        currentImage = null as unknown as TideImage;
        dispatch('close');
    };
    const onPrev = (image: TideImage) => {
        // 前の画像に変更
        const currentImageIndex = images.findIndex((img) => img.src === image.src);
        const prevIndex = currentImageIndex === firstIndex ? lastIndex : currentImageIndex - 2;
        currentImage = images[prevIndex];
        dispatch('change', currentImage);
    };
    const onNext = (image: TideImage) => {
        // 次の画像に変更
        const currentImageIndex = images.findIndex((img) => img.src === image.src);
        const nextIndex = currentImageIndex === lastIndex ? firstIndex : currentImageIndex + 1;
        currentImage = images[nextIndex];
        dispatch('change', currentImage);
    };
    onMount(() => {
        isMounted = true;
    });
</script>

<div class="tide-images" class:is-not-mounted={!isMounted}>
    {#if $$slots.default}
        <slot tideImages={images} onClick={(e, image) => onClick(e, image)} />
    {:else}
        {#each images as image, i (i)}
            <a class="tide-link" href={image.thumbnail ?? image.src} on:click={(e) => onClick(e, image)}>
                <img src={image.src} alt={image.alt} class="tide-img" />
            </a>
        {/each}
    {/if}
    {#if currentImage}
        <div class="tide-show-image" use:portal={createOptions.appendToNode ?? document.body} hidden transition:fade>
            <button type="button" class="tide-overlay" on:click|preventDefault={() => onClose()} />
            <img src={currentImage.src} alt={currentImage.alt ?? ''} class="tide-current-image" transition:fade />
            {#if images.length > 1}
                <button type="button" class="prev-button" on:click|preventDefault={() => onPrev(currentImage)} />
                <button type="button" class="next-button" on:click|preventDefault={() => onNext(currentImage)} />
            {/if}
            <button type="button" class="close-button" on:click|preventDefault={() => onClose()} />
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
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
            position: fixed;
            inset: 0;
            margin: auto;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #2d2d2dcc;
        }
        .tide-current-image {
            position: fixed;
            inset: 0;
            margin: auto;
            object-fit: contain;
            max-width: calc(100% - 48px);
            max-height: calc(100% - 48px);
        }
        .prev-button {
            position: fixed;
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
                position: fixed;
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
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            width: 24px;
            margin: auto;
            padding: 0;
            padding-left: 5px;
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
                position: fixed;
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
            position: fixed;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
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
                position: fixed;
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
