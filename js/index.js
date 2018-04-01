//初始化swiper
{
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'horizontal',
        loop: true,

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // 如果需要滚动条
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    })
}

//滚动条效果
{
    var iscroll = new IScroll('.content', {
        mouseWheel: true,
        scrollbars: true,
        shrinkScrollbars:"scale",
        fadeScrollbars:true,
        click:true
    });
}
//点击新增
{
    $(".add").click(function(){
        $(".mask").show();
        $(".inputarea").slideDown()
    })
    $(".cancel").click(function(){
        $(".mask").hide();
        $(".inputarea").slideUp()
    })
}

//点击提交
{
    $(".submit").click(function(){
        var val=$("#text").val();
        if(val===""){
            alert("请输入内容");
            return;
        }
        $("#text").val("");
        var data=getData();
        var time=new Date().getTime();
        data.push({content:val,time,star:false,done:false});
        savaData(data);
        rander();
        $(".inputarea").slideUp()
        $(".mask").hide();
    });
    $(".update").click(function(){
        var val=$("#text").val();
        if(val===""){
            return;
        }
        $("#text").val("");
        var data=getData();
        var index=$(this).data("index");
        // console.log(index)
        data[index].content=val;
        savaData(data);
        $(".inputarea").transition({
            y:"-62vw"},500,function(){
            $(".mask").hide();
            rander();
        });

    })

    function getData(){
        return localStorage.message?JSON.parse(localStorage.message):[];
    }
    function savaData(data){
        localStorage.message=JSON.stringify(data);
    }
    var state="project";
    function rander(){
        var data=getData();
        var str="";
        data.forEach(function(val,index){
            if(state==="project"&&val.done===false){
            str+="<li id="+index+">" +
                "<p>"+val.content+"</p><time>"+
                parseTime(val.time)+
                "</time><span class="+(val.star?"active":"")+">*</span><div class='changestate'>完成</div>" +
                "</li>"
            }
            else if(state==="done"&&val.done===true){
                str+="<li id="+index+">" +
                    "<p>"+val.content+"</p><time>"+
                    parseTime(val.time)+
                    "</time><span class="+(val.star?"active":"")+">*</span><div class='del'>删除</div>" +
                    "</li>"
            }
        });
        $(".itemlist").html(str);
        iscroll.refresh();
        addTouchEvent();
    }
    rander();
    //时间
    function parseTime(time){
        var data=new Date();
        data.setTime(time);
        var year=data.getFullYear();
        var month=setZero(data.getMonth()+1);
        var day=setZero(data.getDate());
        var hour=setZero(data.getHours());
        var minutes=setZero(data.getMinutes());
        var seconds=setZero(data.getSeconds());
        var time=year+"/"+month+"/"+day+"<br>"+
            hour+":"+minutes+":"+seconds;
        return time;
        console.log(time)
    }
    function setZero(n){
        return n<10?"0"+n:n;
    }

    //侧滑效果
    function addTouchEvent(){
        $(".itemlist>li").each(function(index,ele){
            var hammerobj=new Hammer(ele);
            var max=window.innerWidth/5;
            var movex,sx;
            var state="start";
            var flag=true;
            hammerobj.on("panstart",function(e){
                ele.style.transition="";
                sx=e.center.x;
            })
            hammerobj.on("panmove",function(e){
                var cx=e.center.x;
                movex=cx-sx;
                if(movex>0&&state==="start"){
                    flag=false;
                    return;
                }
                if(movex<0&&state==="end"){
                    flag=false;
                    return;
                }
                if(Math.abs(movex)>max){
                    flag=false;     state=state==="start"?"end":"start";
                    if(state==="end"){
                        $(ele).css("x",-max);
                    }else{
                        $(ele).css("x",0);
                    }
                    return;
                }
                if(state==="end"){
                movex=cx-sx-max;
                }
                flag=true;
                $(ele).css("x",movex);
            })
            hammerobj.on("panend",function(){
             if(!flag)return;
             if(Math.abs(movex)<max/2){
                $(ele).transition({x:0});
                state="start";
            }else{
                 $(ele).transition({x:-max});
                 state="end";
            }
        })
        })
    }


// 完成状态

    $(".project").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        state="project";
        rander();
    })
    $(".done").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        state="done";
        rander();
    })


//点击完成改变状态为完成

    $(".itemlist")
        .on("click", ".changestate", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            data[index].done=true;
            savaData(data);
            rander();
        })
        .on("click", ".del", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            data.splice(index,1);
            savaData(data);
            rander();
        })
        .on("click", "span", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            data[index].star=!data[index].star;
            savaData(data);
            rander();
        })
        .on("click", "p", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            $(".mask").show();
            $(".inputarea").slideDown();
            $("#text").val(data[index].content);
            $(".submit").hide();
            $(".update").show().data("index",index)
            // rander();
        })

}
