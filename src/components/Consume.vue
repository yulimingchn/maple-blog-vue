<template>
    <div>
        <el-form :model="consume" :rules="rules" ref="consume" label-width="100px" >
            <el-form-item label="消费名称" prop="name">
                <el-input v-model="consume.name"></el-input>
            </el-form-item>
            <el-form-item label="消费金额" prop="amount">
                <el-input v-model="consume.amount"></el-input>
            </el-form-item>
            <el-form-item label="消费类目" prop="category">
                <el-select v-model="consume.category" placeholder="请选择消费类目">
                    <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.cateName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消费时间" required>
                    <el-form-item prop="date">
                        <el-date-picker type="date" placeholder="选择日期" v-model="consume.date" style="width: 100%;"></el-date-picker>
                    </el-form-item>
            </el-form-item>
            <el-form-item label="消费描述" prop="desc">
                <el-input type="textarea" v-model="consume.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('consume')">提交</el-button>
                <el-button @click="resetForm('consume')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
 import {getRequest} from '../utils/api'
export default {
  data() {
    return {
        categories: [],
      consume: {
        name: "",
        amount:0,
       
        date: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入消费名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请填写消费描述", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
 
