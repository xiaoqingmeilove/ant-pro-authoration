import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import React, { PureComponent } from 'react';

class AuthorButton extends PureComponent {
    Click(type){
        this.props.dispatch({
            type: 'global/getState',
            payload: type
        });
        this.props.dispatch({
            type: 'global/sendReceive',
            payload: this.props.Form.getFieldsValue()
        });
    }

    renderButton(){
        let self = this
        const {authoration,currentKey,editState} = this.props;
        const {result} = authoration
        return result[currentKey].map((item) => {
            if (item == "add") {
                return <Button>新增</Button>;
            }
            if(item == "edit"){
                return (
                    <span>
                        <Button type="primary" onClick={()=>self.Click(true)} style={{display:editState?"none":""}}>编辑</Button>
                        <Button type="primary" onClick={()=>self.Click(false)} style={{display:editState?"":"none"}}>保存</Button>
                        <Button onClick={()=>self.Click(false)} style={{display:editState?"":"none"}}>取消</Button>
                    </span>
                );
            }
            if(item == "del"){
                return <Button>删除</Button>;
            }
        })
    }
    render() {
        return(
            <div>
                {this.renderButton()}
            </div>
        )   
    }

}

export default connect(state => ({
    authoration: state.global.authoration,
    currentKey: state.global.currentKey,
    editState: state.global.state,
    main: state
  }))(AuthorButton);
