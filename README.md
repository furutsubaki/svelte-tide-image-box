# Svelte TideImageBox

Lightbox風のsvelteコンポーネントを提供します。

## npm install

```bash
npm install -save-dev furutsubaki/svelte-tide-image-box
```

## use

```typescript
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
```

### simple

```svelte
<TideImageBox {images} {optiosn} on:open={onCatchDispatch} on:close={onCatchDispatch} on:change={onCatchDispatch} />
```

### use slot

```svelte
<TideImageBox {images} let:tideImages let:onClick>
    {#each tideImages as image, i (i)}
        <a class="link" href={image.src} on:click={(e) => onClick(e, image)}>
            <img src={image.src} alt={image.alt} class="img" />
        </a>
    {/each}
</TideImageBox>
```

## options

|property|type|default|desc|
|---|---|---|---|
|appendToNode|HTMLElement|document.body|ImageBoxのDOMを追加する要素を設定|

## event

`on:~`にて各種操作時のeventを取得できます。

|Event|引数|
|---|---|
|`on:open`|表示する`image`|
|`on:close`|---|
|`on:change`|変更後の`image`|
