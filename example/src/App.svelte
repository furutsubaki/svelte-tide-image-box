<script lang="ts">
    import TideImageBox from '../../src/TideImageBox.svelte';
    const images = [
        {
            src: '/src/assets/sample1.jpg',
            alt: 'sample1',
        },
        {
            src: '/src/assets/sample2.jpg',
            alt: 'sample2',
        },
    ];
    const image = [images[0]];

    const onCatchDispatch = ({ detail: image }) => {
        // on:closeのみデータはありません
        console.log(image);
    };
</script>

<main>
    <h1>Example</h1>
    <div>
        <h2>one image</h2>
        <p>`images`にTideImageを一つだけ入れた配列を指定することで、左右の切り替えUIが非表示になります</p>
        <TideImageBox images={image} />
    </div>
    <div>
        <h2>multi image</h2>
        <p>`images`に複数のTideImageを入れることで左右に画像切り替えUIを表示します</p>
        <TideImageBox {images} on:open={onCatchDispatch} on:close={onCatchDispatch} on:change={onCatchDispatch} />
    </div>
    <div>
        <h2>use slot</h2>
        <p>default slotで画像の表示を親で制御できます。ただし`onClick`メソッドは必ず使用してください</p>
        <TideImageBox {images} let:tideImages let:onClick>
            {#each tideImages as image, i (i)}
                <a class="link" href={image.src} on:click={(e) => onClick(e, image)}>
                    <img src={image.src} alt={image.alt} class="img" />
                </a>
            {/each}
        </TideImageBox>
    </div>
</main>

<style lang="scss">
    .img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        max-height: 300px;
        aspect-ratio: 1/1;
    }
</style>
