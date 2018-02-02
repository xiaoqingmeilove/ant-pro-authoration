import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Row, Col, Card, Tree, Button, Select} from 'antd';
import { connect } from 'dva';
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const children = [
    <Option key="add">新增</Option>,
    <Option key="del">删除</Option>,
    <Option key="edit">编辑</Option>
]

@connect(state => ({
    author: state.author,
}))
export default class Author extends PureComponent {
    renderTreeNodes = (menusData) => {
        const { author: { authorArr } } = this.props
        var self = this
        if (!menusData) {
            return [];
          }
        return menusData.map((item) => {
            if (!item.name) {
                return null;
            }
            if (item.children && item.children.some(child => child.name)) {
                return (
                  <TreeNode
                    title={item.name} 
                    key={item.name}
                  >
                    {this.renderTreeNodes(item.children)}
                  </TreeNode>
                );
            }
            if(item.name == "权限配置"){
                return (
                    <TreeNode
                        title={item.name}
                        key={item.name}
                    >
                    </TreeNode>
              ); 
            }
            return (
                    <TreeNode
                        title={
                            <div>
                                <span>{item.name}</span>
                                <Select
                                    style={{ width: 300,marginLeft:10 }}
                                    mode="multiple"
                                    size="small"
                                    value={authorArr?authorArr[item.name]:[]}
                                    onChange={(value)=>self.changeArr(value,item.name)}
                                >
                                    {children}
                                </Select>
                            </div>
                        }
                        key={item.name}
                    >
                    </TreeNode>
              ); 
        })
    }

    changeArr(value,type){
        const temp_arr = this.props.author.authorArr
        temp_arr[type] = value
        console.log("temp",temp_arr)
        this.props.dispatch({
            type: 'author/changeAuthor',
            payload: temp_arr
          });
    }

    onCheck = (checkedKeys,e) => {
        let temp_arr = checkedKeys
        let res_arr = []
        res_arr = temp_arr.concat(e.halfCheckedKeys)
        console.log("cccxxx",res_arr,temp_arr)
        this.props.dispatch({
            type: 'author/fetchSelect',
            payload: {
                currentList:res_arr,
                currentList_server:temp_arr
            }
          });
    }

    onClick = () => {
        this.props.dispatch({
            type: 'author/sendToService',
            payload: {}
          });
    }

    handleChange = (value) => {
        console.log(value)
        this.props.dispatch({
            type: 'author/fetchRole',
            payload: value
          });
    }

    render() {
        const { author: { loading, list, currentList, currentList_server, authorArr } } = this.props
        console.log("currentList",currentList,currentList_server,authorArr)
        return (
            <PageHeaderLayout title="权限配置">
                <Card bordered={false}>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={9} sm={24}>
                            <span>请选择角色：</span>
                            <Select defaultValue="admin" style={{ width: 120 }} onChange={this.handleChange}>
                                <Option value="admin">管理员</Option>
                                <Option value="view">观众</Option>
                            </Select>
                        </Col>
                        <Col md={15} sm={24}>
                            <Tree
                                checkable
                                onCheck={(checkedKeys,e)=>this.onCheck(checkedKeys,e)}
                                checkedKeys = {currentList_server}
                            >
                                {this.renderTreeNodes(list)}
                            </Tree>
                            <Button type="primary" onClick={this.onClick}>提交</Button>
                        </Col>
                    </Row>
                </Card>
            </PageHeaderLayout>
        )
    }

}