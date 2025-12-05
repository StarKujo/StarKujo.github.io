// 验证URL - 简化验证逻辑
function IsURL(str_url) {
    // 简化验证，只检查基本的URL格式
    if (!str_url) return false;
    
    // 检查是否是有效的图片URL
    try {
        new URL(str_url);
        return true;
    } catch (e) {
        // 如果不是完整URL，可能是相对路径
        return str_url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) !== null;
    }
}

function getpic() {
    var x = document.getElementById("giveurl").value;
    var picElement = document.getElementById("pic");
    var Img = new Image();
    
    // 处理跨域问题
    Img.crossOrigin = "Anonymous";
    
    // 添加加载完成事件
    Img.onload = function() {
        // 图片加载完成后设置到img元素
        picElement.src = Img.src;
        document.getElementById("two").innerHTML = "图片加载成功: " + x;
        
        // 等待img元素加载完成后再生成字符画
        picElement.onload = function() {
            ptoc();
        };
        // 如果图片已缓存，可能不会触发onload，所以直接调用
        if (picElement.complete) {
            ptoc();
        }
    };
    
    Img.onerror = function() {
        document.getElementById("two").innerHTML = "图片加载失败！请检查URL或图片是否支持跨域";
        // 恢复默认图片
        picElement.src = "sy/defult.jpg";
    };
    
    if (!x) {
        x = "sy/defult.jpg";
    }
    
    if (IsURL(x)) {
        Img.src = x;
    } else {
        document.getElementById("two").innerHTML = "请输入有效的图片地址！";
        Img.src = "sy/defult.jpg";
    }
}

function ptoc() {
    var canvas_obj = document.getElementById("myCanvas");
    var ctx = canvas_obj.getContext("2d");  
    var img_obj = document.getElementById("pic");
    
    // 等待图片完全加载
    if (!img_obj.complete || img_obj.naturalWidth === 0) {
        setTimeout(ptoc, 100);
        return;
    }
    
    var width = canvas_obj.width;
    var height = canvas_obj.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 将图片绘制到画布上
    ctx.drawImage(img_obj, 0, 0, width, height);
    
    // 获取画布上的图像像素矩阵
    var imgData_obj = ctx.getImageData(0, 0, width, height);
    var imgData = imgData_obj.data;
    
    var imgArr = [];
    for(var i = 0; i < imgData.length / 4; ++i) {
        imgArr[i] = new Array();
        for(var j = 0; j < 3; ++j) {
            imgArr[i][j] = imgData[i * 4 + j];
        }
        imgArr[i][3] = (imgArr[i][0] * 0.299 + imgArr[i][1] * 0.587 + imgArr[i][2] * 0.114);
    }
    
    var map = ['@', '#', 'W', 'D', 'G', 'k', 't', 'j', 'i', ';', ':', ',', '.', '&nbsp;'];
    var res = "";
    
    for(var i = 0; i < height; ++i) {
        for(var j = 0; j < width; ++j) {
            var index = i * width + j;
            if (index < imgArr.length) {
                var brightness = imgArr[index][3];
                var mapIndex = parseInt(brightness * map.length / 256);
                mapIndex = Math.min(mapIndex, map.length - 1); // 确保不越界
                res = res + map[mapIndex];
            }
        }
        res = res + "<br>";
    }
    
    document.getElementById("out").innerHTML = res;
}

// 页面加载完成后初始化
window.onload = function() {
    // 设置初始图片
    var picElement = document.getElementById("pic");
    picElement.onload = function() {
        ptoc();
    };
    
    // 如果默认图片已加载，直接生成字符画
    if (picElement.complete) {
        ptoc();
    }
    
    // 为输入框添加回车键支持
    document.getElementById("giveurl").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            getpic();
        }
    });
};

