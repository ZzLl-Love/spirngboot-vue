/**
  基础管理 库存管理
*/
<template>
 <div>
   <audio ref="successSound" id="myAudio">
     <source src="../../assets/mp3/di.mp3">
   </audio>

   <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>库存管理</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 搜索筛选 -->
   <el-form :inline="true"  class="user-search">

     <el-form-item label="搜索：">
       <el-input size="small" v-model="formInline.name" placeholder="输入物品名称"></el-input>
     </el-form-item>
     <el-form-item label="">
       <el-input size="small" v-model="formInline.code" placeholder="输入物品代码"></el-input>
     </el-form-item>
     <el-form-item>
       <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
       <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit">添加</el-button>
     </el-form-item>

    <!--  上传excell    -->
     <el-form-item>
       <el-upload
         ref="upload"
         :multiple="false"
         :show-file-list="false"
         :action="doUpload()"
         :headers="uploadHeaders"
         :on-change =  "handleChange"
       >
         <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
       </el-upload>
     </el-form-item>
     <!-- 下载excel    -->
     <el-form-item>
       <el-button size="small" type="primary" icon="el-icon-download" @click="handleDownload">下载Excel</el-button>
     </el-form-item>


     <!--出库和入库的按钮-->
     <el-form-item>
       <el-button size="small" type="primary" icon="el-icon-arrow-up" @click="showStockDialog('in')">入库</el-button>
       <el-button size="small" type="primary" icon="el-icon-arrow-down" @click="showStockDialog('out')">出库</el-button>
     </el-form-item>
   </el-form>

    <!--物品展示列表
          alarm_value: 1 ,
           localtion: "A库房",
           huojiia: 'c',
           type: 'A型号',
           address: '武汉',
           create_time:"2024年4月20号",
           create_user: '张三',
           update_time: '2024年4月20号',
           update_user: 'root用户',
