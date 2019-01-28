<template>
<el-container>
    <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo" @select="_switchParse" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">

            <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span slot="title">generalBasic</span>
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-document"></i>
                <span slot="title">webImage</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-setting"></i>
                <span slot="title">handwriting</span>
            </el-menu-item>
        </el-menu>

    </el-aside>
    <el-container>
        <el-main>

            <el-container>
                <el-aside width="350px">

                    <div class="souceBox">
                        <div class="sourceImg">
                            <img contenteditable="true" :src="imgSource">
                        </div>

                            <div class="upload" v-if="type!=2">
                                <input type="file" id="btnUpload" @change="_uploadChange" accept="image/png,image/gif" />
                            </div>
                                <div class="upload" v-if="type==2">
                                    <input type="text" v-model="webUrl" id="webUrl">
                                    <el-button @click="_parseWebUrl" type="primary">主要按钮</el-button>
                                </div>
                            </div>

                </el-aside>
                <el-main>
                    <ul class="wordsResult">
                        <li class="item" :key="key" v-for="(item,key) in words_result">
                            {{item.words}}
                        </li>
                    </ul>
                </el-main>
            </el-container>

        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {

    data() {
        return {
            type: 1,
            imgSource: false,
            urls: ['', '/ocr/api/generalBasic', '/ocr/api/webImage', '/ocr/api/handwriting'],
            words_result: [],
            webUrl: ""
        }
    },

    methods: {

        //切换解析方式
        _switchParse(type) {
            this.type = type;
        },

        //上传图片
        _uploadChange() {

            if (event.target.files.length > 0) {

                var fileImg = event.target.files[0];

                var reader = new FileReader(),
                    that = this;

                reader.onload = function (data) {
                    that.imgSource = data.target.result;
                    that._parseImgText();
                };
                reader.readAsDataURL(fileImg);
            }

        },

        //解析远程图片url
        _parseWebUrl() {

            var that = this,
                webUrl = this.webUrl;
            if (!webUrl) {
                alert("请输入要解析的地址");
                return;
            }

            this.imgSource = webUrl;

            $.ajax({
                type: "post",
                url: this.urls[this.type],
                data: {
                    imgUrl: webUrl
                },
                success: function (data) {

                    if (data.error_msg) {
                        that.words_result = [{
                            words: data.error_msg
                        }];
                    } else {
                        that.words_result = data.words_result;
                    }
                },
                error: function (error) {
                    alert(error);
                }
            });
        },

        //解析图片文字
        _parseImgText() {

            var base64 = this.imgSource.split(",")[1],
                that = this;

            $.ajax({
                type: "post",
                url: this.urls[this.type],
                data: {
                    base64: base64
                },
                success: function (data) {
                    if (data.error_msg) {
                        that.words_result = [{
                            words: data.error_msg
                        }];
                    } else {
                        that.words_result = data.words_result;
                    }
                },
                error: function (error) {
                    alert(error);
                }
            });
        }
    },

}
</script>

<style lang="less">
.el-container {
    height: 100%;

    .el-menu {
        height: 100%;
    }

    .el-aside {
        border-right: 1px #ccc solid;
    }

    .souceBox {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .sourceImg {
        flex: 1;

        img {
            width: 100%;
        }
    }

    .wordsResult {
        .item {
            line-height: 35px;
        }
    }
}

#webUrl {
    display: block;
    height: 29px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
}
</style>
