/**
 * Created by Mr Yang on 2017/6/18.
 *
 *
 * 使用过滤器：
 *
 * 因为本次案例都是本地数据，正常情况下是需要连接数据库进行操作，为了模拟效果，
 * 本地岁获取的数组进行slice或者是splice的数组操作。
 *
 * 此处有个bug,手机端无法调用，后查明原因是前端页面使用sureAddress(address),调用sureAddress方法，
 * 因为address值不存在，所以就无法点击确认修改信息，请注意在页面中尽量不要使用this、
 * :class="{'md-show':delFlag}" 对象属性中是“:”而不是“,”
 */
var vm = new Vue({
    el:".container",
    data:{
        addressList:[],
        limitNum:3,
        currentIndex:0,
        shippingMethod:1,
        isShowOverlay:false, //遮罩显示
        delFlag:false,  //删除地址标识
        detailFlag:false, //编辑地址标识
        curAddress:{} //当前操作地址对象

    },
    mounted:function(){
        this.$nextTick(function () {//ready
            this.getAddressList();
        })
    },
    computed:{ //实时计算属性
        filterAddressList: function () {//限制默认显示3个
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods:{
        getAddressList:function(){
            this.$http.get("data/address.json").then(res => {
                this.addressList = res.body.result; //箭头函数this绑定父级作用域
            });
        },
        loadMore:function (){
            if(this.limitNum == this.addressList.length){
                this.limitNum = 3;
            }else {
                this.limitNum = this.addressList.length;
            }
        },
        setDefault:function (addressId){ //参数为当前addressId
            this.addressList.forEach(function(item,index){//遍历是否默认地址
                if(item.addressId == addressId){
                    item.isDefault = true;
                }else{
                    item.isDefault = false;
                }
            });
        },
        showOverlay:function(status){ //显示遮罩层
            if(status){
                this.isShowOverlay = true;
            }else{
                this.isShowOverlay = false;
            }
        },
        //删除地址
        delConfirm: function (item) {//弹出删除对话框
            this.delFlag = true; //显示删除
            this.showOverlay(true);//显示模态框
            this.curAddress = item;
        },
        cancelDelAddress: function () {//取消删除地址
            this.delFlag = false;
            this.showOverlay(false);
        },
        delAddress: function () {//删除地址
            this.cancelDelAddress();//关闭对话框,此种用法手机端无法起作用
            var index = this.addressList.indexOf(this.curAddress);
            this.addressList.splice(index,1); //删除返回原数组
        },
        //新建、编辑地址
        updateConfirm: function (item) {
            this.curAddress = item;
            this.showOverlay(true);
            this.detailFlag = true;

        },
       sureAddress: function () { //确认编辑、添加地址
           this.cancelAddress();
           var obj = this.curAddress;
           if(obj.addressId){//编辑
               //如果是连接数据库，此处想后端提交一个update方法
               var index = this.addressList.indexOf(this.curAddress);
               this.addressList.splice(index,1,obj);
           }else{
               //如果是连接数据库，此处想后端提交一个add方法，此处未个非空验证，一般页面做验证判断就好、
               obj.addressId = new Date().getTime(); //将当前毫秒数赋值为addressId
               this.addressList.push(obj);
           }
        },
        cancelAddress: function () { //  取消添加/编辑地址和模态框
            this.showOverlay(false);
            this.detailFlag = false;
        }
    }

})