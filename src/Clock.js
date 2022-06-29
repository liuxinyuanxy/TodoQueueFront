import React from 'react';
import { Fetch } from './utils';
import { Button, Notify } from 'zent'
import 'zent/css/index.css';

let qwq = 0;

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
        // console.log("???");

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

    renderClock() {
        let time = this.duration()
        return (
            <div>
                <p className="time">{time.hour + ':' + time.minite + ':' + time.second}</p>
            </div>
        )
    }

    renderStart() {
        return (
            <Button type="primary"
                onClick={() => this.handleStart()}>
                Start
            </Button>
        )
    }

    renderSuspend() {
        return (
            <Button type="primary"
                onClick={() => this.handleSuspend()}>
                Suspend
            </Button>
        )
    }

    renderFinish() {
        return (
            <Button type="primary" outline
                onClick={() => this.handleFinish()}>
                Finish
            </Button>
        )
    }

    renderProgress() {
        const state = this.state
        return (
            <div>
                {this.renderClock()}
            </div>
        )
    }

    render() {
        const pid = this.state.pid
        // console.log(this.state);
        return (
            <div>
                {this.renderProgress()}
                {pid ? this.renderSuspend() : this.renderStart()}
                {pid ? this.renderFinish() : <p />}
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