-->
    <el-table
              size="small"
              :data="stockData"
              :row-style="warnClassName"
              highlight-current-row
              v-loading="loading"
              border element-loading-text="拼命加载中"
              style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="name" label="物品名称" width="100">
      </el-table-column>
      <el-table-column label="产品图片" width="120">

          <el-image
            style="width: 100px; height: 100px; cursor: pointer; position: relative;"
            :src="scope.row.img"
            slot-scope="scope"
            class="click-to-enlarge"
          ></el-image>
      </el-table-column>
      <el-table-column sortable prop="inventory" label="库存值" width="100">
      </el-table-column>
      <el-table-column sortable prop="inventorySum" label="入库总量" width="100">
      </el-table-column>
      <el-table-column sortable prop="inventoryRemove" label="出库总值" width="100">
      </el-table-column>
      <el-table-column sortable prop="alarmValue" label="告警值" width="100">
      </el-table-column>
      <el-table-column sortable prop="localtion" label="库房" width="100">
        <template slot-scope="scope">
          {{ splitLocation(scope.row.localtion)[0] }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="huojia" label="货架" width="120">
        <template slot-scope="scope">
          {{ splitLocation(scope.row.localtion)[1] }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="type" label="型号" width="80">
      </el-table-column>
      <el-table-column sortable prop="address" label="产品地址" width="120">
      </el-table-column>
      <el-table-column sortable prop="createUser" label="创建人" width="100">
      </el-table-column>

      <el-table-column sortable prop="createTime" label="创建时间" width="150">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="updateTime" label="修改时间" width="150">
        <template slot-scope="scope">
          <div>{{scope.row.updateTime|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="updateUser" label="修改人" width="100">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleWarning(scope.$index, scope.row)">设置告警</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteStock(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

   <!-- 编辑界面 -->
   <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
     <el-form label-width="120px"  :model ="editForm" :rules="rules"  ref="editForm" >
       <el-form-item label="物品名称" prop="localtion">
         <el-input size="small"  auto-complete="off" v-model="editForm.name" placeholder="请输入物品信息"></el-input>
       </el-form-item>
       <el-form-item label="库房, 货架" prop="localtion">
         <el-input size="small"  auto-complete="off" v-model="editForm.localtion" placeholder="格式:xx号库房, x号货架 -x层"></el-input>
       </el-form-item>
       <el-form-item label="型号" prop="type">
         <el-input size="small"  auto-complete="off" v-model="editForm.type" placeholder="请输入型号"></el-input>
       </el-form-item>
       <el-form-item label="地址" prop="address">
         <el-input size="small"  auto-complete="off" v-model="editForm.address" placeholder="请输入地址"></el-input>
       </el-form-item>
       <el-form-item label="上传图片">
<!--         :file-list="editForm.imageUrl"-->
<!--         :on-preview="handlePictureCardPreview"-->
<!--         :on-remove="handleRemove"-->
         <el-upload
         list-type="picture-card"
         :before-upload="beforeUploadImage">
         <i class="el-icon-plus"></i>
         </el-upload>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
       <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
     </div>
   </el-dialog>

<!--   告警值弹窗-->
   <el-dialog :title="'设置告警值 - '" :visible.sync="warningFormVisible" width="30%" @click='closeDialog("warning")'>
     <el-form label-width="120px" :model="warnEditForm" ref="warningForm" :rules="rules">
       <el-form-item label="告警值" prop="alarmValue">
         <el-input size="small" auto-complete="off" v-model="warnEditForm.alarmValue" placeholder="请输入告警值"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button size="small" @click='closeDialog("warning")'>取消</el-button>
       <el-button size="small" type="primary" :loading="loading" class="title" @click="subitWarningValue('warnEditForm')">保存</el-button>
     </div>
   </el-dialog>

<!--  出入库弹窗-->
  <el-dialog  :title="stockDialogTitle" :visible.sync="codeShow" width ="70%" @close="stop">
    <!-- 在模板中添加入库表单 -->
    <el-form  ref="outStockForm" :visible.sync="codeShow" inline>
      <el-form-item label="条形码"  style="margin-right: 20px; display: flex; justify-content: center; align-items: center;">
        <video id="video" style="width: 100%; max-height: 400px;" autoplay></video>
        <el-input v-model="barcode" placeholder="扫描条形码" style="width: 500px;" @focus="startScanner"></el-input>
      </el-form-item>
      <!-- 使用表格展示查询到的数据 -->
      <el-table
        size="small"
        :data="depositoryInfo"
        border
        style="width: 100%;">
        <el-table-column prop="barcode" >
<!--          <el-table-column  prop="id" label="id" width="100">-->
<!--          </el-table-column>-->
          <el-table-column  prop="name" label="物品名称" width="100">
          </el-table-column>
          <el-table-column  prop="localtion" label="库房" width="100">
            <template slot-scope="scope">
              {{ splitLocation(scope.row.localtion)[0] }}
            </template>
          </el-table-column>
          <el-table-column  prop="huojia" label="货架" width="120">
            <template slot-scope="scope">
              {{ splitLocation(scope.row.localtion)[1] }}
            </template>
          </el-table-column>
          <el-table-column sortable prop="type" label="型号" width="80">
          </el-table-column>
          <el-table-column sortable prop="inventory" label="库存值" width="100">
          </el-table-column>
          <el-table-column sortable prop="alarmValue" label="告警值" width="100">
          </el-table-column>
          <el-table-column  prop="inventorySum" label="历史入库总量" width="100">
          </el-table-column>
          <el-table-column  prop="inventoryRemove" label="出库总值" width="100">
          </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" width="150">
            <template slot-scope="scope">
              <div>{{scope.row.createTime | timestampToTime}}</div>
            </template>
          </el-table-column>
          <el-table-column sortable prop="updateTime" label="修改时间" width="150">
            <template slot-scope="scope">
              <div>{{scope.row.updateTime|timestampToTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="stockDialogColumnLabel" width="300">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.inNum" :min="1"  @change="handleInStockNum(scope.row)" label="描述文字">
              </el-input-number>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- 其他表格列定义 -->
      </el-table>
    </el-form>
    <!-- 添加提交和取消按钮 -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="codeShow = false">取消</el-button>
    <el-button type="primary" @click="submitInOrOutStock">提交</el-button>
  </span>
  </el-dialog>



 </div>
</template>

<script >

import {
  downExcel,
  stockDel,
  stockList,
  stockSave,
  warnValueUpdate,
  inStock,
  outStock,
  qeuryStockInfo,
} from '../../api/userMG'

import { BrowserMultiFormatReader } from "@zxing/library";



 export default {
   name: 'stock',
   computed: {
    warnClassName(){

      return ({row}) => {
        return  row.alarm === 1 ? {backgroundColor: '#ff9800'} : {}
      }
    },

     uploadHeaders(){
      return { Authorization: this.token}
    }
   },


   data(){

     return {
       title: '添加库存',
       editFormVisible:false, //控制编辑菜单的显示和隐藏
       warningFormVisible: false, // 新增告警值弹窗的可见状态
       loading: false, //是否加载
       stockDialogTitle: '', //控制入库弹窗的标题
       codeShow: false, //控制入库/出库弹窗 显示和隐藏
       codeReader: null, //解码器对象
       stockDialogColumnLabel: '' ,// '入库数量';
       currentOperation: '', //按钮的操作类型 in out


       stockData: [], //初始化库存信息
       depositoryInfo: [], //扫码查询到的库存信息
       changeStockData: [], //入库出库的数据
       barcode: '', //解析后的条形码信息
       inFormList: [], //入库的信息表单
       //弹框中添加的数据
       editForm: {
         id: '',
         name: '', //物品名称
         alarmValue: '', //告警值
         localtion: "",  //库房 +  货架号
         type: '', //型号
         address: '', //地址
         img: '', //产品图片
       },

       //告警弹窗中的数据
       warnEditForm: {
         id: '',
         alarmValue: ''
       },

       url: "http://localhost:8080/product/static/image/324edf21-1189-4b1f-937d-b1d05e4dbca5.png",


       // formInline: {
       //   page: 1,
       //   limit: 10,
       //   varLable: '',
       //   varName: '',
       //   token: localStorage.getItem('logintoken')
       // },

       // rules 表单验证
       rules: {
         localtion: [
           { required: false, message: '请输入库房', trigger: 'blur' }
         ],
         huojia: [
           { required: false, message: '请输入货架号', trigger: 'blur' }
         ],
         type: [
           { required: false, message: '请输入类型', trigger: 'blur' }
         ],
         address: [
           { required: false, message: '请输入地址', trigger: 'blur' }
         ],
         alarmValue: [
           { required: true, message: '请输入告警值', trigger: 'blur' }
         ],
       },

       //搜索数据
       formInline: {
         name: '',
         code: '',
       }

     }
   },


   //生命周期函数  实例被创建 data数据可以访问，但是未挂载dom结构，
   //发送数据 查询所有的库存信息
   created() {
     this.getInitData(this.formInline);
     this.token = localStorage.getItem('logintoken') || '';


   },



   //方法
   methods: {

     /**
      * 上传图片之前
      * @param type
      */
     beforeUploadImage(file){
       return new Promise((resolve, reject) => {
         // 创建一个新的 FileReader 对象
         const reader = new FileReader();

         // 当文件读取完成时触发 onload 事件
         reader.onload = (event) => {
           // 将图片以Base64编码的形式存储到editForm中
           // event.target.result 包含了文件的数据URL，形式如："data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDA..."
           // 我们只需要去掉DataURL的前缀部分（"data:image/jpeg;base64,"），保留base64编码的数据部分
           const base64ImageData = event.target.result.split(',')[1]; // 去掉base64编码头部
           // 将base64编码的图片数据存储到editForm的imageData属性中
           this.editForm.img = base64ImageData;

           // 解析成功，将文件对象传递给resolve
           resolve(file);
         };

         // 使用FileReader对象读取文件内容，并以DataURL的形式返回
         reader.readAsDataURL(file);
       });
     },


     //点击入库/出库按钮
     showStockDialog(type){
      this.codeShow = true
       // 根据按钮类型设置对话框标题和其他需要的数据
       if(type === 'in'){
         //入库
         this.stockDialogTitle = '入库'
         this.stockDialogColumnLabel = "入库数量"
         this.currentOperation = "in"

       }else if(type=== 'out'){
         //出库
         this.stockDialogTitle = '出库'
         this.stockDialogColumnLabel = "出库数量"
         this.currentOperation = "out"
       }

     },

     // 获取input 的输入焦点的时候 调用摄像头开始扫描条形码
     startScanner(){

       // 创建一个媒体流约束对象
       const constraints = {
         video: { facingMode: "environment" } // 指定使用后置摄像头
       };

       // 初始化解码器
       this.codeReader = new BrowserMultiFormatReader();

       // 获取视频流
       navigator.mediaDevices.getUserMedia(constraints)
         .then(stream => {
           // 将视频流绑定到 video 元素上
           const videoElement = document.createElement('video');
           videoElement.srcObject = stream;
           document.body.appendChild(videoElement);

           // 启动解码器，开始扫描条形码
           this.startDecoding(constraints)


         })
         .catch(err => {
           console.error('无法访问摄像头：', err);
         });

     },

     //开始解码操
     startDecoding(constraints){

       this.barcode = '',

       this.codeReader.decodeFromConstraints(constraints, 'video', (result, error) =>{
         if(result){

           //// 初始化布尔变量，表示物品是否已经存在
           let itemExists = false;

           // 扫描条形码得到的id
           let codeId =  result.text.split(":")[1];

           //1.将扫描结果交给data中的barcode

           this.barcode = codeId
           console.log("barcode",this.barcode)
           console.log(this.barcode)


           //2.当拿到条形码的标识信息后 停止重复扫描
           if(this.barcode != null){

             //停止扫描 发送请求
             this.codeReader.reset();
             this.codeReader = null;

           }


          //3.判断物品是否已经存在，存在就把数量加1
          if(this.depositoryInfo.length > 0){
            let find = this.depositoryInfo.find(item=> {
              if (item.id == codeId) {
                //重复扫码，将入库数量+1
                item.inNum+=1
              }
            })

          }


           //4.发送请求 看下当前商品的信息 如果物品已经存在，则不发送请求
           if(!itemExists){
             qeuryStockInfo(this.barcode)
               .then( res =>{
                 if(res.code ===200){

                   //检查是否具有相同的id
                   let existingItemIndex = this.depositoryInfo.findIndex(item => item.id === res.data.id);
                   if(existingItemIndex === -1){
                     // 如果不存在具有相同ID的元素，则将新元素添加到数组中
                     this.depositoryInfo.push(res.data);
                   }
                   //将条形码置为空
                   this.barcode=""
                 }
               })
               .catch(err =>{
                 this.$message.error('物品信息查失败，请稍后再试！')
               })

           }
         }else if(error){
           console.error('解码失败：', error)
         }
       })
     },

    // 关闭弹窗时，把上次录入信息关闭调
     stop(){
       this.depositoryInfo = null;
       this.changeStockData = null
     },


     // 点击修改库存按钮的时候  修改入库数量
     handleInStockNum(row) {
       console.log("我在修改数量")


       const existingItemIndex = this.changeStockData.findIndex(item => item.id === row.id);

       // 物品存在于 changeStockData 中
       if (existingItemIndex !== -1) {
         console.log("物品存在...................")
         this.changeStockData[existingItemIndex].inNum = row.inNum;
       } else {
         // 物品不存在于 changeStockData 中
         console.log("物品不存在...................")
         const stockItem = { id: row.id, inNum: row.inNum };
         this.changeStockData.push(stockItem);
       }

        console.log("this.changeStockData",this.changeStockData)

     },

    //提交出入库操作
     submitInOrOutStock(){
       if(this.currentOperation === "in"){
         console.log("入库操作.....................")
         console.log("error................",this.changeStockData)
         inStock(this.changeStockData)
           .then(res => {
             if (res.code == 200) {
               this.$message({
                 type: 'success',
                 message: res.message
               })
               this.$refs.successSound.play();
               this.codeShow = false;
               this.stop();
               //查询后重新更新页面
               this.getInitData(this.formInline);
             }
           })
           .catch(err => {
             this.loading = false
             this.$message.error('入库失败，请稍后再试！')
           })
       } else if(this.currentOperation === 'out'){
          console.log("出库操作。。。")
         outStock(this.changeStockData)
           .then(res => {
             if (res.code == 200) {
               this.$message({
                 type: 'success',
                 message: res.message
               })
               this.$refs.successSound.play();
               this.codeShow = false;
               this.stop();
               //查询后重新更新页面
               this.getInitData(this.formInline);
             }
           })
           .catch(err => {
             this.loading = false
             this.$message.error('出库失败，请稍后再试！')
           })
       }
     },

     //分割location字段
     splitLocation(location) {
       if (location) {
         return location.split(','); // 通过逗号分隔字符串
       } else {
         return ['', '']; // 如果数据为空，返回一个空数组
       }
     },


     // 查询 库存信息-- 从数据库中查询后端库存数据，并返回
     getInitData(parameter) {

        //调用接口查询所有的库存信息
        stockList(parameter)
          .then(res =>{
            this.loading = false;
            if(res.code === 200){
              this.$message({
                 type: 'success',
                 message: res.message,
              })
              this.stockData = res.data
            }else {
               this.$message({
                 type: 'info',
                 message: res.message
               })
            }
          })
          .catch(err =>{
              this.loading = false;
              this.$message.error("获取库存信息失败，请稍后再试！")
          })
     },

     //搜索 库存
     search(){
        this.getInitData(this.formInline)
     },

     //显示编辑界面，收集添加/修改的数据
     handleEdit(index, row) {

        this.editFormVisible = true;
        if(row != undefined && row != 'undefined'){
          this.title = "修改库存"
          this.editForm.id = row.id
          this.editForm.name = row.name
          this.editForm.localtion = row.localtion
          this.editForm.type = row.type
          this.editForm.address = row.address

        }else{
          this.title = "添加库存"
          this.editForm.id = ""
          this.editForm.name = ""
          this.editForm.localtion = ''
          this.editForm.type= ''
          this.editForm.huojia = ''
          this.editForm.address = ''
        }
     },


     //将编辑界面修改的数据，进行提交  保存按钮  -- 添加 /修改库存
     submitForm(editFormData){
       console.log("2.我准备将编辑的数据进行提交了....")

       this.$refs[editFormData].validate(valid =>{
         if(valid){
           //验证成功 发起请求，走后端逻辑 todo
           console.log("表单数据",this.editForm)
           stockSave(this.editForm)
             .then(res =>{
               this.editFormVisible = false;
               this.loading = false
               if(res.code ===200){
                 this.getInitData(this.formInline)
                 this.$message({
                   type: 'success',
                   message: res.message,
                 })
               }else{
                  this.$message({
                    type: 'info',
                    message: res.message
                  })
               }
             })
             .catch(res =>{
                this.editFormVisible =false;
                this.loading = false;
                this.$message.error("编辑库存信息失败！")
             })

         } else{
           //表单验证失败
           return false
         }
       })

     },

     //删除物品
     deleteStock(index, row) {
       this.$confirm('确定要删除吗?', '信息', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       })
         .then(() => {
           stockDel(row.id)
             .then(res => {
               if (res.code ===200) {
                 this.$message({
                   type: 'success',
                   message: '物品已删除！'
                 })
                 this.getInitData(this.formInline)
               } else {
                 this.$message({
                   type: 'info',
                   message: res.message
                 })
               }
             })
             .catch(err => {
               this.loading = false
               this.$message.error('物品删除失败，请稍后再试！')
             })
         })
         .catch(() => {
           this.$message({
             type: 'info',
             message: '已取消删除'
           })
         })
     },



     //设置告警值
     handleWarning(index, row){
       console.log("row" ,row)
       this.warningFormVisible = true;
       this.warnEditForm.id =row.id
       this.warnEditForm.alarmValue = row.alarmValue
     },


     //将收集到的警告值提交
     subitWarningValue(warnData){
       this.$refs.warningForm.validate(valid =>{
         if(valid){
           //修改警告值
           warnValueUpdate(this.warnEditForm)
             .then(res => {
               this.editFormVisible = false
               this.loading = false
               if (res.code ==200) {
                 this.warningFormVisible = false
                 this.getInitData(this.formInline)
                 this.$message({
                   type: 'success',
                   message: res.message,
                 })
               } else {
                 this.$message({
                   type: 'info',
                   message: res.message
                 })
               }
             })
             .catch(err => {
               this.editFormVisible = false
               this.loading = false
               this.$message.error('警告值修改失败，请稍后再试！')
             })
         }else{
           return false;
         }
       })

     },


     //点击取消关闭弹窗
     closeDialog(dialogType) {
       if (dialogType === 'edit') {
         this.editFormVisible = false;
       } else if (dialogType === 'warning') {
         this.warningFormVisible = false;
       }
     },




     //文件上传
     doUpload(){
      return "http://localhost:8080/product/upload/";
     },

     //上传成功后刷新页面
     handleChange(){
       this.getInitData(this.formInline);
     },

     //下载excel
     handleDownload(){
       downExcel()
         .then(res =>{
            let url = window.URL.createObjectURL(new Blob([res]),{type:"application/vnd.ms-excel"})
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "all_sample_fa_kegg_blast_bst.xls");
            document.body.appendChild(link);
            link.click();
         })
         .catch(err => {
           this.$message.error('下载失败')
         })
     }


   },




 }
</script>


<style  scoped>
</style>

