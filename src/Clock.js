import React from 'react';
import { Fetch } from './utils';
import { Button, Notify, Card } from 'zent'
import 'zent/css/index.css';


const urls = {
    getTodoInfo: '/api/todo/get?id=',
    getProgress: '/api/progress/get',
    startPrgress: '/api/progress/start',
    suspendProgress: '/api/progress/suspend?id=',
    finishProgress: '/api/progress/finish?id='
}

class Progress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: 0,
            todoinfo: {},
            date: new Date()
        };
    }

    componentDidMount() {
        this.refresh()

        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        const state = this.state;
        state.date = new Date();
        this.setState(state);
    }


    refresh = () => {
        // 

        let res = queryProgress()
        res.then((result) => {
            if (result != undefined) {
                this.setState((state) => ({
                    pid: result.id,
                    todoinfo: result,
                    date: state.date
                }))
            }
        })
    }

    handleStart = () => {
        let res = startProgress()
        res.then(() => {
            this.refresh()
        })
    }

    handleSuspend = () => {
        const state = this.state;
        let res = suspendProgress(state.pid)
        res.then((result) => {
            if (result != undefined) {
                this.refresh()
            }
        })
    }

    handleFinish = () => {
        const state = this.state;
        let res = finishProgress(state.pid)
        res.then((result) => {
            if (result != undefined) {
                this.refresh()
            }
        })
    }

    duration() {
        const lastWorkT = this.state.todoinfo.lastWorkT
        if (lastWorkT == undefined) {
            return {
                hour: 0,
                minite: 0,
                second: 0
            };
        }
        let dur = this.state.date - Date.parse(lastWorkT)
        dur = parseInt(dur / 1000);
        return {
            hour: parseInt(dur / 3600),
            minite: parseInt((dur % 3600) / 60),
            second: dur % 60
        }
    }



    renderStart() {
        return (
            <div className="buttons" style={{ "marginLeft": "0%" }}>
                <Button type="primary"
                    block
                    size="large"
                    onClick={() => this.handleStart()}>
                    Start
                </Button>
            </div>
        )
    }

    renderInprogress() {
        return (
            <div className="buttons">
                <Button type="primary"
                    size="large"
                    onClick={() => this.handleSuspend()}>
                    Suspend
                </Button>
                <Button type="primary"
                    size="large"
                    onClick={() => this.handleFinish()}>
                    - Finish -
                </Button>
            </div >
        )
    }

    renderClock() {
        const pid = this.state.pid
        let time = this.duration()
        let title = (pid ? "working" : "take a break")
        return (
            <div id="clock">
                <h2>{title}</h2>
                <div id="time">
                    <div><span id="hour">{PrefixInteger(time.hour, 2)}</span><span>Hours</span></div>
                    <div><span id="min">{PrefixInteger(time.minite, 2)}</span><span>Minutes</span></div>
                    <div><span id="sec">{PrefixInteger(time.second, 2)}</span><span>Seconds</span></div>
                </div>
            </div>
        )
    }

    renderProgress() {
        const todo = this.state.todoinfo
        return (
            <div>
                {this.renderClock()}
            </div >
        )
    }

    render() {
        const pid = this.state.pid
        const todo = this.state.todoinfo
        const status = (todo.estimatedT ? ("预计耗时: " + todo.estimatedT) : "") +
            (todo.ddl ? (" DDL: " + todo.ddl) : "");
        // 
        return (
            <div className="progress">
                {this.renderProgress()}
                {pid ? this.renderInprogress() : this.renderStart()}
                {todo.id ? (
                    <Card title={todo.title}
                        action={status}>
                        {todo.subtasks.map((content, index) => (
                            <div key={index}>
                                {"- " + content}
                            </div>
                        ))}
                    </Card>
                ) : (<></>)}
            </div>
        )
    }

}


async function queryProgress() {

    let res = await Fetch(urls.getProgress, 'GET')
    let jsdata = await res.json()
    if (res.status !== 200) {
        Notify.error(jsdata.Msg);
        return;
    }

    let todoID = jsdata.Msg
    if (todoID == 0) {
        return { id: todoID };
    }

    res = await Fetch(urls.getTodoInfo + todoID, 'GET')
    jsdata = await res.json()
    if (res.status !== 200) {
        Notify.error(jsdata.Msg);
        return { id: todoID };
    }
    let msg = jsdata.Msg
    let ret = {
        id: msg.ID,
        title: msg.Title,
        subtasks: msg.Subtasks.slice(),
        spentT: msg.SpentT,
        estimatedT: msg.EstimatedT,
        lastWorkT: msg.LastWorkT,
        ddl: msg.EstimatedT
    }

    return ret
}

function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

async function startProgress() {
    let res = await Fetch(urls.startPrgress, 'POST')
    let jsdata = await res.json()
    if (res.status !== 200) {
        Notify.error(jsdata.Msg)
        return;
    }
    return jsdata.Msg
}

async function suspendProgress(todoID) {
    let res = await Fetch(urls.suspendProgress + todoID, 'POST')
    let jsdata = await res.json()
    if (res.status !== 200) {
        Notify.error(jsdata.Msg)
        return;
    }
    return 1;
}

async function finishProgress(todoID) {
    let res = await Fetch(urls.finishProgress + todoID, 'POST')
    let jsdata = await res.json()
    if (res.status !== 200) {
        Notify.error(jsdata.Msg)
        return;
    }
    return 1;
}

export default Progress