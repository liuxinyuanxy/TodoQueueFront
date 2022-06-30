import DoneCard from './Done'
import * as utils from './utils'
import {Button, Dialog, Affix, Notify} from "zent";
import React from "react";
const { openDialog, closeDialog } = Dialog;

class DoneList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
        }
        this.refresh()
    }
    refresh() {
        utils.Fetch("/api/todo/list/done", "GET").then(res => {
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
                {
                    lists.map((item,index)=> <DoneCard refresher={() => this.refresh()} id={item.ID} title={item.Title} />)
                }
            </>

        )
    }
}

function DonePage() {
    return (
        <div style={{
            margin:"10%",
            marginBottom: "22%",
        }}>
            <DoneList />
        </div>
    )
}

export default DonePage