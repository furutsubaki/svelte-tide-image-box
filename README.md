# Svelte TideImageBox

Lightbox風のsvelteコンポーネントを提供します。

## npm install

```
npm install -save-dev furutsubaki/svelte-tide-image-box
```

## use

```
<script lang="ts">
import TideImageBox, {type TideImage, type TideImageBoxOption} from 'furutsubaki/svelte-tide-image-box';

const images:TideImage[] = [
    {
        src: '',
        alt: '', // optional
        thumbnail: '', // optional
        // ...other properties
    }
]

// default options (optional)
const optiosn:TideImageBoxOption = {
    appendToNode: document.body,
}

const onCatchDispatch = ({ detail: image }) => {
    // on:closeのみデータはありません
    console.log(image);
};
</script>

<!-- simple -->
<TideImageBox {images} {optiosn} on:open={onCatchDispatch} on:close={onCatchDispatch} on:change={onCatchDispatch} />

<!-- use slot -->
<TideImageBox {images} let:tideImages let:onClick>
    {#each tideImages as image, i (i)}
        <a class="link" href={image.src} on:click={(e) => onClick(e, image)}>
            <img src={image.src} alt={image.alt} class="img" />
        </a>
    {/each}
</TideImageBox>
```

## event

`on:~`にて各種操作時のeventを取得できます。

|Event|引数|
|---|---|
|`on:open`|表示する`image`|
|`on:close`|表示する`image`|
|`on:change`|-|
