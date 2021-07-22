function add() {
    var  x = document.getElementById("one").innerText
    x++
    var  y = document.getElementById("one")
    y.innerHTML = x
}

//验证URL
function IsURL (str_url) { 
    var strRegex = '^((https|http|ftp|rtsp|mms)?://)' 
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
        + '|' // 允许IP和DOMAIN（域名） 
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
        + '[a-z]{2,6})' // first level domain- .com or .museum 
        + '(:[0-9]{1,4})?' // 端口- :80 
        + '((/?)|' // a slash isn't required if there is no file name 
        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
    var re=new RegExp(strRegex); 
        //re.test() 
    if (re.test(str_url)) { 
        return true; 
    } else { 
        return false; 
    } 
 }

function getpic(){
    var x = document.getElementById("giveurl").value
    if(x==null){
        x = "sy/defult.jpg"
    }
    document.getElementById("two").innerHTML = x
    var Img = new Image()
    if(IsURL(x)) {
        document.getElementById("pic").src = x
        ptoc()
      }
    else{
        document.getElementById("two").innerHTML = "憨批地址错了！"
        ptoc()
      }
}

function ptoc(){
    var canvas_obj = document.getElementById("myCanvas");
    var ctx = canvas_obj.getContext("2d");  
    var img_obj =  document.getElementById("pic")               // 设置在画布上绘图的环境  
    ctx.drawImage(img_obj, 0, 0);             
    var width =   canvas_obj.width
    var height =   canvas_obj.height          // 将图片绘制到画布上
    var imgData_obj = ctx.getImageData(0,0,width,height)  // 获取画布上的图像像素矩阵
    var imgData = imgData_obj.data
    console.log(imgData.length)

    var imgArr = [];
    for(var i=0; i<imgData.length/4; ++i){
        imgArr[i] = new Array()
        for(var j=0;j<3;++j){
         imgArr[i][j]=imgData[i*4+j]
        }
        imgArr[i][3]=(imgArr[i][0]*0.299+imgArr[i][1]*0.587+imgArr[i][2]*0.114)
        console.log(imgArr[i][0])
    }
    var map = ['@','#','W','D','G','k','t','j','i',';',':',',','.',' ']
    var res
    for(var i=0; i< height; ++i){
        for(var j=0;j < width;++j){
            res = res + map[imgArr[i*width+j][3]*map.length/256]
        }
        res = res + "<br>"
    }
    document.getElementById("out").innerHTML = res
}
