/**
 * Created by Mr Yang on 2017/6/18.
 * 由于很久没有使用iis搭建本地服务器，所以搭建了基于iis6.0的，记住要添加json后缀名配置
 *
 *
 * 只有钩子函数才会使用"function(){}",其他都是使用"{}"
 * 实例使用和全局使用vm.$http <==> Vue.http this在某种特殊情况下等同于vm实例(在使用this.$nextTick后)，
 * v-for="(item,index) in productList"
 * :src="" <==> v-bind:src=""  绑定属性
 * @click="" <==> v-on:click="" 监听事件
 *
 * 原生js 的[1,2].forEach(function (value,index) { })
 * jquery 的 $.each(function(index,value) {})
 *
 * res => {} 箭头函数中的this默认指向外部函数（es6语法）
 *
 * 过滤器可以分为局部和全局，如果过滤器需要传递参数2.0是使用filterName(parms)
 *
 * v-model双向绑定数据
 * typeof item.checked == "undefined" //判断item.checked是否存在
 *
 * vm.$set()方法是没有属性，但是又需要使用。
 *  全局注册： Vue.set(item, "checked", true) //全局注册item.checked属性
 *  局部注册： this.$set(item, "checked", true) //局部注册item.checked属性
*/


var vm = new Vue({
    el:"#app",
    data:{//数据
        productList:[],
        totalMoney:0,
        checkAllFlag:false,
        delFlag:false,
        curProduct:{}
    },
    mounted:function () {//vue1.0 的ready函数
        this.$nextTick(function () {
            //代码保证this.$el在document中
            this.cartView();//显示数据
        })
    },
    filters:{//局部过滤器使用在 |formatMoney
        formatMoney:function(value){
            return "￥ "+value.toFixed(2);//保留两位小数
        }
    },
    methods:{
        cartView: function () { //显示数据信息
            var _this = this;
            //.then是promise格式回调
            this.$http.get("data/cartData.json").then(res=> {
                //函数内部的this不是指向vm实例
                var obj = JSON.parse(res.body);
                _this.productList = obj.result.list;
               // _this.totalMoney = obj.result.totalMoney
            });
        },
        changeMoney: function (product ,way){ // 商品数量改变
            if(way > 0){
                product.productQuantity++;
            }else{
                var num = product.productQuantity;
                if(num < 2){
                    product.productQuantity = 1;
                }else{
                    product.productQuantity--;
                }
            }
            this.calcTotalMoney();
        },
        selectedProduct: function (item){ //单选中商品
            if(typeof item.checked == 'undefined'){//判断item.checked是否存在
                //Vue.set(item, "checked", true) //全局注册item.checked属性
                this.$set(item, "checked", true) //局部注册item.checked属性
            }else{
                item.checked = !item.checked;
            }
            this.calcTotalMoney();
        },
        checkAll:function (flag) { //全选radio
            this.checkAllFlag = flag;
            var _this = this;
            this.productList.forEach(function(item, index){
                if(typeof item.checked == 'undefined'){//判断item.checked是否存在
                    //Vue.set(item, "checked", true) //全局注册item.checked属性
                    _this.$set(item, "checked", _this.checkAllFlag); //局部注册item.checked属性
                }else{
                    item.checked =  _this.checkAllFlag;
                }
            });
            this.calcTotalMoney();
        },
        calcTotalMoney: function (){//计算总金额
            var _this = this;
            this.totalMoney = 0;
            this.productList.forEach(function(item, index){
                if(item.checked == true){
                    _this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        },
        delConfirm: function (item){ //弹出删除对话框
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct: function (){
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index,1);
            this.delFlag = false;
            this.calcTotalMoney();
        }
    }
});

//全局过滤器
Vue.filter("money",function (value,type){
    return "￥ " + value.toFixed(2) + type;
})