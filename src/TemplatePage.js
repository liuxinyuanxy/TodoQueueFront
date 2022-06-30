import {NewTemplate, TemplateCard} from './Template'
import * as utils from './utils'
import {Button, Dialog, Affix, Notify} from "zent";
import React from "react";
const { openDialog, closeDialog } = Dialog;

function NewTemplateButton(props) {
    return (
        <Affix offsetTop={0}>
            <Button icon={'plus-circle-o'} onClick={() => openDialog({
                dialogId: "NewTemplate",
                title: "新建模板",
                children: <>  <NewTemplate refresher = {() => props.refresher()}/> </>,
                footer : (<> <Button onClick={() => closeDialog("NewTemplate")}>关闭</Button> </>),
                style: {
                    "min-width":"10px",
                }
            })} style={{
                width: "100%",
                background:"white",}}> </Button>
        </Affix>
    )
}

class TemplateList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
        }
        this.refresh()
    }
    refresh() {
        utils.Fetch("/api/template/list", "GET").then(res => {
            if (res.status !== 200)
                res.json().then(res => Notify.error(res.Msg))
            else
                res.json().then(res => {
                    
                    this.setState({list: res.Msg})
                })
        })
    }
    render() {
        const lists = this.state.list
        return (
            <>
                <NewTemplateButton refresher={() => this.refresh()}/>
                {
                    lists.map((item,index)=> <TemplateCard refresher={() => this.refresh()} id={item.ID} title={item.Title} />)
                }
            </>

        )
    }
}

function TemplatePage() {
    return (
        <div style={{
            margin:"10%",
            marginBottom: "22%",
        }}>
            <TemplateList />
        </div>
    )
}

export default TemplatePage