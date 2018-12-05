<template>
  <el-container>
    <el-header class="consume_mana_header">
      <el-input
        placeholder="请输入消费名称"
        v-model="cateName" style="width: 200px;">
      </el-input>
      <el-button type="primary" size="medium" style="margin-left: 10px" @click="addNewConsume(0)">新增记录</el-button>
    </el-header>
    <el-main class="consume_mana_main">
         <!--弹窗，新增、修改 -->
    <consume v-if="addVisiale" ref="consume"></consume>
      <el-table
        ref="multipleTable"
        :data="consumes"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column
          type="selection"
          width="55" align="left">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="消费名称"
          prop="consumeName"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="消费金额"
          prop="consumeAmount"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          prop="consumeDate"
          label="消费时间" width="120" align="left">
          <template slot-scope="scope">{{ scope.row.consumeDate | formatDate}}</template>
        </el-table-column>
        <el-table-column
          label="消费分类"
          prop="categoryName"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="消费描述"
          prop="consumeDesc"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="120" align="left">
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" :disabled="this.selItems.length==0" style="margin-top: 10px;width: 100px;"
                 @click="deleteAll" v-if="this.categories.length>0">批量删除
      </el-button>
      <span></span>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount" @current-change="currentChange" v-show="this.consumes.length>0">
      </el-pagination>
    </el-main>
  </el-container>
</template>
<script>
    import consume from '@/components/consume'
    import {postRequest} from '../utils/api'
    import {putRequest} from '../utils/api'
    import {deleteRequest} from '../utils/api'
    import {getRequest} from '../utils/api'
  export default{
      components:{
        'consume':consume
    },
    methods: {
          searchClick(){
        this.loadConsumes(1, this.pageSize);
      },
      addNewConsume(id){
        var _this = this;
        _this.addVisiale = true
        _this.$nextTick(()=>{
            _this.$refs.consume.init(id)
        })
      },
      deleteAll(){
        var _this = this;
        this.$confirm('确认删除这 ' + this.selItems.length + ' 条数据?', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=> {
          var selItems = _this.selItems;
          var ids = '';
          for (var i = 0; i < selItems.length; i++) {
            ids += selItems[i].id + ",";
          }
          _this.deleteCate(ids.substring(0, ids.length - 1));
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
       //翻页
      currentChange(currentPage){
        this.currentPage = currentPage;
        this.loading = true;
        this.loadConsumes(currentPage, this.pageSize);
      },
      handleSelectionChange(val) {
        this.selItems = val;
      },
      handleEdit(index, row){
        var _this = this;
        this.$prompt('请输入新名称', '编辑', {
          confirmButtonText: '更新',
          inputValue: row.cateName,
          cancelButtonText: '取消'
        }).then(({value}) => {
          //value就是输入值
          if (value == null || value.length == 0) {
            _this.$message({
              type: 'info',
              message: '数据不能为空!'
            });
          } else {
            _this.loading = true;
            putRequest("/admin/category/", {id: row.id, cateName: value}).then(resp=> {
              var json = resp.data;
              _this.$message({
                type: json.status,
                message: json.msg
              });
              _this.refresh();
            }, resp=> {
              if (resp.response.status == 403) {
                _this.$message({
                  type: 'error',
                  message: resp.response.data
                });
              }
              _this.loading = false;
            });
          }
        });
      },
      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.cateName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteConsume(row.id);
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      deleteConsume(ids){
        var _this = this;
        this.loading = true;
        //删除
        deleteRequest("/admin/consume/" + ids).then(resp=> {
          var json = resp.data;
          _this.$message({
            type: json.status,
            message: json.msg
          });
          currentChange(currentPage);
        }, resp=> {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({
              type: 'error',
              message: resp.response.data
            });
          } else if (resp.response.status == 500) {
            _this.$message({
              type: 'error',
              message: '服务器错误，删除失败!'
            });
          }
        })
      },
       loadConsumes(page, count){
        var _this = this;
        var  url = "/admin/consume/all" + "?page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        getRequest(url).then(resp=> {
          _this.loading = false;
          if (resp.status == 200) {
            _this.consumes = resp.data.consumes;
            _this.totalCount=resp.data.totalCount;
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp=> {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }).catch(resp=> {
          //压根没见到服务器
          _this.loading = false;
          _this.$message({type: 'error', message: '数据加载失败!'});
        })
      },
    },
    mounted: function () {
      this.loading = true;
      this.loadConsumes(1, this.pageSize);
      var _this = this;
       window.bus.$on('consumeTableReload', function () {
        _this.loading = true;
        _this.loadConsumes(_this.currentPage, _this.pageSize);
      })
    },
    data(){
      return {
        cateName: '',
        selItems: [],
        categories: [],
        consumes:[],
        currentPage: 1,
        totalCount: -1,
        pageSize: 10,
        keywords: '',
        loading: false,
        addVisiale:false
      }
    }
  }
</script>
<style>
  .consume_mana_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .consume_mana_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>
