export default class CompressImg {
    constructor() {
        console.log(this)
    }
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "#fff";
    }
    createImg() {
        this.img = new Image();
        this.img.crossOrigin = "anonymous";
    }

    createUrl(file) {
        let url;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url
    }
    drawImg(ratio) {
        let { width, height } = this.img;
        if (width > height) {
            if (width > 2000) {
                ratio = (2000 / width).toFixed(1) - 0 + Number(ratio);
                this.img.width = 2000;
                this.img.height = height * (2000 / width);
            }
        } else {
            if (height > 2000) {
                ratio = (2000 / height).toFixed(1) - 0 + Number(ratio);
                this.img.height = 2000;
                this.img.width = width * (2000 / height);
            }
        }
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        let product = this.img.width * this.img.height;
        if (product > 1000000) {
            let step = 4;
            let canvasBlock = Math.floor(this.canvas.width / step);
            let imgBlock = Math.floor(width / step);
            for (let i = 0; i < step; i++) {
                this.context.drawImage(
                    this.img,
                    imgBlock * i,
                    0,
                    imgBlock,
                    height,
                    canvasBlock * i,
                    0,
                    canvasBlock,
                    this.canvas.height
                );
            }
        } else {
            this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);
        }
        return ratio
    }
    toTempImg(ratio) {
        return new Promise((resolve, reject) => {
            this.canvas.toBlob(file => {
                if (!file) {
                    reject('导出失败')
                }
                resolve(new File([file], file.name))
            }, "image/jpeg", ratio)
        })
    }
    compress(options = {}) {
        console.log(options)
        let { src, file, ratio = 0.99 } = options
        if (!file && !src) {
            throw ('未传入图片')
        }
        this.createCanvas()
        this.createImg()
        if (src) {
            this.img.src = src
        } else if (file) {
            this.img.src = this.createUrl(file)
        }
        return new Promise((resolve, reject) => {
            this.img.onload = () => {
                this.toTempImg(this.drawImg(ratio)).then(res => {
                    console.log(res)
                    resolve({ url: this.createUrl(res), file: res })
                }).catch(err => {
                    reject('导出失败')
                })
            }
        })
    }

}
