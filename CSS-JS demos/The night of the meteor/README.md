
### 1、效果图
完整效果，请移步 [codepen-流星雨案例](https://codepen.io/HaiLoongLyu/full/Lgqbzy/)

![](https://img2018.cnblogs.com/blog/1080150/201810/1080150-20181031235706644-1683123670.gif)

### 2、案例解析

- **HTML**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;由于节点很多，并且我想尽量做得逼真有趣有点，还给节点加了随机位置。所以节点的输出都是用JS控制的，HTML这边只写了几个父元素盒子，加上相应的id名和class类名，结构相对简单。

- **CSS**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CSS部分的难点就是流星的样式和用圈圈画云层，然后将云层堆叠出立体效果。<br><br>
> **首先说一下流星的样式：**

```
#sky .star {
     position: absolute;
     opacity: 0;
     z-index: 10000;
 }
 
 .star::after {
     content: "";
     display: block;
     border: solid;
     border-width: 2px 0 2px 80px;
     /*流星随长度逐渐缩小*/
     border-color: transparent transparent transparent rgba(255, 255, 255, 1);
     border-radius: 2px 0 0 2px;
     transform: rotate(-45deg);
     transform-origin: 0 0 0;
     box-shadow: 0 0 20px rgba(255, 255, 255, .3);
 }

```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;先提取了公共样式，添加定位属性；<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后在star后通过after伪类添加流星，**用border特性画：**<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1）模型绘制：** **border-width**的顺序为四边**top、right、bottom、left**，同理**border-color**的顺序也为四边**top、right、bottom、left**。这样将border-width与border-color一一对应后，就能看出**2px是流星的宽度，80px是流星的长度，而0px就是流星的尾巴**。这样就形成了一个**头部2px宽，尾部0px，长度80px的流星模型**;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2）稍微逼真：** 通过**border-radius**给流星的头部增加个圆角，让它看起来emmmmmmm更逼真？最后通过**roteta**旋转一个角度，让它看起来像是往下掉;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3）增加闪光：** 通过**box-shadow** 给流星增加一点光晕，让它看起来有闪光的效果;<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过以上3步，一个流星就画好了。<br><br>

> **然后是画云：**

```
因为云的代码比较长，这里就不贴出来了。方法无非是通过一个一个的圆，相互叠加覆盖，完成一个云朵的形状;
完成一个云层之后，copy一个，然后多个云层通过rotate、opacity、left定位等，做出一个渐隐叠加的立体效果;
```

- **JS**

***JS部分以流星举例说明***

```
setInterval(function() {
    const obj = addChild("#sky", "div", 2, "star"); //插入流星

    for (let i = 0; i < obj.children.length; i++) {
        //随机位置
        const top = -50 + Math.random() * 200 + "px",
            left = 200 + Math.random() * 1200 + "px",
            scale = 0.3 + Math.random() * 0.5;
        const timer = 1000 + Math.random() * 1000;

        obj.children[i].style.top = top;
        obj.children[i].style.left = left;
        obj.children[i].style.transform = `scale(${scale})`;
        
        //添加动画
        requestAnimation({
            ele: obj.children[i],
            attr: ["top", "left", "opacity"],
            value: [150, -150, .8],
            time: timer,
            flag: false,
            fn: function() {
                requestAnimation({
                    ele: obj.children[i],
                    attr: ["top", "left", "opacity"],
                    value: [150, -150, 0],
                    time: timer,
                    flag: false,
                    fn: () => {
                        obj.parent.removeChild(obj.children[i]); //动画结束删除节点
                    }
                })
            }
        });
    }

}, 1000);

```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里边用到了我自己封装的**两个方法**，一个是基于requestAnimationFrame的**requestAnimation**，以及基于appendChild的**addChild**。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了达成星星位置随机的效果，通过定时器setInterval不停的**插入**与**删除**流星：<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**首先**，每次添加**2个流星**到页面，但是**定时器的间隔时间小于流星的动画时间**，这样就能保证页面中的流星的数量不是一个固定值，但肯定是大于2的。不然一次2个流星略显冷清;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**然后**，通过for循环（也可以用for-in，for-of，都行。for-of最简单）给每个新添加到页面中的流星一个随机的位置（top、left）、随机的大小（scale）、随机的动画执行时间（timer）;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**最后**，在for循环中，给每个新添加到页面中的流星加上动画，并通过回调函数在执行完动画后删除节点。这里要注意的是，动画要分成**两个阶段**（**出现**与**消失**，主要是**opacity**控制）。另外我这里的处理，每个流星都移动相同的距离**300px**，这个距离我觉得也可以通过随机数控制，但我犯了个懒，就没有做。

### 3、小问题
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目前我发现的问题有**2个：**<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一是DOM操作本身的问题。页面不停的添加与删除节点，造成不停地**回流与重绘**，很耗性能;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二是requestAnimationFrame本身的问题。因为定时器不断在添加节点，而requestAnimationFrame的特性——**当离开当前页面去浏览其他页面时，动画会暂停**。这就造成了一个问题，**节点一直在加，但动画全停在那没有执行**。那么下次再回到这个页面的时候，就boom!！！动画就炸了，你会看到画面一卡，很多小蝌蚪集体出动去找妈妈;

### 4、结语
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这个小案例虽然从难度上来看很简单，但是它可拓展性很高——比如表个白啊、寄个相思、耍个浪漫啊等等（手动狗头doge），而且用纯CSS也可以实现（我也写了一版纯CSS的，因为不能随机位置随机大小，所以看起来比较静态一点，就不贴了）。所以对于了解CSS动画与JS动画，是个很不错的练手小案例。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢看完这篇文章的可爱的人儿，希望你能从中获得灵感~如果能给你带来帮助，那我是极高兴地~如果你把灵感告诉我，那我就can't happniess anymore了~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最后，再次感谢，如果有优化写法，欢迎指导~
