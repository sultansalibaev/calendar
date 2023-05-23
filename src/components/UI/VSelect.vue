<template>
    <div class="custom-select" :tabindex="tabindex" @blur="open = false">
        <div class="selected" :class="{ open: open }" @click="open = !open">
            <img v-if="has_img" :src="imgUrl(selected.img)" width="15" :alt="selected.name" />
            {{ selected.name }}
        </div>
        <div class="items" :class="{ selectHide: !open }">
            <div v-for="(option, i) of options" :key="i" @click="
                selected = option;
                open = false;
                $emit('input', option);
            ">
                <img v-if="has_img" :src="imgUrl(option.img)" width="15" :alt="option.name" />
                {{ option.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        has_img: {
            type: Boolean,
            required: false,
            default: true,
        },
        default: {
            type: String,
            required: false,
            default: null,
        },
        tabindex: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        return {
            selected: this.default
                ? { name: this.default }
                : this.options.length > 0
                    ? this.options[this.tabindex]
                    : null,
            open: false,
        };
    },
    methods: {
        imgUrl(pet) {
            if (this.has_img) {
                var images = require.context('@/assets/', false, /\.png$/)
                return images('./' + pet + ".png")
            }
        }
    },
    mounted() {
        this.$emit("input", this.selected);
    },
};
</script>

<style scoped>
.custom-select {
    width: 120px;
    font-size: 12px;
    position: relative;
    text-align: left;
    outline: none;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
}

.custom-select .selected {
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, .3);
    color: black;
    display: flex;
    align-items: center;
    padding-left: .7em;
    cursor: pointer;
    user-select: none;
}
.custom-select .selected img {
    margin-right: .5em;
}

.custom-select .selected.open {
    border: 1px solid #135de6;
    border-radius: 3px 3px 0px 0px;
}

.custom-select .selected:after {
    position: absolute;
    z-index: 2;
    content: "";
    top: calc(50% - 2.5px);
    right: 1em;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    border-color: black transparent transparent transparent;
}

.custom-select .items {
    color: black;
    border-radius: 0px 0px 3px 3px;
    overflow: hidden;
    border-right: 1px solid #135de6;
    border-left: 1px solid #135de6;
    border-bottom: 1px solid #135de6;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
}

.custom-select .items div {
    display: flex;
    align-items: center;
    height: 32px;
    position: relative;
    z-index: 2;
    color: black;
    padding-left: .7em;
    cursor: pointer;
    user-select: none;
    background-color: white;
}
.custom-select .items div img {
    margin-right: .5em;
}

.custom-select .items div:hover {
    background: #c6c7fa;
    /*background-color: #ad8225;*/
}

.selectHide {
    display: none;
}
</style>
